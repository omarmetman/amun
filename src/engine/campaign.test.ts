import { describe, expect, it } from 'vitest';
import {
  CAMPAIGN_CHAPTERS,
  campaignChoices,
  campaignProgress,
} from '../data/campaign';
import type {
  CampaignCompletion,
  CampaignEvaluation,
  ScoreResult,
  SimulationResult,
} from '../data/types';
import { deriveDesign } from './derive';
import {
  emptyCampaignState,
  evaluateCampaignChapter,
  isChapterUnlocked,
  mergeCampaignCompletion,
  normalizeCampaignState,
} from './campaign';
import { computeScore } from './score';
import { runSimulation } from './simulate';

const completion = (overrides: Partial<CampaignCompletion> = {}): CampaignCompletion => ({
  chapterId: 'moon-echo',
  completedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  bestScore: 90,
  bestGrade: 'A',
  bestScience: 45,
  bestDataGb: 20,
  stars: 2,
  objectives: { 'moon-grade': true, 'moon-science': false },
  ...overrides,
});

const evaluation = (overrides: Partial<CampaignEvaluation> = {}): CampaignEvaluation => ({
  chapterId: 'moon-echo',
  completed: true,
  tierMet: { science: true, data: true },
  objectives: [
    { id: 'moon-grade', met: false },
    { id: 'moon-science', met: false },
  ],
  stars: 1,
  ...overrides,
});

const simulation = (science: number, data: number): SimulationResult =>
  ({ scienceAchieved: science, dataSentGb: data } as SimulationResult);

const score = (total: number, grade: ScoreResult['grade']): ScoreResult =>
  ({ breakdown: { total }, grade } as ScoreResult);

describe('campaign chapters', () => {
  it('every reference preset is flyable and earns all three stars', () => {
    for (const chapter of CAMPAIGN_CHAPTERS) {
      const choices = campaignChoices(chapter, 'ar');
      const design = deriveDesign(choices);
      expect(
        design.blockingIssues.map((issue) => issue.code),
        `${chapter.id} should have no blocking issues`,
      ).toEqual([]);

      const run = runSimulation(design, choices.seed);
      expect(run.success, `${chapter.id} should succeed`).toBe(true);
      const result = computeScore(design, run);
      const chapterEvaluation = evaluateCampaignChapter(chapter, design, run, result);

      expect(chapterEvaluation.completed, `${chapter.id} should satisfy its tier`).toBe(true);
      expect(chapterEvaluation.stars, `${chapter.id} should earn three stars`).toBe(3);
      expect(chapterEvaluation.objectives.every((objective) => objective.met)).toBe(true);
    }
  });

  it('uses the chapter language while keeping directives fixed', () => {
    const chapter = CAMPAIGN_CHAPTERS[0];
    const arabic = campaignChoices(chapter, 'ar');
    const english = campaignChoices(chapter, 'en');

    expect(arabic.language).toBe('ar');
    expect(english.language).toBe('en');
    for (const choices of [arabic, english]) {
      expect(choices.targetId).toBe(chapter.targetId);
      expect(choices.missionType).toBe(chapter.missionType);
      expect(choices.difficulty).toBe(chapter.difficulty);
      expect(choices.successTier).toBe(chapter.successTier);
      expect(choices.seed).toBe(chapter.seed);
    }

    // Presets must be copied, not shared with the chapter record.
    arabic.instruments.push('extra');
    arabic.power.solarAreaM2 = 99;
    expect(chapter.preset.instruments).not.toContain('extra');
    expect(chapter.preset.power.solarAreaM2).not.toBe(99);
  });
});

describe('campaign unlocking and progress', () => {
  it('unlocks the first chapter, then exactly one step at a time', () => {
    const completed: Record<string, CampaignCompletion> = {};
    expect(isChapterUnlocked('moon-echo', completed)).toBe(true);
    expect(isChapterUnlocked('mars-dust', completed)).toBe(false);
    expect(isChapterUnlocked('unknown', completed)).toBe(false);

    completed['moon-echo'] = completion();
    expect(isChapterUnlocked('moon-echo', completed)).toBe(true);
    expect(isChapterUnlocked('mars-dust', completed)).toBe(true);
    expect(isChapterUnlocked('bennu-letter', completed)).toBe(false);
  });

  it('computes stars, completion and the next chapter', () => {
    const empty = campaignProgress({});
    expect(empty.completedCount).toBe(0);
    expect(empty.totalStars).toBe(0);
    expect(empty.nextChapter?.id).toBe('moon-echo');
    expect(empty.allCompleted).toBe(false);

    const all: Record<string, CampaignCompletion> = {};
    for (const chapter of CAMPAIGN_CHAPTERS) {
      all[chapter.id] = completion({
        chapterId: chapter.id,
        stars: 3,
        bestGrade: 'S',
        bestScore: 95,
      });
    }
    const done = campaignProgress(all);
    expect(done.completedCount).toBe(CAMPAIGN_CHAPTERS.length);
    expect(done.totalStars).toBe(CAMPAIGN_CHAPTERS.length * 3);
    expect(done.maxStars).toBe(CAMPAIGN_CHAPTERS.length * 3);
    expect(done.nextChapter).toBeNull();
    expect(done.allCompleted).toBe(true);
  });
});

