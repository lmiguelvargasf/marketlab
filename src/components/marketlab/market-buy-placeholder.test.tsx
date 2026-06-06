import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketBuyPlaceholder } from "@/components/marketlab/market-buy-placeholder";

describe("MarketBuyPlaceholder", () => {
  it("shows buying unavailable for closed markets", () => {
    const html = renderToStaticMarkup(
      <MarketBuyPlaceholder
        market={{
          id: "market-1",
          title: "Closed market",
          description: "",
          status: "closed",
          close_date: "2026-12-31T00:00:00.000Z",
          created_at: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(html).toContain("Buying is unavailable for this market.");
    expect(html).toContain("disabled");
  });
});
