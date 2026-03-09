import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logAccessEvent } from "@/hooks/useAppAccess";

export function useAppLauncher() {
  const { user } = useAuth();
  const [blockedApp, setBlockedApp] = useState<{
    appName: string;
    appKey: string;
    reason: "no_subscription" | "expired" | "cancelled" | "suspended";
  } | null>(null);

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

    // Check subscription status
    const { data: subs, error } = await supabase
      .from("user_subscriptions")
      .select("status, subscription_status, expires_at")
      .eq("user_id", user.id)
      .eq("app_key", app.app_key)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      toast.error("Erro ao verificar sua assinatura.");
      return;
    }

    if (!subs || subs.length === 0) {
      await logAccessEvent("acesso_negado", `Acesso negado ao ${app.app_name} por assinatura inexistente (usuário: ${user.email})`);
      setBlockedApp({ appName: app.app_name, reason: "no_subscription" });
      return;
    }

    const sub = subs[0];
    const subStatus = sub.subscription_status || sub.status;

    if (subStatus === "cancelled") {
      await logAccessEvent("acesso_negado", `Acesso negado ao ${app.app_name} por assinatura cancelada (usuário: ${user.email})`);
      setBlockedApp({ appName: app.app_name, reason: "cancelled" });
      return;
    }

    if (subStatus === "suspended" || subStatus === "overdue") {
      await logAccessEvent("acesso_negado", `Acesso negado ao ${app.app_name} por assinatura suspensa (usuário: ${user.email})`);
      setBlockedApp({ appName: app.app_name, reason: "suspended" });
      return;
    }

    if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
      await logAccessEvent("acesso_negado", `Acesso negado ao ${app.app_name} por assinatura expirada (usuário: ${user.email})`);
      setBlockedApp({ appName: app.app_name, reason: "expired" });
      return;
    }

    if (subStatus !== "active") {
      await logAccessEvent("acesso_negado", `Acesso negado ao ${app.app_name} por assinatura inativa (usuário: ${user.email})`);
      setBlockedApp({ appName: app.app_name, reason: "no_subscription" });
      return;
    }

    if (!app.app_url) {
      toast.error(`O link de acesso do ${app.app_name} ainda não está configurado.`);
      return;
    }

    // Log successful access
    await logAccessEvent("acesso_permitido", `Acesso permitido ao ${app.app_name} (usuário: ${user.email})`);

    // Log usage
    await supabase.from("app_usage_logs").insert({
      user_id: user.id,
      app_key: app.app_key,
    });

    window.open(app.app_url, "_blank", "noopener,noreferrer");
  };

  return { launchApp, blockedApp, clearBlockedApp: () => setBlockedApp(null) };
}
