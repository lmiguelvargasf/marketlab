import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import {
  MarketBuySignedOutCard,
  MarketBuyUnavailableCard,
} from "@/components/marketlab/market-buy-section-cards";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth/session";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";
import { getUserPositionForMarket } from "@/lib/positions/queries";
import { getCurrentProfile } from "@/lib/profile/queries";

type MarketBuySectionProps = {
  market: Market;
};

export async function MarketBuySection({ market }: MarketBuySectionProps) {
  const user = await getAuthUser();
  const buyable = isMarketBuyable(market);

  if (!user) {
    return <MarketBuySignedOutCard />;
  }

  if (!buyable) {
    return <MarketBuyUnavailableCard />;
  }

  const [profile, position] = await Promise.all([
    getCurrentProfile(),
    getUserPositionForMarket(market.id),
  ]);

  if (!profile) {
    return (
      <Card data-testid="market-buy-profile-missing">
        <CardHeader>
          <CardTitle className="text-lg">Buy shares</CardTitle>
          <CardDescription>
            Your fake-money balance is unavailable right now. Try again in a
            moment.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <MarketBuyForm
      marketId={market.id}
      marketTitle={market.title}
      balanceCents={profile.balance_cents}
      yesSharesCents={position?.yes_shares_cents ?? 0}
      noSharesCents={position?.no_shares_cents ?? 0}
    />
  );
}
