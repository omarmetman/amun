import type { AchievementDef, AchievementTier } from '../data/types';
import { ACHIEVEMENT_BY_ID, ACHIEVEMENT_COUNT, rankFor } from '../data/achievements';
import { useL, useLang, useT } from '../i18n';
import { fmtDateTime } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { Bar } from './StepBits';
import {
  IconAlert,
  IconBolt,
  IconBook,
  IconBulb,
  IconCheck,
  IconCoins,
  IconCompass,
  IconCrown,
  IconDatabase,
  IconFeather,
  IconFlame,
  IconFlask,
  IconGem,
  IconGlobe,
  IconHistory,
  IconLayers,
  IconLock,
  IconMedal,
  IconMoon,
  IconOrbit,
  IconPackage,
  IconRocket,
  IconScale,
  IconShield,
  IconStar,
  IconSun,
  IconTarget,
} from './Icons';

const ICONS: Record<string, typeof IconRocket> = {
  Award: IconMedal,
  CheckCircle2: IconCheck,
  Coins: IconCoins,
  Compass: IconCompass,
  Crown: IconCrown,
  Database: IconDatabase,
  Feather: IconFeather,
  Flame: IconFlame,
  FlaskConical: IconFlask,
  Gem: IconGem,
  Globe: IconGlobe,
  History: IconHistory,
  Layers: IconLayers,
  Lightbulb: IconBulb,
  Moon: IconMoon,
  Orbit: IconOrbit,
  Package: IconPackage,
  Rocket: IconRocket,
  Scale: IconScale,
  Shield: IconShield,
  ShieldCheck: IconShield,
  ShieldOff: IconAlert,
  Sparkles: IconStar,
  Sun: IconSun,
  Target: IconTarget,
  Trophy: IconMedal,
  Zap: IconBolt,
};

export function AchievementGlyph({
  name,
  className = 'h-4 w-4',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? IconMedal;
  return <Icon className={className} />;
}

const tierStyle: Record<AchievementTier, { edge: string; icon: string }> = {
  gold: { edge: 'border-s-ochre-400', icon: 'text-ochre-300' },
  silver: { edge: 'border-s-limestone-300', icon: 'text-limestone-200' },
  bronze: { edge: 'border-s-amber', icon: 'text-amber' },
};

export function AchievementCard({
  achievement,
  unlockedAt,
}: {
  achievement: AchievementDef;
  unlockedAt?: string;
}) {
  const l = useL();
  const lang = useLang();
  const t = useT();
  const unlocked = Boolean(unlockedAt);
  const tier = tierStyle[achievement.tier];

  return (
    <article
      className={`border border-s-2 border-royal-700 p-3 ${
        unlocked ? `${tier.edge} bg-royal-700/15` : 'border-s-royal-600 bg-lapis-950/30'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center border border-royal-700 bg-lapis-950/40 ${
            unlocked ? tier.icon : 'text-limestone-400'
          }`}
        >
          <AchievementGlyph name={achievement.icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm leading-snug ${unlocked ? 'text-limestone-50' : 'text-limestone-200'}`}>
              {l(achievement.title)}
            </h3>
            {unlocked ? (
              <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-malachite" aria-label={t('مفتوح', 'Unlocked')} />
            ) : (
              <IconLock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-limestone-400" aria-label={t('مقفل', 'Locked')} />
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-limestone-300">
            {unlocked ? l(achievement.description) : l(achievement.hint)}
          </p>
          <div className="mt-1.5 text-[10px] text-limestone-400">
            {unlockedAt ? (
              <span className="font-latin tabular-nums" dir="ltr">
                {fmtDateTime(unlockedAt, lang)}
              </span>
            ) : (
              t('مقفل بعد', 'Still locked')
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Compact progress / newly unlocked block shown at the end of the evaluation. */
export function AchievementsHighlight({ onOpenProfile }: { onOpenProfile: () => void }) {
  const t = useT();
  const l = useL();
  const profile = useMissionStore((state) => state.profile);
  const lastUnlocked = useMissionStore((state) => state.lastUnlocked);
  const count = Object.keys(profile.unlocked).length;
  const { current, next } = rankFor(count);
  const newlyUnlocked = lastUnlocked
    .map((id) => ACHIEVEMENT_BY_ID[id])
    .filter((achievement): achievement is AchievementDef => Boolean(achievement));
  const rankProgress = next
    ? Math.max(0, Math.min(1, (count - current.min) / (next.min - current.min)))
    : 1;

  return (
    <section className={`border border-royal-700 border-t-2 p-4 ${newlyUnlocked.length > 0 ? 'border-t-ochre-400' : 'border-t-royal-700'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-limestone-300">
            <IconMedal className="h-4 w-4 text-ochre-300" />
            {newlyUnlocked.length > 0
              ? t('إنجازات جديدة', 'New achievements')
              : t('ملف القائد', 'Pilot profile')}
          </div>
          <h2 className="card-title mt-1">
            {newlyUnlocked.length > 0
              ? t(
                  `فتحت ${newlyUnlocked.length} إنجازًا في هذه الجولة`,
                  `Unlocked ${newlyUnlocked.length} achievement${newlyUnlocked.length === 1 ? '' : 's'} this run`,
                )
              : t(`رتبتك الحالية: ${l(current.title)}`, `Current rank: ${l(current.title)}`)}
          </h2>
          <p className="mt-1 max-w-xl text-xs leading-[1.8] text-limestone-300">
            {newlyUnlocked.length > 0
              ? t(
                  'تُحفظ الإنجازات محليًا وتُرافق كل مهمة جديدة. افتح الملف لترى كل الأوسمة وشروط فتحها.',
                  'Achievements are saved locally and follow every new mission. Open the profile to see every badge and its unlock condition.',
                )
              : next
                ? t(
                    `أنجزت ${count} من ${ACHIEVEMENT_COUNT} إنجازًا. تحتاج ${next.min - count} إنجازًا للوصول إلى «${l(next.title)}».`,
                    `You have ${count} of ${ACHIEVEMENT_COUNT} achievements. ${next.min - count} more to reach “${l(next.title)}”.`,
                  )
                : t(
                    'وصلت إلى أعلى رتبة في اللعبة. جرّب أهدافًا ومهامًا جديدة لتوسيع سجلك.',
                    'You reached the game’s highest rank. Try new targets and mission types to broaden your record.',
                  )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-latin text-[11px] tabular-nums text-ochre-300" dir="ltr">
            {count}/{ACHIEVEMENT_COUNT}
          </span>
          <button type="button" onClick={onOpenProfile} className="btn-secondary text-xs">
            <IconBook className="h-3.5 w-3.5" />
            {t('افتح الملف', 'Open profile')}
          </button>
        </div>
      </div>

      {newlyUnlocked.length > 0 ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {newlyUnlocked.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlockedAt={profile.unlocked[achievement.id]}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Bar
            ratio={rankProgress}
            tone="gold"
            className="min-w-[140px] flex-1"
            aria-label={t('التقدم إلى الرتبة التالية', 'Progress to the next rank')}
          />
          <span className="text-[11px] text-limestone-400">
            {next
              ? t(
                  `${l(current.title)} إلى ${l(next.title)}`,
                  `${l(current.title)} to ${l(next.title)}`,
                )
              : t('أعلى رتبة', 'Highest rank')}
          </span>
        </div>
      )}
    </section>
  );
}
