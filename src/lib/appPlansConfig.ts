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
      promoPrice: "R$ 17,00",
      renewalPrice: "R$ 27,00 / mês",
    },
    yearly: {
      promoPrice: "R$ 147,00 à vista",
      installment: "12x de R$ 15,20",
      renewalPrice: "R$ 247,00 / ano",
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
};
