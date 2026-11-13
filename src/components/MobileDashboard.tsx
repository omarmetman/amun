import { useCallback, useEffect, useState } from 'react';
import { useL, useT } from '../i18n';
import { fmtMoney, fmtPct, marginTone } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DashboardGrid } from './Dashboard';
import { IconChevron, IconCross } from './Icons';
import { Stepper } from './Stepper';

const markTone = {
  negative: 'bg-carnelian',
  low: 'bg-amber',
  ideal: 'bg-malachite',
  high: 'bg-ochre-400',
} as const;

const textTone = {
  negative: 'text-carnelian-300',
  low: 'text-amber',
  ideal: 'text-malachite',
  high: 'text-ochre-400',
} as const;

export function MobileDashboard({ onLearn }: { onLearn: () => void }) {
  const design = useDesign();
  const t = useT();
  const l = useL();
  const [open, setOpen] = useState(false);
  const setStep = useMissionStore((state) => state.setStep);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const errors = design.blockingIssues.length;
  const warnings = design.warningIssues.length;
  const minPower = Math.min(
    design.power.modes.cruise.margin,
    design.power.modes.science.margin,
    design.power.modes.safe.margin,
  );
  const budget = design.cost.budgetM;
  const budgetMargin = budget > 0 ? design.cost.remainingM / budget : -1;

  const cells = [
    {
      key: 'mass',
      label: t('كتلة', 'Mass'),
      margin: design.mass.massMargin,
      value: fmtPct(design.mass.massMargin),
    },
    { key: 'power', label: t('طاقة', 'Power'), margin: minPower, value: fmtPct(minPower) },
    { key: 'dv', label: t('Δv', 'Δv'), margin: design.orbit.dvMargin, value: fmtPct(design.orbit.dvMargin) },
    {
      key: 'budget',
      label: t('ميزانية', 'Budget'),
      margin: budgetMargin,
      value: fmtMoney(design.cost.remainingM),
    },
  ];

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-royal-600 bg-lapis-900 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="flex w-full items-center justify-between gap-2 border-b border-royal-700 px-3 py-1 text-[11px] text-limestone-300"
        >
          <span className="inline-flex items-center gap-1.5">
            <IconChevron dir="up" className="h-3.5 w-3.5" />
            {errors > 0
              ? t(`${errors} أخطاء مانعة. افتح اللوحة`, `${errors} blocking. Open dashboard`)
              : t('لوحة الهوامش', 'Margin dashboard')}
          </span>
          <span className={errors > 0 ? 'text-carnelian-300' : 'text-malachite'}>
            {errors > 0
              ? t(`${warnings} تحذير`, `${warnings} warnings`)
              : t('جاهز', 'Ready')}
          </span>
        </button>
        <div className="grid grid-cols-4">
          {cells.map((cell) => {
            const tone = cell.margin < 0 ? 'negative' : marginTone(cell.margin);
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setOpen(true)}
                className="border-e border-royal-700 px-2 py-1.5 text-start last:border-e-0 focus-visible:bg-royal-700/30"
                aria-label={`${cell.label}: ${cell.value}`}
              >
                <span className="flex items-baseline justify-between gap-1">
                  <span className="text-[10px] text-limestone-400">{cell.label}</span>
                </span>
                <span className="relative mt-1 block h-1.5" aria-hidden="true">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-royal-500" />
                  <span className="absolute inset-y-0 bg-malachite/20" style={{ left: '25%', width: '50%' }} />
                  <span
                    className={`absolute inset-y-0 w-[2px] ${markTone[tone]}`}
                    style={{ left: `calc(${Math.max(0, Math.min(1, cell.margin / 0.4)) * 100}% - 1px)` }}
                  />
                </span>
                <span className={`mt-0.5 block truncate font-latin text-[11px] tabular-nums ${textTone[tone]}`} dir="ltr">
                  {cell.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label={t('إغلاق اللوحة', 'Close dashboard')}
            onClick={close}
            className="absolute inset-0 bg-lapis-950/80"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label={t('لوحة القيادة', 'Dashboard')}
            className="sheet-open absolute inset-x-0 bottom-0 max-h-[84vh] overflow-y-auto rounded-t-window border-t border-royal-600 bg-lapis-900"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-royal-700 bg-lapis-900 px-4 py-3">
              <div>
                <h2 className="font-display text-lg leading-tight">{t('لوحة الهوامش', 'Margin dashboard')}</h2>
                <p className="text-xs text-limestone-400">
                  {l(design.target.name)}
                  <span className="mx-1.5 text-royal-500">/</span>
                  {l(design.missionType.short)}
                </p>
              </div>
              <button type="button" onClick={close} className="btn-icon" aria-label={t('إغلاق', 'Close')}>
                <IconCross className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 py-3">
              <DashboardGrid onJump={close} />

              <p className="margin-note mt-3">
                {t(
                  'النطاق الأخضر هو الهامش الأمثل بين 10% و30%. العلامة اليمنى هي الحد الأقصى.',
                  'The green band is the 10–30% optimum. The right tick is the ceiling.',
                )}
              </p>

              <button
                type="button"
                onClick={() => {
                  close();
                  onLearn();
                }}
                className="mt-3 w-full border border-royal-600 px-3 py-2 text-xs text-limestone-200"
              >
                {t('افتح لوحة تعلّم', 'Open the Learn panel')}
              </button>

              <div className="my-4 divider" />
              <div className="mb-1 flex items-center justify-between">
                <span className="eyebrow">{t('خطوات المهمة', 'Mission flow')}</span>
                <span className={errors > 0 ? 'text-xs text-carnelian-300' : 'text-xs text-malachite'}>
                  {errors > 0
                    ? t(`${errors} أخطاء، ${warnings} تحذير`, `${errors} errors, ${warnings} warnings`)
                    : t('جاهز للمحاكاة', 'Ready to simulate')}
                </span>
              </div>
              <Stepper onNavigate={close} />

              <button
                type="button"
                onClick={() => {
                  close();
                  setStep(10);
                }}
                className="btn-primary mt-3 w-full text-sm"
              >
                {t('إلى المحاكاة', 'Go to simulation')}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
