import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { homeDeal } from "../../mocks/storefrontMock";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

/**
 * Deterministic, UI-only deadline: the upcoming Sunday at 23:59:59 local time.
 * No network calls and no random values, so every render in the same moment
 * shows the same target.
 */
function getDealEndTime() {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7;
  const end = new Date(now);
  end.setDate(now.getDate() + daysUntilSunday);
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

function getRemaining(endTime) {
  const remaining = Math.max(0, endTime - Date.now());
  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((remaining % MINUTE_MS) / 1000);
  return { remaining, days, hours, minutes, seconds };
}

function CountdownBox({ label, value }) {
  return (
    <div className="flex min-w-14 flex-col items-center rounded-lg bg-brand px-2 py-2 text-ink">
      <span
        aria-hidden="true"
        className="text-h5 font-bold tabular-nums leading-none"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function DealStrip() {
  const [endTime, setEndTime] = useState(getDealEndTime);
  const [remaining, setRemaining] = useState(() => getRemaining(endTime));

  useEffect(() => {
    const tick = () => {
      const next = getRemaining(endTime);

      if (next.remaining <= 0) {
        const rolledEnd = getDealEndTime();
        setEndTime(rolledEnd);
        setRemaining(getRemaining(rolledEnd));
        return;
      }

      setRemaining(next);
    };

    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endTime]);

  const units = [
    { key: "days", label: "Days", value: remaining.days },
    { key: "hours", label: "Hrs", value: remaining.hours },
    { key: "minutes", label: "Min", value: remaining.minutes },
    { key: "seconds", label: "Sec", value: remaining.seconds },
  ];

  return (
    <section className="mt-12" aria-labelledby="home-deal-heading">
      <div className="mx-auto w-[90%] max-w-337.5">
        <div className="on-ink relative overflow-hidden rounded-xl bg-ink px-5 py-7 text-white sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden [contain:paint]"
          >
            <span className="absolute -end-16 -top-20 h-56 w-56 rounded-pill bg-brand/10" />
          </span>

          <div className="relative max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
              {homeDeal.eyebrow}
            </p>
            <h2
              id="home-deal-heading"
              className="mt-2 text-h3 font-bold text-white"
            >
              {homeDeal.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {homeDeal.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-pill bg-brand px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink">
                {homeDeal.codeLabel}: {homeDeal.code}
              </span>
              <Button
                as={Link}
                to={homeDeal.ctaTo}
                variant="primary"
                size="md"
                className="min-w-0 max-w-full whitespace-normal"
                rightIcon={<FiArrowRight aria-hidden="true" />}
              >
                {homeDeal.ctaLabel}
              </Button>
            </div>
          </div>

          <div className="relative mt-7 lg:mt-0 lg:shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              {homeDeal.endsLabel}
            </p>
            <div
              role="timer"
              aria-live="off"
              aria-label={`Deal ends in ${remaining.days} days, ${remaining.hours} hours and ${remaining.minutes} minutes`}
              className="mt-2 flex flex-wrap gap-2"
            >
              {units.map((unit) => (
                <CountdownBox
                  key={unit.key}
                  label={unit.label}
                  value={unit.value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DealStrip;
