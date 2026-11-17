import { useEffect, useId, useState } from "react";
import Checkbox from "../ui/Checkbox";
import Input from "../ui/Input";
import Radio from "../ui/Radio";
import { formatMoney } from "../../utils/listing";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function PriceRangeFilter({ idPrefix, bounds, values, onChange }) {
  const minId = `${idPrefix}-min-price`;
  const maxId = `${idPrefix}-max-price`;
  const minRangeId = `${idPrefix}-min-range`;
  const maxRangeId = `${idPrefix}-max-range`;
  const [text, setText] = useState({
    min: values.minPrice ?? "",
    max: values.maxPrice ?? "",
  });

  useEffect(() => {
    setText({
      min: values.minPrice ?? "",
      max: values.maxPrice ?? "",
    });
  }, [values.minPrice, values.maxPrice]);

  const commitText = (key) => {
    const raw = text[key].trim();
    const fallback = key === "min" ? values.minPrice : values.maxPrice;

    if (raw === "") {
      const next = key === "min" ? { minPrice: null } : { maxPrice: null };
      setText((current) => ({ ...current, [key]: "" }));
      onChange(next);
      return;
    }

    const parsed = Number(raw);

    if (!Number.isFinite(parsed) || parsed < 0) {
      setText((current) => ({
        ...current,
        [key]: fallback ?? "",
      }));
      return;
    }

    const clamped = clamp(parsed, bounds.min, bounds.max);
    const next =
      key === "min" ? { minPrice: clamped } : { maxPrice: clamped };

    setText((current) => ({ ...current, [key]: String(clamped) }));
    onChange(next);
  };

  const handleRange = (key, value) => {
    const number = Number(value);
    onChange(key === "min" ? { minPrice: number } : { maxPrice: number });
    setText((current) => ({ ...current, [key]: String(number) }));
  };

  const effectiveMin = values.minPrice ?? bounds.min;
  const effectiveMax = values.maxPrice ?? bounds.max;

  return (
    <div role="group" aria-labelledby={`${idPrefix}-price-heading`}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 id={`${idPrefix}-price-heading`} className="text-h6 font-bold text-ink">
          Price
        </h3>
        <p className="text-caption text-ink-secondary">
          {formatMoney(effectiveMin)} – {formatMoney(effectiveMax)}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Input
          id={minId}
          label="Min price"
          type="number"
          inputMode="numeric"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={text.min}
          placeholder={String(bounds.min)}
          inputClassName="h-10"
          onChange={(event) =>
            setText((current) => ({ ...current, min: event.target.value }))
          }
          onBlur={() => commitText("min")}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitText("min");
            }
          }}
        />

        <Input
          id={maxId}
          label="Max price"
          type="number"
          inputMode="numeric"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={text.max}
          placeholder={String(bounds.max)}
          inputClassName="h-10"
          onChange={(event) =>
            setText((current) => ({ ...current, max: event.target.value }))
          }
          onBlur={() => commitText("max")}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitText("max");
            }
          }}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor={minRangeId}
          className="flex items-center justify-between gap-2 text-xs font-semibold text-ink-secondary"
        >
          <span>Minimum</span>
          <span className="text-ink">{formatMoney(effectiveMin)}</span>
        </label>
        <input
          id={minRangeId}
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={effectiveMin}
          aria-valuetext={`Minimum price ${formatMoney(effectiveMin)}`}
          onChange={(event) => handleRange("min", event.target.value)}
          className="mt-1 w-full accent-ink"
        />
      </div>

      <div className="mt-2">
        <label
          htmlFor={maxRangeId}
          className="flex items-center justify-between gap-2 text-xs font-semibold text-ink-secondary"
        >
          <span>Maximum</span>
          <span className="text-ink">{formatMoney(effectiveMax)}</span>
        </label>
        <input
          id={maxRangeId}
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={effectiveMax}
          aria-valuetext={`Maximum price ${formatMoney(effectiveMax)}`}
          onChange={(event) => handleRange("max", event.target.value)}
          className="mt-1 w-full accent-ink"
        />
      </div>
    </div>
  );
}

