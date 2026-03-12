import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logAccessEvent } from "@/hooks/useAppAccess";
import type { AppWithAccess } from "@/hooks/useApps";

export function useAppLauncher() {
  const { user } = useAuth();
  const [launchingAppKey, setLaunchingAppKey] = useState<string | null>(null);
  const cooldownRef = useRef<Set<string>>(new Set());
  const [blockedApp, setBlockedApp] = useState<{
    appName: string;
    appKey: string;
    reason: "no_subscription" | "expired" | "cancelled" | "suspended";
  } | null>(null);

  const launchApp = useCallback(async (app: AppWithAccess) => {
    // Prevent duplicate clicks
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

    // Start loading & cooldown
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
        try {
          const { data, error } = await supabase.functions.invoke("generate-sso-token", {
            body: { app_key: app.app_key },
          });

          if (!error && data?.sso_token) {
            const url = new URL(app.app_url);
            url.searchParams.set("sso_token", data.sso_token);
            url.searchParams.set("sso_app", app.app_key);
            finalUrl = url.toString();

            await logAccessEvent("sso_token_generated", `Token SSO gerado para ${app.app_name} (usuário: ${user.email})`);
          } else {
            // SSO failed, fallback to normal open
            console.warn("SSO token generation failed, opening normally:", error);
            await logAccessEvent("sso_fallback", `Fallback sem SSO para ${app.app_name} (usuário: ${user.email})`);
          }
        } catch (ssoErr) {
          console.warn("SSO error, falling back:", ssoErr);
          await logAccessEvent("sso_fallback", `Fallback sem SSO para ${app.app_name} (erro: ${ssoErr})`);
        }

        toast.success("Aplicativo aberto!", { id: "sso-launch" });
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
