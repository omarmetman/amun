import type {
  CampaignChapter,
  CampaignCompletion,
  CampaignEvaluation,
  CampaignObjectiveDef,
  CampaignState,
  ScoreResult,
  SimulationResult,
} from '../data/types';
import type { DesignResult } from './model';
import { CAMPAIGN_CHAPTERS, campaignChapterById } from '../data/campaign';

const GRADES: ScoreResult['grade'][] = ['F', 'D', 'C', 'B', 'A', 'S'];

const gradeRank = (grade: ScoreResult['grade']): number => GRADES.indexOf(grade);

const isGrade = (value: unknown): value is ScoreResult['grade'] =>
  typeof value === 'string' && GRADES.includes(value as ScoreResult['grade']);

const finiteNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

function objectiveMet(
  objective: CampaignObjectiveDef,
  design: DesignResult,
  simulation: SimulationResult,
  score: ScoreResult,
): boolean {
  switch (objective.kind) {
    case 'grade':
      return gradeRank(score.grade) >= gradeRank(objective.minGrade ?? 'A');
    case 'science':
      return simulation.scienceAchieved >= (objective.threshold ?? 0);
    case 'data':
      return simulation.dataSentGb >= (objective.threshold ?? 0);
    case 'budget':
      return design.cost.totalM + simulation.budgetOverrunM <= (objective.threshold ?? 0);
    case 'instrument':
      return objective.instrumentId
        ? design.choices.instruments.includes(objective.instrumentId)
        : false;
    case 'radHard':
      return design.choices.radHard;
    default:
      return false;
  }
}

/**
 * Pure completion check. A chapter is complete only when the mission flies,
 * survives the simulation and meets both halves of its success tier. Bonus
 * objectives add up to two stars; completion itself is worth one.
 */
export function evaluateCampaignChapter(
  chapter: CampaignChapter,
  design: DesignResult,
  simulation: SimulationResult,
  score: ScoreResult,
): CampaignEvaluation {
  const completed = simulation.success && score.tierMet.science && score.tierMet.data;
  const objectives = chapter.bonusObjectives.map((objective) => ({
    id: objective.id,
    met: objectiveMet(objective, design, simulation, score),
  }));
  const bonusMet = objectives.filter((objective) => objective.met).length;
  return {
    chapterId: chapter.id,
    completed,
    tierMet: { ...score.tierMet },
    objectives,
    stars: completed ? Math.min(3, 1 + bonusMet) : 0,
  };
}

export function isChapterUnlocked(
  chapterId: string,
  completed: Record<string, CampaignCompletion>,
): boolean {
  const index = CAMPAIGN_CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
  if (index < 0) return false;
  if (completed[chapterId]) return true;
  if (index === 0) return true;
  return Boolean(completed[CAMPAIGN_CHAPTERS[index - 1].id]);
}

/** Keeps the best result for a chapter while preserving the first completion date. */
export function mergeCampaignCompletion(
  chapterId: string,
  previous: CampaignCompletion | undefined,
  evaluation: CampaignEvaluation,
  simulation: SimulationResult,
  score: ScoreResult,
  now = new Date().toISOString(),
): CampaignCompletion {
  const objectives = { ...(previous?.objectives ?? {}) };
  for (const objective of evaluation.objectives) {
    objectives[objective.id] = Boolean(objectives[objective.id] || objective.met);
  }
  return {
    chapterId,
    completedAt: previous?.completedAt ?? now,
    updatedAt: now,
    bestScore: Math.max(previous?.bestScore ?? 0, score.breakdown.total),
    bestGrade:
      !previous || gradeRank(score.grade) > gradeRank(previous.bestGrade)
        ? score.grade
        : previous.bestGrade,
    bestScience: Math.max(previous?.bestScience ?? 0, simulation.scienceAchieved),
    bestDataGb: Math.max(previous?.bestDataGb ?? 0, simulation.dataSentGb),
    stars: Math.max(previous?.stars ?? 0, evaluation.stars),
    objectives,
  };
}

export const emptyCampaignState = (): CampaignState => ({
  activeChapterId: null,
  completed: {},
  startedAt: null,
  updatedAt: null,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Defensive hydration for local saves. Unknown chapters and malformed records
 * are removed instead of crashing a returning player's campaign.
 */
export function normalizeCampaignState(input: unknown): CampaignState {
  const base = emptyCampaignState();
  if (!isRecord(input)) return base;

  const rawCompleted = isRecord(input.completed) ? input.completed : {};
  const completed: Record<string, CampaignCompletion> = {};
  for (const chapter of CAMPAIGN_CHAPTERS) {
    const raw = rawCompleted[chapter.id];
    if (!isRecord(raw)) continue;
    const now = new Date().toISOString();
    const rawObjectives = isRecord(raw.objectives) ? raw.objectives : {};
    const objectives: Record<string, boolean> = {};
    for (const objective of chapter.bonusObjectives) {
      objectives[objective.id] = Boolean(rawObjectives[objective.id]);
    }
    completed[chapter.id] = {
      chapterId: chapter.id,
      completedAt:
        typeof raw.completedAt === 'string' && raw.completedAt ? raw.completedAt : now,
      updatedAt: typeof raw.updatedAt === 'string' && raw.updatedAt ? raw.updatedAt : now,
      bestScore: clamp(finiteNumber(raw.bestScore), 0, 100),
      bestGrade: isGrade(raw.bestGrade) ? raw.bestGrade : 'F',
      bestScience: Math.max(0, finiteNumber(raw.bestScience)),
      bestDataGb: Math.max(0, finiteNumber(raw.bestDataGb)),
      stars: clamp(Math.round(finiteNumber(raw.stars)), 0, 3),
      objectives,
    };
  }

  const activeId =
    typeof input.activeChapterId === 'string' &&
    Boolean(campaignChapterById[input.activeChapterId])
      ? input.activeChapterId
      : null;

  return {
    activeChapterId: activeId,
    completed,
    startedAt: typeof input.startedAt === 'string' && input.startedAt ? input.startedAt : null,
    updatedAt: typeof input.updatedAt === 'string' && input.updatedAt ? input.updatedAt : null,
  };
}
