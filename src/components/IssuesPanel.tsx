import { useMemo, useState } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, ChevronDown, Info, Wrench } from 'lucide-react';
import type { Severity } from '../data/types';
import { useL, useT } from '../i18n';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';

const icons: Record<Severity, typeof AlertOctagon> = {
  error: AlertOctagon,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<Severity, string> = {
  error: 'border-danger/25 bg-danger/[0.06] text-danger',
  warning: 'border-warn/20 bg-warn/[0.05] text-warn',
  info: 'border-royal-400/20 bg-royal-500/[0.05] text-royal-300',
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
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-good/20 bg-good/[0.05] px-3 py-2.5 text-xs font-semibold text-good">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        {t('التصميم سليم: لا توجد أخطاء أو تحذيرات.', 'Design is clear: no errors or warnings.')}
      </div>
    );
  }

  return (
    <section className={`mb-4 overflow-hidden rounded-xl border ${hasErrors ? 'border-danger/25 bg-danger/[0.035]' : 'border-warn/20 bg-warn/[0.03]'}`} aria-label={t('مركز التحقق', 'Validation center')}>
      <button
        type="button"
        onClick={() => setOpen(!expanded)}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-start"
      >
        <span className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <AlertTriangle className={`h-4 w-4 ${hasErrors ? 'text-danger' : 'text-warn'}`} aria-hidden="true" />
          <span className="text-white">{t('مركز التحقق', 'Validation center')}</span>
          {groups.error.length > 0 ? (
            <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] text-danger">
              {groups.error.length} {t('خطأ مانع', 'blocking')}
            </span>
          ) : null}
          {groups.warning.length > 0 ? (
            <span className="rounded-full bg-warn/10 px-2 py-0.5 text-[10px] text-warn">
              {groups.warning.length} {t('تحذير', 'warning')}
            </span>
          ) : null}
          {groups.info.length > 0 ? (
            <span className="rounded-full bg-royal-500/10 px-2 py-0.5 text-[10px] text-royal-300">
              {groups.info.length} {t('معلومة', 'info')}
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
          {expanded ? t('إخفاء', 'Hide') : t('عرض التفاصيل', 'Show details')}
          <ChevronDown className={`h-3.5 w-3.5 transition ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </span>
      </button>
      {expanded ? (
        <div className="space-y-2 border-t border-white/[0.06] p-2.5">
          {design.issues.map((issue) => {
            const Icon = icons[issue.severity];
            return (
              <div key={`${issue.code}-${issue.step}-${issue.title.en}`} className={`warn-row ${styles[issue.severity]}`}>
                <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold">{l(issue.title)}</span>
                    <span className="rounded bg-black/20 px-1.5 py-0.5 text-[9px] font-semibold opacity-70">
                      {l(severityLabel[issue.severity])}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-300/90">{l(issue.message)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep(issue.step);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-bold text-white transition hover:border-white/25 hover:bg-white/10"
                >
                  <Wrench className="h-3 w-3" aria-hidden="true" />
                  {t('أصلح', 'Fix')}
                  <span className="num opacity-60">0{issue.step}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
