import { AppWindow, Loader2 } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import type { AppWithAccess } from "@/hooks/useApps";

const appAccents: Record<string, { gradient: string; shadow: string; badge: string; glow: string }> = {
  financeflow: {
    gradient: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/20",
    badge: "from-emerald-500 to-teal-400",
    glow: "hsl(160 60% 45% / 0.08)",
  },
  ia_agenda: {
    gradient: "from-blue-500 to-sky-400",
    shadow: "shadow-blue-500/20",
    badge: "from-blue-500 to-sky-400",
    glow: "hsl(210 70% 50% / 0.08)",
  },
  fitpulse: {
    gradient: "from-violet-500 to-purple-400",
    shadow: "shadow-violet-500/20",
    badge: "from-violet-500 to-purple-400",
    glow: "hsl(270 60% 55% / 0.08)",
  },
  whatsapp_auto: {
    gradient: "from-rose-500 to-pink-400",
    shadow: "shadow-rose-500/20",
    badge: "from-rose-500 to-pink-400",
    glow: "hsl(350 60% 50% / 0.08)",
  },
  marketflow: {
    gradient: "from-amber-500 to-orange-400",
    shadow: "shadow-amber-500/20",
    badge: "from-amber-500 to-orange-400",
    glow: "hsl(30 70% 50% / 0.08)",
  },
};

const defaultAccent = {
  gradient: "from-primary to-accent",
  shadow: "shadow-primary/20",
  badge: "from-primary to-accent",
  glow: "hsl(255 80% 65% / 0.08)",
};

interface DemoAppGridProps {
  apps: AppWithAccess[];
  onLaunch: (app: AppWithAccess) => void;
  launchingAppKey: string | null;
}

export function DemoAppGrid({ apps, onLaunch, launchingAppKey }: DemoAppGridProps) {
  return (
    <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-5 tracking-tight">
        Seus Aplicativos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {apps.map((app, i) => {
          const Icon = getAppIcon(app.app_key);
          const isLaunching = launchingAppKey === app.app_key;
          const accent = appAccents[app.app_key] ?? defaultAccent;

          return (
            <div
              key={app.id}
              className="rounded-2xl glass-card overflow-hidden group transition-all duration-500 hover:border-primary/20"
              style={{
                animationDelay: `${0.12 + i * 0.04}s`,
                boxShadow: `0 0 0 0 transparent`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 20px 2px ${accent.glow.replace('0.08', '0.18')}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 0 transparent`; }}
            >
              {/* Top accent line */}
              <div className={`h-[2px] bg-gradient-to-r ${accent.gradient} opacity-30 group-hover:opacity-90 transition-opacity duration-500`} />

              <div className="p-5 sm:p-6 flex flex-col min-h-[240px]">
                {/* Badge */}
                <span className={`self-start rounded-lg bg-gradient-to-r ${accent.badge} px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white mb-5 shadow-sm ${accent.shadow}`}>
                  Teste Grátis
                </span>

                {/* Icon + Name */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`rounded-xl bg-gradient-to-br ${accent.gradient} p-3 shrink-0 shadow-lg ${accent.shadow}`}>
                    {Icon ? (
                      <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                    ) : (
                      <AppWindow className="h-5 w-5 text-white" strokeWidth={1.8} />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-[15px] leading-snug tracking-tight">
                    {app.app_name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground/70 line-clamp-2 mb-6 leading-relaxed flex-1">
                  {app.app_description || "Explore as funcionalidades com IA."}
                </p>

                {/* Button */}
                <button
                  onClick={() => onLaunch(app)}
                  disabled={isLaunching}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${accent.gradient} px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 active:scale-[0.97] disabled:opacity-60 hover:shadow-xl hover:brightness-110 hover:scale-[1.02] ${accent.shadow} min-h-[48px]`}
                >
                  {isLaunching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Abrindo...
                    </>
                  ) : (
                    "Abrir App"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
