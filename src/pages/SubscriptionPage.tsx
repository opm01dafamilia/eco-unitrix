import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useApps } from "@/hooks/useApps";
import { CreditCard, CheckCircle2, Crown, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { data: apps } = useApps();

  const { data: subscription, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const activeApps = apps?.filter((a) => a.user_access === "active") ?? [];
  const plan = subscription?.subscription_plans as { plan_name: string; description: string } | null;
  const startDate = subscription?.started_at
    ? format(new Date(subscription.started_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "";

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Minha Assinatura</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu plano e veja os aplicativos incluídos.</p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Erro ao carregar assinatura</p>
          <button onClick={() => refetch()} className="mt-2 text-xs text-primary hover:underline">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Current Plan */}
      {!isError && (
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-foreground">{plan?.plan_name ?? "Sem plano"}</h2>
              <p className="text-sm text-muted-foreground mt-1">{plan?.description ?? "Nenhum plano ativo."}</p>
              {startDate && (
                <p className="text-xs text-muted-foreground mt-2">Ativo desde {startDate}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ativo
            </div>
          </div>
        </div>
      )}

      {/* Included Apps */}
      {!isError && (
        <div className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-primary" /> Aplicativos incluídos no plano
          </h2>
          {activeApps.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum aplicativo incluído no momento.</p>
          ) : (
            <div className="space-y-2">
              {activeApps.map((app) => (
                <div key={app.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-display font-bold text-primary">{app.app_name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{app.app_name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{app.app_description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Incluído
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Future Plans Placeholder */}
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
        <Crown className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
        <p className="text-sm font-medium text-muted-foreground">Planos adicionais em breve</p>
        <p className="text-xs text-muted-foreground mt-1">Novas opções de assinatura serão disponibilizadas no futuro.</p>
      </div>
    </div>
  );
}
