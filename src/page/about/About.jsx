import {
  FiArrowRight,
  FiMessageCircle,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import PageHeader from "../../components/content/PageHeader";
import Button from "../../components/ui/Button";
import { cn } from "../../components/ui/cn";
import { aboutContent } from "../../mocks/contentMock";

const VALUE_ICONS = {
  star: FiStar,
  bag: FiShoppingBag,
  truck: FiTruck,
  support: FiMessageCircle,
};

const AVATAR_TONES = {
  brand: "bg-brand text-ink",
  ink: "bg-ink text-white",
  soft: "bg-brand-soft text-ink",
};

function About() {
  const { stats, story, values, milestones, team, cta } = aboutContent;

  return (
    <PageTransition>
      <div className="pb-16">
        <div className="mx-auto w-[90%] max-w-337.5">
          <PageHeader
            eyebrow={aboutContent.eyebrow}
            title={aboutContent.title}
            description={aboutContent.description}
          />
        </div>

        <section aria-labelledby="about-stats-heading" className="mt-8">
          <div className="mx-auto w-[90%] max-w-337.5">
            <h2 id="about-stats-heading" className="sr-only">
              MAGICIAN at a glance
            </h2>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-surface px-5 py-6 sm:px-6">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-secondary">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-h3 font-bold text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="about-story-heading" className="mt-12">
          <div className="mx-auto grid w-[90%] max-w-337.5 gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
            <div>
              <h2
                id="about-story-heading"
                className="text-h4 font-bold leading-tight text-ink sm:text-h2"
              >
                {story.heading}
              </h2>

              <div className="mt-5 space-y-4">
                {story.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={cn(
                      "leading-relaxed text-ink-secondary",
                      index === 0 && "text-base sm:text-lg",
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <figure className="flex flex-col justify-center rounded-xl border border-border bg-surface-subtle p-6 sm:p-8">
              <span
                aria-hidden="true"
                className="font-heading text-[44px] leading-none text-brand-hover"
              >
                &ldquo;
              </span>

              <blockquote className="mt-2">
                <p className="font-heading text-h4 font-bold leading-snug text-ink">
                  {story.quote}
                </p>
              </blockquote>

              <figcaption className="mt-6 border-t border-border pt-4 text-sm text-ink-secondary">
                <cite className="not-italic font-semibold text-ink">
                  {story.quoteAttribution}
                </cite>
              </figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="about-values-heading" className="mt-14">
          <div className="mx-auto w-[90%] max-w-337.5">
            <h2
              id="about-values-heading"
              className="text-h4 font-bold text-ink sm:text-h3"
            >
              What we stand for
            </h2>

            <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = VALUE_ICONS[value.icon] ?? FiStar;

                return (
                  <li
                    key={value.id}
                    className="rounded-xl border border-border bg-surface p-5 shadow-card"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-pill bg-brand-soft text-[20px] text-ink"
                    >
                      <Icon />
                    </span>

                    <h3 className="mt-4 text-h5 font-bold text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                      {value.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section aria-labelledby="about-milestones-heading" className="mt-14">
          <div className="mx-auto w-[90%] max-w-337.5">
            <h2
              id="about-milestones-heading"
              className="text-h4 font-bold text-ink sm:text-h3"
            >
              How we got here
            </h2>

            <ol className="mt-6 list-none border-s border-border ps-5 sm:ps-6">
              {milestones.map((milestone) => (
                <li key={milestone.id} className="relative pb-7 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -start-[27px] top-1.5 h-2.5 w-2.5 rounded-pill border-2 border-brand bg-surface sm:-start-[31px]"
                  />

                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-secondary">
                    {milestone.year}
                  </p>
                  <h3 className="mt-1 text-h5 font-bold text-ink">
                    {milestone.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-secondary">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="about-team-heading" className="mt-14">
          <div className="mx-auto w-[90%] max-w-337.5">
            <h2
              id="about-team-heading"
              className="text-h4 font-bold text-ink sm:text-h3"
            >
              The people behind the shelf
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-secondary">
              Small team, short chain of command, no call centre. Everyone here
              has answered a customer email this week.
            </p>

            <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <li
                  key={member.id}
                  className="rounded-xl border border-border bg-surface p-5 shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-pill text-sm font-bold",
                      AVATAR_TONES[member.tone] ?? AVATAR_TONES.soft,
                    )}
                  >
                    {member.initials}
                  </span>

                  <h3 className="mt-4 text-h6 font-bold text-ink">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                    {member.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {member.bio}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="about-cta-heading" className="mt-14">
          <div className="mx-auto w-[90%] max-w-337.5">
            <div className="on-ink rounded-xl bg-ink px-6 py-10 text-white sm:px-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <h2
                    id="about-cta-heading"
                    className="text-h4 font-bold text-white"
                  >
                    {cta.heading}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {cta.description}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <Button as={Link} to={cta.primaryTo} variant="primary">
                    {cta.primaryLabel}
                  </Button>

                  <Link
                    to={cta.secondaryTo}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-pill px-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
                  >
                    {cta.secondaryLabel}
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default About;
