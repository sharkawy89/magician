import { useRef } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useOverlayBehavior } from "../ui/useOverlayBehavior";

const CONTROL_BUTTON =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-border bg-surface text-ink transition-colors duration-150 hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none";

function ProductLightbox({
  open,
  images,
  index,
  onIndexChange,
  onClose,
  title,
}) {
  const panelRef = useRef(null);
  const swipeStart = useRef(null);
  const reduceMotion = useReducedMotion();

  useOverlayBehavior({ open, onClose, panelRef });

  if (typeof document === "undefined") return null;

  const total = images.length;
  const safeIndex = total > 0 ? ((index % total) + total) % total : 0;
  const current = images[safeIndex];

  const go = (delta) => {
    if (total < 2) return;
    onIndexChange((safeIndex + delta + total) % total);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "Home") {
      event.preventDefault();
      onIndexChange(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onIndexChange(total - 1);
    }
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse") return;
    swipeStart.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (event.pointerType === "mouse" || swipeStart.current === null) return;

    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;

    if (Math.abs(delta) < 45) return;

    go(delta > 0 ? -1 : 1);
  };

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <Motion.div
          key="product-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-modal overflow-y-auto bg-ink"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <Motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} image viewer`}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center p-4 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p
                aria-live="polite"
                aria-atomic="true"
                className="rounded-pill bg-surface px-3 py-1.5 text-sm font-semibold text-ink"
              >
                {safeIndex + 1} / {total}
              </p>

              <button
                type="button"
                aria-label="Close image viewer"
                onClick={onClose}
                className={CONTROL_BUTTON}
              >
                <FiX aria-hidden="true" className="text-[22px]" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 sm:gap-6">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => go(-1)}
                disabled={total < 2}
                className={CONTROL_BUTTON}
              >
                <FiChevronLeft aria-hidden="true" className="text-[24px]" />
              </button>

              <div
                className="flex min-w-0 flex-1 touch-pan-y items-center justify-center"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  swipeStart.current = null;
                }}
              >
                <img
                  src={current}
                  alt={`${title} — image ${safeIndex + 1} of ${total}`}
                  draggable={false}
                  className="max-h-[72dvh] w-auto max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                aria-label="Next image"
                onClick={() => go(1)}
                disabled={total < 2}
                className={CONTROL_BUTTON}
              >
                <FiChevronRight aria-hidden="true" className="text-[24px]" />
              </button>
            </div>

            {total > 1 ? (
              <p className="mt-4 text-center text-xs text-white70">
                Swipe, or use the arrow keys, to browse images.
              </p>
            ) : null}
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default ProductLightbox;
