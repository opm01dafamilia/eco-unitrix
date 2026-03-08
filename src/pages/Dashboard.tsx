import { AppWindow, Activity, Zap, ArrowRight, Clock, ExternalLink, Star } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useApps } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { Link } from "react-router-dom";

const recentActivity = [
  { action: "FitPulse acessado", time: "Há 2 minutos" },
  { action: "FinanceFlow — relatório exportado", time: "Há 15 minutos" },
  { action: "MarketFlow — campanha criada", time: "Há 1 hora" },
  { action: "IA Agenda — agendamento criado", time: "Há 2 horas" },
  { action: "Configurações de perfil atualizadas", time: "Há 1 dia" },
];

export default function Dashboard() {
  const { data: profile } = useProfile();
  const { data: apps } = useApps();
  const { launchApp } = useAppLauncher();

  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";
  const visibleApps = apps?.filter((a) => a.is_visible) ?? [];
  const totalApps = visibleApps.length;
  const activeApps = visibleApps.filter((a) => a.user_access === "active").length;
  const featuredApps = visibleApps.filter((a) => a.is_featured && a.app_status === "active").slice(0, 4);
  const allActiveApps = visibleApps.filter((a) => a.app_status === "active");

  const stats = [
    { label: "Aplicativos Disponíveis", value: String(totalApps), icon: AppWindow, color: "text-primary" },
    { label: "Com Acesso Ativo", value: String(activeApps), icon: Activity, color: "text-primary" },
    { label: "Ações Rápidas", value: "12", icon: Zap, color: "text-primary" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Bem-vindo, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Aqui está o resumo da sua plataforma.</p>
      </div>

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

      {/* Featured Apps */}
      {featuredApps.length > 0 && (
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
                    <span className="text-lg font-display font-bold text-primary">{app.app_name.charAt(0)}</span>
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
      {allActiveApps.length > 0 && (
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
                    <span className="text-sm font-display font-bold text-primary">{app.app_name.charAt(0)}</span>
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
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Atividade Recente
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{item.action}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
              </div>
            ))}
          </div>
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
