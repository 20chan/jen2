import parse from 'parse-color'

export function lerpClamped(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

export function inverseLerp(a: number, b: number, value: number): number {
  return (value - a) / (b - a);
}

export function clamp(min: number, max: number, value: number): number {
  return Math.min(Math.max(min, value), max);
}

export function clamp01(value: number): number {
  return clamp(0, 1, value);
}

export function lerpColor(a: string, b: string, t: number): string {
  const aColor = parse(a);
  const bColor = parse(b);

  const r = Math.round(lerpClamped(aColor.rgb[0], bColor.rgb[0], t));
  const g = Math.round(lerpClamped(aColor.rgb[1], bColor.rgb[1], t));
  const b_ = Math.round(lerpClamped(aColor.rgb[2], bColor.rgb[2], t));

  return `#${r.toString(16)}${g.toString(16)}${b_.toString(16)}`;
}

export function lerpAmount(min: number, max: number, amount: number): string {
  if (amount < 0) {
    return lerpColor('#dcdfe4', '#e06c75', clamp(0.3, 1, amount * amount / min / min));
  } else {
    return lerpColor('#dcdfe4', '#98c379', clamp(0.3, 1, amount * amount / max / max));
  }
}