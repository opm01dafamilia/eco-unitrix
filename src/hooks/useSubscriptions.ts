import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SubscriptionPlan {
  id: string;
  plan_name: string;
  app_key: string;
  billing_type: string;
  price_description: string | null;
  kiwify_url: string | null;
  status: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  app_key: string | null;
  status: string;
  subscription_status: string;
  started_at: string;
  expires_at: string | null;
  created_at: string;
  plan?: SubscriptionPlan;
}

export function useSubscriptionPlans(appKey?: string) {
  return useQuery({
    queryKey: ["subscription-plans", appKey],
    queryFn: async () => {
      let query = supabase
        .from("subscription_plans")
        .select("*")
        .eq("status", "active")
        .order("plan_name");

      if (appKey) {
        query = query.eq("app_key", appKey);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });
}

export function useUserSubscriptions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-subscriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      return (data ?? []).map((sub: any): UserSubscription => ({
        ...sub,
        plan: sub.subscription_plans as SubscriptionPlan,
      }));
    },
    enabled: !!user,
  });
}
