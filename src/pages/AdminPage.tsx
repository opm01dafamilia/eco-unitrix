import { useState } from "react";
import { Shield, CheckCircle2, XCircle, Wrench, Loader2, Webhook, CreditCard, Activity } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { useApps } from "@/hooks/useApps";
import { useIsAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AppWindow } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users } from "lucide-react";

const statusOptions = [
  { value: "active", label: "Ativo", icon: CheckCircle2, color: "text-primary" },
  { value: "inactive", label: "Inativo", icon: XCircle, color: "text-muted-foreground" },
  { value: "maintenance", label: "Manutenção", icon: Wrench, color: "text-orange-400" },
] as const;

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: apps, isLoading: appsLoading } = useApps();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  if (adminLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const handleStatusChange = async (appKey: string, newStatus: string) => {
    setUpdating(appKey);
    const { error } = await supabase
      .from("platform_apps")
      .update({ app_status: newStatus })
      .eq("app_key", appKey);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: "Status atualizado", description: `Aplicativo atualizado para "${newStatus}".` });
      queryClient.invalidateQueries({ queryKey: ["platform-apps"] });
    }
    setUpdating(null);
  };

  const allApps = apps ?? [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" /> Administração
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie os aplicativos e visualize logs do sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Link to="/admin/webhook-logs">
          <Card className="hover:bg-secondary/20 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Webhook className="h-5 w-5 text-primary" />
                Webhook Logs
              </CardTitle>
              <CardDescription>
                Eventos recebidos da Kiwify
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/subscriptions">
          <Card className="hover:bg-secondary/20 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                Assinaturas
              </CardTitle>
              <CardDescription>
                Gerenciar assinaturas dos usuários
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/system-logs">
          <Card className="hover:bg-secondary/20 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                Eventos do Sistema
              </CardTitle>
              <CardDescription>
                Logs de eventos e erros
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/free-trials">
          <Card className="hover:bg-secondary/20 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gift className="h-5 w-5 text-primary" />
                Teste Grátis
              </CardTitle>
              <CardDescription>
                Liberar acesso de teste para usuários
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/user-access">
          <Card className="hover:bg-secondary/20 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Controle de Acesso
              </CardTitle>
              <CardDescription>
                Tipos de acesso por usuário e aplicativo
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Gerenciar Aplicativos
        </h2>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 sm:px-5 py-3 border-b border-border bg-secondary/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Aplicativo</span>
          <span>Status atual</span>
          <span>Ação</span>
        </div>

        {allApps.map((app) => {
          const Icon = getAppIcon(app.app_key) || AppWindow;
          const current = statusOptions.find((s) => s.value === app.app_status) ?? statusOptions[0];
          const isUpdating = updating === app.app_key;

          return (
            <div
              key={app.id}
              className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto] items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{app.app_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{app.app_key}</p>
                </div>
              </div>

              <div className="hidden sm:block">
                <Badge
                  variant="outline"
                  className={`${current.color} border-current/20 gap-1`}
                >
                  <current.icon className="h-3 w-3" />
                  {current.label}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    disabled={isUpdating || app.app_status === opt.value}
                    onClick={() => handleStatusChange(app.app_key, opt.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                      app.app_status === opt.value
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title={opt.label}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : opt.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
