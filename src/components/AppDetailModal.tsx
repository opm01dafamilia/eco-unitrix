import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, XCircle, Shield } from "lucide-react";
import { Heart, DollarSign, BarChart3, MessageCircle, CalendarCheck } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  fitpulse: Heart,
  financeflow: DollarSign,
  marketflow: BarChart3,
  whatsapp_auto: MessageCircle,
  ia_agenda: CalendarCheck,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  fitpulse: { bg: "from-rose-500/20 to-rose-600/10", icon: "text-rose-400" },
  financeflow: { bg: "from-emerald-500/20 to-emerald-600/10", icon: "text-emerald-400" },
  marketflow: { bg: "from-blue-500/20 to-blue-600/10", icon: "text-blue-400" },
  whatsapp_auto: { bg: "from-green-500/20 to-green-600/10", icon: "text-green-400" },
  ia_agenda: { bg: "from-violet-500/20 to-violet-600/10", icon: "text-violet-400" },
};

const detailsMap: Record<string, string> = {
  fitpulse: "Acompanhe treinos, métricas corporais e evolução física com inteligência integrada. Ideal para profissionais de saúde e fitness.",
  financeflow: "Gerencie receitas, despesas e investimentos com dashboards inteligentes. Planejamento financeiro completo para seu negócio.",
  marketflow: "Crie, gerencie e analise campanhas de marketing digital. Ferramentas completas para maximizar resultados.",
  whatsapp_auto: "Automatize mensagens, crie fluxos de atendimento e gerencie conversas em escala no WhatsApp Business.",
  ia_agenda: "Gerencie agendamentos com inteligência artificial. Confirmações automáticas, lembretes e otimização de horários.",
};

interface AppDetailModalProps {
  app: {
    id: string;
    app_key: string;
    app_name: string;
    app_description: string | null;
    app_status: string;
    app_url: string | null;
    user_access: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppDetailModal({ app, open, onOpenChange }: AppDetailModalProps) {
  if (!app) return null;

  const Icon = iconMap[app.app_key] ?? BarChart3;
  const colors = colorMap[app.app_key] ?? { bg: "from-primary/20 to-primary/10", icon: "text-primary" };
  const available = app.app_status === "active" && app.user_access === "active";
  const details = detailsMap[app.app_key] ?? app.app_description ?? "";

  const getStatusInfo = () => {
    if (app.app_status === "coming_soon") return { label: "Em breve", icon: Clock, class: "text-amber-400 bg-amber-400/10" };
    if (app.user_access === "active") return { label: "Acesso ativo", icon: CheckCircle2, class: "text-primary bg-primary/10" };
    if (!app.user_access) return { label: "Sem acesso", icon: XCircle, class: "text-muted-foreground bg-muted" };
    return { label: "Disponível", icon: Shield, class: "text-blue-400 bg-blue-400/10" };
  };

  const status = getStatusInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border bg-card">
        <div className={`-mx-6 -mt-6 h-32 bg-gradient-to-br ${colors.bg} flex items-center justify-center rounded-t-lg`}>
          <Icon className={`h-14 w-14 ${colors.icon}`} />
        </div>
        <DialogHeader className="pt-2">
          <DialogTitle className="font-display text-xl">{app.app_name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {app.app_description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${status.class}`}>
            <status.icon className="h-3.5 w-3.5" />
            {status.label}
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Sobre o aplicativo</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{details}</p>
          </div>

          <Button
            className="w-full"
            disabled={!available}
          >
            {available ? (
              <>Acessar {app.app_name} <ArrowRight className="h-4 w-4 ml-1" /></>
            ) : app.app_status === "coming_soon" ? "Em breve" : "Solicitar acesso"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
