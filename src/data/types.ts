/**
 * Shared data contracts for AMUN.
 * All mission content lives in plain records under src/data so a new target,
 * instrument, bus or launcher can be added without touching the engine.
 */

export interface LocalizedText {
  ar: string;
  en: string;
}

export type Language = 'ar' | 'en';
export type Difficulty = 'beginner' | 'normal' | 'expert';
export type MissionTypeId = 'flyby' | 'orbiter' | 'lander' | 'rendezvous' | 'sampleReturn';
export type TargetKind = 'moon' | 'planet' | 'gasGiant' | 'asteroid' | 'comet' | 'dwarfPlanet';
export type SuccessTierId = 'minimum' | 'basic' | 'ambitious';
export type TransferType = 'hohmann' | 'fast' | 'assist';
export type Band = 'X' | 'Ka';
export type GroundStationId = 'dsn34' | 'dsn70';
export type AntennaId = 'lga' | 'mga' | 'hga';
export type Redundancy = 'none' | 'singleFault' | 'dualFault';
export type Severity = 'error' | 'warning' | 'info';

export type SourceKey =
  | 'horizons'
  | 'sbdb'
  | 'ntrs'
  | 'nasaImages'
  | 'basics'
  | 'nasaFact'
  | 'dsn'
  | 'launchApprox'
  | 'game';

export interface SourceDef {
  key: SourceKey;
  name: LocalizedText;
  publisher: string;
  url: string;
  note?: LocalizedText;
}

export interface TargetImage {
  url: string;
  credit: string;
  title: string;
  /** Agency that produced the photograph, shown on the image plate. */
  source?: 'NASA' | 'ESA' | 'JAXA' | 'NASA/ESA';
  nasaId?: string;
  illustrative?: boolean;
}

export interface MissionTarget {
  id: string;
  name: LocalizedText;
  kind: TargetKind;
  horizonsId: string;
  sbdbId?: string;
  /** Heliocentric distance at the snapshot epoch, from JPL Horizons. */
  sunDistanceAU: number;
  /** Earth–target range at the snapshot epoch, from JPL Horizons. */
  earthDistanceAU: number;
  semiMajorAxisAU: number;
  eccentricity: number;
  orbitalPeriodYears: number;
  inclinationDeg: number;
  diameterKm: number;
  gravityMS2: number;
  rotationHours: number;
  description: LocalizedText;
  image: TargetImage;
  /** Approximate capture / landing / return budgets (game-simplified). */
  captureDvMS: number;
  landingDvMS: number;
  returnDvMS: number;
  hazardFactor: number;
  sampleReturnCapable: boolean;
  landingCapable: boolean;
  allowedMissions: MissionTypeId[];
  /** Anchor date for the first approximate launch window. */
  windowAnchor: string;
  sourceKeys: SourceKey[];
  simplifiedNote: LocalizedText;
  snapshotDate: string;
}

export interface MissionType {
  id: MissionTypeId;
  name: LocalizedText;
  short: LocalizedText;
  description: LocalizedText;
  scienceMultiplier: number;
  dataMultiplier: number;
  complexity: number;
  requiresLanding: boolean;
  requiresSampleReturn: boolean;
  requiresCapture: boolean;
  icon: string;
}

export interface Bus {
  id: string;
  name: LocalizedText;
  dryMassKg: number;
  basePowerW: number;
  costM: number;
  payloadCapacityKg: number;
  storageGb: number;
  reliability: number;
  description: LocalizedText;
}

export interface PropulsionSystem {
  id: string;
  name: LocalizedText;
  ispS: number;
  dryMassKg: number;
  costM: number;
  powerW: number;
  tankFraction: number;
  tripTimeFactor: number;
  reliability: number;
  description: LocalizedText;
}

export interface Instrument {
  id: string;
  name: LocalizedText;
  category: string;
  massKg: number;
  powerW: number;
  costM: number;
  dataRateKbps: number;
  scienceBase: number;
  /** Multiplier by target kind. Values above 1 mean strong affinity. */
  affinity: Partial<Record<TargetKind, number>>;
  /** Optional per-target override. */
  affinityByTarget?: Record<string, number>;
  requiresSampleReturn?: boolean;
  requiresLanding?: boolean;
  description: LocalizedText;
  sourceKeys: SourceKey[];
  simplified: boolean;
}

