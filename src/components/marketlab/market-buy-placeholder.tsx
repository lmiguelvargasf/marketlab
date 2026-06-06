import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";

export function MarketBuyPlaceholder({ market }: { market: Market }) {
  const buyable = isMarketBuyable(market);

  return (
    <Card data-testid="market-buy-placeholder">
      <CardHeader>
        <CardTitle className="text-lg">Trade</CardTitle>
        <CardDescription>
          {buyable
            ? "Buying and selling will be available in a later workshop step."
            : "Buying is unavailable for this market."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button disabled variant="default">
          Buy Yes
        </Button>
        <Button disabled variant="outline">
          Buy No
        </Button>
      </CardContent>
    </Card>
  );
}
