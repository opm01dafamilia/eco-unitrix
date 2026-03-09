import { useState, useMemo } from "react";
import { BarChart3, ArrowRight, CheckCircle2, Clock, XCircle, Search, Filter, ExternalLink, Star, Wrench, EyeOff, AlertTriangle, AppWindow } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { useApps, AppWithAccess } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { Input } from "@/components/ui/input";
import { AppDetailModal } from "@/components/AppDetailModal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  produtividade: "Produtividade",
  "saúde": "Saúde",
  "finanças": "Finanças",
  marketing: "Marketing",
  "automação": "Automação",
  agendamento: "Agendamento",
};

type FilterType = "all" | "active" | "accessible" | "featured";

export default function Apps() {
  const { data: apps, isLoading, isError, refetch } = useApps();
  const { launchApp } = useAppLauncher();
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
      result = result.filter(
        (a) => a.app_name.toLowerCase().includes(q) || a.app_description?.toLowerCase().includes(q)
      );
    }

    if (filter === "active") result = result.filter((a) => a.app_status === "active");
    else if (filter === "accessible") result = result.filter((a) => a.user_access === "active");
    else if (filter === "featured") result = result.filter((a) => a.is_featured);

    if (categoryFilter !== "all") result = result.filter((a) => a.app_category === categoryFilter);

    return result;
  }, [visibleApps, search, filter, categoryFilter]);

  const featuredApps = useMemo(() => filteredApps.filter((a) => a.is_featured), [filteredApps]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Ativos" },
    { key: "accessible", label: "Com acesso" },
    { key: "featured", label: "Destaques" },
  ];

  const getStatusBadge = (app: AppWithAccess) => {
    if (app.app_status === "inactive") return { label: "Indisponível", icon: XCircle, class: "text-muted-foreground bg-muted border-border" };
    if (app.app_status === "disabled") return { label: "Desativado", icon: EyeOff, class: "text-muted-foreground bg-muted border-border" };
    if (app.app_status === "maintenance") return { label: "Em manutenção", icon: Wrench, class: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
    if (app.app_status === "coming_soon") return { label: "Em breve", icon: Clock, class: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
    if (app.user_access === "active") return { label: "Ativo", icon: CheckCircle2, class: "text-primary bg-primary/10 border-primary/20" };
    return { label: "Sem acesso", icon: XCircle, class: "text-muted-foreground bg-muted border-border" };
  };

  const getButtonState = (app: AppWithAccess) => {
    if (app.app_status === "inactive") return { label: "Indisponível no momento", disabled: true };
    if (app.app_status === "disabled") return { label: "Desativado", disabled: true };
    if (app.app_status === "maintenance") return { label: "Em manutenção", disabled: true };
    if (app.app_status === "coming_soon") return { label: "Em breve", disabled: true };
    if (app.user_access === "active") return { label: "Acessar", disabled: false };
    return { label: "Indisponível", disabled: true };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Meus Aplicativos</h1>
        <p className="text-muted-foreground mt-1">Acesse todos os aplicativos da plataforma.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aplicativo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Filter className="h-4 w-4 text-muted-foreground ml-2 mr-1 shrink-0" />
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Categoria:</span>
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                categoryFilter === "all"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  categoryFilter === cat
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-muted-foreground border-border hover:text-foreground hover:border-primary/20"
                }`}
              >
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
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{visibleApps.filter((a) => a.is_featured).length} em destaque</span>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Erro ao carregar aplicativos</p>
          <p className="text-xs text-muted-foreground mt-1">Verifique sua conexão e tente novamente.</p>
          <button onClick={() => refetch()} className="mt-3 text-xs text-primary hover:underline">
            Tentar novamente
          </button>
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
              <AppCard
                key={app.id}
                app={app}
                index={i}
                featured
                getStatusBadge={getStatusBadge}
                getButtonState={getButtonState}
                onSelect={setSelectedApp}
                onLaunch={launchApp}
              />
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : !isError && filteredApps.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum aplicativo encontrado</p>
          <p className="text-sm mt-1">Tente ajustar os filtros ou a busca.</p>
        </div>
      ) : !isError ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredApps
            .filter((app) => {
              // If featured section is visible, exclude featured apps from main grid to avoid duplication
              const featuredSectionVisible = filter !== "featured" && featuredApps.length > 0 && categoryFilter === "all" && !search;
              return !featuredSectionVisible || !app.is_featured;
            })
            .map((app, i) => (
              <AppCard
                key={app.id}
                app={app}
                index={i}
                getStatusBadge={getStatusBadge}
                getButtonState={getButtonState}
                onSelect={setSelectedApp}
                onLaunch={launchApp}
              />
            ))}
        </div>
      ) : null}

      <AppDetailModal
        app={selectedApp}
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      />
    </div>
  );
}

function AppCard({
  app,
  index,
  featured,
  getStatusBadge,
  getButtonState,
  onSelect,
  onLaunch,
}: {
  app: AppWithAccess;
  index: number;
  featured?: boolean;
  getStatusBadge: (app: AppWithAccess) => { label: string; icon: React.ElementType; class: string };
  getButtonState: (app: AppWithAccess) => { label: string; disabled: boolean };
  onSelect: (app: AppWithAccess) => void;
  onLaunch: (app: AppWithAccess) => void;
}) {
  const status = getStatusBadge(app);
  const btn = getButtonState(app);

  return (
    <div
      className={`group rounded-xl border bg-card overflow-hidden card-glow animate-fade-in cursor-pointer ${
        featured ? "border-primary/20 ring-1 ring-primary/10" : "border-border"
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => onSelect(app)}
    >
      <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative">
        {(() => { const Icon = getAppIcon(app.app_key); return Icon ? <Icon className="h-10 w-10 text-primary/60" strokeWidth={1.5} /> : <AppWindow className="h-10 w-10 text-primary/40" strokeWidth={1.5} />; })()}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${status.class}`}>
          <status.icon className="h-3 w-3" />
          {status.label}
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

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
            {categoryLabels[app.app_category] ?? app.app_category}
          </Badge>
          <div className={`h-2 w-2 rounded-full ${
            app.app_status === "active" && app.user_access === "active"
              ? "bg-primary"
              : app.app_status === "coming_soon"
              ? "bg-amber-400"
              : app.app_status === "maintenance"
              ? "bg-orange-400"
              : "bg-muted-foreground"
          }`} />
          <span className="text-xs text-muted-foreground">
            {app.app_status === "inactive"
              ? "Indisponível no momento"
              : app.app_status === "coming_soon"
              ? "Lançamento em breve"
              : app.app_status === "maintenance"
              ? "Em manutenção"
              : app.app_status === "disabled"
              ? "Desativado"
              : app.user_access === "active"
              ? "Disponível para uso"
              : "Acesso não liberado"}
          </span>
        </div>

        <button
          disabled={btn.disabled}
          onClick={(e) => {
            e.stopPropagation();
            onLaunch(app);
          }}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {btn.label}
          {!btn.disabled && <ExternalLink className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
