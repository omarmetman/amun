import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { SourceKey } from '../data/types';
import { SOURCES, statusLabel, type DataStatus } from '../data/sources';
import horizons from '../data/snapshot/horizons.json';
import sbdb from '../data/snapshot/sbdb.json';
import { useL, useLang, useT } from '../i18n';
import { fmtDateTime } from '../lib/format';
import { IconCross } from './Icons';

interface SourceState {
  status: DataStatus;
  fetchedAt: string;
}

/**
 * The freshness contract shown in every footnote. Values embedded in the app
 * are snapshots or cached; reference links are live; gameplay coefficients are
 * marked simplified and never disguised as NASA data.
 */
export const SOURCE_STATE: Record<SourceKey, SourceState> = {
  horizons: { status: 'snapshot', fetchedAt: horizons.fetchedAt },
  sbdb: { status: 'snapshot', fetchedAt: sbdb.fetchedAt },
  nasaImages: { status: 'cached', fetchedAt: '2026-11-12T07:24:00Z' },
  nasaFact: { status: 'cached', fetchedAt: '2026-11-12T07:25:00Z' },
  ntrs: { status: 'live', fetchedAt: '2026-11-12T07:26:00Z' },
  basics: { status: 'live', fetchedAt: '2026-11-12T07:26:00Z' },
  dsn: { status: 'cached', fetchedAt: '2026-11-12T07:27:00Z' },
  launchApprox: { status: 'simplified', fetchedAt: '2026-11-12T07:28:00Z' },
  game: { status: 'simplified', fetchedAt: '2026-11-12T07:28:00Z' },
};

const SOURCE_SHORT: Record<SourceKey, { ar: string; en: string }> = {
  horizons: { ar: 'Horizons', en: 'Horizons' },
  sbdb: { ar: 'SBDB', en: 'SBDB' },
  ntrs: { ar: 'NTRS', en: 'NTRS' },
  nasaImages: { ar: 'صور NASA', en: 'NASA Images' },
  basics: { ar: 'أساسيات الطيران', en: 'Basics' },
  nasaFact: { ar: 'Fact Sheet', en: 'Fact Sheet' },
  dsn: { ar: 'DSN', en: 'DSN' },
  launchApprox: { ar: 'أداء إطلاق', en: 'Launch data' },
  game: { ar: 'مبسّط', en: 'Game value' },
};

const statusTone: Record<DataStatus, string> = {
  live: 'text-malachite',
  cached: 'text-royal-300',
  snapshot: 'text-ochre-300',
  simplified: 'text-limestone-300',
};

