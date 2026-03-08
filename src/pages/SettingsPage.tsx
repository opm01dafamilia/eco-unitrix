import { User, Palette, Shield, LogOut, Save } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveName = async () => {
    try {
      await updateProfile.mutateAsync({ full_name: name });
      toast({ title: "Nome atualizado!" });
      setEditingName(false);
    } catch {
      toast({ variant: "destructive", title: "Erro ao atualizar" });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Senha fraca", description: "Mínimo 6 caracteres." });
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: "Senha atualizada!" });
      setChangingPassword(false);
      setNewPassword("");
    }
    setPasswordLoading(false);
  };

  const handleThemeChange = async (theme: string) => {
    try {
      await updateProfile.mutateAsync({ theme_preference: theme });
      document.documentElement.classList.toggle("dark", theme === "dark");
      toast({ title: `Tema alterado para ${theme === "dark" ? "Escuro" : "Claro"}` });
    } catch {
      toast({ variant: "destructive", title: "Erro ao salvar tema" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>

      <div className="space-y-5">
        {/* Account Data */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-primary" /> Dados da Conta
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Nome</span>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 w-48" />
                  <Button size="sm" variant="ghost" onClick={handleSaveName} disabled={updateProfile.isPending}>
                    <Save className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  className="text-sm text-foreground font-medium hover:text-primary"
                  onClick={() => { setName(profile?.full_name ?? ""); setEditingName(true); }}
                >
                  {profile?.full_name || "Sem nome"} ✎
                </button>
              )}
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">E-mail</span>
              <span className="text-sm text-foreground font-medium">{profile?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">Plano</span>
              <span className="text-sm text-foreground font-medium">Professional</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-primary" /> Preferências
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Idioma</span>
              <span className="text-sm text-foreground font-medium">Português (BR)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Tema</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                    profile?.theme_preference === "dark"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Escuro
                </button>
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                    profile?.theme_preference === "light"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Claro
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Notificações</span>
              <span className="text-sm text-foreground font-medium">Ativadas</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary" /> Segurança
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Alterar senha</span>
              {changingPassword ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    placeholder="Nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-8 w-48"
                  />
                  <Button size="sm" onClick={handleChangePassword} disabled={passwordLoading}>
                    {passwordLoading ? "..." : "Salvar"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setChangingPassword(false)}>Cancelar</Button>
                </div>
              ) : (
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => setChangingPassword(true)}
                >
                  Alterar
                </button>
              )}
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Autenticação em 2 fatores</span>
              <span className="text-sm text-foreground font-medium">Desativada</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Sair da conta
        </Button>
      </div>
    </div>
  );
}
