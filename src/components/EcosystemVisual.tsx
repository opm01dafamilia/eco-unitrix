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
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold sm:text-4xl text-foreground">
          Uma plataforma, vários aplicativos conectados
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Acesse um ecossistema completo com login único. Cada aplicativo é especializado, mas todos fazem parte do mesmo sistema integrado.
        </p>
      </div>

      {/* Visual hub */}
      <div className="relative mx-auto max-w-3xl">
        {/* Center hub */}
        <div className="mx-auto flex flex-col items-center">
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary bg-primary/10 shadow-lg shadow-primary/20">
            <Hexagon className="h-10 w-10 text-primary" />
          </div>
          <span className="mt-2 text-sm font-bold text-foreground">Platform Hub</span>
          <span className="text-[11px] text-muted-foreground">Centro do ecossistema</span>
        </div>

        {/* Connector line */}
        <div className="mx-auto my-3 h-8 w-px bg-gradient-to-b from-primary/60 to-border hidden sm:block" />

        {/* App nodes */}
        <div className="mt-6 sm:mt-0 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {apps.map((app) => (
            <div
              key={app.name}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* tiny connector on desktop */}
              <div className="hidden sm:block mx-auto -mt-8 mb-1 h-4 w-px bg-border group-hover:bg-primary/40 transition-colors" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <app.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-foreground text-center">{app.name}</span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
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
            className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm text-foreground"
          >
            <v.icon className="h-4 w-4 text-primary shrink-0" />
            {v.text}
          </div>
        ))}
      </div>
    </div>
  );
}
