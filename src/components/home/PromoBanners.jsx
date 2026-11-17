import { FiHome, FiSmartphone } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { cn } from "../ui/cn";
import { homePromos } from "../../mocks/storefrontMock";

const ICONS = {
  home: FiHome,
  phone: FiSmartphone,
};

function PromoBanners() {
  return (
    <section aria-labelledby="home-promos-heading" className="mt-12">
      <div className="mx-auto w-[90%] max-w-337.5">
        <h2 id="home-promos-heading" className="sr-only">
          Featured promotions
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {homePromos.map((promo) => {
            const Icon = ICONS[promo.icon] ?? FiHome;
            const isInk = promo.tone === "ink";

            return (
              <div
                key={promo.id}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-6 sm:p-8",
                  isInk
                    ? "on-ink border-ink bg-ink text-white"
                    : "border-border bg-brand-soft text-ink",
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -bottom-6 -end-4 text-[120px]",
                    isInk ? "text-white/10" : "text-ink/10",
                  )}
                />

                <p
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.16em]",
                    isInk ? "text-brand" : "text-ink-secondary",
                  )}
                >
                  {promo.eyebrow}
                </p>
                <h3
                  className={cn(
                    "relative mt-2 max-w-xs text-h3 font-bold",
                    isInk ? "text-white" : "text-ink",
                  )}
                >
                  {promo.title}
                </h3>
                <p
                  className={cn(
                    "relative mt-3 max-w-sm text-sm leading-relaxed",
                    isInk ? "text-white/80" : "text-ink-secondary",
                  )}
                >
                  {promo.description}
                </p>

                <Button
                  as={Link}
                  to={promo.ctaTo}
                  variant={isInk ? "primary" : "secondary"}
                  className="relative mt-6"
                >
                  {promo.ctaLabel}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
