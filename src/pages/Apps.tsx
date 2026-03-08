import { Heart, DollarSign, BarChart3, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";

const apps = [
  {
    name: "FitPulse",
    description: "Aplicativo fitness e acompanhamento físico",
    icon: Heart,
    status: "Ativo",
    available: true,
    color: "from-rose-500/20 to-rose-600/10",
    iconColor: "text-rose-400",
  },
  {
    name: "FinanceFlow",
    description: "Controle e planejamento financeiro",
    icon: DollarSign,
    status: "Ativo",
    available: true,
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
  },
  {
    name: "MarketFlow",
    description: "Ferramentas de marketing digital",
    icon: BarChart3,
    status: "Ativo",
    available: true,
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
  },
  {
    name: "WhatsApp Auto",
    description: "Automação para WhatsApp",
    icon: MessageCircle,
    status: "Em breve",
    available: false,
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-400",
  },
];

export default function Apps() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Meus Aplicativos</h1>
        <p className="text-muted-foreground mt-1">Acesse todos os aplicativos da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {apps.map((app, i) => (
          <div
            key={app.name}
            className="group rounded-xl border border-border bg-card overflow-hidden card-glow animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`h-24 bg-gradient-to-br ${app.color} flex items-center justify-center`}>
              <app.icon className={`h-10 w-10 ${app.iconColor}`} />
            </div>
            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-display font-semibold text-foreground">{app.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{app.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`h-3.5 w-3.5 ${app.available ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs ${app.available ? "text-primary" : "text-muted-foreground"}`}>
                  {app.status}
                </span>
              </div>
              <button
                disabled={!app.available}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {app.available ? "Acessar" : "Em breve"}
                {app.available && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
