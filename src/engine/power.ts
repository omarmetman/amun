import type { Bus, Instrument, MissionTarget, PropulsionSystem, Redundancy } from '../data/types';
import {
  BATTERY_DEPTH_OF_DISCHARGE,
  BATTERY_WH_PER_KG,
  COMMS_TX_DC_FACTOR,
  ECLIPSE_FRACTION,
  ION_CRUISE_POWER_W,
  RTG_BOL_W,
  RTG_DECAY_PER_YEAR,
  SOLAR_CONSTANT_W_M2,
  SOLAR_DEGRADATION_PER_YEAR,
  SOLAR_EFFICIENCY,
  SOLAR_PACKING_FACTOR,
} from '../data/power';
import type { PowerSolution } from './model';
import { estimateOrbitPeriodHours } from './orbit';
import { YEAR_DAYS } from './constants';

/** Inverse-square solar flux: S = 1361 / r² W/m². */
export function solarFlux(distanceAU: number): number {
  if (!Number.isFinite(distanceAU) || distanceAU <= 0) return 0;
  return SOLAR_CONSTANT_W_M2 / distanceAU ** 2;
}

/** Array output after efficiency, packing and annual degradation. */
export function solarArrayPower(areaM2: number, distanceAU: number, years: number): number {
  const flux = solarFlux(distanceAU);
  const degradation = (1 - SOLAR_DEGRADATION_PER_YEAR) ** Math.max(0, years);
  return Math.max(
    0,
    areaM2 * flux * SOLAR_EFFICIENCY * degradation * SOLAR_PACKING_FACTOR,
  );
}

export function rtgPower(count: number, years: number): number {
  if (count <= 0) return 0;
  return count * RTG_BOL_W * (1 - RTG_DECAY_PER_YEAR) ** Math.max(0, years);
}

export function batteryCapacityWh(kg: number): number {
  return Math.max(0, kg) * BATTERY_WH_PER_KG;
}

export interface PowerInput {
  target: MissionTarget;
  bus: Bus;
  propulsion: PropulsionSystem;
  instruments: Instrument[];
  txPowerW: number;
  redundancy: Redundancy;
  radHard: boolean;
  solarAreaM2: number;
  rtgCount: number;
  batteryKg: number;
  transferDays: number;
  opsDays: number;
  missionTypeId: 'flyby' | 'orbiter' | 'lander' | 'rendezvous' | 'sampleReturn';
}

const redundancyPower = (r: Redundancy): number =>
  r === 'dualFault' ? 12 : r === 'singleFault' ? 5 : 0;

export function computePower(input: PowerInput): PowerSolution {
  const {
    target,
    bus,
    propulsion,
    instruments,
    txPowerW,
    redundancy,
    radHard,
    solarAreaM2,
    rtgCount,
    batteryKg,
    transferDays,
    opsDays,
    missionTypeId,
  } = input;

  const years = (transferDays + opsDays) / YEAR_DAYS;
  const cruiseAU = Math.max(0.05, (1 + target.sunDistanceAU) / 2);
  const targetAU = Math.max(0.05, target.sunDistanceAU);
  const fluxCruise = solarFlux(cruiseAU);
  const fluxTarget = solarFlux(targetAU);
  const solarCruise = solarArrayPower(solarAreaM2, cruiseAU, years);
  const solarTarget = solarArrayPower(solarAreaM2, targetAU, years);
  const rtg = rtgPower(rtgCount, years);

  const instrPower = instruments.reduce((sum, instrument) => sum + instrument.powerW, 0);
  const redPower = redundancyPower(redundancy);
  const radPower = radHard ? 8 : 0;
  const commsScienceDc = 8 + txPowerW * COMMS_TX_DC_FACTOR;
  const commsCruiseDc = 6 + txPowerW * 0.4;
  const commsSafeDc = 4;

  const ionExtra = propulsion.id === 'ion' ? ION_CRUISE_POWER_W : 0;
  const cruiseLoad = bus.basePowerW + propulsion.powerW + ionExtra + commsCruiseDc + redPower + radPower;
  const scienceLoad = bus.basePowerW + instrPower + commsScienceDc + 5 + redPower + radPower;
  const safeLoad = bus.basePowerW * 0.55 + commsSafeDc + 4 + redPower * 0.5 + radPower * 0.5;

  const cruiseGen = solarCruise + rtg;
  const targetGen = solarTarget + rtg;

  const margin = (generated: number, load: number): number =>
    load > 0 ? (generated - load) / load : 0;

  const orbitPeriodHours = estimateOrbitPeriodHours(target);
  const isSurfaceMission = missionTypeId === 'lander' || missionTypeId === 'sampleReturn';
  const isOrbitalMission = missionTypeId === 'orbiter' || missionTypeId === 'rendezvous';
  const eclipseHours = isOrbitalMission
    ? orbitPeriodHours * ECLIPSE_FRACTION
    : isSurfaceMission
      ? 10
      : 0;
  const batteryRequiredWh =
    eclipseHours > 0 ? Math.max(0, scienceLoad - rtg) * eclipseHours / BATTERY_DEPTH_OF_DISCHARGE : 0;
  const capacityWh = batteryCapacityWh(batteryKg);

  return {
    solarFluxCruiseWM2: fluxCruise,
    solarFluxTargetWM2: fluxTarget,
    solarGeneratedCruiseW: solarCruise,
    solarGeneratedTargetW: solarTarget,
    rtgGeneratedW: rtg,
    batteryCapacityWh: capacityWh,
    batteryRequiredWh,
    eclipseHours,
    orbitPeriodHours,
    years,
    modes: {
      cruise: { loadW: cruiseLoad, generatedW: cruiseGen, margin: margin(cruiseGen, cruiseLoad) },
      science: {
        loadW: scienceLoad,
        generatedW: targetGen,
        margin: margin(targetGen, scienceLoad),
      },
      safe: { loadW: safeLoad, generatedW: targetGen, margin: margin(targetGen, safeLoad) },
    },
    solarAreaM2,
    rtgCount,
    batteryKg,
    solarMassKg: solarAreaM2 * 2.5,
    rtgMassKg: rtgCount * 45,
    batteryMassKg: batteryKg,
    powerMassKg: solarAreaM2 * 2.5 + rtgCount * 45 + batteryKg,
    powerCostM: solarAreaM2 * 2 + rtgCount * 75 + batteryKg * 0.35,
  };
}
