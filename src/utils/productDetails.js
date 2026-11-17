import { formatCategoryName } from "./categories";

const BUSINESS_DAY_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const REVIEW_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/**
 * Gallery images come from DummyJSON `images`, with `thumbnail` as the
 * fallback. Duplicates and empty entries are removed so the counter and
 * thumbnails always agree.
 */
export function getGalleryImages(product) {
  const images = Array.isArray(product?.images)
    ? product.images.filter((image) => typeof image === "string" && image)
    : [];
  const fallback =
    typeof product?.thumbnail === "string" && product.thumbnail
      ? [product.thumbnail]
      : [];

  return [...new Set(images.length > 0 ? images : fallback)];
}

/**
 * Stock presentation is derived from the numeric `stock` value, with
 * `availabilityStatus` as the API-provided fallback.
 */
export function getStockInfo(product) {
  const stockValue = Number(product?.stock);
  const stock = Number.isFinite(stockValue) ? stockValue : null;
  const availability = product?.availabilityStatus;

  const outOfStock = availability === "Out of Stock" || (stock !== null && stock <= 0);
  const lowStock =
    !outOfStock &&
    (availability === "Low Stock" || (stock !== null && stock < 10));

  if (outOfStock) {
    return {
      state: "out",
      label: "Out of stock",
      detail: "This product is currently unavailable.",
      stock,
      maxQuantity: 1,
    };
  }

  if (lowStock) {
    return {
      state: "low",
      label: "Low stock",
      detail:
        stock !== null
          ? `Only ${stock} left — order soon.`
          : "Only a few left — order soon.",
      stock,
      maxQuantity: stock !== null && stock > 0 ? stock : 1,
    };
  }

  return {
    state: "in",
    label: "In stock",
    detail: stock !== null ? `${stock} available` : "Ready to ship",
    stock,
    maxQuantity: stock !== null && stock > 0 ? Math.min(stock, 99) : 99,
  };
}

/**
 * UI-only delivery estimate: three to five business days from today.
 * There is no shipping-rate API behind this and no postal-code lookup — the
 * storefront deliberately avoids pretending to calculate a real quote.
 */
export function getDeliveryEstimate(from = new Date(), minDays = 3, maxDays = 5) {
  const addBusinessDays = (date, days) => {
    const next = new Date(date);
    let added = 0;

    while (added < days) {
      next.setDate(next.getDate() + 1);
      const weekday = next.getDay();
      if (weekday !== 0 && weekday !== 6) added += 1;
    }

    return next;
  };

  const earliest = addBusinessDays(from, minDays);
  const latest = addBusinessDays(from, maxDays);

  return `Get it by ${BUSINESS_DAY_FORMAT.format(
    earliest,
  )} – ${BUSINESS_DAY_FORMAT.format(latest)}`;
}

/**
 * PLACEHOLDER fallbacks for fields DummyJSON occasionally omits. They are
 * intentionally generic store copy, not claims about a specific product.
 */
const POLICY_FALLBACKS = {
  shipping: "Ships in 3–5 business days.",
  returns: "30-day returns on unopened items.",
  warranty: "12-month manufacturer warranty.",
};

export function getPolicyRows(product) {
  return [
    {
      id: "shipping",
      label: "Shipping",
      value: product?.shippingInformation || POLICY_FALLBACKS.shipping,
      fallback: !product?.shippingInformation,
    },
    {
      id: "returns",
      label: "Returns",
      value: product?.returnPolicy || POLICY_FALLBACKS.returns,
      fallback: !product?.returnPolicy,
    },
    {
      id: "warranty",
      label: "Warranty",
      value: product?.warrantyInformation || POLICY_FALLBACKS.warranty,
      fallback: !product?.warrantyInformation,
    },
  ];
}

function present(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;

  return true;
}

export function getSpecRows(product) {
  if (!product) return [];

  const rows = [];
  const add = (label, value) => {
    if (present(value)) rows.push({ label, value: String(value) });
  };

  add("Brand", product.brand);
  add("Category", product.category ? formatCategoryName(product.category) : "");
  add("SKU", product.sku);

  if (present(product.weight)) {
    add("Weight", `${product.weight} (as listed)`);
  }

  const dimensions = product.dimensions;
  if (
    dimensions &&
    ["width", "height", "depth"].every((key) =>
      Number.isFinite(Number(dimensions[key])),
    )
  ) {
    add(
      "Dimensions (W × H × D)",
      `${dimensions.width} × ${dimensions.height} × ${dimensions.depth}`,
    );
  }

  add("Minimum order", product.minimumOrderQuantity
    ? `${product.minimumOrderQuantity} units`
    : "");
  add("Warranty", product.warrantyInformation);
  add("Shipping", product.shippingInformation);
  add("Returns", product.returnPolicy);
  add("Tags", Array.isArray(product.tags) ? product.tags.join(", ") : "");

  return rows;
}

export function getReviewsSummary(reviews) {
  const list = Array.isArray(reviews) ? reviews : [];
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;

  for (const review of list) {
    const rating = Math.round(Number(review?.rating));

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) continue;

    distribution[rating] += 1;
    total += rating;
  }

  const count = Object.values(distribution).reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    count,
    average: count > 0 ? total / count : 0,
    distribution,
  };
}

export function sortReviews(reviews, sort) {
  const list = Array.isArray(reviews) ? [...reviews] : [];

  switch (sort) {
    case "highest":
      return list.sort(
        (a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0),
      );
    case "lowest":
      return list.sort(
        (a, b) => (Number(a?.rating) || 0) - (Number(b?.rating) || 0),
      );
    case "newest":
    default:
      return list.sort(
        (a, b) => new Date(b?.date).getTime() - new Date(a?.date).getTime(),
      );
  }
}

export function formatReviewDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : REVIEW_DATE_FORMAT.format(date);
}

export function truncateText(value, maxLength = 155) {
  if (typeof value !== "string") return "";

  const normalized = value.replace(/\s+/g, " ").trim();

  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 1).trimEnd()}…`
    : normalized;
}
