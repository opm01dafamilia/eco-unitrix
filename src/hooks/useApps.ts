import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AppWithAccess {
  id: string;
  app_key: string;
  app_name: string;
  app_description: string | null;
  app_status: string;
  app_url: string | null;
  app_category: string;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  user_access: string | null;
}

export function useApps() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["platform-apps", user?.id],
    queryFn: async () => {
      const { data: apps, error: appsError } = await supabase
        .from("platform_apps")
        .select("*")
        .order("sort_order");
      if (appsError) throw appsError;

      const { data: access, error: accessError } = await supabase
        .from("user_app_access")
        .select("*")
        .eq("user_id", user!.id);
      if (accessError) throw accessError;

      const accessMap = new Map(access?.map((a) => [a.app_key, a.access_status]) ?? []);

      return (apps as any[]).map((app): AppWithAccess => ({
        ...app,
        is_visible: app.is_visible ?? true,
        app_category: app.app_category ?? "produtividade",
        is_featured: app.is_featured ?? false,
        sort_order: app.sort_order ?? 0,
        user_access: accessMap.get(app.app_key) ?? null,
      }));
    },
    enabled: !!user,
  });
}
