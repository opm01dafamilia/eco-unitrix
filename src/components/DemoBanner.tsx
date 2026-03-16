import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function DemoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 border-b border-primary/10 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="rounded-md bg-gradient-to-r from-primary to-accent p-1 shrink-0">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <span className="text-[11px] sm:text-xs text-foreground font-medium truncate">
          Você está no <span className="font-bold text-primary">modo Demo</span> — explore à vontade!
        </span>
      </div>
      <Link
        to="/subscription"
        className="inline-flex items-center gap-1 rounded-lg btn-gradient px-2.5 py-1 text-[10px] sm:text-[11px] font-bold shrink-0 shadow-sm shadow-primary/20"
      >
        Upgrade <ArrowRight className="h-2.5 w-2.5" />
      </Link>
    </div>
  );
}
