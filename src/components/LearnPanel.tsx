import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, ExternalLink, FlaskConical, Sigma, Sparkles, X } from 'lucide-react';
import { LEARN_TOPICS, learnTopicByKey, learnTopicForEvent, learnTopicForStep } from '../data/learn';
import { SOURCES } from '../data/sources';
import { useL, useT } from '../i18n';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, SimplifiedNote } from './Badges';

interface LearnPanelProps {
  open: boolean;
  focusKey?: string | null;
  onClose: () => void;
}

export function LearnPanel({ open, focusKey, onClose }: LearnPanelProps) {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const step = useMissionStore((state) => state.step);
  const setStep = useMissionStore((state) => state.setStep);
  const closeRef = useRef<HTMLButtonElement>(null);
  const initial = focusKey ? learnTopicForEvent(focusKey) ?? learnTopicForStep(step) : learnTopicForStep(step);
  const [selected, setSelected] = useState(initial?.key ?? 'objectives');

  useEffect(() => {
    if (!open) return;
    const topic = focusKey ? learnTopicForEvent(focusKey) ?? learnTopicForStep(step) : learnTopicForStep(step);
    setSelected(topic.key);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', keyHandler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', keyHandler);
      document.body.style.overflow = '';
    };
  }, [open, focusKey, step, onClose]);

  const topic = useMemo(
    () => learnTopicByKey(selected) ?? learnTopicForStep(step),
    [selected, step],
  );

  if (!open) return null;

  const ntrsUrl = topic.ntrsQuery
    ? `https://ntrs.nasa.gov/search?q=${encodeURIComponent(topic.ntrsQuery)}`
    : SOURCES.ntrs.url;

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label={t('إغلاق لوحة التعلم', 'Close Learn panel')}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-void-950/75 backdrop-blur-sm"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={t('لوحة تعلّم', 'Learn panel')}
        className="absolute inset-y-0 end-0 flex w-full max-w-xl flex-col border-s border-white/10 bg-void-900/95 shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-royal-400/30 bg-royal-500/10 text-royal-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <div className="eyebrow">{t('أكاديمية آمون', 'AMUN Academy')}</div>
              <div className="text-sm font-bold text-white">{t('تعلّم الفيزياء خلف القرار', 'Learn the physics behind the decision')}</div>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="btn-icon" aria-label={t('إغلاق', 'Close')}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="border-b border-white/[0.06] px-3 py-2.5">
          <label htmlFor="learn-topic" className="sr-only">
            {t('اختر موضوعًا', 'Choose a topic')}
          </label>
          <select
            id="learn-topic"
            value={topic.key}
            onChange={(event) => setSelected(event.target.value)}
            className="field !py-2 text-xs"
          >
            {LEARN_TOPICS.map((item) => (
              <option key={item.key} value={item.key}>
                {l(item.title)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="chip !border-gold-400/30 !bg-gold-400/[0.08] !text-gold-200">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t('موضوع الخطوة', 'Step topic')}
            </span>
            {topic.sources.includes('game') ? (
              <span className="chip !border-gold-400/20 !text-gold-200/80">
                <FlaskConical className="h-3 w-3" aria-hidden="true" />
                {t('يشمل قيمًا مبسطة', 'Includes game values')}
              </span>
            ) : null}
          </div>

          <h2 className="text-xl font-extrabold text-white">{l(topic.title)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{l(topic.summary)}</p>

          <div className="mt-4 space-y-2.5">
            {topic.points.map((point, index) => (
              <div key={`${topic.key}-${index}`} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-royal-500/15 font-latin text-[10px] font-bold text-royal-300">
                  {index + 1}
                </span>
                <p className="text-[12px] leading-relaxed text-slate-300">{l(point)}</p>
              </div>
            ))}
          </div>

          {topic.formula ? (
            <div className="mt-4 rounded-2xl border border-royal-400/20 bg-royal-500/[0.06] p-4">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-royal-300">
                <Sigma className="h-3.5 w-3.5" aria-hidden="true" />
                {t('المعادلة', 'The equation')}
              </div>
              <div className="overflow-x-auto py-1 text-center font-latin text-base font-bold text-gold-200 sm:text-lg" dir="ltr">
                {topic.formula.expression}
              </div>
              <p className="mt-1 text-center text-[11px] leading-relaxed text-slate-400">{l(topic.formula.caption)}</p>
            </div>
          ) : null}

          {topic.example ? (
            <div className="mt-4 rounded-2xl border border-gold-400/20 bg-gold-400/[0.045] p-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t('مثال من تصميمك', 'Example from your design')}
              </div>
              <p className="text-[12px] leading-relaxed text-slate-200">{l(topic.example(design))}</p>
            </div>
          ) : null}

          <div className="mt-4">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {t('المصادر والقراءة الإضافية', 'Sources & further reading')}
            </div>
            <DataSourceBadges sources={topic.sources} />
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={SOURCES.basics.url} target="_blank" rel="noreferrer noopener" className="chip !border-royal-400/20 hover:border-royal-400/50">
                <ExternalLink className="h-3 w-3 text-royal-300" aria-hidden="true" />
                {t('Basics of Space Flight', 'Basics of Space Flight')}
              </a>
              <a href={ntrsUrl} target="_blank" rel="noreferrer noopener" className="chip !border-royal-400/20 hover:border-royal-400/50">
                <ExternalLink className="h-3 w-3 text-royal-300" aria-hidden="true" />
                {t('بحث NTRS', 'NTRS search')}
              </a>
            </div>
          </div>

          <SimplifiedNote className="mt-4">
            {t(
              'الأرقام الحقيقية تحمل شارة مصدر. القيم الموسومة «مبسّط للعبة» اختيرت لموازنة اللعب وليست بيانات NASA.',
              'Real numbers carry a source badge. Values marked “game-simplified” were tuned for balance and are not NASA data.',
            )}
          </SimplifiedNote>
        </div>

        <footer className="border-t border-white/[0.08] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => {
              onClose();
              setStep(step);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-secondary w-full text-xs"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {t('عد إلى المهمة', 'Return to the mission')}
          </button>
        </footer>
      </section>
    </div>
  );
}
