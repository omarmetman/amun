import type { SimulationPhaseResult } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtDateTime, fmtMoney, fmtPct } from '../lib/format';
import { useActiveChapter } from '../store/useCampaign';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { InlineNote, Stat } from '../components/StepBits';
import { IconAlert, IconBook, IconCheck, IconCross, IconTarget } from '../components/Icons';

const phaseName: Record<SimulationPhaseResult['phase'], { ar: string; en: string }> = {
  launch: { ar: 'الإطلاق', en: 'Launch' },
  cruise: { ar: 'الإبحار', en: 'Cruise' },
  arrival: { ar: 'الوصول', en: 'Arrival' },
  operations: { ar: 'العمليات', en: 'Operations' },
  return: { ar: 'الإرجاع', en: 'Return' },
};

const outcomeTone = {
  nominal: 'text-malachite',
  degraded: 'text-amber',
  failed: 'text-carnelian-300',
  skipped: 'text-limestone-400',
} as const;

const outcomeFill = {
  nominal: 'border-malachite bg-malachite/20',
  degraded: 'border-amber bg-amber/15',
  failed: 'border-carnelian bg-carnelian/20',
  skipped: 'border-royal-500 bg-royal-700/20',
} as const;

const outcomeSwatch = {
  nominal: 'border-malachite bg-malachite',
  degraded: 'border-amber bg-amber',
  failed: 'border-carnelian bg-carnelian',
  skipped: 'border-royal-500 bg-royal-700',
} as const;

const severityTone = {
  info: 'text-royal-300',
  warning: 'text-amber',
  error: 'text-carnelian-300',
} as const;

function OrbitDiagram({
  targetId,
  targetName,
  progress,
  rtl,
}: {
  targetId: string;
  targetName: string;
  progress: number;
  rtl: boolean;
}) {
  const earthX = rtl ? 404 : 76;
  const earthY = 172;
  const targetX = rtl ? 76 : 404;
  const targetY = 58;
  const controlX = (earthX + targetX) / 2;
  const controlY = -30;
  const t = Math.max(0, Math.min(1, progress));
  const craftX = (1 - t) * (1 - t) * earthX + 2 * (1 - t) * t * controlX + t * t * targetX;
  const craftY = (1 - t) * (1 - t) * earthY + 2 * (1 - t) * t * controlY + t * t * targetY;

  return (
    <svg viewBox="0 0 480 220" className="h-auto w-full" role="img" aria-label={`${targetName}`}>
      <g stroke="#1A3A85" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => 40 + i * 34).map((x, index) => (
          <path key={x} d={`M${x} 12V206`} strokeOpacity={index % 4 === 0 ? 1 : 0.35} />
        ))}
        {Array.from({ length: 6 }, (_, i) => 26 + i * 34).map((y, index) => (
          <path key={y} d={`M8 ${y}H472`} strokeOpacity={index % 3 === 0 ? 1 : 0.25} />
        ))}
      </g>

      <g stroke="#2C57B4" fill="none" strokeWidth="1">
        <ellipse cx="240" cy="150" rx="188" ry="86" strokeDasharray="2 7" />
        <ellipse cx="240" cy="122" rx="132" ry="54" strokeDasharray="2 7" />
      </g>

      <path
        d={`M${earthX} ${earthY}Q${controlX} ${controlY} ${targetX} ${targetY}`}
        fill="none"
        stroke="#E3A92F"
        strokeWidth="2"
      />
      <circle cx={earthX} cy={earthY} r="9" fill="none" stroke="#EDE7D8" strokeWidth="1.5" />
      <path d={`M${earthX - 3} ${earthY}H${earthX + 3}M${earthX} ${earthY - 3}V${earthY + 3}`} stroke="#3FA878" strokeWidth="1.5" />
      <text x={earthX} y={earthY + 24} textAnchor="middle" fill="#EDE7D8" fontSize="11" fontFamily="IBM Plex Sans Arabic, sans-serif">
        {rtl ? 'الأرض' : 'Earth'}
      </text>

      <circle cx={targetX} cy={targetY} r="14" fill="none" stroke="#EDE7D8" strokeWidth="1.5" />
      {['moon', 'mars', 'venus', 'jupiter'].includes(targetId) ? (
        <circle cx={targetX} cy={targetY} r="7" fill="none" stroke="#EDE7D8" strokeOpacity="0.5" strokeWidth="1" />
      ) : (
        <path
          d={`M${targetX - 10} ${targetY + 4}L${targetX - 4} ${targetY - 9}L${targetX + 6} ${targetY - 6}L${targetX + 10} ${targetY + 5}L${targetX - 1} ${targetY + 10}Z`}
          fill="none"
          stroke="#EDE7D8"
          strokeWidth="1"
        />
      )}
      <text x={targetX} y={targetY - 22} textAnchor="middle" fill="#EDE7D8" fontSize="11" fontFamily="IBM Plex Sans Arabic, sans-serif">
        {targetName}
      </text>

      <g transform={`translate(${craftX} ${craftY})`}>
        <path d="M0 -5 4 4H-4Z" fill="#E3A92F" />
      </g>

      <g fill="#948C79" fontSize="9" fontFamily="IBM Plex Sans, sans-serif">
        <text x="40" y="216">0</text>
        <text x="420" y="216">12 AU</text>
        <text x="12" y="30">90°</text>
      </g>
    </svg>
  );
}

