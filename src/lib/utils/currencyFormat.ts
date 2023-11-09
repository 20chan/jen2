const UNITS = [
  '',
  '만',
  '억',
]

export function formatCurrency(value: number): string {
  let x = Math.abs(value);

  const units = [...UNITS];
  const result = [];
  while (x > 0) {
    const unit = units.shift();
    if (unit === undefined) {
      break;
    }

    const r = x % 10000;
    x = Math.floor(x / 10000);
    result.unshift(`${r}${unit}`);
  }

  const sign = value < 0 ? '-' : '';
  return sign + result.join(' ');
}

export function formatSimpleCurrency(value: number): string {
  if (value < 1000) {
    return `${value}`;
  } else if (value < 1000 * 1000) {
    return `${Math.floor(value / 1000)}K`;
  } else {
    return `${Math.floor(value / (1000 * 1000))}M`;
  }
}