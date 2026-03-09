import { useState, useMemo } from "react";
import { Search, Filter, ExternalLink, Star, Wrench, EyeOff, AlertTriangle, AppWindow, Crown, CreditCard, Gift, XCircle, CheckCircle2, Clock } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { useApps, AppWithAccess } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useAllAppAccess } from "@/hooks/useAllAppAccess";
import { Input } from "@/components/ui/input";
import { AppDetailModal } from "@/components/AppDetailModal";
import { AccessBlockedModal } from "@/components/AccessBlockedModal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryLabels: Record<string, string> = {
  produtividade: "Produtividade",
  "saúde": "Saúde",
  "finanças": "Finanças",
  marketing: "Marketing",
  "automação": "Automação",
  agendamento: "Agendamento",
};

const accessTypeConfig = {
  lifetime: { label: "Vitalício", icon: Crown, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  paid: { label: "Assinatura", icon: CreditCard, color: "text-primary bg-primary/10 border-primary/20" },
  trial: { label: "Teste grátis", icon: Gift, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  inactive: { label: "Sem acesso", icon: XCircle, color: "text-muted-foreground bg-muted border-border" },
} as const;

type FilterType = "all" | "active" | "accessible" | "featured";

export default function Apps() {
  const { data: apps, isLoading, isError, refetch } = useApps();
  const { launchApp, blockedApp, clearBlockedApp } = useAppLauncher();
  const { data: accessMap } = useAllAppAccess();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<AppWithAccess | null>(null);

  const visibleApps = useMemo(() => apps?.filter((a) => a.is_visible) ?? [], [apps]);

  const categories = useMemo(() => {
    const cats = new Set(visibleApps.map((a) => a.app_category));
    return Array.from(cats).sort();
  }, [visibleApps]);

  const filteredApps = useMemo(() => {
    let result = visibleApps;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.app_name.toLowerCase().includes(q) || a.app_description?.toLowerCase().includes(q));
    }
    if (filter === "active") result = result.filter((a) => a.app_status === "active");
    else if (filter === "accessible") result = result.filter((a) => a.user_access === "active");
    else if (filter === "featured") result = result.filter((a) => a.is_featured);
    if (categoryFilter !== "all") result = result.filter((a) => a.app_category === categoryFilter);
    return result;
  }, [visibleApps, search, filter, categoryFilter]);

  const featuredApps = useMemo(() => filteredApps.filter((a) => a.is_featured), [filteredApps]);

  // Trial warning
  const trialApps = useMemo(() => {
    if (!accessMap) return [];
    return Object.values(accessMap).filter((a) => a.accessType === "trial" && a.expiresAt);
  }, [accessMap]);

  const nearestTrialExpiry = useMemo(() => {
    if (trialApps.length === 0) return null;
    const sorted = trialApps.sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());
    return sorted[0];
  }, [trialApps]);

  const trialDaysLeft = nearestTrialExpiry ? differenceInDays(new Date(nearestTrialExpiry.expiresAt!), new Date()) : 0;

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Ativos" },
    { key: "accessible", label: "Com acesso" },
    { key: "featured", label: "Destaques" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Meus Aplicativos</h1>
        <p className="text-muted-foreground mt-1">Acesse todos os aplicativos da plataforma.</p>
      </div>

      {/* Trial warning banner */}
      {nearestTrialExpiry && trialDaysLeft >= 0 && (
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Seu teste grátis termina em {trialDaysLeft} dia{trialDaysLeft !== 1 ? "s" : ""}.
              </p>
              <p className="text-xs text-muted-foreground">
                Assine agora para manter o acesso aos seus aplicativos.
              </p>
            </div>
          </div>
          <Link to="/subscription">
            <Button size="sm" className="shrink-0">Assinar agora</Button>
          </Link>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar aplicativo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Filter className="h-4 w-4 text-muted-foreground ml-2 mr-1 shrink-0" />
            {filters.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Categoria:</span>
            <button onClick={() => setCategoryFilter("all")} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${categoryFilter === "all" ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground border-border hover:text-foreground hover:border-primary/20"}`}>
              Todas
            </button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${categoryFilter === cat ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground border-border hover:text-foreground hover:border-primary/20"}`}>
                {categoryLabels[cat] ?? cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {!isLoading && !isError && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{filteredApps.length} aplicativo{filteredApps.length !== 1 ? "s" : ""}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{visibleApps.filter((a) => a.user_access === "active").length} com acesso ativo</span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Erro ao carregar aplicativos</p>
          <button onClick={() => refetch()} className="mt-3 text-xs text-primary hover:underline">Tentar novamente</button>
        </div>
      )}

      {/* Featured section */}
      {!isError && filter !== "featured" && featuredApps.length > 0 && categoryFilter === "all" && !search && (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" /> Em Destaque
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {featuredApps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} featured accessInfo={accessMap?.[app.app_key]} onSelect={setSelectedApp} onLaunch={launchApp} />
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : !isError && filteredApps.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum aplicativo encontrado</p>
        </div>
      ) : !isError ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredApps
            .filter((app) => {
              const featuredSectionVisible = filter !== "featured" && featuredApps.length > 0 && categoryFilter === "all" && !search;
              return !featuredSectionVisible || !app.is_featured;
            })
            .map((app, i) => (
              <AppCard key={app.id} app={app} index={i} accessInfo={accessMap?.[app.app_key]} onSelect={setSelectedApp} onLaunch={launchApp} />
            ))}
        </div>
      ) : null}

      <AppDetailModal app={selectedApp} open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)} />
      {blockedApp && (
        <AccessBlockedModal open={!!blockedApp} onOpenChange={(open) => !open && clearBlockedApp()} appName={blockedApp.appName} appKey={blockedApp.appKey} reason={blockedApp.reason} />
      )}
    </div>
  );
}

