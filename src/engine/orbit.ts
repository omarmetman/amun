import type { Launcher, MissionTarget, PropulsionSystem, TransferType } from '../data/types';
import type { LaunchWindow, OrbitBreakdown, OrbitSolution } from './model';
import { AU_M, MU_SUN, YEAR_DAYS } from './constants';

/** Δv to move between circular orbits, useful in explanations. */
export function hohmannDeltaV(r1AU: number, r2AU: number): number {
  if (r1AU <= 0 || r2AU <= 0) return 0;
  const v1 = Math.sqrt(MU_SUN / (r1AU * AU_M));
  const v2 = Math.sqrt(MU_SUN / (r2AU * AU_M));
  const a = ((r1AU + r2AU) / 2) * AU_M;
  const vPeri = Math.sqrt(MU_SUN * (2 / (r1AU * AU_M) - 1 / a));
  const vApo = Math.sqrt(MU_SUN * (2 / (r2AU * AU_M) - 1 / a));
  return Math.abs(vPeri - v1) + Math.abs(v2 - vApo);
}

/**
 * Hohmann departure energy from Earth's orbit to the target's mean heliocentric
 * distance. C3 = v_infinity². Returned in km²/s².
 */
export function hohmannC3(r2AU: number): number {
  const r1 = 1;
  const r2 = Math.max(0.05, r2AU);
  const a = (r1 + r2) / 2;
  const vTrans = Math.sqrt(MU_SUN * (2 / (r1 * AU_M) - 1 / (a * AU_M))) / 1000;
  const vEarth = Math.sqrt(MU_SUN / AU_M) / 1000;
  return Math.max(0, (vTrans - vEarth) ** 2);
}

/** Time from Earth to aphelion of the transfer ellipse, days. */
export function hohmannTransferDays(r2AU: number): number {
  const r1 = 1;
  const a = (r1 + Math.max(0.05, r2AU)) / 2;
  const years = 0.5 * Math.sqrt(a ** 3);
  return years * YEAR_DAYS;
}

export function synodicPeriodYears(periodYears: number): number {
  if (!Number.isFinite(periodYears) || periodYears <= 0) return 1;
  const inverse = Math.abs(1 - 1 / periodYears);
  if (inverse < 1e-6) return 100;
  return 1 / inverse;
}

const WINDOW_PENALTIES = [0, 0.06, 0.13, 0.22];
const REFERENCE_NOW = Date.UTC(2026, 10, 12);

/**
 * Approximate launch windows derived from the synodic period. Dates are
 * deliberately coarse (real windows need numerical trajectory optimisation);
 * the penalty grows as the selected opportunity drifts away from the anchor.
 */
export function computeLaunchWindows(target: MissionTarget, count = 4): LaunchWindow[] {
  const synodic = Math.max(0.08, synodicPeriodYears(target.orbitalPeriodYears));
  const periodDays = target.kind === 'moon' ? 29.53 : synodic * YEAR_DAYS;
  const anchor = Date.parse(`${target.windowAnchor}T00:00:00Z`);
  const base = Number.isFinite(anchor) ? anchor : REFERENCE_NOW;
  let first = base;
  if (!Number.isFinite(first)) first = REFERENCE_NOW;
  // Keep windows in the future relative to the snapshot epoch.
  const periodMs = Math.max(1, periodDays) * 86400000;
  while (first < REFERENCE_NOW) first += periodMs;
  const windows: LaunchWindow[] = [];
  for (let i = 0; i < count; i += 1) {
    const date = new Date(first + i * periodMs);
    const dateISO = date.toISOString().slice(0, 10);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    windows.push({
      id: `${target.id}-w${i + 1}-${dateISO}`,
      dateISO,
      year,
      penalty: WINDOW_PENALTIES[Math.min(i, WINDOW_PENALTIES.length - 1)],
      synodicYears: synodic,
      label: {
        ar: `نافذة ${year}-${month}`,
        en: `Window ${year}-${month}`,
      },
    });
  }
  return windows;
}

/** Linear interpolation of the launcher payload table, kg at a given C3. */
export function payloadCapacityAtC3(launcher: Launcher, c3: number): number {
  const table = [...launcher.payloadAtC3].sort((a, b) => a.c3 - b.c3);
  if (table.length === 0) return 0;
  if (c3 <= table[0].c3) return table[0].kg;
  const last = table[table.length - 1];
  if (c3 >= last.c3) return c3 > last.c3 + 1e-9 ? 0 : last.kg;
  for (let i = 1; i < table.length; i += 1) {
    const lo = table[i - 1];
    const hi = table[i];
    if (c3 <= hi.c3) {
      const t = (c3 - lo.c3) / (hi.c3 - lo.c3);
      return lo.kg + t * (hi.kg - lo.kg);
    }
  }
  return last.kg;
}

