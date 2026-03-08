import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, DollarSign, BarChart3, MessageCircle, CalendarCheck, Clock, Activity } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const iconMap: Record<string, React.ElementType> = {
  fitpulse: Heart,
  financeflow: DollarSign,
  marketflow: BarChart3,
  whatsapp_auto: MessageCircle,
  ia_agenda: CalendarCheck,
};

const colorMap: Record<string, string> = {
  fitpulse: "text-rose-400",
  financeflow: "text-emerald-400",
  marketflow: "text-blue-400",
  whatsapp_auto: "text-green-400",
  ia_agenda: "text-violet-400",
};

const nameMap: Record<string, string> = {
  fitpulse: "FitPulse",
  financeflow: "FinanceFlow",
  marketflow: "MarketFlow",
  whatsapp_auto: "WhatsApp Auto",
  ia_agenda: "IA Agenda",
};

export default function ActivityPage() {
  const { user } = useAuth();

  const { data: logs, isLoading } = useQuery({
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

  const uniqueApps = new Set(logs?.map((l) => l.app_key) ?? []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Atividade da Conta</h1>
        <p className="text-muted-foreground mt-1">Histórico de uso dos aplicativos da plataforma.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 card-glow">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total de acessos</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{logs?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 card-glow">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Apps utilizados</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{uniqueApps.size}</p>
        </div>
      </div>

      {/* Activity Log */}
      <div className="rounded-xl border border-border bg-card p-5 md:p-6">
        <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" /> Histórico de Acesso
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Nenhuma atividade registrada</p>
            <p className="text-sm mt-1">Acesse seus aplicativos para ver o histórico aqui.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => {
              const Icon = iconMap[log.app_key] ?? BarChart3;
              const color = colorMap[log.app_key] ?? "text-primary";
              const appName = nameMap[log.app_key] ?? log.app_key;
              const date = format(new Date(log.accessed_at), "dd MMM yyyy, HH:mm", { locale: ptBR });

              return (
                <div key={log.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{appName} acessado</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