describe('campaign completion records', () => {
  it('keeps the first completion date and the best record', () => {
    const previous = completion();
    const next = mergeCampaignCompletion(
      'moon-echo',
      previous,
      evaluation({ stars: 1, objectives: [{ id: 'moon-grade', met: true }, { id: 'moon-science', met: true }] }),
      simulation(30, 8),
      score(70, 'C'),
      '2026-02-01T00:00:00.000Z',
    );

    expect(next.completedAt).toBe(previous.completedAt);
    expect(next.updatedAt).toBe('2026-02-01T00:00:00.000Z');
    expect(next.bestScore).toBe(90);
    expect(next.bestGrade).toBe('A');
    expect(next.bestScience).toBe(45);
    expect(next.bestDataGb).toBe(20);
    expect(next.stars).toBe(2);
    expect(next.objectives).toEqual({ 'moon-grade': true, 'moon-science': true });
  });

  it('records a first clear and upgrades a better run', () => {
    const first = mergeCampaignCompletion(
      'moon-echo',
      undefined,
      evaluation({ stars: 2, objectives: [{ id: 'moon-grade', met: true }, { id: 'moon-science', met: false }] }),
      simulation(40, 30),
      score(88, 'A'),
      '2026-03-01T00:00:00.000Z',
    );
    expect(first.completedAt).toBe('2026-03-01T00:00:00.000Z');
    expect(first.bestScore).toBe(88);
    expect(first.bestGrade).toBe('A');
    expect(first.stars).toBe(2);

    const upgraded = mergeCampaignCompletion(
      'moon-echo',
      first,
      evaluation({ stars: 3, objectives: [{ id: 'moon-grade', met: true }, { id: 'moon-science', met: true }] }),
      simulation(52, 35),
      score(96, 'S'),
      '2026-04-01T00:00:00.000Z',
    );
    expect(upgraded.completedAt).toBe('2026-03-01T00:00:00.000Z');
    expect(upgraded.bestScore).toBe(96);
    expect(upgraded.bestGrade).toBe('S');
    expect(upgraded.bestScience).toBe(52);
    expect(upgraded.bestDataGb).toBe(35);
    expect(upgraded.stars).toBe(3);
  });
});

describe('campaign hydration', () => {
  it('starts empty and rejects malformed input', () => {
    expect(normalizeCampaignState(null)).toEqual(emptyCampaignState());
    expect(normalizeCampaignState('nonsense')).toEqual(emptyCampaignState());
    expect(normalizeCampaignState({ activeChapterId: 'unknown', completed: [] }).activeChapterId).toBeNull();
  });

  it('keeps known chapters, clamps values and drops unknown content', () => {
    const normalized = normalizeCampaignState({
      activeChapterId: 'mars-dust',
      startedAt: '2026-01-01T00:00:00.000Z',
      completed: {
        'moon-echo': {
          completedAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-03T00:00:00.000Z',
          bestScore: 140,
          bestGrade: 'Z',
          bestScience: -4,
          bestDataGb: 'nope',
          stars: 12,
          objectives: { 'moon-grade': true, bogus: true },
        },
        unknown: {
          completedAt: '2026-01-02T00:00:00.000Z',
          stars: 3,
        },
      },
    });

    expect(Object.keys(normalized.completed)).toEqual(['moon-echo']);
    expect(normalized.activeChapterId).toBe('mars-dust');
    const record = normalized.completed['moon-echo'];
    expect(record.bestScore).toBe(100);
    expect(record.bestGrade).toBe('F');
    expect(record.bestScience).toBe(0);
    expect(record.bestDataGb).toBe(0);
    expect(record.stars).toBe(3);
    expect(record.objectives).toEqual({ 'moon-grade': true, 'moon-science': false });
  });
});
