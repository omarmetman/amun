import { describe, expect, it } from 'vitest';
import type {
  AttemptSummary,
  DesignChoices,
  ScoreResult,
  SimulationResult,
} from '../data/types';
import {
  ACHIEVEMENTS,
  emptyPilotProfile,
  emptyPilotStats,
} from '../data/achievements';
import { deriveDesign } from './derive';
import { runSimulation } from './simulate';
import { computeScore } from './score';
import {
  applyRunToProfile,
  normalizeProfile,
  profileFromAttempts,
} from './achievements';

const choices: DesignChoices = {
  difficulty: 'normal',
  language: 'ar',
  seed: '6KC5N8MD',
  missionType: 'orbiter',
  targetId: 'mars',
  successTier: 'basic',
  busId: 'medium',
  propulsionId: 'biprop',
  redundancy: 'none',
  radHard: false,
  instruments: ['nac', 'wac', 'visnir', 'thermal', 'mag', 'lidar'],
  launcherId: 'pslv',
  launchWindowId: 'auto',
  transferType: 'hohmann',
  power: { solarAreaM2: 2.5, rtgCount: 0, batteryKg: 10 },
  comms: { antennaId: 'mga', band: 'X', txPowerW: 50, groundStation: 'dsn34' },
  opsDays: 30,
  reservePercent: 12,
  propellantReservePercent: 15,
};

interface RunOptions {
  runId: string;
  targetId?: string;
  success?: boolean;
  grade?: ScoreResult['grade'];
  total?: number;
  margins?: number;
  reliability?: number;
  science?: number;
  dataGb?: number;
}

function makeRun(options: RunOptions) {
  const design = deriveDesign({ ...choices, targetId: options.targetId ?? choices.targetId });
  const baseSimulation = runSimulation(design, choices.seed);
  const baseScore = computeScore(design, baseSimulation);
  const simulation: SimulationResult = {
    ...baseSimulation,
    runId: options.runId,
    success: options.success ?? baseSimulation.success,
    scienceAchieved: options.science ?? baseSimulation.scienceAchieved,
    dataSentGb: options.dataGb ?? baseSimulation.dataSentGb,
  };
  const score: ScoreResult = {
    ...baseScore,
    grade: options.grade ?? baseScore.grade,
    breakdown: {
      ...baseScore.breakdown,
      total: options.total ?? baseScore.breakdown.total,
      margins: options.margins ?? baseScore.breakdown.margins,
      reliability: options.reliability ?? baseScore.breakdown.reliability,
    },
  };
  return { design, simulation, score };
}

const at = '2026-11-12T12:00:00.000Z';

describe('achievement catalogue', () => {
  it('has unique ids and every definition has a condition', () => {
    const ids = ACHIEVEMENTS.map((achievement) => achievement.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ACHIEVEMENTS.length).toBeGreaterThan(20);
    for (const achievement of ACHIEVEMENTS) {
      expect(achievement.test(emptyPilotStats())).toBe(false);
    }
  });
});

