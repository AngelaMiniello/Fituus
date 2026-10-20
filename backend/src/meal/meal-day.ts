export function mealDay(date: Date, offset: number) {
  const local = new Date(date.getTime() - offset * 60000);
  const start = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) + offset * 60000);
  return { start, end: new Date(start.getTime() + 86400000) };
}
