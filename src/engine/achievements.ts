import type {
  AttemptSummary,
  Difficulty,
  MissionTypeId,
  PilotProfile,
  PilotStats,
  ScoreResult,
  SimulationResult,
  TargetKind,
} from '../data/types';
import { ACHIEVEMENTS, emptyPilotProfile, emptyPilotStats } from '../data/achievements';
import { targetById } from '../data/targets';
import type { DesignResult } from './model';

export interface ProfileUpdate {
  profile: PilotProfile;
  /** Achievement ids unlocked by this update, in catalogue order. */
  newlyUnlocked: string[];
}

const TARGET_KINDS: TargetKind[] = [
  'moon',
  'planet',
  'gasGiant',
  'asteroid',
  'comet',
  'dwarfPlanet',
];
const MISSION_TYPES: MissionTypeId[] = ['flyby', 'orbiter', 'lander', 'rendezvous', 'sampleReturn'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'normal', 'expert'];

const addUnique = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list : [...list, value];

const safeCount = (value: unknown): number => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
};

const safeNumber = (value: unknown): number => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const safeStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter((entry): entry is string => typeof entry === 'string'))]
    : [];

/** Fold a complete run into the aggregate stats, then unlock any new achievements. */
export function applyRunToProfile(
  profile: PilotProfile,
  design: DesignResult,
  simulation: SimulationResult,
  score: ScoreResult,
  unlockedAt = new Date().toISOString(),
): ProfileUpdate {
  let next = profile;

  if (!profile.recordedRuns.includes(simulation.runId)) {
    const stats = profile.stats;
    const success = simulation.success;
    const difficulty = design.choices.difficulty;
    const missionType = design.missionType.id;
    const grade = score.grade;
    const nextStats: PilotStats = {
      ...stats,
      runs: stats.runs + 1,
      successes: stats.successes + (success ? 1 : 0),
      failures: stats.failures + (success ? 0 : 1),
      bestScore: Math.max(stats.bestScore, score.breakdown.total),
      bestScience: success ? Math.max(stats.bestScience, simulation.scienceAchieved) : stats.bestScience,
      bestDataGb: success ? Math.max(stats.bestDataGb, simulation.dataSentGb) : stats.bestDataGb,
      totalScience: stats.totalScience + simulation.scienceAchieved,
      totalDataGb: stats.totalDataGb + simulation.dataSentGb,
      sGrades: stats.sGrades + (grade === 'S' ? 1 : 0),
      aGrades: stats.aGrades + (grade === 'S' || grade === 'A' ? 1 : 0),
      currentStreak: success ? stats.currentStreak + 1 : 0,
      bestStreak: success ? Math.max(stats.bestStreak, stats.currentStreak + 1) : stats.bestStreak,
      targetsVisited: success ? addUnique(stats.targetsVisited, design.target.id) : stats.targetsVisited,
      targetKindsVisited: success
        ? addUnique(stats.targetKindsVisited, design.target.kind)
        : stats.targetKindsVisited,
      missionTypesFlown: success
        ? addUnique(stats.missionTypesFlown, missionType)
        : stats.missionTypesFlown,
      difficultiesWon: success
        ? addUnique(stats.difficultiesWon, difficulty)
        : stats.difficultiesWon,
      instrumentsFlown: design.instruments.reduce(
        (list, instrument) => addUnique(list, instrument.id),
        stats.instrumentsFlown,
      ),
      sampleReturns:
        stats.sampleReturns + (success && missionType === 'sampleReturn' ? 1 : 0),
      leanSuccesses:
        stats.leanSuccesses + (success && design.instruments.length <= 4 ? 1 : 0),
      budgetHawks:
        stats.budgetHawks +
        (success && design.cost.budgetM > 0 && design.cost.totalM <= design.cost.budgetM * 0.7
          ? 1
          : 0),
      marginAces:
        stats.marginAces + (success && score.breakdown.margins >= 18 ? 1 : 0),
      reliabilityAces:
        stats.reliabilityAces + (success && score.breakdown.reliability >= 22 ? 1 : 0),
      rtgSuccesses:
        stats.rtgSuccesses + (success && design.power.rtgCount > 0 ? 1 : 0),
      expertSuccesses:
        stats.expertSuccesses + (success && difficulty === 'expert' ? 1 : 0),
      noRedundancySuccesses:
        stats.noRedundancySuccesses +
        (success && difficulty === 'expert' && design.choices.redundancy === 'none' ? 1 : 0),
    };

    next = {
      ...profile,
      stats: nextStats,
      recordedRuns: [simulation.runId, ...profile.recordedRuns].slice(0, 120),
    };
  }

  return syncAchievements(next, unlockedAt);
}

/** Unlock every achievement whose predicate now holds. */
export function syncAchievements(
  profile: PilotProfile,
  unlockedAt = new Date().toISOString(),
): ProfileUpdate {
  const newlyUnlocked: string[] = [];
  const unlocked = { ...profile.unlocked };

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked[achievement.id] && achievement.test(profile.stats)) {
      unlocked[achievement.id] = unlockedAt;
      newlyUnlocked.push(achievement.id);
    }
  }

  if (newlyUnlocked.length === 0) return { profile, newlyUnlocked };
  return { profile: { ...profile, unlocked }, newlyUnlocked };
}

