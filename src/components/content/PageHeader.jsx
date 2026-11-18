function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="border-b border-border pt-8 pb-6 sm:pt-10 sm:pb-8">
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-secondary">
          <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-brand" />
          {eyebrow}
        </p>
      ) : null}

      <h1 className="mt-2 max-w-3xl break-words text-h4 font-bold leading-tight text-ink sm:text-h2">
        {title}
      </h1>

      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-secondary">
          {description}
        </p>
      ) : null}

      {children ? <div className="mt-5">{children}</div> : null}
    </header>
  );
}

export default PageHeader;
