import { Crown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroCardProps {
  firstName: string;
  isLoading: boolean;
  isDemo: boolean;
}

export function HeroCard({ firstName, isLoading, isDemo }: HeroCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          {isDemo && (
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10">
              Modo Demo
            </Badge>
          )}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Olá! Bem-vindo ao{" "}
          <span className="gradient-text">Ecossistema IA Apps</span>.
        </h1>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
          Explore nossos aplicativos com inteligência artificial. Teste as funcionalidades no modo demo
          ou assine o plano completo para acesso ilimitado a todo o ecossistema.
        </p>
      </div>
    </div>
  );
}
