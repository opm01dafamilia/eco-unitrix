import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useApps } from "@/hooks/useApps";
import { getAppIcon } from "@/lib/appIcons";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AppWindow, CheckCircle2, XCircle, Wrench, Loader2, Users, Gift } from "lucide-react";

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

  // Fetch user counts per app
  const { data: appUserCounts } = useQuery({
    queryKey: ["admin-app-user-counts"],
    queryFn: async () => {
      const [{ data: subs }, { data: trials }, { data: lifetimes }] = await Promise.all([
        supabase.from("user_subscriptions").select("app_key, user_id").eq("subscription_status", "active"),
        supabase.from("free_trials").select("app_key, trial_type, user_id").eq("status", "active"),
        supabase.from("lifetime_access").select("user_id"),
      ]);

      const counts: Record<string, { total: number; trials: number }> = {};

      // Count subscriptions per app
      (subs ?? []).forEach((s) => {
        const key = s.app_key ?? "ecosystem";
        if (!counts[key]) counts[key] = { total: 0, trials: 0 };
        counts[key].total++;
      });

      // Count trials per app
      (trials ?? []).forEach((t) => {
        const key = t.trial_type === "all_apps" ? "all_apps" : (t.app_key ?? "all_apps");
        if (!counts[key]) counts[key] = { total: 0, trials: 0 };
        counts[key].trials++;
        counts[key].total++;
      });

      // Lifetime users get all apps
      const lifetimeCount = lifetimes?.length ?? 0;
      counts["_lifetime"] = { total: lifetimeCount, trials: 0 };

      return counts;
    },
    staleTime: 30000,
  });

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

  const getAppUserCount = (appKey: string) => {
    if (!appUserCounts) return { total: 0, trials: 0 };
    const direct = appUserCounts[appKey] ?? { total: 0, trials: 0 };
    const ecosystem = appUserCounts["ecosystem"] ?? { total: 0, trials: 0 };
    const allApps = appUserCounts["all_apps"] ?? { total: 0, trials: 0 };
    const lifetime = appUserCounts["_lifetime"] ?? { total: 0, trials: 0 };
    return {
      total: direct.total + ecosystem.total + allApps.total + lifetime.total,
      trials: direct.trials + allApps.trials,
    };
  };

  const allApps = apps ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allApps.map((app) => {
          const Icon = getAppIcon(app.app_key) || AppWindow;
          const current = statusOptions.find((s) => s.value === app.app_status) ?? statusOptions[0];
          const isUpdating = updating === app.app_key;
          const counts = getAppUserCount(app.app_key);

          return (
            <div
              key={app.id}
              className="rounded-xl border border-border bg-card p-4 space-y-4 hover:border-primary/20 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{app.app_name}</p>
                    <code className="text-[10px] text-muted-foreground">{app.app_key}</code>
                  </div>
                </div>
                <Badge variant="outline" className={`${current.color} border-current/20 gap-1 text-[10px] shrink-0`}>
                  <current.icon className="h-3 w-3" />
                  {current.label}
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {counts.total} usuários
                </span>
                <span className="flex items-center gap-1.5">
                  <Gift className="h-3.5 w-3.5" />
                  {counts.trials} em trial
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Switch
                      checked={app.is_visible}
                      onCheckedChange={(v) => handleToggle(app.app_key, "is_visible", v)}
                      disabled={isUpdating}
                      className="scale-90"
                    />
                    Visível
                  </label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Switch
                      checked={app.is_featured}
                      onCheckedChange={(v) => handleToggle(app.app_key, "is_featured", v)}
                      disabled={isUpdating}
                      className="scale-90"
                    />
                    Destaque
                  </label>
                </div>
              </div>

              {/* Status buttons */}
              <div className="flex items-center gap-1.5">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    disabled={isUpdating || app.app_status === opt.value}
                    onClick={() => handleStatusChange(app.app_key, opt.value)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors border ${
                      app.app_status === opt.value
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : opt.label}
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
