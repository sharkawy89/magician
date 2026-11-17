import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Product from "../slideProducts/Product";
import ErrorState from "../ui/ErrorState";
import { Skeleton, SkeletonText } from "../ui/Skeleton";

const RAIL_BUTTON =
  "hidden h-10 w-10 items-center justify-center rounded-pill border border-border-strong bg-surface text-ink transition-colors duration-200 hover:border-ink hover:bg-surface-subtle motion-reduce:transition-none sm:inline-flex [@media(hover:none)]:hidden";

function RailSkeleton() {
  return (
    <div aria-hidden="true" className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="w-62.5 shrink-0 rounded-xl border border-border bg-surface p-4"
        >
          <Skeleton rounded="rounded-lg" className="h-40 w-full" />
          <SkeletonText lines={2} className="mt-4" />
          <Skeleton className="mt-4 h-6 w-24" />
        </div>
      ))}
    </div>
  );
}

function ProductRail({ rail }) {
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(rail.endpoint, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to load ${rail.title} (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error(`Could not load ${rail.title}`, error);
          setError("We couldn't load these products. Please try again later.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [rail.endpoint, rail.title]);

  return (
    <section className="mt-12" aria-labelledby={`${rail.id}-heading`}>
      <div className="mx-auto w-[90%] max-w-337.5">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2
              id={`${rail.id}-heading`}
              className="text-h4 font-bold text-ink sm:text-h3"
            >
              {rail.title}
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">{rail.subtitle}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={`Previous ${rail.title} products`}
              onClick={() => swiperRef.current?.slidePrev()}
              className={RAIL_BUTTON}
            >
              <FiChevronLeft aria-hidden="true" className="text-[20px]" />
            </button>
            <button
              type="button"
              aria-label={`Next ${rail.title} products`}
              onClick={() => swiperRef.current?.slideNext()}
              className={RAIL_BUTTON}
            >
              <FiChevronRight aria-hidden="true" className="text-[20px]" />
            </button>
          </div>
        </div>

        {loading ? (
          <RailSkeleton />
        ) : error ? (
          <ErrorState title="Products unavailable" description={error} />
        ) : (
          <Swiper
            id={`${rail.id}-rail`}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView="auto"
            spaceBetween={16}
            rewind
            watchOverflow
          >
            {products.map((item) => (
              <SwiperSlide key={item.id} className="!w-62.5">
                <Product item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default ProductRail;
