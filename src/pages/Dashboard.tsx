import { useMemo } from "react";
import { AlertTriangle, Crown, Layers } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useApps } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useAllAppAccess } from "@/hooks/useAllAppAccess";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { AccessBlockedModal } from "@/components/AccessBlockedModal";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { InfoCards } from "@/components/dashboard/InfoCards";
import { DemoAppGrid } from "@/components/dashboard/DemoAppGrid";
import { UpgradeSection } from "@/components/dashboard/UpgradeSection";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: apps, isLoading: appsLoading, isError: appsError } = useApps();
  const { data: accessMap } = useAllAppAccess();
  const { launchApp, launchingAppKey, blockedApp, clearBlockedApp } = useAppLauncher();

  const { data: subscription } = useQuery({
    queryKey: ["user-subscription-dash", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user!.id)
        .eq("subscription_status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 60000,
  });

  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";
  const visibleApps = useMemo(() => apps?.filter((a) => a.is_visible && a.app_status === "active") ?? [], [apps]);
  const plan = subscription?.subscription_plans as { plan_name: string } | null;
  const isLoading = profileLoading || appsLoading;

  const activeApps = useMemo(
    () => visibleApps.filter((a) => a.user_access === "active" && a.access_type !== "inactive"),
    [visibleApps]
  );

  const totalAccessible = activeApps.length;
  const isDemo = !plan;

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 sm:space-y-6">
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <span className="font-display text-sm sm:text-base font-bold text-foreground">
            Ecossistema IA Apps
          </span>
        </div>
        <Link
          to="/subscription"
          className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/20 bg-foreground/5 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-foreground hover:bg-foreground/10 transition-colors"
        >
          <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Assinar Plano Completo
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-2xl" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        </div>
      ) : appsError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Erro ao carregar aplicativos</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tente recarregar a página.</p>
          </div>
        </div>
      ) : (
        <>
          <HeroCard firstName={firstName} isLoading={isLoading} isDemo={isDemo} />
          <InfoCards
            totalAccessible={totalAccessible}
            totalApps={visibleApps.length}
            planName={plan?.plan_name ?? null}
            isDemo={isDemo}
          />
          <DemoAppGrid
            apps={visibleApps}
            onLaunch={launchApp}
            launchingAppKey={launchingAppKey}
          />
          <UpgradeSection />
          <DashboardFooter />
        </>
      )}

      {blockedApp && (
        <AccessBlockedModal
          open={!!blockedApp}
          onOpenChange={(open) => !open && clearBlockedApp()}
          appName={blockedApp.appName}
          appKey={blockedApp.appKey}
          reason={blockedApp.reason}
        />
      )}
    </div>
  );
}
