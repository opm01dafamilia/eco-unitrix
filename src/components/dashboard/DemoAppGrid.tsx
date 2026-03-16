import { AppWindow, ExternalLink, Loader2 } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import type { AppWithAccess } from "@/hooks/useApps";

// Per-app accent colors matching reference
const appColors: Record<string, { border: string; badge: string; badgeText: string; button: string; buttonHover: string }> = {
  financeflow: {
    border: "border-emerald-500/30",
    badge: "bg-emerald-500",
    badgeText: "text-white",
    button: "bg-emerald-500 hover:bg-emerald-600",
    buttonHover: "hover:shadow-emerald-500/20",
  },
  ia_agenda: {
    border: "border-blue-500/30",
    badge: "bg-blue-500",
    badgeText: "text-white",
    button: "bg-blue-500 hover:bg-blue-600",
    buttonHover: "hover:shadow-blue-500/20",
  },
  fitpulse: {
    border: "border-purple-500/30",
    badge: "bg-purple-500",
    badgeText: "text-white",
    button: "bg-purple-500 hover:bg-purple-600",
    buttonHover: "hover:shadow-purple-500/20",
  },
  whatsapp_auto: {
    border: "border-rose-500/30",
    badge: "bg-rose-500",
    badgeText: "text-white",
    button: "bg-rose-500 hover:bg-rose-600",
    buttonHover: "hover:shadow-rose-500/20",
  },
};

const defaultColor = {
  border: "border-primary/30",
  badge: "bg-primary",
  badgeText: "text-primary-foreground",
  button: "bg-primary hover:bg-primary/90",
  buttonHover: "hover:shadow-primary/20",
};

interface DemoAppGridProps {
  apps: AppWithAccess[];
  onLaunch: (app: AppWithAccess) => void;
  launchingAppKey: string | null;
}

export function DemoAppGrid({ apps, onLaunch, launchingAppKey }: DemoAppGridProps) {
  return (
    <section>
      <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4">
        Acesse Nossos Apps Demo
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {apps.map((app) => {
          const Icon = getAppIcon(app.app_key);
          const isLaunching = launchingAppKey === app.app_key;
          const colors = appColors[app.app_key] ?? defaultColor;

          return (
            <div
              key={app.id}
              className={`rounded-xl border ${colors.border} bg-card overflow-hidden transition-all hover:shadow-lg ${colors.buttonHover}`}
            >
              <div className="p-3 sm:p-4 flex flex-col h-full">
                {/* Badge */}
                <span className={`self-start rounded px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide ${colors.badge} ${colors.badgeText} mb-3`}>
                  Conta Demo
                </span>

                {/* Icon + Name */}
                <div className="flex items-center gap-2 mb-1.5">
                  {Icon ? (
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/70" strokeWidth={1.5} />
                  ) : (
                    <AppWindow className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/70" strokeWidth={1.5} />
                  )}
                  <h3 className="font-display font-bold text-foreground text-xs sm:text-sm leading-tight">
                    {app.app_name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                  {app.app_description || "Explore as funcionalidades com IA."}
                </p>

                {/* Button */}
                <button
                  onClick={() => onLaunch(app)}
                  disabled={isLaunching}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-70 ${colors.button}`}
                >
                  {isLaunching ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Abrindo...
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
