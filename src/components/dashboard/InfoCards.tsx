import { Clock, Sparkles, Crown } from "lucide-react";
import { useDemoContext } from "@/contexts/DemoContext";

interface InfoCardsProps {
  totalAccessible: number;
  totalApps: number;
  planName: string | null;
  isDemo: boolean;
}

export function InfoCards({ totalAccessible, totalApps, planName, isDemo }: InfoCardsProps) {
  const { access } = useDemoContext();
  const isTrial = access.accessType === "trial";
  const days = access.daysRemaining;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 animate-fade-in" style={{ animationDelay: "0.05s" }}>
      {/* Status da Conta */}
      <div className="rounded-2xl glass-card p-5 flex items-center sm:flex-col sm:items-start gap-4 sm:gap-3 transition-all duration-300 hover:border-primary/15">
        <div className="rounded-xl p-2.5 shrink-0"
          style={{ background: isTrial
            ? "linear-gradient(135deg, hsl(152 60% 45% / 0.15), hsl(152 60% 45% / 0.05))"
            : "linear-gradient(135deg, hsl(30 90% 55% / 0.15), hsl(40 90% 55% / 0.05))" }}>
          {isTrial
            ? <Clock className="h-5 w-5 text-primary" />
            : <Sparkles className="h-5 w-5 text-orange-400" />}
        </div>
        <div className="min-w-0">
          <span className="font-semibold text-foreground text-sm">
            {isTrial ? "Teste Grátis Ativo" : isDemo ? "Sem Acesso" : "Acesso Ativo"}
          </span>
          <p className="text-xs text-muted-foreground/60 leading-snug mt-1">
            {isTrial && days !== null
              ? `${days} dia${days !== 1 ? "s" : ""} restante${days !== 1 ? "s" : ""}`
              : isDemo
                ? "Assine para acessar o UNITRIX"
                : "Aproveite o UNITRIX completo"}
          </p>
        </div>
      </div>

      {/* Apps Disponíveis */}
      <div className="rounded-2xl glass-card p-5 flex items-center sm:flex-col sm:items-start gap-4 sm:gap-3 transition-all duration-300 hover:border-primary/15">
        <div className="rounded-xl p-2.5 shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(255 80% 65% / 0.15), hsl(215 75% 58% / 0.05))" }}>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <span className="font-semibold text-foreground text-sm">
            {totalApps} Apps Disponíveis
          </span>
          <p className="text-xs text-muted-foreground/60 leading-snug mt-1">
            {isTrial ? "Acesso completo durante o teste" : isDemo ? "Assine para desbloquear" : "Acesso completo"}
          </p>
        </div>
      </div>

      {/* Plano Atual */}
      <div className="rounded-2xl glass-card p-5 flex items-center sm:flex-col sm:items-start gap-4 sm:gap-3 transition-all duration-300 hover:border-primary/15">
        <div className="flex items-center gap-2.5 sm:w-full sm:justify-between">
          <span className="font-semibold text-foreground text-sm">
            Plano Atual
          </span>
          {isTrial && (
            <span className="rounded-md btn-gradient px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest shadow-sm shadow-primary/15">
              Trial
            </span>
          )}
        </div>
        <p className="font-bold text-foreground text-base sm:text-lg leading-tight">
          {isTrial ? "Teste Grátis 7 Dias" : planName ?? "Sem Plano"}
        </p>
      </div>
    </div>
  );
}
