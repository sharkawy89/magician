import toast from "react-hot-toast";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoInformationCircle,
} from "react-icons/io5";
import { cn } from "./cn";

const TONES = {
  success: { Icon: IoCheckmarkCircle, color: "text-success" },
  error: { Icon: IoAlertCircle, color: "text-danger" },
  info: { Icon: IoInformationCircle, color: "text-info" },
};

function show(tone, message, options = {}) {
  const { Icon, color } = TONES[tone];
  const method = tone === "info" ? toast : toast[tone];

  return method(<span className="text-sm text-ink">{message}</span>, {
    duration: 3000,
    icon: (
      <Icon
        aria-hidden="true"
        className={cn("text-[18px]", color)}
      />
    ),
    ...options,
  });
}

export const notify = {
  success: (message, options) => show("success", message, options),
  error: (message, options) => show("error", message, options),
  info: (message, options) => show("info", message, options),
};
