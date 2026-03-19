/**
 * Central ecosystem access hook.
 * Determines if the current user can access the ecosystem based on:
 * 1. Lifetime access (highest priority)
 * 2. Active subscription (ecosystem or any active plan)
 * 3. Active free trial
 * Returns access status, type, and trial metadata.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type EcosystemAccessType = "lifetime" | "paid" | "trial" | "none";

export interface EcosystemAccess {
  /** Whether the user has active access to the ecosystem */
  hasAccess: boolean;
  /** The source of the access */
  accessType: EcosystemAccessType;
  /** Human-readable label */
  label: string;
  /** When the current access period started */
  startedAt: string | null;
  /** When the current access expires (null = never) */
  expiresAt: string | null;
  /** Days remaining for trial/subscription (null if lifetime or no access) */
  daysRemaining: number | null;
  /** Whether the user had a trial that expired */
  trialExpired: boolean;
  /** Loading state */
  isLoading: boolean;
}

export function useEcosystemAccess(): EcosystemAccess {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["ecosystem-access", user?.id],
    queryFn: async (): Promise<Omit<EcosystemAccess, "isLoading">> => {
      const noAccess: Omit<EcosystemAccess, "isLoading"> = {
        hasAccess: false,
        accessType: "none",
        label: "Sem acesso",
        startedAt: null,
        expiresAt: null,
        daysRemaining: null,
        trialExpired: false,
      };

      // 1. Lifetime access — highest priority
      const { data: lifetime } = await supabase
        .from("lifetime_access")
        .select("id, granted_at")
        .eq("user_id", user!.id)
        .limit(1);

      if (lifetime && lifetime.length > 0) {
        return {
          hasAccess: true,
          accessType: "lifetime",
          label: "Acesso Vitalício",
          startedAt: lifetime[0].granted_at,
          expiresAt: null,
          daysRemaining: null,
          trialExpired: false,
        };
      }

      // 2. Active subscription
      const { data: subs } = await supabase
        .from("user_subscriptions")
        .select("subscription_status, started_at, expires_at")
        .eq("user_id", user!.id)
        .eq("subscription_status", "active")
        .order("created_at", { ascending: false });

      if (subs) {
        const activeSub = subs.find(
          (s) => !s.expires_at || new Date(s.expires_at) >= new Date()
        );
        if (activeSub) {
          const daysRemaining = activeSub.expires_at
            ? Math.max(0, Math.ceil((new Date(activeSub.expires_at).getTime() - Date.now()) / 86400000))
            : null;
          return {
            hasAccess: true,
            accessType: "paid",
            label: "Assinatura Ativa",
            startedAt: activeSub.started_at,
            expiresAt: activeSub.expires_at,
            daysRemaining,
            trialExpired: false,
          };
        }
      }

      // 3. Active free trial
      const now = new Date().toISOString();
      const { data: trials } = await supabase
        .from("free_trials")
        .select("started_at, expires_at, status")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (trials && trials.length > 0) {
        const activeTrial = trials.find(
          (t) => t.status === "active" && new Date(t.expires_at) >= new Date()
        );
        if (activeTrial) {
          const daysRemaining = Math.max(
            0,
            Math.ceil((new Date(activeTrial.expires_at).getTime() - Date.now()) / 86400000)
          );
          return {
            hasAccess: true,
            accessType: "trial",
            label: `Teste Grátis (${daysRemaining}d restantes)`,
            startedAt: activeTrial.started_at,
            expiresAt: activeTrial.expires_at,
            daysRemaining,
            trialExpired: false,
          };
        }

        // Check if trial expired
        const expiredTrial = trials.find(
          (t) => t.status === "active" && new Date(t.expires_at) < new Date()
        );
        if (expiredTrial) {
          return { ...noAccess, trialExpired: true };
        }
      }

      return noAccess;
    },
    enabled: !!user,
    staleTime: 10000,
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
  });

  const defaults: Omit<EcosystemAccess, "isLoading"> = {
    hasAccess: false,
    accessType: "none",
    label: "Carregando...",
    startedAt: null,
    expiresAt: null,
    daysRemaining: null,
    trialExpired: false,
  };

  return { ...(data ?? defaults), isLoading };
}