export interface Launcher {
  id: string;
  name: LocalizedText;
  country: string;
  /** Payload mass in kg as a function of C3 in km²/s². */
  payloadAtC3: Array<{ c3: number; kg: number }>;
  costM: number;
  reliability: number;
  description: LocalizedText;
  sourceKeys: SourceKey[];
}

export interface SuccessTier {
  id: SuccessTierId;
  name: LocalizedText;
  description: LocalizedText;
  minScience: number;
  minDataGb: number;
}

export interface DifficultyConfig {
  id: Difficulty;
  name: LocalizedText;
  description: LocalizedText;
  budgetM: number;
  eventMultiplier: number;
  opsCostPerDayM: number;
  hints: 'full' | 'limited' | 'none';
  color: string;
}

export interface Antenna {
  id: AntennaId;
  name: LocalizedText;
  diameterM: number;
  massKg: number;
  costM: number;
  description: LocalizedText;
}

export interface GroundStation {
  id: GroundStationId;
  name: LocalizedText;
  diameterM: number;
  gainFactor: number;
  linkHoursPerDay: number;
  costPerHourM: number;
  description: LocalizedText;
}

export interface PowerComponent {
  id: string;
  name: LocalizedText;
  /** kg per m² for solar, kg per unit for RTG, kg per kg for battery. */
  massPerUnit: number;
  costPerUnitM: number;
  unit: string;
  description: LocalizedText;
  sourceKeys: SourceKey[];
}

export interface SimulationEventDef {
  id: string;
  name: LocalizedText;
  phases: SimulationPhase[];
  severity: Severity;
  baseProbability: number;
  description: LocalizedText;
  learnKey: string;
  requires?: {
    targetKind?: TargetKind[];
    missionType?: MissionTypeId[];
    transferType?: TransferType[];
    lowPowerMargin?: boolean;
    lowDvMargin?: boolean;
    noRadHard?: boolean;
    redundancy?: boolean;
    hasInstrument?: string;
    missingInstrument?: string;
  };
  /** Multipliers applied to baseProbability when a design condition holds. */
  probabilityModifiers?: Array<{
    when: 'lowPowerMargin' | 'lowDvMargin' | 'noRadHard' | 'redundancy' | 'safeModeRisk' | 'comet' | 'gasGiant';
    multiplier: number;
  }>;
  effects: {
    delayDays?: number;
    scienceLossPct?: number;
    scienceBonusPct?: number;
    dataLossPct?: number;
    linkHoursFactor?: number;
    linkHoursDays?: number;
    budgetOverrunPct?: number;
    missionLossRisk?: number;
    safeMode?: boolean;
  };
}

export type SimulationPhase = 'launch' | 'cruise' | 'arrival' | 'operations' | 'return';

export type IssueCode =
  | 'MASS_OVER'
  | 'EQUATION_NO_CLOSE'
  | 'BUDGET_OVER'
  | 'POWER_CRUISE'
  | 'POWER_SCIENCE'
  | 'POWER_SAFE'
  | 'POWER_BATTERY'
  | 'DV_DEFICIT'
  | 'DATA_RATE_ZERO'
  | 'NO_INSTRUMENTS'
  | 'PAYLOAD_CAPACITY'
  | 'MASS_MARGIN_LOW'
  | 'POWER_MARGIN_LOW'
  | 'DV_MARGIN_LOW'
  | 'DATA_MEMORY_LOSS'
  | 'AFFINITY_LOW'
  | 'RESERVE_LOW'
  | 'SOLAR_FAR'
  | 'ION_POWER'
  | 'SAMPLE_CAPSULE_MISMATCH'
  | 'MISSION_TYPE_INCOMPATIBLE'
  | 'WINDOW_PENALTY'
  | 'PROPELLANT_LIMITED'
  | 'RTG_FAR'
  | 'LAUNCHER_OVERSIZED';

