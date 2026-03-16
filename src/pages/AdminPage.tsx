import { Shield, Loader2, Webhook, CreditCard, Activity, Gift, Users, AppWindow, LayoutDashboard } from "lucide-react";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Navigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminWebhookInfo } from "@/components/admin/AdminWebhookInfo";
import { AdminAppManagement } from "@/components/admin/AdminAppManagement";

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            Administração
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Painel central de gerenciamento do ecossistema.</p>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { to: "/admin/webhook-logs", icon: Webhook, label: "Webhooks" },
            { to: "/admin/subscriptions", icon: CreditCard, label: "Assinaturas" },
            { to: "/admin/system-logs", icon: Activity, label: "Logs" },
            { to: "/admin/free-trials", icon: Gift, label: "Trials" },
            { to: "/admin/user-access", icon: Users, label: "Acessos" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors"
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <AdminStatsCards />

      {/* Tabbed sections */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-card border border-border h-auto p-1 flex-wrap">
          <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="apps" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <AppWindow className="h-4 w-4" />
            <span className="hidden sm:inline">Aplicativos</span>
          </TabsTrigger>
          <TabsTrigger value="webhook" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Webhook className="h-4 w-4" />
            <span className="hidden sm:inline">Webhook</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <AdminUserManagement />
        </TabsContent>

        <TabsContent value="apps" className="mt-4">
          <AdminAppManagement />
        </TabsContent>

        <TabsContent value="webhook" className="mt-4">
          <AdminWebhookInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
