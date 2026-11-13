import type { ReactNode } from 'react';
import { STEPS } from '../data/steps';
import { useLang, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';
import { IconBook, IconChevron } from './Icons';

export function StepIntro({
  step,
  onLearn,
  contextHint,
}: {
  step: number;
  onLearn: () => void;
  contextHint?: ReactNode;
}) {
  const t = useT();
  const lang = useLang();
  const difficulty = useMissionStore((state) => state.choices.difficulty);
  const meta = STEPS[step - 1];
  const fullHints = difficulty === 'beginner';
  const noHints = difficulty === 'expert';
  const hint = fullHints ? meta.hint : meta.hintShort;

  return (
    <div className="mb-5 border-b border-royal-700 pb-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_230px]">
        <div className="min-w-0">
          <div className="mb-2 flex items-baseline gap-2 text-xs text-limestone-400">
            <span>{t('الخطوة', 'Step')}</span>
            <span className="font-latin tabular-nums text-ochre-400" dir="ltr">
              {String(step).padStart(2, '0')} / 11
            </span>
          </div>
          <h1 className="font-display text-[26px] leading-tight text-limestone-50 sm:text-[30px]">
            {lang === 'ar' ? meta.title.ar : meta.title.en}
          </h1>
          <p className="mt-2 text-sm text-limestone-300">
            {lang === 'ar' ? meta.subtitle.ar : meta.subtitle.en}
          </p>
        </div>

        <div className="md:border-s md:border-royal-700 md:ps-4">
          <div className="flex items-center justify-between gap-2 md:block">
            <span className="text-[10px] text-limestone-400">{t('ملاحظة الهامش', 'Margin note')}</span>
            <button type="button" onClick={onLearn} className="inline-flex items-center gap-1.5 text-xs text-limestone-200 underline decoration-royal-400 underline-offset-4 hover:text-limestone-50 md:mt-2">
              <IconBook className="h-4 w-4" />
              {t('اشرح لي', 'Explain')}
            </button>
          </div>
          {noHints ? (
            <p className="mt-2 text-xs leading-relaxed text-limestone-400">
              {t(
                'وضع الخبير: التلميحات مخفية. القرار لك.',
                'Expert mode: hints are hidden. The decision is yours.',
              )}
            </p>
          ) : (
            <div className="mt-2">
              <p className="text-xs leading-relaxed text-limestone-200">
                {lang === 'ar' ? hint.ar : hint.en}
              </p>
              {!fullHints ? (
                <p className="mt-1 text-[10px] text-limestone-400">
                  {t('مختصر في الوضع العادي', 'shortened on normal')}
                </p>
              ) : null}
              {contextHint ? (
                <div className="mt-2 border-t border-royal-700 pt-2 text-xs leading-relaxed text-limestone-300">
                  {contextHint}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepNav({ step }: { step: number }) {
  const t = useT();
  const lang = useLang();
  const setStep = useMissionStore((state) => state.setStep);
  const next = STEPS[step] ?? null;
  const nextChevron = lang === 'ar' ? 'start' : 'end';

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-royal-700 pt-4">
      <button
        type="button"
        onClick={() => {
          setStep(step - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={step <= 1}
        className="btn-ghost text-xs"
      >
        <IconChevron dir={lang === 'ar' ? 'end' : 'start'} className="h-4 w-4" />
        {t('السابق', 'Back')}
      </button>
      <div className="flex items-center gap-3">
        {next ? (
          <span className="hidden text-[11px] text-limestone-400 sm:inline">
            {t('التالي', 'Next')}
            <span className="ms-1 text-limestone-200">{t(next.short.ar, next.short.en)}</span>
          </span>
        ) : null}
        {next ? (
          <button
            type="button"
            onClick={() => {
              setStep(step + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-primary text-xs"
          >
            {t('متابعة', 'Continue')}
            <IconChevron dir={nextChevron} className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-secondary text-xs"
          >
            {t('العودة للبداية', 'Back to start')}
          </button>
        )}
      </div>
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className = '',
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`border-t border-royal-700 pt-3 ${className}`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg leading-tight text-limestone-50">{title}</h2>
        {action}
      </div>
      {description ? <p className="margin-note mb-3">{description}</p> : null}
      {children}
    </section>
  );
}
