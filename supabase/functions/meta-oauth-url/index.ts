import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SCOPES: Record<string, string> = {
  facebook: "public_profile,email,pages_show_list,pages_read_engagement",
  instagram:
    "public_profile,email,pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { redirect_uri, state, provider } = await req.json();
    if (!redirect_uri || !state || !provider) {
      return json({ error: "Missing redirect_uri, state or provider" }, 400);
    }
    if (!SCOPES[provider]) {
      return json({ error: `Unsupported provider: ${provider}` }, 400);
    }
    const clientId = Deno.env.get("META_APP_ID");
    if (!clientId) return json({ error: "META_APP_ID not set" }, 500);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri,
      state,
      scope: SCOPES[provider],
      auth_type: "rerequest",
    });
    return json({
      url: `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}