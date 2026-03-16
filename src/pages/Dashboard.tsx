import { useMemo } from "react";
import { AppWindow, Activity, ArrowRight, Clock, ExternalLink, Star, AlertTriangle, Crown, Lock, Gift, CreditCard, Loader2, Zap } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { useProfile } from "@/hooks/useProfile";
import { useApps, AppWithAccess } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useAllAppAccess } from "@/hooks/useAllAppAccess";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AccessBlockedModal } from "@/components/AccessBlockedModal";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: apps, isLoading: appsLoading, isError: appsError } = useApps();
  const { data: accessMap } = useAllAppAccess();
  const { launchApp, launchingAppKey, blockedApp, clearBlockedApp } = useAppLauncher();

  const { data: recentLogs } = useQuery({
    queryKey: ["recent-logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_usage_logs")
        .select("*")
        .eq("user_id", user!.id)
        .order("accessed_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

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

  // Split into 3 groups
  const myApps = useMemo(() =>
    visibleApps.filter((a) => a.user_access === "active" && (a.access_type === "paid" || a.access_type === "lifetime")),
    [visibleApps]
  );

  const trialApps = useMemo(() =>
    visibleApps.filter((a) => a.user_access === "active" && a.access_type === "trial"),
    [visibleApps]
  );

  const upgradeApps = useMemo(() =>
    visibleApps.filter((a) => !(a.user_access === "active" && a.access_type !== "inactive")),
    [visibleApps]
  );

  const totalAccessible = myApps.length + trialApps.length;
  const appNameMap = new Map(visibleApps.map((a) => [a.app_key, a.app_name]));

  const getTrialDaysLeft = (appKey: string) => {
    const info = accessMap?.[appKey];
    if (!info?.expiresAt) return null;
    return Math.max(0, differenceInDays(new Date(info.expiresAt), new Date()));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Hero Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Olá, <span className="gradient-text">{isLoading ? "..." : firstName}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Seu hub central do ecossistema de aplicativos.
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-xl border border-border bg-background/60 backdrop-blur-sm px-4 py-2.5 text-center min-w-[80px]">
              <p className="font-display text-lg sm:text-xl font-bold text-foreground">{isLoading ? "—" : totalAccessible}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Apps ativos</p>
            </div>
            <div className="rounded-xl border border-border bg-background/60 backdrop-blur-sm px-4 py-2.5 text-center min-w-[80px]">
              <p className="font-display text-lg sm:text-xl font-bold text-foreground">{isLoading ? "—" : visibleApps.length}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">No ecossistema</p>
            </div>
          </div>
        </div>

        {/* Plan badge */}
        {!isLoading && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
              <Crown className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">{plan?.plan_name ?? "Sem plano ativo"}</span>
            </div>
            {trialApps.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-400/5 px-3 py-1">
                <Gift className="h-3 w-3 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">{trialApps.length} em teste</span>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
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
          {/* ─── MEUS APLICATIVOS ─── */}
          <section>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" /> Meus Aplicativos
                {myApps.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{myApps.length}</Badge>
                )}
              </h2>
              <Link to="/apps" className="text-xs text-primary hover:underline flex items-center gap-1">
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {myApps.length === 0 && trialApps.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8 text-center">
                <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium text-foreground">Nenhum aplicativo liberado</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Assine um plano para desbloquear o acesso aos aplicativos do ecossistema.
                </p>
                <Link to="/subscription" className="inline-flex items-center gap-1.5 mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Ver planos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {myApps.map((app) => (
                  <ActiveAppCard
                    key={app.id}
                    app={app}
                    onLaunch={launchApp}
                    isLaunching={launchingAppKey === app.app_key}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ─── ACESSO EM TESTE ─── */}
          {trialApps.length > 0 && (
            <section>
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 mb-3 sm:mb-4">
                <Gift className="h-4 w-4 text-blue-400" /> Acesso em Teste
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1 border-blue-400/30 text-blue-400">{trialApps.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {trialApps.map((app) => {
                  const daysLeft = getTrialDaysLeft(app.app_key);
                  return (
                    <TrialAppCard
                      key={app.id}
                      app={app}
                      daysLeft={daysLeft}
                      onLaunch={launchApp}
                      isLaunching={launchingAppKey === app.app_key}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── OUTROS APPS ─── */}
          {upgradeApps.length > 0 && (
            <section>
              <h2 className="font-display text-base sm:text-lg font-semibold text-muted-foreground flex items-center gap-2 mb-3 sm:mb-4">
                <AppWindow className="h-4 w-4" /> Outros Aplicativos do Ecossistema
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {upgradeApps.map((app) => (
                  <UpgradeAppCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Activity + Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Atividade Recente
          </h2>
          {!recentLogs || recentLogs.length === 0 ? (
            <EmptyState icon={Activity} title="Nenhuma atividade registrada" description="Acesse um aplicativo para começar." />
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{appNameMap.get(log.app_key) ?? log.app_key} acessado</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {format(new Date(log.accessed_at), "dd MMM, HH:mm", { locale: ptBR })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Atalhos Rápidos
          </h2>
          <div className="space-y-2">
            {[
              { label: "Meus Aplicativos", href: "/apps" },
              { label: "Configurar conta", href: "/settings" },
              { label: "Ver perfil", href: "/profile" },
              { label: "Minha assinatura", href: "/subscription" },
            ].map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-foreground transition-colors hover:bg-secondary/60 hover:border-primary/30 group active:scale-[0.98]"
              >
                {s.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

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

/* ─── Active App Card (paid / lifetime) ─── */
function ActiveAppCard({ app, onLaunch, isLaunching }: { app: AppWithAccess; onLaunch: (a: AppWithAccess) => void; isLaunching: boolean }) {
  const Icon = getAppIcon(app.app_key);
  const isLifetime = app.access_type === "lifetime";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden card-glow group hover:border-primary/30 transition-all">
      <div className="h-20 sm:h-24 bg-gradient-to-br from-primary/15 via-primary/10 to-transparent flex items-center justify-center relative">
        {Icon ? <Icon className="h-8 w-8 text-primary/50" strokeWidth={1.5} /> : <AppWindow className="h-8 w-8 text-primary/40" strokeWidth={1.5} />}
        <div className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium border ${isLifetime ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" : "text-primary bg-primary/10 border-primary/20"}`}>
          {isLifetime ? <Crown className="h-2.5 w-2.5" /> : <CreditCard className="h-2.5 w-2.5" />}
          {isLifetime ? "Vitalício" : "Assinante"}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">{app.app_name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.app_description || "Sem descrição."}</p>
        </div>
        <button
          onClick={() => onLaunch(app)}
          disabled={isLaunching}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs sm:text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] active:scale-[0.97] disabled:opacity-70"
        >
          {isLaunching ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Abrindo...</> : <>Abrir <ExternalLink className="h-3.5 w-3.5" /></>}
        </button>
      </div>
    </div>
  );
}

/* ─── Trial App Card ─── */
function TrialAppCard({ app, daysLeft, onLaunch, isLaunching }: { app: AppWithAccess; daysLeft: number | null; onLaunch: (a: AppWithAccess) => void; isLaunching: boolean }) {
  const Icon = getAppIcon(app.app_key);
  const urgent = daysLeft !== null && daysLeft <= 2;

  return (
    <div className={`rounded-xl border overflow-hidden card-glow group transition-all ${urgent ? "border-orange-400/30 bg-card" : "border-blue-400/20 bg-card"}`}>
      <div className="h-20 sm:h-24 bg-gradient-to-br from-blue-400/10 via-blue-400/5 to-transparent flex items-center justify-center relative">
        {Icon ? <Icon className="h-8 w-8 text-blue-400/50" strokeWidth={1.5} /> : <AppWindow className="h-8 w-8 text-blue-400/40" strokeWidth={1.5} />}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium border text-blue-400 bg-blue-400/10 border-blue-400/20">
          <Gift className="h-2.5 w-2.5" />
          Teste grátis
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">{app.app_name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.app_description || "Sem descrição."}</p>
        </div>
        {daysLeft !== null && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${urgent ? "text-orange-400" : "text-blue-400"}`}>
            <Clock className="h-3 w-3" />
            {daysLeft === 0 ? "Expira hoje" : `${daysLeft} dia${daysLeft !== 1 ? "s" : ""} restante${daysLeft !== 1 ? "s" : ""}`}
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onLaunch(app)}
            disabled={isLaunching}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-blue-600 active:scale-[0.97] disabled:opacity-70"
          >
            {isLaunching ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Abrindo...</> : <>Abrir <ExternalLink className="h-3.5 w-3.5" /></>}
          </button>
          <Link
            to="/subscription"
            className="flex items-center justify-center rounded-lg border border-primary/20 px-3 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
          >
            Assinar
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Upgrade App Card ─── */
function UpgradeAppCard({ app }: { app: AppWithAccess }) {
  const Icon = getAppIcon(app.app_key);

  return (
    <div className="rounded-xl border border-border bg-card/50 overflow-hidden opacity-60 hover:opacity-80 transition-opacity">
      <div className="h-16 sm:h-20 bg-gradient-to-br from-muted/40 to-transparent flex items-center justify-center relative">
        {Icon ? <Icon className="h-6 w-6 text-muted-foreground/40" strokeWidth={1.5} /> : <AppWindow className="h-6 w-6 text-muted-foreground/30" strokeWidth={1.5} />}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border text-muted-foreground bg-muted border-border">
          <Lock className="h-2.5 w-2.5" />
          Bloqueado
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-medium text-foreground text-sm">{app.app_name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{app.app_description || "Sem descrição."}</p>
        </div>
        <Link
          to="/subscription"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors w-full"
        >
          Fazer upgrade <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
