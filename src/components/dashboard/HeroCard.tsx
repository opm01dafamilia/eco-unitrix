import { useDemoContext } from "@/contexts/DemoContext";

interface HeroCardProps {
  firstName: string;
  isLoading: boolean;
  isDemo: boolean;
}

export function HeroCard({ firstName, isLoading, isDemo }: HeroCardProps) {
  const { access } = useDemoContext();
  const days = access.daysRemaining;
  const isTrial = access.accessType === "trial";

  return (
    <div className="rounded-2xl glass-card-strong p-5 sm:p-8 relative overflow-hidden glow-ring animate-fade-in">
      {/* Subtle layered gradient orbs */}
      <div className="absolute -top-24 -right-24 w-52 sm:w-72 h-52 sm:h-72 rounded-full opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(255 80% 65% / 0.08), transparent 70%)" }} />
      <div className="absolute -bottom-16 -left-16 w-40 sm:w-56 h-40 sm:h-56 rounded-full opacity-50 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(215 75% 58% / 0.06), transparent 70%)" }} />

      <div className="relative z-10 space-y-3">
        <h1 className="font-display text-xl sm:text-2xl md:text-[2rem] font-bold text-foreground leading-[1.2] tracking-tight">
          Olá, {firstName}! Bem-vindo ao{" "}
          <span className="gradient-text">UNITRIX</span>.
        </h1>

        {isTrial && days !== null ? (
          <p className="text-muted-foreground text-xs sm:text-sm flex flex-wrap items-center gap-1.5 leading-relaxed">
            Seu
            <span className="inline-flex items-center rounded-md btn-gradient px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest shadow-md shadow-primary/15">
              Teste Grátis
            </span>
            está ativo — {days} dia{days !== 1 ? "s" : ""} restante{days !== 1 ? "s" : ""}
          </p>
        ) : isDemo ? (
          <p className="text-muted-foreground text-xs sm:text-sm flex flex-wrap items-center gap-1.5 leading-relaxed">
            Assine para desbloquear todo o UNITRIX
          </p>
        ) : (
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Você tem acesso completo ao UNITRIX.
          </p>
        )}

        <p className="text-muted-foreground/60 text-[11px] sm:text-[13px] max-w-lg leading-relaxed">
          {isTrial
            ? "Aproveite seu acesso gratuito por tempo limitado. Explore todos os aplicativos e descubra o poder do UNITRIX."
            : isDemo
              ? "Assine um plano para liberar o acesso completo a todos os aplicativos."
              : "Explore nossos aplicativos e aproveite ao máximo o seu acesso."}
        </p>
      </div>
    </div>
  );
}
