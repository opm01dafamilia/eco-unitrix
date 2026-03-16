import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AppWithAccess {
  id: string;
  app_key: string;
  app_name: string;
  app_description: string | null;
  app_status: string;
  app_url: string | null;
  app_category: string;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  user_access: string | null;
  access_type: "lifetime" | "paid" | "trial" | "inactive";
}

export function useApps() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["platform-apps", user?.id],
    queryFn: async () => {
      const { data: apps, error: appsError } = await supabase
        .from("platform_apps")
        .select("*")
        .order("sort_order");
      if (appsError) throw appsError;

      const { data: access, error: accessError } = await supabase
        .from("user_app_access")
        .select("*")
        .eq("user_id", user!.id);
      if (accessError) throw accessError;

      // Check lifetime access
      const { data: lifetime } = await supabase
        .from("lifetime_access")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      // Check ecosystem subscription
      const { data: ecosystemSub } = await supabase
        .from("user_subscriptions")
        .select("subscription_status, status, expires_at")
        .eq("user_id", user!.id)
        .eq("app_key", "ecosystem")
        .eq("subscription_status", "active")
        .limit(1);

      const hasEcosystem = ecosystemSub && ecosystemSub.length > 0 &&
        (!ecosystemSub[0].expires_at || new Date(ecosystemSub[0].expires_at) >= new Date());

      // Check per-app subscriptions
      const { data: appSubs } = await supabase
        .from("user_subscriptions")
        .select("app_key, subscription_status, status, expires_at")
        .eq("user_id", user!.id)
        .neq("app_key", "ecosystem");

      const paidAppKeys = new Set(
        (appSubs ?? [])
          .filter((s) => {
            const st = s.subscription_status || s.status;
            return st === "active" && (!s.expires_at || new Date(s.expires_at) >= new Date());
          })
          .map((s) => s.app_key)
      );

      // Check free trials
      const { data: trials } = await supabase
        .from("free_trials")
        .select("app_key, trial_type")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString());

      const trialAllApps = trials?.some((t) => t.trial_type === "all_apps") ?? false;
      const trialAppKeys = new Set(
        (trials ?? []).filter((t) => t.trial_type !== "all_apps" && t.app_key).map((t) => t.app_key)
      );

      const accessMap = new Map(access?.map((a) => [a.app_key, a.access_status]) ?? []);

      return (apps as any[]).map((app): AppWithAccess => {
        let accessType: AppWithAccess["access_type"] = "inactive";
        let userAccess: string | null = accessMap.get(app.app_key) ?? null;

        if (lifetime) {
          accessType = "lifetime";
          userAccess = "active";
        } else if (hasEcosystem || paidAppKeys.has(app.app_key)) {
          accessType = "paid";
          userAccess = "active";
        } else if (trialAllApps || trialAppKeys.has(app.app_key)) {
          accessType = "trial";
          userAccess = "active";
        }

        return {
          ...app,
          is_visible: app.is_visible ?? true,
          app_category: app.app_category ?? "produtividade",
          is_featured: app.is_featured ?? false,
          sort_order: app.sort_order ?? 0,
          user_access: userAccess,
          access_type: accessType,
        };
      });
    },
    enabled: !!user,
    staleTime: 10000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
