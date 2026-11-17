import { useState } from "react";
import {
  FaCreditCard,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMobileAlt,
  FaMoneyBillWave,
  FaUniversity,
  FaWallet,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../brand/Logo";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { notify } from "../ui/toast";
import { footerContent } from "../../mocks/storefrontMock";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const PAYMENT_ICONS = {
  card: FaCreditCard,
  cash: FaMoneyBillWave,
  mobile: FaMobileAlt,
  bank: FaUniversity,
  wallet: FaWallet,
};

function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const year = new Date().getFullYear();

  // Presentational newsletter stub: validation and a toast only, no request.
  const handleSubscribe = (event) => {
    event.preventDefault();

    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setError(footerContent.newsletter.invalidMessage);
      return;
    }

    setError("");
    setEmail("");
    notify.success(footerContent.newsletter.successMessage);
  };

  return (
    <footer className="on-ink tabbar-clearance bg-ink text-white">
      <div className="mx-auto w-[90%] max-w-337.5">
        <div className="grid gap-8 border-b border-white/15 py-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-h4 font-bold text-white">
              {footerContent.newsletter.title}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              {footerContent.newsletter.description}
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            noValidate
            className="w-full lg:max-w-md lg:justify-self-end"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <Input
                id="footer-newsletter-email"
                type="email"
                name="newsletter-email"
                autoComplete="email"
                aria-label={footerContent.newsletter.inputLabel}
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={
                  error ? "footer-newsletter-error" : undefined
                }
                placeholder={footerContent.newsletter.placeholder}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                className="min-w-0 flex-1"
              />

              <Button type="submit" variant="primary" className="w-full sm:w-auto">
                {footerContent.newsletter.cta}
              </Button>
            </div>

            {error ? (
              <p
                id="footer-newsletter-error"
                role="alert"
                className="mt-2 text-caption font-medium text-brand"
              >
                {error}
              </p>
            ) : null}
          </form>
        </div>

        <div className="grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="md:col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label="MAGICIAN Online Store home"
              className="inline-flex text-white"
            >
              <Logo variant="full" className="text-white" />
            </Link>

            <p className="mt-4 max-w-sm text-sm text-white/80">
              {footerContent.brandDescription}
            </p>

            <ul
              aria-label={footerContent.socialLabel}
              className="mt-4 flex list-none items-center gap-1"
            >
              {footerContent.socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.id];
                if (!Icon) return null;

                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-pill text-white/80 transition-colors hover:bg-white/10 hover:text-brand"
                    >
                      <Icon aria-hidden="true" className="text-[18px]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {footerContent.columns.map((column) => (
            <div key={column.id}>
              <h3 className="text-sm font-bold text-white">{column.title}</h3>
              <ul className="mt-2 list-none">
                {column.links.map((link) => (
                  <li key={`${column.id}-${link.title}`}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-10 items-center text-sm text-white/80 underline-offset-4 hover:text-brand hover:underline"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wide text-white/70">
            {footerContent.paymentsLabel}
          </p>
          <ul
            aria-label={footerContent.paymentsLabel}
            className="flex list-none flex-wrap gap-4"
          >
            {footerContent.paymentMethods.map((method) => {
              const Icon = PAYMENT_ICONS[method.id];
              if (!Icon) return null;

              return (
                <li
                  key={method.id}
                  className="flex items-center gap-1.5 text-xs text-white/80"
                >
                  <Icon aria-hidden="true" className="text-[18px]" />
                  <span>{method.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/15 py-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/70">
            © {year} {footerContent.copyright}
          </p>

          <ul className="flex list-none items-center gap-4">
            {footerContent.legalLinks.map((link) => (
              <li key={link.title}>
                <a
                  href={link.href}
                  className="inline-flex min-h-10 items-center text-xs text-white/70 underline-offset-4 hover:text-brand hover:underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
