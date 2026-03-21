import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useDemoMode } from "@/hooks/useDemoMode";
import { DemoBanner } from "@/components/DemoBanner";
import { Layers } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function PageFallback() {
  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-pulse px-1">
      <Skeleton className="h-9 w-48 rounded-xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const { data: profile } = useProfile();
  const { isDemo, isTrial } = useDemoMode();

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  return (
    <SidebarProvider>
      <div className="h-screen-safe flex w-full overflow-x-hidden safe-left safe-right">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Demo banner */}
          {(isDemo || isTrial) && <DemoBanner />}
          {/* Compact mobile header with safe-area-top for iOS PWA */}
          <header className="flex items-center border-b border-border/50 px-3 sm:px-4 shrink-0 sticky top-0 z-30 bg-background/80 backdrop-blur-xl safe-top" style={{ minHeight: 'calc(env(safe-area-inset-top, 0px) + 3rem)' }}>
            <SidebarTrigger className="mr-2 sm:mr-3" />
            <div className="flex items-center gap-1.5 mr-auto">
              <div className="rounded-md bg-gradient-to-br from-primary to-accent p-1 sm:hidden">
                <Layers className="h-3 w-3 text-white" />
              </div>
              <span className="text-[11px] text-muted-foreground font-semibold sm:hidden">IA Apps</span>
            </div>
            <div className="flex items-center gap-2">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-border" />
              ) : (
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-[11px] sm:text-sm font-semibold text-primary">
                  {initials}
                </div>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">{profile?.full_name || "..."}</span>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>

          <footer className="border-t border-border/30 px-3 flex items-center justify-center gap-2 shrink-0 safe-bottom" style={{ minHeight: 'calc(env(safe-area-inset-bottom, 0px) + 2.5rem)' }}>
            <div className="rounded-md bg-gradient-to-br from-primary/40 to-accent/30 p-0.5">
              <Layers className="h-3 w-3 text-white/70" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/60">
              Ecossistema IA Apps
            </span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
