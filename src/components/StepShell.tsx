import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Lightbulb, Lock } from 'lucide-react';
import { STEPS } from '../data/steps';
import { useLang, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';

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
    <div className="mb-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="eyebrow">{t('الخطوة', 'Step')} <span className="num">{String(step).padStart(2, '0')}</span> / 11</span>
            <span className="h-px w-8 bg-gold-400/40" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{lang === 'ar' ? meta.title.ar : meta.title.en}</h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">{lang === 'ar' ? meta.subtitle.ar : meta.subtitle.en}</p>
        </div>
        <button type="button" onClick={onLearn} className="btn-ghost !px-3 !py-2 text-[11px]">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          {t('اشرح لي', 'Explain')}
        </button>
      </div>

      {noHints ? (
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11px] text-slate-500">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          {t('وضع الخبير: التلميحات مخفية. القرار لك.', 'Expert mode: hints are disabled. The decision is yours.')}
        </div>
      ) : (
        <div className="rounded-xl border border-royal-400/15 bg-royal-500/[0.045] px-3 py-2.5">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" aria-hidden="true" />
            <div className="min-w-0 text-[11px] leading-relaxed text-slate-300">
              <span className="me-1 font-bold text-gold-200">{t('تلميح', 'Hint')}:</span>
              {lang === 'ar' ? hint.ar : hint.en}
              {!fullHints ? (
                <span className="ms-1 text-[10px] text-slate-500">({t('مختصر في الوضع العادي', 'shortened on normal')})</span>
              ) : null}
            </div>
          </div>
          {contextHint ? <div className="mt-2 border-t border-white/[0.07] pt-2 text-[11px] leading-relaxed text-slate-300">{contextHint}</div> : null}
        </div>
      )}
    </div>
  );
}

const NextIcon = () => {
  const lang = useLang();
  return lang === 'ar' ? <ChevronLeft className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />;
};

const BackIcon = () => {
  const lang = useLang();
  return lang === 'ar' ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />;
};

export function StepNav({ step }: { step: number }) {
  const t = useT();
  const setStep = useMissionStore((state) => state.setStep);
  const next = STEPS[step] ?? null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
      <button
        type="button"
        onClick={() => {
          setStep(step - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={step <= 1}
        className="btn-ghost text-xs"
      >
        <BackIcon />
        {t('السابق', 'Back')}
      </button>
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1 text-[10px] font-semibold text-slate-500 sm:flex">
          {t('الخطوة التالية', 'Next')}
          <ArrowLeft className="h-3 w-3 opacity-0" aria-hidden="true" />
          <span className="text-slate-400">{next ? t(next.short.ar, next.short.en) : ''}</span>
        </span>
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
            <NextIcon />
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
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card card-pad ${className}`}>
      <div className="section-head">
        <div className="min-w-0">
          <h2 className="card-title">{title}</h2>
          {description ? <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
