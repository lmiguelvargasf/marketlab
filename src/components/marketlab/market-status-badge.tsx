import { Badge } from "@/components/ui/badge";
import { formatMarketStatus } from "@/lib/markets/format";
import type { MarketStatus } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<MarketStatus, string> = {
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  closed:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  resolved: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

export function MarketStatusBadge({ status }: { status: MarketStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusStyles[status])}
      data-testid="market-status"
    >
      {formatMarketStatus(status)}
    </Badge>
  );
}