export interface ValidationIssue {
  code: IssueCode;
  severity: Severity;
  step: number;
  title: LocalizedText;
  message: LocalizedText;
  /** Numeric context for the report / suggestions. */
  metric?: number;
}

export interface DesignChoices {
  difficulty: Difficulty;
  language: Language;
  seed: string;
  missionType: MissionTypeId;
  targetId: string;
  successTier: SuccessTierId;
  busId: string;
  propulsionId: string;
  redundancy: Redundancy;
  radHard: boolean;
  instruments: string[];
  launcherId: string;
  launchWindowId: string;
  transferType: TransferType;
  power: {
    solarAreaM2: number;
    rtgCount: number;
    batteryKg: number;
  };
  comms: {
    antennaId: AntennaId;
    band: Band;
    txPowerW: number;
    groundStation: GroundStationId;
  };
  opsDays: number;
  reservePercent: number;
  propellantReservePercent: number;
}

export interface CostLine {
  id: string;
  label: LocalizedText;
  amountM: number;
  color: string;
  simplified?: boolean;
}

export interface SimulationEventLog {
  id: string;
  phase: SimulationPhase;
  day: number;
  name: LocalizedText;
  description: LocalizedText;
  severity: Severity;
  effects: LocalizedText[];
  learnKey: string;
}

export interface SimulationPhaseResult {
  phase: SimulationPhase;
  label: LocalizedText;
  startDay: number;
  endDay: number;
  outcome: 'nominal' | 'degraded' | 'failed' | 'skipped';
  note: LocalizedText;
}

export interface SimulationResult {
  seed: string;
  runId: string;
  createdAt: string;
  phases: SimulationPhaseResult[];
  events: SimulationEventLog[];
  success: boolean;
  failurePhase: SimulationPhase | null;
  failureReason: LocalizedText | null;
  scienceRaw: number;
  scienceAchieved: number;
  sciencePossible: number;
  dataProducedGb: number;
  dataSentGb: number;
  dataLostGb: number;
  budgetOverrunM: number;
  reserveUsedM: number;
  totalDays: number;
  reliability: number;
  safeModeDays: number;
  linkHoursLost: number;
}

export interface ScoreBreakdown {
  science: number;
  budget: number;
  margins: number;
  reliability: number;
  total: number;
}

export interface DecisionImpact {
  id: string;
  positive: boolean;
  title: LocalizedText;
  detail: LocalizedText;
  step: number;
}

export interface ScoreResult {
  breakdown: ScoreBreakdown;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  outcome: 'full' | 'partial' | 'failure';
  headline: LocalizedText;
  reasons: LocalizedText[];
  positives: DecisionImpact[];
  negatives: DecisionImpact[];
  improvements: LocalizedText[];
  tierMet: { science: boolean; data: boolean };
  createdAt: string;
}

export interface AttemptSummary {
  id: string;
  createdAt: string;
  targetId: string;
  missionType: MissionTypeId;
  score: number;
  grade: string;
  outcome: string;
  seed: string;
  science: number;
  dataSentGb: number;
  success: boolean;
}

export interface LeaderboardEntry extends AttemptSummary {
  name: string;
}

export type AchievementCategory = 'milestone' | 'exploration' | 'engineering' | 'mastery';
export type AchievementTier = 'bronze' | 'silver' | 'gold';

/**
 * Aggregate pilot statistics. Every value is derived from recorded runs only;
 * achievements are pure predicates over this record so migration and offline
 * evaluation never need the original design or simulation objects.
 */
export interface PilotStats {
  runs: number;
  successes: number;
  failures: number;
  bestScore: number;
  bestScience: number;
  bestDataGb: number;
  totalScience: number;
  totalDataGb: number;
  /** Grades S and A, i.e. the top two grades. */
  sGrades: number;
  aGrades: number;
  currentStreak: number;
  bestStreak: number;
  targetsVisited: string[];
  targetKindsVisited: TargetKind[];
  missionTypesFlown: MissionTypeId[];
  difficultiesWon: Difficulty[];
  instrumentsFlown: string[];
  sampleReturns: number;
  leanSuccesses: number;
  budgetHawks: number;
  marginAces: number;
  reliabilityAces: number;
  rtgSuccesses: number;
  expertSuccesses: number;
  noRedundancySuccesses: number;
}

