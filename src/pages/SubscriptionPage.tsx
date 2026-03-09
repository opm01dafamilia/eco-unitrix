import { useUserSubscriptions } from "@/hooks/useSubscriptions";
import { useApps } from "@/hooks/useApps";
import { getAppIcon } from "@/lib/appIcons";
import {
  CreditCard,
  CheckCircle2,
  Crown,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  AppWindow,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

const statusMap: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Ativa", color: "text-primary bg-primary/10", icon: CheckCircle2 },
  expired: { label: "Expirada", color: "text-muted-foreground bg-muted", icon: Clock },
  cancelled: { label: "Cancelada", color: "text-destructive bg-destructive/10", icon: XCircle },
};

export default function SubscriptionPage() {
  const { data: subscriptions, isLoading, isError, refetch } = useUserSubscriptions();
  const { data: apps } = useApps();

  const appNameMap = new Map(apps?.map((a) => [a.app_key, a]) ?? []);

  const activeSubscriptions = subscriptions?.filter((s) => s.subscription_status === "active") ?? [];
  const otherSubscriptions = subscriptions?.filter((s) => s.subscription_status !== "active") ?? [];

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
        <p className="text-muted-foreground mt-1">Gerencie seus planos e veja os aplicativos incluídos.</p>
      </div>

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Erro ao carregar assinaturas</p>
          <button onClick={() => refetch()} className="mt-2 text-xs text-primary hover:underline">
            Tentar novamente
          </button>
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
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {app?.app_name ?? sub.app_key ?? "—"}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">Início</span>
                        <p className="text-foreground font-medium">
                          {format(new Date(sub.started_at), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Expiração</span>
                        <p className="text-foreground font-medium">
                          {sub.expires_at
                            ? format(new Date(sub.expires_at), "dd/MM/yyyy", { locale: ptBR })
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Tipo</span>
                        <p className="text-foreground font-medium">
                          {sub.plan?.billing_type === "yearly" ? "Anual" : "Mensal"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${st.color} gap-1 shrink-0`}>
                    <st.icon className="h-3 w-3" />
                    {st.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No active subscriptions */}
      {!isError && activeSubscriptions.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground">Nenhum plano ativo</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Acesse a página de aplicativos e assine um plano para desbloquear o acesso.
          </p>
          <Link
            to="/apps"
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary hover:underline font-medium"
          >
            Ver aplicativos <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Other subscriptions */}
      {!isError && otherSubscriptions.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-base font-semibold text-muted-foreground">Histórico</h2>
          {otherSubscriptions.map((sub) => {
            const st = statusMap[sub.subscription_status] ?? statusMap.cancelled;
            return (
              <div key={sub.id} className="rounded-xl border border-border bg-card/50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{sub.plan?.plan_name ?? "Plano"}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(sub.started_at), "dd/MM/yyyy", { locale: ptBR })}
                    {sub.expires_at && ` — ${format(new Date(sub.expires_at), "dd/MM/yyyy", { locale: ptBR })}`}
                  </p>
                </div>
                <Badge variant="outline" className={`${st.color} gap-1`}>
                  <st.icon className="h-3 w-3" />
                  {st.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
