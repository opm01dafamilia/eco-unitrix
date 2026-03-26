import { Check, Crown, ExternalLink, Layers, Sparkles, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ecosystemApps = [
  "FitPulse",
  "FinanceFlow",
  "MarketFlow",
  "IA Agenda",
  "WhatsApp Auto",
];

export default function PricingCards() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          Planos
        </div>
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem] text-foreground tracking-tight">
          Escolha o plano <span className="gradient-text">ideal</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Desbloqueie o acesso aos aplicativos do UNITRIX com o plano ideal para você.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Individual Plan */}
        <div className="rounded-2xl glass-card p-7 flex flex-col justify-between transition-all duration-500 card-glow">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Básico</p>
              <h3 className="font-display text-xl font-bold text-foreground mt-1">Plano Individual</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Assine apenas o aplicativo que você quiser, com planos a partir de <span className="text-foreground font-bold">R$ 9,90/mês</span>.
            </p>
            <div className="pt-4 border-t border-border/40 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Inclui:</p>
              {["1 aplicativo à sua escolha", "Plano mensal ou anual", "Acesso completo ao app"].map((t) => (
                <div key={t} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7">
            <Button variant="outline" className="w-full rounded-xl font-semibold" asChild>
              <Link to="/apps">Ver aplicativos</Link>
            </Button>
          </div>
        </div>

        {/* Ecosystem Monthly - Featured */}
        <div className="rounded-2xl border-2 border-primary/40 bg-card relative flex flex-col justify-between md:scale-[1.03]"
          style={{
            boxShadow: "0 0 40px -8px hsl(var(--primary) / 0.15), 0 0 80px -16px hsl(var(--primary) / 0.08)"
          }}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground gap-1.5 px-4 py-1.5 text-xs font-bold shadow-lg shadow-primary/30 border-0">
              <Star className="h-3 w-3" /> Mais popular
            </Badge>
          </div>
          <div className="p-7 space-y-5">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3 w-3" /> UNITRIX
              </p>
              <h3 className="font-display text-xl font-bold text-foreground mt-1">Mensal</h3>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold text-foreground">R$ 47</span>
                <span className="text-sm text-muted-foreground">/1º mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Depois <span className="font-bold text-foreground">R$ 67,00</span>/mês
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Acesso completo a todos os aplicativos da plataforma.
            </p>
            <div className="pt-4 border-t border-border/40 space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground">Todos os apps incluídos:</p>
              {ecosystemApps.map((app) => (
                <div key={app} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 text-sm text-primary font-bold">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                <span>Novos apps inclusos</span>
              </div>
            </div>
          </div>
          <div className="p-7 pt-0">
            <Button className="w-full font-bold btn-gradient rounded-xl shadow-lg shadow-primary/25 py-3" asChild>
              <a href="https://pay.kiwify.com.br/tn6JpCc" target="_blank" rel="noopener noreferrer">
                Assinar mensal <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Ecosystem Yearly */}
        <div className="rounded-2xl glass-card relative flex flex-col justify-between transition-all duration-500 card-glow">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <Badge variant="outline" className="bg-card text-primary border-primary/30 gap-1.5 px-4 py-1.5 text-xs font-bold">
              <Crown className="h-3 w-3" /> Melhor custo
            </Badge>
          </div>
          <div className="p-7 space-y-5">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3 w-3" /> UNITRIX
              </p>
              <h3 className="font-display text-xl font-bold text-foreground mt-1">Anual</h3>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold text-foreground">12x R$ 37</span>
                <span className="text-xs text-muted-foreground">,96</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                ou <span className="font-bold text-foreground">R$ 397,00</span> à vista
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Depois <span className="font-bold text-foreground">R$ 547,00</span>/ano
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-2">
              <p className="text-xs font-bold text-primary text-center">
                Economize até 45% comparado ao mensal
              </p>
            </div>
            <div className="pt-4 border-t border-border/40 space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground">Todos os apps incluídos:</p>
              {ecosystemApps.map((app) => (
                <div key={app} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 text-sm text-primary font-bold">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                <span>Novos apps inclusos</span>
              </div>
            </div>
          </div>
          <div className="p-7 pt-0">
            <Button variant="outline" className="w-full font-bold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl py-3 transition-all duration-300" asChild>
              <a href="https://pay.kiwify.com.br/6ShHAbQ" target="_blank" rel="noopener noreferrer">
                Assinar anual <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
