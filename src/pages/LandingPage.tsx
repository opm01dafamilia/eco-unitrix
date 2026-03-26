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
  accent: string;
  glow: string;
}

const ecosystemApps: EcoApp[] = [
  { name: "FitPulse", description: "Acompanhe sua saúde, treinos e métricas corporais em um painel inteligente.", category: "Saúde", icon: Heart, accent: "from-violet-500 to-purple-400", glow: "violet-500" },
  { name: "FinanceFlow", description: "Controle receitas, despesas e metas financeiras com análises visuais.", category: "Finanças", icon: DollarSign, accent: "from-emerald-500 to-teal-400", glow: "emerald-500" },
  { name: "MarketFlow", description: "Planeje campanhas, analise crescimento e gerencie estratégias de marketing.", category: "Marketing", icon: TrendingUp, accent: "from-blue-500 to-sky-400", glow: "blue-500" },
  { name: "IA Agenda", description: "Agendamentos inteligentes com IA que se adapta à sua rotina.", category: "Agendamento", icon: CalendarDays, accent: "from-amber-500 to-orange-400", glow: "amber-500" },
  { name: "WhatsApp Auto", description: "Automação inteligente para WhatsApp Business com respostas e fluxos.", category: "Automação", icon: MessageSquare, status: "coming_soon", accent: "from-rose-500 to-pink-400", glow: "rose-500" },
];

const benefits = [
  { icon: Lock, title: "Uma conta, acesso total", description: "Cadastre-se uma única vez e desbloqueie todos os aplicativos do UNITRIX instantaneamente." },
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
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function LandingPage() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
              <Hexagon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight">UNITRIX</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild className="btn-gradient rounded-xl shadow-lg shadow-primary/20 px-5">
              <Link to="/signup">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative py-28 sm:py-40 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-primary/6 blur-[140px]" />
          <div className="absolute right-[10%] top-[10%] h-[350px] w-[350px] rounded-full bg-accent/5 blur-[100px]" />
          <div className="absolute left-[5%] bottom-[10%] h-[250px] w-[250px] rounded-full bg-primary/4 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma inteligente de aplicativos
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
              Todos os seus apps em{" "}
              <span className="gradient-text">uma única plataforma</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-7 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Acesse aplicativos de saúde, finanças, marketing, automação e muito mais — tudo com uma única conta e um painel centralizado.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-11 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="btn-gradient w-full sm:w-auto shadow-xl shadow-primary/25 text-base px-8 py-6 rounded-xl">
                <Link to="/signup">
                  Criar conta grátis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-8 py-6 rounded-xl border-border/60 hover:border-primary/30 hover:bg-primary/5">
                <Link to="/login">Entrar na plataforma</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-14 flex items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
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
      <section className="border-t border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-5">
              <Zap className="h-3.5 w-3.5" />
              Aplicativos
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold sm:text-4xl tracking-tight">
              Aplicativos da Plataforma
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Soluções especializadas para cada área da sua vida pessoal e profissional.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {ecosystemApps.map((app, i) => (
              <motion.div
                key={app.name}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl glass-card overflow-hidden transition-all duration-500 hover:border-primary/25 card-glow"
              >
                {/* Top accent line */}
                <div className={`h-[2px] bg-gradient-to-r ${app.accent} opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />

                <div className="p-7">
                  {app.status === "coming_soon" && (
                    <span className="absolute top-5 right-5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Em breve
                    </span>
                  )}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${app.accent} shadow-lg`}>
                    <app.icon className="h-7 w-7 text-white" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-foreground tracking-tight">{app.name}</h3>
                  <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{app.description}</p>
                  <span className="mt-5 inline-flex rounded-full bg-secondary/80 backdrop-blur-sm px-3.5 py-1 text-xs font-semibold text-secondary-foreground">
                    {app.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Ecosystem Visual ─── */}
      <section className="border-t border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
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
      <section className="border-t border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Simples e rápido
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold sm:text-4xl tracking-tight">
              Como funciona
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Comece a usar a plataforma em poucos minutos.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-16 grid gap-8 sm:grid-cols-3"
          >
            {howItWorks.map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="group text-center rounded-2xl glass-card p-8 transition-all duration-500 card-glow">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                  <span className="font-display text-2xl font-extrabold gradient-text">{item.step}</span>
                </div>
                <h3 className="mt-6 font-display text-lg font-bold text-foreground tracking-tight">{item.title}</h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="border-t border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <div className="text-center">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-5">
                <Shield className="h-3.5 w-3.5" />
                Vantagens
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-bold sm:text-4xl tracking-tight">
                Por que escolher o UNITRIX?
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Tudo o que você precisa para gerenciar sua vida digital em um só lugar.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                custom={i}
                className="group rounded-2xl glass-card p-7 text-center transition-all duration-500 card-glow"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary group-hover:from-primary/20 group-hover:to-accent/15 transition-colors">
                  <b.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-base font-bold text-foreground tracking-tight">{b.title}</h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Savings Comparison ─── */}
      <section className="border-t border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
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
      <section className="py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="relative rounded-3xl glass-card-strong overflow-hidden p-12 sm:p-16 text-center"
          >
            {/* Glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[550px] rounded-full bg-primary/8 blur-[120px]" />
              <div className="absolute right-0 bottom-0 h-[200px] w-[200px] rounded-full bg-accent/6 blur-[80px]" />
            </div>

            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold sm:text-4xl tracking-tight">
              Pronto para começar?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-5 text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Crie sua conta gratuita e comece a explorar os aplicativos agora mesmo. Sem compromisso, sem cartão de crédito.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="btn-gradient shadow-xl shadow-primary/25 text-base px-8 py-6 rounded-xl">
                <Link to="/signup">
                  Começar agora <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 rounded-xl border-border/60 hover:border-primary/30 hover:bg-primary/5">
                <Link to="/login">Entrar na plataforma</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 sm:flex-row sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <Hexagon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">UNITRIX</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">Entrar</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Criar conta</Link>
          </div>
          <p className="text-xs text-muted-foreground/70">© {new Date().getFullYear()} UNITRIX. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
