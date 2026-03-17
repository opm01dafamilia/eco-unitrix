import { Check, Database, Headphones, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Check, label: "Acesso Total a Todos os Apps" },
  { icon: Database, label: "Dados Salvos e Históricos" },
  { icon: Headphones, label: "Suporte Prioritário" },
  { icon: Zap, label: "Atualizações Exclusivas" },
];

export function UpgradeSection() {
  return (
    <section className="rounded-2xl glass-card-strong p-5 sm:p-10 relative overflow-hidden glow-ring animate-fade-in" style={{ animationDelay: "0.15s" }}>
      {/* Ambient gradient blurs */}
      <div className="absolute -bottom-28 -right-28 w-60 sm:w-80 h-60 sm:h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(255 80% 65% / 0.06), transparent 65%)" }} />
      <div className="absolute -top-20 -left-20 w-48 sm:w-64 h-48 sm:h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(215 75% 58% / 0.04), transparent 65%)" }} />

      <div className="relative z-10">
        <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground mb-2 tracking-tight">
          Sem Limites no <span className="gradient-text">Plano Completo</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground/70 mb-6 sm:mb-8 max-w-md">
          Após o período gratuito, assine para manter acesso completo a todos os aplicativos!
        </p>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-7 sm:mb-10">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-start gap-2.5">
              <div className="rounded-lg p-1.5 mt-0.5 shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(255 80% 65% / 0.15), hsl(215 75% 58% / 0.08))" }}>
                <b.icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] sm:text-sm text-foreground/90 font-medium leading-tight">{b.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            to="/subscription"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl btn-gradient px-10 py-4 text-sm font-bold shadow-xl shadow-primary/15 active:scale-[0.97] min-h-[50px] tracking-wide"
          >
            Assinar Plano Completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
