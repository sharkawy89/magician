import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import PageTransition from "../../components/PageTransition";
import ProductDetailsLoading from "./ProductDetailsLoading";
import ProductGallery from "../../components/product/ProductGallery";
import ProductBuyBox from "../../components/product/ProductBuyBox";
import ProductTabs from "../../components/product/ProductTabs";
import FrequentlyBought, {
  BundleSkeleton,
} from "../../components/product/FrequentlyBought";
import StickyBuyBar from "../../components/product/StickyBuyBar";
import LazyMount from "../../components/product/LazyMount";
import ProductRail, { RailSkeleton } from "../../components/home/ProductRail";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { formatCategoryName } from "../../utils/categories";
import { useProductSeo } from "../../components/product/useProductSeo";

const API_ROOT = "https://dummyjson.com/products";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [buyBoxVisible, setBuyBoxVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const buyBoxRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    setProduct(null);
    setError("");
    setNotFound(false);
    setLoading(true);
    setLightboxOpen(false);
    setBuyBoxVisible(false);
    setFooterVisible(false);

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${API_ROOT}/${encodeURIComponent(id ?? "")}`,
          { signal: controller.signal },
        );

        if (res.status === 404) {
          if (!ignore) setNotFound(true);
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load product (${res.status})`);
        }

        const data = await res.json();

        if (!data || data.id === undefined || data.id === null) {
          throw new Error("Unexpected product response.");
        }

        if (!ignore) setProduct(data);
      } catch (fetchError) {
        if (!ignore && fetchError.name !== "AbortError") {
          console.error("Error fetching product", fetchError);
          setError("We couldn't load this product. Please try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id, reloadKey]);

  useProductSeo(product);

  // Hide the mobile bar as soon as any part of the real buy box is on screen.
  useEffect(() => {
    const target = buyBoxRef.current;

    if (!product || !target || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setBuyBoxVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [product]);

  // Hide the bar before the footer can slide underneath it. Observing the
  // footer (rather than a 1px sentinel) survives jumps to the page bottom,
  // where a thin sentinel can skip the viewport entirely.
  useEffect(() => {
    if (!product) return undefined;

    const footer = document.querySelector("footer");

    if (!footer || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px 120px 0px", threshold: 0 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [product]);

  const showStickyBar =
    Boolean(product) && !buyBoxVisible && !footerVisible && !lightboxOpen;

  useEffect(() => {
    if (!showStickyBar) return undefined;

    document.body.classList.add("product-sticky-bar-visible");

    return () => {
      document.body.classList.remove("product-sticky-bar-visible");
    };
  }, [showStickyBar]);

  const similarRail = useMemo(() => {
    if (!product?.category) return null;

    return {
      id: "similar-products",
      title: "Similar products",
      subtitle: `More from ${formatCategoryName(product.category)}`,
      endpoint: `${API_ROOT}/category/${encodeURIComponent(
        product.category,
      )}?limit=0`,
    };
  }, [product?.category]);

  return (
    <PageTransition key={id}>
      <div className="pb-24 md:pb-16">
        {loading ? (
          <ProductDetailsLoading />
        ) : notFound ? (
          <div className="mx-auto w-[90%] max-w-337.5 py-12">
            <EmptyState
              icon={<FaSearch />}
              title="Product not found"
              description="This product may have been removed, or the link may be incorrect."
              action={
                <Button as={Link} to="/" variant="primary">
                  Back to shop
                </Button>
              }
            />
          </div>
        ) : error || !product ? (
          <div className="mx-auto w-[90%] max-w-337.5 py-12">
            <ErrorState
              title="Product unavailable"
              description={
                error || "We couldn't load this product. Please try again."
              }
              action={
                <Button
                  variant="primary"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
                  Try again
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="mx-auto w-[90%] max-w-337.5 pt-5 sm:pt-7">
              <nav aria-label="Breadcrumb" className="mb-5 min-w-0">
                <ol className="flex list-none flex-wrap items-center gap-2 text-sm text-ink-secondary">
                  <li>
                    <Link
                      to="/"
                      className="text-info underline-offset-2 hover:underline"
                    >
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  {product.category ? (
                    <>
                      <li>
                        <Link
                          to={`/category/${product.category}`}
                          className="text-info underline-offset-2 hover:underline"
                        >
                          {formatCategoryName(product.category)}
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                    </>
                  ) : null}
                  <li aria-current="page" className="min-w-0 truncate text-ink">
                    {product.title}
                  </li>
                </ol>
              </nav>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <ProductGallery
                  product={product}
                  onLightboxChange={setLightboxOpen}
                />

                <div ref={buyBoxRef} className="min-w-0">
                  <ProductBuyBox product={product} />
                </div>
              </div>

              <ProductTabs product={product} />

              <LazyMount
                rootMargin="320px 0px"
                fallback={
                  <div className="mt-12">
                    <BundleSkeleton />
                  </div>
                }
              >
                <FrequentlyBought product={product} />
              </LazyMount>
            </div>

            {similarRail ? (
              <LazyMount
                rootMargin="320px 0px"
                fallback={
                  <div className="mt-12">
                    <div className="mx-auto w-[90%] max-w-337.5">
                      <RailSkeleton />
                    </div>
                  </div>
                }
              >
                <ProductRail rail={similarRail} excludeId={product.id} />
              </LazyMount>
            ) : null}
          </>
        )}

        {product && !loading ? (
          <StickyBuyBar product={product} visible={showStickyBar} />
        ) : null}
      </div>
    </PageTransition>
  );
}

export default ProductDetails;