function MissionTimeline({ simulation }: { simulation: NonNullable<ReturnType<typeof useSimulation>> }) {
  const t = useT();
  const l = useL();
  const total = Math.max(1, simulation.totalDays);

  return (
    <figure className="min-w-0">
      <figcaption className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-sm text-limestone-100">{t('شريط زمني للمهمة', 'Mission timeline')}</span>
        <span className="font-latin text-xs tabular-nums text-limestone-400" dir="ltr">
          {fmt(total, 1)} {t('يوم', 'days')}
        </span>
      </figcaption>

      {/* Phone: a fluid bar with event ticks and a phase ledger, so no phase
          name is clipped and the figure never scrolls sideways. */}
      <div className="sm:hidden">
        <div className="relative h-12 border-y border-royal-500">
          {simulation.phases.map((phase) => {
            const left = (phase.startDay / total) * 100;
            const width = ((phase.endDay - phase.startDay) / total) * 100;
            return (
              <div
                key={phase.phase}
                className={`absolute inset-y-1 border-s ${outcomeFill[phase.outcome]}`}
                style={{ left: `${left}%`, width: `${Math.max(1.5, width)}%` }}
              />
            );
          })}
          {simulation.events.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="absolute top-full h-2 w-px bg-limestone-300"
              style={{ left: `${(event.day / total) * 100}%` }}
              title={`${l(event.name)}: ${t('يوم', 'day')} ${fmt(event.day, 1)}`}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
          <span>0</span>
          <span>{fmt(total / 2, 0)}</span>
          <span>{fmt(total, 0)}</span>
        </div>
        <ul className="mt-3 border-y border-royal-700">
          {simulation.phases.map((phase) => (
            <li
              key={phase.phase}
              className="flex items-baseline justify-between gap-3 border-b border-royal-700 py-1.5 last:border-b-0"
            >
              <span className="inline-flex min-w-0 items-center gap-2 text-xs text-limestone-200">
                <span className={`h-2 w-2 shrink-0 border ${outcomeSwatch[phase.outcome]}`} aria-hidden="true" />
                <span className="truncate">{l(phaseName[phase.phase])}</span>
              </span>
              <span className={`shrink-0 font-latin text-[10px] tabular-nums ${outcomeTone[phase.outcome]}`} dir="ltr">
                {fmt(phase.startDay, 0)}–{fmt(phase.endDay, 0)} d
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tablet and desktop: the full ruler with labels inside the phases. */}
      <div className="hidden overflow-x-auto sm:block">
        <div className="min-w-[520px]">
          <div className="flex h-10 items-end">
            {simulation.phases.map((phase) => {
              const width = ((phase.endDay - phase.startDay) / total) * 100;
              return (
                <div
                  key={phase.phase}
                  className="relative h-full border-s border-royal-600 first:border-s-0"
                  style={{ width: `${Math.max(2, width)}%` }}
                >
                  <span className={`absolute bottom-1 start-1 truncate text-[10px] ${outcomeTone[phase.outcome]}`}>
                    {l(phaseName[phase.phase])}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative h-10 border-y border-royal-500">
            {simulation.phases.map((phase) => {
              const left = (phase.startDay / total) * 100;
              const width = ((phase.endDay - phase.startDay) / total) * 100;
              return (
                <div
                  key={phase.phase}
                  className={`absolute inset-y-1 border-s ${outcomeFill[phase.outcome]}`}
                  style={{ left: `${left}%`, width: `${Math.max(1.5, width)}%` }}
                />
              );
            })}
            {simulation.events.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="absolute top-full h-3 w-px bg-limestone-300"
                style={{ left: `${(event.day / total) * 100}%` }}
                title={`${l(event.name)}: ${t('يوم', 'day')} ${fmt(event.day, 1)}`}
              >
                <span className={`absolute start-0 top-3 font-latin text-[10px] tabular-nums ${severityTone[event.severity]}`} dir="ltr">
                  {fmt(event.day, 0)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
            <span>0</span>
            <span>{fmt(total / 2, 0)}</span>
            <span>{fmt(total, 0)}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-limestone-400">
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 border ${outcomeSwatch.nominal}`} aria-hidden="true" /> {t('مرحلة سليمة', 'nominal')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rotate-45 border ${outcomeSwatch.degraded}`} aria-hidden="true" /> {t('متأثرة', 'degraded')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 border ${outcomeSwatch.failed}`} aria-hidden="true" /> {t('فاشلة', 'failed')}
        </span>
        <span>{t('العلامات السفلية هي الأحداث', 'Lower ticks are events')}</span>
      </div>
    </figure>
  );
}

function useSimulation() {
  return useMissionStore((state) => state.simulation);
}

export function Step10Simulation({ onLearn }: { onLearn: (key?: string) => void }) {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const lang = design.choices.language;
  const simulation = useSimulation();
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
    <div className="space-y-6">
      <Section
        title={locked ? t('غرفة التحكم، بذرة الفصل', 'Control room, chapter seed') : t('غرفة التحكم', 'Control room')}
        description={
          locked && chapter
            ? t(
                `بذرة الفصل ${chapter.number} ثابتة لكل اللاعبين، ليبقى ترتيب الأحداث واحدًا وتكون المقارنة عادلة.`,
                `The seed for chapter ${chapter.number} is fixed for every player, so the event order stays identical and comparisons are fair.`,
              )
            : t(
                'البذرة تحدد سلسلة الأحداث. التصميم نفسه مع البذرة نفسها يعطي النتيجة نفسها دائمًا.',
                'The seed determines the event sequence. The same design on the same seed always produces the same result.',
              )
        }
        action={
          locked ? (
            <StatusPill tone="warn">{t('مقفلة بواسطة الحملة', 'Locked by campaign')}</StatusPill>
          ) : (
            <GameBadge />
          )
        }
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <label htmlFor="seed" className="label mb-1.5 block">
              {locked ? t('بذرة الحملة', 'Campaign seed') : t('بذرة قابلة للتكرار', 'Reproducible seed')}
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="seed"
                value={design.choices.seed}
                onChange={(event) => setSeed(event.target.value)}
                readOnly={locked}
                aria-readonly={locked}
                className="field min-w-0 flex-1 font-latin text-sm"
                dir="ltr"
                maxLength={64}
                spellCheck={false}
              />
              {!locked ? (
                <button type="button" onClick={regenerateSeed} className="btn-ghost text-xs">
                  {t('بذرة جديدة', 'New seed')}
                </button>
              ) : (
                <span className="inline-flex items-center border border-royal-600 px-3 py-2 text-[11px] text-limestone-200">
                  {t(`الفصل ${chapter?.number}`, `Chapter ${chapter?.number}`)}
                </span>
              )}
            </div>
            {locked ? (
              <p className="mt-1.5 text-[11px] text-ochre-300">
                {t(
                  'لا يمكن تغيير البذرة داخل الحملة: كل اللاعبين يواجهون السلسلة نفسها.',
                  'The seed cannot be changed inside the campaign: every player faces the same chain.',
                )}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
            <button type="button" onClick={() => runSimulation()} disabled={!canRun} className="btn-primary text-sm">
              {simulation ? t('أعد التشغيل', 'Run again') : t('شغّل المحاكاة', 'Run the simulation')}
            </button>
            {simulation ? (
              <button type="button" onClick={() => setStep(11)} className="btn-secondary text-sm">
                <IconTarget className="h-4 w-4" />
                {t('إلى التقرير', 'Go to the report')}
              </button>
            ) : null}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 border-t border-royal-700 pt-3 sm:grid-cols-4">
          <div>
            <dt className="text-[10px] text-limestone-400">{t('البذرة', 'Seed')}</dt>
            <dd className="truncate font-latin text-xs tabular-nums text-limestone-100" dir="ltr">{design.choices.seed}</dd>
          </div>
          <div>
            <dt className="text-[10px] text-limestone-400">{t('المحاولات', 'Attempts')}</dt>
            <dd className="font-latin text-xs tabular-nums text-limestone-100">{attempts.length}</dd>
          </div>
          <div>
            <dt className="text-[10px] text-limestone-400">{t('التحقق', 'Validation')}</dt>
            <dd className={`text-xs ${canRun ? 'text-malachite' : 'text-carnelian-300'}`}>
              {canRun ? t('جاهز', 'Ready') : t(`${blockers.length} خطأ مانع`, `${blockers.length} blocking`)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-limestone-400">{t('التوليد', 'Generated')}</dt>
            <dd className="text-xs text-limestone-200">{t('محلي وحتمي', 'local, deterministic')}</dd>
          </div>
        </dl>

        {!canRun ? (
          <div className="mt-3">
            {blockers.map((issue) => (
              <div key={`${issue.code}-${issue.title.en}`} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-royal-700 py-1.5 last:border-0">
                <span className="inline-flex items-baseline gap-1.5 text-xs text-carnelian-300">
                  <IconAlert className="h-3.5 w-3.5 self-center" />
                  {l(issue.title)}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(issue.step)}
                  className="inline-flex min-h-[24px] items-center border-b border-carnelian pb-px text-[11px] text-carnelian-300 hover:text-limestone-50"
                >
                  {t('أصلح الخطوة', 'Fix step')} <span className="font-latin tabular-nums">0{issue.step}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <InlineNote tone="good" className="mt-3">
            {t(
              'كل الفحوصات المانعة سليمة. التشغيل يسجل المحاولة تلقائيًا في السجل المحلي.',
              'All blocking checks pass. Running records the attempt automatically in the local log.',
            )}
          </InlineNote>
        )}
      </Section>

      <Section
        title={t('منظر المدار', 'Orbit view')}
        description={t(
          'الأرض على اليمين والهدف على اليسار في القراءة العربية، والمسار المغرة هو نقل هوهمان المختار.',
          'Earth sits on the right and the target on the left in Arabic reading order; the ochre line is the selected Hohmann transfer.',
        )}
      >
        <OrbitDiagram
          targetId={design.target.id}
          targetName={l(design.target.name)}
          progress={simulation ? 1 : 0.82}
          rtl={lang === 'ar'}
        />
      </Section>

      {simulation ? (
        <>
          <div
            key={simulation.runId}
            className={`launch-in border-s-2 py-2 ps-4 ${simulation.success ? 'border-malachite' : 'border-carnelian'}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex min-w-0 items-baseline gap-2">
                {simulation.success ? (
                  <IconCheck className="h-5 w-5 shrink-0 self-center text-malachite" />
                ) : (
                  <IconCross className="h-5 w-5 shrink-0 self-center text-carnelian-300" />
                )}
                <div>
                  <div className="font-display text-lg text-limestone-50">
                    {simulation.success ? t('نجحت المهمة حتى العمليات العلمية', 'Mission succeeded through science operations') : t('فقدت المهمة', 'Mission lost')}
                  </div>
                  <p className="mt-0.5 max-w-[65ch] text-xs leading-relaxed text-limestone-300">
                    {simulation.failureReason
                      ? l(simulation.failureReason)
                      : t(
                          'اكتملت المراحل المخطط لها. راجع الأحداث والتقرير لمعرفة أثر كل قرار.',
                          'All planned phases completed. Review events and the report to see how decisions mattered.',
                        )}
                  </p>
                  <div className="mt-1 font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                    {simulation.runId} / {fmtDateTime(simulation.createdAt, lang)}
                  </div>
                </div>
              </div>
              {score ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] text-limestone-400">{t('النتيجة', 'Score')}</span>
                  <span className="font-latin text-2xl tabular-nums text-ochre-400">{fmt(score.breakdown.total, 1)}</span>
                  <span className="text-xs text-limestone-300">/ 100</span>
                </div>
              ) : null}
            </div>
          </div>

          <MissionTimeline simulation={simulation} />

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label={t('العلم المحقق', 'Science achieved')} value={fmt(simulation.scienceAchieved, 1)} hint={`${t('من', 'of')} ${fmt(simulation.sciencePossible, 1)} ${t('محتملة', 'possible')}`} tone={simulation.scienceAchieved >= design.tier.minScience ? 'good' : 'warn'} />
            <Stat label={t('البيانات المرسلة', 'Data returned')} value={<>{fmt(simulation.dataSentGb, 2)} <span className="text-[10px]">GB</span></>} hint={`${fmt(simulation.dataLostGb, 2)} GB ${t('مفقودة', 'lost')}`} tone={simulation.dataLostGb > 0.05 ? 'warn' : 'good'} />
            <Stat label={t('الموثوقية', 'Reliability')} value={fmtPct(simulation.reliability)} hint={t('بعد الأحداث', 'After events')} tone="royal" />
            <Stat label={t('مدة المهمة', 'Mission duration')} value={<>{fmt(simulation.totalDays, 1)} <span className="text-[10px]">{t('يوم', 'days')}</span></>} hint={`${simulation.events.length} ${t('أحداث', 'events')}`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <Section title={t('المراحل', 'Phases')} action={<StatusPill tone={simulation.success ? 'good' : 'danger'}>{simulation.success ? t('مكتملة', 'Completed') : t('متوقفة', 'Stopped')}</StatusPill>}>
              <ol>
                {simulation.phases.map((phase, index) => (
                  <li key={`${phase.phase}-${phase.startDay}`} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-royal-700 py-2 last:border-0">
                    <span className="font-latin text-[11px] tabular-nums text-limestone-400">{String(index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-limestone-100">{l(phaseName[phase.phase])}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] ${outcomeTone[phase.outcome]}`}>
                          <span className={`h-1.5 w-1.5 border ${outcomeSwatch[phase.outcome]}`} aria-hidden="true" />
                          {phase.outcome === 'nominal'
                            ? t('سليمة', 'nominal')
                            : phase.outcome === 'degraded'
                              ? t('متأثرة', 'degraded')
                              : phase.outcome === 'failed'
                                ? t('فاشلة', 'failed')
                                : t('لم تنفذ', 'skipped')}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-limestone-400">{l(phase.note)}</p>
                    </div>
                    <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                      {fmt(phase.startDay, 1)}–{fmt(phase.endDay, 1)} d
                    </span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section
              title={t('دفتر الأحداث', 'Event notebook')}
              description={t(
                'كل حدث مرتبط بتصميمك وبذرة التشغيل، ويمكن فتح شرحه في لوحة تعلّم.',
                'Each event is tied to your design and seed, and can be opened in the Learn panel.',
              )}
            >
              {simulation.events.length === 0 ? (
                <InlineNote tone="good">
                  {t('لم تحدث أحداث عشوائية في هذه البذرة. التصميم اجتاز المهمة بهدوء.', 'No random events occurred on this seed. The design completed the mission quietly.')}
                </InlineNote>
              ) : (
                <ol className="border-s border-royal-600 ps-3">
                  {simulation.events.map((event, index) => (
                    <li key={`${event.id}-${event.day}-${event.phase}`} className="relative border-b border-royal-700 py-2.5 last:border-0">
                      <span className="absolute -start-[17px] top-3.5 h-1.5 w-1.5 bg-royal-900 ring-1 ring-limestone-400" aria-hidden="true" />
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                            T+{String(Math.round(event.day)).padStart(3, '0')} d
                          </span>
                          <span className={`text-sm ${severityTone[event.severity]}`}>{l(event.name)}</span>
                          <span className="text-[10px] text-limestone-400">{event.phase}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onLearn(event.learnKey)}
                          className="inline-flex items-center gap-1 border-b border-royal-400 pb-px text-[10px] text-limestone-300 hover:text-limestone-50"
                        >
                          <IconBook className="h-3 w-3" />
                          {t('اشرح', 'Explain')}
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-limestone-300">{l(event.description)}</p>
                      {event.effects.length > 0 ? (
                        <p className="mt-1 text-[10px] text-limestone-400">
                          {event.effects.map((effect) => l(effect)).join('، ')}
                        </p>
                      ) : null}
                      <span className="sr-only">{index + 1}</span>
                    </li>
                  ))}
                </ol>
              )}
            </Section>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Stat label={t('احتياطي مستهلك', 'Reserve used')} value={fmtMoney(simulation.reserveUsedM)} hint={t(`من ${fmtMoney(design.cost.reserveM)}`, `of ${fmtMoney(design.cost.reserveM)}`)} tone={simulation.reserveUsedM > design.cost.reserveM * 0.5 ? 'warn' : 'good'} />
            <Stat label={t('تجاوز الميزانية', 'Budget overrun')} value={fmtMoney(simulation.budgetOverrunM)} hint={t('بعد استهلاك الاحتياطي', 'After reserve')} tone={simulation.budgetOverrunM > 0 ? 'danger' : 'good'} />
            <Stat label={t('أيام النمط الآمن', 'Safe-mode days')} value={fmt(simulation.safeModeDays)} hint={t(`فقدان ${fmt(simulation.linkHoursLost, 1)} ساعة اتصال`, `${fmt(simulation.linkHoursLost, 1)} link hours lost`)} tone={simulation.safeModeDays > 0 ? 'warn' : 'good'} />
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-royal-700 pt-3">
            <SimplifiedNote className="max-w-2xl">
              {t(
                'المحاكاة حتمية للأحداث، لكنها ليست تنبؤًا هندسيًا. الأحداث تستهلك الهوامش المبنية في التصميم بدلًا من تغيير الفيزياء.',
                'The simulation is deterministic for events, but not an engineering forecast. Events consume the margins built into the design rather than changing the physics.',
              )}
            </SimplifiedNote>
            <button type="button" onClick={() => setStep(11)} className="btn-secondary text-xs">
              <IconTarget className="h-4 w-4" />
              {t('افتح التقرير الكامل', 'Open the full report')}
            </button>
          </div>
        </>
      ) : (
        <section className="border-t border-royal-700 pt-4" aria-label={t('لا توجد نتيجة بعد', 'No result yet')}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg text-limestone-100">{t('لم تُشغَّل محاكاة بعد', 'No simulation has run yet')}</h2>
              <p className="mt-1 max-w-[60ch] text-xs leading-relaxed text-limestone-300">
                {t(
                  'شغّل المحاكاة لترى المراحل والأحداث والعلم والبيانات والميزانية. النتيجة تُسجل تلقائيًا في المحاولات.',
                  'Run the simulation to see phases, events, science, data and budget. The result is recorded automatically in attempts.',
                )}
              </p>
              {!canRun ? (
                <p className="mt-1 inline-flex items-baseline gap-1.5 text-xs text-carnelian-300">
                  <IconAlert className="h-3.5 w-3.5 self-center" />
                  {t('أصلح الأخطاء المانعة أولًا.', 'Fix blocking errors first.')}
                </p>
              ) : null}
            </div>
            <button type="button" onClick={() => runSimulation()} disabled={!canRun} className="btn-primary text-sm">
              {t('شغّل المحاكاة', 'Run the simulation')}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
