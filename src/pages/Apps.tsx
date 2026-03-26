import { useState, useMemo } from "react";
import { Search, Filter, ExternalLink, Star, Wrench, AlertTriangle, AppWindow, Crown, CreditCard, Gift, XCircle, Clock, Loader2, Eye, Lock, ArrowRight } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { useApps, AppWithAccess } from "@/hooks/useApps";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useAllAppAccess } from "@/hooks/useAllAppAccess";
import { Input } from "@/components/ui/input";
import { AppDetailModal } from "@/components/AppDetailModal";
import { AccessBlockedModal } from "@/components/AccessBlockedModal";
import { EcosystemBadge } from "@/components/EcosystemBadge";
import { EmptyState } from "@/components/EmptyState";
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

export default function Apps() {
  const { data: apps, isLoading, isError, refetch } = useApps();
  const { launchApp, launchingAppKey, blockedApp, clearBlockedApp } = useAppLauncher();
  const { data: accessMap } = useAllAppAccess();
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<AppWithAccess | null>(null);

  const visibleApps = useMemo(() => apps?.filter((a) => a.is_visible) ?? [], [apps]);

  const myApps = useMemo(() => {
    let result = visibleApps.filter(
      (a) => a.user_access === "active" && a.access_type !== "inactive" && a.app_status === "active"
    );
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.app_name.toLowerCase().includes(q) || a.app_description?.toLowerCase().includes(q));
    }
    return result;
  }, [visibleApps, search]);

  const upgradeApps = useMemo(() => {
    let result = visibleApps.filter(
      (a) => !(a.user_access === "active" && a.access_type !== "inactive") && a.app_status === "active"
    );
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.app_name.toLowerCase().includes(q) || a.app_description?.toLowerCase().includes(q));
    }
    return result;
  }, [visibleApps, search]);

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">Meus Aplicativos</h1>
          <p className="text-muted-foreground text-sm mt-1.5 hidden sm:block">Acesse seus aplicativos liberados.</p>
        </div>
        <EcosystemBadge className="hidden sm:inline-flex" />
      </div>

      {/* Trial warning banner */}
      {nearestTrialExpiry && trialDaysLeft >= 0 && (
        <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 backdrop-blur-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-400/10 p-2.5">
              <Gift className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Seu teste grátis termina em {trialDaysLeft} dia{trialDaysLeft !== 1 ? "s" : ""}.
              </p>
              <p className="text-xs text-muted-foreground">Assine agora para manter o acesso.</p>
            </div>
          </div>
          <Link to="/subscription">
            <Button size="sm" className="shrink-0 w-full sm:w-auto btn-gradient rounded-xl shadow-lg shadow-primary/20 px-5">Assinar agora</Button>
          </Link>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar aplicativo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-11 rounded-xl h-11 bg-card border-border/50 focus:border-primary/30" />
      </div>

      {isError && (
        <div className="rounded-2xl glass-card p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">Erro ao carregar aplicativos</p>
          <p className="text-xs text-muted-foreground mt-1">Verifique sua conexão e tente novamente.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4 rounded-xl">Tentar novamente</Button>
        </div>
      )}

      {/* My Apps Section */}
      {isLoading ? (
        <div className="space-y-5">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        </div>
      ) : !isError && (
        <>
          {/* My accessible apps */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
              <Star className="h-4 w-4 text-primary" />
              <h2 className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">
                Meus Apps
              </h2>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-lg">{myApps.length}</Badge>
            </div>

            {myApps.length === 0 ? (
              <div className="rounded-2xl glass-card p-8 sm:p-10 text-center">
                <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-sm font-semibold text-foreground">Nenhum aplicativo liberado</p>
                <p className="text-xs text-muted-foreground mt-1.5">Assine um plano para ter acesso aos aplicativos.</p>
                <Link to="/subscription">
                  <Button size="sm" className="mt-5 btn-gradient rounded-xl shadow-lg shadow-primary/20 px-6">Ver planos</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {myApps.map((app, i) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    index={i}
                    featured={app.is_featured}
                    accessInfo={accessMap?.[app.app_key]}
                    onSelect={setSelectedApp}
                    onLaunch={launchApp}
                    launchingAppKey={launchingAppKey}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Upgrade section */}
          {upgradeApps.length > 0 && (
            <div>
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display text-base sm:text-lg font-bold text-muted-foreground tracking-tight">
                  Outros Apps Disponíveis
                </h2>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-lg">{upgradeApps.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {upgradeApps.map((app, i) => (
                  <UpgradeCard key={app.id} app={app} index={i} onSelect={setSelectedApp} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

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
  launchingAppKey,
}: {
  app: AppWithAccess;
  index: number;
  featured?: boolean;
  accessInfo?: { accessType: string; expiresAt: string | null };
  onSelect: (app: AppWithAccess) => void;
  onLaunch: (app: AppWithAccess) => void;
  launchingAppKey: string | null;
}) {
  const atCfg = accessTypeConfig[app.access_type] ?? accessTypeConfig.inactive;
  const isTrial = app.access_type === "trial";
  const isLaunching = launchingAppKey === app.app_key;

  return (
    <div
      className={`group rounded-2xl glass-card overflow-hidden card-glow animate-fade-in cursor-pointer ${featured ? "border-primary/20 ring-1 ring-primary/10" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onSelect(app)}
    >
      {/* Top accent */}
      <div className="h-[2px] bg-gradient-to-r from-primary/40 via-accent/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="h-24 sm:h-28 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center relative">
        {(() => { const Icon = getAppIcon(app.app_key); return Icon ? <Icon className="h-8 sm:h-10 w-8 sm:w-10 text-primary/50 group-hover:text-primary/70 transition-colors duration-300" strokeWidth={1.5} /> : <AppWindow className="h-8 sm:h-10 w-8 sm:w-10 text-primary/30" strokeWidth={1.5} />; })()}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold border backdrop-blur-sm ${atCfg.color}`}>
          <atCfg.icon className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
          {atCfg.label}
        </div>
        {featured && (
          <div className="absolute top-3 left-3">
            <Star className="h-4 w-4 text-primary fill-primary" />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(app); }}
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background/70 backdrop-blur-sm text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-foreground"
        >
          <Eye className="h-3 w-3" /> Ver detalhes
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-3.5">
        <div>
          <h3 className="font-display font-bold text-foreground text-base sm:text-lg tracking-tight">{app.app_name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{app.app_description || "Sem descrição disponível."}</p>
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground rounded-lg">
            {categoryLabels[app.app_category] ?? app.app_category}
          </Badge>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5">
              <atCfg.icon className="h-3 w-3" />
              Acesso via {atCfg.label.toLowerCase()}
            </p>
            {accessInfo?.expiresAt && (
              <p className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Expira: {format(new Date(accessInfo.expiresAt), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            disabled={isLaunching}
            onClick={(e) => { e.stopPropagation(); onLaunch(app); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl btn-gradient px-4 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-primary/15 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isLaunching ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Abrindo...</>
            ) : (
              <>Acessar aplicativo <ExternalLink className="h-3.5 w-3.5" /></>
            )}
          </button>
          {isTrial && (
            <Link to="/subscription" onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-1 rounded-xl border border-primary/20 px-3 py-3 text-[11px] sm:text-xs font-bold text-primary transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 active:scale-[0.97]">
              Assinar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function UpgradeCard({
  app,
  index,
  onSelect,
}: {
  app: AppWithAccess;
  index: number;
  onSelect: (app: AppWithAccess) => void;
}) {
  return (
    <div
      className="group rounded-2xl glass-card overflow-hidden animate-fade-in cursor-pointer opacity-60 hover:opacity-90 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onSelect(app)}
    >
      <div className="h-20 sm:h-24 bg-gradient-to-br from-muted/30 to-muted/15 flex items-center justify-center relative">
        {(() => { const Icon = getAppIcon(app.app_key); return Icon ? <Icon className="h-7 sm:h-8 w-7 sm:w-8 text-muted-foreground/30" strokeWidth={1.5} /> : <AppWindow className="h-7 sm:h-8 w-7 sm:w-8 text-muted-foreground/30" strokeWidth={1.5} />; })()}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-semibold border border-border/50 text-muted-foreground bg-muted/50 backdrop-blur-sm">
          <Lock className="h-2.5 w-2.5" />
          Bloqueado
        </div>
      </div>
      <div className="p-5 space-y-3.5">
        <div>
          <h3 className="font-display font-semibold text-foreground text-sm sm:text-base tracking-tight">{app.app_name}</h3>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{app.app_description || "Sem descrição disponível."}</p>
        </div>
        <Link
          to="/subscription"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-xs font-bold text-primary transition-all duration-200 hover:bg-primary/15 active:scale-[0.97] w-full"
        >
          Assinar plano <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
