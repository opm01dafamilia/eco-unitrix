export interface PlanPricing {
  promoPrice: string;
  renewalPrice: string;
  installment?: string;
  cashPrice?: string;
}

export interface AppPlanConfig {
  monthly: PlanPricing;
  yearly: PlanPricing;
  benefits: string[];
}

export const appPlansConfig: Record<string, AppPlanConfig> = {
  fitpulse: {
    monthly: {
      promoPrice: "R$ 9,90",
      renewalPrice: "R$ 19,90 / mês",
    },
    yearly: {
      promoPrice: "R$ 147,00 à vista",
      installment: "12x de R$ 15,20",
      renewalPrice: "R$ 197,00 / ano",
    },
    benefits: [
      "Treino personalizado",
      "Dieta automática",
      "Acompanhamento físico",
      "Metas fitness",
      "Histórico de evolução",
    ],
  },
  financeflow: {
    monthly: {
      promoPrice: "R$ 9,90",
      renewalPrice: "R$ 19,90 / mês",
    },
    yearly: {
      promoPrice: "R$ 137,00 à vista",
      installment: "12x de R$ 14,17",
      renewalPrice: "R$ 197,00 / ano",
    },
    benefits: [
      "Controle de receitas e despesas",
      "Planejamento financeiro",
      "Análise de gastos",
      "Metas financeiras",
      "Histórico financeiro",
    ],
  },
  marketflow: {
    monthly: {
      promoPrice: "R$ 19,90",
      renewalPrice: "R$ 37,00 / mês",
    },
    yearly: {
      promoPrice: "R$ 217,00 à vista",
      installment: "12x de R$ 22,44",
      renewalPrice: "R$ 377,00 / ano",
    },
    benefits: [
      "Gerador de anúncios",
      "Gerador de copy",
      "Criador de funil",
      "Análise de campanhas",
      "Histórico de campanhas",
    ],
  },
  ia_agenda: {
    monthly: {
      promoPrice: "R$ 17,00",
      renewalPrice: "R$ 37,00 / mês",
    },
    yearly: {
      promoPrice: "R$ 147,00 à vista",
      installment: "12x de R$ 15,20",
      renewalPrice: "R$ 297,00 / ano",
    },
    benefits: [
      "Agendamentos",
      "Gestão de horários",
      "Organização de clientes",
      "Controle de compromissos",
      "Interface simples para uso diário",
    ],
  },
  whatsapp_auto: {
    monthly: {
      promoPrice: "R$ 37,00",
      renewalPrice: "R$ 47,00 / mês",
    },
    yearly: {
      promoPrice: "R$ 297,00 à vista",
      installment: "12x de R$ 30,72",
      renewalPrice: "R$ 477,00 / ano",
    },
    benefits: [
      "Automação para WhatsApp",
      "Fluxos automáticos",
      "Respostas organizadas",
      "Controle de automações",
      "Experiência profissional de atendimento",
    ],
  },
  ecosystem: {
    monthly: {
      promoPrice: "R$ 67,00",
      renewalPrice: "R$ 97,00 / mês",
    },
    yearly: {
      promoPrice: "R$ 697,00 à vista",
      installment: "12x de R$ 67,42",
      renewalPrice: "R$ 997,00 / ano",
    },
    benefits: [
      "Acesso a todos os aplicativos",
      "FitPulse — treino e dieta",
      "FinanceFlow — controle financeiro",
      "MarketFlow — marketing digital",
      "IA Agenda — agendamentos",
      "WhatsApp Auto — automação",
      "Atualizações e novos apps inclusos",
    ],
  },
};