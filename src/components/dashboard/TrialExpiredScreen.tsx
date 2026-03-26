import { ShieldX, Check, Rocket, Sparkles, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Check, label: "Acesso completo a todos os apps do UNITRIX" },
  { icon: Rocket, label: "Continuidade de uso sem interrupções" },
  { icon: Sparkles, label: "Recursos avançados e funcionalidades completas" },
  { icon: Star, label: "Atualizações e melhorias exclusivas" },
];

export function TrialExpiredScreen() {
  return (
    <div className="max-w-[640px] mx-auto space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="rounded-2xl glass-card-strong p-6 sm:p-10 relative overflow-hidden text-center">
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(0 70% 50% / 0.06), transparent 65%)" }} />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg, hsl(0 70% 50% / 0.12), hsl(0 70% 50% / 0.04))" }}>
            <ShieldX className="h-10 w-10 text-destructive/70" strokeWidth={1.5} />
          </div>

          <div className="space-y-2.5">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Seu teste grátis de 7 dias terminou
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Seu período de avaliação gratuita chegou ao fim, mas seus dados e configurações continuam salvos.
              Assine agora para retomar o acesso completo ao UNITRIX.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits + CTA Card */}
      <div className="rounded-2xl glass-card-strong p-5 sm:p-8 relative overflow-hidden glow-ring">
        <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06), transparent 65%)" }} />

        <div className="relative z-10">
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-1 tracking-tight">
            Desbloqueie o <span className="gradient-text">Plano Completo</span>
          </h2>
          <p className="text-xs text-muted-foreground/70 mb-5">
            Continue aproveitando tudo o que o ecossistema oferece
          </p>

          <div className="space-y-3 mb-7">
            {benefits.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="rounded-lg p-1.5 shrink-0"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
                  <b.icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm text-foreground/90 font-medium">{b.label}</span>
              </div>
            ))}
          </div>

          <Link
            to="/subscription"
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl btn-gradient px-8 py-4 text-sm font-bold shadow-xl shadow-primary/15 active:scale-[0.97] min-h-[50px] tracking-wide"
          >
            <Sparkles className="h-4 w-4" />
            Assinar Plano Completo
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-[11px] text-muted-foreground/50 text-center mt-4">
            Sua conta e seus dados estão seguros. Ao assinar, seu acesso é liberado instantaneamente.
          </p>
        </div>
      </div>
    </div>
  );
}
