import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Gift, Search, XCircle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

const INDIVIDUAL_APPS = [
  { value: "fitpulse", label: "FitPulse" },
  { value: "financeflow", label: "FinanceFlow" },
  { value: "marketflow", label: "MarketFlow" },
  { value: "ia-agenda", label: "IA Agenda" },
  { value: "whatsapp-auto", label: "WhatsApp Auto" },
];

const APP_LABEL_MAP: Record<string, string> = {
  fitpulse: "FitPulse",
  financeflow: "FinanceFlow",
  marketflow: "MarketFlow",
  "ia-agenda": "IA Agenda",
  "whatsapp-auto": "WhatsApp Auto",
};

const statusConfig = {
  active: { label: "Ativo", icon: CheckCircle2, color: "text-primary" },
  expired: { label: "Expirado", icon: Clock, color: "text-muted-foreground" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-destructive" },
} as const;

export default function AdminFreeTrials() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [duration, setDuration] = useState("7");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [granting, setGranting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [conversionFilter, setConversionFilter] = useState<string>("all");

  const allSelected = selectedApps.length === INDIVIDUAL_APPS.length;

  const toggleApp = (appKey: string) => {
    setSelectedApps((prev) =>
      prev.includes(appKey) ? prev.filter((k) => k !== appKey) : [...prev, appKey]
    );
  };

  const toggleAll = () => {
    setSelectedApps(allSelected ? [] : INDIVIDUAL_APPS.map((a) => a.value));
  };

  const { data: trials, isLoading: trialsLoading } = useQuery({
    queryKey: ["admin-free-trials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("free_trials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email");
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  // Fetch active subscriptions to check if trial users converted
  const { data: subscriptions } = useQuery({
    queryKey: ["admin-subscriptions-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("user_id, subscription_status")
        .eq("subscription_status", "active");
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  const subscriberSet = new Set((subscriptions ?? []).map((s) => s.user_id));

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

  const handleGrant = async () => {
    if (!email.trim()) {
      toast({ variant: "destructive", title: "Erro", description: "Informe o e-mail do usuário." });
      return;
    }
    if (selectedApps.length === 0) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione pelo menos um aplicativo." });
      return;
    }

    setGranting(true);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (profileError || !profile) {
      toast({ variant: "destructive", title: "Usuário não encontrado", description: "Nenhum usuário com esse e-mail foi encontrado." });
      setGranting(false);
      return;
    }

    const durationDays = parseInt(duration);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const isAllApps = allSelected;
    const trialType = isAllApps ? "all_apps" : "selected_apps";

    // Create one trial row per selected app, or a single "all_apps" row
    const rows = isAllApps
      ? [{ user_id: profile.user_id, app_key: null as string | null, trial_type: "all_apps", duration_days: durationDays, expires_at: expiresAt.toISOString(), status: "active", granted_by: user?.id ?? null }]
      : selectedApps.map((appKey) => ({
          user_id: profile.user_id,
          app_key: appKey as string | null,
          trial_type: "selected_apps",
          duration_days: durationDays,
          expires_at: expiresAt.toISOString(),
          status: "active",
          granted_by: user?.id ?? null,
        }));

    const { error } = await supabase.from("free_trials").insert(rows);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      const appLabels = isAllApps
        ? "Todos os aplicativos"
        : selectedApps.map((k) => APP_LABEL_MAP[k] ?? k).join(", ");

      await supabase.from("system_logs").insert({
        event_type: "free_trial_granted",
        description: `Teste grátis de ${durationDays} dias liberado para ${profile.email} - ${appLabels}`,
      });

      toast({ title: "Teste liberado!", description: `${durationDays} dias de acesso para ${profile.email}` });
      queryClient.invalidateQueries({ queryKey: ["admin-free-trials"] });
      setEmail("");
      setSelectedApps([]);
    }

    setGranting(false);
  };

  const handleCancel = async (trialId: string, userEmail: string) => {
    const { error } = await supabase
      .from("free_trials")
      .update({ status: "cancelled" })
      .eq("id", trialId);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      await supabase.from("system_logs").insert({
        event_type: "free_trial_cancelled",
        description: `Teste grátis cancelado para ${userEmail}`,
      });
      toast({ title: "Teste cancelado" });
      queryClient.invalidateQueries({ queryKey: ["admin-free-trials"] });
    }
  };

  // Group trials by user+expires to show combined apps
  const filteredTrials = (trials ?? []).filter((t) => {
    const profile = profileMap.get(t.user_id);
    const matchesSearch =
      !search ||
      profile?.email?.toLowerCase().includes(search.toLowerCase()) ||
      profile?.full_name?.toLowerCase().includes(search.toLowerCase());
    const isExpired = t.status === "active" && new Date(t.expires_at) < new Date();
    const effectiveStatus = isExpired ? "expired" : t.status;
    const matchesStatus = statusFilter === "all" || effectiveStatus === statusFilter;
    const isSubscriber = subscriberSet.has(t.user_id);
    const matchesConversion =
      conversionFilter === "all" ||
      (conversionFilter === "subscriber" && isSubscriber) ||
      (conversionFilter === "not_subscriber" && !isSubscriber);
    return matchesSearch && matchesStatus && matchesConversion;
  });

  // Group consecutive trials by user_id + expires_at + status for display
  const groupedTrials: Array<{
    ids: string[];
    user_id: string;
    apps: string[];
    trial_type: string;
    duration_days: number;
    started_at: string;
    expires_at: string;
    status: string;
  }> = [];

  const trialGroupMap = new Map<string, number>();
  filteredTrials.forEach((t) => {
    const groupKey = `${t.user_id}|${t.expires_at}|${t.status}|${t.duration_days}`;
    const existingIdx = trialGroupMap.get(groupKey);
    if (existingIdx !== undefined) {
      const group = groupedTrials[existingIdx];
      group.ids.push(t.id);
      if (t.trial_type === "all_apps") {
        group.apps = ["all_apps"];
        group.trial_type = "all_apps";
      } else if (t.app_key && !group.apps.includes(t.app_key)) {
        group.apps.push(t.app_key);
      }
    } else {
      trialGroupMap.set(groupKey, groupedTrials.length);
      groupedTrials.push({
        ids: [t.id],
        user_id: t.user_id,
        apps: t.trial_type === "all_apps" ? ["all_apps"] : t.app_key ? [t.app_key] : [],
        trial_type: t.trial_type,
        duration_days: t.duration_days,
        started_at: t.started_at,
        expires_at: t.expires_at,
        status: t.status,
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Gift className="h-7 w-7 text-primary" /> Teste Grátis
        </h1>
        <p className="text-muted-foreground mt-1">Libere acesso temporário aos aplicativos para usuários.</p>
      </div>

      {/* Grant trial form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liberar Acesso de Teste</CardTitle>
          <CardDescription>Selecione o usuário, duração e aplicativos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>E-mail do usuário</Label>
              <Input
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="15">15 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGrant} disabled={granting || selectedApps.length === 0}>
              {granting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Liberar Teste
            </Button>
          </div>

          {/* Multi-select checkboxes */}
          <div className="space-y-2">
            <Label>Aplicativos</Label>
            <div className="rounded-lg border border-border bg-background p-3 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium text-foreground cursor-pointer">
                  Todos os aplicativos
                </label>
                {allSelected && (
                  <Badge variant="outline" className="text-primary border-primary/30 text-xs ml-auto">
                    Acesso completo
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {INDIVIDUAL_APPS.map((app) => (
                  <div key={app.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`app-${app.value}`}
                      checked={selectedApps.includes(app.value)}
                      onCheckedChange={() => toggleApp(app.value)}
                    />
                    <label htmlFor={`app-${app.value}`} className="text-sm text-foreground cursor-pointer">
                      {app.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trials table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {trialsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : groupedTrials.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum teste encontrado.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Aplicativos</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Expiração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedTrials.map((group, idx) => {
                const profile = profileMap.get(group.user_id);
                const cfg = statusConfig[group.status as keyof typeof statusConfig] ?? statusConfig.expired;
                const isExpired = group.status === "active" && new Date(group.expires_at) < new Date();

                const appsDisplay = group.apps.includes("all_apps")
                  ? "Todos"
                  : group.apps.map((k) => APP_LABEL_MAP[k] ?? k).join(", ");

                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {profile?.full_name || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {profile?.email || group.user_id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.apps.includes("all_apps") ? (
                          <Badge variant="outline" className="text-primary border-primary/30 text-xs">Todos</Badge>
                        ) : (
                          group.apps.map((k) => (
                            <Badge key={k} variant="outline" className="text-xs">
                              {APP_LABEL_MAP[k] ?? k}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{group.duration_days} dias</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(group.started_at), "dd/MM/yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(group.expires_at), "dd/MM/yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${isExpired ? "text-muted-foreground" : cfg.color} border-current/20 gap-1`}>
                        <cfg.icon className="h-3 w-3" />
                        {isExpired ? "Expirado" : cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {group.status === "active" && !isExpired && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={async () => {
                            for (const id of group.ids) {
                              await handleCancel(id, profile?.email ?? "");
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
