import { UserCircle, Lock, Crown } from "lucide-react";

interface InfoCardsProps {
  totalAccessible: number;
  totalApps: number;
  planName: string | null;
  isDemo: boolean;
}

export function InfoCards({ totalAccessible, totalApps, planName, isDemo }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
      {/* Conta Demo */}
      <div className="rounded-2xl glass-card p-3.5 sm:p-4 flex items-center sm:flex-col sm:items-start gap-3 sm:gap-2.5 card-glow">
        <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 p-2 shrink-0">
          <UserCircle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="min-w-0">
          <span className="font-display font-semibold text-foreground text-sm">
            Conta Demo
          </span>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            Somente explorar as experiências
          </p>
        </div>
      </div>

      {/* Acesso Limitado */}
      <div className="rounded-2xl glass-card p-3.5 sm:p-4 flex items-center sm:flex-col sm:items-start gap-3 sm:gap-2.5 card-glow">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 p-2 shrink-0">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <span className="font-display font-semibold text-foreground text-sm">
            Acesso Limitado
          </span>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            Conteúdo restrito até assinar
          </p>
        </div>
      </div>

      {/* Plano Atual */}
      <div className="rounded-2xl glass-card p-3.5 sm:p-4 flex items-center sm:flex-col sm:items-start gap-3 sm:gap-2.5 card-glow">
        <div className="flex items-center gap-2 sm:w-full sm:justify-between">
          <span className="font-display font-semibold text-foreground text-sm">
            Plano Atual
          </span>
          {isDemo && (
            <span className="rounded-md btn-gradient px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm shadow-primary/20">
              Demo
            </span>
          )}
        </div>
        <p className="font-display font-bold text-foreground text-base sm:text-lg leading-tight sm:mt-0">
          {planName ?? "Conta Demo"}
        </p>
      </div>
    </div>
  );
}
