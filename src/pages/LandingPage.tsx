import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SavingsComparison from "@/components/SavingsComparison";
import EcosystemVisual from "@/components/EcosystemVisual";
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
  ChevronRight,
  Check,
  Sparkles,
  Globe,
  Lock,
  type LucideIcon,
} from "lucide-react";

interface EcoApp {
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  status?: "active" | "coming_soon";
}

const ecosystemApps: EcoApp[] = [
  { name: "FitPulse", description: "Acompanhe sua saúde, treinos e métricas corporais em um painel inteligente.", category: "Saúde", icon: Heart },
  { name: "FinanceFlow", description: "Controle receitas, despesas e metas financeiras com análises visuais.", category: "Finanças", icon: DollarSign },
  { name: "MarketFlow", description: "Planeje campanhas, analise crescimento e gerencie estratégias de marketing.", category: "Marketing", icon: TrendingUp },
  { name: "IA Agenda", description: "Agendamentos inteligentes com IA que se adapta à sua rotina.", category: "Agendamento", icon: CalendarDays },
  { name: "WhatsApp Auto", description: "Automação inteligente para WhatsApp Business com respostas e fluxos.", category: "Automação", icon: MessageSquare, status: "coming_soon" },
];

const benefits = [
  { icon: Lock, title: "Uma conta, acesso total", description: "Cadastre-se uma única vez e desbloqueie todos os aplicativos do ecossistema instantaneamente." },
  { icon: Layers, title: "Apps especializados", description: "Cada aplicativo é focado em resolver um problema específico com excelência e profundidade." },
  { icon: Globe, title: "Plataforma centralizada", description: "Gerencie todos os seus apps em um painel único, organizado e intuitivo." },
  { icon: Rocket, title: "Expansão contínua", description: "Novos aplicativos e funcionalidades são adicionados constantemente à plataforma." },
];

const howItWorks = [
  { step: "01", title: "Crie sua conta", description: "Cadastro rápido e gratuito com acesso imediato à plataforma." },
  { step: "02", title: "Explore os apps", description: "Descubra aplicativos especializados para cada área da sua vida." },
  { step: "03", title: "Use e evolua", description: "Acesse tudo de um só lugar enquanto a plataforma cresce com você." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LandingPage() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Hexagon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">UNITRIX</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild className="shadow-lg shadow-primary/20">
              <Link to="/signup">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative py-24 sm:py-36 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/3 blur-[80px]" />
          <div className="absolute left-0 bottom-0 h-[200px] w-[200px] rounded-full bg-primary/3 blur-[60px]" />
        </div>

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma inteligente de aplicativos
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl xl:text-7xl">
              Todos os seus apps em um{" "}
              <span className="gradient-text">única plataforma</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Acesse aplicativos de saúde, finanças, marketing, automação e muito mais — tudo com uma única conta e um painel centralizado.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="w-full sm:w-auto shadow-xl shadow-primary/25 text-base px-8 py-6">
                <Link to="/signup">
                  Criar conta grátis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-8 py-6">
                <Link to="/login">Entrar na plataforma</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              {["Cadastro gratuito", "Sem cartão de crédito", "Acesso imediato"].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Apps ─── */}
      <section className="border-t border-border/50 bg-muted/20 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4">
              <Zap className="h-3.5 w-3.5" />
              UNITRIX
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold sm:text-4xl">
              Aplicativos da Plataforma
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Soluções especializadas para cada área da sua vida pessoal e profissional.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {ecosystemApps.map((app, i) => (
              <motion.div
                key={app.name}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                {app.status === "coming_soon" && (
                  <span className="absolute top-4 right-4 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                    Em breve
                  </span>
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <app.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{app.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{app.description}</p>
                <span className="mt-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {app.category}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Ecosystem Visual ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <EcosystemVisual />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Simples e rápido
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold sm:text-4xl">
              Como funciona
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Comece a usar a plataforma em poucos minutos.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-14 grid gap-8 sm:grid-cols-3"
          >
            {howItWorks.map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <span className="font-display text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="border-t border-border/50 bg-muted/20 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <div className="text-center">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4">
                <Shield className="h-3.5 w-3.5" />
                Vantagens
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold sm:text-4xl">
                Por que escolher o UNITRIX?
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Tudo o que você precisa para gerenciar sua vida digital em um só lugar.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <b.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Savings Comparison ─── */}
      <section className="border-t border-border/50 bg-muted/20 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <SavingsComparison />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-10 sm:p-16 text-center overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
            </div>

            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold sm:text-4xl">
              Pronto para começar?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Crie sua conta gratuita e comece a explorar os aplicativos agora mesmo. Sem compromisso, sem cartão de crédito.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="shadow-xl shadow-primary/25 text-base px-8 py-6">
                <Link to="/signup">
                  Começar agora <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-6">
                <Link to="/login">Entrar na plataforma</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Hexagon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold">UNITRIX</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">Entrar</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Criar conta</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Platform Hub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
