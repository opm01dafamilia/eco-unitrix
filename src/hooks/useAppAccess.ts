import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AppAccessResult {
  hasAccess: boolean;
  status: "active" | "expired" | "cancelled" | "suspended" | "no_subscription";
}

export function useAppAccess(appKey?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["app-access", user?.id, appKey],
    queryFn: async (): Promise<AppAccessResult> => {
      // Check user_subscriptions for an active subscription for this app_key
      const { data: subs, error } = await supabase
        .from("user_subscriptions")
        .select("status, subscription_status, expires_at")
        .eq("user_id", user!.id)
        .eq("app_key", appKey!)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!subs || subs.length === 0) {
        return { hasAccess: false, status: "no_subscription" };
      }

      const sub = subs[0];
      const subStatus = sub.subscription_status || sub.status;

      if (subStatus === "cancelled") {
        return { hasAccess: false, status: "cancelled" };
      }

      if (subStatus === "suspended" || subStatus === "overdue") {
        return { hasAccess: false, status: "suspended" };
      }

      // Check expiration
      if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
        return { hasAccess: false, status: "expired" };
      }

      if (subStatus === "active") {
        return { hasAccess: true, status: "active" };
      }

      return { hasAccess: false, status: "no_subscription" };
    },
    enabled: !!user && !!appKey,
  });
}

export async function logAccessEvent(
  eventType: string,
  description: string
) {
  await supabase.from("system_logs").insert({
    event_type: eventType,
    description,
  });
}
