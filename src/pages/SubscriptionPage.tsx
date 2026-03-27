import { useUserSubscriptions } from "@/hooks/useSubscriptions";
import { useApps } from "@/hooks/useApps";
import { useSubscriptionPlans } from "@/hooks/useSubscriptions";
import { useAllAppAccess } from "@/hooks/useAllAppAccess";
import { getAppIcon } from "@/lib/appIcons";
import SavingsComparison from "@/components/SavingsComparison";
import {
  CreditCard,
  CheckCircle2,
  Crown,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  AppWindow,
  ShieldAlert,
  Pause,
  Gift,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import PricingCards from "@/components/PricingCards";

const statusMap: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Ativa", color: "text-primary bg-primary/10", icon: CheckCircle2 },
  expired: { label: "Expirada", color: "text-muted-foreground bg-muted", icon: Clock },
  cancelled: { label: "Cancelada", color: "text-destructive bg-destructive/10", icon: XCircle },
  suspended: { label: "Suspensa", color: "text-orange-400 bg-orange-400/10", icon: Pause },
  overdue: { label: "Atrasada", color: "text-orange-400 bg-orange-400/10", icon: ShieldAlert },
};

const accessTypeConfig = {
  lifetime: { label: "Vitalício", icon: Crown, color: "text-yellow-500" },
  paid: { label: "Assinatura", icon: CreditCard, color: "text-primary" },
  trial: { label: "Teste grátis", icon: Gift, color: "text-blue-400" },
  inactive: { label: "Inativo", icon: XCircle, color: "text-muted-foreground" },
} as const;

