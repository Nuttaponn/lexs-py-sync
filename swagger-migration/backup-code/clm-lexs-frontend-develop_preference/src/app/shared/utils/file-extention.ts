/**
 * Get file extension
 * @param filename
 * @returns
 */
export function getFileExtension(filename: string): string {
  if (filename === '') return '';

  const extension = filename.split('.').pop();

  if (extension === undefined) return '';
  return extension;
}
