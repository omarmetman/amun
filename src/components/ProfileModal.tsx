import type { AchievementCategory, AchievementDef } from '../data/types';
import { ACHIEVEMENTS, ACHIEVEMENT_COUNT, rankFor } from '../data/achievements';
import { CAMPAIGN, CAMPAIGN_CHAPTERS, campaignProgress } from '../data/campaign';
import { isChapterUnlocked } from '../engine/campaign';
import { useL, useT } from '../i18n';
import { fmt } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { AchievementCard } from './Achievements';
import { CampaignStarRating, CAMPAIGN_ACCENTS } from './CampaignArt';
import { Modal } from './Modal';
import { Bar, InlineNote, Stat } from './StepBits';
import {
  IconCompass,
  IconCrown,
  IconFlag,
  IconLock,
  IconMedal,
  IconWrench,
} from './Icons';

const CATEGORY_ICONS: Record<AchievementCategory, typeof IconFlag> = {
  milestone: IconFlag,
  exploration: IconCompass,
  engineering: IconWrench,
  mastery: IconCrown,
};

export function ProfileModal({
  onClose,
  onCampaign,
}: {
  onClose: () => void;
  onCampaign?: () => void;
}) {
  const t = useT();
  const l = useL();
  const profile = useMissionStore((state) => state.profile);
  const pilotName = useMissionStore((state) => state.pilotName);
  const campaign = useMissionStore((state) => state.campaign);
  const progress = campaignProgress(campaign.completed);
  const unlockedCount = Object.keys(profile.unlocked).length;
  const { current, next } = rankFor(unlockedCount);
  const stats = profile.stats;
  const successRate = stats.runs > 0 ? (stats.successes / stats.runs) * 100 : 0;
  const rankProgress = next
    ? Math.max(0, Math.min(1, (unlockedCount - current.min) / (next.min - current.min)))
    : 1;

  const categories: Array<{
    id: AchievementCategory;
    title: string;
    description: string;
  }> = [
    {
      id: 'milestone',
      title: t('محطات الرحلة', 'Milestones'),
      description: t('أول خطوة، أول نجاح، والاستمرار.', 'First steps, first success and persistence.'),
    },
    {
      id: 'exploration',
      title: t('الاستكشاف', 'Exploration'),
      description: t('الأهداف وأنواع المهام التي وصلت إليها.', 'Targets and mission types you have reached.'),
    },
    {
      id: 'engineering',
      title: t('الهندسة', 'Engineering'),
      description: t('قرارات التصميم الذكية والهوامش الصحية.', 'Smart design choices and healthy margins.'),
    },
    {
      id: 'mastery',
      title: t('الإتقان', 'Mastery'),
      description: t('الدرجات العالية والمهام الصعبة.', 'High grades and hard missions.'),
    },
  ];

  return (
    <Modal
      title={t('ملف القائد', 'Pilot profile')}
      description={t(
        'سجل محلي لكل محاكاة شغّلتها، وأوسمة تُفتح تلقائيًا عند تحقق شروطها.',
        'A local record of every simulation you ran, with badges that unlock automatically when their conditions are met.',
      )}
      onClose={onClose}
      extraWide
    >
      <section className="border border-royal-700 border-t-2 border-t-ochre-400">
        <div className="flex flex-wrap items-start gap-4 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-royal-600 bg-lapis-950/40 text-ochre-300">
            <IconCrown className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-ochre-300">{t('الرتبة الحالية', 'Current rank')}</div>
            <h2 className="mt-0.5 truncate font-display text-2xl text-limestone-50">{pilotName}</h2>
            <p className="mt-0.5 text-sm text-limestone-200">{l(current.title)}</p>
          </div>
          <div className="shrink-0 text-end">
            <div className="font-latin text-2xl leading-none tabular-nums text-limestone-50" dir="ltr">
              {unlockedCount}
            </div>
            <div className="mt-1 text-[10px] text-limestone-400">
              {t(`من ${ACHIEVEMENT_COUNT} إنجازًا`, `of ${ACHIEVEMENT_COUNT} achievements`)}
            </div>
          </div>
        </div>

        <div className="border-t border-royal-700 px-4 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-[11px] text-limestone-300">
            <span>
              {next
                ? t(
                    `${next.min - unlockedCount} إنجازًا حتى رتبة «${l(next.title)}»`,
                    `${next.min - unlockedCount} achievement${next.min - unlockedCount === 1 ? '' : 's'} to “${l(next.title)}”`,
                  )
                : t('أعلى رتبة متاحة: أسطورة آمون', 'Highest rank reached: AMUN Legend')}
            </span>
            <span className="font-latin tabular-nums text-ochre-300" dir="ltr">
              {fmt(rankProgress * 100, 0)}%
            </span>
          </div>
          <Bar
            className="mt-1.5"
            ratio={rankProgress}
            tone="gold"
            aria-label={t('التقدم إلى الرتبة التالية', 'Progress to the next rank')}
          />
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          label={t('المحاولات', 'Attempts')}
          value={fmt(stats.runs)}
          hint={t('جولة مسجلة', 'recorded runs')}
        />
        <Stat
          label={t('النجاح', 'Success')}
          value={fmt(stats.successes)}
          hint={`${fmt(successRate, 0)}%`}
          tone={stats.successes > 0 ? 'good' : 'default'}
        />
        <Stat
          label={t('أفضل درجة', 'Best score')}
          value={fmt(stats.bestScore, 1)}
          hint={t('من 100', 'out of 100')}
          tone="gold"
        />
        <Stat
          label={t('درجات S', 'S grades')}
          value={fmt(stats.sGrades)}
          hint={t('أعلى تقدير', 'top grade')}
          tone={stats.sGrades > 0 ? 'gold' : 'default'}
        />
        <Stat
          label={t('إجمالي العلم', 'Total science')}
          value={fmt(stats.totalScience, 0)}
          hint={t('عبر كل الجولات', 'across all runs')}
          tone="royal"
        />
        <Stat
          label={t('إجمالي البيانات', 'Total data')}
          value={
            <>
              {fmt(stats.totalDataGb, 1)} <span className="text-[10px]">GB</span>
            </>
          }
          hint={t('عبر كل الجولات', 'across all runs')}
          tone="royal"
        />
      </div>

      <section className="mt-5 border border-royal-700">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-t-ochre-400 px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <IconFlag className="h-4 w-4 text-ochre-300" />
            <div>
              <div className="text-[10px] text-ochre-300">{t('الحملة القصصية', 'Story campaign')}</div>
              <h3 className="font-display text-base leading-snug text-limestone-50">{l(CAMPAIGN.title)}</h3>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-latin text-[11px] tabular-nums text-limestone-200" dir="ltr">
              {progress.completedCount} / {CAMPAIGN_CHAPTERS.length}
            </span>
            <span className="font-latin text-[11px] tabular-nums text-ochre-300" dir="ltr">
              {progress.totalStars} / {progress.maxStars}
            </span>
            {onCampaign ? (
              <button type="button" onClick={onCampaign} className="btn-ghost text-xs">
                <IconFlag className="h-3.5 w-3.5" />
                {t('افتح الحملة', 'Open campaign')}
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-0.5 px-3.5 pb-2" aria-hidden="true">
          {CAMPAIGN_CHAPTERS.map((chapter) => {
            const record = campaign.completed[chapter.id];
            const unlocked = isChapterUnlocked(chapter.id, campaign.completed);
            return (
              <span
                key={`${chapter.id}-mark`}
                className={`h-1 ${
                  record ? 'bg-ochre-400' : unlocked ? 'bg-royal-400' : 'bg-royal-700'
                }`}
              />
            );
          })}
        </div>

        <ol>
          {CAMPAIGN_CHAPTERS.map((chapter) => {
            const record = campaign.completed[chapter.id];
            const unlocked = isChapterUnlocked(chapter.id, campaign.completed);
            const accent = CAMPAIGN_ACCENTS[chapter.accent];
            return (
              <li
                key={chapter.id}
                className="grid grid-cols-[8px_22px_minmax(0,1fr)_auto] items-baseline gap-x-2 border-t border-royal-700 px-3.5 py-2"
              >
                <span
                  className={`h-1.5 w-1.5 self-center ${
                    record ? accent.dot : unlocked ? 'bg-royal-400' : 'bg-royal-700'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                  {String(chapter.number).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-xs text-limestone-100">{l(chapter.title)}</div>
                  <div className="text-[10px] text-limestone-400">
                    {record
                      ? `${fmt(record.bestScore, 1)} / ${record.bestGrade}`
                      : unlocked
                        ? t('متاح للعب', 'Available')
                        : t('مقفل', 'Locked')}
                  </div>
                </div>
                {record ? (
                  <CampaignStarRating
                    stars={record.stars}
                    size="sm"
                    label={t(`${record.stars} من 3 نجوم`, `${record.stars} of 3 stars`)}
                  />
                ) : unlocked ? (
                  <IconMedal className="h-3.5 w-3.5 text-limestone-400" />
                ) : (
                  <IconLock className="h-3.5 w-3.5 text-limestone-400" />
                )}
              </li>
            );
          })}
        </ol>

        {progress.completedCount === 0 ? (
          <p className="border-t border-royal-700 px-3.5 py-2.5 text-[11px] leading-relaxed text-limestone-400">
            {t(
              'لم تبدأ الحملة بعد. الفصل الأول متاح الآن، وكل فصل يفتح الذي بعده عند إتمامه.',
              'The campaign has not started yet. Chapter one is available now, and each clear unlocks the next.',
            )}
          </p>
        ) : null}
      </section>

      <div className="mt-6 space-y-5">
        {categories.map((category) => {
          const achievements = ACHIEVEMENTS.filter(
            (achievement) => achievement.category === category.id,
          );
          const unlockedInCategory = achievements.filter(
            (achievement) => profile.unlocked[achievement.id],
          ).length;
          const Icon = CATEGORY_ICONS[category.id];
          return (
            <section key={category.id}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 border-b border-royal-700 pb-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-ochre-300" />
                  <div className="min-w-0">
                    <h3 className="font-display text-sm leading-snug text-limestone-50">{category.title}</h3>
                    <p className="text-[10px] leading-snug text-limestone-400">{category.description}</p>
                  </div>
                </div>
                <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                  {unlockedInCategory}/{achievements.length}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {achievements.map((achievement: AchievementDef) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlockedAt={profile.unlocked[achievement.id]}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <InlineNote tone="neutral" className="mt-5">
        {t(
          'الملف والإنجازات والحملة محفوظة في هذا المتصفح فقط. بدء مهمة جديدة يحتفظ بها، أما «تصفير كل شيء» فيمسحها مع المحاولات ولوحة الصدارة.',
          'The profile, achievements and campaign live in this browser only. Starting a new mission keeps them, while “Full reset” erases them along with attempts and the leaderboard.',
        )}
      </InlineNote>
    </Modal>
  );
}