function ListingFilters({
  idPrefix,
  bounds,
  brandFacets = [],
  ratingFacets = { 4: 0, 3: 0, 2: 0 },
  values,
  onChange,
  onReset,
}) {
  const baseId = useId();
  const prefix = idPrefix || `filters-${baseId}`;
  const [showAllBrands, setShowAllBrands] = useState(false);

  const hasHiddenSelected = values.brands.some((brand) => {
    const index = brandFacets.findIndex((facet) => facet.name === brand);
    return index >= 6;
  });
  const expanded = showAllBrands || hasHiddenSelected;
  const visibleBrands = expanded ? brandFacets : brandFacets.slice(0, 6);

  const toggleBrand = (name) => {
    const next = values.brands.includes(name)
      ? values.brands.filter((brand) => brand !== name)
      : [...values.brands, name];

    onChange({ brands: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-h5 font-bold text-ink">Filters</p>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-info underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      </div>

      <PriceRangeFilter
        idPrefix={prefix}
        bounds={bounds}
        values={values}
        onChange={onChange}
      />

      <div
        role="group"
        aria-labelledby={`${prefix}-rating-heading`}
        className="border-t border-border pt-5"
      >
        <h3
          id={`${prefix}-rating-heading`}
          className="text-h6 font-bold text-ink"
        >
          Rating
        </h3>

        <div className="mt-2 flex flex-col">
          <Radio
            name={`${prefix}-rating`}
            label={
              <span className="flex items-center justify-between gap-2">
                <span>Any rating</span>
                <span className="text-caption text-muted">
                  {ratingFacets[2] ?? 0}
                </span>
              </span>
            }
            checked={!values.rating}
            onChange={() => onChange({ rating: null })}
          />

          {[4, 3, 2].map((threshold) => (
            <Radio
              key={threshold}
              name={`${prefix}-rating`}
              label={
                <span className="flex items-center justify-between gap-2">
                  <span>
                    {threshold} stars &amp; up
                  </span>
                  <span className="text-caption text-muted">
                    {ratingFacets[threshold] ?? 0}
                  </span>
                </span>
              }
              checked={values.rating === threshold}
              onChange={() => onChange({ rating: threshold })}
            />
          ))}
        </div>
      </div>

      <div
        role="group"
        aria-labelledby={`${prefix}-brand-heading`}
        className="border-t border-border pt-5"
      >
        <h3
          id={`${prefix}-brand-heading`}
          className="text-h6 font-bold text-ink"
        >
          Brand
        </h3>

        <div className="mt-2 flex flex-col">
          {brandFacets.length === 0 ? (
            <p className="text-sm text-ink-secondary">No brands available.</p>
          ) : (
            visibleBrands.map((brand) => (
              <Checkbox
                key={brand.name}
                label={
                  <span className="flex items-center justify-between gap-2">
                    <span>{brand.name}</span>
                    <span className="text-caption text-muted">
                      {brand.count}
                    </span>
                  </span>
                }
                checked={values.brands.includes(brand.name)}
                onChange={() => toggleBrand(brand.name)}
              />
            ))
          )}
        </div>

        {brandFacets.length > 6 ? (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setShowAllBrands((current) => !current)}
            className="mt-2 text-sm font-semibold text-info underline-offset-2 hover:underline"
          >
            {expanded
              ? "Show fewer brands"
              : `Show ${brandFacets.length - 6} more brands`}
          </button>
        ) : null}
      </div>

      <div
        role="group"
        aria-labelledby={`${prefix}-availability-heading`}
        className="border-t border-border pt-5"
      >
        <h3
          id={`${prefix}-availability-heading`}
          className="text-h6 font-bold text-ink"
        >
          Availability
        </h3>

        <div className="mt-2">
          <Checkbox
            label="In stock only"
            checked={values.inStock}
            onChange={(event) =>
              onChange({ inStock: event.target.checked })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ListingFilters;
