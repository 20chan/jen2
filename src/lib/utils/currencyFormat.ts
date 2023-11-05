const UNITS = [
  '',
  '만',
  '억',
]

export function formatCurrency(value: number): string {
  let x = value;

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

  return result.join(' ');
}