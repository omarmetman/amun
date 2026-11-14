import type { AttemptSummary, DecisionImpact, ScoreResult, TransferType } from '../data/types';
import { missionTypeById } from '../data/missions';
import { targetById } from '../data/targets';
import { nextCampaignChapter } from '../data/campaign';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useActiveChapter } from '../store/useCampaign';
import { useMissionStore } from '../store/useMissionStore';
import { GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { AchievementsHighlight } from '../components/Achievements';
import { CampaignDebrief } from '../components/CampaignDebrief';
import { Section } from '../components/StepShell';
import { Bar, InlineNote } from '../components/StepBits';
import { TargetImage } from '../components/TargetImage';
import { Cartouche, Frieze } from '../components/Ornament';
import {
  IconAlert,
  IconBook,
  IconCheck,
  IconCrown,
  IconDice,
  IconHistory,
  IconMedal,
  IconPlay,
  IconReset,
  IconThumbDown,
  IconThumbUp,
  IconTune,
  IconWrench,
} from '../components/Icons';

const TRANSFER_LABEL: Record<TransferType, { ar: string; en: string }> = {
  hohmann: { ar: 'هوهمان', en: 'Hohmann' },
  fast: { ar: 'سريع', en: 'Fast' },
  assist: { ar: 'مساعدة جاذبية', en: 'Gravity assist' },
};

const gradeTone: Record<ScoreResult['grade'], string> = {
  S: 'border-ochre-400 text-ochre-300',
  A: 'border-ochre-400/70 text-ochre-200',
  B: 'border-malachite text-malachite',
  C: 'border-royal-400 text-royal-300',
  D: 'border-amber text-amber',
  F: 'border-carnelian text-carnelian-300',
};

const outcomeStyle: Record<ScoreResult['outcome'], { tone: 'good' | 'warn' | 'danger'; ar: string; en: string }> = {
  full: { tone: 'good', ar: 'نجاح كامل', en: 'Full success' },
  partial: { tone: 'warn', ar: 'نجاح جزئي', en: 'Partial success' },
  failure: { tone: 'danger', ar: 'فشل', en: 'Failure' },
};

const dimensions: Array<{
  key: keyof Omit<ScoreResult['breakdown'], 'total'>;
  max: number;
  tone: 'gold' | 'royal' | 'good';
  title: { ar: string; en: string };
  hint: { ar: string; en: string };
}> = [
  {
    key: 'science',
    max: 35,
    tone: 'gold',
    title: { ar: 'العائد العلمي', en: 'Science return' },
    hint: { ar: 'القياسات التي وصلت فعليًا مقارنة بمعيار النجاح.', en: 'Measurements that actually arrived versus the success tier.' },
  },
  {
    key: 'budget',
    max: 20,
    tone: 'royal',
    title: { ar: 'كفاءة الميزانية', en: 'Budget efficiency' },
    hint: { ar: 'استهلاك الاحتياطي والتجاوزات بعد المحاكاة.', en: 'Reserve consumption and overruns after the simulation.' },
  },
  {
    key: 'margins',
    max: 20,
    tone: 'good',
    title: { ar: 'جودة الهوامش', en: 'Margin quality' },
    hint: { ar: 'قرب الكتلة والطاقة ودلتا-في من النطاق الأمثل 10–30%.', en: 'How close mass, power and Δv sit to the 10–30% ideal band.' },
  },
  {
    key: 'reliability',
    max: 25,
    tone: 'royal',
    title: { ar: 'الموثوقية والتنفيذ', en: 'Reliability and execution' },
    hint: { ar: 'نجاح المراحل والأحداث التي واجهتها المركبة.', en: 'Phase success and the events the spacecraft survived.' },
  },
];

function useAttemptName() {
  const l = useL();
  return (attempt: AttemptSummary): string => {
    const target = targetById[attempt.targetId];
    return target ? l(target.name) : attempt.targetId;
  };
}

function EmptyEvaluation({ onOpenSimulation }: { onOpenSimulation: () => void }) {
  const t = useT();
  const design = useDesign();
  const attempts = useMissionStore((state) => state.attempts);

  return (
    <div className="space-y-4">
      <section className="border border-royal-700">
        <div className="p-4 sm:p-6">
          <div className="text-[11px] text-ochre-300">{t('ملف المهمة', 'Mission file')}</div>
          <h2 className="mt-1 font-display text-2xl text-limestone-50 sm:text-3xl">
            {t('المهمة تنتظر التشغيل', 'The mission is waiting to be run')}
          </h2>
          <p className="mt-2 max-w-[60ch] text-base leading-[1.8] text-limestone-200">
            {t(
              'التقييم يقرأ نتيجة محاكاة محفوظة. ستجد هنا درجة من 100 موزعة على العلم والميزانية والهوامش والموثوقية، مع تفسير كل خصم وخطوة إصلاحه.',
              'Evaluation reads a saved simulation result. You will get a score out of 100 split across science, budget, margins and reliability, with an explanation for every deduction and the step that fixes it.',
            )}
          </p>
          {design.blockingIssues.length > 0 ? (
            <div className="mt-3 border-s-2 border-carnelian py-1 ps-3 text-sm leading-relaxed text-carnelian-300">
              {t(
                `المحاكاة محجوبة حاليًا بـ ${design.blockingIssues.length} خطأ مانع. أصلحها من مركز التحقق أو من الخطوة المعنية.`,
                `The simulation is currently blocked by ${design.blockingIssues.length} error(s). Fix them from the validation center or the relevant step.`,
              )}
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onOpenSimulation} className="btn-primary text-sm">
              <IconPlay className="h-4 w-4" />
              {t('إلى خطوة المحاكاة', 'Go to simulation')}
            </button>
            <span className="text-[11px] text-limestone-400">
              {attempts.length > 0
                ? t(`لديك ${attempts.length} محاولة محفوظة من جولات سابقة.`, `${attempts.length} earlier attempt(s) are saved.`)
                : t('ستُسجل المحاولة الأولى تلقائيًا عند التشغيل.', 'Your first attempt will be recorded automatically when you run.')}
            </span>
          </div>
        </div>
      </section>

      <HistoryPanels />
    </div>
  );
}

function DecisionRow({ impact, positive }: { impact: DecisionImpact; positive: boolean }) {
  const t = useT();
  const l = useL();
  const setStep = useMissionStore((state) => state.setStep);

  return (
    <li className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 border-t border-royal-700 py-3 first:border-t-0">
      {positive ? (
        <IconThumbUp className="mt-1 h-4 w-4 self-start text-malachite" />
      ) : (
        <IconThumbDown className="mt-1 h-4 w-4 self-start text-carnelian-300" />
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-sm text-limestone-50">{l(impact.title)}</span>
          <button
            type="button"
            onClick={() => {
              setStep(impact.step);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex min-h-[24px] shrink-0 items-center gap-1 border-b border-royal-400 pb-px text-[11px] text-limestone-200 hover:text-limestone-50"
          >
            <IconWrench className="h-3 w-3 self-center" />
            {positive ? t('راجع', 'Review') : t('أصلح', 'Fix')}
            <span className="font-latin tabular-nums text-limestone-400" dir="ltr">
              {String(impact.step).padStart(2, '0')}
            </span>
          </button>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-limestone-300">{l(impact.detail)}</p>
      </div>
    </li>
  );
}

function AttemptsList({ attempts, currentId }: { attempts: AttemptSummary[]; currentId?: string }) {
  const t = useT();
  const lang = useLang();
  const l = useL();
  const attemptName = useAttemptName();

  if (attempts.length === 0) {
    return (
      <InlineNote tone="neutral">
        {t('لا محاولات محفوظة بعد. كل تشغيل ناجح يضيف صفًا هنا.', 'No saved attempts yet. Every successful run adds a row here.')}
      </InlineNote>
    );
  }

  return (
    <ol>
      {attempts.slice(0, 6).map((attempt) => {
        const current = attempt.id === currentId;
        return (
          <li key={attempt.id} className="border-t border-royal-700 py-2.5 first:border-t-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div className="min-w-0">
                <div className="text-sm text-limestone-100">
                  {attemptName(attempt)}
                  {current ? (
                    <span className="ms-2 text-[10px] text-ochre-300">{t('هذه الجولة', 'this run')}</span>
                  ) : null}
                </div>
                <div className="text-[11px] text-limestone-400">
                  {missionTypeById[attempt.missionType] ? l(missionTypeById[attempt.missionType].short) : attempt.missionType}
                </div>
              </div>
              <div className="flex shrink-0 items-baseline gap-2">
                <span className={`font-latin text-sm tabular-nums ${attempt.success ? 'text-limestone-50' : 'text-carnelian-300'}`} dir="ltr">
                  {fmt(attempt.score, 1)}
                </span>
                <span className="border border-royal-600 px-1 font-latin text-[10px] text-ochre-300">{attempt.grade}</span>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-limestone-400">
              <span>
                {t('العلم', 'Science')}{' '}
                <span className="font-latin tabular-nums text-limestone-200" dir="ltr">
                  {fmt(attempt.science, 1)}
                </span>
              </span>
              <span>
                {t('البيانات', 'Data')}{' '}
                <span className="font-latin tabular-nums text-limestone-200" dir="ltr">
                  {fmt(attempt.dataSentGb, 2)} GB
                </span>
              </span>
              <span className="min-w-0 max-w-full truncate">
                {t('البذرة', 'Seed')}{' '}
                <span className="font-latin tabular-nums text-limestone-200" dir="ltr">
                  {attempt.seed}
                </span>
              </span>
              <span>{fmtDateTime(attempt.createdAt, lang)}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Leaderboard() {
  const t = useT();
  const l = useL();
  const attemptName = useAttemptName();
  const leaderboard = useMissionStore((state) => state.leaderboard);
  const pilotName = useMissionStore((state) => state.pilotName);

  if (leaderboard.length === 0) {
    return (
      <InlineNote tone="neutral">
        {t('لوحة الصدارة محلية على هذا الجهاز. شغّل مهمة لتظهر أول نتيجة.', 'The leaderboard is local to this device. Run a mission to post the first score.')}
      </InlineNote>
    );
  }

  return (
    <ol>
      {leaderboard.slice(0, 6).map((entry, index) => (
        <li
          key={`${entry.id}-${entry.name}`}
          className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-baseline gap-x-3 border-t border-royal-700 py-2.5 first:border-t-0"
        >
          <span className={`inline-flex items-baseline gap-1 font-latin text-[11px] tabular-nums ${index === 0 ? 'text-ochre-400' : 'text-limestone-400'}`}>
            {index === 0 ? <IconCrown className="h-3.5 w-3.5 self-center" /> : String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm text-limestone-100">
              {entry.name}
              {entry.name === pilotName ? <span className="ms-1.5 text-[10px] text-royal-300">{t('أنت', 'you')}</span> : null}
            </div>
            <div className="truncate text-[11px] text-limestone-400">
              {attemptName(entry)} / {missionTypeById[entry.missionType] ? l(missionTypeById[entry.missionType].short) : entry.missionType}
            </div>
          </div>
          <div className="flex shrink-0 items-baseline gap-2">
            <span className="font-latin text-sm tabular-nums text-limestone-50" dir="ltr">{fmt(entry.score, 1)}</span>
            <span className="border border-royal-600 px-1 font-latin text-[10px] text-ochre-300">{entry.grade}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function HistoryPanels() {
  const t = useT();
  const attempts = useMissionStore((state) => state.attempts);
  const simulation = useMissionStore((state) => state.simulation);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Section
        className="min-w-0"
        title={t('المحاولات السابقة', 'Past attempts')}
        description={t('آخر ست محاولات محفوظة محليًا، مع البذرة والعلم والبيانات.', 'The last six attempts saved locally, with seed, science and data.')}
        action={<StatusPill tone="muted"><IconHistory className="h-3 w-3" aria-hidden="true" /> {attempts.length}</StatusPill>}
      >
        <AttemptsList attempts={attempts} currentId={simulation?.runId} />
      </Section>
      <Section
        className="min-w-0"
        title={t('لوحة الصدارة', 'Leaderboard')}
        description={t('أفضل النتائج على هذا المتصفح. لا خادم ولا حسابات.', 'The top scores in this browser. No server or accounts.')}
        action={<StatusPill tone="info"><IconMedal className="h-3 w-3" aria-hidden="true" /> {t('محلي', 'Local')}</StatusPill>}
      >
        <Leaderboard />
      </Section>
    </div>
  );
}

export function Step11Evaluation({
  onLearn,
  onProfile,
  onCampaign,
}: {
  onLearn: (key?: string) => void;
  onProfile: () => void;
  onCampaign: () => void;
}) {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const lang = useLang();
  const chapter = useActiveChapter();
  const simulation = useMissionStore((state) => state.simulation);
  const score = useMissionStore((state) => state.score);
  const campaign = useMissionStore((state) => state.campaign);
  const startCampaignChapter = useMissionStore((state) => state.startCampaignChapter);
  const attempts = useMissionStore((state) => state.attempts);
  const setStep = useMissionStore((state) => state.setStep);
  const replaySameChoices = useMissionStore((state) => state.replaySameChoices);
  const replaySameSeed = useMissionStore((state) => state.replaySameSeed);
  const replayFromScratch = useMissionStore((state) => state.replayFromScratch);

  const next = chapter ? nextCampaignChapter(chapter.id) : null;
  const isChapterCompleted = chapter ? Boolean(campaign.completed[chapter.id]) : false;

  const openSimulation = () => {
    setStep(10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!simulation || !score) {
    return <EmptyEvaluation onOpenSimulation={openSimulation} />;
  }

  const outcome = outcomeStyle[score.outcome];
  const totalTone = score.grade === 'S' || score.grade === 'A' ? 'warn' : score.grade === 'F' || score.grade === 'D' ? 'danger' : 'info';

  const coverData: Array<{ label: string; value: string; latin?: boolean }> = [
    { label: t('الهدف', 'Target'), value: l(design.target.name) },
    { label: t('نوع المهمة', 'Mission type'), value: l(design.missionType.short) },
    { label: t('فئة النجاح', 'Success tier'), value: l(design.tier.name) },
    { label: t('الصاروخ', 'Launcher'), value: l(design.launcher.name), latin: true },
    {
      label: t('نوع النقل', 'Transfer'),
      value: t(TRANSFER_LABEL[design.choices.transferType].ar, TRANSFER_LABEL[design.choices.transferType].en),
    },
    { label: t('البذرة', 'Seed'), value: design.choices.seed, latin: true },
  ];

  const runSummary = [
    { label: t('البذرة', 'Seed'), value: design.choices.seed, hint: t('قابلة للتكرار', 'Reproducible') },
    {
      label: t('المراحل', 'Phases'),
      value: fmt(simulation.phases.filter((phase) => phase.outcome !== 'skipped').length),
      hint: `${simulation.phases.length} ${t('مسجلة', 'recorded')}`,
    },
    {
      label: t('الأحداث', 'Events'),
      value: fmt(simulation.events.length),
      hint: `${simulation.phases.filter((phase) => phase.outcome === 'failed').length} ${t('مراحل فاشلة', 'failed phases')}`,
    },
    {
      label: t('الاحتياطي المستخدم', 'Reserve used'),
      value: fmtMoney(simulation.reserveUsedM),
      hint: t(`من ${fmtMoney(design.cost.reserveM)}`, `of ${fmtMoney(design.cost.reserveM)}`),
    },
    {
      label: t('البيانات المفقودة', 'Data lost'),
      value: `${fmt(simulation.dataLostGb, 2)} GB`,
      hint: `${simulation.events.length} ${t('أحداث', 'events')}`,
    },
    {
      label: t('النمط الآمن', 'Safe mode'),
      value: `${fmt(simulation.safeModeDays)} ${t('يوم', 'days')}`,
      hint: `${fmt(simulation.linkHoursLost, 1)} ${t('ساعة اتصال مفقودة', 'link hours lost')}`,
    },
  ];

  return (
    <div className="space-y-5">
      {chapter ? <CampaignDebrief onOpenCampaign={onCampaign} /> : null}

      <section className="border border-royal-700">
        <Frieze className="text-royal-500" />
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[11px] text-ochre-300">{t('ملف المهمة', 'Mission file')}</span>
            <span className="font-latin text-[11px] tabular-nums text-limestone-400" dir="ltr">
              {simulation.runId}
            </span>
          </div>

          <div className="mt-3 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <Cartouche className="max-w-full">
                <span className="truncate font-display text-lg text-limestone-50">{l(design.target.name)}</span>
              </Cartouche>
              <p className="mt-2 text-sm text-limestone-300">
                {l(design.missionType.name)} / {l(design.tier.name)}
              </p>
              <h2 className="mt-3 font-display text-[24px] leading-[1.3] text-limestone-50 sm:text-[30px]">
                {l(score.headline)}
              </h2>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-xs">
                <StatusPill tone={outcome.tone}>{t(outcome.ar, outcome.en)}</StatusPill>
                <span className="text-limestone-400">{fmtDateTime(score.createdAt, lang)}</span>
                <span className="font-latin tabular-nums text-limestone-400" dir="ltr">
                  {design.choices.seed}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:flex-col md:items-end">
              <div className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center border-2 ${gradeTone[score.grade]}`}>
                <span className="font-latin text-4xl leading-none" dir="ltr">{score.grade}</span>
                <span className="mt-1 text-[10px] text-limestone-400">{t('تقدير', 'Grade')}</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1" dir="ltr">
                  <span className="font-latin text-3xl leading-none tabular-nums text-limestone-50">
                    {fmt(score.breakdown.total, 1)}
                  </span>
                  <span className="text-sm text-limestone-400">/ 100</span>
                </div>
                <div className="mt-1 text-[11px] text-limestone-400">{t('الدرجة النهائية', 'Final score')}</div>
              </div>
              <div className="hidden overflow-hidden border border-royal-700 md:block">
                <TargetImage target={design.target} className="h-16 w-16" compact />
              </div>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 border-t border-royal-700 sm:grid-cols-3 lg:grid-cols-6">
            {coverData.map((item) => (
              <div key={item.label} className="border-b border-royal-700 py-2 pe-3 sm:border-e sm:last:border-e-0">
                <dt className="text-[10px] text-limestone-400">{item.label}</dt>
                <dd
                  className={`mt-0.5 truncate text-xs text-limestone-100 ${item.latin ? 'font-latin tabular-nums' : ''}`}
                  dir={item.latin ? 'ltr' : undefined}
                  title={item.value}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-royal-700 pt-3">
            <p className="max-w-[62ch] text-sm leading-relaxed text-limestone-300">
              {t(
                'الدرجة ليست حكمًا نهائيًا: كل بند أدناه مرتبط بقرار اتخذته. اختبر تغييرًا واحدًا وأعد التشغيل بالبذرة نفسها لعزل أثره.',
                'The score is not a final verdict: every line below ties back to a decision you made. Change one thing and rerun with the same seed to isolate its effect.',
              )}
            </p>
            <button type="button" onClick={() => onLearn('evaluation')} className="btn-ghost text-xs">
              <IconBook className="h-4 w-4" />
              {t('كيف تُحسب النتيجة؟', 'How is the score computed?')}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <section className="min-w-0 border-t-2 border-ochre-400 pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-[11px] text-ochre-300">{t('قراءة النتيجة', 'Reading the result')}</div>
              <h2 className="mt-1 font-display text-2xl text-limestone-50">{t('لماذا هذه النتيجة؟', 'Why this result?')}</h2>
            </div>
            <span className="text-[11px] text-limestone-400">
              {score.reasons.length > 0
                ? t(`${score.reasons.length} أسباب مرتبة بالأثر`, `${score.reasons.length} causes, ordered by impact`)
                : t('لا ملاحظات سلبية', 'No negative findings')}
            </span>
          </div>

          {score.reasons.length === 0 ? (
            <InlineNote tone="good" className="mt-4">
              {t('لا ملاحظات سلبية: التصميم والتنفيذ متوازنان.', 'No negative findings: the design and execution are balanced.')}
            </InlineNote>
          ) : (
            <ol className="mt-3">
              {score.reasons.map((reason, index) => (
                <li
                  key={`${reason.en}-${index}`}
                  className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-3 border-t border-royal-700 py-3.5"
                >
                  <span className="font-latin text-lg leading-none tabular-nums text-ochre-400" dir="ltr">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base leading-[1.8] text-limestone-100">{l(reason)}</p>
                </li>
              ))}
            </ol>
          )}

          <SimplifiedNote className="mt-4">
            {t(
              'الدرجة أداة تعلّم وليست تقييمًا هندسيًا معتمدًا. الأوزان مضبوطة للعب: العلم 35، الميزانية 20، الهوامش 20، الموثوقية 25.',
              'The score is a learning tool, not a certified engineering assessment. Weights are tuned for play: science 35, budget 20, margins 20, reliability 25.',
            )}
          </SimplifiedNote>
        </section>

        <aside className="border-t border-royal-700 pt-4 xl:border-s xl:border-t-0 xl:ps-5 xl:pt-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-base text-limestone-50">{t('تفصيل الدرجة', 'Score breakdown')}</h3>
            <StatusPill tone={totalTone}>{fmt(score.breakdown.total, 1)} / 100</StatusPill>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-limestone-400">
            {t(
              'مئة نقطة على أربعة أبعاد. النسبة أسفل كل مسطرة هي ما حصلت عليه من سقف البند.',
              'One hundred points across four dimensions. The proportion under each ruler is what you earned of that ceiling.',
            )}
          </p>

          <div className="mt-2">
            {dimensions.map((dimension) => {
              const value = score.breakdown[dimension.key];
              const ratio = value / dimension.max;
              return (
                <div key={dimension.key} className="border-t border-royal-700 py-2.5 first:border-t-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="text-xs text-limestone-100">{t(dimension.title.ar, dimension.title.en)}</span>
                    <span className="font-latin text-[11px] tabular-nums text-limestone-300" dir="ltr">
                      {fmt(value, 1)} / {dimension.max}
                      <span className="ms-1.5 text-limestone-400">{fmtPct(ratio, 0)}</span>
                    </span>
                  </div>
                  <Bar
                    className="mt-1.5"
                    ratio={ratio}
                    tone={dimension.tone}
                    aria-label={`${t(dimension.title.ar, dimension.title.en)} ${fmtPct(ratio, 0)}`}
                  />
                  <p className="mt-1 text-[10px] leading-relaxed text-limestone-400">{t(dimension.hint.ar, dimension.hint.en)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-2 border-t border-royal-700 pt-2">
            <div className="text-[10px] text-limestone-400">{t('بوابات النجاح', 'Success gates')}</div>
            {[
              {
                key: 'science',
                label: t('العلم', 'Science'),
                met: score.tierMet.science,
                value: `${fmt(simulation.scienceAchieved, 1)} / ${fmt(design.tier.minScience, 0)}`,
              },
              {
                key: 'data',
                label: t('البيانات', 'Data'),
                met: score.tierMet.data,
                value: `${fmt(simulation.dataSentGb, 2)} / ${fmt(design.tier.minDataGb, 1)} GB`,
              },
            ].map((gate) => (
              <div key={gate.key} className="flex items-baseline justify-between gap-2 border-b border-royal-700 py-1.5 last:border-0">
                <span className="inline-flex items-baseline gap-1.5 text-xs text-limestone-200">
                  {gate.met ? (
                    <IconCheck className="h-3.5 w-3.5 self-center text-malachite" />
                  ) : (
                    <IconAlert className="h-3.5 w-3.5 self-center text-amber" />
                  )}
                  {gate.label}
                </span>
                <span className="font-latin text-[11px] tabular-nums text-limestone-300" dir="ltr">{gate.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Section
          title={t('قرارات نجحت', 'What worked')}
          description={t('أقوى القرارات الإيجابية في هذا التصميم.', 'The strongest positive decisions in this design.')}
          action={<StatusPill tone="good"><IconThumbUp className="h-3 w-3" aria-hidden="true" /> {score.positives.length}</StatusPill>}
        >
          {score.positives.length === 0 ? (
            <InlineNote tone="neutral">
              {t('لا قرارات إيجابية بارزة في هذه الجولة. ابدأ بحزمة أجهزة متوافقة وهامش كتلة صحي.', 'No standout positive decisions this run. Start with a compatible instrument suite and a healthy mass margin.')}
            </InlineNote>
          ) : (
            <ul>
              {score.positives.map((impact) => (
                <DecisionRow key={impact.id} impact={impact} positive />
              ))}
            </ul>
          )}
        </Section>

        <Section
          title={t('قرارات كلّفتك نقاطًا', 'What cost you points')}
          description={t('أهم نقاط الضعف، مع انتقال مباشر إلى الخطوة المسؤولة.', 'The biggest weaknesses, with a direct jump to the responsible step.')}
          action={<StatusPill tone={score.negatives.length > 0 ? 'danger' : 'good'}><IconThumbDown className="h-3 w-3" aria-hidden="true" /> {score.negatives.length}</StatusPill>}
        >
          {score.negatives.length === 0 ? (
            <InlineNote tone="good">
              {t('لا نقاط ضعف بارزة. حافظ على هذا التوازن عند إعادة التشغيل.', 'No major weaknesses. Keep this balance when you rerun.')}
            </InlineNote>
          ) : (
            <ul>
              {score.negatives.map((impact) => (
                <DecisionRow key={impact.id} impact={impact} positive={false} />
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section
        title={t('خطة التحسين', 'Improvement plan')}
        description={t('تعديلات محددة مرتبطة بأرقام تصميمك الحالي. جرّب واحدًا فقط ثم أعد التشغيل بالبذرة نفسها.', 'Concrete changes tied to your current numbers. Try one at a time, then rerun with the same seed.')}
        action={<GameBadge />}
      >
        <ol>
          {score.improvements.map((improvement, index) => (
            <li
              key={`${improvement.en}-${index}`}
              className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-3 border-t border-royal-700 py-3 first:border-t-0"
            >
              <span className="font-latin text-sm leading-none tabular-nums text-ochre-400" dir="ltr">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-base leading-[1.8] text-limestone-100">{l(improvement)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title={t('ملخص التشغيل', 'Run summary')}
        description={t('تفاصيل المحاكاة المحفوظة التي بُني عليها هذا التقرير.', 'The saved simulation details behind this report.')}
        action={<StatusPill tone={simulation.success ? 'good' : 'danger'}>{simulation.success ? t('مهمة مكتملة', 'Completed') : t('مهمة فاشلة', 'Lost')}</StatusPill>}
      >
        <dl className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 xl:grid-cols-6">
          {runSummary.map((item) => (
            <div key={item.label} className="border-t border-royal-700 py-2">
              <dt className="text-[10px] text-limestone-400">{item.label}</dt>
              <dd className="mt-0.5 truncate font-latin text-sm tabular-nums text-limestone-100" dir="ltr" title={item.value}>
                {item.value}
              </dd>
              <dd className="text-[10px] leading-snug text-limestone-400">{item.hint}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
          <div className="font-latin text-[10px] text-limestone-400" dir="ltr">
            {simulation.runId} / {fmtDateTime(simulation.createdAt, lang)}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openSimulation} className="btn-ghost text-xs">
              <IconHistory className="h-4 w-4" />
              {t('افتح المحاكاة', 'Open simulation')}
            </button>
            <button type="button" onClick={() => onLearn('evaluation')} className="btn-ghost text-xs">
              <IconBook className="h-4 w-4" />
              {t('تعلّم التقييم', 'Learn scoring')}
            </button>
          </div>
        </div>
      </Section>

      <AchievementsHighlight onOpenProfile={onProfile} />

      <HistoryPanels />

      {!chapter ? (
        <Section
          title={t('أعد المحاولة', 'Try again')}
          description={t('ثلاث طرق مختلفة لعزل أثر قراراتك. «نفس البذرة» هي أفضل طريقة لمقارنة تصميمين بعدل.', 'Three ways to isolate the effect of your choices. “Same seed” is the fairest way to compare two designs.')}
          action={<span className="text-[11px] text-limestone-400">{t('ثلاثة مسارات', 'Three paths')}</span>}
        >
          <div className="border-t border-royal-700">
            {[
              {
                key: 'choices',
                title: t('عدّل نفس التصميم', 'Tweak this design'),
                detail: t('يعيدك للخطوة 1 مع الاحتفاظ بكل الخيارات والبذرة الحالية.', 'Returns to step 1 keeping every choice and the current seed.'),
                label: t('نفس الخيارات', 'Same choices'),
                tag: null,
                icon: IconTune,
                action: replaySameChoices,
              },
              {
                key: 'seed',
                title: t('نفس البذرة', 'Same seed'),
                detail: t('تصميم افتراضي جديد مع الإبقاء على سلسلة الأحداث نفسها.', 'A fresh default design while keeping the same event sequence.'),
                label: t('أعد التصميم', 'Redesign'),
                tag: t('مقارنة عادلة', 'fair test'),
                icon: IconDice,
                action: replaySameSeed,
              },
              {
                key: 'scratch',
                title: t('من الصفر', 'From scratch'),
                detail: t('تصميم افتراضي جديد وبذرة جديدة تمامًا. المحاولات السابقة تبقى محفوظة.', 'A fresh default design and a brand-new seed. Earlier attempts stay saved.'),
                label: t('جولة جديدة', 'Fresh run'),
                tag: null,
                icon: IconReset,
                action: replayFromScratch,
              },
            ].map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={item.action}
                className="grid w-full grid-cols-[28px_minmax(0,1fr)] items-baseline gap-x-3 border-b border-royal-700 py-3 text-start last:border-b-0 hover:bg-royal-700/20 focus-visible:bg-royal-700/25 sm:grid-cols-[28px_minmax(0,1fr)_150px]"
              >
                <span className="font-latin text-sm tabular-nums text-ochre-400" dir="ltr">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm text-limestone-50">{item.title}</span>
                    {item.tag ? <span className="text-[10px] text-ochre-300">{item.tag}</span> : null}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-limestone-400">{item.detail}</span>
                </span>
                <span className="col-start-2 mt-1 inline-flex items-baseline gap-1.5 text-[11px] text-limestone-300 sm:col-start-3 sm:mt-0 sm:justify-self-end">
                  <item.icon className="h-3.5 w-3.5 self-center" />
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-royal-700 pt-3">
            <p className="text-[11px] text-limestone-400">
              {attempts.length > 0
                ? t(`محفوظ محليًا: ${attempts.length} محاولة، وبذرة ${design.choices.seed}.`, `Saved locally: ${attempts.length} attempt(s), seed ${design.choices.seed}.`)
                : t('ستُحفظ الجولة القادمة محليًا تلقائيًا.', 'The next run will be saved locally automatically.')}
            </p>
            <button type="button" onClick={openSimulation} className="btn-secondary text-xs">
              <IconPlay className="h-4 w-4" />
              {t('أعد التشغيل الآن', 'Run again now')}
            </button>
          </div>
        </Section>
      ) : null}

      {chapter && isChapterCompleted && next ? (
        <div className="rounded-2xl border-2 border-ochre-400/90 bg-gradient-to-r from-royal-950 via-lapis-900 to-royal-950 p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="min-w-0 text-center sm:text-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="rounded-full bg-malachite/20 border border-malachite/60 px-2.5 py-0.5 font-latin text-[10px] font-bold text-malachite">
                {t(`الفصل التالي 0${next.number} متاح 🚀`, `Next Chapter 0${next.number} Unlocked 🚀`)}
              </span>
              <span className="font-latin text-xs text-limestone-300">
                {next.code} • {next.year}
              </span>
            </div>
            <h4 className="mt-1 font-display text-base sm:text-lg font-bold text-limestone-50">
              {l(next.title)}: <span className="text-ochre-300 font-normal">{l(next.subtitle)}</span>
            </h4>
            <p className="mt-0.5 text-xs text-limestone-200">
              {l(next.objective)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (startCampaignChapter(next.id)) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="btn-primary w-full sm:w-auto !min-h-[46px] !px-6 text-sm font-bold shadow-xl flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] transition-transform"
          >
            <IconPlay className="h-5 w-5" />
            <span>{t(`ابدأ الفصل 0${next.number}: ${l(next.title)} 🚀`, `Launch Chapter 0${next.number}: ${l(next.title)} 🚀`)}</span>
          </button>
        </div>
      ) : null}

      <SimplifiedNote>
        {t(
          'المحاولات ولوحة الصدارة محفوظة في هذا المتصفح فقط. تصدير التصميم من القائمة العلوية ينقل الخيارات، وليس النتائج.',
          'Attempts and the leaderboard live in this browser only. Exporting the design from the top menu transfers choices, not results.',
        )}
      </SimplifiedNote>
    </div>
  );
}
