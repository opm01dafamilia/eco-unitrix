import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SavingsComparison from "@/components/SavingsComparison";
import EcosystemVisual from "@/components/EcosystemVisual";
import PricingCards from "@/components/PricingCards";
import { usePublicApps, isAppInactive } from "@/hooks/usePublicApps";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Hexagon,
  Heart,
  DollarSign,
  TrendingUp,
  MessageSquare,
  CalendarDays,
  Shield,
  Layers,
  Zap,
  Rocket,
  ArrowRight,
  Check,
  Sparkles,
  Globe,
  Lock,
  Star,
  type LucideIcon,
} from "lucide-react";

interface EcoApp {
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  appKey: string;
  accent: string;
  glow: string;
}

const ecosystemAppDefs: EcoApp[] = [
  { name: "FitPulse", appKey: "fitpulse", description: "Acompanhe sua saúde, treinos e métricas corporais em um painel inteligente.", category: "Saúde", icon: Heart, accent: "from-violet-500 to-purple-400", glow: "violet-500" },
  { name: "FinanceFlow", appKey: "financeflow", description: "Controle receitas, despesas e metas financeiras com análises visuais.", category: "Finanças", icon: DollarSign, accent: "from-emerald-500 to-teal-400", glow: "emerald-500" },
  { name: "MarketFlow", appKey: "marketflow", description: "Planeje campanhas, analise crescimento e gerencie estratégias de marketing.", category: "Marketing", icon: TrendingUp, accent: "from-blue-500 to-sky-400", glow: "blue-500" },
  { name: "IA Agenda", appKey: "ia_agenda", description: "Agendamentos inteligentes com IA que se adapta à sua rotina.", category: "Agendamento", icon: CalendarDays, accent: "from-amber-500 to-orange-400", glow: "amber-500" },
  { name: "WhatsApp Auto", appKey: "whatsapp_auto", description: "Automação inteligente para WhatsApp Business com respostas e fluxos.", category: "Automação", icon: MessageSquare, accent: "from-rose-500 to-pink-400", glow: "rose-500" },
];

export default function LandingPage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/20 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Hexagon className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight">
              UNITRIX
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Todos os seus apps em{" "}
            <span className="text-primary">uma única plataforma</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Saúde, finanças, marketing e automação — tudo integrado com uma única conta UNITRIX.
          </p>

          <div className="mt-10 flex gap-4 justify-center">
            <Button asChild>
              <Link to="/signup">Começar grátis</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} UNITRIX. Todos os direitos reservados.
      </footer>
    </div>
  );
}