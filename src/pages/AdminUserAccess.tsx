import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, Search, Crown, CreditCard, Gift, XCircle } from "lucide-react";
import { format } from "date-fns";

type AccessType = "lifetime" | "paid" | "trial" | "inactive";

const accessTypeConfig: Record<AccessType, { label: string; color: string }> = {
  lifetime: { label: "Vitalício", color: "text-yellow-500" },
  paid: { label: "Assinatura", color: "text-primary" },
  trial: { label: "Teste grátis", color: "text-blue-400" },
  inactive: { label: "Inativo", color: "text-muted-foreground" },
};

const APP_NAMES: Record<string, string> = {
  fitpulse: "FitPulse",
  financeflow: "FinanceFlow",
  marketflow: "MarketFlow",
  "ia-agenda": "IA Agenda",
  "whatsapp-auto": "WhatsApp Auto",
};

interface UserAccessRow {
  userId: string;
  name: string;
  email: string;
  apps: { appKey: string; accessType: AccessType; origin: string; startedAt: string | null; expiresAt: string | null }[];
}

export default function AdminUserAccess() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: userRows, isLoading } = useQuery({
    queryKey: ["admin-user-access"],
    queryFn: async (): Promise<UserAccessRow[]> => {
      const appKeys = Object.keys(APP_NAMES);

      // Fetch all profiles
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email");
      if (!profiles) return [];

      // Fetch all lifetime access
      const { data: lifetimes } = await supabase.from("lifetime_access").select("user_id, granted_at");
      const lifetimeSet = new Map((lifetimes ?? []).map((l) => [l.user_id, l.granted_at]));

      // Fetch all active subscriptions
      const { data: subs } = await supabase
        .from("user_subscriptions")
        .select("user_id, app_key, subscription_status, status, started_at, expires_at")
        .in("subscription_status", ["active"]);

      // Fetch all active trials
      const { data: trials } = await supabase
        .from("free_trials")
        .select("user_id, app_key, trial_type, started_at, expires_at, status")
        .eq("status", "active");

      return profiles.map((p) => {
        const apps = appKeys.map((appKey) => {
          // Priority: lifetime > paid > trial > inactive
          if (lifetimeSet.has(p.user_id)) {
            return { appKey, accessType: "lifetime" as AccessType, origin: "Vitalício", startedAt: lifetimeSet.get(p.user_id)!, expiresAt: null };
          }

          // Check paid (ecosystem or specific)
          const userSubs = (subs ?? []).filter((s) => s.user_id === p.user_id);
          const ecosystemSub = userSubs.find((s) => s.app_key === "ecosystem" && (!s.expires_at || new Date(s.expires_at) >= new Date()));
          const appSub = userSubs.find((s) => s.app_key === appKey && (!s.expires_at || new Date(s.expires_at) >= new Date()));

          if (ecosystemSub) {
            return { appKey, accessType: "paid" as AccessType, origin: "Assinatura UNITRIX", startedAt: ecosystemSub.started_at, expiresAt: ecosystemSub.expires_at };
          }
          if (appSub) {
            return { appKey, accessType: "paid" as AccessType, origin: "Assinatura", startedAt: appSub.started_at, expiresAt: appSub.expires_at };
          }

          // Check trial
          const userTrials = (trials ?? []).filter((t) => t.user_id === p.user_id && new Date(t.expires_at) >= new Date());
          const trialAll = userTrials.find((t) => t.trial_type === "all_apps");
          const trialApp = userTrials.find((t) => t.app_key === appKey);

          if (trialAll) {
            return { appKey, accessType: "trial" as AccessType, origin: "Teste grátis", startedAt: trialAll.started_at, expiresAt: trialAll.expires_at };
          }
          if (trialApp) {
            return { appKey, accessType: "trial" as AccessType, origin: "Teste grátis", startedAt: trialApp.started_at, expiresAt: trialApp.expires_at };
          }

          return { appKey, accessType: "inactive" as AccessType, origin: "—", startedAt: null, expiresAt: null };
        });

        return { userId: p.user_id, name: p.full_name || "—", email: p.email || "—", apps };
      });
    },
    enabled: !!isAdmin,
  });

  if (adminLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const filtered = (userRows ?? []).filter((row) => {
    const matchesSearch = !search || row.email.toLowerCase().includes(search.toLowerCase()) || row.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || row.apps.some((a) => a.accessType === typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-7 w-7 text-primary" /> Controle de Acesso
        </h1>
        <p className="text-muted-foreground mt-1">Visão geral dos tipos de acesso por usuário e aplicativo.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou e-mail..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tipo de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="lifetime">Vitalício</SelectItem>
            <SelectItem value="paid">Assinatura</SelectItem>
            <SelectItem value="trial">Teste grátis</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">Nenhum usuário encontrado.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                {Object.values(APP_NAMES).map((name) => (
                  <TableHead key={name} className="text-center text-xs">{name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </TableCell>
                  {row.apps.map((app) => {
                    const cfg = accessTypeConfig[app.accessType];
                    return (
                      <TableCell key={app.appKey} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant="outline" className={`${cfg.color} border-current/20 text-[10px] px-1.5 py-0.5`}>
                            {cfg.label}
                          </Badge>
                          {app.origin !== "—" && (
                            <span className="text-[10px] text-muted-foreground">{app.origin}</span>
                          )}
                          {app.expiresAt && (
                            <span className="text-[10px] text-muted-foreground">
                              até {format(new Date(app.expiresAt), "dd/MM/yy")}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
