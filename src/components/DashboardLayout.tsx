import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Hexagon } from "lucide-react";

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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 shrink-0">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2 ml-auto">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                {initials}
              </div>
              <span className="text-sm text-muted-foreground hidden sm:inline">{profile?.full_name || "..."}</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
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
