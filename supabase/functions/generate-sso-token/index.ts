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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to get user from token
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    
    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email || "";

    const { app_key } = await req.json();
    if (!app_key) {
      return new Response(JSON.stringify({ error: "app_key required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`SSO request: user=${userEmail}, app=${app_key}`);

    // ── Check access using ALL methods ──

    // 1. Lifetime access
    const { data: lifetime } = await adminClient
      .from("lifetime_access")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let hasAccess = !!lifetime;
    let accessType = lifetime ? "lifetime" : "none";

    // 2. Active free trial (all_apps or specific app)
    if (!hasAccess) {
      const now = new Date().toISOString();
      const { data: trials } = await adminClient
        .from("free_trials")
        .select("trial_type, app_key")
        .eq("user_id", userId)
        .eq("status", "active")
        .gte("expires_at", now);

      if (trials && trials.length > 0) {
        const trialMatch = trials.some(
          (t) => t.trial_type === "all_apps" || t.app_key === app_key
        );
        if (trialMatch) {
          hasAccess = true;
          accessType = "trial";
        }
      }
    }

    // 3. Active subscription (ecosystem or specific app)
    if (!hasAccess) {
      const { data: subs } = await adminClient
        .from("user_subscriptions")
        .select("subscription_status, status, expires_at, app_key")
        .eq("user_id", userId)
        .in("app_key", [app_key, "ecosystem"]);

      if (subs) {
        for (const sub of subs) {
          const st = sub.subscription_status || sub.status;
          if (st === "active" && (!sub.expires_at || new Date(sub.expires_at) >= new Date())) {
            hasAccess = true;
            accessType = "paid";
            break;
          }
        }
      }
    }

    if (!hasAccess) {
      console.log(`Access denied: ${userEmail} -> ${app_key}`);
      await adminClient.from("system_logs").insert({
        event_type: "sso_access_denied",
        description: `Acesso negado ao SSO: ${userEmail} -> ${app_key} (sem acesso ativo)`,
      });
      return new Response(JSON.stringify({ error: "No access" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Generate SSO token ──
    const ssoToken = crypto.randomUUID() + "-" + crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Cleanup old tokens for this user/app
    await adminClient
      .from("sso_tokens")
      .delete()
      .eq("user_id", userId)
      .eq("app_key", app_key);

    const { error: insertError } = await adminClient.from("sso_tokens").insert({
      token: ssoToken,
      user_id: userId,
      user_email: userEmail,
      app_key,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to generate token" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`SSO token generated: ${userEmail} -> ${app_key} (${accessType})`);

    await adminClient.from("system_logs").insert({
      event_type: "sso_token_generated",
      description: `SSO token gerado para ${userEmail} -> ${app_key} (acesso: ${accessType})`,
    });

    return new Response(
      JSON.stringify({ sso_token: ssoToken, expires_at: expiresAt, access_type: accessType }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
