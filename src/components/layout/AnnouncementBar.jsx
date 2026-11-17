import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { announcements } from "../../mocks/storefrontMock";

const ANNOUNCEMENT_STORAGE_KEY = "magician:announcement-dismissed";
const ROTATION_INTERVAL = 5000;

function readDismissed() {
  try {
    return sessionStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(readDismissed);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  const paused = hovered || focused;

  useEffect(() => {
    if (dismissed || paused || reduceMotion || announcements.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % announcements.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(timer);
  }, [dismissed, paused, reduceMotion]);

  if (dismissed || announcements.length === 0) return null;

  const message = announcements[index] ?? announcements[0];

  const dismiss = () => {
    setDismissed(true);

    try {
      sessionStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, "1");
    } catch {
      // The dismissed state still applies for this page load.
    }
  };

  return (
    <div
      className="on-ink bg-ink text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <div className="relative mx-auto flex min-h-10 w-[90%] max-w-337.5 items-center justify-center px-10">
        <p
          className="py-1 text-center text-xs leading-5 sm:text-sm"
          aria-live={paused ? "polite" : "off"}
          aria-atomic="true"
        >
          <span>{message.text}</span>
          {message.link ? (
            <>
              {" "}
              <Link
                to={message.link.to}
                className="font-semibold text-white underline decoration-2 underline-offset-2 hover:text-brand"
              >
                {message.link.label}
              </Link>
            </>
          ) : null}
        </p>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute end-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-pill text-white transition-colors hover:bg-white/10"
        >
          <IoClose aria-hidden="true" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
