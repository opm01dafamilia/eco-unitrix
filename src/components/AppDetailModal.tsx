import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, ExternalLink, Star, Wrench, EyeOff, Calendar, AppWindow } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { Badge } from "@/components/ui/badge";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import type { AppWithAccess } from "@/hooks/useApps";

const categoryLabels: Record<string, string> = {
  produtividade: "Produtividade",
  "saúde": "Saúde",
  "finanças": "Finanças",
  marketing: "Marketing",
  "automação": "Automação",
  agendamento: "Agendamento",
};

interface AppDetailModalProps {
  app: AppWithAccess | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppDetailModal({ app, open, onOpenChange }: AppDetailModalProps) {
  const { launchApp } = useAppLauncher();

  if (!app) return null;

  const available = app.app_status === "active" && app.user_access === "active";

  const getStatusInfo = () => {
    if (app.app_status === "disabled") return { label: "Desativado", icon: EyeOff, class: "text-muted-foreground bg-muted" };
    if (app.app_status === "maintenance") return { label: "Em manutenção", icon: Wrench, class: "text-orange-400 bg-orange-400/10" };
    if (app.app_status === "coming_soon") return { label: "Em breve", icon: Clock, class: "text-amber-400 bg-amber-400/10" };
    if (app.user_access === "active") return { label: "Acesso ativo", icon: CheckCircle2, class: "text-primary bg-primary/10" };
    if (!app.user_access) return { label: "Sem acesso", icon: XCircle, class: "text-muted-foreground bg-muted" };
    return { label: "Disponível", icon: CheckCircle2, class: "text-blue-400 bg-blue-400/10" };
  };

  const getButtonLabel = () => {
    if (app.app_status === "disabled") return "Desativado";
    if (app.app_status === "maintenance") return "Em manutenção";
    if (app.app_status === "coming_soon") return "Em breve";
    if (available) return `Acessar ${app.app_name}`;
    return "Solicitar acesso";
  };

  const status = getStatusInfo();
  const createdDate = new Date(app.created_at).toLocaleDateString("pt-BR");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border bg-card">
        <div className="-mx-6 -mt-6 h-32 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center rounded-t-lg relative">
          <span className="text-4xl font-display font-bold text-primary/40">{app.app_name.charAt(0)}</span>
          {app.is_featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-primary" />
              <span className="text-xs font-medium">Destaque</span>
            </div>
          )}
        </div>
        <DialogHeader className="pt-2">
          <DialogTitle className="font-display text-xl">{app.app_name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {app.app_description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${status.class}`}>
              <status.icon className="h-3.5 w-3.5" />
              {status.label}
            </div>
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              {categoryLabels[app.app_category] ?? app.app_category}
            </Badge>
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
            <h4 className="text-sm font-medium text-foreground">Detalhes do aplicativo</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Categoria</span>
                <p className="text-foreground font-medium">{categoryLabels[app.app_category] ?? app.app_category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="text-foreground font-medium">{status.label}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Criado em</span>
                <p className="text-foreground font-medium">{createdDate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Destaque</span>
                <p className="text-foreground font-medium">{app.is_featured ? "Sim" : "Não"}</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!available}
            onClick={() => launchApp(app)}
          >
            {getButtonLabel()}
            {available && <ExternalLink className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
