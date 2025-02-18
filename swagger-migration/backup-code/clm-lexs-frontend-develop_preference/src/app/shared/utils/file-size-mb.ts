/**
 * Get file size from total bytes to MB
 * @param totalBytes
 * @returns
 */
export function getFileSizeMB(totalBytes: number): number {
  if (totalBytes === 0) return 0;
  if (totalBytes === null || totalBytes === undefined) return 0;
  return totalBytes / (1024 * 1024);
}
