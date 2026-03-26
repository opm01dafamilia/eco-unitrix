import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicApp {
  app_key: string;
  app_name: string;
  app_status: string;
  app_description: string | null;
  is_visible: boolean;
}

export function usePublicApps() {
  return useQuery({
    queryKey: ["public-platform-apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_apps")
        .select("app_key, app_name, app_status, app_description, is_visible")
        .order("sort_order");
      if (error) throw error;
      return data as PublicApp[];
    },
    staleTime: 30000,
  });
}

/** Check if an app_key is inactive based on fetched platform apps */
export function isAppInactive(apps: PublicApp[] | undefined, appKey: string): boolean {
  if (!apps) return false;
  const app = apps.find((a) => a.app_key === appKey);
  return app ? app.app_status !== "active" : false;
}
