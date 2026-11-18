import {
  FiHeadphones,
  FiRefreshCw,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { homeTrustItems } from "../../mocks/storefrontMock";

const ICONS = {
  truck: FiTruck,
  returns: FiRefreshCw,
  shield: FiShield,
  support: FiHeadphones,
};

function TrustStrip() {
  return (
    <section aria-labelledby="home-trust-heading" className="mt-12">
      <div className="mx-auto w-[90%] max-w-337.5">
        <h2 id="home-trust-heading" className="sr-only">
          Why shop with MAGICIAN
        </h2>

        <ul className="grid list-none grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border max-[12rem]:grid-cols-1 md:grid-cols-4">
          {homeTrustItems.map((item) => {
            const Icon = ICONS[item.icon] ?? FiShield;

            return (
              <li
                key={item.id}
                className="flex flex-col gap-2 bg-surface p-4 sm:p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-brand-soft text-ink">
                  <Icon aria-hidden="true" className="text-[18px]" />
                </span>
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="break-words text-xs leading-relaxed text-ink-secondary">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TrustStrip;
