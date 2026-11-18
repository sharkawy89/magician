import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CategoryContext } from "./categoryContextValue";
import {
  getFallbackCategories,
  normalizeCategories,
} from "../../utils/categories";

const CATEGORY_URL = "https://dummyjson.com/products/categories";

/**
 * Module-level cache + in-flight promise. Every provider instance (including
 * the one StrictMode mounts twice in dev) shares a single request. We do NOT
 * abort the shared request: an abort would break every other caller awaiting
 * the same promise, which is exactly the double-request bug this replaces.
 */
let inFlight = null;
let snapshot = null;

function apiResult(data) {
  const categories = normalizeCategories(data);

  // A valid but empty API response is a real "empty" state, not a failure.
  // It must not be silently swapped for the mock list.
  if (categories.length === 0) {
    return { categories: [], status: "empty", source: "api" };
  }

  return { categories, status: "ready", source: "api" };
}

function fallbackResult() {
  return {
    categories: getFallbackCategories(),
    status: "fallback",
    source: "mock",
  };
}

function loadCategories() {
  if (snapshot) return Promise.resolve(snapshot);
  if (inFlight) return inFlight;

  // If the browser already knows it is offline, skip the doomed request so
  // there is no noisy network error and the saved list appears immediately.
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    snapshot = fallbackResult();
    return Promise.resolve(snapshot);
  }

  inFlight = fetch(CATEGORY_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      snapshot = apiResult(data);
      return snapshot;
    })
    .catch(() => {
      // Fail quietly: offline / blocked / malformed responses degrade to the
      // local mock list instead of logging an error and leaving empty UI.
      snapshot = fallbackResult();
      return snapshot;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

function resetCategories() {
  snapshot = null;
  inFlight = null;
}

function currentOnline() {
  return typeof navigator === "undefined" || navigator.onLine !== false;
}

/**
 * One shared fetch for every category consumer (header search scope, category
 * row, mega menu and the mobile category drawer). The endpoint is the same one
 * the old BtmHeader used, so this removes duplicate requests without adding a
 * new data source.
 */
export default function CategoryProvider({ children }) {
  const [result, setResult] = useState(() =>
    snapshot ?? { categories: [], status: "loading", source: null },
  );
  const [isOffline, setIsOffline] = useState(() => !currentOnline());
  const [attempt, setAttempt] = useState(0);
  const wasOffline = useRef(isOffline);

  useEffect(() => {
    let active = true;

    loadCategories().then((next) => {
      if (active) setResult(next);
    });

    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(() => {
    const update = () => setIsOffline(!currentOnline());

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  // Recover automatically once connectivity returns after a fallback.
  useEffect(() => {
    if (wasOffline.current && !isOffline && result.source === "mock") {
      resetCategories();
      setAttempt((value) => value + 1);
    }

    wasOffline.current = isOffline;
  }, [isOffline, result.source]);

  const retry = useCallback(() => {
    resetCategories();
    setResult((current) => ({ ...current, status: "loading" }));
    setAttempt((value) => value + 1);
  }, []);

  const value = useMemo(
    () => ({
      categories: result.categories,
      status: result.status,
      source: result.source,
      isOffline,
      retry,
    }),
    [result, isOffline, retry],
  );

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  );
}
