const RECENT_SEARCHES_KEY = "magician:recentSearches";
const MAX_RECENT_SEARCHES = 6;

function readRecentSearches() {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => typeof item === "string" && item.trim())
      .slice(0, MAX_RECENT_SEARCHES);
  } catch (error) {
    console.error("Could not read recent searches", error);
    return [];
  }
}

function writeRecentSearches(searches) {
  try {
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)),
    );
  } catch (error) {
    console.error("Could not save recent searches", error);
  }
}

export function getRecentSearches() {
  return readRecentSearches();
}

export function addRecentSearch(term) {
  const value = String(term ?? "").trim();
  const current = readRecentSearches();

  if (!value) return current;

  const next = [
    value,
    ...current.filter(
      (item) => item.toLowerCase() !== value.toLowerCase(),
    ),
  ].slice(0, MAX_RECENT_SEARCHES);

  writeRecentSearches(next);
  return next;
}

export function removeRecentSearch(term) {
  const next = readRecentSearches().filter((item) => item !== term);
  writeRecentSearches(next);
  return next;
}

export function clearRecentSearches() {
  writeRecentSearches([]);
  return [];
}
