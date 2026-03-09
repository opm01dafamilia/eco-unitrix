import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AccessType = "lifetime" | "paid" | "trial" | "inactive";

export interface AppAccessResult {
  hasAccess: boolean;
  status: "active" | "expired" | "cancelled" | "suspended" | "no_subscription";
  accessType?: AccessType;
}

export function useAppAccess(appKey?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["app-access", user?.id, appKey],
    queryFn: async (): Promise<AppAccessResult> => {
      // 1. Check lifetime access
      const { data: lifetime } = await supabase
        .from("lifetime_access")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (lifetime) {
        return { hasAccess: true, status: "active", accessType: "lifetime" };
      }

      // 2. Check active free trial
      const { data: trials } = await supabase
        .from("free_trials")
        .select("*")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString());

      if (trials && trials.length > 0) {
        const hasTrialAccess = trials.some(
          (t) => t.trial_type === "all_apps" || t.app_key === appKey
        );
        if (hasTrialAccess) {
          return { hasAccess: true, status: "active", accessType: "trial" };
        }
      }

      // 3. Check subscriptions
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

      for (const sub of subs) {
        const subStatus = sub.subscription_status || sub.status;
        if (subStatus === "active") {
          if (!sub.expires_at || new Date(sub.expires_at) >= new Date()) {
            return { hasAccess: true, status: "active", accessType: "paid" };
          }
        }
      }

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

export async function logAccessEvent(eventType: string, description: string) {
  await supabase.from("system_logs").insert({ event_type: eventType, description });
}
