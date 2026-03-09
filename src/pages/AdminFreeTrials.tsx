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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Gift, Search, XCircle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

const APP_OPTIONS = [
  { value: "all_apps", label: "Todos os aplicativos" },
  { value: "fitpulse", label: "FitPulse" },
  { value: "financeflow", label: "FinanceFlow" },
  { value: "marketflow", label: "MarketFlow" },
  { value: "ia-agenda", label: "IA Agenda" },
  { value: "whatsapp-auto", label: "WhatsApp Auto" },
];

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
  const [appChoice, setAppChoice] = useState("all_apps");
  const [granting, setGranting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  // Fetch profiles to display user info
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

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.user_id, p])
  );

  const handleGrant = async () => {
    if (!email.trim()) {
      toast({ variant: "destructive", title: "Erro", description: "Informe o e-mail do usuário." });
      return;
    }

    setGranting(true);

    // Find user by email in profiles
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

    const trialType = appChoice === "all_apps" ? "all_apps" : "single_app";
    const appKey = appChoice === "all_apps" ? null : appChoice;

    const { error } = await supabase.from("free_trials").insert({
      user_id: profile.user_id,
      app_key: appKey,
      trial_type: trialType,
      duration_days: durationDays,
      expires_at: expiresAt.toISOString(),
      status: "active",
      granted_by: user?.id,
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      const appLabel = APP_OPTIONS.find((a) => a.value === appChoice)?.label ?? appChoice;
      await supabase.from("system_logs").insert({
        event_type: "free_trial_granted",
        description: `Teste grátis de ${durationDays} dias liberado para ${profile.email} - ${appLabel}`,
      });

      toast({ title: "Teste liberado!", description: `${durationDays} dias de acesso para ${profile.email}` });
      queryClient.invalidateQueries({ queryKey: ["admin-free-trials"] });
      setEmail("");
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

  const filteredTrials = (trials ?? []).filter((t) => {
    const profile = profileMap.get(t.user_id);
    const matchesSearch =
      !search ||
      profile?.email?.toLowerCase().includes(search.toLowerCase()) ||
      profile?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
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
            <div className="space-y-2">
              <Label>Aplicativo(s)</Label>
              <Select value={appChoice} onValueChange={setAppChoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APP_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGrant} disabled={granting}>
              {granting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Liberar Teste
            </Button>
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
        ) : filteredTrials.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum teste encontrado.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Aplicativo</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Expiração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrials.map((trial) => {
                const profile = profileMap.get(trial.user_id);
                const cfg = statusConfig[trial.status as keyof typeof statusConfig] ?? statusConfig.expired;
                const isExpired = trial.status === "active" && new Date(trial.expires_at) < new Date();

                return (
                  <TableRow key={trial.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {profile?.full_name || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {profile?.email || trial.user_id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {trial.trial_type === "all_apps"
                          ? "Todos"
                          : APP_OPTIONS.find((a) => a.value === trial.app_key)?.label ?? trial.app_key}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{trial.duration_days} dias</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(trial.started_at), "dd/MM/yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(trial.expires_at), "dd/MM/yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${isExpired ? "text-muted-foreground" : cfg.color} border-current/20 gap-1`}>
                        <cfg.icon className="h-3 w-3" />
                        {isExpired ? "Expirado" : cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trial.status === "active" && !isExpired && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleCancel(trial.id, profile?.email ?? "")}
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
