import { BookOpen, Clock3, Flame, Shield, Target } from 'lucide-react';
import { useL, useLang, useT } from '../i18n';
import { fmtDateTime } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { AmunLogo } from './AmunLogo';
import { DashboardGrid } from './Dashboard';
import { Stepper } from './Stepper';
import { TargetImage } from './TargetImage';

export function Sidebar({ onLearn }: { onLearn: () => void }) {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const lang = useLang();
  const savedAt = useMissionStore((state) => state.savedAt);
  const attempts = useMissionStore((state) => state.attempts.length);
  const setStep = useMissionStore((state) => state.setStep);
  const errors = design.blockingIssues.length;
  const warnings = design.warningIssues.length;

  return (
    <aside className="sticky top-0 hidden h-screen w-[330px] shrink-0 flex-col border-e border-white/[0.07] bg-void-950/55 backdrop-blur-xl lg:flex xl:w-[352px]">
      <div className="border-b border-white/[0.06] px-5 py-5">
        <AmunLogo className="h-12 w-12" withWordmark tagline />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="flex items-center gap-3 p-3">
            <TargetImage target={design.target} className="h-14 w-14 shrink-0 rounded-xl" compact />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-white">{l(design.target.name)}</div>
              <div className="truncate text-[11px] text-slate-400">
                {l(design.missionType.name)} · {l(design.tier.name)}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`chip !px-1.5 !py-0 text-[9px] ${
                    design.difficulty.id === 'expert'
                      ? '!border-danger/30 !text-danger'
                      : design.difficulty.id === 'beginner'
                        ? '!border-good/30 !text-good'
                        : '!border-warn/30 !text-warn'
                  }`}
                >
                  {l(design.difficulty.name)}
                </span>
                <span className="chip !px-1.5 !py-0 font-latin !text-[9px] text-slate-400" dir="ltr">
                  {design.choices.seed}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06] rtl:divide-x-reverse">
            <div className="px-2 py-1.5 text-center">
              <div className="text-[9px] text-slate-500">{t('الهدف', 'Target')}</div>
              <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-300">
                <Target className="h-3 w-3 text-royal-400" aria-hidden="true" />
                {l(design.missionType.short)}
              </div>
            </div>
            <div className="px-2 py-1.5 text-center">
              <div className="text-[9px] text-slate-500">{t('المخاطرة', 'Hazard')}</div>
              <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-300">
                <Flame className="h-3 w-3 text-warn" aria-hidden="true" />
                <span className="num">{design.target.hazardFactor.toFixed(2)}</span>
              </div>
            </div>
            <div className="px-2 py-1.5 text-center">
              <div className="text-[9px] text-slate-500">{t('الموثوقية', 'Reliability')}</div>
              <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-300">
                <Shield className="h-3 w-3 text-good" aria-hidden="true" />
                <span className="num">{(design.launcher.reliability * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between px-1">
          <span className="eyebrow">{t('خطوات المهمة', 'Mission flow')}</span>
          <span className="num text-[10px] font-bold text-slate-500">
            {String(design.choices.difficulty).toUpperCase()}
          </span>
        </div>
        <Stepper />

        <div className="my-4 divider" />

        <div className="mb-2 flex items-center justify-between px-1">
          <span className="eyebrow">{t('لوحة القيادة', 'Dashboard')}</span>
          <span className="text-[10px] font-semibold text-slate-500">{t('حي', 'live')}</span>
        </div>
        <DashboardGrid />

        <button
          type="button"
          onClick={onLearn}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-royal-400/20 bg-royal-500/[0.06] px-3 py-2 text-[11px] font-bold text-royal-200 transition hover:bg-royal-500/15"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          {t('افتح لوحة تعلّم', 'Open the Learn panel')}
        </button>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3">
        <button
          type="button"
          onClick={() => setStep(errors > 0 ? design.blockingIssues[0].step : 1)}
          className="mb-2 flex w-full items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-2 text-[10px] font-semibold"
        >
          <span className={errors > 0 ? 'text-danger' : 'text-good'}>
            {errors > 0
              ? t(`${errors} أخطاء مانعة`, `${errors} blocking error${errors === 1 ? '' : 's'}`)
              : t('جاهز للمحاكاة', 'Ready to simulate')}
          </span>
          <span className="text-warn">
            {warnings > 0
              ? t(`${warnings} تحذير`, `${warnings} warning${warnings === 1 ? '' : 's'}`)
              : t('لا تحذيرات', 'No warnings')}
          </span>
        </button>
        <div className="flex items-center justify-between text-[9px] text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" aria-hidden="true" />
            {savedAt ? fmtDateTime(savedAt, lang) : t('لم يُحفظ بعد', 'Not saved yet')}
          </span>
          <span>{t(`${attempts} محاولة`, `${attempts} attempt${attempts === 1 ? '' : 's'}`)}</span>
        </div>
      </div>
    </aside>
  );
}
