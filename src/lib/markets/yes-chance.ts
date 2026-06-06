/** Neutral baseline when aggregate position data is unavailable or empty. */
export const NEUTRAL_YES_CHANCE = 50;

export function computeYesChance(yesTotal: number, noTotal: number): number {
  const total = yesTotal + noTotal;
  if (total <= 0) {
    return NEUTRAL_YES_CHANCE;
  }

  return (yesTotal / total) * 100;
}
