import { UserCircle, ShieldAlert, Crown } from "lucide-react";

interface InfoCardsProps {
  totalAccessible: number;
  totalApps: number;
  planName: string | null;
  isDemo: boolean;
}

export function InfoCards({ totalAccessible, totalApps, planName, isDemo }: InfoCardsProps) {
  const cards = [
    {
      icon: UserCircle,
      title: "Conta Demo",
      value: isDemo ? "Ativa" : "Completa",
      description: isDemo ? "Acesso limitado aos apps" : "Acesso total liberado",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      icon: ShieldAlert,
      title: "Acesso Limitado",
      value: `${totalAccessible}/${totalApps}`,
      description: "Apps disponíveis",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      icon: Crown,
      title: "Plano Atual",
      value: planName ?? "Nenhum",
      description: planName ? "Assinatura ativa" : "Sem plano ativo",
      color: "text-primary",
      bg: "bg-primary/10",
      borderColor: "border-primary/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border ${card.borderColor} bg-card p-4 sm:p-5 flex items-start gap-3 transition-all hover:shadow-md`}
        >
          <div className={`rounded-lg ${card.bg} p-2.5 shrink-0`}>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{card.title}</p>
            <p className="font-display font-bold text-foreground text-lg leading-tight truncate">{card.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
