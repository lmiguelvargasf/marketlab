import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import { PositionsList } from "@/components/marketlab/positions-list";
import type { UserPosition } from "@/lib/positions/types";

const basePosition: UserPosition = {
  market_id: "11111111-1111-1111-1111-111111111111",
  yes_shares_cents: 500,
  no_shares_cents: 0,
  market: {
    id: "11111111-1111-1111-1111-111111111111",
    title: "Will it rain?",
    status: "open",
    close_date: "2099-12-31T00:00:00.000Z",
  },
};

describe("PositionsList", () => {
  it("renders an empty state when there are no positions", () => {
    const html = renderToStaticMarkup(<PositionsList positions={[]} />);

    expect(html).toContain('data-testid="positions-empty-state"');
    expect(html).toContain("No positions yet");
  });

  it("renders Yes shares and links to the market detail page", () => {
    const html = renderToStaticMarkup(
      <PositionsList positions={[basePosition]} />,
    );

    expect(html).toContain("Will it rain?");
    expect(html).toContain(
      'data-testid="position-yes-11111111-1111-1111-1111-111111111111"',
    );
    expect(html).toContain("$5.00 fake");
    expect(html).toContain(
      'href="/markets/11111111-1111-1111-1111-111111111111"',
    );
  });

  it("renders No shares and total shares", () => {
    const position: UserPosition = {
      ...basePosition,
      yes_shares_cents: 200,
      no_shares_cents: 300,
    };

    const html = renderToStaticMarkup(<PositionsList positions={[position]} />);

    expect(html).toContain(
      'data-testid="position-no-11111111-1111-1111-1111-111111111111"',
    );
    expect(html).toContain(
      'data-testid="position-total-11111111-1111-1111-1111-111111111111"',
    );
    expect(html).toContain("$3.00 fake");
    expect(html).toContain("$5.00 fake");
  });
});

describe("PositionsEmptyState", () => {
  it("mentions fake money", () => {
    const html = renderToStaticMarkup(<PositionsEmptyState />);

    expect(html).toContain("fake money");
  });
});
