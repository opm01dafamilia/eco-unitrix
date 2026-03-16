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
      <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-4 tracking-tight">
        Acesse Nossos Apps Demo
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {apps.map((app, i) => {
          const Icon = getAppIcon(app.app_key);
          const isLaunching = launchingAppKey === app.app_key;
          const accent = appAccents[app.app_key] ?? defaultAccent;

          return (
            <div
              key={app.id}
              className="rounded-2xl glass-card overflow-hidden card-glow group"
              style={{ animationDelay: `${0.12 + i * 0.04}s` }}
            >
              {/* Subtle top glow line */}
              <div className={`h-[2px] bg-gradient-to-r ${accent.gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />

              <div className="p-4 sm:p-5 flex flex-col">
                {/* Badge */}
                <span className={`self-start rounded-md bg-gradient-to-r ${accent.badge} px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white mb-4 shadow-sm ${accent.shadow}`}>
                  Conta Demo
                </span>

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`rounded-xl bg-gradient-to-br ${accent.gradient} p-2.5 shrink-0 shadow-lg ${accent.shadow}`}>
                    {Icon ? (
                      <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                    ) : (
                      <AppWindow className="h-5 w-5 text-white" strokeWidth={1.8} />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-foreground text-sm leading-tight tracking-tight">
                    {app.app_name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[11px] text-muted-foreground/70 line-clamp-2 mb-5 leading-relaxed flex-1">
                  {app.app_description || "Explore as funcionalidades com IA."}
                </p>

                {/* Button */}
                <button
                  onClick={() => onLaunch(app)}
                  disabled={isLaunching}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${accent.gradient} px-4 py-3 text-xs font-bold text-white transition-all duration-300 active:scale-[0.97] disabled:opacity-60 hover:shadow-lg ${accent.shadow} min-h-[46px]`}
                >
                  {isLaunching ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Abrindo...
                    </>
                  ) : (
                    "Explorar Demo"
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
