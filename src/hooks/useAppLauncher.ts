import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logAccessEvent } from "@/hooks/useAppAccess";
import type { AppWithAccess } from "@/hooks/useApps";

/** Detect iOS (iPhone/iPad/iPod) */
function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

/** Detect standalone PWA mode */
function isStandalonePWA(): boolean {
  if (typeof window === "undefined") return false;
  return (
    ("standalone" in window.navigator && (window.navigator as any).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export function useAppLauncher() {
  const { user } = useAuth();
  const [launchingAppKey, setLaunchingAppKey] = useState<string | null>(null);
  const cooldownRef = useRef<Set<string>>(new Set());
  const ssoRequiredApps = useRef(new Set(["financeflow"]));
  const [blockedApp, setBlockedApp] = useState<{
    appName: string;
    appKey: string;
    reason: "no_subscription" | "expired" | "cancelled" | "suspended";
  } | null>(null);

  const launchApp = useCallback(async (app: AppWithAccess) => {
    if (cooldownRef.current.has(app.app_key)) return;

    if (app.app_status === "coming_soon") {
      toast.info(`${app.app_name} estará disponível em breve.`);
      return;
    }
    if (app.app_status === "maintenance") {
      toast.warning(`${app.app_name} está em manutenção. Tente novamente mais tarde.`);
      return;
    }
    if (app.app_status === "disabled" || app.app_status === "inactive") {
      toast.error(`${app.app_name} está indisponível no momento.`);
      return;
    }
    if (!user) {
      toast.error("Você precisa estar logado para acessar os aplicativos.");
      return;
    }

    setLaunchingAppKey(app.app_key);
    cooldownRef.current.add(app.app_key);

    try {
      if (app.user_access === "active" && app.access_type !== "inactive") {
        if (!app.app_url) {
          toast.error("Aplicativo ainda não configurado.");
          return;
        }

        toast.loading("Conectando ao aplicativo...", { id: "sso-launch" });

        await logAccessEvent("acesso_permitido", `Acesso permitido ao ${app.app_name} via ${app.access_type} (usuário: ${user.email})`);
        await supabase.from("app_usage_logs").insert({ user_id: user.id, app_key: app.app_key });

        // Generate SSO token
        let finalUrl = app.app_url;
        let hasValidSsoToken = false;
        const requiresSso = ssoRequiredApps.current.has(app.app_key);

        try {
          const { data, error } = await supabase.functions.invoke("generate-sso-token", {
            body: { app_key: app.app_key },
          });

          const ssoToken = typeof data?.sso_token === "string" ? data.sso_token.trim() : "";

          if (!error && ssoToken) {
            const url = new URL(app.app_url);
            url.searchParams.set("sso_token", ssoToken);
            url.searchParams.set("app_key", app.app_key);
            url.searchParams.set("sso_app", app.app_key);
            finalUrl = url.toString();
            hasValidSsoToken = true;

            console.info("[SSO] URL final gerada", { appKey: app.app_key, finalUrl, isIOS: isIOS(), isPWA: isStandalonePWA() });

            await logAccessEvent("sso_token_generated", `Token SSO gerado para ${app.app_name} (usuário: ${user.email})`);
          } else {
            console.warn("SSO token generation failed:", { appKey: app.app_key, error, hasToken: !!ssoToken });
            await logAccessEvent("sso_fallback", `Fallback sem SSO para ${app.app_name} (usuário: ${user.email})`);

            if (requiresSso) {
              toast.error("Não foi possível abrir o aplicativo sem autenticação válida.", { id: "sso-launch" });
              return;
            }
          }
        } catch (ssoErr) {
          console.warn("SSO error, falling back:", ssoErr);
          await logAccessEvent("sso_fallback", `Fallback sem SSO para ${app.app_name} (erro: ${ssoErr})`);

          if (requiresSso) {
            toast.error("Não foi possível abrir o aplicativo sem autenticação válida.", { id: "sso-launch" });
            return;
          }
        }

        if (requiresSso && !hasValidSsoToken) {
          toast.error("Token SSO inválido para abrir o aplicativo.", { id: "sso-launch" });
          return;
        }

        toast.success("Aplicativo aberto!", { id: "sso-launch" });

        // iOS Safari & PWA: window.open with _blank is unreliable.
        // Use location.href to navigate in the same context on iOS PWA,
        // and a real <a> click fallback on iOS Safari.
        const isiOS = isIOS();
        const isPWA = isStandalonePWA();

        console.info("[Navigation] Dispatching", { isiOS, isPWA, finalUrl });

        if (isiOS && isPWA) {
          // In iOS standalone PWA, window.open is blocked. Navigate directly.
          window.location.href = finalUrl;
          return;
        }

        if (isiOS) {
          // iOS Safari: use a temporary <a> element with target to ensure navigation
          const link = document.createElement("a");
          link.href = finalUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          // Clean up after a tick
          setTimeout(() => document.body.removeChild(link), 100);
          return;
        }

        // Desktop / Android: standard window.open
        window.open(finalUrl, "_blank", "noopener,noreferrer");
        return;
      }

      // No access
      await logAccessEvent("acesso_negado", `Acesso negado ao ${app.app_name} (usuário: ${user.email})`);
      setBlockedApp({ appName: app.app_name, appKey: app.app_key, reason: "no_subscription" });
    } finally {
      setLaunchingAppKey(null);
      setTimeout(() => cooldownRef.current.delete(app.app_key), 2000);
    }
  }, [user]);

  return { launchApp, launchingAppKey, blockedApp, clearBlockedApp: () => setBlockedApp(null) };
}
