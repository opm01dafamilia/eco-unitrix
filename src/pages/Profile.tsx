import { Mail, Calendar, AppWindow, Activity } from "lucide-react";

export default function Profile() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Perfil</h1>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary font-display shrink-0">
            JS
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-display text-xl font-bold text-foreground">João Silva</h2>
            <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
              <Mail className="h-4 w-4" /> joao.silva@email.com
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
              <Calendar className="h-4 w-4" /> Membro desde Janeiro 2024
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 card-glow">
          <div className="flex items-center gap-3 mb-2">
            <AppWindow className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Apps utilizados</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">3</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 card-glow">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Sessões este mês</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">47</p>
        </div>
      </div>
    </div>
  );
}
