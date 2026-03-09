import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldX, CreditCard, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccessBlockedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName: string;
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

export function AccessBlockedModal({ open, onOpenChange, appName, reason }: AccessBlockedModalProps) {
  const navigate = useNavigate();
  const msg = reasonMessages[reason] ?? reasonMessages.no_subscription;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <div className="-mx-6 -mt-6 h-28 bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center rounded-t-lg">
          <ShieldX className="h-12 w-12 text-destructive/60" strokeWidth={1.5} />
        </div>
        <DialogHeader className="pt-2">
          <DialogTitle className="font-display text-xl text-foreground">{msg.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <span className="font-medium text-foreground">{appName}</span> — {msg.description}
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
              navigate("/apps");
            }}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Voltar aos aplicativos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
