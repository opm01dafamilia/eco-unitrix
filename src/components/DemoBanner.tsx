import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function DemoBanner() {
  return (
    <div className="w-full border-b shrink-0 px-3 py-2.5 flex items-center justify-between gap-2"
      style={{
        background: "linear-gradient(90deg, hsl(255 80% 65% / 0.08), hsl(215 75% 58% / 0.06), hsl(255 80% 65% / 0.08))",
        borderColor: "hsl(255 80% 65% / 0.1)",
      }}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="rounded-md btn-gradient p-1 shrink-0 shadow-sm shadow-primary/10">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <span className="text-[11px] sm:text-xs text-foreground/80 font-medium truncate">
          Você está no <span className="font-bold text-primary">modo Demo</span> — explore à vontade!
        </span>
      </div>
      <Link
        to="/subscription"
        className="inline-flex items-center gap-1 rounded-lg btn-gradient px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold shrink-0 shadow-md shadow-primary/15 min-h-[28px]"
      >
        Upgrade <ArrowRight className="h-2.5 w-2.5" />
      </Link>
    </div>
  );
}
