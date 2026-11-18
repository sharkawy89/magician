import { FiCheck, FiChevronRight } from "react-icons/fi";
import { cn } from "../ui/cn";

function CheckoutProgress({ steps, currentStep, stepIndex, stepTotal, onGoToStep }) {
  const currentLabel =
    steps.find((step) => step.id === currentStep)?.label || currentStep;

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-ink lg:hidden">
        Step {stepIndex + 1} of {stepTotal}
        <span className="ms-2 font-normal text-ink-secondary">
          {currentLabel}
        </span>
      </p>

      <ol
        aria-label="Checkout progress"
        className="hidden list-none items-center gap-2 lg:flex"
      >
        {steps.map((step, index) => {
          const completed = index < stepIndex;
          const current = index === stepIndex;
          const disabled = index > stepIndex;

          return (
            <li key={step.id} className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                aria-current={current ? "step" : undefined}
                disabled={disabled}
                onClick={() => !disabled && onGoToStep(step.id)}
                className={cn(
                  "flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none",
                  completed &&
                    "border-success bg-surface-subtle text-success hover:bg-surface",
                  current && "border-info bg-brand text-ink",
                  !completed &&
                    !current &&
                    "border-border text-ink-secondary disabled:cursor-not-allowed disabled:text-muted",
                  !disabled && "cursor-pointer",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-pill text-[11px] font-bold",
                    completed && "bg-success text-white",
                    current && "bg-ink text-white",
                    !completed && !current && "bg-surface-subtle text-ink-secondary",
                  )}
                >
                  {completed ? <FiCheck /> : index + 1}
                </span>
                <span className="truncate">{step.label}</span>
              </button>

              {index < stepTotal - 1 ? (
                <FiChevronRight
                  aria-hidden="true"
                  className="shrink-0 text-ink-secondary"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default CheckoutProgress;