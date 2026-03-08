import { useState, useMemo } from "react";
import { Heart, DollarSign, BarChart3, MessageCircle, CalendarCheck, ArrowRight, CheckCircle2, Clock, XCircle, Search, Filter } from "lucide-react";
import { useApps } from "@/hooks/useApps";
import { Input } from "@/components/ui/input";
import { AppDetailModal } from "@/components/AppDetailModal";

const iconMap: Record<string, React.ElementType> = {
  fitpulse: Heart,
  financeflow: DollarSign,
  marketflow: BarChart3,
  whatsapp_auto: MessageCircle,
  ia_agenda: CalendarCheck,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  fitpulse: { bg: "from-rose-500/20 to-rose-600/10", icon: "text-rose-400" },
  financeflow: { bg: "from-emerald-500/20 to-emerald-600/10", icon: "text-emerald-400" },
  marketflow: { bg: "from-blue-500/20 to-blue-600/10", icon: "text-blue-400" },
  whatsapp_auto: { bg: "from-green-500/20 to-green-600/10", icon: "text-green-400" },
  ia_agenda: { bg: "from-violet-500/20 to-violet-600/10", icon: "text-violet-400" },
};

type FilterType = "all" | "active" | "accessible";

export default function Apps() {
  const { data: apps, isLoading } = useApps();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedApp, setSelectedApp] = useState<typeof filteredApps[number] | null>(null);

  const filteredApps = useMemo(() => {
    if (!apps) return [];
    let result = apps;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.app_name.toLowerCase().includes(q) || a.app_description?.toLowerCase().includes(q)
      );
    }

    if (filter === "active") {
      result = result.filter((a) => a.app_status === "active");
    } else if (filter === "accessible") {
      result = result.filter((a) => a.user_access === "active");
    }

    return result;
  }, [apps, search, filter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Ativos" },
    { key: "accessible", label: "Com acesso" },
  ];

  const getStatusBadge = (app: (typeof filteredApps)[number]) => {
    if (app.app_status === "coming_soon") {
      return { label: "Em breve", icon: Clock, class: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
    }
    if (app.user_access === "active") {
      return { label: "Ativo", icon: CheckCircle2, class: "text-primary bg-primary/10 border-primary/20" };
    }
    return { label: "Sem acesso", icon: XCircle, class: "text-muted-foreground bg-muted border-border" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Meus Aplicativos</h1>
        <p className="text-muted-foreground mt-1">Acesse todos os aplicativos da plataforma.</p>
      </div>

      {/* Search and Filters */}
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

      {/* Summary */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredApps.length} aplicativo{filteredApps.length !== 1 ? "s" : ""}</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>{apps?.filter((a) => a.user_access === "active").length ?? 0} com acesso ativo</span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum aplicativo encontrado</p>
          <p className="text-sm mt-1">Tente ajustar os filtros ou a busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredApps.map((app, i) => {
            const Icon = iconMap[app.app_key] ?? BarChart3;
            const colors = colorMap[app.app_key] ?? { bg: "from-primary/20 to-primary/10", icon: "text-primary" };
            const available = app.app_status === "active" && app.user_access === "active";
            const status = getStatusBadge(app);

            return (
              <div
                key={app.id}
                className="group rounded-xl border border-border bg-card overflow-hidden card-glow animate-fade-in cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => setSelectedApp(app)}
              >
                <div className={`h-28 bg-gradient-to-br ${colors.bg} flex items-center justify-center relative`}>
                  <Icon className={`h-12 w-12 ${colors.icon} transition-transform group-hover:scale-110`} />
                  {/* Status badge */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${status.class}`}>
                    <status.icon className="h-3 w-3" />
                    {status.label}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">{app.app_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{app.app_description}</p>
                  </div>

                  {/* Access status */}
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${available ? "bg-primary" : app.app_status === "coming_soon" ? "bg-amber-400" : "bg-muted-foreground"}`} />
                    <span className="text-xs text-muted-foreground">
                      {app.app_status === "coming_soon" ? "Lançamento em breve" : available ? "Disponível para uso" : "Acesso não liberado"}
                    </span>
                  </div>

                  <button
                    disabled={!available}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Future: navigate to app
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {available ? "Acessar" : app.app_status === "coming_soon" ? "Em breve" : "Indisponível"}
                    {available && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AppDetailModal
        app={selectedApp}
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      />
    </div>
  );
}
