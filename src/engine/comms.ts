import type {
  Antenna,
  Band,
  Bus,
  GroundStation,
  Instrument,
  MissionTarget,
} from '../data/types';
import {
  KA_BAND_GAIN,
  REFERENCE_DIAMETER_M,
  REFERENCE_RANGE_AU,
  REFERENCE_RATE_KBPS,
  REFERENCE_TX_W,
  SCIENCE_HOURS_PER_DAY,
} from '../data/comms';
import type { CommsSolution } from './model';
import { MAX_LINK_RATE_KBPS } from './constants';

/**
 * Simplified downlink budget:
 * R = R_ref (P/100)(D/3)² (f_ratio)² (0.5/d_AU)² G_ground
 * R_ref ≈ 4000 kbit/s is calibrated loosely on MRO-class X-band downlink.
 * The formula ignores rain, elevation, coding and antenna efficiency, so it is
 * clearly a game planning model rather than a telecom link-budget tool.
 */
export function dataRateKbps(
  txPowerW: number,
  diameterM: number,
  band: Band,
  distanceAU: number,
  groundGain: number,
): number {
  const range = Math.max(0.0005, distanceAU);
  const fRatio = band === 'Ka' ? KA_BAND_GAIN : 1;
  const rate =
    REFERENCE_RATE_KBPS *
    (txPowerW / REFERENCE_TX_W) *
    (diameterM / REFERENCE_DIAMETER_M) ** 2 *
    fRatio ** 2 *
    (REFERENCE_RANGE_AU / range) ** 2 *
    groundGain;
  return Math.max(0, Math.min(MAX_LINK_RATE_KBPS, rate));
}

export interface CommsInput {
  target: MissionTarget;
  missionTypeId: 'flyby' | 'orbiter' | 'lander' | 'rendezvous' | 'sampleReturn';
  dataMultiplier: number;
  instruments: Instrument[];
  antenna: Antenna;
  band: Band;
  txPowerW: number;
  ground: GroundStation;
  bus: Bus;
  powerScienceMargin: number;
  opsDays: number;
}

export function computeComms(input: CommsInput): CommsSolution {
  const {
    target,
    dataMultiplier,
    instruments,
    antenna,
    band,
    txPowerW,
    ground,
    bus,
    powerScienceMargin,
    opsDays,
  } = input;

  const rate = dataRateKbps(txPowerW, antenna.diameterM, band, target.earthDistanceAU, ground.gainFactor);
  const powerFactor = powerScienceMargin < 0 ? 0.35 : powerScienceMargin < 0.1 ? 0.7 : 1;
  const linkHours = ground.linkHoursPerDay * powerFactor;
  const dataPerInstrument = instruments.reduce((sum, i) => sum + i.dataRateKbps, 0);
  // 6 science hours/day, converted kbit → GB (÷8 for bytes, ÷1e6 for GB).
  const producedGbPerDay =
    (dataPerInstrument * SCIENCE_HOURS_PER_DAY * 3600) / 8 / 1e6 * Math.max(0.2, dataMultiplier);
  const downlinkGbPerDay = (rate * linkHours * 3600) / 8 / 1e6;
  const producedTotalGb = producedGbPerDay * Math.max(0, opsDays);
  const capacityTotalGb = downlinkGbPerDay * Math.max(0, opsDays) + bus.storageGb;
  const sentTotalGb = Math.min(producedTotalGb, capacityTotalGb);
  const lostTotalGb = Math.max(0, producedTotalGb - sentTotalGb);
  const linkGain =
    (txPowerW / REFERENCE_TX_W) *
    (antenna.diameterM / REFERENCE_DIAMETER_M) ** 2 *
    (band === 'Ka' ? KA_BAND_GAIN ** 2 : 1) *
    (REFERENCE_RANGE_AU / Math.max(0.0005, target.earthDistanceAU)) ** 2 *
    ground.gainFactor;
  const txDcPowerW = 8 + txPowerW * 2.5;

  return {
    dataRateKbps: rate,
    linkHoursPerDay: linkHours,
    producedGbPerDay,
    downlinkGbPerDay,
    producedTotalGb,
    sentTotalGb,
    lostTotalGb,
    memoryGb: bus.storageGb,
    antennaMassKg: antenna.massKg,
    commsCostM: antenna.costM + (band === 'Ka' ? 15 : 0) + txPowerW * 0.08,
    linkBudgetGain: linkGain,
    distanceAU: target.earthDistanceAU,
    txDcPowerW,
  };
}
