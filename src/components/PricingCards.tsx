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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Escolha seu plano
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Desbloqueie o acesso aos aplicativos do UNITRIX com o plano ideal para você.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Individual Plan */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between transition-all hover:border-muted-foreground/30">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Básico</p>
              <h3 className="font-display text-lg font-bold text-foreground mt-1">Plano Individual</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Assine apenas o aplicativo que você quiser, com planos a partir de <span className="text-foreground font-semibold">R$ 9,90/mês</span>.
            </p>
            <div className="pt-2 border-t border-border space-y-2.5">
              <p className="text-xs font-medium text-muted-foreground">Inclui:</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>1 aplicativo à sua escolha</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Plano mensal ou anual</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Acesso completo ao app</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/apps">Ver aplicativos</Link>
            </Button>
          </div>
        </div>

        {/* Ecosystem Monthly - Featured */}
        <div className="rounded-2xl border-2 border-primary bg-card relative flex flex-col justify-between shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)] md:scale-[1.03]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-1 text-xs shadow-md">
              <Star className="h-3 w-3" /> Mais popular
            </Badge>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1">
                <Layers className="h-3 w-3" /> UNITRIX
              </p>
              <h3 className="font-display text-lg font-bold text-foreground mt-1">Mensal</h3>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-extrabold text-foreground">R$ 47</span>
                <span className="text-sm text-muted-foreground">/1º mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Depois <span className="font-medium text-foreground">R$ 67,00</span>/mês
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Acesso completo a todos os aplicativos da plataforma.
            </p>
            <div className="pt-2 border-t border-border space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Todos os apps incluídos:</p>
              {ecosystemApps.map((app) => (
                <div key={app} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                <span>Novos apps inclusos</span>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <Button className="w-full font-semibold" asChild>
              <a href="https://pay.kiwify.com.br/tn6JpCc" target="_blank" rel="noopener noreferrer">
                Assinar mensal <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* Ecosystem Yearly */}
        <div className="rounded-2xl border border-border bg-card relative flex flex-col justify-between transition-all hover:border-primary/30">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="outline" className="bg-card text-primary border-primary/40 gap-1 px-3 py-1 text-xs">
              <Crown className="h-3 w-3" /> Melhor custo
            </Badge>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1">
                <Layers className="h-3 w-3" /> UNITRIX
              </p>
              <h3 className="font-display text-lg font-bold text-foreground mt-1">Anual</h3>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-extrabold text-foreground">12x R$ 37</span>
                <span className="text-xs text-muted-foreground">,96</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ou <span className="font-medium text-foreground">R$ 397,00</span> à vista
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Depois <span className="font-medium text-foreground">R$ 547,00</span>/ano
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-1.5">
              <p className="text-xs font-medium text-primary text-center">
                Economize até 45% comparado ao mensal
              </p>
            </div>
            <div className="pt-2 border-t border-border space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Todos os apps incluídos:</p>
              {ecosystemApps.map((app) => (
                <div key={app} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                <span>Novos apps inclusos</span>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <Button variant="outline" className="w-full font-semibold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" asChild>
              <a href="https://pay.kiwify.com.br/6ShHAbQ" target="_blank" rel="noopener noreferrer">
                Assinar anual <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
