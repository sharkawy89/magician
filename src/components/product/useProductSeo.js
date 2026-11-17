import { useEffect } from "react";
import {
  getGalleryImages,
  getReviewsSummary,
  getStockInfo,
  truncateText,
} from "../../utils/productDetails";

function buildProductJsonLd(product, summary) {
  const stock = getStockInfo(product);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: getGalleryImages(product),
    sku: product.sku || undefined,
    category: product.category || undefined,
    brand: {
      "@type": "Brand",
      name: product.brand || "Unbranded",
    },
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "USD",
      price: Number(product.price) || 0,
      availability:
        stock.state === "out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (summary.count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(summary.average.toFixed(2)),
      reviewCount: summary.count,
    };
  }

  return schema;
}

/**
 * Per-product title, meta description and JSON-LD. Everything is restored on
 * unmount so the next route starts from the storefront defaults.
 */
export function useProductSeo(product) {
  useEffect(() => {
    if (!product) return undefined;

    const previousTitle = document.title;
    document.title = `${product.title} | MAGICIAN`;

    const existingMeta = document.querySelector('meta[name="description"]');
    const hadMeta = Boolean(existingMeta);
    const previousDescription = existingMeta?.getAttribute("content");
    const meta = existingMeta || document.createElement("meta");

    if (!hadMeta) {
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      "content",
      truncateText(product.description) ||
        `Shop ${product.title} at MAGICIAN.`,
    );

    const summary = getReviewsSummary(product.reviews);
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-product-json-ld", "true");
    script.textContent = JSON.stringify(buildProductJsonLd(product, summary));
    document.head.appendChild(script);

    return () => {
      document.title = previousTitle;

      if (hadMeta) {
        if (previousDescription === null) meta.removeAttribute("content");
        else meta.setAttribute("content", previousDescription);
      } else {
        meta.remove();
      }

      script.remove();
    };
  }, [product]);
}