/** Solid diamond: live. Half-filled: cached. Empty: snapshot. */
function SourceDiamond({ status }: { status: DataStatus }) {
  if (status === 'simplified') return null;
  return (
    <svg viewBox="0 0 8 8" className="h-2 w-2 shrink-0" aria-hidden="true">
      <path d="M4 0 8 4 4 8 0 4Z" fill="none" stroke="currentColor" strokeWidth="1" />
      {status === 'live' ? <path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" /> : null}
      {status === 'cached' ? <path d="M4 0 8 4 4 8Z" fill="currentColor" /> : null}
    </svg>
  );
}

export function DataSourceBadge({ sourceKey }: { sourceKey: SourceKey }) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const source = SOURCES[sourceKey];
  const state = SOURCE_STATE[sourceKey];
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (event: MouseEvent) => {
    event.stopPropagation();
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const width = Math.min(320, window.innerWidth - 24);
      let left = lang === 'ar' ? rect.right - width : rect.left;
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
      setCoords({ top: Math.min(rect.bottom + 6, window.innerHeight - 260), left, width });
    }
    setOpen((value) => !value);
  };

  const simplified = state.status === 'simplified';

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={`${l(source.name)}: ${l(statusLabel[state.status])}`}
        className={`inline-flex max-w-full items-center gap-1 pb-px text-[11px] ${
          simplified
            ? 'border-b border-dashed border-limestone-400 text-limestone-300'
            : 'border-b border-limestone-300 text-limestone-100'
        }`}
      >
        <span className="truncate">{l(SOURCE_SHORT[sourceKey])}</span>
        <SourceDiamond status={state.status} />
      </button>

      {open && coords
        ? createPortal(
            <div
              className="fixed z-[90] rounded-window border border-royal-500 bg-lapis-900 p-4 text-start"
              style={{ top: coords.top, left: coords.left, width: coords.width }}
              role="dialog"
              aria-label={l(source.name)}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-sm text-limestone-50">{l(source.name)}</div>
                  <div className="mt-0.5 text-[10px] text-limestone-400">{source.publisher}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 text-limestone-400 hover:text-limestone-50"
                  aria-label={t('إغلاق', 'Close')}
                >
                  <IconCross className="h-4 w-4" />
                </button>
              </div>
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11px]">
                <span className={`inline-flex items-center gap-1 ${statusTone[state.status]}`}>
                  <SourceDiamond status={state.status} />
                  {l(statusLabel[state.status])}
                </span>
                <span className="text-limestone-400">{t('آخر جلب', 'fetched')}</span>
                <span className="font-latin tabular-nums text-limestone-300" dir="ltr">
                  {fmtDateTime(state.fetchedAt, lang)}
                </span>
              </div>
              {source.note ? (
                <p className="mb-2 text-xs leading-relaxed text-limestone-300">{l(source.note)}</p>
              ) : null}
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex max-w-full items-baseline gap-1 border-b border-royal-400 pb-px text-[11px] text-royal-300 hover:text-limestone-50"
                >
                  <span className="truncate" dir="ltr">
                    {source.url}
                  </span>
                </a>
              ) : (
                <p className="text-[11px] text-ochre-300">
                  {t('ليست بيانات NASA: قيمة موازنة لعب.', 'Not NASA data: a gameplay balance value.')}
                </p>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function DataSourceBadges({
  sources,
  className = '',
}: {
  sources: SourceKey[];
  className?: string;
}) {
  const unique = [...new Set(sources)];
  return (
    <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
      {unique.map((key) => (
        <DataSourceBadge key={key} sourceKey={key} />
      ))}
    </div>
  );
}

export function FormulaBadge({ label }: { label: string }) {
  return (
    <span className="font-latin text-[11px] tabular-nums text-limestone-300" dir="ltr">
      [ {label} ]
    </span>
  );
}

export function GameBadge() {
  const t = useT();
  return (
    <span className="border-b border-dashed border-limestone-400 pb-px text-[11px] text-limestone-300">
      {t('مبسّط للعبة', 'Game-simplified')}
    </span>
  );
}

export function SimplifiedNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-s-2 border-dashed border-limestone-400 py-1 ps-3 text-xs leading-relaxed text-limestone-300 ${className}`}>
      {children}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: 'good' | 'warn' | 'danger' | 'info' | 'muted';
  children: ReactNode;
}) {
  const map = {
    good: 'text-malachite',
    warn: 'text-amber',
    danger: 'text-carnelian-300',
    info: 'text-royal-300',
    muted: 'text-limestone-300',
  };
  const mark = {
    good: 'border-malachite bg-malachite',
    warn: 'rotate-45 border-amber',
    danger: 'border-carnelian bg-carnelian',
    info: 'border-royal-300',
    muted: 'border-limestone-400',
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] ${map[tone]}`}>
      <span className={`h-1.5 w-1.5 shrink-0 border ${mark}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button type="button" className="text-limestone-400 hover:text-limestone-100" aria-label={text}>
        <span aria-hidden="true" className="text-[11px]">?</span>
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full start-1/2 z-40 mb-1 hidden w-56 -translate-x-1/2 border border-royal-600 bg-lapis-900 p-2 text-[11px] leading-relaxed text-limestone-200 group-hover:block group-focus-within:block"
      >
        {text}
      </span>
    </span>
  );
}

/** The key that explains source marks, shown once in the Learn panel. */
export function SourceLegend() {
  const t = useT();
  return (
    <dl className="space-y-2 text-xs text-limestone-300">
      <div className="flex items-baseline gap-2">
        <dt className="inline-flex shrink-0 items-center gap-1 border-b border-limestone-300 pb-px text-limestone-100">
          {t('قيمة NASA', 'NASA value')}
          <svg viewBox="0 0 8 8" className="h-2 w-2" aria-hidden="true">
            <path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" />
          </svg>
        </dt>
        <dd>{t('حد صلب وعلامة ممتلئة: قيمة مباشرة.', 'Solid rule and filled diamond: live value.')}</dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="inline-flex shrink-0 items-center gap-1 border-b border-limestone-300 pb-px text-limestone-100">
          {t('مخزّن', 'Cached')}
          <svg viewBox="0 0 8 8" className="h-2 w-2" aria-hidden="true">
            <path d="M4 0 8 4 4 8 0 4Z" fill="none" stroke="currentColor" />
            <path d="M4 0 8 4 4 8Z" fill="currentColor" />
          </svg>
        </dt>
        <dd>{t('نصف ممتلئة: نسخة محفوظة من المصدر.', 'Half-filled: a saved copy of the source.')}</dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="inline-flex shrink-0 items-center gap-1 border-b border-limestone-300 pb-px text-limestone-100">
          {t('لقطة', 'Snapshot')}
          <svg viewBox="0 0 8 8" className="h-2 w-2" aria-hidden="true">
            <path d="M4 0 8 4 4 8 0 4Z" fill="none" stroke="currentColor" />
          </svg>
        </dt>
        <dd>{t('مفرغة: لقطة في تاريخ محدد.', 'Empty: a snapshot at a fixed date.')}</dd>
      </div>
      <div className="flex items-baseline gap-2">
        <dt className="shrink-0 border-b border-dashed border-limestone-400 pb-px text-limestone-300">
          {t('قيمة اللعبة', 'Game value')}
        </dt>
        <dd>{t('خط منقط: معامل موازنة، لا بيانات NASA.', 'Dashed rule: a balance coefficient, not NASA data.')}</dd>
      </div>
    </dl>
  );
}

export function SourceIcon() {
  return (
    <svg viewBox="0 0 8 8" className="h-2 w-2 text-limestone-400" aria-hidden="true">
      <path d="M4 0 8 4 4 8 0 4Z" fill="none" stroke="currentColor" />
    </svg>
  );
}
