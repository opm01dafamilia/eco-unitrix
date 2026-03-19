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
      console.error("Missing params:", { sso_token: !!sso_token, app_key: !!app_key });
      return new Response(
        JSON.stringify({ valid: false, error: "sso_token and app_key required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Validate SSO: app=${app_key}, token=${sso_token.substring(0, 8)}...`);

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // First try: find unused token
    let { data: tokenRow, error } = await adminClient
      .from("sso_tokens")
      .select("*")
      .eq("token", sso_token)
      .eq("app_key", app_key)
      .eq("used", false)
      .maybeSingle();

    // Grace period: if no unused token found, check for recently-used token (within 60s)
    if (!tokenRow) {
      const graceTime = new Date(Date.now() - 60 * 1000).toISOString();
      const { data: recentlyUsed } = await adminClient
        .from("sso_tokens")
        .select("*")
        .eq("token", sso_token)
        .eq("app_key", app_key)
        .eq("used", true)
        .gte("used_at", graceTime)
        .maybeSingle();

      if (recentlyUsed) {
        console.log(`Grace period hit: token was used ${recentlyUsed.used_at}, still valid`);
        tokenRow = recentlyUsed;
        // Skip marking as used again since it already is
      }
    }

    if (error || !tokenRow) {
      console.error(`Token not found: app=${app_key}, token=${sso_token.substring(0, 8)}..., error=${error?.message}`);
      await adminClient.from("system_logs").insert({
        event_type: "sso_validation_failed",
        description: `Token SSO inválido ou já usado para app ${app_key} (token: ${sso_token.substring(0, 8)}...)`,
      });
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    if (new Date(tokenRow.expires_at) < new Date()) {
      console.error(`Token expired: expires_at=${tokenRow.expires_at}, now=${new Date().toISOString()}`);
      if (!tokenRow.used) {
        await adminClient
          .from("sso_tokens")
          .update({ used: true, used_at: new Date().toISOString() })
          .eq("id", tokenRow.id);
      }

      await adminClient.from("system_logs").insert({
        event_type: "sso_token_expired",
        description: `Token SSO expirado para ${tokenRow.user_email} -> ${app_key}`,
      });

      return new Response(
        JSON.stringify({ valid: false, error: "Token expired" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as used (only if not already used)
    if (!tokenRow.used) {
      await adminClient
        .from("sso_tokens")
        .update({ used: true, used_at: new Date().toISOString() })
        .eq("id", tokenRow.id);
    }

    // Fetch user profile for richer session data
    const { data: profile } = await adminClient
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", tokenRow.user_id)
      .maybeSingle();

    // Determine current access type
    let accessType = "unknown";
    const now = new Date().toISOString();

    const { data: lifetime } = await adminClient
      .from("lifetime_access")
      .select("id")
      .eq("user_id", tokenRow.user_id)
      .maybeSingle();

    if (lifetime) {
      accessType = "lifetime";
    } else {
      const { data: trials } = await adminClient
        .from("free_trials")
        .select("trial_type, app_key, expires_at")
        .eq("user_id", tokenRow.user_id)
        .eq("status", "active")
        .gte("expires_at", now);

      const trialMatch = trials?.some(
        (t) => t.trial_type === "all_apps" || t.app_key === app_key
      );

      if (trialMatch) {
        accessType = "trial";
      } else {
        const { data: subs } = await adminClient
          .from("user_subscriptions")
          .select("subscription_status, status, expires_at, app_key")
          .eq("user_id", tokenRow.user_id)
          .in("app_key", [app_key, "ecosystem"]);

        const activeSub = subs?.find((s) => {
          const st = s.subscription_status || s.status;
          return st === "active" && (!s.expires_at || new Date(s.expires_at) >= new Date());
        });

        if (activeSub) {
          accessType = "paid";
        }
      }
    }

    // Log success
    console.log(`SSO validated: ${tokenRow.user_email} -> ${app_key} (${accessType})`);
    await adminClient.from("system_logs").insert({
      event_type: "sso_login_success",
      description: `Login SSO bem-sucedido: ${tokenRow.user_email} -> ${app_key} (${accessType})`,
    });

    return new Response(
      JSON.stringify({
        valid: true,
        user_id: tokenRow.user_id,
        user_email: tokenRow.user_email,
        user_name: profile?.full_name || null,
        user_avatar: profile?.avatar_url || null,
        app_key: tokenRow.app_key,
        access_type: accessType,
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
