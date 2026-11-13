import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Crown,
  Database,
  Dices,
  FlaskConical,
  History,
  Medal,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Target as TargetIcon,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Wrench,
  XCircle,
} from 'lucide-react';
import type { AttemptSummary, DecisionImpact, ScoreResult } from '../data/types';
import { missionTypeById } from '../data/missions';
import { targetById } from '../data/targets';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useActiveChapter } from '../store/useCampaign';
import { useMissionStore } from '../store/useMissionStore';
import { GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { AchievementsHighlight } from '../components/Achievements';
import { CampaignDebrief } from '../components/CampaignDebrief';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, Stat } from '../components/StepBits';
import { TargetImage } from '../components/TargetImage';

const gradeStyle: Record<ScoreResult['grade'], string> = {
  S: 'border-gold-300/60 bg-gold-400/15 text-gold-200 shadow-gold',
  A: 'border-gold-400/40 bg-gold-400/10 text-gold-200',
  B: 'border-good/40 bg-good/10 text-good',
  C: 'border-royal-400/40 bg-royal-500/10 text-royal-200',
  D: 'border-warn/40 bg-warn/10 text-warn',
  F: 'border-danger/40 bg-danger/10 text-danger',
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
    title: { ar: 'الموثوقية والتنفيذ', en: 'Reliability & execution' },
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
      <Section
        title={t('لا يوجد تقرير بعد', 'No report yet')}
        description={t(
          'التقييم يقرأ نتيجة محاكاة محفوظة. شغّل المحاكاة أولًا ثم عد إلى هنا.',
          'Evaluation reads a saved simulation result. Run the simulation first, then return here.',
        )}
        action={<GameBadge />}
      >
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/25 bg-gold-400/[0.07] text-gold-300">
            <Trophy className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="mt-4 text-base font-bold text-white">{t('المهمة تنتظر التشغيل', 'The mission is waiting to be run')}</div>
          <p className="mt-1 max-w-md text-[11px] leading-relaxed text-slate-400">
            {t(
              'ستحصل على درجة من 100 موزعة على العلم والميزانية والهوامش والموثوقية، مع تفسير كل خصم وخطوة إصلاحه.',
              'You will get a score out of 100 split across science, budget, margins and reliability, with an explanation for every deduction and the step that fixes it.',
            )}
          </p>
          {design.blockingIssues.length > 0 ? (
            <p className="mt-3 max-w-md text-[10px] font-semibold leading-relaxed text-danger">
              {t(
                `المحاكاة محجوبة حاليًا بـ ${design.blockingIssues.length} خطأ مانع. أصلحها من مركز التحقق أو من الخطوة المعنية.`,
                `The simulation is currently blocked by ${design.blockingIssues.length} error(s). Fix them from the validation center or the relevant step.`,
              )}
            </p>
          ) : null}
          <button type="button" onClick={onOpenSimulation} className="btn-primary mt-5 text-sm">
            <Play className="h-4 w-4" aria-hidden="true" />
            {t('إلى خطوة المحاكاة', 'Go to simulation')}
          </button>
          <p className="mt-2 text-[10px] text-slate-600">
            {attempts.length > 0
              ? t(`لديك ${attempts.length} محاولة محفوظة من جولات سابقة.`, `${attempts.length} earlier attempt(s) are saved.`)
              : t('ستُسجل المحاولة الأولى تلقائيًا عند التشغيل.', 'Your first attempt will be recorded automatically when you run.')}
          </p>
        </div>
      </Section>

      <HistoryPanels />
    </div>
  );
}

