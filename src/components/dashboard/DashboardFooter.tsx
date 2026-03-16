import { Link } from "react-router-dom";

export function DashboardFooter() {
  return (
    <footer className="border-t border-border pt-6 pb-4 mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <Link to="/settings" className="hover:text-foreground transition-colors">
            Ajuda
          </Link>
          <Link to="/subscription" className="hover:text-foreground transition-colors">
            Assinatura
          </Link>
          <Link to="/profile" className="hover:text-foreground transition-colors">
            Perfil
          </Link>
        </div>
        <p>© {new Date().getFullYear()} IA Apps Ecossistema. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
