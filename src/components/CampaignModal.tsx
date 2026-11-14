import { useState } from 'react';
import type { CampaignChapter } from '../data/types';
import { CAMPAIGN, CAMPAIGN_CHAPTERS, campaignProgress } from '../data/campaign';
import { difficultyById, missionTypeById, tierById } from '../data/missions';
import { targetById } from '../data/targets';
import { isChapterUnlocked } from '../engine/campaign';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { CampaignStarRating, CAMPAIGN_ACCENTS, ChapterPatch } from './CampaignArt';
import { Modal } from './Modal';
import { SimplifiedNote, StatusPill } from './Badges';
import { TargetImage } from './TargetImage';
import {
  IconCheck,
  IconChevron,
  IconCompass,
  IconCrown,
  IconFlag,
  IconLock,
  IconPlay,
} from './Icons';

type ChapterState = 'complete' | 'active' | 'next' | 'locked' | 'open';

const stateTone: Record<ChapterState, 'good' | 'warn' | 'info' | 'muted'> = {
  complete: 'good',
  active: 'warn',
  next: 'info',
  locked: 'muted',
  open: 'info',
};

export function CampaignModal({
  onClose,
  onFreeplay,
}: {
  onClose: () => void;
  onFreeplay: () => void;
}) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const campaign = useMissionStore((state) => state.campaign);
  const pilotName = useMissionStore((state) => state.pilotName);
  const startCampaign = useMissionStore((state) => state.startCampaign);
  const startCampaignChapter = useMissionStore((state) => state.startCampaignChapter);
  const progress = campaignProgress(campaign.completed);
  const activeChapterId = campaign.activeChapterId;
  const next = progress.nextChapter;
  const [expanded, setExpanded] = useState<string | null>(
    activeChapterId ?? next?.id ?? CAMPAIGN_CHAPTERS[0].id,
  );
  const activeIsNext = Boolean(activeChapterId && next && activeChapterId === next.id);

  const begin = (chapter: CampaignChapter) => {
    if (!isChapterUnlocked(chapter.id, campaign.completed)) return;
    if (startCampaignChapter(chapter.id)) onClose();
  };

  const beginNext = () => {
    if (activeIsNext) {
      onClose();
      return;
    }
    if (next) {
      begin(next);
      return;
    }
    if (startCampaign()) onClose();
  };

  const primaryLabel = next
    ? activeIsNext
      ? t('تابع الفصل الحالي', 'Continue current chapter')
      : t(`ابدأ الفصل ${next.number}`, `Start chapter ${next.number}`)
    : t('أعد الفصل الأخير', 'Replay the final chapter');

  const chapterState = (chapter: CampaignChapter, record: boolean): ChapterState => {
    if (record) return 'complete';
    if (activeChapterId === chapter.id) return 'active';
    if (next?.id === chapter.id) return 'next';
    if (!isChapterUnlocked(chapter.id, campaign.completed)) return 'locked';
    return 'open';
  };

  const stateLabel = (state: ChapterState): string => {
    if (state === 'complete') return t('مكتمل', 'Complete');
    if (state === 'active') return t('نشط', 'Active');
    if (state === 'next') return t('التالي', 'Next');
    if (state === 'locked') return t('مقفل', 'Locked');
    return t('متاح', 'Open');
  };

  return (
    <Modal
      title={t('حملة أفق آمون', 'AMUN Horizon campaign')}
      description={t(
        'ستة فصول مترابطة، هدف ثابت في كل فصل، وحريتك الكاملة في الهندسة.',
        'Six linked chapters, one fixed destination per chapter, and full engineering freedom.',
      )}
      onClose={onClose}
      extraWide
    >
      <section className="border border-royal-700">
        <header className="border-t-2 border-ochre-400 p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-[11px] text-ochre-300">
              {t('أرشيف برنامج آمون', 'AMUN programme archive')}
            </span>
            <span className="font-latin text-[11px] tabular-nums text-limestone-400" dir="ltr">
              {CAMPAIGN.englishTitle}
            </span>
          </div>

          <h2 className="mt-2 font-display text-[28px] leading-[1.3] text-limestone-50 sm:text-[34px]">
            {l(CAMPAIGN.title)}
          </h2>
          <p className="mt-1 max-w-[56ch] font-display text-base leading-[1.7] text-limestone-100">
            {l(CAMPAIGN.tagline)}
          </p>
          <p className="mt-2 max-w-[64ch] text-sm leading-[1.8] text-limestone-300">
            {l(CAMPAIGN.overview)}
          </p>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <div className="text-[11px] leading-relaxed text-limestone-400">
              <span>
                {t(
                  `${progress.completedCount} من ${CAMPAIGN_CHAPTERS.length} فصول مكتملة`,
                  `${progress.completedCount} of ${CAMPAIGN_CHAPTERS.length} chapters complete`,
                )}
              </span>
              <span className="mx-2 text-royal-400" aria-hidden="true">
                /
              </span>
              <span className="inline-flex items-baseline gap-1 font-latin tabular-nums text-ochre-300" dir="ltr">
                {progress.totalStars} / {progress.maxStars}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={beginNext} className="btn-primary text-sm">
                <IconPlay className="h-4 w-4" />
                {primaryLabel}
              </button>
              <button type="button" onClick={onFreeplay} className="btn-ghost text-sm">
                <IconCompass className="h-4 w-4" />
                {t('تصميم حر', 'Freeplay')}
              </button>
            </div>
          </div>

          <ol className="mt-3 grid grid-cols-6 border-y border-royal-700" aria-label={t('حالة الفصول', 'Chapter status')}>
            {CAMPAIGN_CHAPTERS.map((chapter) => {
              const record = campaign.completed[chapter.id];
              const state = chapterState(chapter, Boolean(record));
              const isOpen = expanded === chapter.id;
              const fill =
                state === 'complete' || state === 'active' || state === 'next'
                  ? state === 'next'
                    ? 'bg-royal-400'
                    : 'bg-ochre-400'
                  : 'bg-royal-700';
              return (
                <li key={chapter.id} className="border-s border-royal-700 first:border-s-0">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : chapter.id)}
                    aria-expanded={isOpen}
                    aria-label={t(
                      `الفصل ${chapter.number}: ${l(chapter.title)}، ${stateLabel(state)}`,
                      `Chapter ${chapter.number}: ${l(chapter.title)}, ${stateLabel(state)}`,
                    )}
                    className={`block w-full px-1.5 pb-1.5 pt-2 text-center transition-colors hover:bg-royal-700/20 ${
                      activeChapterId === chapter.id ? 'bg-royal-700/40' : ''
                    }`}
                  >
                    <span className={`block h-0.5 w-full ${fill}`} />
                    <span className="mt-1 block font-latin text-[11px] tabular-nums text-limestone-200" dir="ltr">
                      {String(chapter.number).padStart(2, '0')}
                    </span>
                    <span className="mt-0.5 hidden truncate text-[10px] text-limestone-400 sm:block">
                      {stateLabel(state)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {activeChapterId ? (
            <div className="mt-3 border-s-2 border-amber py-1 ps-3 text-xs leading-relaxed text-amber">
              {t(
                'هناك فصل نشط. بدء فصل جديد سيستبدل التصميم الحالي، لكن تقدم الحملة يبقى محفوظًا.',
                'A chapter is active. Starting a new one replaces the current design, but campaign progress is kept.',
              )}
            </div>
          ) : null}
        </header>
      </section>

      <dl className="mt-4 grid border border-royal-700 sm:grid-cols-3">
        <SignalField
          label={t('تردد الإشارة', 'Signal frequency')}
          value={CAMPAIGN.signal.frequency}
          hint={t('خط الهيدروجين، قيمة فيزيائية حقيقية', 'The hydrogen line, a real physical value')}
          latin
        />
        <SignalField
          label={t('دورة التكرار', 'Repetition')}
          value={l(CAMPAIGN.signal.period)}
          hint={t('تخييل القصة', 'Story fiction')}
        />
        <SignalField
          label={t('نقاط المصدر', 'Source points')}
          value={t('6', '6')}
          hint={l(CAMPAIGN.signal.points)}
          latin
        />
      </dl>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-royal-700 pb-1.5">
        <h2 className="font-display text-base text-limestone-50">{t('سجل الفصول', 'Chapter register')}</h2>
        <span className="text-[11px] text-limestone-400">
          {t('افتح صفًا لقراءة ملف الفصل', 'Open a row to read its chapter file')}
        </span>
      </div>

      <div className="border border-t-0 border-royal-700">
        {CAMPAIGN_CHAPTERS.map((chapter) => {
          const unlocked = isChapterUnlocked(chapter.id, campaign.completed);
          const record = campaign.completed[chapter.id];
          const isActive = activeChapterId === chapter.id;
          const open = expanded === chapter.id;
          const accent = CAMPAIGN_ACCENTS[chapter.accent];
          const target = targetById[chapter.targetId];
          const mission = missionTypeById[chapter.missionType];
          const difficulty = difficultyById[chapter.difficulty];
          const tier = tierById[chapter.successTier];
          const state = chapterState(chapter, Boolean(record));
          const metObjectives = chapter.bonusObjectives.filter(
            (objective) => record?.objectives[objective.id],
          ).length;

          return (
            <article
              key={chapter.id}
              className={`border-t border-royal-700 first:border-t-0 ${isActive ? 'selectable-on' : ''} ${
                !unlocked ? 'bg-lapis-950/30' : ''
              }`}
            >
              <div className="p-3.5 sm:p-4">
                <div className="flex items-start gap-3">
                  <ChapterPatch
                    chapter={chapter}
                    size="sm"
                    className={unlocked ? '' : 'opacity-60'}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className={`font-latin text-[10px] tabular-nums ${accent.text}`} dir="ltr">
                          {chapter.code}
                        </span>
                        <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                          {chapter.year}
                        </span>
                        <StatusPill tone={stateTone[state]}>{stateLabel(state)}</StatusPill>
                      </div>
                      {record ? (
                        <CampaignStarRating
                          stars={record.stars}
                          size="sm"
                          label={t(`${record.stars} من 3 نجوم`, `${record.stars} of 3 stars`)}
                        />
                      ) : unlocked ? (
                        <CampaignStarRating stars={0} size="sm" />
                      ) : (
                        <IconLock className="h-4 w-4 shrink-0 text-limestone-400" />
                      )}
                    </div>

                    <h3 className="mt-1 font-display text-lg leading-snug text-limestone-50 sm:text-xl">
                      {l(chapter.title)}
                    </h3>
                    <p className="text-xs leading-relaxed text-limestone-400">{l(chapter.subtitle)}</p>
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-royal-700 pt-2.5 sm:grid-cols-4">
                  <ChapterFact
                    label={t('الهدف', 'Target')}
                    value={target ? l(target.name) : chapter.targetId}
                  />
                  <ChapterFact
                    label={t('المهمة', 'Mission')}
                    value={mission ? l(mission.short) : chapter.missionType}
                  />
                  <ChapterFact
                    label={t('الصعوبة', 'Difficulty')}
                    value={difficulty ? l(difficulty.name) : chapter.difficulty}
                  />
                  <ChapterFact
                    label={t('معيار النجاح', 'Success tier')}
                    value={tier ? l(tier.name) : chapter.successTier}
                  />
                </dl>

                <p
                  className={`mt-2 max-w-[68ch] text-xs leading-[1.8] text-limestone-300 ${
                    open ? '' : 'line-clamp-2'
                  }`}
                >
                  {l(chapter.prologue)}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : chapter.id)}
                    aria-expanded={open}
                    className="btn-ghost !min-h-[38px] !px-2.5 !py-1.5 text-xs"
                  >
                    <IconChevron dir={open ? 'up' : 'down'} className="h-3.5 w-3.5" />
                    {open ? t('أغلق الملف', 'Close file') : t('افتح ملف الفصل', 'Open chapter file')}
                  </button>

                  {unlocked ? (
                    <button
                      type="button"
                      onClick={() => begin(chapter)}
                      className={`${record ? 'btn-secondary' : 'btn-primary'} !min-h-[38px] !px-3 !py-1.5 text-xs`}
                    >
                      {record ? (
                        <IconCheck className="h-3.5 w-3.5" />
                      ) : isActive ? (
                        <IconPlay className="h-3.5 w-3.5" />
                      ) : (
                        <IconFlag className="h-3.5 w-3.5" />
                      )}
                      {record
                        ? t('أعد الفصل', 'Replay chapter')
                        : isActive
                          ? t('تابع الفصل', 'Continue chapter')
                          : t('ابدأ الفصل', 'Start chapter')}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-limestone-400">
                      <IconLock className="h-3.5 w-3.5" />
                      {t('أكمل الفصل السابق', 'Complete the previous chapter')}
                    </span>
                  )}
                </div>
              </div>

              {open ? (
                <div className="sheet-open border-t border-royal-700 bg-lapis-950/40 p-3.5 sm:p-4">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_196px]">
                    <div className="min-w-0">
                      <div className="text-[11px] text-ochre-300">{t('التوجيه', 'Directive')}</div>
                      <p className="mt-1 max-w-[64ch] text-sm leading-[1.8] text-limestone-50">
                        {l(chapter.objective)}
                      </p>
                      <p className="mt-1 max-w-[64ch] text-xs leading-[1.8] text-limestone-300">
                        {l(chapter.briefing)}
                      </p>

                      <div className="mt-4 border-t border-royal-700 pt-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-[11px] text-limestone-300">
                            {t('أهداف إضافية', 'Bonus objectives')}
                          </span>
                          <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                            {metObjectives} / {chapter.bonusObjectives.length}
                          </span>
                        </div>
                        <ul className="mt-1">
                          {chapter.bonusObjectives.map((objective) => {
                            const met = Boolean(record?.objectives[objective.id]);
                            return (
                              <li
                                key={objective.id}
                                className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-2 border-t border-royal-700 py-2 first:border-t-0"
                              >
                                {met ? (
                                  <IconCheck className="mt-0.5 h-3.5 w-3.5 text-malachite" />
                                ) : (
                                  <IconLock className="mt-0.5 h-3.5 w-3.5 text-limestone-400" />
                                )}
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-baseline gap-x-2">
                                    <span className="text-xs text-limestone-100">{l(objective.title)}</span>
                                    <span className={`text-[10px] ${met ? 'text-malachite' : 'text-limestone-400'}`}>
                                      {met ? t('محقق', 'Met') : t('غير محقق', 'Not met')}
                                    </span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed text-limestone-400">
                                    {l(objective.description)}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {chapter.nasaDossier ? (
                        <div className="mt-4 border-t border-royal-700 pt-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-latin text-[10px] font-bold uppercase tracking-wider text-ochre-400">
                                NASA 100% Data Benchmark
                              </span>
                              <StatusPill tone="good">
                                {l(chapter.nasaDossier.benchmarkMission)}
                              </StatusPill>
                            </div>
                            <span className="font-latin text-[10px] text-limestone-400">
                              Horizons & GSFC Data
                            </span>
                          </div>

                          {/* Real World Facts */}
                          <div className="mt-2.5 rounded border border-royal-700 bg-lapis-900/50 p-2.5">
                            <span className="text-[11px] font-semibold text-limestone-200">
                              {t('حقائق علمية حقيقية 100% من ناسا:', '100% Authentic NASA Scientific Facts:')}
                            </span>
                            <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-limestone-300">
                              {chapter.nasaDossier.realWorldFacts.map((fact, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-1.5">
                                  <span className="text-ochre-400">✦</span>
                                  <span>{l(fact)}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 border-t border-royal-800/80 pt-1.5 text-[11px] italic text-limestone-400">
                              <span className="font-semibold text-limestone-300">
                                {t('المرجع التاريخي: ', 'Historical Precedent: ')}
                              </span>
                              {l(chapter.nasaDossier.historicalPrecedent)}
                            </p>
                          </div>

                          {/* Orbital Telemetry Grid */}
                          <dl className="mt-2.5 grid grid-cols-2 gap-2 rounded border border-royal-700 bg-lapis-900/40 p-2 text-center sm:grid-cols-4">
                            <div>
                              <dt className="text-[10px] text-limestone-400">{t('المسافة', 'Distance')}</dt>
                              <dd className="font-latin text-xs font-semibold text-limestone-100" dir="ltr">
                                {chapter.nasaDossier.orbitalData.distanceAU}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[10px] text-limestone-400">{t('الجاذبية', 'Gravity')}</dt>
                              <dd className="font-latin text-xs font-semibold text-ochre-300" dir="ltr">
                                {chapter.nasaDossier.orbitalData.gravityMs2} m/s²
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[10px] text-limestone-400">{t('التدفق الشمسي', 'Solar Irradiance')}</dt>
                              <dd className="font-latin text-xs font-semibold text-malachite" dir="ltr">
                                {chapter.nasaDossier.orbitalData.solarIrradianceWm2} W/m²
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[10px] text-limestone-400">{t('تأخر الضوء', 'Light Delay')}</dt>
                              <dd className="font-latin text-xs font-semibold text-carnelian-300" dir="ltr">
                                {chapter.nasaDossier.orbitalData.oneWayLightTimeMinutes} min
                              </dd>
                            </div>
                          </dl>

                          {/* Engineering Hint */}
                          <div className="mt-2.5 rounded border border-ochre-400/60 bg-ochre-400/10 p-2.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-ochre-300">
                              <span>💡</span>
                              <span>{t('نصيحة المهندس لتجاوز الفصل:', 'Engineering Hint for Mission Success:')}</span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-limestone-100">
                              {l(chapter.nasaDossier.engineeringHint)}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {chapter.environmentalHazards && chapter.environmentalHazards.length > 0 ? (
                        <div className="mt-3 border-t border-royal-700 pt-2.5">
                          <div className="text-[11px] font-semibold text-carnelian-300">
                            {t('المخاطر الفضائية والبيئية:', 'Space Weather & Environmental Hazards:')}
                          </div>
                          <div className="mt-1.5 space-y-1.5">
                            {chapter.environmentalHazards.map((hazard) => (
                              <div key={hazard.id} className="rounded border border-royal-800 bg-lapis-950/70 p-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-limestone-100">{l(hazard.name)}</span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 font-latin text-[10px] uppercase ${
                                      hazard.severity === 'critical'
                                        ? 'border border-carnelian-700 bg-carnelian-900/60 text-carnelian-200'
                                        : hazard.severity === 'moderate'
                                          ? 'border border-amber-700 bg-amber-900/60 text-amber-200'
                                          : 'bg-royal-800 text-limestone-300'
                                    }`}
                                  >
                                    {hazard.severity}
                                  </span>
                                </div>
                                <p className="mt-1 text-[11px] text-limestone-300">{l(hazard.description)}</p>
                                <div className="mt-1 text-[10px] text-malachite">
                                  <span className="font-semibold">{t('أسلوب التخفيف: ', 'Mitigation: ')}</span>
                                  <span className="text-limestone-200">{l(hazard.mitigation)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <aside className="min-w-0 border-t border-royal-700 pt-3 md:border-s md:border-t-0 md:ps-4 md:pt-0">
                      {target ? (
                        <TargetImage
                          target={target}
                          className="h-24 w-full border border-royal-700"
                          imageClassName="grayscale-[0.15]"
                          compact
                        />
                      ) : null}

                      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                        <div>
                          <dt className="text-[10px] text-limestone-400">{t('البذرة', 'Seed')}</dt>
                          <dd className="truncate font-latin text-[11px] tabular-nums text-limestone-200" dir="ltr" title={chapter.seed}>
                            {chapter.seed}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] text-limestone-400">{t('السنة', 'Year')}</dt>
                          <dd className="font-latin text-[11px] tabular-nums text-limestone-200" dir="ltr">
                            {chapter.year}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-3 border-s-2 border-ochre-400 py-1 ps-3">
                        <div className="text-[10px] text-ochre-300">
                          {t('إشارة معترضة', 'Intercepted transmission')}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-limestone-100">
                          {l(chapter.transmission)}
                        </p>
                      </div>

                      <div className="mt-3 border-t border-royal-700 pt-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-[10px] text-limestone-400">
                            {t('نهاية الفصل', 'Chapter ending')}
                          </span>
                          {record ? (
                            <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                              {fmtDateTime(record.completedAt, lang)}
                            </span>
                          ) : (
                            <IconLock className="h-3 w-3 text-limestone-400" />
                          )}
                        </div>
                        <p
                          className={`mt-1 text-[11px] leading-[1.8] ${
                            record ? 'text-limestone-200' : 'text-limestone-400'
                          }`}
                        >
                          {record
                            ? l(chapter.epilogue)
                            : t(
                                'تُفتح نهاية الفصل بعد إتمام المهمة.',
                                'The chapter ending unlocks when the mission is complete.',
                              )}
                        </p>
                        {record ? (
                          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-royal-700 pt-2 text-[10px] text-limestone-400">
                            <span>{t('أفضل نتيجة', 'Best score')}</span>
                            <span className="font-latin text-sm tabular-nums text-limestone-50" dir="ltr">
                              {fmt(record.bestScore, 1)}
                            </span>
                            <span className="border border-royal-600 px-1 font-latin text-[10px] text-ochre-300">
                              {record.bestGrade}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </aside>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {progress.allCompleted ? (
        <section className="mt-6 border-2 border-ochre-400 p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[11px] text-ochre-300">
              {t('شهادة إتمام الحملة', 'Campaign completion record')}
            </span>
            <span className="font-latin text-[11px] tabular-nums text-limestone-400" dir="ltr">
              {t('2041 إلى 2051', '2041 to 2051')}
            </span>
          </div>
          <div className="mt-2 flex items-start gap-3">
            <IconCrown className="mt-1 h-8 w-8 shrink-0 text-ochre-300" />
            <div className="min-w-0">
              <h2 className="font-display text-2xl leading-snug text-limestone-50 sm:text-3xl">
                {t('الأفق مفتوح', 'The horizon is open')}
              </h2>
              <p className="mt-2 max-w-[64ch] text-sm leading-[1.8] text-limestone-200">
                {l(CAMPAIGN.finale)}
              </p>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 border-t border-ochre-400/40 pt-3 sm:grid-cols-3">
            <div>
              <dt className="text-[10px] text-limestone-400">{t('قائد البرنامج', 'Programme lead')}</dt>
              <dd className="mt-0.5 text-sm text-limestone-50">{pilotName}</dd>
            </div>
            <div>
              <dt className="text-[10px] text-limestone-400">{t('النجوم', 'Stars')}</dt>
              <dd className="mt-0.5 flex items-baseline gap-2">
                <CampaignStarRating
                  stars={progress.totalStars > 0 ? 3 : 0}
                  size="sm"
                  label={t(`${progress.totalStars} من ${progress.maxStars} نجمة`, `${progress.totalStars} of ${progress.maxStars} stars`)}
                />
                <span className="font-latin text-sm tabular-nums text-limestone-50" dir="ltr">
                  {progress.totalStars} / {progress.maxStars}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] text-limestone-400">{t('الفصول', 'Chapters')}</dt>
              <dd className="mt-0.5 font-latin text-sm tabular-nums text-limestone-50" dir="ltr">
                {progress.completedCount} / {CAMPAIGN_CHAPTERS.length}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <SimplifiedNote className="mt-4">{l(CAMPAIGN.disclaimer)}</SimplifiedNote>
    </Modal>
  );
}

function SignalField({
  label,
  value,
  hint,
  latin = false,
}: {
  label: string;
  value: string;
  hint: string;
  latin?: boolean;
}) {
  return (
    <div className="border-t border-royal-700 px-3 py-2.5 first:border-t-0 sm:border-s sm:border-t-0 sm:first:border-s-0">
      <dt className="text-[10px] text-limestone-400">{label}</dt>
      <dd
        className={`mt-0.5 text-sm text-limestone-100 ${latin ? 'font-latin tabular-nums' : ''}`}
        dir={latin ? 'ltr' : undefined}
      >
        {value}
      </dd>
      <dd className="mt-0.5 text-[10px] leading-relaxed text-limestone-400">{hint}</dd>
    </div>
  );
}

function ChapterFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] text-limestone-400">{label}</dt>
      <dd className="truncate text-xs text-limestone-100" title={value}>
        {value}
      </dd>
    </div>
  );
}
