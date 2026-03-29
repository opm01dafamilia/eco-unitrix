import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useApps } from "@/hooks/useApps";
import { Clock, Activity, AlertTriangle, AppWindow } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ActivityPage() {
  const { user } = useAuth();
  const { data: apps } = useApps();

  const { data: logs, isLoading, isError, refetch } = useQuery({
    queryKey: ["app-usage-logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_usage_logs")
        .select("*")
        .eq("user_id", user!.id)
        .order("accessed_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const appNameMap = new Map(apps?.map((a) => [a.app_key, a.app_name]) ?? []);
  const uniqueApps = new Set(logs?.map((l) => l.app_key) ?? []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Atividade da Conta
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Histórico de uso dos aplicativos da UNITRIX.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl glass-card p-5 card-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Total de acessos
            </span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">
            {isLoading ? (
              <Skeleton className="h-9 w-12 inline-block rounded-lg" />
            ) : (
              logs?.length ?? 0
            )}
          </p>
        </div>

        <div className="rounded-2xl glass-card p-5 card-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <AppWindow className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Apps utilizados
            </span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">
            {isLoading ? (
              <Skeleton className="h-9 w-12 inline-block rounded-lg" />
            ) : (
              uniqueApps.size
            )}
          </p>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-2xl glass-card p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">
            Erro ao carregar atividade
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Verifique sua conexão e tente novamente.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 rounded-xl"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Activity Log */}
      <div className="rounded-2xl glass-card p-6 md:p-7">
        <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2.5 mb-5">
          <div className="rounded-xl bg-primary/10 p-2">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          Histórico de Acesso
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Nenhuma atividade registrada</p>
            <p className="text-sm mt-1 text-muted-foreground/70">
              Acesse seus aplicativos para ver o histórico aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {logs.map((log) => {
              const appName =
                appNameMap.get(log.app_key) ?? log.app_key;
              const date = format(
                new Date(log.accessed_at),
                "dd MMM yyyy, HH:mm",
                { locale: ptBR }
              );

              return (
                <div
                  key={log.id}
                  className="flex items-center gap-3.5 py-3.5 border-b border-border/30 last:border-0 hover:bg-primary/[0.02] transition-colors duration-200 rounded-lg px-1"
                >
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-display font-bold text-primary">
                      {appName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {appName} acessado
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground/70 whitespace-nowrap font-medium">
                    {date}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}