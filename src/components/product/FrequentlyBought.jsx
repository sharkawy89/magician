import { useContext, useEffect, useId, useMemo, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa6";
import { CartContext } from "../context/cartContextValue";
import { MiniCartContext } from "../context/miniCartContextValue";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import { Skeleton, SkeletonText } from "../ui/Skeleton";
import { formatMoney } from "../../utils/listing";
import { getStockInfo } from "../../utils/productDetails";

const API_ROOT = "https://dummyjson.com/products";

export function BundleSkeleton() {
  return (
    <div aria-hidden="true" className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <Skeleton rounded="rounded-sm" className="h-6 w-full max-w-56" />
      <SkeletonText lines={1} className="mt-2 max-w-md" />
      <div className="mt-5 flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton rounded="rounded-sm" className="h-5 w-5" />
            <Skeleton rounded="rounded-lg" className="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <Skeleton rounded="rounded-sm" className="h-3.5 w-2/3" />
              <Skeleton rounded="rounded-sm" className="mt-2 h-3 w-full max-w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FrequentlyBought({ product }) {
  const headingId = useId();
  const { addToCart } = useContext(CartContext);
  const { openMiniCart } = useContext(MiniCartContext);

  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(Boolean(product.category));
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState(null);

  useEffect(() => {
    if (!product.category) {
      setLoading(false);
      setAddOns([]);
      return undefined;
    }

    const controller = new AbortController();
    let ignore = false;

    const fetchBundle = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_ROOT}/category/${encodeURIComponent(product.category)}?limit=0`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Failed to load bundle suggestions (${res.status})`);
        }

        const data = await res.json();
        let candidates = (Array.isArray(data.products) ? data.products : [])
          .filter((item) => item.id !== product.id)
          .filter((item) => getStockInfo(item).state !== "out");

        if (candidates.length < 2) {
          const fallbackRes = await fetch(`${API_ROOT}?limit=50`, {
            signal: controller.signal,
          });

          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const existing = new Set(candidates.map((item) => item.id));
            const extra = (Array.isArray(fallbackData.products)
              ? fallbackData.products
              : []
            )
              .filter((item) => item.id !== product.id)
              .filter((item) => !existing.has(item.id))
              .filter((item) => getStockInfo(item).state !== "out");

            candidates = [...candidates, ...extra];
          }
        }

        if (!ignore) {
          setAddOns(candidates.slice(0, 2));
        }
      } catch (fetchError) {
        if (!ignore && fetchError.name !== "AbortError") {
          console.error("Could not load bundle suggestions", fetchError);
          setError("We couldn't load bundle suggestions.");
          setAddOns([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBundle();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [product.category, product.id, reloadKey]);

  const items = useMemo(
    () => [product, ...addOns].slice(0, 3),
    [product, addOns],
  );

  const selectableItems = useMemo(
    () => items.filter((item) => getStockInfo(item).state !== "out"),
    [items],
  );

  useEffect(() => {
    if (loading) return;
    setSelectedIds(selectableItems.map((item) => item.id));
  }, [loading, selectableItems]);

  const selectedSet = new Set(selectedIds ?? []);
  const total = items.reduce(
    (sum, item) =>
      selectedSet.has(item.id) ? sum + (Number(item.price) || 0) : sum,
    0,
  );

  if (loading) return <BundleSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <p className="text-sm text-ink-secondary">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (items.length < 2) return null;

  const toggle = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current ?? []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return [...next];
    });
  };

  const addSelected = () => {
    if (selectedSet.size === 0) return;

    for (const item of items) {
      if (selectedSet.has(item.id)) addToCart(item);
    }

    openMiniCart();
  };

  return (
    <section aria-labelledby={headingId} className="mt-12">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 id={headingId} className="text-h4 font-bold text-ink">
          Frequently bought together
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Pick any combination and add everything in one step.
        </p>

        <ul className="mt-5 flex list-none flex-col gap-3">
          {items.map((item) => {
            const stock = getStockInfo(item);
            const disabled = stock.state === "out";
            const selected = selectedSet.has(item.id);
            const image = item.images?.[0] || item.thumbnail;

            return (
              <li key={item.id}>
                <Checkbox
                  checked={selected}
                  disabled={disabled}
                  onChange={() => toggle(item.id)}
                  label={
                    <span className="flex w-full items-center gap-3 py-1">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          className="h-12 w-12 shrink-0 rounded-lg border border-border bg-surface-subtle object-contain p-1"
                        />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-subtle text-[10px] text-ink-secondary">
                          No image
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 block text-sm font-semibold text-ink">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-secondary">
                          {formatMoney(item.price)}
                          {disabled ? " · Out of stock" : ""}
                        </span>
                      </span>
                    </span>
                  }
                />
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-ink-secondary">
            Bundle total{" "}
            <span
              aria-live="polite"
              className="text-h5 font-bold text-ink"
            >
              {formatMoney(total)}
            </span>
          </p>

          <Button
            variant="primary"
            onClick={addSelected}
            disabled={selectedSet.size === 0}
            leftIcon={<FaCartArrowDown aria-hidden="true" />}
          >
            Add selected to cart
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FrequentlyBought;
