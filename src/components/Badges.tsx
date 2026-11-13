import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Database, ExternalLink, FlaskConical, Info, Sigma, X } from 'lucide-react';
import type { SourceKey } from '../data/types';
import { SOURCES, statusLabel, type DataStatus } from '../data/sources';
import horizons from '../data/snapshot/horizons.json';
import sbdb from '../data/snapshot/sbdb.json';
import { useL, useLang, useT } from '../i18n';
import { fmtDateTime } from '../lib/format';

interface SourceState {
  status: DataStatus;
  fetchedAt: string;
}

/**
 * The freshness contract shown in every badge. Values embedded in the app are
 * snapshots/cached; reference links are live; gameplay coefficients are marked
 * simplified and never disguised as NASA data.
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

const statusDot: Record<DataStatus, string> = {
  live: 'bg-good shadow-[0_0_0_3px_rgba(56,214,164,.15)]',
  cached: 'bg-royal-400 shadow-[0_0_0_3px_rgba(107,147,255,.15)]',
  snapshot: 'bg-gold-400 shadow-[0_0_0_3px_rgba(232,185,73,.15)]',
  simplified: 'bg-slate-500',
};

const statusTone: Record<DataStatus, string> = {
  live: 'text-good',
  cached: 'text-royal-300',
  snapshot: 'text-gold-300',
  simplified: 'text-slate-300',
};

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
      const width = Math.min(340, window.innerWidth - 24);
      let left = lang === 'ar' ? rect.right - width : rect.left;
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
      setCoords({ top: Math.min(rect.bottom + 8, window.innerHeight - 280), left, width });
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
        aria-label={`${l(source.name)} — ${l(statusLabel[state.status])}`}
        className={`chip max-w-full !gap-1.5 !px-2 !py-0.5 transition hover:border-white/30 ${
          simplified ? 'border-gold-400/25 bg-gold-400/[0.06]' : ''
        }`}
      >
        {simplified ? (
          <FlaskConical className="h-3 w-3 text-gold-300" aria-hidden="true" />
        ) : (
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[state.status]}`} aria-hidden="true" />
        )}
        <span className={`truncate ${simplified ? 'text-gold-200' : 'text-slate-300'}`}>
          {l(SOURCE_SHORT[sourceKey])}
        </span>
        <span className={`hidden text-[9px] font-bold sm:inline ${statusTone[state.status]}`}>
          {l(statusLabel[state.status])}
        </span>
      </button>

      {open && coords
        ? createPortal(
            <div
              className="fixed z-[90] rounded-2xl border border-white/15 bg-void-900/95 p-4 text-start shadow-2xl backdrop-blur-2xl"
              style={{ top: coords.top, left: coords.left, width: coords.width }}
              role="dialog"
              aria-label={l(source.name)}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-white">{l(source.name)}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">{source.publisher}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                  aria-label={t('إغلاق', 'Close')}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px]">
                <span className={`inline-flex items-center gap-1.5 font-bold ${statusTone[state.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot[state.status]}`} aria-hidden="true" />
                  {l(statusLabel[state.status])}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400" dir="ltr">
                  {fmtDateTime(state.fetchedAt, lang)}
                </span>
              </div>
              {source.note ? (
                <p className="mb-2 text-[11px] leading-relaxed text-slate-400">{l(source.note)}</p>
              ) : null}
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex max-w-full items-center gap-1 text-[10px] font-semibold text-royal-300 hover:text-royal-200"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate" dir="ltr">{source.url}</span>
                </a>
              ) : (
                <p className="text-[10px] font-semibold text-gold-300/90">
                  {t('ليست بيانات NASA — قيمة موازنة لعب.', 'Not NASA data — a gameplay balance value.')}
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
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {unique.map((key) => (
        <DataSourceBadge key={key} sourceKey={key} />
      ))}
    </div>
  );
}

export function FormulaBadge({ label }: { label: string }) {
  return (
    <span className="chip !gap-1 !px-2 !py-0.5 border-royal-400/20 bg-royal-500/[0.06] text-royal-200">
      <Sigma className="h-3 w-3" aria-hidden="true" />
      <span dir="ltr" className="font-latin text-[10px] font-semibold">
        {label}
      </span>
    </span>
  );
}

export function GameBadge() {
  const t = useT();
  return (
    <span className="chip !gap-1 !px-2 !py-0.5 border-gold-400/25 bg-gold-400/[0.06] !text-[10px] !text-gold-200">
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      {t('مبسّط للعبة', 'Game-simplified')}
    </span>
  );
}

export function SimplifiedNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl border border-gold-400/20 bg-gold-400/[0.05] px-3 py-2 text-[11px] leading-relaxed text-gold-100/80 ${className}`}>
      <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" aria-hidden="true" />
      <div>{children}</div>
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
    good: 'border-good/30 bg-good/10 text-good',
    warn: 'border-warn/30 bg-warn/10 text-warn',
    danger: 'border-danger/30 bg-danger/10 text-danger',
    info: 'border-royal-400/30 bg-royal-500/10 text-royal-300',
    muted: 'border-white/10 bg-white/[0.04] text-slate-300',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${map[tone]}`}>{children}</span>;
}

export function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button type="button" className="text-slate-500 hover:text-slate-300" aria-label={text}>
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full start-1/2 z-40 mb-1 hidden w-56 -translate-x-1/2 rounded-lg border border-white/15 bg-void-900 p-2 text-[10px] font-medium leading-relaxed text-slate-300 shadow-xl group-hover:block group-focus-within:block"
      >
        {text}
      </span>
    </span>
  );
}

export function SourceIcon() {
  return <Database className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />;
}
