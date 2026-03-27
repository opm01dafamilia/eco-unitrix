import { Check, ExternalLink, TrendingDown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Renewal prices for individual apps (what you'd pay separately)
const apps = [
  { name: "FitPulse", monthly: 19.9, yearly: 197 },
  { name: "FinanceFlow", monthly: 19.9, yearly: 197 },
  { name: "MarketFlow", monthly: 37, yearly: 377 },
  { name: "IA Agenda", monthly: 37, yearly: 297 },
  { name: "WhatsApp Auto", monthly: 47, yearly: 477 },
];

const totalMonthly = apps.reduce((s, a) => s + a.monthly, 0);
const totalYearly = apps.reduce((s, a) => s + a.yearly, 0);

// Ecosystem promo prices (first period) — DO NOT change these
const ecoMonthly = 67;
const ecoYearly = 697;
const saveMonthly = totalMonthly - ecoMonthly;
const saveYearly = totalYearly - ecoYearly;

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SavingsComparison() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          Compare e economize
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Veja quanto você economiza assinando o Plano UNITRIX em vez dos aplicativos separadamente.
        </p>
      </div>

      {/* Monthly comparison */}
      <ComparisonBlock
        label="Comparação Mensal"
        apps={apps}
        period="mês"
        totalSeparate={totalMonthly}
        ecoPrice={ecoMonthly}
        saving={saveMonthly}
        promoNote="Primeiro mês por apenas R$ 67,00 — depois R$ 97,00/mês"
        ctaHref="https://pay.kiwify.com.br/tn6JpCc"
        ctaLabel="Assinar UNITRIX Mensal"
      />

      {/* Yearly comparison */}
      <ComparisonBlock
        label="Comparação Anual"
        apps={apps}
        period="ano"
        totalSeparate={totalYearly}
        ecoPrice={ecoYearly}
        saving={saveYearly}
        promoNote="Primeiro ano: 12x de R$ 67,42 ou R$ 697,00 à vista — depois R$ 997,00/ano"
        ctaHref="https://pay.kiwify.com.br/6ShHAbQ"
        ctaLabel="Assinar UNITRIX Anual"
      />
    </div>
  );
}

function ComparisonBlock({
  label,
  apps,
  period,
  totalSeparate,
  ecoPrice,
  saving,
  promoNote,
  ctaHref,
  ctaLabel,
}: {
  label: string;
  apps: { name: string; monthly: number; yearly: number }[];
  period: string;
  totalSeparate: number;
  ecoPrice: number;
  saving: number;
  promoNote: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const priceKey = period === "mês" ? "monthly" : "yearly";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-secondary/30">
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Left – separate */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Apps separados
          </p>
          <div className="space-y-1.5">
            {apps.map((a) => (
              <div key={a.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{a.name}</span>
                <span className="text-foreground font-medium">
                  R$ {fmt(a[priceKey])}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-base font-bold text-foreground line-through decoration-destructive/60">
              R$ {fmt(totalSeparate)} / {period}
            </span>
          </div>
        </div>

        {/* Right – ecosystem */}
        <div className="p-5 space-y-3 bg-primary/[0.03]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              PLANO UNITRIX
            </p>
            <Badge className="bg-primary/10 text-primary text-[10px] gap-1 px-2">
              <Zap className="h-2.5 w-2.5" /> Melhor custo
            </Badge>
          </div>

          <div className="space-y-1.5">
            {apps.map((a) => (
              <div key={a.name} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{a.name}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-base font-bold text-primary">
                R$ {fmt(ecoPrice)} / {period}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{promoNote}</p>
          </div>

          <div className="rounded-lg bg-primary/10 px-4 py-2.5 text-center">
            <p className="text-sm font-bold text-primary">
              Economia de R$ {fmt(saving)} / {period}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {Math.round((saving / totalSeparate) * 100)}% mais barato que separado
            </p>
          </div>

          <Button className="w-full font-semibold" asChild>
            <a href={ctaHref} target="_blank" rel="noopener noreferrer">
              {ctaLabel} <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
