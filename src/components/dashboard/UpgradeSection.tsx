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
    <section className="rounded-2xl glass-card-strong p-5 sm:p-8 relative overflow-hidden glow-ring">
      {/* Decorative gradient corners */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-primary/8 to-accent/8 blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/5 to-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1.5">
          Sem Limites no <span className="gradient-text">Plano Completo</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Assine o plano completo e desbloqueie todos os aplicativos sem limites!
        </p>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-start gap-2.5">
              <div className="rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 p-1.5 mt-0.5 shrink-0">
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
            className="inline-flex items-center gap-2 rounded-xl btn-gradient px-8 py-3 text-sm shadow-lg shadow-primary/20 active:scale-[0.97]"
          >
            Assinar Plano Completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
