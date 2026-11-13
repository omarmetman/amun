import {
  Award,
  CheckCircle2,
  Coins,
  Compass,
  Crown,
  Database,
  Feather,
  Flame,
  FlaskConical,
  Gem,
  Globe,
  History,
  Layers,
  Lightbulb,
  Lock,
  Moon,
  Orbit,
  Package,
  Rocket,
  Scale,
  Shield,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Sun,
  Target,
  Trophy,
  UserRound,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AchievementDef, AchievementTier } from '../data/types';
import { ACHIEVEMENT_BY_ID, ACHIEVEMENT_COUNT, rankFor } from '../data/achievements';
import { useL, useLang, useT } from '../i18n';
import { fmtDateTime } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { Bar } from './StepBits';

const ICONS: Record<string, LucideIcon> = {
  Award,
  CheckCircle2,
  Coins,
  Compass,
  Crown,
  Database,
  Feather,
  Flame,
  FlaskConical,
  Gem,
  Globe,
  History,
  Layers,
  Lightbulb,
  Moon,
  Orbit,
  Package,
  Rocket,
  Scale,
  Shield,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Zap,
};

export function AchievementGlyph({
  name,
  className = 'h-4 w-4',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Award;
  return <Icon className={className} aria-hidden="true" />;
}

const tierStyle: Record<AchievementTier, string> = {
  gold: 'border-gold-400/30 bg-gold-400/[0.075] text-gold-200',
  silver: 'border-slate-300/20 bg-white/[0.045] text-slate-100',
  bronze: 'border-amber-600/30 bg-amber-600/[0.065] text-amber-300',
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

  return (
    <article
      className={`rounded-xl border p-3 ${
        unlocked
          ? tierStyle[achievement.tier]
          : 'border-white/[0.06] bg-white/[0.015] text-slate-500'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
            unlocked ? 'border-white/10 bg-void-950/35' : 'border-white/[0.07] bg-white/[0.03]'
          }`}
        >
          <AchievementGlyph name={achievement.icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-[11px] font-bold leading-snug ${unlocked ? 'text-white' : 'text-slate-300'}`}>
              {l(achievement.title)}
            </h3>
            {unlocked ? (
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-good" aria-label={t('مفتوح', 'Unlocked')} />
            ) : (
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" aria-label={t('مقفل', 'Locked')} />
            )}
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
            {unlocked ? l(achievement.description) : l(achievement.hint)}
          </p>
          <div className="mt-1.5 text-[9px] font-semibold text-slate-500">
            {unlockedAt ? (
              <span className="font-latin" dir="ltr">
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
    <section className={`card card-pad ${newlyUnlocked.length > 0 ? 'border-gold-400/25' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="eyebrow flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
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
          <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-slate-400">
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
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-gold-400/20 bg-gold-400/[0.06] px-2.5 py-1.5 font-latin text-[10px] font-bold text-gold-200" dir="ltr">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            {count}/{ACHIEVEMENT_COUNT}
          </span>
          <button type="button" onClick={onOpenProfile} className="btn-secondary !px-3 !py-1.5 text-[10px]">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
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
          <span className="text-[10px] font-semibold text-slate-500">
            {next
              ? t(
                  `${l(current.title)} → ${l(next.title)}`,
                  `${l(current.title)} → ${l(next.title)}`,
                )
              : t('أعلى رتبة', 'Highest rank')}
          </span>
        </div>
      )}
    </section>
  );
}
