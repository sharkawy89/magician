export const LISTING_PAGE_SIZE = 12;

export const LISTING_SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Top rated" },
];

export const RATING_THRESHOLDS = [4, 3, 2];

const SORT_VALUES = new Set(LISTING_SORTS.map((sort) => sort.value));
const VIEW_VALUES = new Set(["grid", "list"]);

// Session-only cache for the full (limit=0) result set used for facets and
// client-side filtering. Keyed by the query/category pair so page, sort and
// view changes reuse it; nothing is persisted.
const FULL_SET_CACHE = new Map();

export function readCachedFullSet(key) {
  return FULL_SET_CACHE.get(key) ?? null;
}

export function writeCachedFullSet(key, products) {
  FULL_SET_CACHE.set(key, products);
}

export function getListingCacheKey(query, category) {
  return `${query ?? ""}\u0000${category ?? ""}`;
}

const SORT_PARAMS = {
  newest: { sortBy: "id", order: "desc" },
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  "rating-desc": { sortBy: "rating", order: "desc" },
};

export const LISTING_FILTER_KEYS = [
  "minPrice",
  "maxPrice",
  "rating",
  "brand",
  "inStock",
];

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getBrandName(product) {
  const brand = typeof product?.brand === "string" ? product.brand.trim() : "";
  return brand || "Unbranded";
}

export function isProductInStock(product) {
  const stock = Number(product?.stock);

  if (Number.isFinite(stock)) return stock > 0;

  return product?.availabilityStatus !== "Out of Stock";
}

export function getPriceBounds(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return { min: 0, max: 0 };
  }

  let min = Infinity;
  let max = -Infinity;

  for (const product of products) {
    const price = Number(product?.price);

    if (!Number.isFinite(price)) continue;

    if (price < min) min = price;
    if (price > max) max = price;
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 0 };
  }

  const floor = Math.floor(min);
  return {
    min: floor,
    max: Math.max(Math.ceil(max), floor + 1),
  };
}

export function getBrandFacets(products) {
  const counts = new Map();

  for (const product of products) {
    const name = getBrandName(product);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort(
      (a, b) =>
        b.count - a.count || a.name.localeCompare(b.name, "en", {
          sensitivity: "base",
        }),
    );
}

export function getRatingFacets(products) {
  const counts = { 4: 0, 3: 0, 2: 0 };

  for (const product of products) {
    const rating = Number(product?.rating);

    if (!Number.isFinite(rating)) continue;

    for (const threshold of RATING_THRESHOLDS) {
      if (rating >= threshold) counts[threshold] += 1;
    }
  }

  return counts;
}

/**
 * Reads the listing query params. Invalid values are ignored, which makes a
 * malformed shared link fall back to the defaults instead of erroring.
 */
export function readListingParams(searchParams) {
  const readNumber = (key) => {
    const raw = searchParams.get(key);
    if (raw === null || raw.trim() === "") return null;

    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? value : null;
  };

  const readRating = () => {
    const value = Number(searchParams.get("rating"));
    return RATING_THRESHOLDS.includes(value) ? value : null;
  };

  const rawBrands = (searchParams.get("brand") ?? "")
    .split(",")
    .map((brand) => brand.trim())
    .filter(Boolean);

  const pageValue = Number(searchParams.get("page"));
  const sort = searchParams.get("sort");
  const view = searchParams.get("view");

  return {
    minPrice: readNumber("minPrice"),
    maxPrice: readNumber("maxPrice"),
    rating: readRating(),
    brands: [...new Set(rawBrands)],
    inStock: searchParams.get("inStock") === "1",
    sort: SORT_VALUES.has(sort) ? sort : "newest",
    view: VIEW_VALUES.has(view) ? view : "grid",
    page:
      Number.isInteger(pageValue) && pageValue >= 1
        ? Math.min(pageValue, 1000)
        : 1,
  };
}

/**
 * Removes listing params that are syntactically invalid or reference a brand
 * that does not exist in the current facet set. Valid params (and q / category
 * / legacy query) are left untouched. Returned params can be compared by
 * toString() to decide whether a replace navigation is needed.
 */
export function stripInvalidListingParams(searchParams, brandNames) {
  const next = new URLSearchParams(searchParams);
  const knownBrands = new Set(brandNames);

  const dropIf = (key, isValid) => {
    if (!next.has(key)) return;
    if (!isValid(next.get(key) ?? "")) next.delete(key);
  };

  const isNonNegativeNumber = (raw) =>
    raw.trim() !== "" &&
    Number.isFinite(Number(raw)) &&
    Number(raw) >= 0;

  const isPositiveInteger = (raw) =>
    /^\d+$/.test(raw.trim()) && Number(raw) >= 1;

  dropIf("minPrice", isNonNegativeNumber);
  dropIf("maxPrice", isNonNegativeNumber);
  dropIf("rating", (raw) => RATING_THRESHOLDS.includes(Number(raw)));
  dropIf("inStock", (raw) => raw === "1");
  dropIf("sort", (raw) => SORT_VALUES.has(raw));
  dropIf("view", (raw) => VIEW_VALUES.has(raw));
  dropIf("page", isPositiveInteger);

  if (next.has("brand")) {
    const brands = [
      ...new Set(
        (next.get("brand") ?? "")
          .split(",")
          .map((brand) => brand.trim())
          .filter((brand) => knownBrands.has(brand)),
      ),
    ];

    if (brands.length === 0) {
      next.delete("brand");
    } else {
      next.set("brand", brands.join(","));
    }
  }

  return next;
}

/**
 * Clamps URL state to the facets of the current result set. Everything is
 * silent: out-of-range prices are clamped, unknown brands are dropped.
 */
export function normalizeFilters(params, bounds, brands) {
  let minPrice = isFiniteNumber(params.minPrice) ? params.minPrice : null;
  let maxPrice = isFiniteNumber(params.maxPrice) ? params.maxPrice : null;

  if (minPrice !== null) {
    minPrice = clamp(minPrice, bounds.min, bounds.max);
    if (minPrice <= bounds.min) minPrice = null;
  }

  if (maxPrice !== null) {
    maxPrice = clamp(maxPrice, bounds.min, bounds.max);
    if (maxPrice >= bounds.max) maxPrice = null;
  }

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    const swap = minPrice;
    minPrice = maxPrice;
    maxPrice = swap;
  }

  const knownBrands = new Set(brands.map((brand) => brand.name));
  const selectedBrands = params.brands.filter((brand) =>
    knownBrands.has(brand),
  );

  return {
    minPrice,
    maxPrice,
    rating: RATING_THRESHOLDS.includes(params.rating) ? params.rating : null,
    brands: selectedBrands,
    inStock: Boolean(params.inStock),
    sort: SORT_VALUES.has(params.sort) ? params.sort : "newest",
    view: VIEW_VALUES.has(params.view) ? params.view : "grid",
    page: Number.isInteger(params.page) && params.page >= 1 ? params.page : 1,
  };
}

