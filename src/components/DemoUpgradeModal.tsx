import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface DemoUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export function DemoUpgradeModal({ open, onOpenChange, featureName }: DemoUpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card-strong border-primary/20 max-w-sm mx-auto">
        <DialogHeader className="text-center items-center">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 p-4 mb-2">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="font-display text-lg">
            Recurso exclusivo para assinantes
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {featureName
              ? `"${featureName}" está disponível apenas no plano completo.`
              : "Esta funcionalidade está disponível apenas no plano completo."
            }
            {" "}Assine agora e desbloqueie acesso total a todos os recursos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-3 space-y-2">
            {["Acesso total sem restrições", "Dados salvos permanentemente", "Recursos avançados de IA"].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-primary shrink-0" />
                <span className="text-xs text-foreground">{text}</span>
              </div>
            ))}
          </div>

          <Link
            to="/subscription"
            onClick={() => onOpenChange(false)}
            className="w-full flex items-center justify-center gap-2 rounded-xl btn-gradient px-4 py-3 text-sm shadow-lg shadow-primary/20 active:scale-[0.97] min-h-[44px]"
          >
            Ver planos e assinar <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => onOpenChange(false)}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Continuar explorando
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
