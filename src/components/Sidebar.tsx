import { useL, useLang, useT } from '../i18n';
import { fmtDateTime } from '../lib/format';
import type { TransferType } from '../data/types';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { AmunLogo } from './AmunLogo';
import { DashboardGrid } from './Dashboard';
import { IconExternal, IconRocket, IconTarget } from './Icons';
import { Stepper } from './Stepper';
import { TargetImage } from './TargetImage';

const TRANSFER_LABEL: Record<TransferType, { ar: string; en: string }> = {
  hohmann: { ar: 'هوهمان', en: 'Hohmann' },
  fast: { ar: 'سريع', en: 'Fast' },
  assist: { ar: 'مساعدة جاذبية', en: 'Gravity assist' },
};

export function Sidebar({ onLearn, onProject, onNasaData }: { onLearn: () => void; onProject?: () => void; onNasaData?: () => void }) {
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
    <aside className="sticky top-0 hidden h-screen w-[330px] shrink-0 flex-col border-e border-royal-700 bg-lapis-900 lg:flex xl:w-[352px]">
      <div className="border-b border-royal-700 px-5 py-4">
        <AmunLogo className="h-11 w-11" withWordmark />
        <p className="mt-1 ps-14 text-[11px] text-limestone-400">{t('مكتب تصميم المهام', 'Mission design office')}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <section aria-label={t('ملف المهمة', 'Mission file')} className="border border-royal-700">
          <div className="flex items-center gap-3 border-b border-royal-700 p-3">
            <TargetImage target={design.target} className="h-16 w-16 shrink-0" compact />
            <div className="min-w-0">
              <div className="cartouche max-w-full">
                <span className="truncate text-sm text-limestone-50">{l(design.target.name)}</span>
              </div>
              <div className="mt-1.5 truncate text-xs text-limestone-300">{l(design.missionType.name)}</div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                <span
                  className={
                    design.difficulty.id === 'expert'
                      ? 'text-carnelian-300'
                      : design.difficulty.id === 'beginner'
                        ? 'text-malachite'
                        : 'text-amber'
                  }
                >
                  {l(design.difficulty.name)}
                </span>
                <span className="font-latin tabular-nums text-limestone-400" dir="ltr">
                  {design.choices.seed}
                </span>
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-royal-700 rtl:divide-x-reverse">
            <div className="px-2 py-1.5">
              <dt className="text-[10px] text-limestone-400">{t('المسار', 'Transfer')}</dt>
              <dd className="truncate text-xs text-limestone-100">
                {t(TRANSFER_LABEL[design.choices.transferType].ar, TRANSFER_LABEL[design.choices.transferType].en)}
              </dd>
            </div>
            <div className="border-t-0 px-2 py-1.5">
              <dt className="text-[10px] text-limestone-400">{t('المخاطرة', 'Hazard')}</dt>
              <dd className="font-latin text-xs tabular-nums text-limestone-100">
                {design.target.hazardFactor.toFixed(2)}
              </dd>
            </div>
            <div className="px-2 py-1.5">
              <dt className="text-[10px] text-limestone-400">{t('الموثوقية', 'Reliability')}</dt>
              <dd className="font-latin text-xs tabular-nums text-limestone-100">
                {(design.launcher.reliability * 100).toFixed(0)}%
              </dd>
            </div>
          </dl>
        </section>

        <div className="mb-1 mt-5 flex items-baseline justify-between">
          <h2 className="font-display text-sm text-limestone-100">{t('مسار المهمة', 'Mission path')}</h2>
          <span className="text-[10px] text-limestone-400">{t('من الأرض إلى الهدف', 'Ground to target')}</span>
        </div>
        <Stepper />

        <div className="mb-1 mt-5 flex items-baseline justify-between">
          <h2 className="font-display text-sm text-limestone-100">{t('هوامش التصميم', 'Design margins')}</h2>
          <span className="text-[10px] text-limestone-400">{t('مباشر', 'live')}</span>
        </div>
        <DashboardGrid />
        <p className="margin-note mt-2">
          {t(
            'الشريط المظلل هو الهامش الأمثل. العلامة اليمنى هي الحد الأقصى.',
            'The shaded band is the optimum. The right tick is the ceiling.',
          )}
        </p>

        <button type="button" onClick={onLearn} className="btn-ghost mt-4 w-full text-xs">
          {t('افتح لوحة تعلّم', 'Open the Learn panel')}
        </button>

        {onProject ? (
          <button
            type="button"
            onClick={onProject}
            className="mt-2 flex w-full items-center justify-between border border-royal-700 bg-royal-950/40 px-3 py-2 text-xs text-limestone-200 transition-colors hover:border-ochre-400 hover:text-ochre-300"
          >
            <span className="flex items-center gap-2">
              <IconRocket className="h-3.5 w-3.5 text-ochre-400" />
              <span>{t('دليل المشروع وطاقم العمل', 'Project Dossier & Team')}</span>
            </span>
            <IconExternal className="h-3.5 w-3.5 shrink-0 text-ochre-300" />
          </button>
        ) : null}

        {onNasaData ? (
          <button
            type="button"
            onClick={onNasaData}
            className="mt-2 flex w-full items-center justify-between border border-royal-700 bg-royal-950/40 px-3 py-2 text-xs text-limestone-200 transition-colors hover:border-malachite hover:text-malachite"
          >
            <span className="flex items-center gap-2">
              <IconTarget className="h-3.5 w-3.5 text-malachite" />
              <span>{t('معلومات ناسا الحقيقية', 'NASA Real Space Science')}</span>
            </span>
            <IconExternal className="h-3.5 w-3.5 shrink-0 text-malachite" />
          </button>
        ) : null}
      </div>

      <div className="border-t border-royal-700 px-4 py-3">
        <button
          type="button"
          onClick={() => setStep(errors > 0 ? design.blockingIssues[0].step : 1)}
          className="mb-2 flex w-full items-baseline justify-between gap-2 text-[11px]"
        >
          <span className={errors > 0 ? 'text-carnelian-300' : 'text-malachite'}>
            {errors > 0
              ? t(`${errors} أخطاء مانعة`, `${errors} blocking error${errors === 1 ? '' : 's'}`)
              : t('جاهز للمحاكاة', 'Ready to simulate')}
          </span>
          <span className={warnings > 0 ? 'text-amber' : 'text-limestone-400'}>
            {warnings > 0
              ? t(`${warnings} تحذير`, `${warnings} warning${warnings === 1 ? '' : 's'}`)
              : t('لا تحذيرات', 'No warnings')}
          </span>
        </button>
        <div className="flex items-baseline justify-between gap-2 text-[10px] text-limestone-400">
          <span>{savedAt ? fmtDateTime(savedAt, lang) : t('لم يُحفظ بعد', 'Not saved yet')}</span>
          <span className="font-latin tabular-nums">
            {t(`${attempts} محاولة`, `${attempts} attempt${attempts === 1 ? '' : 's'}`)}
          </span>
        </div>
      </div>
    </aside>
  );
}
