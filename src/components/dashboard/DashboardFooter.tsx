import { Link } from "react-router-dom";

export function DashboardFooter() {
  return (
    <footer className="border-t border-border/20 pt-8 pb-4 mt-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-muted-foreground/50">
            <Link to="/settings" className="hover:text-foreground/70 transition-colors duration-300">
              Ajuda
            </Link>
            <Link to="/subscription" className="hover:text-foreground/70 transition-colors duration-300">
              Assinatura
            </Link>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/35 text-center tracking-wide">
          © {new Date().getFullYear()} UNITRIX. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
