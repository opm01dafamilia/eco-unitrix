import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Hexagon className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
          <p className="text-muted-foreground mt-2">Página não encontrada</p>
          <p className="text-sm text-muted-foreground mt-1">A página que você procura não existe ou foi movida.</p>
        </div>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
