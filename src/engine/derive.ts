import type {
  DesignChoices,
  Instrument,
  MissionTarget,
  ValidationIssue,
} from '../data/types';
import { busById } from '../data/buses';
import { difficultyById, missionTypeById, tierById } from '../data/missions';
import { instrumentById, instrumentAffinity, INSTRUMENTS } from '../data/instruments';
import { launcherById } from '../data/launchers';
import { propulsionById } from '../data/propulsion';
import { antennaById, groundStationById } from '../data/comms';
import { targetById, TARGETS } from '../data/targets';
import { computeOrbit, computeLaunchWindows, payloadCapacityAtC3, attachAvailableDv } from './orbit';
import { solveMassBudget } from './rocket';
import { computePower } from './power';
import { computeComms } from './comms';
import { computeCost } from './cost';
import { validateDesign } from './validate';
import type { DesignBase, DesignResult, SciencePotential } from './model';

const defaultTarget = TARGETS[0];

const resolveTarget = (id: string): MissionTarget => targetById[id] ?? defaultTarget;

const resolveInstruments = (ids: string[]): Instrument[] =>
  ids.map((id) => instrumentById[id]).filter((i): i is Instrument => Boolean(i));

/**
 * Single source of truth for every derived number. React never recomputes a
 * mission formula itself: screens read this pure result.
 */
export function deriveDesign(choices: DesignChoices): DesignResult {
  const target = resolveTarget(choices.targetId);
  const missionType = missionTypeById[choices.missionType] ?? missionTypeById.orbiter;
  const bus = busById[choices.busId] ?? Object.values(busById)[0];
  const propulsion = propulsionById[choices.propulsionId] ?? Object.values(propulsionById)[0];
  const launcher = launcherById[choices.launcherId] ?? Object.values(launcherById)[0];
  const tier = tierById[choices.successTier] ?? tierById.minimum;
  const difficulty = difficultyById[choices.difficulty] ?? difficultyById.normal;
  const antenna = antennaById[choices.comms.antennaId] ?? Object.values(antennaById)[0];
  const ground = groundStationById[choices.comms.groundStation] ?? Object.values(groundStationById)[0];
  const instruments = resolveInstruments(choices.instruments);
  const windowOptions = computeLaunchWindows(target);
  const window =
    windowOptions.find((w) => w.id === choices.launchWindowId) ?? windowOptions[0];

  const orbitNominal = computeOrbit({
    target,
    missionTypeId: missionType.id,
    transferType: choices.transferType,
    window,
    propulsion,
    requiresCapture: missionType.requiresCapture,
    requiresLanding: missionType.requiresLanding,
    requiresSampleReturn: missionType.requiresSampleReturn,
  });

  const payloadCapacityKg = payloadCapacityAtC3(launcher, orbitNominal.c3);
  const instrumentMassKg = instruments.reduce((sum, i) => sum + i.massKg, 0);

  const redundancyMassKg =
    choices.redundancy === 'dualFault'
      ? bus.dryMassKg * 0.13
      : choices.redundancy === 'singleFault'
        ? bus.dryMassKg * 0.07
        : 0;
  const radHardMassKg = choices.radHard ? 22 + bus.dryMassKg * 0.03 : 0;
  const redundancyCostM =
    choices.redundancy === 'dualFault'
      ? bus.costM * 0.18
      : choices.redundancy === 'singleFault'
        ? bus.costM * 0.1
        : 0;
  const radHardCostM = choices.radHard ? 12 + bus.costM * 0.06 : 0;

  const power = computePower({
    target,
    bus,
    propulsion,
    instruments,
    txPowerW: choices.comms.txPowerW,
    redundancy: choices.redundancy,
    radHard: choices.radHard,
    solarAreaM2: choices.power.solarAreaM2,
    rtgCount: choices.power.rtgCount,
    batteryKg: choices.power.batteryKg,
    transferDays: orbitNominal.transferDays,
    opsDays: choices.opsDays,
    missionTypeId: missionType.id,
  });

  const comms = computeComms({
    target,
    missionTypeId: missionType.id,
    dataMultiplier: missionType.dataMultiplier,
    instruments,
    antenna,
    band: choices.comms.band,
    txPowerW: choices.comms.txPowerW,
    ground,
    bus,
    powerScienceMargin: power.modes.science.margin,
    opsDays: choices.opsDays,
  });

  const commsMassKg = antenna.massKg;
  const baseSystemMassKg =
    bus.dryMassKg +
    instrumentMassKg +
    power.powerMassKg +
    commsMassKg +
    propulsion.dryMassKg +
    redundancyMassKg +
    radHardMassKg;
  const structuralMassKg = baseSystemMassKg * 0.15;
  const baseDryMassKg = baseSystemMassKg + structuralMassKg;

  const massBase = solveMassBudget({
    baseDryMassKg,
    ispS: propulsion.ispS,
    tankFraction: propulsion.tankFraction,
    requiredDvMS: orbitNominal.requiredDvMS,
    propellantReservePercent: choices.propellantReservePercent,
    launcherCapacityKg: payloadCapacityKg,
  });
  const mass: import('./model').MassSolution = {
    ...massBase,
    structuralMassKg,
    systemMassKg: baseSystemMassKg,
  };
  const orbit = attachAvailableDv(orbitNominal, mass.availableDvMS);

  const cost = computeCost({
    bus,
    instruments,
    propulsion,
    launcher,
    missionType,
    difficulty,
    ground,
    powerCostM: power.powerCostM,
    commsCostM: comms.commsCostM,
    linkHoursPerDay: comms.linkHoursPerDay,
    opsDays: choices.opsDays,
    reservePercent: choices.reservePercent,
    propellantKg: mass.propellantKg,
    redundancyCostM,
    radHardCostM,
  });

  const opsFactor = Math.min(
    1.15,
    Math.max(0.45, (Math.max(1, choices.opsDays) / 30) ** 0.35),
  );
  const byInstrument = instruments.map((instrument) => {
    const affinity = instrumentAffinity(instrument, target.id, target.kind);
    return {
      id: instrument.id,
      affinity,
      value: instrument.scienceBase * affinity * missionType.scienceMultiplier * opsFactor,
    };
  });
  const rawScience = byInstrument.reduce((sum, i) => sum + i.value, 0);
  const missionBonus =
    (missionType.requiresLanding ? 1.03 : 1) * (missionType.requiresSampleReturn ? 1.05 : 1);
  const baseWeight = instruments.reduce((sum, i) => sum + i.scienceBase, 0);
  const weightedAffinity =
    baseWeight > 0
      ? byInstrument.reduce((sum, i) => sum + i.affinity * (instrumentById[i.id]?.scienceBase ?? 0), 0) /
        baseWeight
      : 0;
  const science: SciencePotential = {
    raw: rawScience * missionBonus,
    byInstrument,
    averageAffinity: weightedAffinity,
    opsFactor,
  };

  const base: DesignBase = {
    choices,
    target,
    missionType,
    bus,
    propulsion,
    launcher,
    tier,
    difficulty,
    antenna,
    ground,
    instruments,
    windowOptions,
    instrumentMassKg,
    payloadCapacityKg,
    redundancyMassKg,
    radHardMassKg,
    redundancyCostM,
    radHardCostM,
    commsMassKg,
    baseSystemMassKg,
    structuralMassKg,
    mass,
    orbit,
    power,
    comms,
    cost,
    science,
  };

  const issues: ValidationIssue[] = validateDesign(base);
  return {
    ...base,
    issues,
    blockingIssues: issues.filter((i) => i.severity === 'error'),
    warningIssues: issues.filter((i) => i.severity === 'warning'),
  };
}

