import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  MarketBuySignedOutCard,
  MarketBuyUnavailableCard,
} from "@/components/marketlab/market-buy-section-cards";

describe("MarketBuySection cards", () => {
  it("shows sign-in message for signed-out users", () => {
    const html = renderToStaticMarkup(<MarketBuySignedOutCard />);

    expect(html).toContain('data-testid="market-buy-signed-out"');
    expect(html).toContain("Sign in to buy");
    expect(html).toContain('href="/sign-in"');
  });

  it("shows unavailable message for non-buyable markets", () => {
    const html = renderToStaticMarkup(<MarketBuyUnavailableCard />);

    expect(html).toContain('data-testid="market-buy-unavailable"');
    expect(html).toContain("Buying is unavailable");
    expect(html).toContain("disabled");
  });
});
