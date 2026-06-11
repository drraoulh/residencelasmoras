export function countNights(dateArrivee: string, dateDepart: string) {
  const start = new Date(`${dateArrivee}T00:00:00`);
  const end = new Date(`${dateDepart}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / 86_400_000));
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return startA < endB && startB < endA;
}
