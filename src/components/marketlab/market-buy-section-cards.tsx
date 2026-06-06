import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MarketBuySignedOutCard() {
  return (
    <Card data-testid="market-buy-signed-out">
      <CardHeader>
        <CardTitle className="text-lg">Buy shares</CardTitle>
        <CardDescription>
          Sign in to buy Yes or No shares with fake money in this workshop app.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-3 border-t-0 bg-transparent">
        <Button variant="outline" size="sm" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MarketBuyUnavailableCard() {
  return (
    <Card data-testid="market-buy-unavailable">
      <CardHeader>
        <CardTitle className="text-lg">Buy shares</CardTitle>
        <CardDescription>
          Buying is unavailable for this market. Only open markets before their
          close date accept fake-money purchases.
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
