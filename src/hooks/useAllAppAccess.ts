import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AccessType = "lifetime" | "paid" | "trial" | "inactive";

export interface AppAccessInfo {
  appKey: string;
  accessType: AccessType;
  origin: string;
  startedAt: string | null;
  expiresAt: string | null;
}

export function useAllAppAccess() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-app-access", user?.id],
    queryFn: async (): Promise<Record<string, AppAccessInfo>> => {
      const result: Record<string, AppAccessInfo> = {};
      const appKeys = ["fitpulse", "financeflow", "marketflow", "ia-agenda", "whatsapp-auto"];

      // Initialize all as inactive
      for (const key of appKeys) {
        result[key] = { appKey: key, accessType: "inactive", origin: "—", startedAt: null, expiresAt: null };
      }

      // 1. Check lifetime access (highest priority)
      const { data: lifetime } = await supabase
        .from("lifetime_access")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (lifetime) {
        for (const key of appKeys) {
          result[key] = {
            appKey: key,
            accessType: "lifetime",
            origin: "Vitalício",
            startedAt: lifetime.granted_at,
            expiresAt: null,
          };
        }
        return result;
      }

      // 2. Check subscriptions (paid)
      const { data: subs } = await supabase
        .from("user_subscriptions")
        .select("app_key, subscription_status, status, started_at, expires_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (subs) {
        for (const sub of subs) {
          const subStatus = sub.subscription_status || sub.status;
          if (subStatus !== "active") continue;
          if (sub.expires_at && new Date(sub.expires_at) < new Date()) continue;

          if (sub.app_key === "ecosystem") {
            for (const key of appKeys) {
              if (result[key].accessType === "inactive" || result[key].accessType === "trial") {
                result[key] = {
                  appKey: key,
                  accessType: "paid",
                  origin: "Assinatura UNITRIX",
                  startedAt: sub.started_at,
                  expiresAt: sub.expires_at,
                };
              }
            }
          } else if (sub.app_key && appKeys.includes(sub.app_key)) {
            if (result[sub.app_key].accessType === "inactive" || result[sub.app_key].accessType === "trial") {
              result[sub.app_key] = {
                appKey: sub.app_key,
                accessType: "paid",
                origin: "Assinatura",
                startedAt: sub.started_at,
                expiresAt: sub.expires_at,
              };
            }
          }
        }
      }

      // 3. Check free trials
      const { data: trials } = await supabase
        .from("free_trials")
        .select("*")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString());

      if (trials) {
        for (const trial of trials) {
          if (trial.trial_type === "all_apps") {
            for (const key of appKeys) {
              if (result[key].accessType === "inactive") {
                result[key] = {
                  appKey: key,
                  accessType: "trial",
                  origin: "Teste grátis",
                  startedAt: trial.started_at,
                  expiresAt: trial.expires_at,
                };
              }
            }
          } else if (trial.app_key && result[trial.app_key]?.accessType === "inactive") {
            result[trial.app_key] = {
              appKey: trial.app_key,
              accessType: "trial",
              origin: "Teste grátis",
              startedAt: trial.started_at,
              expiresAt: trial.expires_at,
            };
          }
        }
      }

      return result;
    },
    enabled: !!user,
    staleTime: 30000,
  });
}
