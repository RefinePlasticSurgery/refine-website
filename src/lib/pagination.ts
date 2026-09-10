/**
 * Returns the page numbers (and ellipsis markers) to render for a windowed
 * pagination control.
 *
 * Example output for current=8, total=20, delta=2:
 *   [1, '...', 6, 7, 8, 9, 10, '...', 20]
 */
export function getPageWindow(
  current: number,
  total: number,
  delta = 2
): (number | '...')[] {
  if (total <= 1) return [1];

  const range: number[] = [];
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  const result: (number | '...')[] = [1];

  if (range[0] > 2) result.push('...');
  result.push(...range);
  if (range[range.length - 1] < total - 1) result.push('...');
  if (total > 1) result.push(total);

  return result;
}
