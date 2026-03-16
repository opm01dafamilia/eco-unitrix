import { UserCircle, Lock, Crown } from "lucide-react";

interface InfoCardsProps {
  totalAccessible: number;
  totalApps: number;
  planName: string | null;
  isDemo: boolean;
}

export function InfoCards({ totalAccessible, totalApps, planName, isDemo }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "0.05s" }}>
      {/* Conta Demo */}
      <div className="rounded-2xl glass-card p-4 flex items-center sm:flex-col sm:items-start gap-3.5 sm:gap-3 card-glow">
        <div className="rounded-xl p-2.5 shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(30 90% 55% / 0.15), hsl(40 90% 55% / 0.08))" }}>
          <UserCircle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="min-w-0">
          <span className="font-display font-bold text-foreground text-[13px] sm:text-sm">
            Conta Demo
          </span>
          <p className="text-[11px] text-muted-foreground/70 leading-snug mt-0.5">
            Somente explorar as experiências
          </p>
        </div>
      </div>

      {/* Acesso Limitado */}
      <div className="rounded-2xl glass-card p-4 flex items-center sm:flex-col sm:items-start gap-3.5 sm:gap-3 card-glow">
        <div className="rounded-xl p-2.5 shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(255 80% 65% / 0.15), hsl(215 75% 58% / 0.08))" }}>
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <span className="font-display font-bold text-foreground text-[13px] sm:text-sm">
            Acesso Limitado
          </span>
          <p className="text-[11px] text-muted-foreground/70 leading-snug mt-0.5">
            Conteúdo restrito até assinar
          </p>
        </div>
      </div>

      {/* Plano Atual */}
      <div className="rounded-2xl glass-card p-4 flex items-center sm:flex-col sm:items-start gap-3.5 sm:gap-3 card-glow">
        <div className="flex items-center gap-2.5 sm:w-full sm:justify-between">
          <span className="font-display font-bold text-foreground text-[13px] sm:text-sm">
            Plano Atual
          </span>
          {isDemo && (
            <span className="rounded-md btn-gradient px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest shadow-sm shadow-primary/15">
              Demo
            </span>
          )}
        </div>
        <p className="font-display font-bold text-foreground text-base sm:text-lg leading-tight">
          {planName ?? "Conta Demo"}
        </p>
      </div>
    </div>
  );
}
