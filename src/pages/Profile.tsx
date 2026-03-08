import { Mail, Calendar, AppWindow, Activity, Pencil, Check, X } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useApps } from "@/hooks/useApps";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const { data: apps } = useApps();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const activeApps = apps?.filter((a) => a.user_access === "active").length ?? 0;
  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  const handleEdit = () => {
    setName(profile?.full_name ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ full_name: name });
      toast({ title: "Perfil atualizado!" });
      setEditing(false);
    } catch {
      toast({ variant: "destructive", title: "Erro ao atualizar perfil" });
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto space-y-8"><div className="h-40 rounded-xl bg-card animate-pulse" /></div>;
  }

  const createdDate = profile?.created_at
    ? format(new Date(profile.created_at), "MMMM yyyy", { locale: ptBR })
    : "";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Perfil</h1>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary font-display shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1 flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-xs" />
                <Button size="icon" variant="ghost" onClick={handleSave} disabled={updateProfile.isPending}>
                  <Check className="h-4 w-4 text-primary" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-foreground">{profile?.full_name || "Sem nome"}</h2>
                <button onClick={handleEdit} className="text-muted-foreground hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
              <Mail className="h-4 w-4" /> {profile?.email}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
              <Calendar className="h-4 w-4" /> Membro desde {createdDate}
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
          <p className="font-display text-3xl font-bold text-foreground">{activeApps}</p>
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
