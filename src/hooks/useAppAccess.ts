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
      // Check for direct app subscription OR ecosystem subscription
      const { data: subs, error } = await supabase
        .from("user_subscriptions")
        .select("status, subscription_status, expires_at, app_key")
        .eq("user_id", user!.id)
        .in("app_key", [appKey!, "ecosystem"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!subs || subs.length === 0) {
        return { hasAccess: false, status: "no_subscription" };
      }

      // Check if any subscription (direct or ecosystem) is active
      for (const sub of subs) {
        const subStatus = sub.subscription_status || sub.status;

        if (subStatus === "active") {
          if (!sub.expires_at || new Date(sub.expires_at) >= new Date()) {
            return { hasAccess: true, status: "active" };
          }
        }
      }

      // Return the most relevant inactive status
      const sub = subs[0];
      const subStatus = sub.subscription_status || sub.status;

      if (subStatus === "cancelled") return { hasAccess: false, status: "cancelled" };
      if (subStatus === "suspended" || subStatus === "overdue") return { hasAccess: false, status: "suspended" };
      if (sub.expires_at && new Date(sub.expires_at) < new Date()) return { hasAccess: false, status: "expired" };

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
