/**
 * Convert string, number, nullable string to safe string
 * @param value
 * @param fallback
 * @returns
 */
export function coerceString(value: string | number | null | undefined, fallback: string = '-'): string {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'number') return '' + value;
  return value;
}
