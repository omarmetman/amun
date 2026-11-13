import { CAMPAIGN_CHAPTERS, campaignProgress, nextCampaignChapter } from '../data/campaign';
import { evaluateCampaignChapter } from '../engine/campaign';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { useActiveChapter } from '../store/useCampaign';
import { CampaignStarRating, CAMPAIGN_ACCENTS, ChapterPatch } from './CampaignArt';
import { StatusPill } from './Badges';
import { IconCheck, IconCross, IconDice, IconFlag, IconLock, IconPlay, IconReset, IconTarget } from './Icons';

/**
 * Campaign payoff for the evaluation step: the chapter ending, the objectives
 * that earned the stars, and the road to the next chapter. In freeplay this
 * component renders nothing.
 */
export function CampaignDebrief({ onOpenCampaign }: { onOpenCampaign: () => void }) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const chapter = useActiveChapter();
  const design = useDesign();
  const simulation = useMissionStore((state) => state.simulation);
  const score = useMissionStore((state) => state.score);
  const campaign = useMissionStore((state) => state.campaign);
  const replaySameChoices = useMissionStore((state) => state.replaySameChoices);
  const replaySameSeed = useMissionStore((state) => state.replaySameSeed);
  const startCampaignChapter = useMissionStore((state) => state.startCampaignChapter);

  if (!chapter || !simulation || !score) return null;

  const accent = CAMPAIGN_ACCENTS[chapter.accent];
  const evaluation = evaluateCampaignChapter(chapter, design, simulation, score);
  const record = campaign.completed[chapter.id];
  const next = nextCampaignChapter(chapter.id);
  const progress = campaignProgress(campaign.completed);
  const stars = evaluation.stars;
  const bestStars = record?.stars ?? stars;
  const completedEver = record !== undefined;

  const advance = () => {
    if (next && startCampaignChapter(next.id)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onOpenCampaign();
  };

  const retrySameDesign = () => {
    replaySameChoices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retryReference = () => {
    replaySameSeed();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scienceGap = Math.max(0, design.tier.minScience - simulation.scienceAchieved);
  const dataGap = Math.max(0, design.tier.minDataGb - simulation.dataSentGb);
  const headline = evaluation.completed
    ? next
      ? t('اكتمل الفصل، والطريق يتوسّع', 'Chapter complete, and the road widens')
      : t('نهاية الحملة، والأفق مفتوح', 'Campaign complete, the horizon is open')
    : completedEver
      ? t('هذه الجولة لم تكتمل، لكن الفصل محفوظ', 'This run fell short, but the chapter remains complete')
      : t('لم يكتمل الفصل بعد', 'The chapter is not complete yet');

  return (
    <section
      className="border border-s-2 border-royal-700 bg-royal-700/10"
      style={{ borderInlineStartColor: accent.hex }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <ChapterPatch chapter={chapter} size="md" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`font-latin text-[10px] tabular-nums ${accent.text}`} dir="ltr">
                  {String(chapter.number).padStart(2, '0')} / {chapter.code}
                </span>
                {evaluation.completed ? (
                  <StatusPill tone="good">
                    <IconCheck className="h-3 w-3" />
                    {t('مكتمل', 'Complete')}
                  </StatusPill>
                ) : (
                  <StatusPill tone="danger">
                    <IconCross className="h-3 w-3" />
                    {t('غير مكتمل', 'Not complete')}
                  </StatusPill>
                )}
                {completedEver ? (
                  <span className="text-[10px] text-limestone-400">
                    {t('أفضل سجل', 'Best record')}{' '}
                    <span className="font-latin tabular-nums text-limestone-200" dir="ltr">
                      {fmt(record.bestScore, 1)}
                    </span>
                  </span>
                ) : null}
              </div>
              <h2 className="mt-0.5 font-display text-lg leading-tight text-limestone-50 sm:text-xl">
                {l(chapter.title)}
              </h2>
              <p className="text-[11px] text-limestone-400">{l(chapter.subtitle)}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <CampaignStarRating
              stars={bestStars}
              size="lg"
              label={t(`أفضل تقييم ${bestStars} من 3 نجوم`, `Best rating ${bestStars} of 3 stars`)}
            />
            <span className="text-[10px] text-limestone-400">
              {t(
                `هذه الجولة ${stars}/3، الأفضل ${bestStars}/3`,
                `This run ${stars}/3, best ${bestStars}/3`,
              )}
            </span>
          </div>
        </div>

        <h3 className="mt-3 border-t border-royal-700 pt-2 font-display text-base text-limestone-50 sm:text-lg">
          {headline}
        </h3>
        <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-limestone-300">{l(chapter.objective)}</p>

        <div className="mt-3 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="border-t border-royal-700">
              <Requirement
                met={simulation.success}
                label={t('المهمة', 'Mission')}
                detail={simulation.success ? t('سالمة حتى العمليات', 'Alive through operations') : t('فُقدت أو توقفت', 'Lost or stopped')}
              />
              <Requirement
                met={evaluation.tierMet.science}
                label={t('العلم', 'Science')}
                detail={
                  evaluation.tierMet.science
                    ? `${fmt(simulation.scienceAchieved, 1)} / ${fmt(design.tier.minScience, 0)}`
                    : t(`فجوة ${fmt(scienceGap, 1)}`, `${fmt(scienceGap, 1)} short`)
                }
              />
              <Requirement
                met={evaluation.tierMet.data}
                label={t('البيانات', 'Data')}
                detail={
                  evaluation.tierMet.data
                    ? `${fmt(simulation.dataSentGb, 2)} GB / ${fmt(design.tier.minDataGb, 1)} GB`
                    : t(`فجوة ${fmt(dataGap, 2)} GB`, `${fmt(dataGap, 2)} GB short`)
                }
              />
            </div>

            <div className="mt-3">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[11px] text-limestone-300">{t('أهداف الفصل ونجومها', 'Chapter objectives and stars')}</span>
                <span className="font-latin text-[11px] tabular-nums text-ochre-300" dir="ltr">
                  {evaluation.stars}/3
                </span>
              </div>
              <ObjectiveRow
                met
                title={t('إتمام الفصل', 'Chapter completion')}
                description={t(
                  'مهمة ناجحة تحقق معياري العلم والبيانات.',
                  'A successful mission meeting both the science and data tiers.',
                )}
                star
              />
              {chapter.bonusObjectives.map((objective) => {
                const met = Boolean(evaluation.objectives.find((entry) => entry.id === objective.id)?.met);
                const saved = Boolean(record?.objectives[objective.id]);
                return (
                  <ObjectiveRow
                    key={objective.id}
                    met={met}
                    saved={saved && !met}
                    title={l(objective.title)}
                    description={l(objective.description)}
                    star
                  />
                );
              })}
            </div>

            <div className="mt-3 border-s-2 border-royal-400 py-1 ps-3">
              <div className="flex items-center gap-1.5 text-[10px] text-royal-300">
                <IconFlag className="h-3.5 w-3.5" />
                {t('إشارة معترضة', 'Intercepted transmission')}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-limestone-200">{l(chapter.transmission)}</p>
            </div>
          </div>

          <div>
            <div className="border-t border-royal-700 pt-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-ochre-300">{t('نهاية الفصل', 'Chapter ending')}</span>
                {completedEver ? (
                  <span className="font-latin text-[10px] text-limestone-400" dir="ltr">
                    {fmtDateTime(record.completedAt, lang)}
                  </span>
                ) : (
                  <IconLock className="h-3.5 w-3.5 text-limestone-400" />
                )}
              </div>
              <p className={`mt-1 text-sm leading-relaxed ${completedEver ? 'text-limestone-200' : 'text-limestone-400'}`}>
                {completedEver
                  ? l(chapter.epilogue)
                  : t(
                      'تفتح نهاية الفصل عندما تنجح المهمة ويصل العلم والبيانات إلى المعيار. القصة لا تمنح نفسها مجانًا.',
                      'The chapter ending unlocks when the mission succeeds and science and data reach the tier. The story does not give itself away for free.',
                    )}
              </p>
            </div>

            <div className="mt-3 border-t border-royal-700 pt-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-[11px]">
                <span className="text-limestone-300">{t('تقدم الحملة', 'Campaign progress')}</span>
                <span className="font-latin tabular-nums text-ochre-300" dir="ltr">
                  {progress.completedCount}/{CAMPAIGN_CHAPTERS.length} / {progress.totalStars}/{progress.maxStars}
                </span>
              </div>
              <div className="mt-1 flex gap-1" aria-hidden="true">
                {CAMPAIGN_CHAPTERS.map((entry, index) => {
                  const done = Boolean(campaign.completed[entry.id]);
                  const active = entry.id === chapter.id;
                  return (
                    <span
                      key={entry.id}
                      className={`h-1 flex-1 ${
                        active ? 'bg-ochre-400' : done ? 'bg-malachite' : index < chapter.number - 1 ? 'bg-royal-500' : 'bg-royal-700'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-limestone-400">
                {t(
                  'النجوم تُحفظ لأفضل جولة. إعادة الفصل لا تمحو نجومك أو نهايته.',
                  'Stars keep the best run. Replaying a chapter never erases your stars or its ending.',
                )}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {evaluation.completed || completedEver ? (
                <button type="button" onClick={advance} className="btn-primary text-[11px]">
                  <IconPlay className="h-3.5 w-3.5" />
                  {next
                    ? t(
                        `افتح الفصل ${next.number}: ${l(next.title)}`,
                        `Open chapter ${next.number}: ${l(next.title)}`,
                      )
                    : t('اعرض شهادة الحملة', 'View the campaign record')}
                </button>
              ) : null}
              <button type="button" onClick={retrySameDesign} className="btn-secondary text-[11px]">
                <IconReset className="h-3.5 w-3.5" />
                {t('أعد بتصميمك', 'Retry your design')}
              </button>
              <button type="button" onClick={retryReference} className="btn-ghost text-[11px]">
                <IconDice className="h-3.5 w-3.5" />
                {t('التصميم المرجعي', 'Reference design')}
              </button>
              <button type="button" onClick={onOpenCampaign} className="btn-ghost text-[11px]">
                <IconFlag className="h-3.5 w-3.5 text-ochre-400" />
                {t('خريطة الحملة', 'Campaign map')}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[10px] text-limestone-400">
              <span className="inline-flex items-baseline gap-1">
                <IconTarget className="h-3 w-3 self-center text-royal-300" />
                {l(chapter.title)}
              </span>
              <span className="font-latin tabular-nums" dir="ltr">{chapter.seed}</span>
              <span>{t('بذرة ثابتة طوال الفصل', 'Seed fixed for the chapter')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Requirement({ met, label, detail }: { met: boolean; label: string; detail: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-royal-700 py-1.5 last:border-0">
      <span className="inline-flex items-baseline gap-1.5 text-xs text-limestone-200">
        {met ? (
          <IconCheck className="h-3.5 w-3.5 self-center text-malachite" />
        ) : (
          <IconCross className="h-3.5 w-3.5 self-center text-carnelian-300" />
        )}
        {label}
      </span>
      <span className={`font-latin text-[11px] tabular-nums ${met ? 'text-malachite' : 'text-carnelian-300'}`} dir="ltr">
        {detail}
      </span>
    </div>
  );
}

function ObjectiveRow({
  met,
  saved = false,
  title,
  description,
  star = false,
}: {
  met: boolean;
  saved?: boolean;
  title: string;
  description: string;
  star?: boolean;
}) {
  const t = useT();
  return (
    <div className="grid grid-cols-[16px_minmax(0,1fr)] gap-x-2 border-b border-royal-700 py-2 last:border-0">
      <span className="mt-0.5">
        {met ? (
          <IconCheck className="h-3.5 w-3.5 text-malachite" />
        ) : saved ? (
          <IconFlag className="h-3.5 w-3.5 text-ochre-400" />
        ) : (
          <IconLock className="h-3.5 w-3.5 text-limestone-400" />
        )}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className={`text-xs ${met ? 'text-limestone-50' : 'text-limestone-200'}`}>{title}</span>
          {met && star ? <span className="text-[10px] text-ochre-300">+1</span> : null}
          {saved && !met ? (
            <span className="border-b border-dashed border-limestone-400 text-[10px] text-limestone-400">
              {t('محفوظ من جولة سابقة', 'saved from an earlier run')}
            </span>
          ) : null}
        </div>
        <p className="text-[11px] leading-relaxed text-limestone-400">{description}</p>
      </div>
    </div>
  );
}
