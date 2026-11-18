import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m as Motion, useReducedMotion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Button from "./Button";
import { cn } from "./cn";
import { useOverlayBehavior } from "./useOverlayBehavior";

const SIDES = {
  right: "inset-y-0 end-0 h-full w-full max-w-md border-s",
  left: "inset-y-0 start-0 h-full w-full max-w-md border-e",
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-xl border-t",
};

const MOTION = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
};

function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  closeLabel = "Close panel",
  className = "",
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();
  const position = SIDES[side] ? side : "right";
  const panelMotion = MOTION[position];

  useOverlayBehavior({ open, onClose, panelRef });

  if (import.meta.env.DEV && open && !title) {
    console.warn("Drawer: provide a visible title to label the panel.");
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <Motion.div
          key="drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-modal"
        >
          <div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-ink/60"
          />

          <Motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            aria-label={title ? undefined : "Panel"}
            tabIndex={-1}
            initial={reduceMotion ? false : panelMotion.initial}
            animate={panelMotion.animate}
            exit={reduceMotion ? { opacity: 0 } : panelMotion.exit}
            transition={{
              duration: reduceMotion ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "fixed flex flex-col border-border bg-surface shadow-panel outline-none",
              SIDES[position],
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                {title ? (
                  <h2 id={titleId} className="text-h5 font-bold text-ink">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p
                    id={descriptionId}
                    className="mt-1 text-sm text-ink-secondary"
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              <Button
                variant="ghost"
                size="md"
                iconOnly
                aria-label={closeLabel}
                onClick={onClose}
                className="-me-1 -mt-1"
              >
                <IoClose aria-hidden="true" className="text-[20px]" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {children}
            </div>

            {footer ? (
              <div className="border-t border-border px-5 py-4 sm:px-6">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  {footer}
                </div>
              </div>
            ) : null}
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default Drawer;
