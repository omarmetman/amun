import { Crown, Flag, Compass, Lock, Sparkles, Star, Trophy, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AchievementCategory, AchievementDef } from '../data/types';
import { ACHIEVEMENTS, ACHIEVEMENT_COUNT, rankFor } from '../data/achievements';
import { CAMPAIGN, CAMPAIGN_CHAPTERS, campaignProgress } from '../data/campaign';
import { isChapterUnlocked } from '../engine/campaign';
import { useL, useT } from '../i18n';
import { fmt } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { AchievementCard } from './Achievements';
import { CampaignStarRating, CAMPAIGN_ACCENTS, ChapterPatch } from './CampaignArt';
import { Modal } from './Modal';
import { Bar, InlineNote, Stat } from './StepBits';

const CATEGORY_ICONS: Record<AchievementCategory, LucideIcon> = {
  milestone: Flag,
  exploration: Compass,
  engineering: Wrench,
  mastery: Crown,
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
      <section className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/[0.09] via-royal-500/[0.05] to-transparent p-4">
        <div className="pointer-events-none absolute -end-14 -top-16 h-44 w-44 rounded-full bg-gold-400/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold-400/30 bg-void-950/50 text-gold-200 shadow-gold">
            <Trophy className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="eyebrow">{t('الرتبة الحالية', 'Current rank')}</div>
            <h2 className="mt-1 truncate text-xl font-black text-white">{pilotName}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-gold-400/25 bg-gold-400/10 px-2 py-1 text-[10px] font-bold text-gold-200">
                <Crown className="h-3 w-3" aria-hidden="true" />
                {l(current.title)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 font-latin text-[10px] font-bold text-slate-200" dir="ltr">
                <Trophy className="h-3 w-3" aria-hidden="true" />
                {unlockedCount}/{ACHIEVEMENT_COUNT}
              </span>
            </div>
          </div>
        </div>
        <div className="relative mt-4">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-slate-400">
            <span>
              {next
                ? t(
                    `${next.min - unlockedCount} إنجازًا حتى رتبة «${l(next.title)}»`,
                    `${next.min - unlockedCount} achievement${next.min - unlockedCount === 1 ? '' : 's'} to “${l(next.title)}”`,
                  )
                : t('أعلى رتبة متاحة — أسطورة آمون', 'Highest rank reached — AMUN Legend')}
            </span>
            <span className="font-latin text-gold-200" dir="ltr">
              {fmt(rankProgress * 100, 0)}%
            </span>
          </div>
          <Bar
            ratio={rankProgress}
            tone="gold"
            aria-label={t('التقدم إلى الرتبة التالية', 'Progress to the next rank')}
          />
        </div>
      </section>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
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
          value={<>{fmt(stats.totalDataGb, 1)} <span className="text-[10px]">GB</span></>}
          hint={t('عبر كل الجولات', 'across all runs')}
          tone="royal"
        />
      </div>

      <section className="relative mt-4 overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-royal-500/[0.09] via-gold-400/[0.045] to-transparent p-3.5">
        <div className="campaign-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/10 text-gold-200">
                <Flag className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <div className="eyebrow text-gold-200">{t('الحملة القصصية', 'Story campaign')}</div>
                <h3 className="text-sm font-black text-white">{l(CAMPAIGN.title)}</h3>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="chip !px-2 !py-0.5 !text-[9px]">
                {t(
                  `${progress.completedCount} / ${CAMPAIGN_CHAPTERS.length} فصول`,
                  `${progress.completedCount} / ${CAMPAIGN_CHAPTERS.length} chapters`,
                )}
              </span>
              <span className="chip !px-2 !py-0.5 !text-[9px]">
                <Star className="h-2.5 w-2.5 text-gold-300" aria-hidden="true" />
                <span className="font-latin" dir="ltr">{progress.totalStars} / {progress.maxStars}</span>
              </span>
              {onCampaign ? (
                <button type="button" onClick={onCampaign} className="btn-ghost !px-2.5 !py-1 text-[10px]">
                  <Flag className="h-3 w-3 text-gold-300" aria-hidden="true" />
                  {t('افتح الحملة', 'Open campaign')}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full border border-white/10 bg-void-950/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-royal-500 via-royal-400 to-gold-300"
              style={{ width: `${(progress.completedCount / CAMPAIGN_CHAPTERS.length) * 100}%` }}
            />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
            {CAMPAIGN_CHAPTERS.map((chapter) => {
              const record = campaign.completed[chapter.id];
              const unlocked = isChapterUnlocked(chapter.id, campaign.completed);
              const accent = CAMPAIGN_ACCENTS[chapter.accent];
              return (
                <div
                  key={chapter.id}
                  className={`rounded-xl border p-2 ${
                    record
                      ? `${accent.border} ${accent.soft}`
                      : unlocked
                        ? 'border-white/[0.08] bg-white/[0.02]'
                        : 'border-white/[0.05] bg-void-950/25 opacity-55'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <ChapterPatch chapter={chapter} size="sm" />
                    {record ? (
                      <CampaignStarRating
                        stars={record.stars}
                        size="sm"
                        label={t(`${record.stars} من 3 نجوم`, `${record.stars} of 3 stars`)}
                      />
                    ) : unlocked ? (
                      <Star className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-1.5 truncate text-[10px] font-bold text-white">{l(chapter.title)}</div>
                  <div className="mt-0.5 truncate text-[8px] text-slate-500">
                    {record
                      ? <span className="font-latin" dir="ltr">{fmt(record.bestScore, 1)} · {record.bestGrade}</span>
                      : unlocked
                        ? t('متاح للعب', 'Available')
                        : t('مقفل', 'Locked')}
                  </div>
                </div>
              );
            })}
          </div>

          {progress.completedCount === 0 ? (
            <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
              {t(
                'لم تبدأ الحملة بعد. الفصل الأول متاح الآن، وكل فصل يفتح الذي بعده عند إتمامه.',
                'The campaign has not started yet. Chapter one is available now, and each clear unlocks the next.',
              )}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mt-5 space-y-5">
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
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] text-slate-300">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white">{category.title}</h3>
                    <p className="text-[9px] text-slate-500">{category.description}</p>
                  </div>
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-latin text-[9px] font-bold text-slate-400" dir="ltr">
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
        <Sparkles className="me-1 inline h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
        {t(
          'الملف والإنجازات والحملة محفوظة في هذا المتصفح فقط. بدء مهمة جديدة يحتفظ بها، أما «تصفير كل شيء» فيمسحها مع المحاولات ولوحة الصدارة.',
          'The profile, achievements and campaign live in this browser only. Starting a new mission keeps them, while “Full reset” erases them along with attempts and the leaderboard.',
        )}
      </InlineNote>
    </Modal>
  );
}
