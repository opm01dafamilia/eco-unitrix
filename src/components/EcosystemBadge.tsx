import { Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

export function EcosystemBadge({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/dashboard"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary hover:bg-primary/15 transition-colors ${className}`}
    >
      <Hexagon className="h-3 w-3" />
      UNITRIX
    </Link>
  );
}
