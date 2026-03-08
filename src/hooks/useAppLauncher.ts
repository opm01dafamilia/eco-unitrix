import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useAppLauncher() {
  const { user } = useAuth();

  const launchApp = async (app: {
    app_key: string;
    app_name: string;
    app_url: string | null;
    app_status: string;
    user_access: string | null;
  }) => {
    if (app.app_status === "coming_soon") {
      toast.info(`${app.app_name} estará disponível em breve.`);
      return;
    }

    if (app.user_access !== "active") {
      toast.error(`Você não possui acesso ao ${app.app_name}. Entre em contato com o suporte.`);
      return;
    }

    if (!app.app_url) {
      toast.error(`O link de acesso do ${app.app_name} ainda não está configurado.`);
      return;
    }

    // Log usage
    if (user) {
      await supabase.from("app_usage_logs").insert({
        user_id: user.id,
        app_key: app.app_key,
      });
    }

    window.open(app.app_url, "_blank", "noopener,noreferrer");
  };

  return { launchApp };
}
