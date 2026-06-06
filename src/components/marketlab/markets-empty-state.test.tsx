import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";

describe("MarketsEmptyState", () => {
  it("renders the empty market copy", () => {
    const html = renderToStaticMarkup(<MarketsEmptyState />);

    expect(html).toContain("No markets yet");
    expect(html).toContain("Browse fictional Yes/No markets using fake money");
  });
});
