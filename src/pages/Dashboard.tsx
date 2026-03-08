import { AppWindow, Activity, Zap, ArrowRight, Clock } from "lucide-react";

const stats = [
  { label: "Aplicativos Disponíveis", value: "4", icon: AppWindow, color: "text-primary" },
  { label: "Aplicativos Ativos", value: "3", icon: Activity, color: "text-primary" },
  { label: "Ações Rápidas", value: "12", icon: Zap, color: "text-primary" },
];

const recentActivity = [
  { action: "FitPulse acessado", time: "Há 2 minutos" },
  { action: "FinanceFlow — relatório exportado", time: "Há 15 minutos" },
  { action: "MarketFlow — campanha criada", time: "Há 1 hora" },
  { action: "WhatsApp Auto — automação ativada", time: "Há 3 horas" },
  { action: "Configurações de perfil atualizadas", time: "Há 1 dia" },
];

const shortcuts = [
  { label: "Abrir FitPulse", href: "/apps" },
  { label: "Ver relatórios", href: "/apps" },
  { label: "Configurar conta", href: "/settings" },
  { label: "Ver perfil", href: "/profile" },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Bem-vindo, <span className="gradient-text">João</span>
        </h1>
        <p className="text-muted-foreground mt-1">Aqui está o resumo da sua plataforma.</p>
      </div>

      {/* Stats */}
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Atividade Recente
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-sm text-foreground">{item.action}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Atalhos Rápidos
          </h2>
          <div className="space-y-2">
            {shortcuts.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary/60 hover:border-primary/30 group"
              >
                {s.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
