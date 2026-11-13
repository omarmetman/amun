import type {
  Antenna,
  Bus,
  CostLine,
  DesignChoices,
  DifficultyConfig,
  GroundStation,
  Instrument,
  Launcher,
  MissionTarget,
  MissionType,
  PropulsionSystem,
  ScoreResult,
  SimulationResult,
  SuccessTier,
  ValidationIssue,
} from '../data/types';

export interface LaunchWindow {
  id: string;
  dateISO: string;
  year: number;
  penalty: number;
  synodicYears: number;
  label: { ar: string; en: string };
}

export interface OrbitBreakdown {
  tcm: number;
  planeChange: number;
  insertion: number;
  landing: number;
  proximity: number;
  returnLeg: number;
}

export interface OrbitSolution {
  c3: number;
  transferDays: number;
  transferYears: number;
  requiredDvMS: number;
  breakdown: OrbitBreakdown;
  availableDvMS: number;
  dvMargin: number;
  window: LaunchWindow;
  windowPenalty: number;
  transferTypeMultiplier: number;
}

export interface MassSolution {
  baseDryMassKg: number;
  structuralMassKg: number;
  systemMassKg: number;
  tankMassKg: number;
  dryMassKg: number;
  propellantKg: number;
  desiredPropellantKg: number;
  wetMassKg: number;
  launcherCapacityKg: number;
  massMargin: number;
  equationClosed: boolean;
  propellantLimited: boolean;
  massRatioWetDry: number;
  tankFraction: number;
  availableDvMS: number;
}

export interface ModePower {
  loadW: number;
  generatedW: number;
  margin: number;
}

export interface PowerSolution {
  solarFluxCruiseWM2: number;
  solarFluxTargetWM2: number;
  solarGeneratedCruiseW: number;
  solarGeneratedTargetW: number;
  rtgGeneratedW: number;
  batteryCapacityWh: number;
  batteryRequiredWh: number;
  eclipseHours: number;
  orbitPeriodHours: number;
  years: number;
  modes: {
    cruise: ModePower;
    science: ModePower;
    safe: ModePower;
  };
  solarAreaM2: number;
  rtgCount: number;
  batteryKg: number;
  solarMassKg: number;
  rtgMassKg: number;
  batteryMassKg: number;
  powerMassKg: number;
  powerCostM: number;
}

export interface CommsSolution {
  dataRateKbps: number;
  linkHoursPerDay: number;
  producedGbPerDay: number;
  downlinkGbPerDay: number;
  producedTotalGb: number;
  sentTotalGb: number;
  lostTotalGb: number;
  memoryGb: number;
  antennaMassKg: number;
  commsCostM: number;
  linkBudgetGain: number;
  distanceAU: number;
  txDcPowerW: number;
}

export interface CostSolution {
  lines: CostLine[];
  subtotalM: number;
  reserveM: number;
  totalM: number;
  budgetM: number;
  remainingM: number;
  reservePercent: number;
  opsDays: number;
  dsnHours: number;
  launchCostM: number;
  propellantCostM: number;
}

export interface SciencePotential {
  raw: number;
  byInstrument: Array<{ id: string; value: number; affinity: number }>;
  averageAffinity: number;
  opsFactor: number;
}

export interface DesignResult {
  choices: DesignChoices;
  target: MissionTarget;
  missionType: MissionType;
  bus: Bus;
  propulsion: PropulsionSystem;
  launcher: Launcher;
  tier: SuccessTier;
  difficulty: DifficultyConfig;
  antenna: Antenna;
  ground: GroundStation;
  instruments: Instrument[];
  windowOptions: LaunchWindow[];
  instrumentMassKg: number;
  payloadCapacityKg: number;
  redundancyMassKg: number;
  radHardMassKg: number;
  redundancyCostM: number;
  radHardCostM: number;
  commsMassKg: number;
  baseSystemMassKg: number;
  structuralMassKg: number;
  mass: MassSolution;
  orbit: OrbitSolution;
  power: PowerSolution;
  comms: CommsSolution;
  cost: CostSolution;
  science: SciencePotential;
  issues: ValidationIssue[];
  blockingIssues: ValidationIssue[];
  warningIssues: ValidationIssue[];
}

export interface ScoreContext {
  design: DesignResult;
  simulation: SimulationResult;
}

export type DesignBase = Omit<
  DesignResult,
  'issues' | 'blockingIssues' | 'warningIssues'
>;

export type ScoreFn = (ctx: ScoreContext) => ScoreResult;

export type {
  DesignChoices,
  MissionTarget,
  MissionType,
  Bus,
  PropulsionSystem,
  Launcher,
  Instrument,
  SuccessTier,
  DifficultyConfig,
  ValidationIssue,
  CostLine,
  SimulationResult,
  ScoreResult,
  Antenna,
  GroundStation,
};
