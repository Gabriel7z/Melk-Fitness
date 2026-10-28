export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6">
      <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
        {eyebrow}
      </p>
      <h1 className="font-heading mt-1 text-4xl leading-[1.05] text-balance md:text-5xl">
        {title}
      </h1>
      {children ? (
        <div className="mt-3 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
          {children}
        </div>
      ) : null}
    </header>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mt-10 mb-3">
      <h2 className="font-heading text-3xl leading-tight">{children}</h2>
      {hint ? (
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
