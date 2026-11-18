import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import PostCard, {
  PostCover,
  PostMeta,
} from "../../components/content/PostCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { blogContent } from "../../mocks/contentMock";

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function BlogPost() {
  const { slug } = useParams();
  const post = blogContent.posts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <PageTransition>
        <div className="mx-auto w-[90%] max-w-337.5 py-16">
          <h1 className="text-h4 font-bold text-ink sm:text-h2">
            Article not found
          </h1>
          <p className="mt-3 max-w-xl text-ink-secondary">
            The article you're looking for may have moved or never existed.
          </p>
          <Button
            as={Link}
            to="/blog"
            variant="primary"
            leftIcon={<FiArrowLeft aria-hidden="true" />}
            className="mt-6"
          >
            Back to the journal
          </Button>
        </div>
      </PageTransition>
    );
  }

  const related = blogContent.posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <PageTransition>
      <div className="pb-16">
        <div className="mx-auto w-[90%] max-w-337.5 pt-6 sm:pt-8">
          <Link
            to="/blog"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink-secondary underline-offset-4 hover:text-ink hover:underline"
          >
            <FiArrowLeft aria-hidden="true" />
            {blogContent.backLabel}
          </Link>

          <header className="mt-4 border-b border-border pb-6 sm:pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="sm">
                {post.category}
              </Badge>
              <span className="text-xs text-ink-secondary">
                {post.readTime}
              </span>
            </div>

            <h1 className="mt-3 max-w-4xl break-words text-h4 font-bold leading-tight text-ink sm:text-h2">
              {post.title}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-secondary">
              {post.excerpt}
            </p>

            <PostMeta post={post} className="mt-5" />
          </header>
        </div>

        <div className="mx-auto mt-6 w-[90%] max-w-337.5">
          <PostCover
            post={post}
            fill
            className="rounded-xl sm:min-h-72"
          />
        </div>

        <div className="mx-auto mt-10 w-[90%] max-w-3xl">
          <div className="space-y-5">
            {post.body.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "text-lg leading-relaxed text-ink-secondary"
                    : "text-base leading-relaxed text-ink-secondary"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {post.takeaways?.length ? (
            <aside
              aria-labelledby="post-takeaways-heading"
              className="mt-8 rounded-xl border border-border bg-surface-subtle p-5 sm:p-6"
            >
              <h2
                id="post-takeaways-heading"
                className="text-h5 font-bold text-ink"
              >
                Key takeaways
              </h2>
              <ul className="mt-3 space-y-2">
                {post.takeaways.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-ink-secondary"
                  >
                    <FiCheckCircle
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-success"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <div className="mt-10 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-brand-soft text-sm font-bold text-ink"
              >
                {getInitials(post.author)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">{post.author}</p>
                <p className="text-xs text-ink-secondary">MAGICIAN journal</p>
              </div>
            </div>

            <Button
              as={Link}
              to="/contact"
              variant="outline"
              size="sm"
              className="shrink-0 self-start sm:self-auto"
            >
              Ask a question
            </Button>
          </div>
        </div>

        <section
          aria-labelledby="related-heading"
          className="mx-auto mt-12 w-[90%] max-w-337.5"
        >
          <h2 id="related-heading" className="text-h4 font-bold text-ink">
            Keep reading
          </h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PostCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default BlogPost;
