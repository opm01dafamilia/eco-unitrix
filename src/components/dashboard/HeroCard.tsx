import { Sparkles } from "lucide-react";

interface HeroCardProps {
  firstName: string;
  isLoading: boolean;
  isDemo: boolean;
}

export function HeroCard({ firstName, isLoading, isDemo }: HeroCardProps) {
  return (
    <div className="rounded-2xl glass-card-strong p-4 sm:p-7 relative overflow-hidden glow-ring">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-16 -right-16 w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-gradient-to-tr from-accent/8 to-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
          Olá! Bem-vindo ao{" "}
          <span className="gradient-text">Ecossistema IA Apps</span>.
        </h1>

        <p className="text-muted-foreground mt-2 text-xs sm:text-sm flex flex-wrap items-center gap-1.5">
          Você está testando nossos aplicativos em modo
          {isDemo && (
            <span className="inline-flex items-center gap-1 rounded-md btn-gradient px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
              Demo
            </span>
          )}
        </p>

        <p className="text-muted-foreground/70 mt-1.5 text-[11px] sm:text-sm max-w-xl leading-relaxed">
          Explore nossos aplicativos e descubra como podemos ajudar você antes de fazer sua assinatura.
        </p>
      </div>
    </div>
  );
}
