import { Mail, Calendar, AppWindow, Pencil, Check, X, Camera, Crown, CreditCard, Gift, XCircle } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useApps } from "@/hooks/useApps";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAppIcon } from "@/lib/appIcons";

const accessTypeConfig = {
  lifetime: { label: "Vitalício", icon: Crown, color: "text-yellow-500" },
  paid: { label: "Assinatura", icon: CreditCard, color: "text-primary" },
  trial: { label: "Teste grátis", icon: Gift, color: "text-blue-400" },
  inactive: { label: "Inativo", icon: XCircle, color: "text-muted-foreground" },
} as const;

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const { data: apps } = useApps();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!name.trim()) {
      toast({ variant: "destructive", title: "Nome não pode ser vazio" });
      return;
    }
    try {
      await updateProfile.mutateAsync({ full_name: name.trim() });
      toast({ title: "Perfil atualizado com sucesso!" });
      setEditing(false);
    } catch {
      toast({ variant: "destructive", title: "Erro ao atualizar perfil" });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Selecione uma imagem" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Máximo 2MB" });
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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  const createdDate = profile?.created_at
    ? format(new Date(profile.created_at), "MMMM yyyy", { locale: ptBR })
    : "";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">Perfil</h1>

      <div className="rounded-2xl glass-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-20 w-20 rounded-2xl object-cover border-2 border-border/50 shadow-lg"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-2xl font-bold text-primary font-display border-2 border-primary/10">
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
                <Camera className="h-5 w-5 text-white" />
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
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-xs rounded-xl" />
                <Button size="icon" variant="ghost" onClick={handleSave} disabled={updateProfile.isPending} className="rounded-xl">
                  {updateProfile.isPending ? (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditing(false)} className="rounded-xl">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-foreground tracking-tight">{profile?.full_name || "Sem nome"}</h2>
                <button onClick={handleEdit} className="text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start text-sm">
              <Mail className="h-4 w-4" /> {profile?.email}
            </p>
            <p className="text-sm text-muted-foreground/70 flex items-center gap-2 justify-center sm:justify-start">
              <Calendar className="h-4 w-4" /> Membro desde {createdDate}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl glass-card p-5 card-glow max-w-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-primary/10 p-2">
            <AppWindow className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground font-medium">Apps com acesso</span>
        </div>
        <p className="font-display text-3xl font-bold text-foreground">{activeApps}</p>
      </div>

      {/* App access details */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-5 tracking-tight">Seus aplicativos</h2>
        <div className="rounded-2xl glass-card overflow-hidden divide-y divide-border/40">
          {apps?.filter((a) => a.is_visible).map((app) => {
            const cfg = accessTypeConfig[app.access_type];
            const Icon = getAppIcon(app.app_key) || AppWindow;

            return (
              <div key={app.id} className="flex items-center justify-between px-5 py-4 hover:bg-primary/[0.02] transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{app.app_name}</p>
                    <p className="text-xs text-muted-foreground/70">{app.app_category}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`${cfg.color} border-current/20 gap-1 rounded-lg`}>
                  <cfg.icon className="h-3 w-3" />
                  {cfg.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
