/**
 * Wrapper around `console.log` with a indication prefix.
 */
export function log(...params: any[]) {
  console.log('📦', ...params);
}