/** Instrument records that are actually legal for a target/mission combo. */
export function incompatibleInstruments(
  targetId: string,
  missionTypeId: DesignChoices['missionType'],
): Instrument[] {
  const target = resolveTarget(targetId);
  return INSTRUMENTS.filter((instrument) => {
    if (instrument.requiresSampleReturn && missionTypeId !== 'sampleReturn') return true;
    if (instrument.requiresSampleReturn && !target.sampleReturnCapable) return true;
    return false;
  });
}

/** Used when a target change invalidates a saved choice. */
export function isMissionAllowed(targetId: string, missionTypeId: DesignChoices['missionType']): boolean {
  return resolveTarget(targetId).allowedMissions.includes(missionTypeId);
}

export function firstAllowedMission(targetId: string): DesignChoices['missionType'] {
  const target = resolveTarget(targetId);
  if (target.allowedMissions.includes('orbiter')) return 'orbiter';
  return target.allowedMissions[0] ?? 'flyby';
}

/** For the Learn panel: a concrete example straight from the current design. */
export function designNumbers(design: DesignResult) {
  return {
    wetMass: design.mass.wetMassKg,
    dryMass: design.mass.dryMassKg,
    propellant: design.mass.propellantKg,
    massMargin: design.mass.massMargin,
    capacity: design.mass.launcherCapacityKg,
    c3: design.orbit.c3,
    requiredDv: design.orbit.requiredDvMS,
    availableDv: design.orbit.availableDvMS,
    solarFlux: design.power.solarFluxTargetWM2,
    scienceLoad: design.power.modes.science.loadW,
    scienceGen: design.power.modes.science.generatedW,
    dataRate: design.comms.dataRateKbps,
    sentGb: design.comms.sentTotalGb,
    lostGb: design.comms.lostTotalGb,
    totalCost: design.cost.totalM,
    budget: design.cost.budgetM,
    science: design.science.raw,
    tierScience: design.tier.minScience,
  };
}
