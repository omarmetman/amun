import { CAMPAIGN_CHAPTERS } from '../data/campaign';
import { difficultyById, missionTypeById, tierById } from '../data/missions';
import { targetById } from '../data/targets';
import { useL, useLang, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';
import { useActiveChapter, useCampaignProgress } from '../store/useCampaign';
import { CAMPAIGN_ACCENTS, ChapterPatch } from './CampaignArt';
import { StatusPill } from './Badges';
import { IconChevron, IconFlag } from './Icons';

/**
 * Persistent story strip shown above the wizard while a campaign chapter is
 * active. It keeps the fixed directives and the chapter objective visible
 * without interrupting the engineering flow.
 */
export function CampaignBanner({ onOpen }: { onOpen: () => void }) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const chapter = useActiveChapter();
  const progress = useCampaignProgress();
  const record = useMissionStore((state) =>
    chapter ? state.campaign.completed[chapter.id] : undefined,
  );

  if (!chapter) return null;

  const accent = CAMPAIGN_ACCENTS[chapter.accent];
  const target = targetById[chapter.targetId];
  const mission = missionTypeById[chapter.missionType];
  const difficulty = difficultyById[chapter.difficulty];
  const tier = tierById[chapter.successTier];
  const index = CAMPAIGN_CHAPTERS.findIndex((entry) => entry.id === chapter.id);
  const recordStars = record?.stars ?? 0;

  return (
    <section
      aria-label={t(`الفصل ${chapter.number}: ${l(chapter.title)}`, `Chapter ${chapter.number}: ${l(chapter.title)}`)}
      className="mb-4 border border-s-2 border-royal-700 bg-royal-700/15"
      style={{ borderInlineStartColor: accent.hex }}
    >
      <div className="flex flex-wrap items-start gap-3 p-3 sm:p-3.5">
        <ChapterPatch chapter={chapter} size="sm" className="hidden sm:flex" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="inline-flex items-baseline gap-1.5 text-[10px] text-limestone-400">
              <IconFlag className="h-3 w-3 self-center" />
              {t('حملة أفق آمون', 'AMUN Horizon')}
            </span>
            <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
              {String(chapter.number).padStart(2, '0')} / {chapter.code}
            </span>
            {record ? (
              <StatusPill tone="good">{t('مكتمل', 'Complete')}</StatusPill>
            ) : (
              <StatusPill tone="warn">{t('قيد التنفيذ', 'In progress')}</StatusPill>
            )}
          </div>

          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h2 className="truncate font-display text-sm text-limestone-50 sm:text-base">{l(chapter.title)}</h2>
            <span className="truncate text-[11px] text-limestone-400">{l(chapter.subtitle)}</span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-limestone-300">{l(chapter.objective)}</p>

          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[10px] text-limestone-300">
            <span>{target ? l(target.name) : chapter.targetId}</span>
            <span>{mission ? l(mission.short) : chapter.missionType}</span>
            <span>
              {tier ? l(tier.name) : chapter.successTier}
              {difficulty ? ` / ${l(difficulty.name)}` : ''}
            </span>
            <span className="font-latin tabular-nums text-limestone-400" dir="ltr">
              {chapter.seed}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-baseline gap-2 text-[10px] text-limestone-300">
            <span className="font-latin tabular-nums" dir="ltr">
              {progress.completedCount}/{CAMPAIGN_CHAPTERS.length}
            </span>
            <span className="font-latin tabular-nums text-ochre-300" dir="ltr">
              {recordStars}/3
            </span>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {CAMPAIGN_CHAPTERS.map((entry, entryIndex) => (
              <span
                key={entry.id}
                className={`h-1 ${
                  entryIndex === index
                    ? `w-5 ${accent.dot}`
                    : entryIndex < index
                      ? 'w-2.5 bg-malachite'
                      : 'w-2.5 bg-royal-600'
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={onOpen} className="btn-ghost text-[10px]">
            <IconFlag className="h-3 w-3 text-ochre-400" />
            {t('خريطة الحملة', 'Campaign map')}
            <IconChevron dir={lang === 'ar' ? 'end' : 'start'} className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="h-0.5 w-full bg-royal-700" aria-hidden="true">
        <div
          className="h-full bg-ochre-400 transition-[width] duration-300"
          style={{ width: `${(progress.completedCount / CAMPAIGN_CHAPTERS.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
