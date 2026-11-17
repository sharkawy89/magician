import {
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaSearch } from "react-icons/fa";
import { FiClock, FiTrendingUp, FiX } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { CategoryContext } from "../category/categoryContextValue";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { cn } from "../ui/cn";
import { formatCategoryName } from "../../utils/categories";
import { popularSearches } from "../../mocks/storefrontMock";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from "../../utils/recentSearches";

function SearchBar({ variant = "desktop", focusSignal = 0 }) {
  const compact = variant === "mobile";
  const { categories } = useContext(CategoryContext);
  const navigate = useNavigate();
  const location = useLocation();
  const generatedId = useId();
  const inputId = `storefront-search-${variant}-${generatedId}`;
  const listboxId = `${inputId}-listbox`;
  const hintId = `${inputId}-hint`;
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState(getRecentSearches);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const term = query.trim();

  const recentOptions = useMemo(
    () =>
      recent.map((value) => ({
        key: `recent:${value}`,
        type: "recent",
        term: value,
      })),
    [recent],
  );

  const popularOptions = useMemo(
    () =>
      popularSearches
        .filter(
          (value) =>
            !recent.some(
              (saved) => saved.toLowerCase() === value.toLowerCase(),
            ),
        )
        .map((value) => ({
          key: `popular:${value}`,
          type: "popular",
          term: value,
        })),
    [recent],
  );

  const options = useMemo(() => {
    if (!term) return [...recentOptions, ...popularOptions];

    return [
      { key: "submit", type: "submit", term },
      ...suggestions.map((product) => ({
        key: `product:${product.id}`,
        type: "product",
        product,
      })),
    ];
  }, [term, recentOptions, popularOptions, suggestions]);

  const showPanel =
    open &&
    (term.length > 0 || recentOptions.length > 0 || popularOptions.length > 0);
  const activeOption =
    activeIndex >= 0 && activeIndex < options.length
      ? options[activeIndex]
      : null;

  const optionId = (index) => `${inputId}-option-${index}`;

  // Existing suggestions behaviour: debounce, abort and keep five products.
  useEffect(() => {
    if (!term) {
      setSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    let ignore = false;

    const debounce = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Search failed (${res.status})`);
        }

        const data = await res.json();

        if (!ignore) {
          setSuggestions(
            Array.isArray(data.products) ? data.products.slice(0, 5) : [],
          );
        }
      } catch (error) {
        if (!ignore && error.name !== "AbortError") {
          console.error("Search Error :", error);
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      window.clearTimeout(debounce);
      controller.abort();
    };
  }, [term]);

  useEffect(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!formRef.current?.contains(event.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // The mobile Search tab asks whichever search bar is visible to take focus.
  useEffect(() => {
    if (!focusSignal) return;

    const input = inputRef.current;

    if (input && input.offsetParent !== null) {
      input.focus({ preventScroll: true });
      input.select();
      setOpen(true);
    }
  }, [focusSignal]);

  const closePanel = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const runSearch = (value) => {
    const nextTerm = String(value ?? "").trim();
    if (!nextTerm) return;

    setRecent(addRecentSearch(nextTerm));
    setQuery(nextTerm);
    setSuggestions([]);
    closePanel();

    const params = new URLSearchParams({ q: nextTerm });
    if (!compact && category) params.set("category", category);

    navigate(`/search?${params.toString()}`);
  };

  const selectOption = (option) => {
    if (!option) return;

    if (option.type === "product") {
      setSuggestions([]);
      closePanel();
      navigate(`/products/${option.product.id}`);
      return;
    }

    runSearch(option.term);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (activeOption) {
      selectOption(activeOption);
      return;
    }

    runSearch(query);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!showPanel) {
        setOpen(true);
        return;
      }

      if (options.length > 0) {
        setActiveIndex((current) =>
          current < 0 ? 0 : (current + 1) % options.length,
        );
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!showPanel) {
        setOpen(true);
        return;
      }

      if (options.length > 0) {
        setActiveIndex((current) =>
          current < 0
            ? options.length - 1
            : (current - 1 + options.length) % options.length,
        );
      }
      return;
    }

    if (event.key === "Home" && showPanel && options.length > 0) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && showPanel && options.length > 0) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Escape") {
      if (showPanel) {
        event.preventDefault();
        closePanel();
      }
      return;
    }

    if (event.key === "Enter" && activeOption) {
      event.preventDefault();
      selectOption(activeOption);
      return;
    }

    if (event.key === "Delete" && activeOption?.type === "recent") {
      event.preventDefault();
      setRecent(removeRecentSearch(activeOption.term));
      setActiveIndex(-1);
    }
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closePanel();
    }
  };

  const handleRemoveRecent = (event, value) => {
    event.preventDefault();
    event.stopPropagation();
    setRecent(removeRecentSearch(value));
    setActiveIndex(-1);
  };

  const handleClearRecent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setRecent(clearRecentSearches());
    setActiveIndex(-1);
    inputRef.current?.focus({ preventScroll: true });
  };

  const renderOption = (option, index, indexOffset = 0) => {
    const optionIndex = index + indexOffset;
    const active = optionIndex === activeIndex;
    const baseClass = cn(
      "flex min-h-11 cursor-pointer items-center gap-3 px-3 text-sm text-ink",
      active ? "bg-surface-subtle" : "hover:bg-surface-subtle",
    );

    if (option.type === "product") {
      const product = option.product;
      const image = product.thumbnail || product.images?.[0];

      return (
        <li
          key={option.key}
          id={optionId(optionIndex)}
          role="option"
          aria-selected={active}
          className={baseClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => selectOption(option)}
          onMouseEnter={() => setActiveIndex(optionIndex)}
        >
          {image ? (
            <img
              src={image}
              alt=""
              className="h-10 w-10 shrink-0 rounded-sm object-contain"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-subtle text-ink-secondary">
              <FaSearch aria-hidden="true" />
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-ink">
              {product.title}
            </span>
            {product.category ? (
              <span className="block truncate text-xs text-ink-secondary">
                {formatCategoryName(product.category)}
              </span>
            ) : null}
          </span>
        </li>
      );
    }

    const Icon =
      option.type === "recent"
        ? FiClock
        : option.type === "popular"
          ? FiTrendingUp
          : FaSearch;

    return (
      <li
        key={option.key}
        id={optionId(optionIndex)}
        role="option"
        aria-selected={active}
        className={baseClass}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => selectOption(option)}
        onMouseEnter={() => setActiveIndex(optionIndex)}
      >
        <Icon
          aria-hidden="true"
          className="shrink-0 text-[16px] text-ink-secondary"
        />

        <span className="min-w-0 flex-1 truncate">
          {option.type === "submit" ? (
            <>
              Search for <strong className="font-semibold">“{option.term}”</strong>
            </>
          ) : (
            option.term
          )}
        </span>

        {option.type === "recent" ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Remove ${option.term} from recent searches`}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-pill text-ink-secondary hover:bg-surface hover:text-ink"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => handleRemoveRecent(event, option.term)}
          >
            <FiX aria-hidden="true" className="text-[16px]" />
          </button>
        ) : null}
      </li>
    );
  };

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      className="relative w-full"
    >
      <p id={hintId} className="sr-only">
        Use the up and down arrow keys to move through suggestions, Enter to
        choose one, and Escape to close the suggestion list. Press Delete on a
        recent search to remove it.
      </p>

      <div className="flex h-12 items-center gap-1 rounded-lg border border-border bg-surface ps-1 focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 focus-within:ring-offset-brand">
        {!compact ? (
          <>
            <div className="relative flex h-full shrink-0 items-center">
              <select
                aria-label="Search in category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-full w-30 cursor-pointer appearance-none bg-transparent ps-3 pe-8 text-sm font-medium text-ink"
              >
                <option value="">All</option>
                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <MdOutlineKeyboardArrowDown
                aria-hidden="true"
                className="pointer-events-none absolute end-2 text-[18px] text-ink-secondary"
              />
            </div>
            <span aria-hidden="true" className="h-6 w-px bg-border" />
          </>
        ) : null}

        <Input
          id={inputId}
          name={variant === "desktop" ? "search" : "search-mobile"}
          type="text"
          inputRef={inputRef}
          role="combobox"
          aria-label="Search for products"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-activedescendant={
            showPanel && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          aria-describedby={hintId}
          placeholder="Search products"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          bare
          className="min-w-0 flex-1"
          inputClassName="h-12 ps-3 pe-2 focus-visible:outline-none focus-visible:shadow-none"
          endAdornment={
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              iconOnly
              aria-label="Search"
            >
              <FaSearch aria-hidden="true" />
            </Button>
          }
        />
      </div>

      {showPanel ? (
        <div className="absolute inset-x-0 top-full z-dropdown mt-2 overflow-hidden rounded-lg border border-border bg-surface shadow-dropdown">
          <div className="max-h-[70dvh] overflow-y-auto py-1">
            {!term && recentOptions.length > 0 ? (
              <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-1">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Recent searches
                </span>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleClearRecent}
                  className="flex h-10 items-center rounded-sm px-2 text-xs font-semibold text-info hover:underline"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            <ul
              id={listboxId}
              role="listbox"
              aria-label="Search suggestions"
              className="list-none"
            >
              {!term && recentOptions.length > 0
                ? recentOptions.map((option, index) =>
                    renderOption(option, index),
                  )
                : null}

              {!term && popularOptions.length > 0 ? (
                <>
                  <li
                    role="presentation"
                    className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-muted"
                  >
                    Popular searches
                  </li>
                  {popularOptions.map((option, index) =>
                    renderOption(option, index, recentOptions.length),
                  )}
                </>
              ) : null}

              {term ? (
                <>
                  {options.map((option, index) => renderOption(option, index))}
                  {suggestions.length === 0 ? (
                    <li
                      role="presentation"
                      className="px-3 py-2 text-xs text-ink-secondary"
                    >
                      No quick matches. Press Enter to search the catalogue.
                    </li>
                  ) : null}
                </>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </form>
  );
}

export default SearchBar;
