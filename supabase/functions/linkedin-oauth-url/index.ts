import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { redirect_uri, state } = await req.json();
    if (!redirect_uri || !state) {
      return json({ error: "Missing redirect_uri or state" }, 400);
    }
    const clientId = Deno.env.get("LINKEDIN_CLIENT_ID");
    if (!clientId) return json({ error: "LINKEDIN_CLIENT_ID not set" }, 500);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri,
      state,
      scope: "openid profile email",
    });
    return json({
      url: `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`,
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