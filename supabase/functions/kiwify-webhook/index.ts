import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Map product names from Kiwify to app_keys
const PRODUCT_APP_MAP: Record<string, string> = {
  fitpulse: "fitpulse",
  financeflow: "financeflow",
  marketflow: "marketflow",
  "ia agenda": "ia_agenda",
  "whatsapp auto": "whatsapp_auto",
};

function resolveAppKey(productName: string): string | null {
  const normalized = productName.toLowerCase().trim();
  // Direct match
  if (PRODUCT_APP_MAP[normalized]) return PRODUCT_APP_MAP[normalized];
  // Partial match
  for (const [key, value] of Object.entries(PRODUCT_APP_MAP)) {
    if (normalized.includes(key)) return value;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    // Validate webhook token
    const webhookToken = Deno.env.get("KIWIFY_WEBHOOK_TOKEN");
    const signature = req.headers.get("x-kiwify-signature") ||
      body?.signature || body?.webhook_token;

    if (webhookToken && signature !== webhookToken) {
      console.error("Invalid webhook token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Extract event data from Kiwify payload
    const eventType = body?.order_status || body?.event;
    const customerEmail = body?.Customer?.email || body?.customer?.email;
    const productName = body?.Product?.name || body?.product?.name || "";

    console.log("Webhook received:", { eventType, customerEmail, productName });

    // Log webhook event
    const logWebhook = async (status: string) => {
      await supabase.from("webhook_logs").insert({
        event_type: eventType,
        product_name: productName,
        customer_email: customerEmail,
        status,
        raw_payload: body,
      });
    };

    const logSystem = async (event: string, desc: string) => {
      await supabase.from("system_logs").insert({
        event_type: event,
        description: desc,
      });
    };

    if (!customerEmail) {
      await logWebhook("error");
      await logSystem("webhook_error", "Customer email not found in webhook payload");
      return new Response(
        JSON.stringify({ error: "Customer email not found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const appKey = resolveAppKey(productName);
    if (!appKey) {
      console.error("Could not resolve app_key for product:", productName);
      await logWebhook("error");
      await logSystem("product_mapping_error", `Product not mapped: ${productName}`);
      return new Response(
        JSON.stringify({ error: "Product not mapped to any app" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Find user by email
    const { data: userData, error: userError } = await supabase.auth.admin
      .listUsers();
    if (userError) throw userError;

    const user = userData.users.find((u) =>
      u.email?.toLowerCase() === customerEmail.toLowerCase()
    );
    if (!user) {
      console.error("User not found for email:", customerEmail);
      await logWebhook("error");
      await logSystem("user_not_found", `User not found for email: ${customerEmail}`);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const userId = user.id;

    // Find plan
    const { data: plans } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("app_key", appKey)
      .eq("status", "active")
      .limit(1);

    const planId = plans?.[0]?.id;
    if (!planId) {
      await logWebhook("error");
      await logSystem("plan_not_found", `No active plan found for app: ${appKey}`);
      return new Response(
        JSON.stringify({ error: "No active plan found for app" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Handle events
    switch (eventType) {
      case "paid":
      case "approved":
      case "compra_aprovada": {
        // Create subscription
        await supabase.from("user_subscriptions").upsert(
          {
            user_id: userId,
            plan_id: planId,
            app_key: appKey,
            subscription_status: "active",
            status: "active",
            started_at: new Date().toISOString(),
            expires_at: null,
          },
          { onConflict: "user_id,plan_id" },
        );

        // Grant access
        await supabase.from("user_app_access").upsert(
          {
            user_id: userId,
            app_key: appKey,
            access_status: "active",
          },
          { onConflict: "user_id,app_key" },
        );
        await logWebhook("success");
        await logSystem("access_granted", `Access granted to ${appKey} for user ${customerEmail}`);
        console.log("Access granted:", { userId, appKey });
        break;
      }

      case "assinatura_renovada": {
        const newExpiry = new Date();
        newExpiry.setMonth(newExpiry.getMonth() + 1);

        await supabase
          .from("user_subscriptions")
          .update({
            subscription_status: "active",
            status: "active",
            expires_at: newExpiry.toISOString(),
          })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        await supabase
          .from("user_app_access")
          .update({ access_status: "active" })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        await logWebhook("success");
        await logSystem("subscription_renewed", `Subscription renewed for ${appKey} - user ${customerEmail}`);
        console.log("Subscription renewed:", { userId, appKey });
        break;
      }

      case "assinatura_cancelada": {
        await supabase
          .from("user_subscriptions")
          .update({ subscription_status: "cancelled", status: "cancelled" })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        await supabase
          .from("user_app_access")
          .update({ access_status: "inactive" })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        console.log("Subscription cancelled:", { userId, appKey });
        break;
      }

      case "assinatura_atrasada": {
        await supabase
          .from("user_subscriptions")
          .update({ subscription_status: "expired", status: "expired" })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        await supabase
          .from("user_app_access")
          .update({ access_status: "inactive" })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        console.log("Subscription suspended:", { userId, appKey });
        break;
      }

      case "refunded":
      case "reembolso": {
        await supabase
          .from("user_subscriptions")
          .update({ subscription_status: "cancelled", status: "cancelled" })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        await supabase
          .from("user_app_access")
          .update({ access_status: "inactive" })
          .eq("user_id", userId)
          .eq("app_key", appKey);

        console.log("Refund processed:", { userId, appKey });
        break;
      }

      default:
        console.log("Unhandled event type:", eventType);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
