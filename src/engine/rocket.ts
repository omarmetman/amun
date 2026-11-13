/**
 * Rocket equation helpers. All masses are kg, Δv is m/s, Isp is seconds.
 *
 * Closed-form propellant solution with tank fraction k:
 *   m_prop = m_other (e^x − 1) / (1 − k (e^x − 1)),  x = Δv / (Isp g0)
 * The "other" mass is the dry spacecraft *excluding* tank mass. If the
 * denominator is ≤ 0 the required Δv is physically unreachable with that Isp
 * and tank fraction, no matter how much propellant is added.
 */

export const G0 = 9.80665;

export interface PropellantSolution {
  feasible: boolean;
  propellantKg: number;
  expX: number;
  denominator: number;
}

export interface MassBudgetInput {
  baseDryMassKg: number;
  ispS: number;
  tankFraction: number;
  requiredDvMS: number;
  propellantReservePercent: number;
  launcherCapacityKg: number;
}

export interface MassBudgetResult {
  baseDryMassKg: number;
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

export function solvePropellantMass(
  baseDryMassKg: number,
  deltaVMS: number,
  ispS: number,
  tankFraction: number,
): PropellantSolution {
  if (!Number.isFinite(deltaVMS) || deltaVMS <= 0) {
    return { feasible: true, propellantKg: 0, expX: 1, denominator: 1 };
  }
  if (!Number.isFinite(baseDryMassKg) || baseDryMassKg <= 0 || ispS <= 0) {
    return { feasible: false, propellantKg: Number.POSITIVE_INFINITY, expX: Infinity, denominator: -Infinity };
  }
  const x = deltaVMS / (ispS * G0);
  // exp(50) is already absurd for any realistic mission; avoid Infinity.
  if (x > 50) {
    return { feasible: false, propellantKg: Number.POSITIVE_INFINITY, expX: Infinity, denominator: -Infinity };
  }
  const expX = Math.exp(x);
  const denominator = 1 - tankFraction * (expX - 1);
  if (denominator <= 1e-9) {
    return { feasible: false, propellantKg: Number.POSITIVE_INFINITY, expX, denominator };
  }
  const propellantKg = (baseDryMassKg * (expX - 1)) / denominator;
  return { feasible: Number.isFinite(propellantKg), propellantKg, expX, denominator };
}

/** Tsiolkovsky with tank mass included in the burnout mass. */
export function deltaVFromPropellant(
  baseDryMassKg: number,
  propellantKg: number,
  ispS: number,
  tankFraction: number,
): number {
  if (propellantKg <= 0 || baseDryMassKg <= 0 || ispS <= 0) return 0;
  const tank = propellantKg * tankFraction;
  const wet = baseDryMassKg + tank + propellantKg;
  const dry = baseDryMassKg + tank;
  if (dry <= 0 || wet <= dry) return 0;
  return ispS * G0 * Math.log(wet / dry);
}

/** Wet mass required for a Δv, including tank mass. */
export function wetMassForDeltaV(
  baseDryMassKg: number,
  deltaVMS: number,
  ispS: number,
  tankFraction: number,
): number {
  if (baseDryMassKg <= 0 || deltaVMS <= 0) return baseDryMassKg;
  const x = deltaVMS / (ispS * G0);
  const denominator = 1 - tankFraction * (Math.exp(x) - 1);
  if (denominator <= 0) return Number.POSITIVE_INFINITY;
  const propellant = (baseDryMassKg * (Math.exp(x) - 1)) / denominator;
  return baseDryMassKg + propellant * (1 + tankFraction);
}

/** Propellant that can fit under a launcher limit, accounting for tank mass. */
export function propellantForCapacity(
  baseDryMassKg: number,
  capacityKg: number,
  tankFraction: number,
): number {
  return Math.max(0, (capacityKg - baseDryMassKg) / (1 + tankFraction));
}

export function solveMassBudget(input: MassBudgetInput): MassBudgetResult {
  const {
    baseDryMassKg,
    ispS,
    tankFraction,
    requiredDvMS,
    propellantReservePercent,
    launcherCapacityKg,
  } = input;
  const reserveMultiplier = 1 + Math.max(0, propellantReservePercent) / 100;
  const desired = solvePropellantMass(
    baseDryMassKg,
    requiredDvMS * reserveMultiplier,
    ispS,
    tankFraction,
  );
  const maxFuel = propellantForCapacity(baseDryMassKg, launcherCapacityKg, tankFraction);
  const desiredPropellant = desired.feasible ? desired.propellantKg : Number.POSITIVE_INFINITY;
  const propellantKg = Math.min(desiredPropellant, maxFuel);
  const propellantLimited = desired.feasible
    ? desiredPropellant > maxFuel + 1e-6
    : launcherCapacityKg > baseDryMassKg;
  const tankMassKg = propellantKg * tankFraction;
  const dryMassKg = baseDryMassKg + tankMassKg;
  const wetMassKg = dryMassKg + propellantKg;
  const availableDvMS = deltaVFromPropellant(baseDryMassKg, propellantKg, ispS, tankFraction);
  const massMargin =
    launcherCapacityKg > 0 ? (launcherCapacityKg - wetMassKg) / launcherCapacityKg : -1;
  return {
    baseDryMassKg,
    tankMassKg,
    dryMassKg,
    propellantKg: Number.isFinite(propellantKg) ? propellantKg : 0,
    desiredPropellantKg: desiredPropellant,
    wetMassKg,
    launcherCapacityKg,
    massMargin,
    equationClosed: desired.feasible,
    propellantLimited,
    massRatioWetDry: dryMassKg > 0 ? wetMassKg / dryMassKg : 1,
    tankFraction,
    availableDvMS,
  };
}

/** Useful for the mass waterfall and the report. */
export function propellantMassFraction(propellantKg: number, wetMassKg: number): number {
  if (wetMassKg <= 0) return 0;
  return Math.max(0, Math.min(1, propellantKg / wetMassKg));
}
