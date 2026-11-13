import { ArrowLeft, ArrowRight, Flag, Lock, Radio, Star, Target } from 'lucide-react';
import { CAMPAIGN_CHAPTERS } from '../data/campaign';
import { difficultyById, missionTypeById, tierById } from '../data/missions';
import { targetById } from '../data/targets';
import { useL, useLang, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';
import { useActiveChapter, useCampaignProgress } from '../store/useCampaign';
import { CAMPAIGN_ACCENTS, ChapterPatch } from './CampaignArt';
import { StatusPill } from './Badges';

/**
 * Persistent story strip shown above the wizard while a campaign chapter is
 * active. It keeps the fixed directives, the chapter objective and the reward
 * state visible without interrupting the engineering flow.
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
      className={`relative mb-4 overflow-hidden rounded-2xl border ${accent.border} bg-gradient-to-r ${accent.gradient} ${accent.soft}`}
    >
      <div className="campaign-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -end-10 -top-16 h-44 w-44 opacity-50" aria-hidden="true">
        <div className={`absolute inset-8 rounded-full ${accent.bg} blur-2xl`} />
      </div>

      <div className="relative flex flex-wrap items-center gap-3 p-3 sm:p-3.5">
        <ChapterPatch chapter={chapter} size="sm" className="hidden sm:flex" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-gold-200/90">
              <Flag className="h-3 w-3" aria-hidden="true" />
              {t('حملة أفق آمون', 'AMUN Horizon')}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden="true" />
            <span className={`font-latin text-[9px] font-bold tracking-[0.16em] ${accent.text}`} dir="ltr">
              CHAPTER {String(chapter.number).padStart(2, '0')} · {chapter.code}
            </span>
            {record ? (
              <StatusPill tone="good">{t('مكتمل', 'Complete')}</StatusPill>
            ) : (
              <StatusPill tone="warn">
                <Radio className="h-3 w-3" aria-hidden="true" />
                {t('قيد التنفيذ', 'In progress')}
              </StatusPill>
            )}
          </div>

          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2 className="truncate text-sm font-black text-white sm:text-base">{l(chapter.title)}</h2>
            <span className="truncate text-[10px] font-semibold text-slate-400">{l(chapter.subtitle)}</span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-[10px] leading-relaxed text-slate-300/90">
            {l(chapter.objective)}
          </p>

          <div className="mt-1.5 flex flex-wrap gap-1">
            <span className="chip !px-2 !py-0.5 !text-[9px]">
              <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
              <Target className="h-2.5 w-2.5 text-royal-300" aria-hidden="true" />
              {target ? l(target.name) : chapter.targetId}
            </span>
            <span className="chip !px-2 !py-0.5 !text-[9px]">
              <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
              {mission ? l(mission.short) : chapter.missionType}
            </span>
            <span className="chip !px-2 !py-0.5 !text-[9px]">
              {tier ? l(tier.name) : chapter.successTier}
              {difficulty ? ` · ${l(difficulty.name)}` : ''}
            </span>
            <span className="chip !px-2 !py-0.5 !text-[9px] font-latin" dir="ltr">
              <Lock className="h-2.5 w-2.5 text-gold-300/80" aria-hidden="true" />
              {chapter.seed}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-latin text-[10px] font-bold text-gold-200" dir="ltr">
              {progress.completedCount}/{CAMPAIGN_CHAPTERS.length}
            </span>
            <span className="flex items-center gap-0.5 text-gold-300">
              <Star className={`h-3 w-3 ${recordStars > 0 ? 'fill-gold-300' : ''}`} aria-hidden="true" />
              <span className="font-latin text-[10px] font-bold" dir="ltr">{recordStars}/3</span>
            </span>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {CAMPAIGN_CHAPTERS.map((entry, entryIndex) => (
              <span
                key={entry.id}
                className={`h-1.5 rounded-full transition-all ${
                  entryIndex === index
                    ? `w-5 ${accent.dot}`
                    : entryIndex < index
                      ? 'w-2.5 bg-good/60'
                      : 'w-2.5 bg-white/15'
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={onOpen} className="btn-ghost !px-2.5 !py-1 text-[10px]">
            <Flag className="h-3 w-3 text-gold-300" aria-hidden="true" />
            {t('خريطة الحملة', 'Campaign map')}
            {lang === 'ar' ? (
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="relative h-0.5 w-full bg-white/[0.05]" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-royal-500 via-royal-400 to-gold-300 transition-all"
          style={{ width: `${(progress.completedCount / CAMPAIGN_CHAPTERS.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
