export type TradeSide = "yes" | "no";

export type ParseFakeDollarsResult =
  | { ok: true; cents: number }
  | { ok: false; error: string };

const DOLLAR_INPUT_PATTERN = /^\s*(\d+)(?:\.(\d{1,2}))?\s*$/;

export function parseFakeDollarsToCents(input: string): ParseFakeDollarsResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "Enter an amount in fake dollars." };
  }

  const match = trimmed.match(DOLLAR_INPUT_PATTERN);

  if (!match) {
    return {
      ok: false,
      error: "Enter a valid amount with up to two decimal places.",
    };
  }

  const wholePart = match[1];
  const fractionPart = match[2] ?? "";

  if (fractionPart.length > 2) {
    return {
      ok: false,
      error: "Enter a valid amount with up to two decimal places.",
    };
  }

  const wholeCents = Number.parseInt(wholePart, 10) * 100;
  const fractionCents =
    fractionPart.length === 0
      ? 0
      : Number.parseInt(fractionPart.padEnd(2, "0"), 10);

  const cents = wholeCents + fractionCents;

  if (cents <= 0) {
    return { ok: false, error: "Amount must be greater than zero." };
  }

  return { ok: true, cents };
}

export function formatFakeDollars(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)} fake`;
}

export function formatFakeShares(cents: number): string {
  return formatFakeDollars(cents);
}

export function formatFakeBalance(balanceCents: number): string {
  return formatFakeDollars(balanceCents);
}
