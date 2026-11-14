import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  AttemptSummary,
  CampaignState,
  DesignChoices,
  LeaderboardEntry,
  LocalizedText,
  PilotProfile,
  ScoreResult,
  SimulationResult,
} from '../data/types';
import { makeSeed } from '../engine/rng';
import { deriveDesign, firstAllowedMission, incompatibleInstruments } from '../engine/derive';
import { runSimulation as runPure } from '../engine/simulate';
import { computeScore } from '../engine/score';
import {
  applyRunToProfile,
  normalizeProfile,
  profileFromAttempts,
} from '../engine/achievements';
import {
  emptyCampaignState,
  evaluateCampaignChapter,
  isChapterUnlocked,
  mergeCampaignCompletion,
  normalizeCampaignState,
} from '../engine/campaign';
import { emptyPilotProfile } from '../data/achievements';
import { MISSION_SCHEMA_VERSION } from '../engine/constants';
import { instrumentById } from '../data/instruments';
import { targetById } from '../data/targets';
import {
  campaignChapterById,
  campaignChoices,
  campaignProgress,
  nextCampaignChapter,
} from '../data/campaign';

export interface Notice {
  id: string;
  kind: 'info' | 'warning';
  text: LocalizedText;
}

const initialLanguage = (): DesignChoices['language'] => {
  if (typeof navigator === 'undefined') return 'ar';
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((item) => item?.toLowerCase().startsWith('ar')) ? 'ar' : 'en';
};

const defaultChoices = (): DesignChoices => ({
  difficulty: 'normal',
  language: initialLanguage(),
  seed: makeSeed(),
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
});

const notice = (kind: Notice['kind'], ar: string, en: string): Notice => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  kind,
  text: { ar, en },
});

interface MissionState {
  schemaVersion: number;
  choices: DesignChoices;
  started: boolean;
  step: number;
  simulation: SimulationResult | null;
  score: ScoreResult | null;
  attempts: AttemptSummary[];
  leaderboard: LeaderboardEntry[];
  notices: Notice[];
  pilotName: string;
  profile: PilotProfile;
  campaign: CampaignState;
  /** Achievement ids unlocked by the most recent simulation run. */
  lastUnlocked: string[];
  savedAt: string | null;
  hydrated: boolean;

  startGame: () => void;
  continueGame: () => void;
  startCampaign: () => boolean;
  startCampaignChapter: (chapterId: string) => boolean;
  exitCampaign: () => void;
  setStep: (step: number) => void;
  setLanguage: (language: DesignChoices['language']) => void;
  setDifficulty: (difficulty: DesignChoices['difficulty']) => void;
  setSeed: (seed: string) => void;
  regenerateSeed: () => void;
  setPilotName: (name: string) => void;

  setTarget: (targetId: string) => void;
  setMissionType: (missionType: DesignChoices['missionType']) => void;
  setChoice: <K extends keyof DesignChoices>(key: K, value: DesignChoices[K]) => void;
  toggleInstrument: (id: string) => void;
  setPower: (patch: Partial<DesignChoices['power']>) => void;
  setComms: (patch: Partial<DesignChoices['comms']>) => void;

  runSimulation: () => boolean;
  recordAttempt: () => void;
  replaySameChoices: () => void;
  replaySameSeed: () => void;
  replayFromScratch: () => void;

  exportDesign: () => string;
  importDesign: (json: string) => { ok: boolean; error?: string };
  dismissNotice: (id: string) => void;
  resetAll: () => void;
}

