import { useEffect, useMemo, useRef, useState } from 'react';
import { LEARN_TOPICS, learnTopicByKey, learnTopicForEvent, learnTopicForStep } from '../data/learn';
import { SOURCES } from '../data/sources';
import { useL, useT } from '../i18n';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, SimplifiedNote, SourceLegend } from './Badges';
import { IconBook, IconChevron, IconCross, IconInfo } from './Icons';

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
        className="absolute inset-0 h-full w-full bg-lapis-950/80"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={t('لوحة تعلّم', 'Learn panel')}
        className="absolute inset-y-0 end-0 flex w-full max-w-xl flex-col border-s border-royal-600 bg-lapis-900"
      >
        <header className="flex items-center justify-between gap-3 border-b border-royal-700 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center border border-royal-600 text-ochre-400">
              <IconBook className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[10px] text-limestone-400">{t('أكاديمية آمون', 'AMUN Academy')}</div>
              <div className="font-display text-sm text-limestone-50">
                {t('الفيزياء خلف القرار', 'The physics behind the decision')}
              </div>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="btn-icon" aria-label={t('إغلاق', 'Close')}>
            <IconCross className="h-4 w-4" />
          </button>
        </header>

        <div className="border-b border-royal-700 px-3 py-2.5">
          <label htmlFor="learn-topic" className="sr-only">
            {t('اختر موضوعًا', 'Choose a topic')}
          </label>
          <select
            id="learn-topic"
            value={topic.key}
            onChange={(event) => setSelected(event.target.value)}
            className="field py-2 text-xs"
          >
            {LEARN_TOPICS.map((item) => (
              <option key={item.key} value={item.key}>
                {l(item.title)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          <span className="inline-flex items-center gap-1.5 border-s-2 border-ochre-400 py-0.5 ps-2 text-[11px] text-ochre-300">
            <IconInfo className="h-3.5 w-3.5" />
            {t('موضوع الخطوة', 'Step topic')}
            {topic.sources.includes('game') ? (
              <span className="ms-1 border-b border-dashed border-limestone-400 text-limestone-300">
                {t('يشمل قيمًا مبسطة', 'includes game values')}
              </span>
            ) : null}
          </span>

          <h2 className="mt-2 font-display text-xl text-limestone-50">{l(topic.title)}</h2>
          <p className="mt-2 text-base leading-[1.8] text-limestone-200">{l(topic.summary)}</p>

          <ol className="mt-4">
            {topic.points.map((point, index) => (
              <li
                key={`${topic.key}-${index}`}
                className="grid grid-cols-[24px_minmax(0,1fr)] gap-x-3 border-t border-royal-700 py-2.5"
              >
                <span className="font-latin text-xs tabular-nums text-ochre-400" dir="ltr">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed text-limestone-200">{l(point)}</p>
              </li>
            ))}
          </ol>

          {topic.formula ? (
            <figure className="mt-4 border-s-2 border-royal-400 ps-3">
              <figcaption className="text-[11px] text-limestone-400">{t('المعادلة', 'The equation')}</figcaption>
              <div className="mt-1 overflow-x-auto py-1 font-latin text-base text-ochre-200" dir="ltr">
                {topic.formula.expression}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-limestone-300">{l(topic.formula.caption)}</p>
            </figure>
          ) : null}

          {topic.example ? (
            <figure className="mt-4 border-s-2 border-ochre-400 ps-3">
              <figcaption className="text-[11px] text-ochre-300">{t('مثال من تصميمك', 'Example from your design')}</figcaption>
              <p className="mt-1 text-sm leading-relaxed text-limestone-200">{l(topic.example(design))}</p>
            </figure>
          ) : null}

          <div className="mt-5 border-t border-royal-700 pt-3">
            <div className="mb-2 text-[11px] text-limestone-400">{t('المصادر والقراءة الإضافية', 'Sources and further reading')}</div>
            <DataSourceBadges sources={topic.sources} />
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={SOURCES.basics.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-baseline gap-1 border-b border-royal-400 pb-px text-[11px] text-limestone-200 hover:text-limestone-50"
              >
                {t('Basics of Space Flight', 'Basics of Space Flight')}
                <IconChevron dir="end" className="h-3 w-3 self-center" />
              </a>
              <a
                href={ntrsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-baseline gap-1 border-b border-royal-400 pb-px text-[11px] text-limestone-200 hover:text-limestone-50"
              >
                {t('بحث NTRS', 'NTRS search')}
                <IconChevron dir="end" className="h-3 w-3 self-center" />
              </a>
            </div>
          </div>

          <div className="mt-4 border border-royal-700 p-3">
            <div className="mb-2 text-[11px] text-limestone-400">{t('مفتاح المصادر', 'Source key')}</div>
            <SourceLegend />
          </div>

          <SimplifiedNote className="mt-4">
            {t(
              'الأرقام الحقيقية تحمل شارة مصدر. القيم الموسومة «مبسّط للعبة» اختيرت لموازنة اللعب وليست بيانات NASA.',
              'Real numbers carry a source badge. Values marked “game-simplified” were tuned for balance and are not NASA data.',
            )}
          </SimplifiedNote>
        </div>

        <footer className="border-t border-royal-700 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => {
              onClose();
              setStep(step);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-secondary w-full text-xs"
          >
            {t('عد إلى المهمة', 'Return to the mission')}
          </button>
        </footer>
      </section>
    </div>
  );
}
