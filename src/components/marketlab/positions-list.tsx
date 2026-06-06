import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFakeShares } from "@/lib/fake-money";
import { formatCloseDate } from "@/lib/markets/format";
import type { UserPosition } from "@/lib/positions/types";

type PositionsListProps = {
  positions: UserPosition[];
};

export function PositionsList({ positions }: PositionsListProps) {
  if (positions.length === 0) {
    return <PositionsEmptyState />;
  }

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      data-testid="positions-list"
    >
      {positions.map((position) => {
        const totalSharesCents =
          position.yes_shares_cents + position.no_shares_cents;

        return (
          <Card
            key={position.market_id}
            className="flex h-full flex-col"
            data-testid={`position-card-${position.market_id}`}
          >
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg leading-snug">
                  <Link
                    href={`/markets/${position.market.id}`}
                    className="hover:underline"
                    data-testid={`position-market-link-${position.market_id}`}
                  >
                    {position.market.title}
                  </Link>
                </CardTitle>
                <MarketStatusBadge status={position.market.status} />
              </div>
              <CardDescription className="text-sm">
                Closes{" "}
                <time dateTime={position.market.close_date}>
                  {formatCloseDate(position.market.close_date)}
                </time>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-muted-foreground">Yes shares</span>
                <span
                  className="font-medium"
                  data-testid={`position-yes-${position.market_id}`}
                >
                  {formatFakeShares(position.yes_shares_cents)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-muted-foreground">No shares</span>
                <span
                  className="font-medium"
                  data-testid={`position-no-${position.market_id}`}
                >
                  {formatFakeShares(position.no_shares_cents)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                <span className="font-medium">Total shares</span>
                <span
                  className="font-semibold"
                  data-testid={`position-total-${position.market_id}`}
                >
                  {formatFakeShares(totalSharesCents)}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/markets/${position.market.id}`}>View market</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
