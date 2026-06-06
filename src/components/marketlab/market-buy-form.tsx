"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatFakeDollars,
  formatFakeShares,
  type TradeSide,
} from "@/lib/fake-money";
import {
  type BuySharesActionState,
  buySharesAction,
} from "@/lib/trades/actions";

const initialState: BuySharesActionState = {};

type MarketBuyFormProps = {
  marketId: string;
  marketTitle: string;
  balanceCents: number;
  yesSharesCents: number;
  noSharesCents: number;
};

export function MarketBuyForm({
  marketId,
  marketTitle,
  balanceCents,
  yesSharesCents,
  noSharesCents,
}: MarketBuyFormProps) {
  const [state, formAction, isPending] = useActionState(
    buySharesAction,
    initialState,
  );
  const [side, setSide] = useState<TradeSide>("yes");

  const displayBalance = state.balanceCents ?? balanceCents;
  const displayYesShares = state.yesSharesCents ?? yesSharesCents;
  const displayNoShares = state.noSharesCents ?? noSharesCents;

  return (
    <Card data-testid="market-buy-form">
      <CardHeader>
        <CardTitle className="text-lg">Buy shares</CardTitle>
        <CardDescription>
          Spend fake money on Yes or No shares in {marketTitle}. This workshop
          app uses play money only.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <input type="hidden" name="market_id" value={marketId} />
          <input type="hidden" name="side" value={side} />

          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
            <p data-testid="buy-available-balance">
              Available fake balance: {formatFakeDollars(displayBalance)}
            </p>
            <p
              className="mt-1 text-muted-foreground"
              data-testid="buy-position"
            >
              Your position: Yes {formatFakeShares(displayYesShares)}, No{" "}
              {formatFakeShares(displayNoShares)}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium" id="buy-side-label">
              Choose a side
            </span>
            <div
              className="flex flex-wrap gap-3"
              role="radiogroup"
              aria-labelledby="buy-side-label"
            >
              <Button
                type="button"
                variant={side === "yes" ? "default" : "outline"}
                aria-pressed={side === "yes"}
                onClick={() => setSide("yes")}
                data-testid="buy-side-yes"
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={side === "no" ? "default" : "outline"}
                aria-pressed={side === "no"}
                onClick={() => setSide("no")}
                data-testid="buy-side-no"
              >
                No
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Fake dollars to spend</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              placeholder="10.00"
              autoComplete="off"
              required
              disabled={isPending}
              data-testid="buy-amount-input"
            />
          </div>

          {isPending ? (
            <p
              className="text-sm text-muted-foreground"
              data-testid="buy-pending"
            >
              Buying…
            </p>
          ) : null}

          {state.error ? (
            <p
              className="text-sm text-destructive"
              role="alert"
              data-testid="buy-error"
            >
              {state.error}
            </p>
          ) : null}

          {state.success ? (
            <p
              className="text-sm text-foreground"
              data-testid="buy-success"
              role="status"
            >
              {state.success}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isPending}
            data-testid="buy-submit"
          >
            {isPending ? "Buying…" : `Buy ${side === "yes" ? "Yes" : "No"}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
