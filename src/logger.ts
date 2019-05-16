/**
 * Wrapper around `console.log` with an indication prefix.
 */
export function log(...params: any[]) {
  // tslint:disable-next-line:no-console
  console.log('📦', ...params);
}