export interface PilotProfile {
  stats: PilotStats;
  /** Achievement id → ISO timestamp of the unlock. */
  unlocked: Record<string, string>;
  /** Run ids already folded into the stats, capped to keep storage small. */
  recordedRuns: string[];
}

export interface AchievementDef {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  hint: LocalizedText;
  category: AchievementCategory;
  /** Key resolved to a lucide icon in the UI. */
  icon: string;
  tier: AchievementTier;
  test: (stats: PilotStats) => boolean;
}

export interface DesignSnapshot {
  version: number;
  exportedAt: string;
  choices: DesignChoices;
}

// ---------------------------------------------------------------------------
// Campaign: “AMUN Horizon”, a six-chapter narrative chain that reuses the
// same deterministic mission engine. Directives are fixed per chapter; every
// engineering choice remains with the player.
// ---------------------------------------------------------------------------

export type CampaignAccent = 'gold' | 'royal' | 'good' | 'danger' | 'violet' | 'cyan';

export type CampaignObjectiveKind =
  | 'grade'
  | 'science'
  | 'data'
  | 'budget'
  | 'instrument'
  | 'radHard';

export interface CampaignObjectiveDef {
  id: string;
  kind: CampaignObjectiveKind;
  title: LocalizedText;
  description: LocalizedText;
  minGrade?: ScoreResult['grade'];
  threshold?: number;
  instrumentId?: string;
}

/** Everything a chapter fixes for the player. */
export interface CampaignPreset {
  busId: string;
  propulsionId: string;
  redundancy: Redundancy;
  radHard: boolean;
  instruments: string[];
  launcherId: string;
  launchWindowId: string;
  transferType: TransferType;
  power: DesignChoices['power'];
  comms: DesignChoices['comms'];
  opsDays: number;
  reservePercent: number;
  propellantReservePercent: number;
}

export interface ChapterNasaDossier {
  benchmarkMission: LocalizedText;
  historicalPrecedent: LocalizedText;
  realWorldFacts: LocalizedText[];
  primaryChallenge: LocalizedText;
  engineeringHint: LocalizedText;
  orbitalData: {
    distanceAU: string;
    gravityMs2: number;
    escapeVelocityKms: number;
    solarIrradianceWm2: number;
    oneWayLightTimeMinutes: number;
  };
}

export interface ChapterHazard {
  id: string;
  name: LocalizedText;
  severity: 'low' | 'moderate' | 'critical';
  description: LocalizedText;
  mitigation: LocalizedText;
}

export interface CampaignChapter {
  id: string;
  number: number;
  /** Short production code shown in the dossier, e.g. NILE-2041. */
  code: string;
  year: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  targetId: string;
  missionType: MissionTypeId;
  difficulty: Difficulty;
  successTier: SuccessTierId;
  seed: string;
  accent: CampaignAccent;
  icon: string;
  prologue: LocalizedText;
  briefing: LocalizedText;
  objective: LocalizedText;
  transmission: LocalizedText;
  epilogue: LocalizedText;
  bonusObjectives: CampaignObjectiveDef[];
  preset: CampaignPreset;
  nasaDossier?: ChapterNasaDossier;
  environmentalHazards?: ChapterHazard[];
}

export interface CampaignObjectiveResult {
  id: string;
  met: boolean;
}

export interface CampaignEvaluation {
  chapterId: string;
  completed: boolean;
  tierMet: { science: boolean; data: boolean };
  objectives: CampaignObjectiveResult[];
  stars: number;
}

export interface CampaignCompletion {
  chapterId: string;
  /** First time the chapter was completed. */
  completedAt: string;
  /** Last time a run improved the record. */
  updatedAt: string;
  bestScore: number;
  bestGrade: ScoreResult['grade'];
  bestScience: number;
  bestDataGb: number;
  stars: number;
  objectives: Record<string, boolean>;
}

export interface CampaignState {
  activeChapterId: string | null;
  completed: Record<string, CampaignCompletion>;
  startedAt: string | null;
  updatedAt: string | null;
}
