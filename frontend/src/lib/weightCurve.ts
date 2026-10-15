export interface WeightRecord {
  id: number;
  weight: number;
  recordedAt: string;
}
export function weightCurve(entries: WeightRecord[], width: number, height: number) {
  const pad = 20;
  const weights = entries.map(e => e.weight);
  const low = Math.min(...weights) - 0.8;
  const high = Math.max(...weights) + 0.8;
  const firstTime = new Date(entries[0].recordedAt).getTime();
  const span = new Date(entries[entries.length - 1].recordedAt).getTime() - firstTime;
  const points = entries.map((entry, i) => ({
    x: entries.length === 1 ? width / 2 : pad + (width - 2 * pad) *
      (span > 0 ? (new Date(entry.recordedAt).getTime() - firstTime) / span : i / (entries.length - 1)),
    y: pad + (height - 2 * pad) * (high - entry.weight) / (high - low),
  }));
  let path = `M ${points[0].x} ${points[0].y}`;
  const samples = [{ ...points[0], distance: 0 }];
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const c1 = { x: a.x + (b.x - a.x) / 3, y: a.y };
    const c2 = { x: b.x - (b.x - a.x) / 3, y: b.y };
    path += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;
    for (let j = 1; j <= 40; j++) {
      const t = j / 40, u = 1 - t;
      const point = {
        x: u ** 3 * a.x + 3 * u ** 2 * t * c1.x + 3 * u * t ** 2 * c2.x + t ** 3 * b.x,
        y: u ** 3 * a.y + 3 * u ** 2 * t * c1.y + 3 * u * t ** 2 * c2.y + t ** 3 * b.y,
      };
      const previous = samples[samples.length - 1];
      length += Math.hypot(point.x - previous.x, point.y - previous.y);
      samples.push({ ...point, distance: length });
    }
  }
  return { points, path, samples, length };
}
export function pointOnCurve(curve: ReturnType<typeof weightCurve>, progress: number) {
  const distance = Math.max(0, Math.min(1, progress)) * curve.length;
  const index = curve.samples.findIndex(p => p.distance >= distance);
  if (index <= 0) return curve.samples[index === 0 ? 0 : curve.samples.length - 1];
  const a = curve.samples[index - 1], b = curve.samples[index];
  const t = b.distance === a.distance ? 1 : (distance - a.distance) / (b.distance - a.distance);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
