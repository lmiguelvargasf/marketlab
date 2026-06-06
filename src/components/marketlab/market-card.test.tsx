import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketCard } from "@/components/marketlab/market-card";

const market = {
  id: "market-1",
  title: "Will it rain in Quito?",
  description: "A fictional weather market for the workshop.",
  status: "open" as const,
  close_date: "2026-12-31T18:30:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("MarketCard", () => {
  it("renders title, status, close date, and detail link", () => {
    const html = renderToStaticMarkup(<MarketCard market={market} />);

    expect(html).toContain("Will it rain in Quito?");
    expect(html).toContain("Open");
    expect(html).toContain("2026");
    expect(html).toContain('href="/markets/market-1"');
    expect(html).not.toContain("quito.png");
  });
});
