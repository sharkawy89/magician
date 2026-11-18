/**
 * Whether a nav link should be marked current for the given pathname.
 *
 * The root link only matches exactly; every other link also matches its
 * descendants, so /blog stays active while reading /blog/:slug.
 */
export function isActivePath(pathname, to) {
  if (!pathname || !to) return false;
  if (to === "/") return pathname === "/";

  return pathname === to || pathname.startsWith(`${to}/`);
}
