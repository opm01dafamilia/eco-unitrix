import { Link } from "react-router-dom";

export function DashboardFooter() {
  return (
    <footer className="border-t border-border/30 pt-6 pb-4 mt-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-muted-foreground/60">
            <Link to="/settings" className="hover:text-foreground/80 transition-colors duration-300">
              Ajuda
            </Link>
            <Link to="/subscription" className="hover:text-foreground/80 transition-colors duration-300">
              Assinatura
            </Link>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/40 text-center tracking-wide">
          © {new Date().getFullYear()} Ecossistema IA Apps. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
