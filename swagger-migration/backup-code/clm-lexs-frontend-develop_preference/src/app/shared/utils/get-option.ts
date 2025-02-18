import { SimpleSelectOption } from '@spig/core';

/**
 * Get option from option list
 */
export function getOption(key: string, options: SimpleSelectOption[]): SimpleSelectOption | null {
  if (!key) return null;
  if (!options || !options.length) return null;

  const option = options.find(it => it.value === key);
  if (!option) return null;
  return option;
}
