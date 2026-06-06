import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trades/actions", () => ({
  buySharesAction: vi.fn(),
}));

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";

describe("MarketBuyForm", () => {
  it("renders balance, position, and buy controls", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="11111111-1111-1111-1111-111111111111"
        marketTitle="Will it rain?"
        balanceCents={10000}
        yesSharesCents={500}
        noSharesCents={0}
      />,
    );

    expect(html).toContain('data-testid="market-buy-form"');
    expect(html).toContain("$100.00 fake");
    expect(html).toContain("$5.00 fake");
    expect(html).toContain("Fake dollars to spend");
    expect(html).toContain('data-testid="buy-side-yes"');
    expect(html).toContain('data-testid="buy-side-no"');
    expect(html).toContain('data-testid="buy-submit"');
  });
});