describe('pilot profile updates', () => {
  it('unlocks first-run, first-success and target badges for a successful run', () => {
    const run = makeRun({ runId: 'run-1', success: true, grade: 'S', total: 94 });
    const update = applyRunToProfile(
      emptyPilotProfile(),
      run.design,
      run.simulation,
      run.score,
      at,
    );

    expect(update.profile.stats.runs).toBe(1);
    expect(update.profile.stats.successes).toBe(1);
    expect(update.profile.stats.failures).toBe(0);
    expect(update.profile.stats.bestScore).toBe(94);
    expect(update.profile.stats.targetsVisited).toContain('mars');
    expect(update.profile.recordedRuns).toEqual(['run-1']);
    expect(update.profile.unlocked['first-run']).toBe(at);
    expect(update.profile.unlocked['first-success']).toBe(at);
    expect(update.profile.unlocked['mars']).toBe(at);
    expect(update.profile.unlocked['grade-s']).toBe(at);
    expect(update.newlyUnlocked).toContain('first-run');
  });

  it('does not count the same run twice', () => {
    const run = makeRun({ runId: 'run-once', success: true, grade: 'A', total: 84 });
    const first = applyRunToProfile(emptyPilotProfile(), run.design, run.simulation, run.score, at);
    const second = applyRunToProfile(
      first.profile,
      run.design,
      run.simulation,
      run.score,
      '2026-11-13T12:00:00.000Z',
    );

    expect(second.profile.stats.runs).toBe(1);
    expect(second.profile.stats.successes).toBe(1);
    expect(second.newlyUnlocked).toEqual([]);
    expect(second.profile).toBe(first.profile);
  });

  it('tracks streaks and unlocks the hat trick on three successes', () => {
    let profile = emptyPilotProfile();
    for (let index = 1; index <= 3; index += 1) {
      const run = makeRun({
        runId: `streak-${index}`,
        success: true,
        grade: 'A',
        total: 80,
      });
      profile = applyRunToProfile(profile, run.design, run.simulation, run.score, at).profile;
    }

    expect(profile.stats.currentStreak).toBe(3);
    expect(profile.stats.bestStreak).toBe(3);
    expect(profile.unlocked['streak-3']).toBe(at);
  });

  it('records failures without losing the best streak and unlocks the lesson badge', () => {
    const success = makeRun({ runId: 'streak-win', success: true, grade: 'A', total: 80 });
    const first = applyRunToProfile(
      emptyPilotProfile(),
      success.design,
      success.simulation,
      success.score,
      at,
    ).profile;
    const failure = makeRun({ runId: 'streak-loss', success: false, grade: 'F', total: 20 });
    const update = applyRunToProfile(first, failure.design, failure.simulation, failure.score, at);

    expect(update.profile.stats.runs).toBe(2);
    expect(update.profile.stats.failures).toBe(1);
    expect(update.profile.stats.currentStreak).toBe(0);
    expect(update.profile.stats.bestStreak).toBe(1);
    expect(update.profile.unlocked['lesson-learned']).toBe(at);
  });

  it('counts engineering achievements only on successful missions', () => {
    const failed = makeRun({
      runId: 'engineering-fail',
      success: false,
      grade: 'F',
      total: 30,
      margins: 20,
      reliability: 25,
    });
    const failedUpdate = applyRunToProfile(
      emptyPilotProfile(),
      failed.design,
      failed.simulation,
      failed.score,
      at,
    );
    expect(failedUpdate.profile.unlocked['margin-ace']).toBeUndefined();
    expect(failedUpdate.profile.unlocked['reliability-ace']).toBeUndefined();

    const successful = makeRun({
      runId: 'engineering-win',
      success: true,
      grade: 'A',
      total: 84,
      margins: 20,
      reliability: 25,
    });
    const successUpdate = applyRunToProfile(
      failedUpdate.profile,
      successful.design,
      successful.simulation,
      successful.score,
      at,
    );
    expect(successUpdate.profile.unlocked['margin-ace']).toBe(at);
    expect(successUpdate.profile.unlocked['reliability-ace']).toBe(at);
  });
});

describe('profile migration and sanitisation', () => {
  it('rebuilds profile stats from older attempts', () => {
    const attempts: AttemptSummary[] = [
      {
        id: 'old-2',
        createdAt: '2026-11-10T10:00:00.000Z',
        targetId: 'moon',
        missionType: 'orbiter',
        score: 88,
        grade: 'A',
        outcome: 'full',
        seed: 'OLD2',
        science: 62,
        dataSentGb: 8,
        success: true,
      },
      {
        id: 'old-1',
        createdAt: '2026-11-09T10:00:00.000Z',
        targetId: 'mars',
        missionType: 'orbiter',
        score: 91,
        grade: 'S',
        outcome: 'full',
        seed: 'OLD1',
        science: 71,
        dataSentGb: 12,
        success: true,
      },
    ];

    const profile = profileFromAttempts(attempts, at);
    expect(profile.stats.runs).toBe(2);
    expect(profile.stats.successes).toBe(2);
    expect(profile.stats.sGrades).toBe(1);
    expect(profile.stats.bestScore).toBe(91);
    expect(profile.stats.targetsVisited).toEqual(expect.arrayContaining(['mars', 'moon']));
    expect(profile.recordedRuns).toEqual(expect.arrayContaining(['old-1', 'old-2']));
    expect(profile.unlocked['first-run']).toBe(at);
    expect(profile.unlocked['first-success']).toBe(at);
  });

  it('drops unknown achievements and repairs malformed persisted values', () => {
    const normalized = normalizeProfile(
      {
        stats: {
          runs: 2,
          successes: 1,
          failures: 'nope',
          bestScore: 140,
          bestScience: 80,
          targetKindsVisited: ['planet', 'not-a-kind'],
          missionTypesFlown: ['orbiter', 'not-a-mission'],
          difficultiesWon: ['expert', 'impossible'],
        },
        unlocked: { 'first-run': at, 'not-an-achievement': at },
        recordedRuns: ['run-a', 12, 'run-b'],
      },
      at,
    );

    expect(normalized.stats.runs).toBe(2);
    expect(normalized.stats.failures).toBe(0);
    expect(normalized.stats.bestScore).toBe(100);
    expect(normalized.stats.targetKindsVisited).toEqual(['planet']);
    expect(normalized.stats.missionTypesFlown).toEqual(['orbiter']);
    expect(normalized.stats.difficultiesWon).toEqual(['expert']);
    expect(normalized.unlocked['not-an-achievement']).toBeUndefined();
    expect(normalized.unlocked['first-run']).toBe(at);
    expect(normalized.unlocked['first-success']).toBe(at);
    expect(normalized.recordedRuns).toEqual(['run-a', 'run-b']);
  });
});