export function getActiveFilterCount(filters) {
  const priceActive = filters.minPrice !== null || filters.maxPrice !== null;

  return (
    (priceActive ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    filters.brands.length +
    (filters.inStock ? 1 : 0)
  );
}

export function filterProducts(products, filters) {
  return products.filter((product) => {
    const price = Number(product?.price);

    if (filters.minPrice !== null && price < filters.minPrice) return false;
    if (filters.maxPrice !== null && price > filters.maxPrice) return false;

    if (filters.rating !== null && Number(product?.rating) < filters.rating) {
      return false;
    }

    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(getBrandName(product))
    ) {
      return false;
    }

    if (filters.inStock && !isProductInStock(product)) return false;

    return true;
  });
}

export function sortProducts(products, sort) {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0),
      );
    case "rating-desc":
      return sorted.sort(
        (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
      );
    case "newest":
    default:
      return sorted.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  }
}

export function getSortParams(sort) {
  return SORT_PARAMS[sort] ?? SORT_PARAMS.newest;
}

/**
 * Writes only the non-default listing params, leaving q / category / query and
 * any other unrelated params untouched.
 */
export function writeListingParams(searchParams, filters, bounds) {
  const next = new URLSearchParams(searchParams);

  LISTING_FILTER_KEYS.forEach((key) => next.delete(key));
  next.delete("sort");
  next.delete("view");
  next.delete("page");

  if (filters.minPrice !== null && filters.minPrice > bounds.min) {
    next.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice !== null && filters.maxPrice < bounds.max) {
    next.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.rating) next.set("rating", String(filters.rating));
  if (filters.brands.length > 0) next.set("brand", filters.brands.join(","));
  if (filters.inStock) next.set("inStock", "1");
  if (filters.sort !== "newest") next.set("sort", filters.sort);
  if (filters.view !== "grid") next.set("view", filters.view);
  if (filters.page > 1) next.set("page", String(filters.page));

  return next;
}

export function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "";

  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: number % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
