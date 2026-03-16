import { Check, ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Acesso total a todos os aplicativos do ecossistema",
  "Dados salvos e históricos completos",
  "Suporte prioritário dedicado",
  "Atualizações exclusivas e novos recursos",
];

export function UpgradeSection() {
  return (
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
          Sem Limites no Plano Completo
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Desbloqueie todo o potencial do ecossistema com acesso ilimitado.
        </p>

        <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5 shrink-0">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm text-foreground">{b}</span>
            </div>
          ))}
        </div>

        <Link
          to="/subscription"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm sm:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_25px_hsl(var(--primary)/0.35)] active:scale-[0.97]"
        >
          Assinar Plano Completo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
