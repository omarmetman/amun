import { useEffect, useState } from 'react';
import { ChevronUp, LayoutDashboard, X } from 'lucide-react';
import { useL, useT } from '../i18n';
import { fmtMoney, fmtPct, marginTone, toneText } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DashboardGrid } from './Dashboard';
import { Stepper } from './Stepper';

export function MobileDashboard({ onLearn }: { onLearn: () => void }) {
  const design = useDesign();
  const t = useT();
  const l = useL();
  const [open, setOpen] = useState(false);
  const setStep = useMissionStore((state) => state.setStep);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const errors = design.blockingIssues.length;
  const warnings = design.warningIssues.length;
  const minPower = Math.min(
    design.power.modes.cruise.margin,
    design.power.modes.science.margin,
    design.power.modes.safe.margin,
  );
  const used = design.cost.budgetM > 0 ? design.cost.totalM / design.cost.budgetM : 1;

  const cells = [
    { key: 'mass', label: t('كتلة', 'Mass'), value: fmtPct(design.mass.massMargin), tone: marginTone(design.mass.massMargin) },
    { key: 'power', label: t('طاقة', 'Power'), value: fmtPct(minPower), tone: marginTone(minPower) },
    { key: 'dv', label: t('Δv', 'Δv'), value: fmtPct(design.orbit.dvMargin), tone: marginTone(design.orbit.dvMargin) },
    {
      key: 'budget',
      label: t('ميزانية', 'Budget'),
      value: fmtMoney(design.cost.remainingM),
      tone: used > 1 ? ('negative' as const) : used > 0.92 ? ('low' as const) : ('ideal' as const),
    },
  ];

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="border-t border-white/10 bg-void-950/92 backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label={t('افتح لوحة القيادة', 'Open dashboard')}
            className="flex w-full items-center justify-center gap-1.5 border-b border-white/[0.05] py-1.5 text-[9px] font-semibold text-slate-500"
          >
            <ChevronUp className="h-3 w-3" aria-hidden="true" />
            {errors > 0
              ? t(`${errors} أخطاء مانعة · افتح اللوحة`, `${errors} blocking · open dashboard`)
              : t('لوحة القيادة الحية', 'Live mission dashboard')}
          </button>
          <div className="grid grid-cols-4 gap-1 px-2 pb-2">
            {cells.map((cell) => (
              <button
                key={cell.key}
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-lg px-1 py-1.5 text-center transition active:bg-white/[0.06]"
              >
                <div className="mb-0.5 flex items-center justify-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    cell.tone === 'negative' ? 'bg-danger' : cell.tone === 'low' ? 'bg-warn' : cell.tone === 'ideal' ? 'bg-good' : 'bg-gold-400'
                  }`} />
                  <span className="text-[9px] font-semibold text-slate-500">{cell.label}</span>
                </div>
                <div className={`font-latin text-[12px] font-extrabold tabular-nums ${toneText[cell.tone]}`} dir="ltr">
                  {cell.value}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label={t('إغلاق اللوحة', 'Close dashboard')}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-void-950/75 backdrop-blur-sm"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label={t('لوحة القيادة', 'Dashboard')}
            className="absolute inset-x-0 bottom-0 max-h-[84vh] overflow-y-auto rounded-t-3xl border-t border-white/15 bg-void-900/98 shadow-2xl"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-void-900/98 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-royal-500/15 text-royal-300">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-sm font-bold text-white">{t('لوحة القيادة', 'Mission dashboard')}</div>
                  <div className="text-[10px] text-slate-500">
                    {l(design.target.name)} · {l(design.missionType.short)}
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="btn-icon !h-8 !w-8" aria-label={t('إغلاق', 'Close')}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-4 py-4">
              <DashboardGrid onJump={() => setOpen(false)} />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onLearn();
                }}
                className="mt-2 w-full rounded-xl border border-royal-400/20 bg-royal-500/[0.06] px-3 py-2 text-[11px] font-bold text-royal-200"
              >
                {t('افتح لوحة تعلّم', 'Open the Learn panel')}
              </button>

              <div className="my-4 divider" />
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="eyebrow">{t('خطوات المهمة', 'Mission flow')}</span>
                <span className={errors > 0 ? 'text-[10px] font-bold text-danger' : 'text-[10px] font-bold text-good'}>
                  {errors > 0
                    ? t(`${errors} أخطاء · ${warnings} تحذير`, `${errors} errors · ${warnings} warnings`)
                    : t('جاهز للمحاكاة', 'Ready to simulate')}
                </span>
              </div>
              <Stepper onNavigate={() => setOpen(false)} />

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setStep(10);
                  }}
                  className="btn-primary flex-1 text-xs"
                >
                  {t('إلى المحاكاة', 'Go to simulation')}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
