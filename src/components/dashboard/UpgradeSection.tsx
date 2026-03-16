import { Check, ArrowRight, Globe, Database, Headphones, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Check, label: "Acesso Total a Todos os Apps" },
  { icon: Database, label: "Dados Salvos e Históricos" },
  { icon: Headphones, label: "Suporte Prioritário" },
  { icon: Zap, label: "Atualizações Exclusivas" },
];

export function UpgradeSection() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 relative overflow-hidden">
      {/* Decorative corner gradients */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1.5">
          Sem Limites no Plano Completo
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Assine o plano completo e desbloqueie todos os aplicativos sem limites!
        </p>

        {/* Benefits grid - 2x2 on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-start gap-2">
              <div className="rounded-full bg-primary/15 p-1.5 mt-0.5 shrink-0">
                <b.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm text-foreground font-medium leading-tight">{b.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            to="/subscription"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] active:scale-[0.97]"
          >
            Assinar Plano Completo
          </Link>
        </div>
      </div>
    </section>
  );
}
