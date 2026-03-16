import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, Search, MoreHorizontal, Shield, ShieldOff, Gift, Crown, XCircle, AppWindow, Eye, Ban, Unlock, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const APP_LIST = [
  { value: "fitpulse", label: "FitPulse" },
  { value: "financeflow", label: "FinanceFlow" },
  { value: "marketflow", label: "MarketFlow" },
  { value: "ia-agenda", label: "IA Agenda" },
  { value: "whatsapp-auto", label: "WhatsApp Auto" },
];

const APP_LABEL_MAP: Record<string, string> = Object.fromEntries(APP_LIST.map((a) => [a.value, a.label]));

const PAGE_SIZE = 10;

interface UserRow {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  hasLifetime: boolean;
  createdAt: string;
  activeSub: { planName: string; expiresAt: string | null; appKey: string | null } | null;
  activeTrial: { expiresAt: string; apps: string[] } | null;
  appAccess: string[];
}

type StatusFilter = "all" | "active" | "trial" | "lifetime" | "inactive" | "admin";

export function AdminUserManagement() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [appDialog, setAppDialog] = useState<UserRow | null>(null);
  const [detailDialog, setDetailDialog] = useState<UserRow | null>(null);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-full"],
    queryFn: async (): Promise<UserRow[]> => {
      const [{ data: profiles }, { data: roles }, { data: lifetimes }, { data: subs }, { data: trials }, { data: plans }] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, email, created_at"),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("lifetime_access").select("user_id"),
        supabase.from("user_subscriptions").select("user_id, app_key, subscription_status, expires_at, plan_id").eq("subscription_status", "active"),
        supabase.from("free_trials").select("user_id, app_key, trial_type, expires_at, status").eq("status", "active"),
        supabase.from("subscription_plans").select("id, plan_name"),
      ]);

      if (!profiles) return [];

      const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
      const lifetimeSet = new Set((lifetimes ?? []).map((l) => l.user_id));
      const planMap = new Map((plans ?? []).map((p) => [p.id, p.plan_name]));

      return profiles.map((p) => {
        const userSubs = (subs ?? []).filter((s) => s.user_id === p.user_id);
        const activeSub = userSubs[0]
          ? { planName: planMap.get(userSubs[0].plan_id) ?? "—", expiresAt: userSubs[0].expires_at, appKey: userSubs[0].app_key }
          : null;

        const userTrials = (trials ?? []).filter((t) => t.user_id === p.user_id && new Date(t.expires_at) >= new Date());
        const trialApps = userTrials.some((t) => t.trial_type === "all_apps")
          ? ["all_apps"]
          : userTrials.filter((t) => t.app_key).map((t) => t.app_key!);
        const activeTrial = userTrials.length > 0 ? { expiresAt: userTrials[0].expires_at, apps: trialApps } : null;

        const appAccess: string[] = [];
        if (lifetimeSet.has(p.user_id)) {
          appAccess.push(...APP_LIST.map((a) => a.value));
        } else {
          if (userSubs.some((s) => s.app_key === "ecosystem")) {
            appAccess.push(...APP_LIST.map((a) => a.value));
          } else {
            userSubs.forEach((s) => { if (s.app_key && !appAccess.includes(s.app_key)) appAccess.push(s.app_key); });
          }
          if (trialApps.includes("all_apps")) {
            APP_LIST.forEach((a) => { if (!appAccess.includes(a.value)) appAccess.push(a.value); });
          } else {
            trialApps.forEach((k) => { if (!appAccess.includes(k)) appAccess.push(k); });
          }
        }

        return {
          userId: p.user_id,
          name: p.full_name || "—",
          email: p.email || "—",
          isAdmin: adminSet.has(p.user_id),
          hasLifetime: lifetimeSet.has(p.user_id),
          createdAt: p.created_at,
          activeSub,
          activeTrial,
          appAccess,
        };
      });
    },
    staleTime: 15000,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users-full"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const logAction = async (eventType: string, description: string) => {
    await supabase.from("system_logs").insert({ event_type: eventType, description });
  };

  const handleToggleAdmin = async (row: UserRow) => {
    setActionLoading(row.userId);
    if (row.isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", row.userId).eq("role", "admin");
      if (!error) {
        await logAction("role_admin_removed", `Admin removido de ${row.email}`);
        toast({ title: "Admin removido", description: row.email });
      }
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: row.userId, role: "admin" });
      if (!error) {
        await logAction("role_admin_granted", `Admin concedido para ${row.email}`);
        toast({ title: "Admin concedido", description: row.email });
      }
    }
    invalidateAll();
    setActionLoading(null);
  };

  const handleGrantTrial = async (row: UserRow, days: number) => {
    setActionLoading(row.userId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    const { error } = await supabase.from("free_trials").insert({
      user_id: row.userId,
      trial_type: "all_apps",
      duration_days: days,
      expires_at: expiresAt.toISOString(),
      status: "active",
      granted_by: currentUser?.id ?? null,
    });
    if (!error) {
      await logAction(`trial_${days}d_granted`, `Teste ${days} dias para ${row.email}`);
      toast({ title: "Trial liberado", description: `${days} dias para ${row.email}` });
    } else {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
    invalidateAll();
    setActionLoading(null);
  };

  const handleGrantLifetime = async (row: UserRow) => {
    setActionLoading(row.userId);
    const { error } = await supabase.from("lifetime_access").insert({
      user_id: row.userId,
      granted_by: currentUser?.id ?? null,
      notes: `Concedido via admin por ${currentUser?.email}`,
    });
    if (!error) {
      await logAction("lifetime_access_granted", `Acesso vitalício para ${row.email}`);
      toast({ title: "Acesso vitalício concedido", description: row.email });
    } else {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
    invalidateAll();
    setActionLoading(null);
  };

  const handleCancelAccess = async (row: UserRow) => {
    setActionLoading(row.userId);
    await supabase.from("user_subscriptions").update({ subscription_status: "cancelled", status: "cancelled" }).eq("user_id", row.userId).eq("subscription_status", "active");
    await supabase.from("free_trials").update({ status: "cancelled" }).eq("user_id", row.userId).eq("status", "active");
    await logAction("admin_cancel_access", `Acesso cancelado para ${row.email}`);
    toast({ title: "Acesso cancelado", description: row.email });
    invalidateAll();
    setActionLoading(null);
  };

  const openAppDialog = (row: UserRow) => {
    setSelectedApps(row.appAccess);
    setAppDialog(row);
  };

  const handleSaveApps = async () => {
    if (!appDialog) return;
    setActionLoading(appDialog.userId);

    await supabase.from("free_trials").update({ status: "cancelled" }).eq("user_id", appDialog.userId).eq("status", "active");

    if (selectedApps.length > 0) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      const isAll = selectedApps.length === APP_LIST.length;
      const rows = isAll
        ? [{ user_id: appDialog.userId, trial_type: "all_apps" as string, app_key: null as string | null, duration_days: 30, expires_at: expiresAt.toISOString(), status: "active", granted_by: currentUser?.id ?? null }]
        : selectedApps.map((k) => ({ user_id: appDialog.userId, trial_type: "selected_apps" as string, app_key: k as string | null, duration_days: 30, expires_at: expiresAt.toISOString(), status: "active", granted_by: currentUser?.id ?? null }));

      await supabase.from("free_trials").insert(rows);
      const appsLabel = isAll ? "Todos" : selectedApps.map((k) => APP_LABEL_MAP[k] ?? k).join(", ");
      await logAction("admin_app_access_set", `Apps liberados para ${appDialog.email}: ${appsLabel}`);
    }

    toast({ title: "Apps atualizados", description: appDialog.email });
    invalidateAll();
    setActionLoading(null);
    setAppDialog(null);
  };

  const filtered = useMemo(() => {
    let result = users ?? [];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
    }
    if (statusFilter === "active") result = result.filter((u) => !!u.activeSub);
    else if (statusFilter === "trial") result = result.filter((u) => !!u.activeTrial);
    else if (statusFilter === "lifetime") result = result.filter((u) => u.hasLifetime);
    else if (statusFilter === "inactive") result = result.filter((u) => !u.activeSub && !u.activeTrial && !u.hasLifetime);
    else if (statusFilter === "admin") result = result.filter((u) => u.isAdmin);
    return result;
  }, [users, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const getStatusBadge = (row: UserRow) => {
    if (row.hasLifetime) return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]">Vitalício</Badge>;
    if (row.activeSub) return <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Assinante</Badge>;
    if (row.activeTrial) return <Badge className="bg-violet-400/10 text-violet-400 border-violet-400/20 text-[10px]">Trial</Badge>;
    return <Badge variant="outline" className="text-muted-foreground text-[10px]">Inativo</Badge>;
  };

  const getAccessType = (row: UserRow) => {
    if (row.hasLifetime) return "Vitalício";
    if (row.activeSub) return "Assinatura";
    if (row.activeTrial) return "Trial";
    return "Sem acesso";
  };

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou e-mail..." className="pl-10 h-9 text-sm" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Assinantes</SelectItem>
            <SelectItem value="trial">Em Trial</SelectItem>
            <SelectItem value="lifetime">Vitalícios</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} usuário{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : paged.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Nenhum usuário encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuário</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Plano</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Expira em</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Role</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Apps</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Cadastro</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row) => {
                  const loading = actionLoading === row.userId;
                  return (
                    <TableRow key={row.userId} className="border-border">
                      <TableCell>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{row.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{row.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(row)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {row.hasLifetime ? "Vitalício" : row.activeSub?.planName ?? (row.activeTrial ? "Trial" : "—")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {getAccessType(row)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {row.activeSub?.expiresAt ? format(new Date(row.activeSub.expiresAt), "dd/MM/yyyy") : row.activeTrial?.expiresAt ? format(new Date(row.activeTrial.expiresAt), "dd/MM/yyyy") : "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {row.isAdmin ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 text-[10px]"><Shield className="h-3 w-3" />Admin</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Usuário</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {row.appAccess.length === 0 ? (
                            <span className="text-xs text-muted-foreground">Nenhum</span>
                          ) : row.appAccess.length === APP_LIST.length ? (
                            <Badge variant="outline" className="text-primary border-primary/20 text-[10px]">Todos</Badge>
                          ) : (
                            row.appAccess.slice(0, 2).map((k) => (
                              <Badge key={k} variant="outline" className="text-[10px]">{APP_LABEL_MAP[k] ?? k}</Badge>
                            ))
                          )}
                          {row.appAccess.length > 2 && row.appAccess.length < APP_LIST.length && (
                            <Badge variant="outline" className="text-[10px]">+{row.appAccess.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {format(new Date(row.createdAt), "dd/MM/yy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loading}>
                              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => setDetailDialog(row)}>
                              <Eye className="h-4 w-4 mr-2" />Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleAdmin(row)}>
                              {row.isAdmin ? <><ShieldOff className="h-4 w-4 mr-2" />Remover Admin</> : <><Shield className="h-4 w-4 mr-2" />Tornar Admin</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleGrantTrial(row, 7)}>
                              <Gift className="h-4 w-4 mr-2" />Trial 7 dias
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGrantTrial(row, 15)}>
                              <Gift className="h-4 w-4 mr-2" />Trial 15 dias
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleGrantLifetime(row)} disabled={row.hasLifetime}>
                              <Crown className="h-4 w-4 mr-2" />Acesso Vitalício
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAppDialog(row)}>
                              <AppWindow className="h-4 w-4 mr-2" />Escolher Apps
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleCancelAccess(row)} className="text-destructive focus:text-destructive">
                              <Ban className="h-4 w-4 mr-2" />Cancelar Acesso
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Página {page + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User detail dialog */}
      <Dialog open={!!detailDialog} onOpenChange={(open) => !open && setDetailDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {detailDialog && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nome</p>
                  <p className="font-medium text-foreground">{detailDialog.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground break-all">{detailDialog.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(detailDialog)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tipo de Acesso</p>
                  <p className="text-foreground">{getAccessType(detailDialog)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <p className="text-foreground">{detailDialog.isAdmin ? "Admin" : "Usuário"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Cadastro</p>
                  <p className="text-foreground">{format(new Date(detailDialog.createdAt), "dd/MM/yyyy")}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Apps com Acesso</p>
                <div className="flex flex-wrap gap-1.5">
                  {detailDialog.appAccess.length === 0 ? (
                    <span className="text-muted-foreground">Nenhum</span>
                  ) : detailDialog.appAccess.length === APP_LIST.length ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">Todos os apps</Badge>
                  ) : (
                    detailDialog.appAccess.map((k) => (
                      <Badge key={k} variant="outline">{APP_LABEL_MAP[k] ?? k}</Badge>
                    ))
                  )}
                </div>
              </div>
              {detailDialog.activeSub && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Plano Ativo</p>
                  <p className="text-foreground">{detailDialog.activeSub.planName}</p>
                  {detailDialog.activeSub.expiresAt && (
                    <p className="text-xs text-muted-foreground">Expira: {format(new Date(detailDialog.activeSub.expiresAt), "dd/MM/yyyy")}</p>
                  )}
                </div>
              )}
              {detailDialog.activeTrial && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Trial Ativo</p>
                  <p className="text-xs text-muted-foreground">Expira: {format(new Date(detailDialog.activeTrial.expiresAt), "dd/MM/yyyy")}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* App selection dialog */}
      <Dialog open={!!appDialog} onOpenChange={(open) => !open && setAppDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolher Apps — {appDialog?.email}</DialogTitle>
            <DialogDescription>Selecione os aplicativos que este usuário poderá acessar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Checkbox
                checked={selectedApps.length === APP_LIST.length}
                onCheckedChange={() => setSelectedApps(selectedApps.length === APP_LIST.length ? [] : APP_LIST.map((a) => a.value))}
              />
              <span className="text-sm font-medium">Todos os aplicativos</span>
            </div>
            {APP_LIST.map((app) => (
              <div key={app.value} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedApps.includes(app.value)}
                  onCheckedChange={() => setSelectedApps((prev) => prev.includes(app.value) ? prev.filter((k) => k !== app.value) : [...prev, app.value])}
                />
                <span className="text-sm">{app.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setAppDialog(null)}>Cancelar</Button>
            <Button size="sm" onClick={handleSaveApps} disabled={actionLoading === appDialog?.userId}>
              {actionLoading === appDialog?.userId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
