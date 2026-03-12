import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, CreditCard, Gift, Crown, AppWindow, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
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
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
        supabase.from("free_trials").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("subscription_status", "cancelled"),
        supabase.from("lifetime_access").select("*", { count: "exact", head: true }),
        supabase.from("platform_apps").select("*", { count: "exact", head: true }).eq("app_status", "active"),
      ]);

      return {
        totalUsers: totalUsers ?? 0,
        activeSubs: activeSubs ?? 0,
        activeTrials: activeTrials ?? 0,
        cancelledSubs: cancelledSubs ?? 0,
        lifetimeUsers: lifetimeUsers ?? 0,
        activeApps: activeApps ?? 0,
      };
    },
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards: StatCard[] = [
    { label: "Usuários", value: stats?.totalUsers ?? 0, icon: Users, color: "text-primary" },
    { label: "Assinaturas Ativas", value: stats?.activeSubs ?? 0, icon: CreditCard, color: "text-primary" },
    { label: "Em Trial", value: stats?.activeTrials ?? 0, icon: Gift, color: "text-blue-400" },
    { label: "Vitalícios", value: stats?.lifetimeUsers ?? 0, icon: Crown, color: "text-yellow-500" },
    { label: "Cancelados", value: stats?.cancelledSubs ?? 0, icon: XCircle, color: "text-destructive" },
    { label: "Apps Ativos", value: stats?.activeApps ?? 0, icon: AppWindow, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <Card key={card.label} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
