import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Hexagon } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function PageFallback() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      <Skeleton className="h-9 w-56 rounded-lg" />
      <Skeleton className="h-32 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const { data: profile } = useProfile();

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  return (
    <SidebarProvider>
      <div className="min-h-screen min-h-[100dvh] flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-3 sm:px-4 shrink-0 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
            <SidebarTrigger className="mr-3" />
            <div className="flex items-center gap-1.5 mr-auto">
              <Hexagon className="h-4 w-4 text-primary sm:hidden" />
              <span className="text-xs text-muted-foreground font-medium sm:hidden">Platform Hub</span>
            </div>
            <div className="flex items-center gap-2">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover border border-border" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                  {initials}
                </div>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">{profile?.full_name || "..."}</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>
          <footer className="border-t border-border px-4 py-3 flex items-center justify-center gap-2 shrink-0">
            <Hexagon className="h-3.5 w-3.5 text-primary/60" />
            <span className="text-[11px] text-muted-foreground">
              Platform Hub — Central do Ecossistema
            </span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
