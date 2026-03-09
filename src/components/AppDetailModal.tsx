import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, ExternalLink, Star, Wrench, EyeOff, Calendar, AppWindow, CreditCard, Check, Tag } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { Badge } from "@/components/ui/badge";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useSubscriptionPlans } from "@/hooks/useSubscriptions";
import { AccessBlockedModal } from "@/components/AccessBlockedModal";
import { appPlansConfig } from "@/lib/appPlansConfig";
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
  const { launchApp, blockedApp, clearBlockedApp } = useAppLauncher();
  const { data: plans } = useSubscriptionPlans(app?.app_key);

  if (!app) return null;

  const available = app.app_status === "active" && app.user_access === "active";
  const config = appPlansConfig[app.app_key];

  const getStatusInfo = () => {
    if (app.app_status === "inactive") return { label: "Indisponível", icon: XCircle, class: "text-muted-foreground bg-muted" };
    if (app.app_status === "disabled") return { label: "Desativado", icon: EyeOff, class: "text-muted-foreground bg-muted" };
    if (app.app_status === "maintenance") return { label: "Em manutenção", icon: Wrench, class: "text-orange-400 bg-orange-400/10" };
    if (app.app_status === "coming_soon") return { label: "Em breve", icon: Clock, class: "text-amber-400 bg-amber-400/10" };
    if (app.user_access === "active") return { label: "Acesso ativo", icon: CheckCircle2, class: "text-primary bg-primary/10" };
    if (!app.user_access) return { label: "Sem acesso", icon: XCircle, class: "text-muted-foreground bg-muted" };
    return { label: "Disponível", icon: CheckCircle2, class: "text-blue-400 bg-blue-400/10" };
  };

  const getButtonLabel = () => {
    if (app.app_status === "inactive") return "Indisponível no momento";
    if (app.app_status === "disabled") return "Desativado";
    if (app.app_status === "maintenance") return "Em manutenção";
    if (app.app_status === "coming_soon") return "Em breve";
    if (available) return `Acessar ${app.app_name}`;
    return "Solicitar acesso";
  };

  const status = getStatusInfo();
  const createdDate = new Date(app.created_at).toLocaleDateString("pt-BR");
  const activePlans = plans?.filter((p) => p.status === "active") ?? [];

  const monthlyPlans = activePlans.filter((p) => p.billing_type === "monthly");
  const yearlyPlans = activePlans.filter((p) => p.billing_type === "yearly");

  const isAppUnavailable = ["inactive", "disabled", "maintenance", "coming_soon"].includes(app.app_status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border bg-card max-h-[90vh] overflow-y-auto">
        <div className="-mx-6 -mt-6 h-32 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center rounded-t-lg relative">
          {(() => { const Icon = getAppIcon(app.app_key); return Icon ? <Icon className="h-12 w-12 text-primary/60" strokeWidth={1.5} /> : <AppWindow className="h-12 w-12 text-primary/40" strokeWidth={1.5} />; })()}
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

          {/* Benefits */}
          {config && (
            <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">O que você recebe</h4>
              <ul className="space-y-1.5">
                {config.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Subscription Plans */}
          {(activePlans.length > 0 || config) && (
            <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Assinar plano
              </h4>

              {isAppUnavailable && (
                <p className="text-xs text-muted-foreground italic">
                  Este aplicativo está indisponível no momento. Os planos serão ativados quando o app estiver disponível.
                </p>
              )}

              <div className="grid gap-3">
                {/* Monthly Plans */}
                {monthlyPlans.map((plan) => {
                  const pricing = config?.monthly;
                  return (
                    <div
                      key={plan.id}
                      className={`rounded-lg border border-border bg-card p-4 space-y-2 ${isAppUnavailable ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{plan.plan_name}</p>
                          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">Mensal</Badge>
                        </div>
                      </div>

                      {pricing && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary font-medium">Primeiro mês:</span>
                            <span className="text-sm font-bold text-foreground">{pricing.promoPrice}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-5">
                            Depois: {pricing.renewalPrice}
                          </p>
                        </div>
                      )}

                      {!pricing && plan.price_description && (
                        <p className="text-xs text-muted-foreground">{plan.price_description}</p>
                      )}

                      <a
                        href={!isAppUnavailable ? (plan.kiwify_url ?? "#") : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-2 flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-colors ${
                          isAppUnavailable
                            ? "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {isAppUnavailable ? "Indisponível" : "Assinar plano mensal"}
                        {!isAppUnavailable && <ExternalLink className="h-3 w-3" />}
                      </a>
                    </div>
                  );
                })}

                {/* Yearly Plans */}
                {yearlyPlans.map((plan) => {
                  const pricing = config?.yearly;
                  return (
                    <div
                      key={plan.id}
                      className={`rounded-lg border border-primary/30 bg-card p-4 space-y-2 relative ${isAppUnavailable ? "opacity-60" : ""}`}
                    >
                      <div className="absolute -top-2.5 right-3">
                        <Badge className="text-[10px] bg-primary text-primary-foreground">Melhor oferta</Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{plan.plan_name}</p>
                        <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">Anual</Badge>
                      </div>

                      {pricing && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary font-medium">Primeiro ano:</span>
                          </div>
                          <div className="pl-5 space-y-0.5">
                            {pricing.installment && (
                              <p className="text-sm font-bold text-foreground">{pricing.installment}</p>
                            )}
                            {pricing.promoPrice && (
                              <p className="text-xs text-muted-foreground">ou {pricing.promoPrice}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground pl-5">
                            Depois: {pricing.renewalPrice}
                          </p>
                        </div>
                      )}

                      {!pricing && plan.price_description && (
                        <p className="text-xs text-muted-foreground">{plan.price_description}</p>
                      )}

                      <a
                        href={!isAppUnavailable ? (plan.kiwify_url ?? "#") : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-2 flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-colors ${
                          isAppUnavailable
                            ? "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {isAppUnavailable ? "Indisponível" : "Assinar plano anual"}
                        {!isAppUnavailable && <ExternalLink className="h-3 w-3" />}
                      </a>
                    </div>
                  );
                })}

                {/* Fallback if no DB plans but config exists */}
                {activePlans.length === 0 && config && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Planos serão disponibilizados em breve.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {blockedApp && (
          <AccessBlockedModal
            open={!!blockedApp}
            onOpenChange={(open) => !open && clearBlockedApp()}
            appName={blockedApp.appName}
            appKey={blockedApp.appKey}
            reason={blockedApp.reason}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
