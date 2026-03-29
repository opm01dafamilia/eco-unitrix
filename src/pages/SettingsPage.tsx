import { User, Palette, Shield, LogOut, Save, Bell, Globe, Monitor, Clock, Camera } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  useEffect(() => {
    if (profile?.theme_preference) {
      document.documentElement.classList.toggle("dark", profile.theme_preference === "dark");
    }
  }, [profile?.theme_preference]);

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast({ variant: "destructive", title: "Nome não pode ser vazio" });
      return;
    }
    try {
      await updateProfile.mutateAsync({ full_name: name.trim() });
      toast({ title: "Nome atualizado com sucesso!" });
      setEditingName(false);
    } catch {
      toast({ variant: "destructive", title: "Erro ao atualizar nome" });
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast({ variant: "destructive", title: "E-mail inválido" });
      return;
    }
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: "E-mail de confirmação enviado!", description: "Verifique sua caixa de entrada para confirmar a alteração." });
      setEditingEmail(false);
      setNewEmail("");
    }
    setEmailLoading(false);
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
      toast({ title: "Senha atualizada com sucesso!" });
      setChangingPassword(false);
      setNewPassword("");
    }
    setPasswordLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Arquivo inválido", description: "Selecione uma imagem." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo grande demais", description: "Máximo 2MB." });
      return;
    }

    setAvatarLoading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ variant: "destructive", title: "Erro no upload", description: uploadError.message });
      setAvatarLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

    try {
      await updateProfile.mutateAsync({ avatar_url: publicUrl });
      toast({ title: "Avatar atualizado com sucesso!" });
    } catch {
      toast({ variant: "destructive", title: "Erro ao salvar avatar" });
    }
    setAvatarLoading(false);
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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  const createdDate = profile?.created_at
    ? format(new Date(profile.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "—";

  const lastSignIn = user?.last_sign_in_at
    ? format(new Date(user.last_sign_in_at), "dd MMM yyyy, HH:mm", { locale: ptBR })
    : "—";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">Configurações</h1>

      <div className="space-y-5">
        {/* Avatar & Account Data */}
        <div className="rounded-2xl glass-card p-6 md:p-7">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2.5 mb-5">
            <div className="rounded-xl bg-primary/10 p-2">
              <User className="h-4 w-4 text-primary" />
            </div>
            Dados da Conta
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/30">
            <div className="relative group">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-border/50 shadow-lg"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-lg font-bold text-primary font-display border-2 border-primary/10">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
              >
                {avatarLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{profile?.full_name || "Sem nome"}</p>
              <p className="text-xs text-muted-foreground/70">{profile?.email}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:underline mt-1 font-medium"
              >
                Alterar foto
              </button>
            </div>
          </div>

          <div className="space-y-0">
            {/* Name */}
            <div className="flex items-center justify-between py-3.5 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Nome</span>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 w-48 rounded-lg" />
                  <Button size="sm" variant="ghost" onClick={handleSaveName} disabled={updateProfile.isPending} className="rounded-lg">
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingName(false)} className="rounded-lg">✕</Button>
                </div>
              ) : (
                <button
                  className="text-sm text-foreground font-semibold hover:text-primary transition-colors"
                  onClick={() => { setName(profile?.full_name ?? ""); setEditingName(true); }}
                >
                  {profile?.full_name || "Sem nome"} ✎
                </button>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3.5 border-b border-border/30">
              <span className="text-sm text-muted-foreground">E-mail</span>
              {editingEmail ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Novo e-mail"
                    className="h-8 w-48 rounded-lg"
                  />
                  <Button size="sm" onClick={handleChangeEmail} disabled={emailLoading} className="rounded-lg btn-gradient">
                    {emailLoading ? <div className="h-3 w-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Salvar"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingEmail(false)} className="rounded-lg">✕</Button>
                </div>
              ) : (
                <button
                  className="text-sm text-foreground font-semibold hover:text-primary transition-colors"
                  onClick={() => { setNewEmail(profile?.email ?? ""); setEditingEmail(true); }}
                >
                  {profile?.email} ✎
                </button>
              )}
            </div>

            {/* Created at */}
            <div className="flex items-center justify-between py-3.5">
              <span className="text-sm text-muted-foreground">Conta criada em</span>
              <span className="text-sm text-foreground font-semibold">{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl glass-card p-6 md:p-7">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2.5 mb-5">
            <div className="rounded-xl bg-primary/10 p-2">
              <Palette className="h-4 w-4 text-primary" />
            </div>
            Preferências
          </h2>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3.5 border-b border-border/30">
              <div className="flex items-center gap-2.5">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tema</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`text-xs px-4 py-2 rounded-xl border transition-all duration-200 font-semibold ${
                    profile?.theme_preference === "dark"
                      ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  Escuro
                </button>
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`text-xs px-4 py-2 rounded-xl border transition-all duration-200 font-semibold ${
                    profile?.theme_preference === "light"
                      ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  Claro
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-border/30">
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Idioma</span>
              </div>
              <span className="text-sm text-foreground font-semibold">Português (BR)</span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Notificações</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl glass-card p-6 md:p-7">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2.5 mb-5">
            <div className="rounded-xl bg-primary/10 p-2">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            Segurança
          </h2>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3.5 border-b border-border/30">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Último login</span>
              </div>
              <span className="text-sm text-foreground font-semibold">{lastSignIn}</span>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Alterar senha</span>
              {changingPassword ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    placeholder="Nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-8 w-48 rounded-lg"
                  />
                  <Button size="sm" onClick={handleChangePassword} disabled={passwordLoading} className="rounded-lg btn-gradient">
                    {passwordLoading ? <div className="h-3 w-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Salvar"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setChangingPassword(false)} className="rounded-lg">Cancelar</Button>
                </div>
              ) : (
                <button
                  className="text-sm text-primary hover:underline font-semibold"
                  onClick={() => setChangingPassword(true)}
                >
                  Alterar
                </button>
              )}
            </div>

            <div className="flex items-center justify-between py-3.5 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Sessão ativa</span>
              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Conectado
              </div>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <span className="text-sm text-muted-foreground">Autenticação em 2 fatores</span>
              <span className="text-sm text-foreground font-semibold">Desativada</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="destructive" className="w-full rounded-xl h-12 text-sm font-bold" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Sair da conta
        </Button>
      </div>
    </div>
  );
}
