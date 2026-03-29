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
import PricingCards from "@/components/PricingCards";

const statusMap = {
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
};

export default function SubscriptionPage() {
  const { data: subscriptions, isLoading, isError, refetch } = useUserSubscriptions();
  const { data: apps } = useApps();
  const { data: allPlans } = useSubscriptionPlans();
  const { data: accessMap } = useAllAppAccess();

  const appNameMap = new Map(apps?.map((a) => [a.app_key, a]) ?? []);

  const activeSubscriptions = subscriptions?.filter((s) => s.subscription_status === "active") ?? [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Minha Assinatura
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Gerencie seus planos e veja os aplicativos incluídos.
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-2xl glass-card p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">
            Erro ao carregar assinaturas
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 text-xs text-primary hover:underline font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* No subscription */}
      {!isError && activeSubscriptions.length === 0 && (
        <div className="rounded-2xl glass-card p-10 text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-30" />
          <p className="text-sm font-semibold text-foreground">
            Nenhum plano ativo
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
            Assine um plano abaixo para desbloquear o acesso aos aplicativos do UNITRIX.
          </p>
        </div>
      )}

      {/* Plans */}
      {!isError && <PricingCards />}

      {/* Savings */}
      {!isError && <SavingsComparison />}

    </div>
  );
}