const cleanChoices = (input: Partial<DesignChoices> | undefined): DesignChoices => {
  const base = defaultChoices();
  if (!input) return base;
  const merged: DesignChoices = {
    ...base,
    ...input,
    comms: { ...base.comms, ...(input.comms ?? {}) },
    instruments: Array.isArray(input.instruments) ? [...new Set(input.instruments)] : base.instruments,
    seed: typeof input.seed === 'string' && input.seed.trim() ? input.seed.trim() : base.seed,
    opsDays: Math.min(180, Math.max(5, Number(input.opsDays) || base.opsDays)),
    reservePercent: Math.min(40, Math.max(0, Number(input.reservePercent) ?? base.reservePercent)),
    propellantReservePercent: Math.min(
      40,
      Math.max(0, Number(input.propellantReservePercent) ?? base.propellantReservePercent),
    ),
    power: {
      solarAreaM2: Math.max(0, Math.min(300, Number(input.power?.solarAreaM2) || 0)),
      rtgCount: Math.max(0, Math.min(12, Number(input.power?.rtgCount) || 0)),
      batteryKg: Math.max(0, Math.min(3000, Number(input.power?.batteryKg) || 0)),
    },
  };
  // Keep only mission-legal choices; target/mission changes explain what was removed.
  if (!['beginner', 'normal', 'expert'].includes(merged.difficulty)) merged.difficulty = 'normal';
  if (!['ar', 'en'].includes(merged.language)) merged.language = 'en';
  return merged;
};

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => {
      const touch = (updater: (state: MissionState) => Partial<MissionState>) =>
        set((state) => ({ ...updater(state), savedAt: new Date().toISOString() }));

      const invalidateRun = (): Pick<MissionState, 'simulation' | 'score'> => ({
        simulation: null,
        score: null,
      });

      const activeChapter = (state: MissionState) =>
        state.campaign.activeChapterId
          ? campaignChapterById[state.campaign.activeChapterId] ?? null
          : null;

      const addNotice = (n: Notice) =>
        set((state) => ({ notices: [...state.notices.slice(-3), n] }));

      return {
        schemaVersion: MISSION_SCHEMA_VERSION,
        choices: defaultChoices(),
        started: false,
        step: 1,
        simulation: null,
        score: null,
        attempts: [],
        leaderboard: [],
        notices: [],
        pilotName: 'Mission Commander',
        profile: emptyPilotProfile(),
        campaign: emptyCampaignState(),
        lastUnlocked: [],
        savedAt: null,
        hydrated: false,

        startGame: () =>
          touch((state) => ({
            started: true,
            step: 1,
            choices: {
              ...defaultChoices(),
              language: state.choices.language,
              difficulty: state.choices.difficulty,
            },
            notices: [],
            lastUnlocked: [],
            campaign: {
              ...state.campaign,
              activeChapterId: null,
              updatedAt: new Date().toISOString(),
            },
            ...invalidateRun(),
          })),

        continueGame: () => touch(() => ({ started: true })),

        startCampaign: () => {
          const state = get();
          const progress = campaignProgress(state.campaign.completed);
          const chapter = progress.nextChapter ?? campaignChapterById['moon-echo'];
          return chapter ? get().startCampaignChapter(chapter.id) : false;
        },

        startCampaignChapter: (chapterId) => {
          const state = get();
          const chapter = campaignChapterById[chapterId];
          if (!chapter) return false;
          if (!isChapterUnlocked(chapterId, state.campaign.completed)) return false;
          const now = new Date().toISOString();
          touch((current) => ({
            started: true,
            step: 1,
            choices: campaignChoices(chapter, current.choices.language),
            notices: [
              notice(
                'info',
                `بدأ الفصل ${chapter.number}: «${chapter.title.ar}». ${chapter.objective.ar}`,
                `Chapter ${chapter.number} began: “${chapter.title.en}”. ${chapter.objective.en}`,
              ),
            ],
            lastUnlocked: [],
            campaign: {
              ...current.campaign,
              activeChapterId: chapter.id,
              startedAt: current.campaign.startedAt ?? now,
              updatedAt: now,
            },
            ...invalidateRun(),
          }));
          return true;
        },

        exitCampaign: () =>
          touch((state) => ({
            started: false,
            step: 1,
            notices: [],
            lastUnlocked: [],
            campaign: {
              ...state.campaign,
              activeChapterId: null,
              updatedAt: new Date().toISOString(),
            },
            ...invalidateRun(),
          })),

        setStep: (step) => touch(() => ({ step: Math.min(11, Math.max(1, step)) })),

        setLanguage: (language) =>
          touch((state) => ({ choices: { ...state.choices, language } })),

        setDifficulty: (difficulty) => {
          if (activeChapter(get())) return;
          touch((state) => ({
            choices: { ...state.choices, difficulty },
            ...invalidateRun(),
          }));
        },

        setSeed: (seed) => {
          if (activeChapter(get())) return;
          touch((state) => ({
            choices: { ...state.choices, seed: seed.trim() || makeSeed() },
            ...invalidateRun(),
          }));
        },

        regenerateSeed: () => {
          if (activeChapter(get())) return;
          touch((state) => ({
            choices: { ...state.choices, seed: makeSeed() },
            ...invalidateRun(),
          }));
        },

        setPilotName: (name) => set({ pilotName: name.slice(0, 40) || 'Mission Commander' }),

        setTarget: (targetId) => {
          if (activeChapter(get())) return;
          const target = deriveDesign({ ...get().choices, targetId }).target;
          let missionType = get().choices.missionType;
          const newNotices: Notice[] = [];
          if (!target.allowedMissions.includes(missionType)) {
            const replacement = firstAllowedMission(targetId);
            newNotices.push(
              notice(
                'warning',
                `غيّرنا نوع المهمة إلى «${replacement}» لأن ${target.name.ar} لا يدعم النوع السابق.`,
                `Mission type switched to “${replacement}” because ${target.name.en} does not support the previous one.`,
              ),
            );
            missionType = replacement;
          }
          const invalid = incompatibleInstruments(targetId, missionType).map((i) => i.id);
          const removed = get().choices.instruments.filter((id) => invalid.includes(id));
          if (removed.length > 0) {
            newNotices.push(
              notice(
                'warning',
                `أُزيلت ${removed.length} أداة غير متاحة لهذا الهدف/النوع (مثل كبسولة العينات).`,
                `${removed.length} instrument(s) incompatible with this target/type were removed (e.g. the sample capsule).`,
              ),
            );
          }
          touch((state) => ({
            choices: {
              ...state.choices,
              targetId,
              missionType,
              launchWindowId: 'auto',
              instruments: state.choices.instruments.filter((id) => !invalid.includes(id)),
            },
            notices: [...state.notices.slice(-3), ...newNotices],
            ...invalidateRun(),
          }));
        },

        setMissionType: (missionType) => {
          if (activeChapter(get())) return;
          const state = get();
          const target = deriveDesign({ ...state.choices, missionType }).target;
          const newNotices: Notice[] = [];
          const invalid = incompatibleInstruments(target.id, missionType).map((i) => i.id);
          const removed = state.choices.instruments.filter((id) => invalid.includes(id));
          if (removed.length > 0) {
            newNotices.push(
              notice(
                'warning',
                `أُزيلت كبسولة العينات لأن نوع المهمة لم يعد «إرجاع عينات».`,
                `The sample capsule was removed because the mission is no longer a Sample Return.`,
              ),
            );
          }
          touch((s) => ({
            choices: {
              ...s.choices,
              missionType,
              instruments: s.choices.instruments.filter((id) => !invalid.includes(id)),
            },
            notices: [...s.notices.slice(-3), ...newNotices],
            ...invalidateRun(),
          }));
        },

        setChoice: (key, value) => {
          const chapter = activeChapter(get());
          if (
            chapter &&
            ['targetId', 'missionType', 'difficulty', 'successTier', 'seed'].includes(String(key))
          ) {
            return;
          }
          touch((state) => ({
            choices: { ...state.choices, [key]: value },
            ...invalidateRun(),
          }));
        },

        toggleInstrument: (id) => {
          const state = get();
          const design = deriveDesign(state.choices);
          const instrument = design.instruments.find((i) => i.id === id);
          if (!instrument) {
            const candidate = [...state.choices.instruments];
            // Instrument may be unselected but present in the catalogue; look it up in data.
            const fromData = instrumentById[id];
            if (fromData?.requiresSampleReturn && state.choices.missionType !== 'sampleReturn') {
              addNotice(
                notice(
                  'warning',
                  'كبسولة إرجاع العينات متاحة فقط في مهام إرجاع العينات.',
                  'The sample-return capsule is only available on Sample Return missions.',
                ),
              );
              return;
            }
            candidate.push(id);
            touch((s) => ({
              choices: { ...s.choices, instruments: [...new Set(candidate)] },
              ...invalidateRun(),
            }));
            return;
          }
          touch((s) => ({
            choices: {
              ...s.choices,
              instruments: s.choices.instruments.filter((x) => x !== id),
            },
            ...invalidateRun(),
          }));
        },

        setPower: (patch) =>
          touch((state) => ({
            choices: {
              ...state.choices,
              power: { ...state.choices.power, ...patch },
            },
            ...invalidateRun(),
          })),

        setComms: (patch) =>
          touch((state) => ({
            choices: {
              ...state.choices,
              comms: { ...state.choices.comms, ...patch },
            },
            ...invalidateRun(),
          })),

        runSimulation: () => {
          const state = get();
          const design = deriveDesign(state.choices);
          if (design.blockingIssues.length > 0) {
            addNotice(
              notice(
                'warning',
                'لا يمكن تشغيل المحاكاة قبل إصلاح الأخطاء المانعة.',
                'The simulation cannot run until blocking errors are fixed.',
              ),
            );
            return false;
          }
          const simulation = runPure(design, state.choices.seed);
          const score = computeScore(design, simulation);
          const profileUpdate = applyRunToProfile(state.profile, design, simulation, score);
          const summary: AttemptSummary = {
            id: simulation.runId,
            createdAt: simulation.createdAt,
            targetId: design.target.id,
            missionType: design.missionType.id,
            score: score.breakdown.total,
            grade: score.grade,
            outcome: score.outcome,
            seed: state.choices.seed,
            science: simulation.scienceAchieved,
            dataSentGb: simulation.dataSentGb,
            success: simulation.success,
          };
          const existing = state.attempts.some((a) => a.id === summary.id);
          const attempts = existing ? state.attempts : [summary, ...state.attempts].slice(0, 12);
          const leaderboard = existing
            ? state.leaderboard
            : [
                ...state.leaderboard,
                { ...summary, name: state.pilotName || 'قائد المهمة' },
              ]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);

          const chapter = activeChapter(state);
          let campaign = state.campaign;
          const chapterNotices: Notice[] = [];
          if (chapter) {
            const evaluation = evaluateCampaignChapter(chapter, design, simulation, score);
            if (evaluation.completed) {
              const completion = mergeCampaignCompletion(
                chapter.id,
                state.campaign.completed[chapter.id],
                evaluation,
                simulation,
                score,
              );
              campaign = {
                ...state.campaign,
                completed: { ...state.campaign.completed, [chapter.id]: completion },
                updatedAt: completion.updatedAt,
              };
              const next = nextCampaignChapter(chapter.id);
              chapterNotices.push(
                next
                  ? notice(
                      'info',
                      `اكتمل الفصل ${chapter.number}: «${chapter.title.ar}». فُتح الفصل ${next.number}: «${next.title.ar}».`,
                      `Chapter ${chapter.number} complete: “${chapter.title.en}”. Chapter ${next.number} unlocked: “${next.title.en}”.`,
                    )
                  : notice(
                      'info',
                      'اكتملت حملة «أفق آمون». الأفق مفتوح الآن.',
                      'The “AMUN Horizon” campaign is complete. The horizon is open.',
                    ),
              );
            }
          }

          set({
            simulation,
            score,
            attempts,
            leaderboard,
            profile: profileUpdate.profile,
            campaign,
            lastUnlocked: profileUpdate.newlyUnlocked,
            notices:
              chapterNotices.length > 0
                ? [...state.notices.slice(-3), ...chapterNotices]
                : state.notices,
            step: 10,
            savedAt: new Date().toISOString(),
          });
          return true;
        },

        recordAttempt: () => {
          const { simulation, score, attempts, leaderboard, pilotName, choices, profile } = get();
          if (!simulation || !score) return;
          const profileUpdate = applyRunToProfile(
            profile,
            deriveDesign(choices),
            simulation,
            score,
          );
          if (attempts.some((a) => a.id === simulation.runId)) {
            if (profileUpdate.newlyUnlocked.length > 0) {
              set({
                profile: profileUpdate.profile,
                lastUnlocked: profileUpdate.newlyUnlocked,
                savedAt: new Date().toISOString(),
              });
            }
            return;
          }
          const summary: AttemptSummary = {
            id: simulation.runId,
            createdAt: simulation.createdAt,
            targetId: choices.targetId,
            missionType: choices.missionType,
            score: score.breakdown.total,
            grade: score.grade,
            outcome: score.outcome,
            seed: choices.seed,
            science: simulation.scienceAchieved,
            dataSentGb: simulation.dataSentGb,
            success: simulation.success,
          };
          set({
            attempts: [summary, ...attempts].slice(0, 12),
            leaderboard: [...leaderboard, { ...summary, name: pilotName || 'قائد المهمة' }]
              .sort((a, b) => b.score - a.score)
              .slice(0, 10),
            profile: profileUpdate.profile,
            lastUnlocked: profileUpdate.newlyUnlocked,
            savedAt: new Date().toISOString(),
          });
        },

        replaySameChoices: () =>
          touch((state) => ({
            simulation: null,
            score: null,
            step: 1,
            started: true,
            lastUnlocked: [],
            choices: { ...state.choices },
          })),

        replaySameSeed: () => {
          const state = get();
          const chapter = activeChapter(state);
          return touch(() => ({
            simulation: null,
            score: null,
            step: 1,
            started: true,
            lastUnlocked: [],
            choices: chapter
              ? campaignChoices(chapter, state.choices.language)
              : {
                  ...defaultChoices(),
                  language: state.choices.language,
                  difficulty: state.choices.difficulty,
                  seed: state.choices.seed,
                },
            notices: [
              notice(
                'info',
                chapter
                  ? `أعدنا تصميم الفصل ${chapter.number} إلى نقطة البداية مع الإبقاء على بذرته (${chapter.seed}).`
                  : 'بذرة جديدة؟ لا: أعدنا التصميم إلى البداية مع الإبقاء على البذرة نفسها لمقارنة الخيارات.',
                chapter
                  ? `Chapter ${chapter.number} is back at its starting design with the same seed (${chapter.seed}).`
                  : 'Same seed, fresh design: the wizard restarts with the same RNG seed so choices can be compared fairly.',
              ),
            ],
          }));
        },

        replayFromScratch: () => {
          const state = get();
          const chapter = activeChapter(state);
          return touch(() => ({
            simulation: null,
            score: null,
            step: 1,
            started: true,
            lastUnlocked: [],
            choices: chapter
              ? campaignChoices(chapter, state.choices.language)
              : {
                  ...defaultChoices(),
                  language: state.choices.language,
                  difficulty: state.choices.difficulty,
                },
            notices: chapter
              ? [
                  notice(
                    'info',
                    `أعدنا الفصل ${chapter.number} من تصميمه المرجعي. البذرة ثابتة طوال الفصل.`,
                    `Chapter ${chapter.number} restarted from its reference design. The seed stays fixed for the chapter.`,
                  ),
                ]
              : [],
          }));
        },

        exportDesign: () => {
          const state = get();
          return JSON.stringify(
            {
              version: MISSION_SCHEMA_VERSION,
              exportedAt: new Date().toISOString(),
              choices: state.choices,
            },
            null,
            2,
          );
        },

        importDesign: (json) => {
          try {
            const parsed = JSON.parse(json) as { choices?: Partial<DesignChoices>; version?: number };
            if (!parsed || typeof parsed !== 'object' || !parsed.choices) {
              return { ok: false, error: 'invalid' };
            }
            const cleaned = cleanChoices(parsed.choices);
            const chapter = activeChapter(get());
            const targetId = chapter?.targetId ?? cleaned.targetId;
            const target = targetById[targetId];
            if (!target) return { ok: false, error: 'target' };
            let missionType = chapter?.missionType ?? cleaned.missionType;
            if (!target.allowedMissions.includes(missionType)) {
              missionType = firstAllowedMission(target.id);
            }
            const invalid = incompatibleInstruments(target.id, missionType).map((i) => i.id);
            const choices: DesignChoices = {
              ...cleaned,
              ...(chapter
                ? {
                    targetId: chapter.targetId,
                    missionType: chapter.missionType,
                    difficulty: chapter.difficulty,
                    successTier: chapter.successTier,
                    seed: chapter.seed,
                  }
                : {}),
              targetId,
              missionType,
              instruments: cleaned.instruments.filter((id) => !invalid.includes(id)),
            };
            touch(() => ({
              choices,
              simulation: null,
              score: null,
              step: 1,
              started: true,
              lastUnlocked: [],
              notices: [
                notice(
                  'info',
                  chapter
                    ? `تم استيراد التصميم داخل الفصل ${chapter.number}. بقيت توجيهات الهدف والمهمة والبذرة ثابتة.`
                    : 'تم استيراد التصميم بنجاح. راجع القيم والتحذيرات.',
                  chapter
                    ? `Design imported inside chapter ${chapter.number}. Target, mission type and seed directives stayed fixed.`
                    : 'Design imported successfully. Review the values and warnings.',
                ),
              ],
            }));
            return { ok: true };
          } catch {
            return { ok: false, error: 'parse' };
          }
        },

        dismissNotice: (id) =>
          set((state) => ({ notices: state.notices.filter((n) => n.id !== id) })),

        resetAll: () => {
          const language = get().choices.language;
          set({
            schemaVersion: MISSION_SCHEMA_VERSION,
            choices: { ...defaultChoices(), language },
            started: false,
            step: 1,
            simulation: null,
            score: null,
            attempts: [],
            leaderboard: [],
            notices: [],
            pilotName: 'Mission Commander',
            profile: emptyPilotProfile(),
            campaign: emptyCampaignState(),
            lastUnlocked: [],
            savedAt: null,
          });
          try {
            localStorage.removeItem('amun-mission-v1');
          } catch {
            // Storage may be unavailable; the in-memory reset still applies.
          }
        },
      };
    },
    {
      name: 'amun-mission-v1',
      version: MISSION_SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        choices: state.choices,
        started: state.started,
        step: state.step,
        simulation: state.simulation,
        score: state.score,
        attempts: state.attempts,
        leaderboard: state.leaderboard,
        pilotName: state.pilotName,
        profile: state.profile,
        campaign: state.campaign,
        lastUnlocked: state.lastUnlocked,
        savedAt: state.savedAt,
      }),
      migrate: (persisted, version) => {
        const raw = (persisted ?? {}) as Record<string, unknown>;
        if (version < 1) {
          const maybeChoices = (raw.choices ?? raw) as Partial<DesignChoices>;
          return {
            ...raw,
            schemaVersion: MISSION_SCHEMA_VERSION,
            choices: cleanChoices(maybeChoices),
            profile: profileFromAttempts(
              Array.isArray(raw.attempts) ? (raw.attempts as AttemptSummary[]) : [],
            ),
            campaign: emptyCampaignState(),
            lastUnlocked: [],
          };
        }
        return {
          ...raw,
          schemaVersion: MISSION_SCHEMA_VERSION,
          choices: cleanChoices(raw.choices as Partial<DesignChoices> | undefined),
          profile:
            version < 2
              ? profileFromAttempts(
                  Array.isArray(raw.attempts) ? (raw.attempts as AttemptSummary[]) : [],
                )
              : normalizeProfile(raw.profile),
          campaign: normalizeCampaignState(raw.campaign),
          lastUnlocked: Array.isArray(raw.lastUnlocked)
            ? raw.lastUnlocked.filter((id): id is string => typeof id === 'string')
            : [],
        } as unknown as MissionState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.choices = cleanChoices(state.choices);
          state.profile = normalizeProfile(state.profile);
          state.campaign = normalizeCampaignState(state.campaign);
          if (
            state.campaign.activeChapterId &&
            !isChapterUnlocked(state.campaign.activeChapterId, state.campaign.completed)
          ) {
            state.campaign.activeChapterId = null;
          }
          const chapter = state.campaign.activeChapterId
            ? campaignChapterById[state.campaign.activeChapterId]
            : null;
          if (chapter) {
            state.choices = {
              ...state.choices,
              targetId: chapter.targetId,
              missionType: chapter.missionType,
              difficulty: chapter.difficulty,
              successTier: chapter.successTier,
              seed: chapter.seed,
            };
          }
          const unlockedIds = new Set(Object.keys(state.profile.unlocked));
          state.lastUnlocked = Array.isArray(state.lastUnlocked)
            ? state.lastUnlocked.filter((id) => unlockedIds.has(id))
            : [];
          state.hydrated = true;
        }
      },
    },
  ),
);