function AppCard({
  app,
  index,
  featured,
  accessInfo,
  onSelect,
  onLaunch,
}: {
  app: AppWithAccess;
  index: number;
  featured?: boolean;
  accessInfo?: { accessType: string; expiresAt: string | null };
  onSelect: (app: AppWithAccess) => void;
  onLaunch: (app: AppWithAccess) => void;
}) {
  const atCfg = accessTypeConfig[app.access_type] ?? accessTypeConfig.inactive;
  const isActive = app.user_access === "active" && app.access_type !== "inactive";
  const isTrial = app.access_type === "trial";
  const isInactive = app.access_type === "inactive";

  const getAppStatusLabel = () => {
    if (app.app_status === "inactive") return "Indisponível no momento";
    if (app.app_status === "maintenance") return "Em manutenção";
    if (app.app_status === "coming_soon") return "Em breve";
    if (app.app_status === "disabled") return "Desativado";
    return null;
  };

  const appStatusLabel = getAppStatusLabel();
  const isAppUnavailable = !!appStatusLabel;

  return (
    <div
      className={`group rounded-xl border bg-card overflow-hidden card-glow animate-fade-in cursor-pointer ${featured ? "border-primary/20 ring-1 ring-primary/10" : "border-border"}`}
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => onSelect(app)}
    >
      <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative">
        {(() => { const Icon = getAppIcon(app.app_key); return Icon ? <Icon className="h-10 w-10 text-primary/60" strokeWidth={1.5} /> : <AppWindow className="h-10 w-10 text-primary/40" strokeWidth={1.5} />; })()}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${atCfg.color}`}>
          <atCfg.icon className="h-3 w-3" />
          {atCfg.label}
        </div>
        {featured && (
          <div className="absolute top-3 left-3">
            <Star className="h-4 w-4 text-primary fill-primary" />
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-foreground text-lg">{app.app_name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{app.app_description || "Sem descrição disponível."}</p>
        </div>

        {/* Access details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
              {categoryLabels[app.app_category] ?? app.app_category}
            </Badge>
          </div>

          {isAppUnavailable ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Wrench className="h-3 w-3" /> {appStatusLabel}
            </p>
          ) : (
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p className="flex items-center gap-1.5">
                <atCfg.icon className="h-3 w-3" />
                {isActive ? `Acesso via ${atCfg.label.toLowerCase()}` : "Acesso não liberado"}
              </p>
              {accessInfo?.expiresAt && isActive && (
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Expira: {format(new Date(accessInfo.expiresAt), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {!isAppUnavailable && isActive && (
            <button
              onClick={(e) => { e.stopPropagation(); onLaunch(app); }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Abrir aplicativo <ExternalLink className="h-4 w-4" />
            </button>
          )}
          {!isAppUnavailable && isTrial && (
            <Link to="/subscription" onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-1 rounded-lg border border-primary/20 px-3 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5">
              Assinar plano
            </Link>
          )}
          {!isAppUnavailable && isInactive && (
            <Link to="/subscription" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
              Assinar plano
            </Link>
          )}
          {isAppUnavailable && (
            <button disabled className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground opacity-40 cursor-not-allowed">
              {appStatusLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
