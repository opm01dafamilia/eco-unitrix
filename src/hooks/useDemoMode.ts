import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useDemoMode() {
  const { user } = useAuth();

  const { data: hasActivePlan, isLoading } = useQuery({
    queryKey: ["demo-mode-check", user?.id],
    queryFn: async () => {
      // Check active subscription
      const { data: subs } = await supabase
        .from("user_subscriptions")
        .select("id, subscription_status, expires_at")
        .eq("user_id", user!.id)
        .eq("subscription_status", "active");

      const hasActiveSub = (subs ?? []).some(
        (s) => !s.expires_at || new Date(s.expires_at) >= new Date()
      );
      if (hasActiveSub) return true;

      // Check lifetime access
      const { data: lifetime } = await supabase
        .from("lifetime_access")
        .select("id")
        .eq("user_id", user!.id)
        .limit(1);

      if (lifetime && lifetime.length > 0) return true;

      // Check active free trial
      const { data: trials } = await supabase
        .from("free_trials")
        .select("id")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString())
        .limit(1);

      if (trials && trials.length > 0) return true;

      return false;
    },
    enabled: !!user,
    staleTime: 30000,
  });

  return {
    isDemo: !isLoading && !hasActivePlan,
    isLoading,
  };
}
