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
    <div className="rounded-3xl border border-white/[0.06] p-7 sm:p-10 md:p-12 relative overflow-hidden animate-fade-in backdrop-blur-2xl"
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--accent) / 0.04) 50%, hsl(255 80% 65% / 0.05) 100%)",
        boxShadow: "0 0 40px 0 hsl(var(--primary) / 0.08), inset 0 1px 0 0 hsl(0 0% 100% / 0.05)"
      }}>
      
      {/* Gradient orbs */}
      <div className="absolute -top-28 -right-28 w-56 sm:w-80 h-56 sm:h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(255 80% 65% / 0.12), transparent 65%)" }} />
      <div className="absolute -bottom-20 -left-20 w-44 sm:w-64 h-44 sm:h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(215 75% 58% / 0.10), transparent 65%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 60% 40%, hsl(var(--primary) / 0.04), transparent 60%)" }} />

      <div className="relative z-10 space-y-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-[1.15] tracking-tight drop-shadow-sm">
          Olá, {firstName}! Bem-vindo ao{" "}
          <span 
            className="gradient-text font-black tracking-wide"
            style={{ textShadow: "0 0 30px hsl(var(--primary) / 0.3)" }}
          >
            UNITRIX
          </span>.
        </h1>

        {isTrial && days !== null ? (
          <p className="text-foreground/80 text-sm sm:text-base flex flex-wrap items-center gap-2 leading-relaxed">
            Seu
            <span className="inline-flex items-center rounded-lg btn-gradient px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
              Teste Grátis
            </span>
            está ativo — {days} dia{days !== 1 ? "s" : ""} restante{days !== 1 ? "s" : ""}
          </p>
        ) : isDemo ? (
          <p className="text-foreground/80 text-sm sm:text-base flex flex-wrap items-center gap-2 leading-relaxed">
            Assine para desbloquear todo o UNITRIX
          </p>
        ) : (
          <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
            Você tem acesso completo ao UNITRIX.
          </p>
        )}

        <p className="text-muted-foreground text-xs sm:text-sm max-w-lg leading-relaxed">
          {isTrial
            ? "Aproveite seu acesso gratuito por tempo limitado. Explore todos os aplicativos e descubra o poder do UNITRIX."
            : isDemo
              ? "Assine um plano para liberar o acesso completo ao UNITRIX."
              : "Explore nossos aplicativos e aproveite ao máximo o seu acesso."}
        </p>
      </div>
    </div>
  );
}