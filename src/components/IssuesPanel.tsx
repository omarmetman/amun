import { useMemo, useState } from 'react';
import type { Severity } from '../data/types';
import { useL, useT } from '../i18n';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { IconAlert, IconCheck, IconChevron } from './Icons';

const mark: Record<Severity, string> = {
  error: 'border-carnelian bg-carnelian',
  warning: 'rotate-45 border-amber',
  info: 'border-royal-300',
};

const tone: Record<Severity, string> = {
  error: 'text-carnelian-300 border-carnelian',
  warning: 'text-amber border-amber',
  info: 'text-royal-300 border-royal-400',
};

const severityLabel: Record<Severity, { ar: string; en: string }> = {
  error: { ar: 'خطأ مانع', en: 'Blocking error' },
  warning: { ar: 'تحذير', en: 'Warning' },
  info: { ar: 'معلومة', en: 'Info' },
};

export function IssuesPanel() {
  const design = useDesign();
  const t = useT();
  const l = useL();
  const setStep = useMissionStore((state) => state.setStep);
  const [open, setOpen] = useState<boolean | null>(null);

  const groups = useMemo(
    () => ({
      error: design.issues.filter((issue) => issue.severity === 'error'),
      warning: design.issues.filter((issue) => issue.severity === 'warning'),
      info: design.issues.filter((issue) => issue.severity === 'info'),
    }),
    [design.issues],
  );

  const total = design.issues.length;
  const hasErrors = groups.error.length > 0;
  const expanded = open ?? hasErrors;

  if (total === 0) {
    return (
      <div className="mb-4 flex items-baseline gap-2 border-s-2 border-malachite py-1 ps-3 text-xs text-malachite">
        <IconCheck className="h-4 w-4 shrink-0 self-center" />
        {t('التصميم سليم: لا توجد أخطاء أو تحذيرات.', 'Design is clear: no errors or warnings.')}
      </div>
    );
  }

  return (
    <section
      className={`mb-4 border-s-2 ${hasErrors ? 'border-carnelian' : 'border-amber'}`}
      aria-label={t('مركز التحقق', 'Validation center')}
    >
      <button
        type="button"
        onClick={() => setOpen(!expanded)}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-baseline justify-between gap-2 px-3 py-2 text-start"
      >
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
          <span className={`inline-flex items-center gap-1.5 ${hasErrors ? 'text-carnelian-300' : 'text-amber'}`}>
            <IconAlert className="h-4 w-4" />
            {t('مركز التحقق', 'Validation')}
          </span>
          {groups.error.length > 0 ? (
            <span className="text-carnelian-300">
              {groups.error.length} {t('خطأ مانع', 'blocking')}
            </span>
          ) : null}
          {groups.warning.length > 0 ? (
            <span className="text-amber">
              {groups.warning.length} {t('تحذير', 'warning')}
            </span>
          ) : null}
          {groups.info.length > 0 ? (
            <span className="text-royal-300">
              {groups.info.length} {t('معلومة', 'info')}
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-limestone-400">
          {expanded ? t('إخفاء', 'Hide') : t('عرض التفاصيل', 'Show details')}
          <IconChevron dir={expanded ? 'up' : 'down'} className="h-3.5 w-3.5" />
        </span>
      </button>
      {expanded ? (
        <div className="border-t border-royal-700 px-3 py-2">
          {design.issues.map((issue) => (
            <div
              key={`${issue.code}-${issue.step}-${issue.title.en}`}
              className={`grid grid-cols-[18px_minmax(0,1fr)_auto] items-start gap-2 border-b border-royal-700 py-2.5 last:border-0`}
            >
              <span className="flex h-[18px] items-center justify-center" aria-hidden="true">
                <span className={`h-1.5 w-1.5 border ${mark[issue.severity]}`} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className={`text-xs ${tone[issue.severity].split(' ')[0]}`}>{l(issue.title)}</span>
                  <span className="text-[10px] text-limestone-400">{l(severityLabel[issue.severity])}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-limestone-300">{l(issue.message)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(issue.step);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex min-h-[24px] shrink-0 items-center border-b border-royal-400 pb-px text-[11px] text-limestone-200 hover:text-limestone-50"
              >
                {t('أصلح', 'Fix')}
                <span className="ms-1 font-latin tabular-nums text-limestone-400">{String(issue.step).padStart(2, '0')}</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
