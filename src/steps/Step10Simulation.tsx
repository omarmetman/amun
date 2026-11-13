import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Database,
  Dices,
  Flag,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Trophy,
  XCircle,
} from 'lucide-react';
import type { SimulationPhase, SimulationPhaseResult } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtDateTime, fmtMoney, fmtPct } from '../lib/format';
import { useActiveChapter } from '../store/useCampaign';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { InlineNote, Stat } from '../components/StepBits';

const phaseIcon: Record<SimulationPhase, typeof Play> = {
  launch: Play,
  cruise: Clock3,
  arrival: Trophy,
  operations: Database,
  return: RotateCcw,
};

const phaseStyle = {
  nominal: 'border-good/25 bg-good/[0.05] text-good',
  degraded: 'border-warn/25 bg-warn/[0.05] text-warn',
  failed: 'border-danger/25 bg-danger/[0.06] text-danger',
  skipped: 'border-white/10 bg-white/[0.02] text-slate-500',
} as const;

const eventStyle = {
  info: 'border-royal-400/20 bg-royal-500/[0.04] text-royal-200',
  warning: 'border-warn/25 bg-warn/[0.04] text-warn',
  error: 'border-danger/25 bg-danger/[0.05] text-danger',
} as const;

function PhaseCard({ phase, language }: { phase: SimulationPhaseResult; language: 'ar' | 'en' }) {
  const l = useL();
  const Icon = phaseIcon[phase.phase];
  const meta: Record<SimulationPhase, { ar: string; en: string }> = {
    launch: { ar: 'الإطلاق', en: 'Launch' },
    cruise: { ar: 'الإبحار', en: 'Cruise' },
    arrival: { ar: 'الوصول', en: 'Arrival' },
    operations: { ar: 'العمليات', en: 'Operations' },
    return: { ar: 'الإرجاع', en: 'Return' },
  };
  return (
    <div className={`rounded-xl border p-3 ${phaseStyle[phase.outcome]}`}>
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-white">{l(meta[phase.phase])}</span>
            <span className="font-latin text-[9px] font-semibold opacity-80" dir="ltr">
              {fmt(phase.startDay, 1)}–{fmt(phase.endDay, 1)} d
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-300/90">{l(phase.note)}</p>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-wider opacity-80">
            {phase.outcome === 'nominal'
              ? language === 'ar' ? 'اسمي' : 'Nominal'
              : phase.outcome === 'degraded'
                ? language === 'ar' ? 'متأثر' : 'Degraded'
                : phase.outcome === 'failed'
                  ? language === 'ar' ? 'فشل' : 'Failed'
                  : language === 'ar' ? 'لم تنفذ' : 'Skipped'}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Step10Simulation({ onLearn }: { onLearn: (key?: string) => void }) {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const lang = design.choices.language;
  const simulation = useMissionStore((state) => state.simulation);
  const score = useMissionStore((state) => state.score);
  const attempts = useMissionStore((state) => state.attempts);
  const runSimulation = useMissionStore((state) => state.runSimulation);
  const setSeed = useMissionStore((state) => state.setSeed);
  const regenerateSeed = useMissionStore((state) => state.regenerateSeed);
  const setStep = useMissionStore((state) => state.setStep);
  const chapter = useActiveChapter();
  const locked = Boolean(chapter);
  const blockers = design.blockingIssues;
  const canRun = blockers.length === 0;

  return (
    <div className="space-y-4">
      <Section
        title={locked ? t('بذرة الفصل الثابتة', 'Fixed chapter seed') : t('بذرة المحاكاة', 'Simulation seed')}
        description={
          locked && chapter
            ? t(
                `هذه بذرة الفصل ${chapter.number} «${chapter.title.ar}». ثباتها يجعل ترتيب الأحداث واحدًا لكل اللاعبين، ويجعل المقارنة بين التصاميم عادلة.`,
                `This is the seed for chapter ${chapter.number}, “${chapter.title.en}”. Keeping it fixed gives every player the same event sequence and makes design comparisons fair.`,
              )
            : t(
                'البذرة تحدد سلسلة الأحداث العشوائية. التصميم نفسه مع البذرة نفسها يعطي النتيجة نفسها دائمًا.',
                'The seed determines the random event sequence. The same design with the same seed always produces the same result.',
              )
        }
        action={
          locked ? (
            <StatusPill tone="warn">
              <Lock className="h-3 w-3" aria-hidden="true" />
              {t('مقفلة بواسطة الحملة', 'Locked by campaign')}
            </StatusPill>
          ) : (
            <GameBadge />
          )
        }
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label htmlFor="seed" className="label mb-1.5 flex items-center gap-1.5">
              {locked ? <Lock className="h-3 w-3 text-gold-300" aria-hidden="true" /> : null}
              {locked ? t('بذرة الحملة', 'Campaign seed') : t('بذرة قابلة للتكرار', 'Reproducible seed')}
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="seed"
                value={design.choices.seed}
                onChange={(event) => setSeed(event.target.value)}
                readOnly={locked}
                aria-readonly={locked}
                className={`field min-w-0 flex-1 font-latin text-sm ${locked ? 'cursor-not-allowed border-gold-400/25 bg-void-950/60 text-gold-100' : ''}`}
                dir="ltr"
                maxLength={64}
                spellCheck={false}
              />
              {!locked ? (
                <button type="button" onClick={regenerateSeed} className="btn-ghost text-xs" aria-label={t('بذرة جديدة', 'New seed')}>
                  <Dices className="h-4 w-4" aria-hidden="true" />
                  {t('بذرة جديدة', 'New seed')}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-gold-400/25 bg-gold-400/[0.06] px-3 py-2 text-[10px] font-bold text-gold-100">
                  <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                  {t(`الفصل ${chapter?.number}`, `Chapter ${chapter?.number}`)}
                </span>
              )}
            </div>
            {locked ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-gold-200/80">
                <Lock className="h-3 w-3" aria-hidden="true" />
                {t(
                  'لا يمكن تغيير البذرة داخل الحملة: كل اللاعبين يواجهون السلسلة نفسها.',
                  'The seed cannot be changed inside the campaign: every player faces the same event chain.',
                )}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
            <button
              type="button"
              onClick={() => runSimulation()}
              disabled={!canRun}
              className="btn-primary text-sm"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {simulation ? t('إعادة التشغيل', 'Run again') : t('شغّل المحاكاة', 'Run simulation')}
            </button>
            {simulation ? (
              <button type="button" onClick={() => setStep(11)} className="btn-secondary text-sm">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                {t('إلى التقييم', 'Go to evaluation')}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.07] bg-void-900/40 px-3 py-2">
            <div className="text-[9px] text-slate-500">{t('البذرة', 'Seed')}</div>
            <div className="mt-0.5 truncate font-latin text-[11px] font-bold text-slate-200" dir="ltr">{design.choices.seed}</div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-void-900/40 px-3 py-2">
            <div className="text-[9px] text-slate-500">{t('المحاولات المحفوظة', 'Saved attempts')}</div>
            <div className="mt-0.5 font-latin text-[11px] font-bold text-slate-200">{attempts.length}</div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-void-900/40 px-3 py-2">
            <div className="text-[9px] text-slate-500">{t('حالة التحقق', 'Validation state')}</div>
            <div className={`mt-0.5 text-[11px] font-bold ${canRun ? 'text-good' : 'text-danger'}`}>
              {canRun ? t('جاهز للتشغيل', 'Ready to run') : t(`${blockers.length} خطأ مانع`, `${blockers.length} blocking`)}
            </div>
          </div>
        </div>

        {!canRun ? (
          <div className="mt-3 space-y-1.5">
            {blockers.map((issue) => (
              <div key={`${issue.code}-${issue.title.en}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-danger/25 bg-danger/[0.05] px-3 py-2">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-danger">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  {l(issue.title)}
                </span>
                <button type="button" onClick={() => setStep(issue.step)} className="rounded-lg border border-danger/30 px-2 py-0.5 text-[9px] font-bold text-danger hover:bg-danger/10">
                  {t('أصلح الخطوة', 'Fix step')} <span className="num">0{issue.step}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <InlineNote tone="good" className="mt-3">
            <ShieldCheck className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
            {t('كل الفحوصات المانعة سليمة. التشغيل سيسجل المحاولة في لوحة الصدارة المحلية تلقائيًا.', 'All blocking checks pass. Running will automatically record the attempt on the local leaderboard.')}
          </InlineNote>
        )}
      </Section>

      {simulation ? (
        <>
          <div className={`rounded-2xl border p-4 ${simulation.success ? 'border-good/25 bg-good/[0.04]' : 'border-danger/25 bg-danger/[0.05]'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {simulation.success ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 text-good" aria-hidden="true" />
                ) : (
                  <XCircle className="mt-0.5 h-6 w-6 text-danger" aria-hidden="true" />
                )}
                <div>
                  <div className="text-base font-black text-white">
                    {simulation.success ? t('نجحت المهمة حتى العمليات العلمية', 'Mission succeeded through science operations') : t('فقدت المهمة', 'Mission lost')}
                  </div>
                  <p className="mt-0.5 max-w-2xl text-[11px] leading-relaxed text-slate-400">
                    {simulation.failureReason
                      ? l(simulation.failureReason)
                      : t('اكتملت جميع المراحل المخطط لها. راجع الأحداث والتقييم لمعرفة أثر القرارات.', 'All planned phases completed. Review events and evaluation to see how decisions affected the result.')}
                  </p>
                  <div className="mt-1.5 font-latin text-[9px] text-slate-600" dir="ltr">
                    {simulation.runId} · {fmtDateTime(simulation.createdAt, lang)}
                  </div>
                </div>
              </div>
              {score ? (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500">{t('النتيجة', 'Score')}</span>
                  <span className="font-latin text-2xl font-black text-gold-200">{fmt(score.breakdown.total, 1)}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/10 font-latin text-sm font-black text-gold-200">
                    {score.grade}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label={t('العلم المحقق', 'Science achieved')} value={fmt(simulation.scienceAchieved, 1)} hint={`${t('من', 'of')} ${fmt(simulation.sciencePossible, 1)} ${t('محتملة', 'possible')}`} tone={simulation.scienceAchieved >= design.tier.minScience ? 'good' : 'warn'} />
            <Stat label={t('البيانات المرسلة', 'Data returned')} value={<>{fmt(simulation.dataSentGb, 2)} <span className="text-[10px]">GB</span></>} hint={`${fmt(simulation.dataLostGb, 2)} GB ${t('مفقودة', 'lost')}`} tone={simulation.dataLostGb > 0.05 ? 'warn' : 'good'} />
            <Stat label={t('الموثوقية', 'Reliability')} value={fmtPct(simulation.reliability)} hint={t('بعد الأحداث', 'After events')} tone="royal" />
            <Stat label={t('مدة المهمة', 'Mission duration')} value={<>{fmt(simulation.totalDays, 1)} <span className="text-[10px]">{t('يوم', 'days')}</span></>} hint={`${simulation.events.length} ${t('أحداث', 'events')}`} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Section title={t('المراحل', 'Mission phases')} action={<StatusPill tone={simulation.success ? 'good' : 'danger'}>{simulation.success ? t('مكتملة', 'Completed') : t('متوقفة', 'Stopped')}</StatusPill>}>
              <div className="space-y-2">
                {simulation.phases.map((phase) => (
                  <PhaseCard key={`${phase.phase}-${phase.startDay}`} phase={phase} language={lang} />
                ))}
              </div>
            </Section>

            <Section title={t('سجل الأحداث', 'Event log')} description={t('كل حدث مرتبط بتصميمك وبذرة التشغيل، ويمكن فتح شرحه في لوحة تعلّم.', 'Each event is tied to your design and seed, and can be opened in the Learn panel.')}>
              {simulation.events.length === 0 ? (
                <InlineNote tone="good">
                  {t('لم تحدث أحداث عشوائية في هذه البذرة. التصميم اجتاز المهمة بهدوء.', 'No random events occurred on this seed. The design completed the mission quietly.')}
                </InlineNote>
              ) : (
                <div className="space-y-2">
                  {simulation.events.map((event) => (
                    <div key={`${event.id}-${event.day}-${event.phase}`} className={`rounded-xl border p-3 ${eventStyle[event.severity]}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-bold text-white">{l(event.name)}</span>
                            <span className="rounded bg-black/20 px-1.5 py-0.5 font-latin text-[8px] font-semibold" dir="ltr">{event.phase}</span>
                            <span className="font-latin text-[8px] opacity-80" dir="ltr">day {fmt(event.day, 1)}</span>
                          </div>
                          <p className="mt-1 text-[10px] leading-relaxed text-slate-300/90">{l(event.description)}</p>
                          {event.effects.length > 0 ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {event.effects.map((effect) => (
                                <span key={`${effect.en}-${effect.ar}`} className="rounded-md bg-black/20 px-1.5 py-0.5 text-[9px] font-semibold">
                                  {l(effect)}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <button type="button" onClick={() => onLearn(event.learnKey)} className="flex shrink-0 items-center gap-1 rounded-lg border border-white/15 px-2 py-1 text-[9px] font-bold text-slate-200 hover:bg-white/10">
                          <BookOpen className="h-3 w-3" aria-hidden="true" />
                          {t('تعلّم', 'Learn')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Stat label={t('احتياطي مستهلك', 'Reserve used')} value={fmtMoney(simulation.reserveUsedM)} hint={t(`من ${fmtMoney(design.cost.reserveM)}`, `of ${fmtMoney(design.cost.reserveM)}`)} tone={simulation.reserveUsedM > design.cost.reserveM * 0.5 ? 'warn' : 'good'} />
            <Stat label={t('تجاوز الميزانية', 'Budget overrun')} value={fmtMoney(simulation.budgetOverrunM)} hint={t('بعد استهلاك الاحتياطي', 'After reserve')} tone={simulation.budgetOverrunM > 0 ? 'danger' : 'good'} />
            <Stat label={t('أيام النمط الآمن', 'Safe-mode days')} value={fmt(simulation.safeModeDays)} hint={t(`فقدان ${fmt(simulation.linkHoursLost, 1)} ساعة اتصال`, `${fmt(simulation.linkHoursLost, 1)} link hours lost`)} tone={simulation.safeModeDays > 0 ? 'warn' : 'good'} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <SimplifiedNote className="max-w-3xl">
              {t(
                'المحاكاة حتمية للأحداث، لكنها ليست تنبؤًا هندسيًا. الأحداث تستهلك الهوامش المبنية في التصميم بدلًا من تغيير الفيزياء.',
                'The simulation is deterministic for events, but it is not an engineering forecast. Events consume the margins built into the design rather than changing the physics.',
              )}
            </SimplifiedNote>
            <button type="button" onClick={() => setStep(11)} className="btn-secondary text-xs">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              {t('افتح التقرير الكامل', 'Open the full report')}
            </button>
          </div>
        </>
      ) : (
        <Section title={t('لا توجد نتيجة بعد', 'No result yet')}>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-4 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-royal-400/25 bg-royal-500/10 text-royal-300">
              <Play className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-3 text-sm font-bold text-white">{t('شغّل المحاكاة عندما يكون التصميم جاهزًا', 'Run the simulation when the design is ready')}</div>
            <p className="mt-1 max-w-md text-[11px] leading-relaxed text-slate-400">
              {t(
                'سترى مراحل المهمة والأحداث العشوائية والعلم والبيانات والميزانية. النتيجة تُسجل تلقائيًا في المحاولات.',
                'You will see mission phases, random events, science, data and budget. The result is recorded automatically in attempts.',
              )}
            </p>
            {!canRun ? (
              <p className="mt-2 text-[10px] font-semibold text-danger">
                {t('أصلح الأخطاء المانعة أولًا.', 'Fix blocking errors first.')}
              </p>
            ) : null}
          </div>
        </Section>
      )}
    </div>
  );
}
