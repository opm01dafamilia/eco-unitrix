import { AppWindow, Activity, Zap, ArrowRight, Clock, Heart, DollarSign, BarChart3, MessageCircle, CalendarCheck } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useApps } from "@/hooks/useApps";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  fitpulse: Heart,
  financeflow: DollarSign,
  marketflow: BarChart3,
  whatsapp_auto: MessageCircle,
  ia_agenda: CalendarCheck,
};

const colorMap: Record<string, string> = {
  fitpulse: "text-rose-400",
  financeflow: "text-emerald-400",
  marketflow: "text-blue-400",
  whatsapp_auto: "text-green-400",
  ia_agenda: "text-violet-400",
};

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

  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";
  const totalApps = apps?.length ?? 0;
  const activeApps = apps?.filter((a) => a.user_access === "active").length ?? 0;
  const featuredApps = apps?.filter((a) => a.app_status === "active" && a.user_access === "active").slice(0, 4) ?? [];

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
              <AppWindow className="h-4 w-4 text-primary" /> Seus Aplicativos
            </h2>
            <Link to="/apps" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featuredApps.map((app) => {
              const Icon = iconMap[app.app_key] ?? BarChart3;
              const iconColor = colorMap[app.app_key] ?? "text-primary";
              return (
                <Link
                  key={app.id}
                  to="/apps"
                  className="rounded-xl border border-border bg-card p-4 card-glow flex flex-col items-center gap-3 text-center group"
                >
                  <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.app_name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Ativo</p>
                  </div>
                </Link>
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
