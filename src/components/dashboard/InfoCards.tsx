import { UserCircle, Lock, Crown } from "lucide-react";

interface InfoCardsProps {
  totalAccessible: number;
  totalApps: number;
  planName: string | null;
  isDemo: boolean;
}

export function InfoCards({ totalAccessible, totalApps, planName, isDemo }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {/* Conta Demo */}
      <div className="rounded-2xl glass-card p-3 sm:p-4 flex flex-col gap-2.5 card-glow">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 p-2 shrink-0">
            <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
          </div>
          <span className="font-display font-semibold text-foreground text-[11px] sm:text-sm truncate">
            Conta Demo
          </span>
        </div>
        <p className="text-[9px] sm:text-xs text-muted-foreground leading-snug">
          Somente explorar as experiências. Escopo limitado.
        </p>
      </div>

      {/* Acesso Limitado */}
      <div className="rounded-2xl glass-card p-3 sm:p-4 flex flex-col gap-2.5 card-glow">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 p-2 shrink-0">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <span className="font-display font-semibold text-foreground text-[11px] sm:text-sm truncate">
            Acesso Limitado
          </span>
        </div>
        <p className="text-[9px] sm:text-xs text-muted-foreground leading-snug">
          Conteúdo restrito até assinar o plano.
        </p>
      </div>

      {/* Plano Atual */}
      <div className="rounded-2xl glass-card p-3 sm:p-4 flex flex-col gap-2.5 card-glow">
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold text-foreground text-[11px] sm:text-sm">
            Plano Atual
          </span>
          {isDemo && (
            <span className="rounded-md btn-gradient px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-primary/20">
              Demo
            </span>
          )}
        </div>
        <p className="font-display font-bold text-foreground text-sm sm:text-lg leading-tight">
          {planName ?? "Conta Demo"}
        </p>
      </div>
    </div>
  );
}