/**
 * Reconstruct aggregate stats for profiles saved before the achievement layer
 * existed. Attempt records do not include difficulty or instrument choices, so
 * those achievements wait for the next complete run.
 */
export function profileFromAttempts(
  attempts: AttemptSummary[],
  unlockedAt = new Date().toISOString(),
): PilotProfile {
  const stats = emptyPilotStats();
  const recordedRuns: string[] = [];

  for (const attempt of [...attempts].reverse()) {
    recordedRuns.push(attempt.id);
    stats.runs += 1;
    stats.totalScience += attempt.science;
    stats.totalDataGb += attempt.dataSentGb;
    stats.bestScore = Math.max(stats.bestScore, attempt.score);
    stats.aGrades += attempt.grade === 'S' || attempt.grade === 'A' ? 1 : 0;
    stats.sGrades += attempt.grade === 'S' ? 1 : 0;

    if (attempt.success) {
      stats.successes += 1;
      stats.currentStreak += 1;
      stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
      stats.bestScience = Math.max(stats.bestScience, attempt.science);
      stats.bestDataGb = Math.max(stats.bestDataGb, attempt.dataSentGb);
      stats.targetsVisited = addUnique(stats.targetsVisited, attempt.targetId);
      stats.missionTypesFlown = addUnique(stats.missionTypesFlown, attempt.missionType);
      const target = targetById[attempt.targetId];
      if (target) stats.targetKindsVisited = addUnique(stats.targetKindsVisited, target.kind);
    } else {
      stats.failures += 1;
      stats.currentStreak = 0;
    }
  }

  return syncAchievements(
    {
      stats,
      unlocked: {},
      recordedRuns: [...new Set(recordedRuns)].slice(0, 120),
    },
    unlockedAt,
  ).profile;
}

/** Defensive normalisation for persisted data and imported snapshots. */
export function normalizeProfile(
  raw: unknown,
  unlockedAt = new Date().toISOString(),
): PilotProfile {
  const base = emptyPilotProfile();
  if (!raw || typeof raw !== 'object') return base;

  const source = raw as Record<string, unknown>;
  const rawStats = (source.stats ?? {}) as Record<string, unknown>;
  const stats: PilotStats = {
    ...base.stats,
    runs: safeCount(rawStats.runs),
    successes: safeCount(rawStats.successes),
    failures: safeCount(rawStats.failures),
    bestScore: Math.min(100, safeNumber(rawStats.bestScore)),
    bestScience: safeNumber(rawStats.bestScience),
    bestDataGb: safeNumber(rawStats.bestDataGb),
    totalScience: safeNumber(rawStats.totalScience),
    totalDataGb: safeNumber(rawStats.totalDataGb),
    sGrades: safeCount(rawStats.sGrades),
    aGrades: safeCount(rawStats.aGrades),
    currentStreak: safeCount(rawStats.currentStreak),
    bestStreak: safeCount(rawStats.bestStreak),
    targetsVisited: safeStringList(rawStats.targetsVisited),
    targetKindsVisited: safeStringList(rawStats.targetKindsVisited).filter(
      (kind): kind is TargetKind => TARGET_KINDS.includes(kind as TargetKind),
    ),
    missionTypesFlown: safeStringList(rawStats.missionTypesFlown).filter(
      (type): type is MissionTypeId => MISSION_TYPES.includes(type as MissionTypeId),
    ),
    difficultiesWon: safeStringList(rawStats.difficultiesWon).filter(
      (difficulty): difficulty is Difficulty => DIFFICULTIES.includes(difficulty as Difficulty),
    ),
    instrumentsFlown: safeStringList(rawStats.instrumentsFlown),
    sampleReturns: safeCount(rawStats.sampleReturns),
    leanSuccesses: safeCount(rawStats.leanSuccesses),
    budgetHawks: safeCount(rawStats.budgetHawks),
    marginAces: safeCount(rawStats.marginAces),
    reliabilityAces: safeCount(rawStats.reliabilityAces),
    rtgSuccesses: safeCount(rawStats.rtgSuccesses),
    expertSuccesses: safeCount(rawStats.expertSuccesses),
    noRedundancySuccesses: safeCount(rawStats.noRedundancySuccesses),
  };

  const unlocked: Record<string, string> = {};
  const knownIds = new Set(ACHIEVEMENTS.map((achievement) => achievement.id));
  if (source.unlocked && typeof source.unlocked === 'object') {
    for (const [id, timestamp] of Object.entries(source.unlocked as Record<string, unknown>)) {
      if (knownIds.has(id) && typeof timestamp === 'string' && timestamp.trim()) {
        unlocked[id] = timestamp;
      }
    }
  }

  return syncAchievements(
    {
      stats,
      unlocked,
      recordedRuns: safeStringList(source.recordedRuns).slice(0, 120),
    },
    unlockedAt,
  ).profile;
}

export function unlockedCount(profile: PilotProfile): number {
  return Object.keys(profile.unlocked).length;
}
