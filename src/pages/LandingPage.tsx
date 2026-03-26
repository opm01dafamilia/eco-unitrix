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
  ChevronRight,
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
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LandingPage() {
  const { user } = useAuth();
  const { data: platformApps } = usePublicApps();
  const ecosystemApps = ecosystemAppDefs.map((app) => ({
    ...app,
    isInactive: isAppInactive(platformApps, app.appKey),
  }));

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 border-b border-border/20 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
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
      <section className="relative py-28 sm:py-40 lg:py-48 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[1100px] rounded-full bg-primary/6 blur-[180px]" />
          <div className="absolute right-[5%] top-[5%] h-[500px] w-[500px] rounded-full bg-accent/5 blur-[140px]" />
          <div className="absolute left-[3%] bottom-[5%] h-[350px] w-[350px] rounded-full bg-primary/4 blur-[120px]" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }} />
        </div>

        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-5 py-2 text-xs font-semibold text-primary mb-10">
              <Star className="h-3.5 w-3.5" />
              Ecossistema inteligente de aplicativos
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-[2.75rem] font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl xl:text-[5.5rem] tracking-tight">
              Todos os seus apps em{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text">uma única plataforma</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Saúde, finanças, marketing, automação — tudo integrado com uma única conta. Simplifique sua rotina com o UNITRIX.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="btn-gradient w-full sm:w-auto shadow-xl shadow-primary/25 text-base font-bold px-10 py-6 rounded-2xl">
                <Link to="/signup">
                  Começar gratuitamente <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-10 py-6 rounded-2xl border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {["Cadastro gratuito", "Sem cartão de crédito", "Acesso imediato"].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Social proof strip ─── */}
      <div className="border-y border-border/20 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 py-6 sm:px-8">
          {[
            { value: "5+", label: "Aplicativos integrados" },
            { value: "1", label: "Conta para tudo" },
            { value: "100%", label: "Centralizado" },
            { value: "24/7", label: "Disponível sempre" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 text-sm">
              <span className="font-display text-xl font-extrabold gradient-text">{s.value}</span>
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Apps ─── */}
      <section className="py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
              <Zap className="h-3.5 w-3.5" />
              Aplicativos
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem] tracking-tight">
              Conheça os aplicativos
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-5 text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
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
                <div className={`h-[2px] bg-gradient-to-r ${app.accent} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="p-7 sm:p-8">
                  {app.status === "coming_soon" && (
                    <span className="absolute top-5 right-5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Em breve
                    </span>
                  )}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${app.accent} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
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
      <section className="border-t border-border/20 py-28 sm:py-36">
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
      <section className="border-t border-border/20 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Simples e rápido
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem] tracking-tight">
              Como funciona
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-5 text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
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
              <motion.div key={item.step} variants={fadeUp} custom={i} className="group text-center rounded-2xl glass-card p-8 sm:p-10 transition-all duration-500 card-glow relative overflow-hidden">
                {/* Step connector line on desktop */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-4 w-8 h-px bg-border/40" />
                )}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                  <span className="font-display text-2xl font-extrabold gradient-text">{item.step}</span>
                </div>
                <h3 className="mt-7 font-display text-lg font-bold text-foreground tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="border-t border-border/20 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <div className="text-center">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
                <Shield className="h-3.5 w-3.5" />
                Vantagens
              </motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem] tracking-tight">
                Por que escolher o UNITRIX?
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-5 text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
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
                className="group rounded-2xl glass-card p-8 text-center transition-all duration-500 card-glow"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary group-hover:from-primary/25 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-105">
                  <b.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-7 font-display text-base font-bold text-foreground tracking-tight">{b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Pricing Cards ─── */}
      <section className="border-t border-border/20 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <PricingCards />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Savings Comparison ─── */}
      <section className="border-t border-border/20 py-28 sm:py-36">
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
      <section className="py-28 sm:py-36">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="relative rounded-3xl glass-card-strong overflow-hidden p-12 sm:p-16 lg:p-20 text-center"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/8 blur-[140px]" />
              <div className="absolute right-0 bottom-0 h-[250px] w-[250px] rounded-full bg-accent/6 blur-[100px]" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8">
              <Rocket className="h-3.5 w-3.5" />
              Comece agora
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
              Comece agora com a <span className="gradient-text">UNITRIX</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-muted-foreground max-w-lg mx-auto text-base leading-relaxed">
              Unifique sua rotina com aplicativos inteligentes em uma única plataforma. Cadastro gratuito, sem cartão de crédito.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="btn-gradient shadow-xl shadow-primary/25 text-lg font-bold px-12 py-7 rounded-2xl">
                <Link to="/signup">
                  Criar conta grátis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-10 py-7 rounded-2xl border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                <Link to="/login">Entrar na plataforma</Link>
              </Button>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="mt-8 text-xs text-muted-foreground/60">
              Junte-se ao ecossistema que simplifica tudo.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/20 py-12">
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
