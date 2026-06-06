import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PositionsSignedOutCard } from "@/components/marketlab/positions-page-cards";

describe("PositionsSignedOutCard", () => {
  it("shows a sign-in message without position data", () => {
    const html = renderToStaticMarkup(<PositionsSignedOutCard />);

    expect(html).toContain('data-testid="positions-signed-out"');
    expect(html).toContain("Sign in to view your positions");
    expect(html).toContain('href="/sign-in"');
    expect(html).not.toContain("position-card");
  });
});
