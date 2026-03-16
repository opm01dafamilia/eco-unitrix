import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, CreditCard, Gift, Crown, AppWindow, XCircle, TrendingUp, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function AdminStatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: activeSubs },
        { count: activeTrials },
        { count: cancelledSubs },
        { count: lifetimeUsers },
        { count: activeApps },
        { data: plans },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
        supabase.from("free_trials").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "cancelled"),
        supabase.from("lifetime_access").select("*", { count: "exact", head: true }),
        supabase.from("platform_apps").select("*", { count: "exact", head: true }).eq("app_status", "active"),
        supabase.from("subscription_plans").select("price_description, status").eq("status", "active"),
      ]);

      // Estimate inactive users (no active sub, no trial, no lifetime)
      const activeCount = (activeSubs ?? 0) + (activeTrials ?? 0) + (lifetimeUsers ?? 0);
      const inactiveUsers = Math.max(0, (totalUsers ?? 0) - activeCount);

      return {
        totalUsers: totalUsers ?? 0,
        activeSubs: activeSubs ?? 0,
        activeTrials: activeTrials ?? 0,
        cancelledSubs: cancelledSubs ?? 0,
        lifetimeUsers: lifetimeUsers ?? 0,
        activeApps: activeApps ?? 0,
        inactiveUsers,
      };
    },
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-14" />
          </div>
        ))}
      </div>
    );
  }

  const cards: StatCard[] = [
    { label: "Total Usuários", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-400", bgColor: "bg-blue-400/10" },
    { label: "Assinaturas Ativas", value: stats?.activeSubs ?? 0, icon: CreditCard, color: "text-primary", bgColor: "bg-primary/10" },
    { label: "Em Trial", value: stats?.activeTrials ?? 0, icon: Gift, color: "text-violet-400", bgColor: "bg-violet-400/10" },
    { label: "Vitalícios", value: stats?.lifetimeUsers ?? 0, icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { label: "Cancelados", value: stats?.cancelledSubs ?? 0, icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
    { label: "Inativos", value: stats?.inactiveUsers ?? 0, icon: ShieldCheck, color: "text-orange-400", bgColor: "bg-orange-400/10" },
    { label: "Apps Ativos", value: stats?.activeApps ?? 0, icon: AppWindow, color: "text-cyan-400", bgColor: "bg-cyan-400/10" },
    { label: "Receita Est.", value: `R$ ${((stats?.activeSubs ?? 0) * 29.9).toFixed(0)}`, icon: TrendingUp, color: "text-primary", bgColor: "bg-primary/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all duration-200 hover:shadow-[0_0_20px_hsl(var(--primary)/0.05)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
            <div className={`h-8 w-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground tracking-tight">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
