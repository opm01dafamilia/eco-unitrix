import { Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoContext } from "@/contexts/DemoContext";

export function TrialCountdown() {
  const { access } = useDemoContext();

  if (access.isLoading || access.accessType !== "trial") return null;

  const days = access.daysRemaining ?? 0;
  const isUrgent = days <= 1;
  const expired = access.trialExpired;

  if (expired) {
    return (
      <div className="rounded-2xl glass-card-strong p-4 sm:p-5 relative overflow-hidden glow-ring animate-fade-in">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, hsl(0 70% 50% / 0.06), transparent 60%)" }} />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-xl p-2.5 shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(0 70% 50% / 0.15), hsl(0 70% 50% / 0.08))" }}>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-foreground text-sm">
                Teste grátis expirado
              </span>
              <p className="text-[11px] text-muted-foreground/70 leading-snug mt-0.5">
                Assine para continuar usando o UNITRIX
              </p>
            </div>
          </div>
          <Link
            to="/subscription"
            className="inline-flex items-center gap-1.5 rounded-xl btn-gradient px-4 py-2.5 text-xs font-bold shrink-0 shadow-lg shadow-primary/15 min-h-[38px]"
          >
            Assinar <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card-strong p-4 sm:p-5 relative overflow-hidden glow-ring animate-fade-in"
      style={{ animationDelay: "0.08s" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: isUrgent
            ? "linear-gradient(135deg, hsl(30 90% 55% / 0.06), transparent 60%)"
            : "linear-gradient(135deg, hsl(255 80% 65% / 0.04), transparent 60%)",
        }} />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl p-2.5 shrink-0"
            style={{
              background: isUrgent
                ? "linear-gradient(135deg, hsl(30 90% 55% / 0.18), hsl(30 90% 55% / 0.08))"
                : "linear-gradient(135deg, hsl(255 80% 65% / 0.15), hsl(215 75% 58% / 0.08))",
            }}>
            <Clock className={`h-5 w-5 ${isUrgent ? "text-orange-400" : "text-primary"}`} />
          </div>
          <div className="min-w-0">
            <span className="font-display font-bold text-foreground text-sm">
              {isUrgent
                ? days === 0
                  ? "Último dia de teste grátis!"
                  : "Falta 1 dia no seu teste grátis"
                : `Faltam ${days} dias no seu teste grátis`}
            </span>
            <p className="text-[11px] text-muted-foreground/70 leading-snug mt-0.5">
              {isUrgent
                ? "Assine agora para não perder o acesso"
                : "Aproveite para explorar todos os aplicativos"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="w-24 h-1.5 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(5, ((7 - days) / 7) * 100)}%`,
                background: isUrgent
                  ? "linear-gradient(90deg, hsl(30 90% 55%), hsl(0 70% 50%))"
                  : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
              }}
            />
          </div>
          <Link
            to="/subscription"
            className="inline-flex items-center gap-1.5 rounded-xl btn-gradient px-4 py-2.5 text-xs font-bold shrink-0 shadow-lg shadow-primary/15 min-h-[38px]"
          >
            Assinar <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Link
          to="/subscription"
          className="sm:hidden inline-flex items-center gap-1 rounded-xl btn-gradient px-3 py-2 text-[11px] font-bold shrink-0 shadow-lg shadow-primary/15 min-h-[34px]"
        >
          Assinar <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
