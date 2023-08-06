export function ensureNever(value: never) {
  throw new Error(`Expected value ${value} to be never`);
}
