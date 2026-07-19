import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing Authorization" }, 401);
    }

    const { code, redirect_uri } = await req.json();
    if (!code || !redirect_uri) {
      return json({ error: "Missing code or redirect_uri" }, 400);
    }

    const clientId = Deno.env.get("LINKEDIN_CLIENT_ID");
    const clientSecret = Deno.env.get("LINKEDIN_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      return json({ error: "LinkedIn credentials not configured" }, 500);
    }

    // Auth user from JWT
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userId = userData.user.id;

    // Exchange code for token
    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri,
      client_id: clientId,
      client_secret: clientSecret,
    });
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody.toString(),
    });
    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      console.error("LinkedIn token error", tokenRes.status, tokenText);
      return json({ error: "Token exchange failed", details: tokenText }, tokenRes.status);
    }
    const tokenJson = JSON.parse(tokenText);
    const accessToken: string = tokenJson.access_token;
    const expiresIn: number = tokenJson.expires_in ?? 5184000;
    const scope: string = tokenJson.scope ?? "openid profile email";

    // Fetch user profile via OIDC userinfo
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profileText = await profileRes.text();
    if (!profileRes.ok) {
      console.error("LinkedIn userinfo error", profileRes.status, profileText);
      return json({ error: "Profile fetch failed", details: profileText }, profileRes.status);
    }
    const profile = JSON.parse(profileText);

    // Service-role client to upsert
    const serviceClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const { error: upsertError } = await serviceClient
      .from("social_accounts")
      .upsert(
        {
          user_id: userId,
          provider: "linkedin",
          provider_account_id: profile.sub,
          account_name: profile.name ?? `${profile.given_name ?? ""} ${profile.family_name ?? ""}`.trim(),
          account_handle: profile.email ?? null,
          avatar_url: profile.picture ?? null,
          access_token: accessToken,
          token_expires_at: expiresAt,
          scopes: scope.split(" "),
          metadata: profile,
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
      profile: {
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
      },
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