export interface OrbitInput {
  target: MissionTarget;
  missionTypeId: 'flyby' | 'orbiter' | 'lander' | 'rendezvous' | 'sampleReturn';
  transferType: TransferType;
  window: LaunchWindow;
  propulsion: PropulsionSystem;
  requiresCapture: boolean;
  requiresLanding: boolean;
  requiresSampleReturn: boolean;
}

const TRANSFER_C3_FACTOR: Record<TransferType, number> = {
  hohmann: 1,
  fast: 1.9,
  assist: 0.55,
};

const TRANSFER_TIME_FACTOR: Record<TransferType, number> = {
  hohmann: 1,
  fast: 0.72,
  assist: 1.45,
};

const TRANSFER_DV_FACTOR: Record<TransferType, number> = {
  hohmann: 1,
  fast: 1.15,
  assist: 1.02,
};

/**
 * Preliminary Δv budget. It intentionally covers the dominant terms rather
 * than a full trajectory optimisation:
 * TCM + plane change + capture + landing + proximity + return leg.
 */
export function computeOrbit(input: OrbitInput): OrbitSolution {
  const { target, transferType, window, propulsion } = input;
  const isMoon = target.kind === 'moon';
  const r2 = isMoon ? 1 : target.semiMajorAxisAU;
  const c3Base = isMoon ? 0.5 : hohmannC3(r2);
  const c3 = Math.max(0, c3Base * TRANSFER_C3_FACTOR[transferType] * (1 + window.penalty));

  const baseDays = isMoon ? 3.4 : hohmannTransferDays(r2);
  const transferDays = baseDays * TRANSFER_TIME_FACTOR[transferType] * propulsion.tripTimeFactor;

  const tcmBase = isMoon ? 25 : 20 + Math.min(130, Math.max(0, r2 - 1) * 16);
  const tcm = tcmBase * (transferType === 'fast' ? 1.35 : transferType === 'assist' ? 1.18 : 1);

  // Plane change is expensive: Δv ≈ 2 v sin(i/2). The share factor reflects
  // that launch geometry can remove part of the penalty; it is game-simplified.
  const vTarget = Math.sqrt(MU_SUN / (r2 * AU_M)) / 1000;
  const planeShare = input.missionTypeId === 'flyby' ? 0.06 : 0.28;
  const planeChange =
    2 * vTarget * Math.sin((Math.min(179.5, target.inclinationDeg) * Math.PI) / 180 / 2) *
    planeShare *
    1000;

  const insertion = input.requiresCapture ? target.captureDvMS : 0;
  const landing = input.requiresLanding && target.landingCapable ? target.landingDvMS : 0;
  const proximity = input.missionTypeId === 'rendezvous' ? 150 : 0;
  const returnLeg =
    input.requiresSampleReturn && target.sampleReturnCapable ? target.returnDvMS : 0;

  const breakdown: OrbitBreakdown = {
    tcm,
    planeChange,
    insertion,
    landing,
    proximity,
    returnLeg,
  };
  const subtotal = tcm + planeChange + insertion + landing + proximity + returnLeg;
  const requiredDvMS = subtotal * TRANSFER_DV_FACTOR[transferType] * (1 + window.penalty * 0.6);

  return {
    c3: Number(c3.toFixed(2)),
    transferDays: Number(transferDays.toFixed(1)),
    transferYears: transferDays / YEAR_DAYS,
    requiredDvMS: Number(requiredDvMS.toFixed(1)),
    breakdown,
    availableDvMS: 0,
    dvMargin: 0,
    window,
    windowPenalty: window.penalty,
    transferTypeMultiplier: TRANSFER_C3_FACTOR[transferType],
  };
}

export function attachAvailableDv(orbit: OrbitSolution, availableDvMS: number): OrbitSolution {
  return {
    ...orbit,
    availableDvMS,
    dvMargin: orbit.requiredDvMS > 0 ? (availableDvMS - orbit.requiredDvMS) / orbit.requiredDvMS : 0,
  };
}

/** Approximate low-orbit period around a target, used for eclipse budgeting. */
export function estimateOrbitPeriodHours(target: MissionTarget): number {
  const radiusKm = Math.max(0.2, target.diameterKm / 2);
  const altitudeKm =
    target.kind === 'gasGiant'
      ? 5000
      : target.kind === 'moon' || target.kind === 'planet'
        ? 300
        : 1;
  const orbitRadiusM = (radiusKm + altitudeKm) * 1000;
  const radiusBodyM = radiusKm * 1000;
  const gm = target.gravityMS2 * radiusBodyM ** 2;
  if (!Number.isFinite(gm) || gm <= 0) return 24;
  const periodSeconds = 2 * Math.PI * Math.sqrt(orbitRadiusM ** 3 / gm);
  return periodSeconds / 3600;
}
