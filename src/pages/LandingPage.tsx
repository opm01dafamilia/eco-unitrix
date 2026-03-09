import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

interface EcoApp {
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

const ecosystemApps: EcoApp[] = [
  { name: "FitPulse", description: "Acompanhe sua saúde e treinos em um só lugar.", category: "Saúde", icon: Heart },
  { name: "FinanceFlow", description: "Controle suas finanças pessoais com inteligência.", category: "Finanças", icon: DollarSign },
  { name: "MarketFlow", description: "Estratégias de marketing e análise de crescimento.", category: "Marketing", icon: TrendingUp },
  { name: "WhatsApp Auto", description: "Automação inteligente para WhatsApp Business.", category: "Automação", icon: MessageSquare },
  { name: "IA Agenda", description: "Agendamentos inteligentes com inteligência artificial.", category: "Agendamento", icon: CalendarDays },
];

const benefits = [
  { icon: Shield, title: "Uma conta, acesso total", description: "Cadastre-se uma vez e acesse todos os aplicativos do ecossistema." },
  { icon: Layers, title: "Apps especializados", description: "Cada aplicativo resolve um problema específico com excelência." },
  { icon: Zap, title: "Plataforma centralizada", description: "Gerencie tudo de um painel único e intuitivo." },
  { icon: Rocket, title: "Expansão contínua", description: "Novos aplicativos e funcionalidades são adicionados constantemente." },
];

export default function LandingPage() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Hexagon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Platform Hub</span>
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

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Todos os seus apps em um{" "}
            <span className="gradient-text">único ecossistema</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Acesse aplicativos de saúde, finanças, marketing, automação e muito mais — tudo com uma única conta.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/signup">
                Criar conta grátis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/login">Entrar na plataforma</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Apps */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Nossos Aplicativos</h2>
            <p className="mt-3 text-muted-foreground">Soluções especializadas para cada área da sua vida e negócio.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystemApps.map((app) => (
              <Card key={app.name} className="card-glow border-border bg-card transition-colors hover:border-primary/40">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <app.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{app.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{app.description}</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {app.category}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Por que o Platform Hub?</h2>
            <p className="mt-3 text-muted-foreground">Tudo o que você precisa em um só lugar.</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <b.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Pronto para começar?</h2>
          <p className="mt-4 text-muted-foreground">
            Crie sua conta gratuita e comece a explorar o ecossistema agora mesmo.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link to="/signup">
              Começar agora <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Hexagon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Platform Hub</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Platform Hub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
