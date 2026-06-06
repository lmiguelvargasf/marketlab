import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCloseDate, formatYesChance } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

export function MarketDetailInfo({
  market,
  yesChance,
}: {
  market: Market;
  yesChance: number;
}) {
  const noChance = 100 - yesChance;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-2xl">{market.title}</CardTitle>
            <MarketStatusBadge status={market.status} />
          </div>
          <CardDescription className="text-base leading-relaxed">
            {market.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Closes{" "}
            <time dateTime={market.close_date}>
              {formatCloseDate(market.close_date)}
            </time>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Outcomes</CardTitle>
          <CardDescription>Current market sentiment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <span className="font-medium">Yes</span>
            <span className="text-lg font-semibold" data-testid="yes-outcome">
              {formatYesChance(yesChance)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <span className="font-medium">No</span>
            <span className="text-lg font-semibold" data-testid="no-outcome">
              {formatYesChance(noChance)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
