import { useId, useMemo, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import Input from "../ui/Input";
import Rating from "../ui/Rating";
import Select from "../ui/Select";
import { cn } from "../ui/cn";
import { notify } from "../ui/toast";
import {
  formatReviewDate,
  getReviewsSummary,
  sortReviews,
} from "../../utils/productDetails";

const REVIEW_SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

const INITIAL_VISIBLE = 2;

function ReviewForm() {
  const textareaId = useId();
  const textareaErrorId = `${textareaId}-error`;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rating: "5", title: "", comment: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (![1, 2, 3, 4, 5].includes(Number(form.rating))) {
      nextErrors.rating = "Choose a rating from 1 to 5 stars.";
    }

    if (form.title.trim().length < 3) {
      nextErrors.title = "Add a title with at least 3 characters.";
    }

    if (form.comment.trim().length < 10) {
      nextErrors.comment = "Add a comment with at least 10 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      notify.error("Please check the highlighted review fields.");
      return;
    }

    notify.success("Thanks! This demo review was not saved.");
    setForm({ rating: "5", title: "", comment: "" });
    setErrors({});
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-surface-subtle p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-h5 font-bold text-ink">Write a review</h3>
          <p className="mt-1 text-caption text-ink-secondary">
            Demo only — reviews are not submitted or saved.
          </p>
        </div>

        {!open ? (
          <Button variant="outline" onClick={() => setOpen(true)}>
            Write a review
          </Button>
        ) : null}
      </div>

      {open ? (
        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
            <Select
              label="Rating"
              value={form.rating}
              error={errors.rating}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  rating: event.target.value,
                }))
              }
              options={[5, 4, 3, 2, 1].map((rating) => ({
                value: String(rating),
                label: `${rating} star${rating === 1 ? "" : "s"}`,
              }))}
            />

            <Input
              label="Review title"
              value={form.title}
              error={errors.title}
              maxLength={80}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor={textareaId}
              className="text-sm font-semibold text-ink"
            >
              Review
            </label>
            <textarea
              id={textareaId}
              rows={4}
              value={form.comment}
              maxLength={600}
              aria-invalid={errors.comment ? true : undefined}
              aria-describedby={errors.comment ? textareaErrorId : undefined}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  comment: event.target.value,
                }))
              }
              className={cn(
                "mt-1.5 w-full resize-y rounded-lg border bg-surface p-3 text-body text-ink transition-colors duration-150 placeholder:text-muted focus-visible:border-ink motion-reduce:transition-none",
                errors.comment ? "border-danger" : "border-border-strong",
              )}
              placeholder="Share what you liked or what could be better."
            />
            {errors.comment ? (
              <p
                id={textareaErrorId}
                className="mt-1.5 text-caption font-medium text-danger"
              >
                {errors.comment}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit" variant="primary">
              Submit review
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function ReviewItem({ review }) {
  const name =
    typeof review?.reviewerName === "string" && review.reviewerName.trim()
      ? review.reviewerName.trim()
      : "Anonymous";

  return (
    <li className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-border bg-surface-subtle text-sm font-bold text-ink"
          >
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="text-caption text-ink-secondary">
              {formatReviewDate(review?.date)}
            </p>
          </div>
        </div>

        <Rating value={Number(review?.rating) || 0} size="sm" />
      </div>

      {review?.title ? (
        <p className="mt-3 font-semibold text-ink">{review.title}</p>
      ) : null}
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-secondary">
        {review?.comment}
      </p>
    </li>
  );
}

function ProductReviews({ product }) {
  const reviews = useMemo(
    () => (Array.isArray(product.reviews) ? product.reviews : []),
    [product.reviews],
  );
  const summary = useMemo(() => getReviewsSummary(reviews), [reviews]);
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const sorted = useMemo(() => sortReviews(reviews, sort), [reviews, sort]);
  const visible = sorted.slice(0, visibleCount);

  return (
    <div>
      {reviews.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-[2.5rem] font-bold leading-none text-ink">
              {summary.average.toFixed(1)}
            </p>
            <Rating
              value={summary.average}
              count={summary.count}
              className="mt-2"
            />
            <p className="mt-1 text-caption text-ink-secondary">
              Based on {summary.count} review{summary.count === 1 ? "" : "s"}
            </p>

            <div className="mt-5 grid gap-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star];
                const percent =
                  summary.count > 0 ? Math.round((count / summary.count) * 100) : 0;

                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-10 shrink-0 text-ink-secondary">
                      {star} star
                    </span>
                    <div
                      role="progressbar"
                      aria-label={`${count} review${
                        count === 1 ? "" : "s"
                      } rated ${star} star${star === 1 ? "" : "s"}`}
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-2 min-w-0 flex-1 overflow-hidden rounded-pill bg-surface-subtle"
                    >
                      <div
                        aria-hidden="true"
                        className="h-full rounded-pill bg-rating"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-end tabular-nums text-ink-secondary">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-h5 font-bold text-ink">
                Customer reviews
              </h3>

              <Select
                label="Sort reviews"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setVisibleCount(INITIAL_VISIBLE);
                }}
                options={REVIEW_SORTS}
                className="w-full sm:w-56"
              />
            </div>

            <ul className="mt-4 flex list-none flex-col gap-3">
              {visible.map((review, index) => (
                <ReviewItem
                  key={`${review?.reviewerName ?? "review"}-${
                    review?.date ?? index
                  }-${index}`}
                  review={review}
                />
              ))}
            </ul>

            {visibleCount < sorted.length ? (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setVisibleCount((current) =>
                      Math.min(current + 3, sorted.length),
                    )
                  }
                >
                  Show more reviews
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<FiMessageSquare />}
          title="No reviews yet"
          description="This product has no reviews in the demo data. Write one below to try the form — nothing is saved."
        />
      )}

      <ReviewForm />
    </div>
  );
}

export default ProductReviews;
