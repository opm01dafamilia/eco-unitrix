import { Heart, DollarSign, TrendingUp, CalendarDays, MessageSquare, Hexagon, Link2, LogIn, Layers, Sparkles, Rocket, type LucideIcon } from "lucide-react";

interface AppNode {
  name: string;
  icon: LucideIcon;
  category: string;
}

const apps: AppNode[] = [
  { name: "FitPulse", icon: Heart, category: "Saúde" },
  { name: "FinanceFlow", icon: DollarSign, category: "Finanças" },
  { name: "MarketFlow", icon: TrendingUp, category: "Marketing" },
  { name: "IA Agenda", icon: CalendarDays, category: "Agendamento" },
  { name: "WhatsApp Auto", icon: MessageSquare, category: "Automação" },
];

const values = [
  { icon: LogIn, text: "Login único para tudo" },
  { icon: Layers, text: "Plataforma centralizada" },
  { icon: Sparkles, text: "Apps especializados" },
  { icon: Link2, text: "Tudo conectado" },
  { icon: Rocket, text: "Expansão contínua" },
];

export default function EcosystemVisual() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-2">
          <Layers className="h-3.5 w-3.5" />
          Ecossistema
        </div>
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem] text-foreground tracking-tight">
          Uma plataforma, vários apps <span className="gradient-text">conectados</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed text-base">
          Acesse o UNITRIX com login único. Cada aplicativo é especializado, mas todos fazem parte do mesmo sistema integrado.
        </p>
      </div>

      {/* Visual hub */}
      <div className="relative mx-auto max-w-3xl">
        {/* Center hub */}
        <div className="mx-auto flex flex-col items-center">
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-lg shadow-primary/20 backdrop-blur-sm">
            <Hexagon className="h-10 w-10 text-primary" />
          </div>
          <span className="mt-3 text-sm font-extrabold text-foreground tracking-tight">UNITRIX</span>
          <span className="text-[11px] text-muted-foreground">Central de aplicativos</span>
        </div>

        {/* Connector line */}
        <div className="mx-auto my-3 h-8 w-px bg-gradient-to-b from-primary/40 to-border/30 hidden sm:block" />

        {/* App nodes */}
        <div className="mt-6 sm:mt-0 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {apps.map((app) => (
            <div
              key={app.name}
              className="group flex flex-col items-center gap-2.5 rounded-2xl glass-card p-5 transition-all duration-500 card-glow"
            >
              {/* tiny connector on desktop */}
              <div className="hidden sm:block mx-auto -mt-8 mb-1 h-4 w-px bg-border/40 group-hover:bg-primary/40 transition-colors duration-300" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-105">
                <app.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-foreground text-center">{app.name}</span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                {app.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Value pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {values.map((v) => (
          <div
            key={v.text}
            className="flex items-center gap-2 rounded-full glass-card px-4 py-2.5 text-sm text-foreground transition-all duration-300 hover:border-primary/20"
          >
            <v.icon className="h-4 w-4 text-primary shrink-0" />
            {v.text}
          </div>
        ))}
      </div>
    </div>
  );
}
