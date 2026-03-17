import { ShieldX, Check, Database, Headphones, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Check, label: "Acesso Total a Todos os Apps" },
  { icon: Database, label: "Dados Salvos e Históricos" },
  { icon: Headphones, label: "Suporte Prioritário" },
  { icon: Zap, label: "Atualizações Exclusivas" },
];

export function TrialExpiredScreen() {
  return (
    <div className="max-w-[640px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-2xl glass-card-strong p-6 sm:p-10 relative overflow-hidden text-center">
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(0 70% 50% / 0.06), transparent 65%)" }} />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg, hsl(0 70% 50% / 0.12), hsl(0 70% 50% / 0.04))" }}>
            <ShieldX className="h-10 w-10 text-destructive/70" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Seu teste grátis expirou
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Os 7 dias do seu período gratuito chegaram ao fim. Assine para continuar usando todos os aplicativos do ecossistema.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-2xl glass-card-strong p-5 sm:p-8 relative overflow-hidden glow-ring">
        <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(255 80% 65% / 0.05), transparent 65%)" }} />

        <div className="relative z-10">
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-1 tracking-tight">
            O que você ganha com o <span className="gradient-text">Plano Completo</span>
          </h2>
          <p className="text-xs text-muted-foreground/70 mb-5">
            Desbloqueie todo o potencial do ecossistema
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {benefits.map((b) => (
              <div key={b.label} className="flex items-start gap-2.5">
                <div className="rounded-lg p-1.5 mt-0.5 shrink-0"
                  style={{ background: "linear-gradient(135deg, hsl(255 80% 65% / 0.15), hsl(215 75% 58% / 0.08))" }}>
                  <b.icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-tight">{b.label}</span>
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
        </div>
      </div>
    </div>
  );
}
