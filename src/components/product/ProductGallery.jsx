import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FiZoomIn } from "react-icons/fi";
import { useReducedMotion } from "framer-motion";
import { cn } from "../ui/cn";
import ProductLightbox from "./ProductLightbox";
import { getGalleryImages } from "../../utils/productDetails";

function useHoverZoomEnabled() {
  const reduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleChange = () => setCanHover(query.matches);

    query.addEventListener?.("change", handleChange);
    return () => query.removeEventListener?.("change", handleChange);
  }, []);

  return canHover && !reduceMotion;
}

function ProductGallery({ product, onLightboxChange }) {
  const images = getGalleryImages(product);
  const total = images.length;
  const zoomEnabled = useHoverZoomEnabled();

  const swiperRef = useRef(null);
  const imageButtons = useRef([]);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setIndex(0);
    setZoom(false);
  }, [product?.id]);

  const selectImage = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= total) return;
    setIndex(nextIndex);
    swiperRef.current?.slideTo(nextIndex);
  };

  const openLightbox = () => {
    if (total === 0) return;
    setLightboxOpen(true);
    onLightboxChange?.(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    onLightboxChange?.(false);

    window.requestAnimationFrame(() => {
      imageButtons.current[index]?.focus({ preventScroll: true });
    });
  };

  const handlePointerMove = (event) => {
    if (!zoomEnabled) return;

    const image = event.currentTarget.querySelector("img");
    if (!image) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Update the node directly: mousemove fires continuously and a state
    // update per pixel would re-render every slide.
    image.style.transformOrigin = `${Math.min(Math.max(x, 0), 100)}% ${Math.min(
      Math.max(y, 0),
      100,
    )}%`;
  };

  const handlePointerEnter = (event) => {
    if (!zoomEnabled) return;
    event.currentTarget.querySelector("img")?.style.setProperty(
      "transform-origin",
      "50% 50%",
    );
    setZoom(true);
  };

  const handlePointerLeave = (event) => {
    setZoom(false);
    event.currentTarget.querySelector("img")?.style.setProperty(
      "transform-origin",
      "50% 50%",
    );
  };

  if (total === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border bg-surface-subtle text-sm text-ink-secondary">
        No image available
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.slideTo(index, 0);
        }}
        onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
        slidesPerView={1}
        spaceBetween={0}
        className="overflow-hidden rounded-xl border border-border bg-surface"
      >
        {images.map((image, imageIndex) => (
          <SwiperSlide key={`${image}-${imageIndex}`}>
            <button
              type="button"
              ref={(node) => {
                imageButtons.current[imageIndex] = node;
              }}
              aria-label={`Open image ${imageIndex + 1} of ${total} full screen`}
              onClick={openLightbox}
              onMouseEnter={handlePointerEnter}
              onMouseLeave={handlePointerLeave}
              onMouseMove={handlePointerMove}
              className={cn(
                "group relative flex aspect-square w-full cursor-zoom-in items-center justify-center overflow-hidden bg-surface-subtle p-4 sm:p-8",
                !zoomEnabled && "cursor-pointer",
              )}
            >
              <img
                src={image}
                alt={`${product.title} — image ${imageIndex + 1} of ${total}`}
                draggable={false}
                style={{
                  transform: zoom && zoomEnabled ? "scale(1.9)" : "scale(1)",
                }}
                className={cn(
                  "max-h-full max-w-full object-contain",
                  zoomEnabled &&
                    "transition-transform duration-200 ease-out motion-reduce:transition-none",
                )}
              />

              {zoomEnabled ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-pill bg-ink px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 motion-reduce:transition-none"
                >
                  <FiZoomIn className="text-[14px]" /> Hover to zoom
                </span>
              ) : null}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {total > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
          {images.map((image, dotIndex) => (
            <button
              key={`dot-${image}-${dotIndex}`}
              type="button"
              aria-label={`Go to image ${dotIndex + 1} of ${total}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => selectImage(dotIndex)}
              className={cn(
                "h-2.5 cursor-pointer rounded-pill transition-all duration-150 motion-reduce:transition-none",
                dotIndex === index
                  ? "w-6 bg-ink"
                  : "w-2.5 bg-border-strong hover:bg-ink-secondary",
              )}
            />
          ))}
        </div>
      ) : null}

      {total > 1 ? (
        <div className="mt-4 hidden gap-2 overflow-x-auto pb-1 sm:flex">
          {images.map((image, thumbnailIndex) => {
            const active = thumbnailIndex === index;

            return (
              <button
                key={`thumb-${image}-${thumbnailIndex}`}
                type="button"
                aria-label={`Show image ${thumbnailIndex + 1} of ${total}`}
                aria-current={active ? "true" : undefined}
                onClick={() => selectImage(thumbnailIndex)}
                className={cn(
                  "flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 bg-surface p-2 transition-colors duration-150 motion-reduce:transition-none",
                  active
                    ? "border-ink"
                    : "border-border hover:border-border-strong",
                )}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <ProductLightbox
        open={lightboxOpen}
        images={images}
        index={index}
        onIndexChange={(nextIndex) => {
          setIndex(nextIndex);
          swiperRef.current?.slideTo(nextIndex);
        }}
        onClose={closeLightbox}
        title={product.title}
      />
    </div>
  );
}

export default ProductGallery;
