import { AppWindow, Activity, Zap, ArrowRight, Clock, ExternalLink, Star, AlertTriangle, Crown } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { useProfile } from "@/hooks/useProfile";
import { useApps } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AccessBlockedModal } from "@/components/AccessBlockedModal";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: apps, isLoading: appsLoading, isError: appsError } = useApps();
  const { launchApp, blockedApp, clearBlockedApp } = useAppLauncher();

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
  });

  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";
  const visibleApps = apps?.filter((a) => a.is_visible) ?? [];
  const totalApps = visibleApps.length;
  const activeApps = visibleApps.filter((a) => a.user_access === "active").length;
  const featuredApps = visibleApps.filter((a) => a.is_featured && a.app_status === "active").slice(0, 4);
  const allActiveApps = visibleApps.filter((a) => a.app_status === "active");
  const plan = subscription?.subscription_plans as { plan_name: string } | null;

  const isLoading = profileLoading || appsLoading;

  const stats = [
    { label: "Aplicativos Disponíveis", value: String(totalApps), icon: AppWindow, color: "text-primary" },
    { label: "Com Acesso Ativo", value: String(activeApps), icon: Activity, color: "text-primary" },
    { label: "Ações Rápidas", value: "12", icon: Zap, color: "text-primary" },
  ];

  const appNameMap = new Map(visibleApps.map((a) => [a.app_key, a.app_name]));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Bem-vindo, <span className="gradient-text">{isLoading ? "..." : firstName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Aqui está o resumo da sua plataforma.</p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : appsError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Erro ao carregar dados</p>
            <p className="text-xs text-muted-foreground mt-0.5">Não foi possível carregar os aplicativos. Tente recarregar a página.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 card-glow">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="font-display text-3xl font-bold text-foreground mt-2">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Account Summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Crown className="h-4 w-4 text-primary" /> Resumo da Conta
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Plano</p>
            <p className="font-medium text-foreground mt-0.5">{plan?.plan_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Apps com acesso</p>
            <p className="font-medium text-foreground mt-0.5">{activeApps}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total de acessos</p>
            <p className="font-medium text-foreground mt-0.5">{recentLogs?.length ?? 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Membro desde</p>
            <p className="font-medium text-foreground mt-0.5">
              {profile?.created_at ? format(new Date(profile.created_at), "MMM yyyy", { locale: ptBR }) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Apps */}
      {!isLoading && featuredApps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> Apps em Destaque
            </h2>
            <Link to="/apps" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featuredApps.map((app) => {
              const hasAccess = app.user_access === "active";
              return (
                <button
                  key={app.id}
                  onClick={() => launchApp(app)}
                  disabled={!hasAccess}
                  className="rounded-xl border border-primary/20 ring-1 ring-primary/10 bg-card p-4 card-glow flex flex-col items-center gap-3 text-center group hover:border-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {(() => { const Icon = getAppIcon(app.app_key); return Icon ? <Icon className="h-5 w-5 text-primary" /> : <AppWindow className="h-5 w-5 text-primary" />; })()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.app_name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1 justify-center">
                      {hasAccess ? <>Abrir <ExternalLink className="h-2.5 w-2.5" /></> : "Sem acesso"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All Apps Quick Access */}
      {!isLoading && allActiveApps.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Aplicativos mais utilizados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allActiveApps.map((app) => {
              const hasAccess = app.user_access === "active";
              return (
                <button
                  key={app.id}
                  onClick={() => launchApp(app)}
                  disabled={!hasAccess}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 card-glow group hover:border-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="h-9 w-9 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    {(() => { const Icon = getAppIcon(app.app_key); return Icon ? <Icon className="h-4 w-4 text-primary" /> : <AppWindow className="h-4 w-4 text-primary" />; })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{app.app_name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{app.app_description}</p>
                  </div>
                  {hasAccess && (
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity - now from real data */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Atividade Recente
          </h2>
          {!recentLogs || recentLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma atividade registrada ainda.</p>
              <p className="text-xs mt-1">Acesse um aplicativo para começar.</p>
            </div>
          ) : (
            <div className="space-y-3">
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

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
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
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary/60 hover:border-primary/30 group"
              >
                {s.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