function ImpactCard({ impact, positive }: { impact: DecisionImpact; positive: boolean }) {
  const t = useT();
  const l = useL();
  const setStep = useMissionStore((state) => state.setStep);
  return (
    <div className={`rounded-xl border p-3 ${positive ? 'border-good/20 bg-good/[0.045]' : 'border-danger/20 bg-danger/[0.045]'}`}>
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${positive ? 'bg-good/10 text-good' : 'bg-danger/10 text-danger'}`}>
          {positive ? <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold text-white">{l(impact.title)}</div>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{l(impact.detail)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStep(impact.step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-bold text-slate-200 transition hover:border-white/25 hover:bg-white/10"
        >
          <Wrench className="h-3 w-3" aria-hidden="true" />
          {positive ? t('راجع', 'Review') : t('أصلح', 'Fix')}
          <span className="num opacity-60">0{impact.step}</span>
        </button>
      </div>
    </div>
  );
}

function AttemptsTable({ attempts, currentId }: { attempts: AttemptSummary[]; currentId?: string }) {
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
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[540px] border-collapse text-start">
        <thead>
          <tr className="border-b border-white/[0.07] text-[9px] font-bold uppercase tracking-wider text-slate-500">
            <th className="px-2 py-1.5 text-start">{t('الهدف', 'Target')}</th>
            <th className="px-2 py-1.5 text-start">{t('البذرة', 'Seed')}</th>
            <th className="px-2 py-1.5 text-start">{t('العلم', 'Science')}</th>
            <th className="px-2 py-1.5 text-start">{t('البيانات', 'Data')}</th>
            <th className="px-2 py-1.5 text-start">{t('النتيجة', 'Score')}</th>
            <th className="px-2 py-1.5 text-start">{t('التاريخ', 'Date')}</th>
          </tr>
        </thead>
        <tbody>
          {attempts.slice(0, 6).map((attempt) => {
            const current = attempt.id === currentId;
            return (
              <tr
                key={attempt.id}
                className={`border-b border-white/[0.05] text-[10px] last:border-0 ${current ? 'bg-gold-400/[0.055]' : ''}`}
              >
                <td className="px-2 py-2">
                  <div className="font-semibold text-slate-200">{attemptName(attempt)}</div>
                  <div className="text-[9px] text-slate-500">
                    {missionTypeById[attempt.missionType] ? l(missionTypeById[attempt.missionType].short) : attempt.missionType}
                    {current ? <span className="ms-1 font-bold text-gold-300">{t('— هذه الجولة', '— this run')}</span> : null}
                  </div>
                </td>
                <td className="max-w-[110px] truncate px-2 py-2 font-latin text-slate-400" dir="ltr">{attempt.seed}</td>
                <td className="px-2 py-2 font-latin text-slate-300" dir="ltr">{fmt(attempt.science, 1)}</td>
                <td className="px-2 py-2 font-latin text-slate-300" dir="ltr">{fmt(attempt.dataSentGb, 2)} GB</td>
                <td className="px-2 py-2">
                  <span className={`inline-flex items-center gap-1.5 font-latin font-extrabold ${attempt.success ? 'text-good' : 'text-danger'}`} dir="ltr">
                    {fmt(attempt.score, 1)}
                    <span className="rounded bg-white/[0.06] px-1 text-[9px] text-white">{attempt.grade}</span>
                  </span>
                </td>
                <td className="px-2 py-2 text-[9px] text-slate-500">{fmtDateTime(attempt.createdAt, lang)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
    <div className="space-y-1.5">
      {leaderboard.slice(0, 6).map((entry, index) => (
        <div
          key={`${entry.id}-${entry.name}`}
          className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 ${
            index === 0 ? 'border-gold-400/30 bg-gold-400/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'
          }`}
        >
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-latin text-[10px] font-black ${
            index === 0 ? 'bg-gold-400 text-void-950' : index < 3 ? 'bg-white/10 text-gold-200' : 'bg-white/[0.05] text-slate-400'
          }`}>
            {index === 0 ? <Crown className="h-3 w-3" aria-hidden="true" /> : index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-bold text-slate-200">
              {entry.name}
              {entry.name === pilotName ? <span className="ms-1.5 text-[9px] font-semibold text-royal-300">{t('أنت', 'you')}</span> : null}
            </div>
            <div className="truncate text-[9px] text-slate-500">
              {attemptName(entry)} · {missionTypeById[entry.missionType] ? l(missionTypeById[entry.missionType].short) : entry.missionType}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="font-latin text-xs font-extrabold text-white" dir="ltr">{fmt(entry.score, 1)}</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-white/10 bg-white/[0.05] px-1 font-latin text-[9px] font-black text-gold-200">
              {entry.grade}
            </span>
          </div>
        </div>
      ))}
    </div>
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
        action={<StatusPill tone="muted"><History className="h-3 w-3" aria-hidden="true" /> {attempts.length}</StatusPill>}
      >
        <AttemptsTable attempts={attempts} currentId={simulation?.runId} />
      </Section>
      <Section
        className="min-w-0"
        title={t('لوحة الصدارة', 'Leaderboard')}
        description={t('أفضل عشر نتائج على هذا المتصفح. لا خادم ولا حسابات.', 'The top ten scores in this browser. No server or accounts.')}
        action={<StatusPill tone="info"><Medal className="h-3 w-3" aria-hidden="true" /> {t('محلي', 'Local')}</StatusPill>}
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
  const attempts = useMissionStore((state) => state.attempts);
  const setStep = useMissionStore((state) => state.setStep);
  const replaySameChoices = useMissionStore((state) => state.replaySameChoices);
  const replaySameSeed = useMissionStore((state) => state.replaySameSeed);
  const replayFromScratch = useMissionStore((state) => state.replayFromScratch);

  const openSimulation = () => {
    setStep(10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!simulation || !score) {
    return <EmptyEvaluation onOpenSimulation={openSimulation} />;
  }

  const outcome = outcomeStyle[score.outcome];
  const totalTone = score.grade === 'S' || score.grade === 'A' ? 'gold' : score.grade === 'F' || score.grade === 'D' ? 'danger' : 'royal';
  const scienceRatio = design.tier.minScience > 0 ? simulation.scienceAchieved / design.tier.minScience : 1;
  const dataRatio = design.tier.minDataGb > 0 ? simulation.dataSentGb / design.tier.minDataGb : 1;

  return (
    <div className="space-y-4">
      {chapter ? <CampaignDebrief onOpenCampaign={onCampaign} /> : null}

      <section className={`relative overflow-hidden rounded-2xl border p-4 sm:p-6 ${
        simulation.success ? 'border-gold-400/25 bg-gradient-to-br from-gold-400/[0.08] via-royal-500/[0.05] to-transparent' : 'border-danger/25 bg-gradient-to-br from-danger/[0.08] to-transparent'
      }`}>
        <div className="pointer-events-none absolute -end-16 -top-20 h-52 w-52 rounded-full bg-gold-400/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-3xl border ${gradeStyle[score.grade]}`}>
              <span className="font-latin text-4xl font-black leading-none" dir="ltr">{score.grade}</span>
              <span className="mt-1 font-latin text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('التقدير', 'Grade')}</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={`font-latin text-4xl font-black leading-none ${totalTone === 'gold' ? 'text-gold-200' : totalTone === 'danger' ? 'text-danger' : 'text-royal-200'}`} dir="ltr">
                  {fmt(score.breakdown.total, 1)}
                </span>
                <span className="text-sm font-bold text-slate-500">/ 100</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <StatusPill tone={outcome.tone}>{t(outcome.ar, outcome.en)}</StatusPill>
                <span className="chip !px-2 !py-0.5 font-latin !text-[9px]" dir="ltr">{simulation.runId}</span>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black leading-snug text-white sm:text-xl">{l(score.headline)}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="chip !text-[10px]"><TargetIcon className="h-3 w-3 text-royal-300" aria-hidden="true" />{l(design.target.name)}</span>
              <span className="chip !text-[10px]">{l(design.missionType.short)}</span>
              <span className="chip !text-[10px]">{l(design.tier.name)}</span>
              <span className="chip !text-[10px] font-latin" dir="ltr">{design.choices.seed}</span>
              <span className="chip !text-[10px]">{fmtDateTime(score.createdAt, lang)}</span>
            </div>
          </div>

          <div className="hidden w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:block lg:w-28">
            <TargetImage target={design.target} className="aspect-square w-full" compact />
          </div>
        </div>

        <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
          <p className="max-w-2xl text-[10px] leading-relaxed text-slate-400">
            {t(
              'الدرجة ليست حكمًا نهائيًا: كل بند أدناه مرتبط بقرار اتخذته. اختبر تغييرًا واحدًا وأعد التشغيل بالبذرة نفسها لعزل أثره.',
              'The score is not a final verdict: every line below ties back to a decision you made. Change one thing and rerun with the same seed to isolate its effect.',
            )}
          </p>
          <button type="button" onClick={() => onLearn('evaluation')} className="btn-ghost !px-3 !py-1.5 text-[10px]">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {t('كيف تُحسب النتيجة؟', 'How is the score computed?')}
          </button>
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={t('العلم مقابل المعيار', 'Science vs tier')}
          value={<>{fmt(simulation.scienceAchieved, 1)} <span className="text-[10px]">/ {fmt(design.tier.minScience, 0)}</span></>}
          hint={score.tierMet.science ? t('تحقق المعيار العلمي', 'Science tier met') : t(`فجوة ${fmt(Math.max(0, design.tier.minScience - simulation.scienceAchieved), 1)} نقطة`, `${fmt(Math.max(0, design.tier.minScience - simulation.scienceAchieved), 1)} point gap`)}
          tone={score.tierMet.science ? 'good' : 'warn'}
        />
        <Stat
          label={t('البيانات مقابل المعيار', 'Data vs tier')}
          value={<>{fmt(simulation.dataSentGb, 2)} <span className="text-[10px]">/ {fmt(design.tier.minDataGb, 1)} GB</span></>}
          hint={score.tierMet.data ? t('تحقق معيار البيانات', 'Data tier met') : t(`فجوة ${fmt(Math.max(0, design.tier.minDataGb - simulation.dataSentGb), 2)} GB`, `${fmt(Math.max(0, design.tier.minDataGb - simulation.dataSentGb), 2)} GB gap`)}
          tone={score.tierMet.data ? 'good' : 'warn'}
        />
        <Stat
          label={t('التكلفة بعد الأحداث', 'Cost after events')}
          value={fmtMoney(design.cost.totalM + simulation.reserveUsedM + simulation.budgetOverrunM)}
          hint={`${t('الميزانية', 'Budget')} ${fmtMoney(design.cost.budgetM, 0)} · ${simulation.budgetOverrunM > 0 ? t(`تجاوز ${fmtMoney(simulation.budgetOverrunM)}`, `${fmtMoney(simulation.budgetOverrunM)} over`) : t('داخل السقف', 'within cap')}`}
          tone={simulation.budgetOverrunM > 0 ? 'danger' : 'good'}
        />
        <Stat
          label={t('الموثوقية بعد الأحداث', 'Reliability after events')}
          value={fmtPct(simulation.reliability)}
          hint={`${simulation.events.length} ${t('أحداث', 'events')} · ${fmt(simulation.totalDays, 1)} ${t('يوم', 'days')}`}
          tone="royal"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Section
          title={t('تفصيل الدرجة', 'Score breakdown')}
          description={t('100 نقطة موزعة على أربعة أبعاد. النسبة بجانب كل بند هي ما حصلت عليه من سقفه.', '100 points across four dimensions. The percentage shows what you earned out of each ceiling.')}
          action={<StatusPill tone={totalTone === 'gold' ? 'warn' : totalTone === 'danger' ? 'danger' : 'info'}>{fmt(score.breakdown.total, 1)} / 100</StatusPill>}
        >
          <div className="space-y-4">
            {dimensions.map((dimension) => {
              const value = score.breakdown[dimension.key];
              const ratio = value / dimension.max;
              return (
                <div key={dimension.key}>
                  <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-[11px] font-bold text-slate-200">{t(dimension.title.ar, dimension.title.en)}</span>
                    <span className="font-latin text-[10px] font-bold text-slate-400" dir="ltr">
                      {fmt(value, 1)} / {dimension.max}
                      <span className="ms-1.5 text-slate-600">{fmtPct(ratio, 0)}</span>
                    </span>
                  </div>
                  <Bar ratio={ratio} tone={dimension.tone} aria-label={`${t(dimension.title.ar, dimension.title.en)} ${fmtPct(ratio, 0)}`} />
                  <p className="mt-1 text-[9px] leading-relaxed text-slate-500">{t(dimension.hint.ar, dimension.hint.en)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 border-t border-white/[0.07] pt-3 sm:grid-cols-2">
            <div className={`rounded-xl border px-3 py-2 ${scienceRatio >= 1 ? 'border-good/20 bg-good/[0.04]' : 'border-warn/20 bg-warn/[0.04]'}`}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
                {scienceRatio >= 1 ? <CheckCircle2 className="h-3.5 w-3.5 text-good" aria-hidden="true" /> : <XCircle className="h-3.5 w-3.5 text-warn" aria-hidden="true" />}
                {t('العلم', 'Science')}
              </div>
              <div className="mt-1 font-latin text-sm font-extrabold text-white" dir="ltr">
                {fmt(simulation.scienceAchieved, 1)} / {fmt(design.tier.minScience, 0)}
              </div>
            </div>
            <div className={`rounded-xl border px-3 py-2 ${dataRatio >= 1 ? 'border-good/20 bg-good/[0.04]' : 'border-warn/20 bg-warn/[0.04]'}`}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
                {dataRatio >= 1 ? <CheckCircle2 className="h-3.5 w-3.5 text-good" aria-hidden="true" /> : <Database className="h-3.5 w-3.5 text-warn" aria-hidden="true" />}
                {t('البيانات', 'Data')}
              </div>
              <div className="mt-1 font-latin text-sm font-extrabold text-white" dir="ltr">
                {fmt(simulation.dataSentGb, 2)} / {fmt(design.tier.minDataGb, 1)} GB
              </div>
            </div>
          </div>
        </Section>

        <Section
          title={t('لماذا هذه النتيجة؟', 'Why this result?')}
          description={t('الأسباب مرتبة حسب الأثر. كل سبب مشتق من تصميمك ونتيجة محاكيتك.', 'Causes ordered by impact. Each one is derived from your design and simulation result.')}
          action={<StatusPill tone="info"><FlaskConical className="h-3 w-3" aria-hidden="true" /> {t('تفسير', 'Explainable')}</StatusPill>}
        >
          {score.reasons.length === 0 ? (
            <InlineNote tone="good">
              {t('لا ملاحظات سلبية: التصميم والتنفيذ متوازنان.', 'No negative findings: the design and execution are balanced.')}
            </InlineNote>
          ) : (
            <ol className="space-y-2">
              {score.reasons.map((reason, index) => (
                <li key={`${reason.en}-${index}`} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-royal-500/15 font-latin text-[9px] font-bold text-royal-300">
                    {index + 1}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-300">{l(reason)}</p>
                </li>
              ))}
            </ol>
          )}
          <SimplifiedNote className="mt-3">
            {t(
              'الدرجة أداة تعلّم وليست تقييمًا هندسيًا معتمدًا. الأوزان مضبوطة للعب: العلم 35، الميزانية 20، الهوامش 20، الموثوقية 25.',
              'The score is a learning tool, not a certified engineering assessment. Weights are tuned for play: science 35, budget 20, margins 20, reliability 25.',
            )}
          </SimplifiedNote>
        </Section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Section
          title={t('قرارات نجحت', 'What worked')}
          description={t('أقوى القرارات الإيجابية في هذا التصميم.', 'The strongest positive decisions in this design.')}
          action={<StatusPill tone="good"><ThumbsUp className="h-3 w-3" aria-hidden="true" /> {score.positives.length}</StatusPill>}
        >
          {score.positives.length === 0 ? (
            <InlineNote tone="neutral">{t('لا قرارات إيجابية بارزة في هذه الجولة. ابدأ بحزمة أجهزة متوافقة وهامش كتلة صحي.', 'No standout positive decisions this run. Start with a compatible instrument suite and a healthy mass margin.')}</InlineNote>
          ) : (
            <div className="space-y-2">
              {score.positives.map((impact) => <ImpactCard key={impact.id} impact={impact} positive />)}
            </div>
          )}
        </Section>

        <Section
          title={t('قرارات كلّفتك نقاطًا', 'What cost you points')}
          description={t('أهم نقاط الضعف، مع انتقال مباشر إلى الخطوة المسؤولة.', 'The biggest weaknesses, with a direct jump to the responsible step.')}
          action={<StatusPill tone={score.negatives.length > 0 ? 'danger' : 'good'}><ThumbsDown className="h-3 w-3" aria-hidden="true" /> {score.negatives.length}</StatusPill>}
        >
          {score.negatives.length === 0 ? (
            <InlineNote tone="good">{t('لا نقاط ضعف بارزة. حافظ على هذا التوازن عند إعادة التشغيل.', 'No major weaknesses. Keep this balance when you rerun.')}</InlineNote>
          ) : (
            <div className="space-y-2">
              {score.negatives.map((impact) => <ImpactCard key={impact.id} impact={impact} positive={false} />)}
            </div>
          )}
        </Section>
      </div>

      <Section
        title={t('خطة التحسين', 'Improvement plan')}
        description={t('تعديلات محددة مرتبطة بأرقام تصميمك الحالي. جرّب واحدًا فقط ثم أعد التشغيل بالبذرة نفسها.', 'Concrete changes tied to your current numbers. Try one at a time, then rerun with the same seed.')}
        action={<GameBadge />}
      >
        <div className="space-y-2">
          {score.improvements.map((improvement, index) => (
            <div key={`${improvement.en}-${index}`} className="flex items-start gap-2.5 rounded-xl border border-gold-400/15 bg-gold-400/[0.035] p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gold-400/15 font-latin text-[10px] font-black text-gold-200">
                {index + 1}
              </span>
              <p className="text-[11px] leading-relaxed text-slate-200">{l(improvement)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={t('ملخص التشغيل', 'Run summary')}
        description={t('تفاصيل المحاكاة المحفوظة التي بُني عليها هذا التقرير.', 'The saved simulation details behind this report.')}
        action={<StatusPill tone={simulation.success ? 'good' : 'danger'}>{simulation.success ? t('مهمة مكتملة', 'Completed') : t('مهمة فاشلة', 'Lost')}</StatusPill>}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          <Stat label={t('البذرة', 'Seed')} value={<span className="block max-w-[9rem] truncate text-xs">{design.choices.seed}</span>} hint={t('قابلة للتكرار', 'Reproducible')} />
          <Stat label={t('المراحل', 'Phases')} value={fmt(simulation.phases.filter((phase) => phase.outcome !== 'skipped').length)} hint={`${simulation.phases.length} ${t('مسجلة', 'recorded')}`} />
          <Stat label={t('الأحداث', 'Events')} value={fmt(simulation.events.length)} hint={`${simulation.phases.filter((phase) => phase.outcome === 'failed').length} ${t('مراحل فاشلة', 'failed phases')}`} tone={simulation.events.length > 0 ? 'warn' : 'good'} />
          <Stat label={t('الاحتياطي المستخدم', 'Reserve used')} value={fmtMoney(simulation.reserveUsedM)} hint={t(`من ${fmtMoney(design.cost.reserveM)}`, `of ${fmtMoney(design.cost.reserveM)}`)} tone={simulation.reserveUsedM > 0 ? 'warn' : 'good'} />
          <Stat label={t('البيانات المفقودة', 'Data lost')} value={<>{fmt(simulation.dataLostGb, 2)} <span className="text-[10px]">GB</span></>} hint={`${simulation.events.length} ${t('أحداث', 'events')}`} tone={simulation.dataLostGb > 0.05 ? 'warn' : 'good'} />
          <Stat label={t('النمط الآمن', 'Safe mode')} value={<>{fmt(simulation.safeModeDays)} <span className="text-[10px]">{t('يوم', 'days')}</span></>} hint={`${fmt(simulation.linkHoursLost, 1)} ${t('ساعة اتصال مفقودة', 'link hours lost')}`} tone={simulation.safeModeDays > 0 ? 'warn' : 'good'} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="font-latin text-[9px] text-slate-600" dir="ltr">
            {simulation.runId} · {fmtDateTime(simulation.createdAt, lang)}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openSimulation} className="btn-ghost !px-3 !py-1.5 text-[10px]">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              {t('افتح المحاكاة', 'Open simulation')}
            </button>
            <button type="button" onClick={() => onLearn('evaluation')} className="btn-ghost !px-3 !py-1.5 text-[10px]">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {t('تعلّم التقييم', 'Learn scoring')}
            </button>
          </div>
        </div>
      </Section>

      <AchievementsHighlight onOpenProfile={onProfile} />

      <HistoryPanels />

      {!chapter ? (
      <section className="card card-pad">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="card-title">{t('أعد المحاولة', 'Try again')}</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              {t(
                'ثلاث طرق مختلفة لعزل أثر قراراتك. «نفس البذرة» هي أفضل طريقة لمقارنة تصميمين بعدل.',
                'Three ways to isolate the effect of your choices. “Same seed” is the fairest way to compare two designs.',
              )}
            </p>
          </div>
          <StatusPill tone="info"><RotateCcw className="h-3 w-3" aria-hidden="true" /> {t('جولة جديدة', 'New run')}</StatusPill>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <button
            type="button"
            onClick={replaySameChoices}
            className="selectable p-3.5 text-start"
          >
            <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-royal-500/12 text-royal-300">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="text-xs font-bold text-white">{t('عدّل نفس التصميم', 'Tweak this design')}</div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              {t('يعيدك للخطوة 1 مع الاحتفاظ بكل الخيارات والبذرة الحالية.', 'Returns to step 1 keeping every choice and the current seed.')}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-royal-300">
              {t('نفس الخيارات', 'Same choices')}
              {lang === 'ar' ? <ArrowLeft className="h-3 w-3" aria-hidden="true" /> : <ArrowRight className="h-3 w-3" aria-hidden="true" />}
            </span>
          </button>
          <button
            type="button"
            onClick={replaySameSeed}
            className="selectable border-gold-400/25 p-3.5 text-start hover:border-gold-400/50"
          >
            <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/12 text-gold-300">
              <Dices className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-white">{t('نفس البذرة', 'Same seed')}</span>
              <span className="rounded bg-gold-400/15 px-1.5 py-0.5 text-[8px] font-bold text-gold-200">{t('مقارنة عادلة', 'fair test')}</span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              {t('تصميم افتراضي جديد مع الإبقاء على سلسلة الأحداث نفسها.', 'A fresh default design while keeping the same event sequence.')}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-gold-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t('أعد التصميم', 'Redesign')}
            </span>
          </button>
          <button
            type="button"
            onClick={replayFromScratch}
            className="selectable p-3.5 text-start"
          >
            <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="text-xs font-bold text-white">{t('من الصفر', 'From scratch')}</div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              {t('تصميم افتراضي جديد وبذرة جديدة تمامًا. المحاولات السابقة تبقى محفوظة.', 'A fresh default design and a brand-new seed. Earlier attempts stay saved.')}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-slate-300">
              {t('جولة جديدة', 'Fresh run')}
            </span>
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
          <p className="text-[10px] text-slate-500">
            {attempts.length > 0
              ? t(`محفوظ محليًا: ${attempts.length} محاولة، وبذرة ${design.choices.seed}.`, `Saved locally: ${attempts.length} attempt(s), seed ${design.choices.seed}.`)
              : t('ستُحفظ الجولة القادمة محليًا تلقائيًا.', 'The next run will be saved locally automatically.')}
          </p>
          <button type="button" onClick={openSimulation} className="btn-secondary !px-3 !py-1.5 text-[10px]">
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            {t('أعد التشغيل الآن', 'Run again now')}
          </button>
        </div>
      </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <SimplifiedNote className="max-w-3xl">
          {t(
            'المحاولات ولوحة الصدارة محفوظة في هذا المتصفح فقط. تصدير التصميم من القائمة العلوية ينقل الخيارات، وليس النتائج.',
            'Attempts and the leaderboard live in this browser only. Exporting the design from the top menu transfers choices, not results.',
          )}
        </SimplifiedNote>
        <span className="inline-flex items-center gap-1 text-[9px] text-slate-600">
          <TargetIcon className="h-3 w-3" aria-hidden="true" />
          {l(design.target.name)} · {l(design.missionType.short)} · {l(design.tier.name)}
        </span>
      </div>
    </div>
  );
}
