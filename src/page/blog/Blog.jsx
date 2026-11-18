import { useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import PageHeader from "../../components/content/PageHeader";
import PostCard, {
  PostCover,
  PostMeta,
} from "../../components/content/PostCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { cn } from "../../components/ui/cn";
import { blogContent } from "../../mocks/contentMock";

function Blog() {
  const { posts } = blogContent;
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const topics = useMemo(
    () => ["All", ...new Set(posts.map((post) => post.category))],
    [posts],
  );
  const [topic, setTopic] = useState("All");

  const showFeatured = topic === "All" && Boolean(featured);

  const gridPosts = useMemo(() => {
    if (topic === "All") {
      return posts.filter((post) => post.slug !== featured?.slug);
    }

    return posts.filter((post) => post.category === topic);
  }, [posts, topic, featured]);

  return (
    <PageTransition>
      <div className="pb-16">
        <div className="mx-auto w-[90%] max-w-337.5">
          <PageHeader
            eyebrow={blogContent.eyebrow}
            title={blogContent.title}
            description={blogContent.description}
          />
        </div>

        {showFeatured ? (
          <section aria-labelledby="featured-post-heading" className="mt-8">
            <div className="mx-auto w-[90%] max-w-337.5">
              <article className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-card lg:grid lg:grid-cols-2">
                <PostCover
                  post={featured}
                  fill
                  className="lg:min-h-full"
                />

                <div className="flex flex-col p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="brand" size="sm">
                      {blogContent.featuredLabel}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {featured.category}
                    </Badge>
                  </div>

                  <h2
                    id="featured-post-heading"
                    className="mt-3 text-h4 font-bold leading-tight text-ink sm:text-h3"
                  >
                    <Link
                      to={`/blog/${featured.slug}`}
                      className="after:absolute after:inset-0 hover:underline"
                    >
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary sm:text-base">
                    {featured.excerpt}
                  </p>

                  <div className="mt-auto pt-6">
                    <PostMeta post={featured} />
                    <span
                      aria-hidden="true"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
                    >
                      {blogContent.readMoreLabel}
                      <FiArrowRight />
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <div className="mx-auto mt-10 w-[90%] max-w-337.5">
          <div
            role="group"
            aria-label="Filter articles by topic"
            className="flex flex-wrap gap-2"
          >
            {topics.map((item) => {
              const active = topic === item;

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTopic(item)}
                  className={cn(
                    "inline-flex min-h-10 cursor-pointer items-center rounded-pill border px-4 text-sm font-semibold transition-colors duration-150",
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-surface text-ink-secondary hover:border-ink hover:text-ink",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <section
          aria-labelledby="blog-grid-heading"
          className="mx-auto mt-6 w-[90%] max-w-337.5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="blog-grid-heading" className="text-h4 font-bold text-ink">
              {topic === "All" ? blogContent.gridHeading : topic}
            </h2>
            <p className="text-sm text-ink-secondary">
              {gridPosts.length}{" "}
              {gridPosts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {gridPosts.length > 0 ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-4 rounded-xl border border-border bg-surface"
              title={blogContent.emptyMessage}
              description="Try another topic, or browse everything we've written."
              action={
                <Button variant="outline" onClick={() => setTopic("All")}>
                  Show all articles
                </Button>
              }
            />
          )}
        </section>

        <section aria-labelledby="blog-cta-heading" className="mt-12">
          <div className="mx-auto w-[90%] max-w-337.5">
            <div className="on-ink rounded-xl bg-ink px-6 py-10 text-white sm:px-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
                    {blogContent.cta.eyebrow}
                  </p>
                  <h2
                    id="blog-cta-heading"
                    className="mt-2 text-h4 font-bold text-white"
                  >
                    {blogContent.cta.heading}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {blogContent.cta.description}
                  </p>
                </div>

                <Button
                  as={Link}
                  to={blogContent.cta.to}
                  variant="primary"
                  className="shrink-0"
                >
                  {blogContent.cta.label}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default Blog;
