import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logAccessEvent } from "@/hooks/useAppAccess";
import type { AppWithAccess } from "@/hooks/useApps";

export function useAppLauncher() {
  const { user } = useAuth();
  const [blockedApp, setBlockedApp] = useState<{
    appName: string;
    appKey: string;
    reason: "no_subscription" | "expired" | "cancelled" | "suspended";
  } | null>(null);

  const launchApp = async (app: AppWithAccess) => {
    if (app.app_status === "coming_soon") {
      toast.info(`${app.app_name} estará disponível em breve.`);
      return;
    }
    if (app.app_status === "maintenance") {
      toast.warning(`${app.app_name} está em manutenção. Tente novamente mais tarde.`);
      return;
    }
    if (app.app_status === "disabled") {
      toast.error(`${app.app_name} está desativado no momento.`);
      return;
    }
    if (!user) {
      toast.error("Você precisa estar logado para acessar os aplicativos.");
      return;
    }

    // If useApps already determined access is active (lifetime, paid, or trial)
    if (app.user_access === "active" && app.access_type !== "inactive") {
      if (!app.app_url) {
        toast.error(`O link de acesso do ${app.app_name} ainda não está configurado.`);
        return;
      }
      await logAccessEvent("acesso_permitido", `Acesso permitido ao ${app.app_name} via ${app.access_type} (usuário: ${user.email})`);
      await supabase.from("app_usage_logs").insert({ user_id: user.id, app_key: app.app_key });
      window.open(app.app_url, "_blank", "noopener,noreferrer");
      return;
    }

    // No access
    await logAccessEvent("acesso_negado", `Acesso negado ao ${app.app_name} (usuário: ${user.email})`);
    setBlockedApp({ appName: app.app_name, appKey: app.app_key, reason: "no_subscription" });
  };

  return { launchApp, blockedApp, clearBlockedApp: () => setBlockedApp(null) };
}
