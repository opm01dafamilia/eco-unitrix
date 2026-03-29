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
          {/* Header */}
          <header className="flex items-center border-b border-border/30 px-4 sm:px-6 shrink-0 sticky top-0 z-30 bg-background/70 backdrop-blur-2xl safe-top" style={{ minHeight: 'calc(env(safe-area-inset-top, 0px) + 3.25rem)' }}>
            <SidebarTrigger className="mr-3 sm:mr-4" />
            <div className="flex items-center gap-1.5 mr-auto">
              <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-1 sm:hidden shadow-sm shadow-primary/20">
                <Layers className="h-3 w-3 text-white" />
              </div>
              <span className="text-[11px] text-muted-foreground font-bold tracking-tight sm:hidden">UNITRIX</span>
            </div>
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-border/50 shadow-sm" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-[11px] sm:text-xs font-bold text-primary border border-primary/10">
                  {initials}
                </div>
              )}
              <span className="text-sm text-muted-foreground font-medium hidden sm:inline">{profile?.full_name || "..."}</span>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>

          <footer className="border-t border-border/20 px-4 flex items-center justify-center gap-2 shrink-0 safe-bottom" style={{ minHeight: 'calc(env(safe-area-inset-bottom, 0px) + 2.5rem)' }}>
            <div className="rounded-md bg-gradient-to-br from-primary/30 to-accent/20 p-0.5">
              <Layers className="h-3 w-3 text-primary/50" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/40 font-semibold tracking-wider">
              UNITRIX
            </span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}