export default function SubscriptionPage() {
  const { data: subscriptions, isLoading, isError, refetch } = useUserSubscriptions();
  const { data: apps } = useApps();
  const { data: allPlans } = useSubscriptionPlans();
  const { data: accessMap } = useAllAppAccess();

  const appNameMap = new Map(apps?.map((a) => [a.app_key, a]) ?? []);

  const activeSubscriptions = subscriptions?.filter((s) => s.subscription_status === "active") ?? [];
  const otherSubscriptions = subscriptions?.filter((s) => s.subscription_status !== "active") ?? [];

  const subscribedAppKeys = new Set(activeSubscriptions.map((s) => s.app_key).filter(Boolean));
  const unsubscribedApps = (apps ?? []).filter(
    (a) => a.is_visible && a.app_status === "active" && !subscribedAppKeys.has(a.app_key) && a.access_type === "inactive"
  );

  const plansByApp = new Map<string, typeof allPlans>();
  allPlans?.forEach((plan) => {
    if (plan.app_key) {
      const existing = plansByApp.get(plan.app_key) ?? [];
      existing.push(plan);
      plansByApp.set(plan.app_key, existing);
    }
  });

  // Trial warning data
  const trialApps = accessMap ? Object.values(accessMap).filter((a) => a.accessType === "trial" && a.expiresAt) : [];
  const nearestTrial = trialApps.length > 0 ? trialApps.sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime())[0] : null;
  const trialDaysLeft = nearestTrial ? differenceInDays(new Date(nearestTrial.expiresAt!), new Date()) : 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Minha Assinatura</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus planos e veja os aplicativos incluídos.</p>
      </div>

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Erro ao carregar assinaturas</p>
          <button onClick={() => refetch()} className="mt-2 text-xs text-primary hover:underline">Tentar novamente</button>
        </div>
      )}

      {/* Trial warning */}
      {!isError && nearestTrial && trialDaysLeft >= 0 && (
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Seu teste grátis termina em {trialDaysLeft} dia{trialDaysLeft !== 1 ? "s" : ""}.
              </p>
              <p className="text-xs text-muted-foreground">Assine um plano para manter o acesso contínuo.</p>
            </div>
          </div>
          <a href="https://pay.kiwify.com.br/tn6JpCc" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="shrink-0">Assinar agora</Button>
          </a>
        </div>
      )}

      {/* My access overview */}
      {!isError && accessMap && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <AppWindow className="h-5 w-5 text-primary" /> Meus Aplicativos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(accessMap).map((info) => {
              const app = appNameMap.get(info.appKey);
              if (!app || !app.is_visible) return null;
              const Icon = getAppIcon(info.appKey) || AppWindow;
              const cfg = accessTypeConfig[info.accessType];

              return (
                <div key={info.appKey} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{app.app_name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <cfg.icon className="h-3 w-3" />
                        <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      {info.expiresAt && info.accessType !== "inactive" && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          Expira: {format(new Date(info.expiresAt), "dd/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className={`${cfg.color} border-current/20 shrink-0`}>
                    {info.accessType === "inactive" ? "Inativo" : "Ativo"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active subscriptions */}
      {!isError && activeSubscriptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" /> Planos Ativos
          </h2>
          {activeSubscriptions.map((sub) => {
            const app = sub.app_key ? appNameMap.get(sub.app_key) : null;
            const Icon = sub.app_key ? getAppIcon(sub.app_key) || AppWindow : AppWindow;
            const st = statusMap[sub.subscription_status] ?? statusMap.active;

            return (
              <div key={sub.id} className="rounded-xl border border-primary/20 bg-card p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-foreground">{sub.plan?.plan_name ?? "Plano"}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{app?.app_name ?? sub.app_key ?? "—"}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">Status</span>
                        <div className="mt-1"><Badge className={`${st.color} gap-1`}><st.icon className="h-3 w-3" />{st.label}</Badge></div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Início</span>
                        <p className="text-foreground font-medium">{format(new Date(sub.started_at), "dd/MM/yyyy", { locale: ptBR })}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Expiração</span>
                        <p className="text-foreground font-medium">{sub.expires_at ? format(new Date(sub.expires_at), "dd/MM/yyyy", { locale: ptBR }) : "Sem expiração"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Tipo</span>
                        <p className="text-foreground font-medium">{sub.plan?.billing_type === "yearly" ? "Anual" : "Mensal"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No active subscriptions */}
      {!isError && activeSubscriptions.length === 0 && !trialApps.length && !accessMap?.fitpulse?.accessType?.includes("lifetime") && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground">Nenhum plano ativo</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Assine um plano abaixo para desbloquear o acesso aos aplicativos do UNITRIX.
          </p>
        </div>
      )}

      {!isError && <PricingCards />}
      {!isError && <SavingsComparison />}

      {/* Available apps to subscribe */}
      {!isError && unsubscribedApps.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Aplicativos Disponíveis para Assinar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unsubscribedApps.map((app) => {
              const Icon = getAppIcon(app.app_key) || AppWindow;
              const plans = plansByApp.get(app.app_key) ?? [];
              return (
                <div key={app.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-foreground">{app.app_name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{app.app_description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Sem assinatura ativa</span>
                  </div>
                  {plans.length > 0 ? (
                    <div className="space-y-2">
                      {plans.map((plan) => (
                        <a key={plan.id} href={plan.kiwify_url ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5 group">
                          <div>
                            <p className="text-sm font-medium text-foreground">{plan.plan_name}</p>
                            <p className="text-xs text-muted-foreground">{plan.billing_type === "yearly" ? "Anual" : "Mensal"}{plan.price_description && ` • ${plan.price_description}`}</p>
                          </div>
                          <span className="text-xs font-medium text-primary group-hover:underline flex items-center gap-1">Assinar <ExternalLink className="h-3 w-3" /></span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Planos em breve disponíveis.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subscription history */}
      {!isError && otherSubscriptions.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-base font-semibold text-muted-foreground">Histórico</h2>
          {otherSubscriptions.map((sub) => {
            const st = statusMap[sub.subscription_status] ?? statusMap.cancelled;
            const Icon = sub.app_key ? getAppIcon(sub.app_key) || AppWindow : AppWindow;
            return (
              <div key={sub.id} className="rounded-xl border border-border bg-card/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{sub.plan?.plan_name ?? "Plano"}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(sub.started_at), "dd/MM/yyyy", { locale: ptBR })}
                      {sub.expires_at && ` — ${format(new Date(sub.expires_at), "dd/MM/yyyy", { locale: ptBR })}`}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={`${st.color} gap-1`}><st.icon className="h-3 w-3" />{st.label}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
