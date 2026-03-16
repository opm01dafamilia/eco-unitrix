import { Link } from "react-router-dom";

export function DashboardFooter() {
  return (
    <footer className="border-t border-border pt-5 pb-3 mt-2">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/settings" className="hover:text-foreground transition-colors">
              Ajuda
            </Link>
            <Link to="/subscription" className="hover:text-foreground transition-colors">
              Assinatura
            </Link>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground/60 text-center">
          © {new Date().getFullYear()} Ecossistema IA Apps. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
