import { useId } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { cn } from "./cn";

function Select({
  id,
  label,
  error,
  helper,
  placeholder,
  options = [],
  required = false,
  className = "",
  selectClassName = "",
  children,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helper ? `${selectId}-helper` : undefined;
  const describedBy = error ? errorId : helperId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold text-ink"
        >
          {label}
          {required ? (
            <span className="text-danger" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative">
        <select
          {...props}
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 w-full cursor-pointer appearance-none rounded-lg border bg-surface ps-3.5 pe-10 text-body text-ink transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-muted",
            error ? "border-danger" : "border-border-strong",
            "focus-visible:border-ink",
            selectClassName,
          )}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.length > 0
            ? options.map((option) =>
                typeof option === "string" ? (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ) : (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ),
              )
            : children}
        </select>
        <MdOutlineKeyboardArrowDown
          aria-hidden="true"
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[20px] text-ink-secondary"
        />
      </div>

      {error ? (
        <p id={errorId} className="text-caption font-medium text-danger">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="text-caption text-ink-secondary">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export default Select;
