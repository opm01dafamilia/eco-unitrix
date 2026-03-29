import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApps } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { AccessBlockedModal } from "@/components/AccessBlockedModal";
import { Hexagon, Layers, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DestinationChooser() {
  const navigate = useNavigate();
  const { data: apps, isLoading } = useApps();
  const { launchApp, launchingAppKey, blockedApp, clearBlockedApp } = useAppLauncher();
  const [showApps, setShowApps] = useState(false);

  const accessibleApps = apps?.filter(
    (app) =>
      app.is_visible &&
      app.user_access === "active" &&
      app.access_type !== "inactive" &&
      app.app_status === "active"
  ) ?? [];

  const accessBadgeLabel = (type: string) => {
    if (type === "lifetime") return "Vitalício";
    if (type === "trial") return "Trial";
    if (type === "paid") return "Assinante";
    return null;
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 overflow-y-auto">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Hexagon className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Onde você deseja ir?
          </h1>
          <p className="text-muted-foreground text-sm">
            Escolha seu destino para continuar
          </p>
        </div>

        {!showApps ? (
          /* Main choices */
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Layers className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">UNITRIX</p>
                <p className="text-xs text-muted-foreground">
                  Acesse o centro de controle da UNITRIX
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>

            <button
              onClick={() => setShowApps(true)}
              className="w-full group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">Aplicativo</p>
                <p className="text-xs text-muted-foreground">
                  {isLoading
                    ? "Carregando..."
                    : accessibleApps.length > 0
                    ? `${accessibleApps.length} app${accessibleApps.length > 1 ? "s" : ""} disponíve${accessibleApps.length > 1 ? "is" : "l"}`
                    : "Nenhum app liberado"}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          </div>
        ) : (
          /* App list */
          <div className="space-y-3">
            <button
              onClick={() => setShowApps(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar
            </button>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[72px] rounded-xl" />
                ))}
              </div>
            ) : accessibleApps.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Você ainda não tem acesso a nenhum aplicativo.
                </p>
                <button
                  onClick={() => navigate("/subscription")}
                  className="mt-3 text-sm text-primary hover:underline font-medium"
                >
                  Ver planos disponíveis
                </button>
              </div>
            ) : (
              accessibleApps.map((app) => {
                const Icon = getAppIcon(app.app_key);
                const badge = accessBadgeLabel(app.access_type);
                const isLaunching = launchingAppKey === app.app_key;

                return (
                  <button
                    key={app.id}
                    onClick={() => launchApp(app)}
                    disabled={isLaunching}
                    className="w-full group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 disabled:opacity-60"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {isLaunching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : Icon ? (
                        <Icon className="h-5 w-5" />
                      ) : (
                        <Hexagon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm truncate">
                          {app.app_name}
                        </p>
                        {badge && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 shrink-0"
                          >
                            {badge}
                          </Badge>
                        )}
                      </div>
                      {app.app_description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {app.app_description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Footer link */}
        <p className="text-center text-xs text-muted-foreground">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:underline"
          >
            Pular e ir ao painel
          </button>
        </p>
      </div>

      <AccessBlockedModal
        open={!!blockedApp}
        onOpenChange={(open) => { if (!open) clearBlockedApp(); }}
        appName={blockedApp?.appName ?? ""}
        appKey={blockedApp?.appKey ?? ""}
        reason={blockedApp?.reason ?? "no_subscription"}
      />
    </div>
  );
}