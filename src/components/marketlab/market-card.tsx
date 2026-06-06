import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCloseDate } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

export function MarketCard({ market }: { market: Market }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-snug">{market.title}</CardTitle>
          <MarketStatusBadge status={market.status} />
        </div>
        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {market.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-sm text-muted-foreground">
          Closes{" "}
          <time dateTime={market.close_date}>
            {formatCloseDate(market.close_date)}
          </time>
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/markets/${market.id}`}>View market</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
