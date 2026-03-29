import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldX, CreditCard, ArrowRight, Hexagon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAppIcon } from "@/lib/appIcons";

interface AccessBlockedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName: string;
  appKey?: string;
  reason: "no_subscription" | "expired" | "cancelled" | "suspended";
}

const reasonMessages: Record<string, { title: string; description: string }> = {
  no_subscription: {
    title: "Assinatura não encontrada",
    description: "Você ainda não possui uma assinatura ativa para este aplicativo. Assine um plano para liberar o acesso.",
  },
  expired: {
    title: "Assinatura expirada",
    description: "Sua assinatura para este aplicativo expirou. Renove seu plano para continuar usando.",
  },
  cancelled: {
    title: "Assinatura cancelada",
    description: "Sua assinatura para este aplicativo foi cancelada. Assine novamente para recuperar o acesso.",
  },
  suspended: {
    title: "Assinatura suspensa",
    description: "Sua assinatura está suspensa por pendência de pagamento. Regularize para continuar usando.",
  },
};

export function AccessBlockedModal({ open, onOpenChange, appName, appKey, reason }: AccessBlockedModalProps) {
  const navigate = useNavigate();
  const msg = reasonMessages[reason] ?? reasonMessages.no_subscription;
  const AppIcon = appKey ? getAppIcon(appKey) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <div className="-mx-6 -mt-6 h-32 bg-gradient-to-br from-destructive/15 to-destructive/5 flex flex-col items-center justify-center rounded-t-lg gap-2">
          {AppIcon ? (
            <AppIcon className="h-10 w-10 text-destructive/50" strokeWidth={1.5} />
          ) : (
            <ShieldX className="h-10 w-10 text-destructive/50" strokeWidth={1.5} />
          )}
          <span className="text-xs font-medium text-destructive/70">{appName}</span>
        </div>
        <DialogHeader className="pt-2">
          <DialogTitle className="font-display text-xl text-foreground">{msg.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {msg.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              navigate("/subscription");
            }}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Ver planos de assinatura
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              navigate("/dashboard");
            }}
          >
            <Hexagon className="h-4 w-4 mr-2" />
            Voltar à UNITRIX
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldX, CreditCard, ArrowRight, Hexagon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAppIcon } from "@/lib/appIcons";

interface AccessBlockedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName: string;
  appKey?: string;
  reason: "no_subscription" | "expired" | "cancelled" | "suspended";
}

const reasonMessages: Record<string, { title: string; description: string }> = {
  no_subscription: {
    title: "Assinatura não encontrada",
    description: "Você ainda não possui uma assinatura ativa para este aplicativo. Assine um plano para liberar o acesso.",
  },
  expired: {
    title: "Assinatura expirada",
    description: "Sua assinatura para este aplicativo expirou. Renove seu plano para continuar usando.",
  },
  cancelled: {
    title: "Assinatura cancelada",
    description: "Sua assinatura para este aplicativo foi cancelada. Assine novamente para recuperar o acesso.",
  },
  suspended: {
    title: "Assinatura suspensa",
    description: "Sua assinatura está suspensa por pendência de pagamento. Regularize para continuar usando.",
  },
};

export function AccessBlockedModal({ open, onOpenChange, appName, appKey, reason }: AccessBlockedModalProps) {
  const navigate = useNavigate();
  const msg = reasonMessages[reason] ?? reasonMessages.no_subscription;
  const AppIcon = appKey ? getAppIcon(appKey) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <div className="-mx-6 -mt-6 h-32 bg-gradient-to-br from-destructive/15 to-destructive/5 flex flex-col items-center justify-center rounded-t-lg gap-2">
          {AppIcon ? (
            <AppIcon className="h-10 w-10 text-destructive/50" strokeWidth={1.5} />
          ) : (
            <ShieldX className="h-10 w-10 text-destructive/50" strokeWidth={1.5} />
          )}
          <span className="text-xs font-medium text-destructive/70">{appName}</span>
        </div>
        <DialogHeader className="pt-2">
          <DialogTitle className="font-display text-xl text-foreground">{msg.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {msg.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              navigate("/subscription");
            }}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Ver planos de assinatura
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              navigate("/dashboard");
            }}
          >
            <Hexagon className="h-4 w-4 mr-2" />
            Voltar à UNITRIX
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}