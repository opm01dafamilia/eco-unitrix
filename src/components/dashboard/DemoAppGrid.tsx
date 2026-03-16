import { AppWindow, ExternalLink, Loader2 } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { Badge } from "@/components/ui/badge";
import type { AppWithAccess } from "@/hooks/useApps";

interface DemoAppGridProps {
  apps: AppWithAccess[];
  onLaunch: (app: AppWithAccess) => void;
  launchingAppKey: string | null;
}

export function DemoAppGrid({ apps, onLaunch, launchingAppKey }: DemoAppGridProps) {
  return (
    <section>
      <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-5">
        Acesse Nossos Apps Demo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {apps.map((app) => {
          const Icon = getAppIcon(app.app_key);
          const isLaunching = launchingAppKey === app.app_key;
          const hasAccess = app.user_access === "active" && app.access_type !== "inactive";

          return (
            <div
              key={app.id}
              className="rounded-xl border border-border bg-card overflow-hidden card-glow group hover:border-primary/30 transition-all"
            >
              {/* Header band */}
              <div className="h-20 sm:h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center relative">
                {Icon ? (
                  <Icon className="h-9 w-9 text-primary/50" strokeWidth={1.5} />
                ) : (
                  <AppWindow className="h-9 w-9 text-primary/40" strokeWidth={1.5} />
                )}
                <Badge
                  variant="outline"
                  className="absolute top-2.5 right-2.5 text-[9px] sm:text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10"
                >
                  Conta Demo
                </Badge>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">
                    {app.app_name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {app.app_description || "Explore as funcionalidades com IA."}
                  </p>
                </div>
                <button
                  onClick={() => onLaunch(app)}
                  disabled={isLaunching}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs sm:text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] active:scale-[0.97] disabled:opacity-70"
                >
                  {isLaunching ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Abrindo...
                    </>
                  ) : (
                    <>
                      Explorar Demo <ExternalLink className="h-3.5 w-3.5" />
                    </>
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
