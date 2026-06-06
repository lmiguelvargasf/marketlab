export function formatFakeBalance(balanceCents: number): string {
  const dollars = balanceCents / 100;
  return `$${dollars.toFixed(2)} fake`;
}
