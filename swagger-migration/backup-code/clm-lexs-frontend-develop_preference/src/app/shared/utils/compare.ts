/**
 * Compare for sorting array
 * @param a previous row
 * @param b current row
 * @param isAsc
 * @returns
 */
export function compare(a: number | string, b: number | string, isAsc: boolean) {
  const _a: string = typeof a === 'number' ? a.toString() : a;
  const _b: string = typeof b === 'number' ? b.toString() : b;
  return isAsc ? _a.localeCompare(_b, 'en', { numeric: true }) : _b.localeCompare(_a, 'en', { numeric: true });
}
