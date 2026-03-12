import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sso_token, app_key } = await req.json();

    if (!sso_token || !app_key) {
      return new Response(
        JSON.stringify({ valid: false, error: "sso_token and app_key required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find token
    const { data: tokenRow, error } = await adminClient
      .from("sso_tokens")
      .select("*")
      .eq("token", sso_token)
      .eq("app_key", app_key)
      .eq("used", false)
      .maybeSingle();

    if (error || !tokenRow) {
      await adminClient.from("system_logs").insert({
        event_type: "sso_validation_failed",
        description: `Token SSO inválido ou já usado para app ${app_key}`,
      });
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    if (new Date(tokenRow.expires_at) < new Date()) {
      await adminClient
        .from("sso_tokens")
        .update({ used: true, used_at: new Date().toISOString() })
        .eq("id", tokenRow.id);

      await adminClient.from("system_logs").insert({
        event_type: "sso_token_expired",
        description: `Token SSO expirado para ${tokenRow.user_email} -> ${app_key}`,
      });

      return new Response(
        JSON.stringify({ valid: false, error: "Token expired" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as used
    await adminClient
      .from("sso_tokens")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("id", tokenRow.id);

    // Log success
    await adminClient.from("system_logs").insert({
      event_type: "sso_login_success",
      description: `Login SSO bem-sucedido: ${tokenRow.user_email} -> ${app_key}`,
    });

    return new Response(
      JSON.stringify({
        valid: true,
        user_id: tokenRow.user_id,
        user_email: tokenRow.user_email,
        app_key: tokenRow.app_key,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ valid: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
