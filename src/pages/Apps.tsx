import { Heart, DollarSign, BarChart3, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useApps } from "@/hooks/useApps";

const iconMap: Record<string, React.ElementType> = {
  fitpulse: Heart,
  financeflow: DollarSign,
  marketflow: BarChart3,
  whatsapp_auto: MessageCircle,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  fitpulse: { bg: "from-rose-500/20 to-rose-600/10", icon: "text-rose-400" },
  financeflow: { bg: "from-emerald-500/20 to-emerald-600/10", icon: "text-emerald-400" },
  marketflow: { bg: "from-blue-500/20 to-blue-600/10", icon: "text-blue-400" },
  whatsapp_auto: { bg: "from-green-500/20 to-green-600/10", icon: "text-green-400" },
};

export default function Apps() {
  const { data: apps, isLoading } = useApps();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Meus Aplicativos</h1>
        <p className="text-muted-foreground mt-1">Acesse todos os aplicativos da plataforma.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {apps?.map((app, i) => {
            const Icon = iconMap[app.app_key] ?? BarChart3;
            const colors = colorMap[app.app_key] ?? { bg: "from-primary/20 to-primary/10", icon: "text-primary" };
            const available = app.app_status === "active" && app.user_access === "active";
            const statusLabel = app.app_status === "coming_soon" ? "Em breve" : app.user_access === "active" ? "Ativo" : "Indisponível";

            return (
              <div
                key={app.id}
                className="group rounded-xl border border-border bg-card overflow-hidden card-glow animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`h-24 bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`h-10 w-10 ${colors.icon}`} />
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{app.app_name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{app.app_description}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${available ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs ${available ? "text-primary" : "text-muted-foreground"}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <button
                    disabled={!available}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {available ? "Acessar" : statusLabel}
                    {available && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
