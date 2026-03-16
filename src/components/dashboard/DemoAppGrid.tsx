import { AppWindow, Loader2 } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import type { AppWithAccess } from "@/hooks/useApps";

const appAccents: Record<string, { gradient: string; shadow: string; badge: string }> = {
  financeflow: {
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/25",
    badge: "from-emerald-500 to-teal-500",
  },
  ia_agenda: {
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/25",
    badge: "from-blue-500 to-cyan-500",
  },
  fitpulse: {
    gradient: "from-purple-500 to-fuchsia-500",
    shadow: "shadow-purple-500/25",
    badge: "from-purple-500 to-fuchsia-500",
  },
  whatsapp_auto: {
    gradient: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-500/25",
    badge: "from-rose-500 to-pink-500",
  },
};

const defaultAccent = {
  gradient: "from-primary to-accent",
  shadow: "shadow-primary/25",
  badge: "from-primary to-accent",
};

interface DemoAppGridProps {
  apps: AppWithAccess[];
  onLaunch: (app: AppWithAccess) => void;
  launchingAppKey: string | null;
}

export function DemoAppGrid({ apps, onLaunch, launchingAppKey }: DemoAppGridProps) {
  return (
    <section>
      <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-3">
        Acesse Nossos Apps Demo
      </h2>
      {/* 1 col mobile, 2 cols sm, 4 cols lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {apps.map((app) => {
          const Icon = getAppIcon(app.app_key);
          const isLaunching = launchingAppKey === app.app_key;
          const accent = appAccents[app.app_key] ?? defaultAccent;

          return (
            <div
              key={app.id}
              className="rounded-2xl glass-card overflow-hidden card-glow group transition-all hover:border-primary/20"
            >
              <div className="p-4 flex flex-col">
                {/* Badge */}
                <span className={`self-start rounded-md bg-gradient-to-r ${accent.badge} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white mb-3 shadow-sm ${accent.shadow}`}>
                  Conta Demo
                </span>

                {/* Icon + Name */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`rounded-xl bg-gradient-to-br ${accent.gradient} p-2 shrink-0 shadow-md ${accent.shadow}`}>
                    {Icon ? (
                      <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                    ) : (
                      <AppWindow className="h-5 w-5 text-white" strokeWidth={2} />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-foreground text-sm leading-tight">
                    {app.app_name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {app.app_description || "Explore as funcionalidades com IA."}
                </p>

                {/* Button - large touch target */}
                <button
                  onClick={() => onLaunch(app)}
                  disabled={isLaunching}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${accent.gradient} px-4 py-3 text-xs font-bold text-white transition-all active:scale-[0.97] disabled:opacity-70 hover:shadow-lg ${accent.shadow} min-h-[44px]`}
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
