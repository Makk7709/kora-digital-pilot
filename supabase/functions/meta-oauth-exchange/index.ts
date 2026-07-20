import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GRAPH = "https://graph.facebook.com/v21.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing Authorization" }, 401);

    const { code, redirect_uri, provider } = await req.json();
    if (!code || !redirect_uri || !provider) {
      return json({ error: "Missing code, redirect_uri or provider" }, 400);
    }
    if (provider !== "facebook" && provider !== "instagram") {
      return json({ error: `Unsupported provider: ${provider}` }, 400);
    }

    const appId = Deno.env.get("META_APP_ID");
    const appSecret = Deno.env.get("META_APP_SECRET");
    if (!appId || !appSecret) return json({ error: "Meta credentials not configured" }, 500);

    // Auth user
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    // 1. Exchange code -> short-lived user access token
    const tokenUrl = new URL(`${GRAPH}/oauth/access_token`);
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirect_uri);
    tokenUrl.searchParams.set("code", code);
    const tokenRes = await fetch(tokenUrl.toString());
    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      console.error("Meta token error", tokenRes.status, tokenText);
      return json({ error: "Token exchange failed", details: tokenText }, tokenRes.status);
    }
    const tokenJson = JSON.parse(tokenText);
    const shortToken: string = tokenJson.access_token;

    // 2. Exchange short-lived -> long-lived (~60 days)
    const llUrl = new URL(`${GRAPH}/oauth/access_token`);
    llUrl.searchParams.set("grant_type", "fb_exchange_token");
    llUrl.searchParams.set("client_id", appId);
    llUrl.searchParams.set("client_secret", appSecret);
    llUrl.searchParams.set("fb_exchange_token", shortToken);
    const llRes = await fetch(llUrl.toString());
    const llText = await llRes.text();
    const llJson = llRes.ok ? JSON.parse(llText) : { access_token: shortToken, expires_in: 3600 };
    const accessToken: string = llJson.access_token;
    const expiresIn: number = llJson.expires_in ?? 5184000;
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // 3. Fetch profile
    const meRes = await fetch(
      `${GRAPH}/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`,
    );
    const meText = await meRes.text();
    if (!meRes.ok) {
      console.error("Meta /me error", meRes.status, meText);
      return json({ error: "Profile fetch failed", details: meText }, meRes.status);
    }
    const me = JSON.parse(meText);

    const serviceClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let displayName = me.name;
    let handle: string | null = me.email ?? null;
    let avatar: string | null = me.picture?.data?.url ?? null;
    let providerAccountId: string = me.id;
    let metadata: Record<string, unknown> = { profile: me };

    // 4. If Instagram, resolve linked IG Business account via Pages
    if (provider === "instagram") {
      const pagesRes = await fetch(
        `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${encodeURIComponent(accessToken)}`,
      );
      const pagesText = await pagesRes.text();
      if (!pagesRes.ok) {
        console.error("Meta /me/accounts error", pagesRes.status, pagesText);
        return json(
          {
            error:
              "Impossible de lister vos Pages Facebook. Vérifiez que vous avez au moins une Page liée à un compte Instagram Business/Creator.",
            details: pagesText,
          },
          400,
        );
      }
      const pagesJson = JSON.parse(pagesText);
      const pageWithIg = (pagesJson.data ?? []).find(
        (p: { instagram_business_account?: { id: string } }) => p.instagram_business_account?.id,
      );
      if (!pageWithIg) {
        return json(
          {
            error:
              "Aucun compte Instagram Business/Creator lié à une de vos Pages Facebook. Liez-le dans les paramètres Facebook puis réessayez.",
          },
          400,
        );
      }
      const igId = pageWithIg.instagram_business_account.id;
      const igRes = await fetch(
        `${GRAPH}/${igId}?fields=id,username,name,profile_picture_url&access_token=${encodeURIComponent(pageWithIg.access_token)}`,
      );
      const igText = await igRes.text();
      if (!igRes.ok) {
        console.error("Meta IG error", igRes.status, igText);
        return json({ error: "Instagram fetch failed", details: igText }, igRes.status);
      }
      const ig = JSON.parse(igText);
      providerAccountId = ig.id;
      displayName = ig.name ?? ig.username;
      handle = ig.username ? `@${ig.username}` : handle;
      avatar = ig.profile_picture_url ?? avatar;
      metadata = {
        profile: me,
        instagram: ig,
        page: { id: pageWithIg.id, name: pageWithIg.name, access_token: pageWithIg.access_token },
      };
    }

    const { error: upsertError } = await serviceClient.from("social_accounts").upsert(
      {
        user_id: userId,
        provider,
        provider_account_id: providerAccountId,
        account_name: displayName,
        account_handle: handle,
        avatar_url: avatar,
        access_token: accessToken,
        token_expires_at: expiresAt,
        scopes: [],
        metadata,
        is_active: true,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider,provider_account_id" },
    );

    if (upsertError) {
      console.error("Upsert error", upsertError);
      return json({ error: "DB upsert failed", details: upsertError.message }, 500);
    }

    return json({
      success: true,
      profile: { name: displayName, handle, avatar_url: avatar, provider },
    });
  } catch (e) {
    console.error("Unexpected error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}