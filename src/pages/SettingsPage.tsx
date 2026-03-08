import { User, Palette, Shield, Bell } from "lucide-react";

const sections = [
  {
    title: "Dados da Conta",
    icon: User,
    fields: [
      { label: "Nome", value: "João Silva" },
      { label: "E-mail", value: "joao.silva@email.com" },
      { label: "Plano", value: "Professional" },
    ],
  },
  {
    title: "Preferências",
    icon: Palette,
    fields: [
      { label: "Idioma", value: "Português (BR)" },
      { label: "Tema", value: "Escuro" },
      { label: "Notificações", value: "Ativadas" },
    ],
  },
  {
    title: "Segurança",
    icon: Shield,
    fields: [
      { label: "Autenticação em 2 fatores", value: "Desativada" },
      { label: "Última alteração de senha", value: "Há 30 dias" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>

      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-border bg-card p-5 md:p-6">
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2 mb-4">
              <section.icon className="h-4 w-4 text-primary" />
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{field.label}</span>
                  <span className="text-sm text-foreground font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
