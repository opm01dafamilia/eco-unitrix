import { Shield, Loader2, Webhook, CreditCard, Activity, Gift, Users } from "lucide-react";
import { useApps } from "@/hooks/useApps";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Navigate, Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminWebhookInfo } from "@/components/admin/AdminWebhookInfo";
import { AdminAppManagement } from "@/components/admin/AdminAppManagement";

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { isLoading: appsLoading } = useApps();

  if (adminLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" /> Administração
        </h1>
        <p className="text-muted-foreground mt-1">Painel central de gerenciamento do ecossistema.</p>
      </div>

      {/* Stats */}
      <AdminStatsCards />

      {/* Quick links + Webhook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/admin/webhook-logs">
            <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Webhook className="h-4 w-4 text-primary" />Webhook Logs
                </CardTitle>
                <CardDescription className="text-xs">Eventos da Kiwify</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/admin/subscriptions">
            <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4 text-primary" />Assinaturas
                </CardTitle>
                <CardDescription className="text-xs">Gerenciar assinaturas</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/admin/system-logs">
            <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-primary" />Eventos
                </CardTitle>
                <CardDescription className="text-xs">Logs do sistema</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/admin/free-trials">
            <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gift className="h-4 w-4 text-primary" />Teste Grátis
                </CardTitle>
                <CardDescription className="text-xs">Liberar acesso de teste</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
        <AdminWebhookInfo />
      </div>

      {/* User Management */}
      <AdminUserManagement />

      {/* App Management */}
      <AdminAppManagement />
    </div>
  );
}
