/**
 * Small class-name joiner. Falsy values are skipped so conditional classes
 * can be written inline without extra dependencies.
 */
export function cn(...values) {
  return values.flat(Infinity).filter(Boolean).join(" ");
}
