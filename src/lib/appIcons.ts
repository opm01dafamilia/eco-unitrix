import { Heart, DollarSign, TrendingUp, MessageSquare, CalendarDays, Layers, type LucideIcon } from "lucide-react";

const appIconMap: Record<string, LucideIcon> = {
  fitpulse: Heart,
  financeflow: DollarSign,
  marketflow: TrendingUp,
  whatsapp_auto: MessageSquare,
  ia_agenda: CalendarDays,
  ecosystem: Layers,
};

export function getAppIcon(appKey: string): LucideIcon | null {
  return appIconMap[appKey] ?? null;
}
