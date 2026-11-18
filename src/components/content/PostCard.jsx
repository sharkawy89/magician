import {
  FiBox,
  FiClock,
  FiHome,
  FiShield,
  FiShoppingBag,
  FiSmartphone,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { cn } from "../ui/cn";

const COVER_ICONS = {
  phone: FiSmartphone,
  home: FiHome,
  box: FiBox,
  bag: FiShoppingBag,
  shield: FiShield,
  sun: FiSun,
};

const COVER_TONES = {
  brand: "bg-gradient-to-br from-brand-soft via-brand to-brand-hover text-ink",
  ink: "on-ink bg-gradient-to-br from-ink to-ink-secondary text-white",
  sky: "bg-gradient-to-br from-info/10 via-info/5 to-surface-subtle text-ink",
  amber:
    "bg-gradient-to-br from-warning/20 via-warning/10 to-surface-subtle text-ink",
  mint: "bg-gradient-to-br from-success/10 via-success/5 to-surface-subtle text-ink",
  rose: "bg-gradient-to-br from-danger/10 via-danger/5 to-surface-subtle text-ink",
};

export function PostCover({ post, className = "", fill = false }) {
  const tone = COVER_TONES[post.tone] ?? COVER_TONES.brand;
  const Icon = COVER_ICONS[post.icon] ?? FiBox;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        fill ? "h-full min-h-56" : "aspect-[16/9]",
        tone,
        className,
      )}
    >
      <Icon className="pointer-events-none absolute -end-4 -bottom-6 text-[110px] opacity-10" />

      <span className="relative flex flex-col items-center gap-2 px-6 text-center">
        <Icon className="text-[30px]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
          {post.category}
        </span>
      </span>
    </div>
  );
}

export function PostMeta({ post, className = "" }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-secondary",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        <FiUser aria-hidden="true" className="shrink-0" />
        {post.author}
      </span>

      <span aria-hidden="true" className="text-border-strong">
        •
      </span>

      <time dateTime={post.date}>{post.dateLabel}</time>

      <span aria-hidden="true" className="text-border-strong">
        •
      </span>

      <span className="inline-flex items-center gap-1">
        <FiClock aria-hidden="true" className="shrink-0" />
        {post.readTime}
      </span>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <PostCover post={post} />

      <div className="flex flex-1 flex-col p-5">
        <Badge variant="neutral" size="sm">
          {post.category}
        </Badge>

        <h3 className="mt-3 text-h5 font-bold leading-snug text-ink">
          <Link
            to={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 hover:underline"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4">
          <PostMeta post={post} />
        </div>
      </div>
    </article>
  );
}

export default PostCard;
