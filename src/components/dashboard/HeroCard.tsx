import { Sparkles } from "lucide-react";

interface HeroCardProps {
  firstName: string;
  isLoading: boolean;
  isDemo: boolean;
}

export function HeroCard({ firstName, isLoading, isDemo }: HeroCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
          Olá! Bem-vindo ao Ecossistema IA Apps.
        </h1>

        <p className="text-muted-foreground mt-2 text-sm flex flex-wrap items-center gap-1.5">
          Você está testando nossos aplicativos em modo
          {isDemo && (
            <span className="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground uppercase tracking-wide">
              Demo
            </span>
          )}
        </p>

        <p className="text-muted-foreground/70 mt-1.5 text-xs sm:text-sm max-w-xl">
          Explore nossos aplicativos e descubra como podemos ajudar você antes de fazer sua assinatura.
        </p>
      </div>
    </div>
  );
}
