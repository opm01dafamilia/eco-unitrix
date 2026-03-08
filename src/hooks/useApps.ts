import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useApps() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["platform-apps", user?.id],
    queryFn: async () => {
      const { data: apps, error: appsError } = await supabase
        .from("platform_apps")
        .select("*")
        .order("created_at");
      if (appsError) throw appsError;

      const { data: access, error: accessError } = await supabase
        .from("user_app_access")
        .select("*")
        .eq("user_id", user!.id);
      if (accessError) throw accessError;

      const accessMap = new Map(access?.map((a) => [a.app_key, a.access_status]) ?? []);

      return apps.map((app) => ({
        ...app,
        user_access: accessMap.get(app.app_key) ?? null,
      }));
    },
    enabled: !!user,
  });
}
