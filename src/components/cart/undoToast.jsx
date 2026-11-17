import toast from "react-hot-toast";

/**
 * A custom toast is the only way to offer an action with the existing toast
 * helper. Undo re-adds through the existing addToCart loop, so CartContext
 * does not need an undo API.
 */
export function showUndoToast({ title, onUndo }) {
  return toast(
    (instance) => (
      <span className="flex min-w-0 items-center gap-3 text-sm text-ink">
        <span className="line-clamp-2 min-w-0 flex-1">
          {title} removed from cart.
        </span>
        <button
          type="button"
          onClick={() => {
            toast.dismiss(instance.id);
            onUndo();
          }}
          className="min-h-9 shrink-0 cursor-pointer rounded-sm px-1 font-semibold text-info underline underline-offset-4 hover:text-info-strong"
        >
          Undo
        </button>
      </span>
    ),
    { duration: 5000 },
  );
}
