import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useApps } from "@/hooks/useApps";
import { getAppIcon } from "@/lib/appIcons";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppWindow, CheckCircle2, XCircle, Wrench, Loader2 } from "lucide-react";

const statusOptions = [
  { value: "active", label: "Ativo", icon: CheckCircle2, color: "text-primary" },
  { value: "inactive", label: "Inativo", icon: XCircle, color: "text-muted-foreground" },
  { value: "maintenance", label: "Manutenção", icon: Wrench, color: "text-orange-400" },
] as const;

export function AdminAppManagement() {
  const { data: apps } = useApps();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (appKey: string, newStatus: string) => {
    setUpdating(appKey);
    const { error } = await supabase.from("platform_apps").update({ app_status: newStatus }).eq("app_key", appKey);
    if (!error) {
      toast({ title: "Status atualizado" });
      queryClient.invalidateQueries({ queryKey: ["platform-apps"] });
    }
    setUpdating(null);
  };

  const handleToggle = async (appKey: string, field: "is_visible" | "is_featured", value: boolean) => {
    setUpdating(appKey);
    const { error } = await supabase.from("platform_apps").update({ [field]: value }).eq("app_key", appKey);
    if (!error) {
      toast({ title: "Atualizado" });
      queryClient.invalidateQueries({ queryKey: ["platform-apps"] });
    }
    setUpdating(null);
  };

  const allApps = apps ?? [];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-foreground">Gerenciar Aplicativos</h2>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aplicativo</TableHead>
              <TableHead>Chave</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Visível</TableHead>
              <TableHead className="text-center">Destaque</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allApps.map((app) => {
              const Icon = getAppIcon(app.app_key) || AppWindow;
              const current = statusOptions.find((s) => s.value === app.app_status) ?? statusOptions[0];
              const isUpdating = updating === app.app_key;

              return (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{app.app_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{app.app_key}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${current.color} border-current/20 gap-1`}>
                      <current.icon className="h-3 w-3" />
                      {current.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={app.is_visible}
                      onCheckedChange={(v) => handleToggle(app.app_key, "is_visible", v)}
                      disabled={isUpdating}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={app.is_featured}
                      onCheckedChange={(v) => handleToggle(app.app_key, "is_featured", v)}
                      disabled={isUpdating}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          disabled={isUpdating || app.app_status === opt.value}
                          onClick={() => handleStatusChange(app.app_key, opt.value)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                            app.app_status === opt.value
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : opt.label}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
