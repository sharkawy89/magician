import { useEffect, useId, useRef, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import {
  FiChevronDown,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import PageHeader from "../../components/content/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { cn } from "../../components/ui/cn";
import { notify } from "../../components/ui/toast";
import { contactContent } from "../../mocks/contentMock";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

const CHANNEL_ICONS = {
  mail: FiMail,
  phone: FiPhone,
  chat: FiMessageCircle,
};

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const FIELD_BASE =
  "w-full rounded-lg border bg-surface text-body text-ink transition-colors duration-150 placeholder:text-muted focus-visible:border-ink";

// There is no shared textarea primitive yet, so this mirrors Input's label,
// border and error wiring rather than introducing a one-off style.
function MessageField({ id, label, error, required, inputRef, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>

      <textarea
        {...props}
        ref={inputRef}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          FIELD_BASE,
          "min-h-32 resize-y px-3.5 py-3",
          error ? "border-danger" : "border-border-strong",
        )}
      />

      {error ? (
        <p id={errorId} className="text-caption font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Contact() {
  const { form, subjects, channels, studio, social, faq } = contactContent;
  const location = useLocation();
  const fieldId = useId();
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const ids = {
    name: `${fieldId}-name`,
    email: `${fieldId}-email`,
    subject: `${fieldId}-subject`,
    message: `${fieldId}-message`,
  };

  // Footer help links deep-link into the FAQ. ScrollToTop already reset the
  // page on navigation, so wait a frame before scrolling to the target.
  useEffect(() => {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return undefined;

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (!target) return;

      if (target.tagName === "DETAILS") {
        target.open = true;
      }

      target.scrollIntoView({ block: "start" });
      target.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = form.errors.name;
    if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = form.errors.email;
    }
    if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
      nextErrors.message = form.errors.message;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = ["name", "email", "message"].find(
        (field) => nextErrors[field],
      );
      const refs = {
        name: nameRef,
        email: emailRef,
        message: messageRef,
      };
      refs[firstInvalid]?.current?.focus();
      return;
    }

    // Demo-only form: validate, confirm, reset. Nothing leaves the browser.
    notify.success(form.successMessage);
    setValues({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  return (
    <PageTransition>
      <div className="pb-16">
        <div className="mx-auto w-[90%] max-w-337.5">
          <PageHeader
            eyebrow={contactContent.eyebrow}
            title={contactContent.title}
            description={contactContent.description}
          />
        </div>

        <div className="mx-auto mt-8 grid w-[90%] max-w-337.5 gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <section
            aria-labelledby="contact-form-heading"
            className="rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8"
          >
            <h2
              id="contact-form-heading"
              className="text-h4 font-bold text-ink"
            >
              {form.heading}
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">{form.note}</p>

            <form
              noValidate
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id={ids.name}
                  label={form.nameLabel}
                  placeholder={form.namePlaceholder}
                  value={values.name}
                  onChange={updateField("name")}
                  error={errors.name}
                  inputRef={nameRef}
                  autoComplete="name"
                  required
                />

                <Input
                  id={ids.email}
                  type="email"
                  label={form.emailLabel}
                  placeholder={form.emailPlaceholder}
                  value={values.email}
                  onChange={updateField("email")}
                  error={errors.email}
                  inputRef={emailRef}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </div>

              <Select
                id={ids.subject}
                label={form.subjectLabel}
                placeholder="Choose a topic"
                options={subjects}
                value={values.subject}
                onChange={updateField("subject")}
              />

              <MessageField
                id={ids.message}
                label={form.messageLabel}
                placeholder={form.messagePlaceholder}
                value={values.message}
                onChange={updateField("message")}
                error={errors.message}
                inputRef={messageRef}
                rows={5}
                required
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" variant="primary">
                  {form.submit}
                </Button>
                <p className="text-xs text-ink-secondary">{form.demoNote}</p>
              </div>
            </form>
          </section>

          <div className="flex flex-col gap-4">
            <section
              aria-labelledby="contact-channels-heading"
              className="rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <h2
                id="contact-channels-heading"
                className="text-h5 font-bold text-ink"
              >
                Other ways to reach us
              </h2>

              <ul className="mt-4 list-none divide-y divide-border">
                {channels.map((channel) => {
                  const Icon = CHANNEL_ICONS[channel.icon] ?? FiMail;
                  const content = (
                    <>
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-soft text-[18px] text-ink"
                      >
                        <Icon />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                          {channel.label}
                        </span>
                        <span className="block break-words text-sm font-semibold text-ink">
                          {channel.value}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={channel.id}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="-mx-2 flex min-h-14 items-center gap-3 rounded-lg px-2 py-3 hover:bg-surface-subtle"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex min-h-14 items-center gap-3 py-3">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 text-xs leading-relaxed text-ink-secondary">
                {contactContent.responseNote}
              </p>
            </section>

            <section
              aria-labelledby="contact-studio-heading"
              className="rounded-xl border border-border bg-surface-subtle p-6"
            >
              <h2
                id="contact-studio-heading"
                className="text-h5 font-bold text-ink"
              >
                {studio.heading}
              </h2>

              <p className="mt-3 flex items-start gap-2 text-sm text-ink-secondary">
                <FiMapPin
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-ink"
                />
                <span>
                  <span className="block font-semibold text-ink">
                    {studio.name}
                  </span>
                  {studio.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>

              <p className="mt-3 flex items-start gap-2 text-sm text-ink-secondary">
                <FiClock
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-ink"
                />
                {studio.hours}
              </p>
            </section>

            <section
              aria-labelledby="contact-social-heading"
              className="rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <h2
                id="contact-social-heading"
                className="text-h5 font-bold text-ink"
              >
                {contactContent.socialHeading}
              </h2>

              <ul className="mt-3 flex list-none flex-wrap gap-2">
                {social.map((item) => {
                  const Icon = SOCIAL_ICONS[item.id] ?? FiMail;

                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        aria-label={item.label}
                        className="flex h-11 w-11 items-center justify-center rounded-pill border border-border bg-surface text-[18px] text-ink transition-colors hover:border-ink hover:bg-surface-subtle"
                      >
                        <Icon aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>

        <section
          id="faq"
          aria-labelledby="contact-faq-heading"
          className="mx-auto mt-14 w-[90%] max-w-337.5 scroll-mt-28"
        >
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <h2
                id="contact-faq-heading"
                className="text-h4 font-bold text-ink sm:text-h3"
              >
                {faq.heading}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
                {faq.description}
              </p>
            </div>

            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {faq.items.map((item) => (
                <details
                  key={item.id}
                  id={item.id}
                  tabIndex={-1}
                  className="group scroll-mt-28"
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <FiChevronDown
                      aria-hidden="true"
                      className="shrink-0 text-[18px] text-ink-secondary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-secondary">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default Contact;
