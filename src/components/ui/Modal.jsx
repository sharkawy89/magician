import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion as Motion, useReducedMotion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Button from "./Button";
import { cn } from "./cn";
import { useOverlayBehavior } from "./useOverlayBehavior";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeLabel = "Close dialog",
  className = "",
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();

  useOverlayBehavior({ open, onClose, panelRef });

  if (import.meta.env.DEV && open && !title) {
    console.warn("Modal: provide a visible title to label the dialog.");
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <Motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-modal flex items-center justify-center overflow-y-auto p-4 sm:p-6"
        >
          <div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 bg-ink/60"
          />

          <Motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            aria-label={title ? undefined : "Dialog"}
            tabIndex={-1}
            initial={
              reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 12 }
            }
            transition={{
              duration: reduceMotion ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "relative w-full rounded-xl border border-border bg-surface p-5 shadow-panel outline-none sm:p-6",
              "max-h-[calc(100dvh-2rem)] overflow-y-auto",
              SIZES[size] ?? SIZES.md,
              className,
            )}
          >
            <Button
              variant="ghost"
              size="md"
              iconOnly
              aria-label={closeLabel}
              onClick={onClose}
              className="absolute end-3 top-3 sm:end-4 sm:top-4"
            >
              <IoClose aria-hidden="true" className="text-[20px]" />
            </Button>

            {title ? (
              <div className="pe-12">
                <h2 id={titleId} className="text-h5 font-bold text-ink">
                  {title}
                </h2>
                {description ? (
                  <p
                    id={descriptionId}
                    className="mt-1 text-sm text-ink-secondary"
                  >
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}

            {children ? <div className="mt-5">{children}</div> : null}

            {footer ? (
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {footer}
              </div>
            ) : null}
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default Modal;
