import type { ReactNode } from 'react';

/** Isolates a Latin, numeric or technical fragment inside Arabic text. */
export function Ltr({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}

export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  action,
}: {
  number?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-royal-700 pb-4">
      <div className="flex min-w-0 items-start gap-3">
        {number ? (
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-royal-600 font-latin text-[11px] tabular-nums text-ochre-300">
            {number}
          </span>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? <div className="text-[11px] font-medium text-limestone-400">{eyebrow}</div> : null}
          <h2 className="mt-1 font-display text-xl leading-tight text-limestone-50 sm:text-2xl">{title}</h2>
          {description ? <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-limestone-300">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Stat({
  value,
  label,
  tone = 'ochre',
}: {
  value: ReactNode;
  label: ReactNode;
  tone?: 'ochre' | 'malachite' | 'royal';
}) {
  const color = tone === 'malachite' ? 'text-malachite' : tone === 'royal' ? 'text-royal-300' : 'text-ochre-300';
  return (
    <div className="min-w-0 px-3 py-3">
      <div className={`font-latin text-2xl font-semibold tabular-nums ${color}`} dir="ltr">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] leading-snug text-limestone-300">{label}</div>
    </div>
  );
}

export function PageFooter({ start, end }: { start: ReactNode; end?: ReactNode }) {
  return (
    <footer className="mt-10 flex flex-col gap-4 border-t border-royal-700 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">{start}</div>
      {end ? <div className="text-[11px] leading-relaxed text-limestone-400">{end}</div> : null}
    </footer>
  );
}
