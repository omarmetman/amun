import { describe, expect, it } from 'vitest';
import type { DesignChoices } from '../data/types';
import { deriveDesign } from './derive';
import { deltaVFromPropellant, solveMassBudget, solvePropellantMass } from './rocket';
import { solarArrayPower, solarFlux } from './power';
import { dataRateKbps } from './comms';
import { attachAvailableDv, hohmannC3, hohmannTransferDays, payloadCapacityAtC3 } from './orbit';
import { computeScore } from './score';
import { runSimulation } from './simulate';
import { launcherById } from '../data/launchers';

const baseChoices: DesignChoices = {
  difficulty: 'normal',
  language: 'ar',
  seed: 'AMUN2026',
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
};

const fixedDate = '2026-11-12T00:00:00.000Z';

describe('rocket equation', () => {
  it('solves propellant mass in closed form and inverts back to the requested Δv', () => {
    const solution = solvePropellantMass(1000, 1500, 320, 0.06);
    expect(solution.feasible).toBe(true);
    expect(solution.propellantKg).toBeGreaterThan(0);
    expect(deltaVFromPropellant(1000, solution.propellantKg, 320, 0.06)).toBeCloseTo(1500, 6);
  });

  it('applies the propellant reserve as extra Δv and keeps the mass budget consistent', () => {
    const result = solveMassBudget({
      baseDryMassKg: 1000,
      ispS: 320,
      tankFraction: 0.06,
      requiredDvMS: 1500,
      propellantReservePercent: 15,
      launcherCapacityKg: 50000,
    });
    expect(result.equationClosed).toBe(true);
    expect(result.propellantLimited).toBe(false);
    expect(result.availableDvMS).toBeCloseTo(1500 * 1.15, 5);
    expect(result.wetMassKg).toBeCloseTo(
      result.baseDryMassKg + result.propellantKg + result.tankMassKg,
      6,
    );
    expect(result.massMargin).toBeGreaterThan(0);
  });

  it('flags a capacity-limited propellant load instead of pretending the Δv exists', () => {
    const result = solveMassBudget({
      baseDryMassKg: 1000,
      ispS: 320,
      tankFraction: 0.1,
      requiredDvMS: 1500,
      propellantReservePercent: 15,
      launcherCapacityKg: 1200,
    });
    expect(result.propellantLimited).toBe(true);
    expect(result.wetMassKg).toBeLessThanOrEqual(1200 + 1e-6);
    expect(result.availableDvMS).toBeLessThan(1500);
  });

  it('rejects an unreachable mass ratio', () => {
    const impossible = solvePropellantMass(1000, 100000, 300, 0.1);
    expect(impossible.feasible).toBe(false);
    expect(Number.isFinite(impossible.propellantKg)).toBe(false);
  });
});

describe('solar flux and array degradation', () => {
  it('follows S = 1361 / r²', () => {
    expect(solarFlux(1)).toBe(1361);
    expect(solarFlux(2)).toBeCloseTo(1361 / 4, 9);
    expect(solarFlux(5.2)).toBeCloseTo(1361 / 5.2 ** 2, 9);
  });

  it('reduces array output with age at a fixed distance', () => {
    const beginningOfLife = solarArrayPower(10, 1, 0);
    const afterTenYears = solarArrayPower(10, 1, 10);
    expect(beginningOfLife).toBeCloseTo(10 * 1361 * 0.28 * 0.9, 6);
    expect(afterTenYears).toBeLessThan(beginningOfLife);
    expect(afterTenYears / beginningOfLife).toBeCloseTo(0.975 ** 10, 6);
  });
});

describe('downlink rate versus distance', () => {
  it('falls with the square of range and rises with Ka-band gain', () => {
    const atOneAu = dataRateKbps(50, 2.5, 'X', 1, 1);
    const atTwoAu = dataRateKbps(50, 2.5, 'X', 2, 1);
    expect(atTwoAu).toBeCloseTo(atOneAu / 4, 6);
    expect(dataRateKbps(50, 2.5, 'Ka', 2, 1)).toBeCloseTo(atTwoAu * 16, 6);
    expect(dataRateKbps(50, 2.5, 'X', 5.2, 1)).toBeLessThan(atTwoAu);
  });

  it('scales with antenna diameter squared and transmit power', () => {
    const baseline = dataRateKbps(50, 2, 'X', 2, 1);
    expect(dataRateKbps(100, 2, 'X', 2, 1)).toBeCloseTo(baseline * 2, 6);
    expect(dataRateKbps(50, 4, 'X', 2, 1)).toBeCloseTo(baseline * 4, 6);
    expect(dataRateKbps(50, 2, 'X', 2, 4.2)).toBeCloseTo(baseline * 4.2, 6);
  });
});

describe('Hohmann transfer and Δv budget', () => {
  it('returns the half-period for an Earth–Mars transfer', () => {
    const days = hohmannTransferDays(1.524);
    expect(days).toBeGreaterThan(250);
    expect(days).toBeLessThan(270);
    expect(hohmannC3(1.524)).toBeGreaterThan(7);
    expect(hohmannC3(1.524)).toBeLessThan(10);
  });

  it('computes required Δv and derives margin against available Δv', () => {
    const design = deriveDesign(baseChoices);
    expect(design.orbit.requiredDvMS).toBeGreaterThan(0);
    const attached = attachAvailableDv(design.orbit, design.orbit.requiredDvMS * 1.2);
    expect(attached.dvMargin).toBeCloseTo(0.2, 9);
    const shortfall = attachAvailableDv(design.orbit, design.orbit.requiredDvMS * 0.9);
    expect(shortfall.dvMargin).toBeLessThan(0);
  });

  it('interpolates launcher capacity downward as C3 grows', () => {
    const launcher = launcherById.pslv;
    const low = payloadCapacityAtC3(launcher, 5);
    const mid = payloadCapacityAtC3(launcher, 10);
    const high = payloadCapacityAtC3(launcher, 40);
    expect(low).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(high);
    expect(mid).toBeCloseTo(1600, 6);
  });
});

describe('cost versus budget', () => {
  it('rolls up subtotal, reserve and remaining budget exactly', () => {
    const design = deriveDesign(baseChoices);
    expect(design.cost.totalM).toBeCloseTo(design.cost.subtotalM + design.cost.reserveM, 1);
    expect(design.cost.remainingM).toBeCloseTo(design.cost.budgetM - design.cost.totalM, 1);
    expect(design.cost.reserveM).toBeCloseTo(
      design.cost.subtotalM * (design.choices.reservePercent / 100),
      0,
    );
    expect(design.cost.lines.reduce((sum, line) => sum + line.amountM, 0)).toBeCloseTo(
      design.cost.totalM,
      0,
    );
  });

  it('blocks an over-budget design and points to the budget step', () => {
    const design = deriveDesign({
      ...baseChoices,
      difficulty: 'expert',
      launcherId: 'falconHeavy',
      opsDays: 180,
    });
    expect(design.cost.totalM).toBeGreaterThan(design.cost.budgetM);
    const issue = design.issues.find((item) => item.code === 'BUDGET_OVER');
    expect(issue?.severity).toBe('error');
    expect(issue?.step).toBe(5);
  });
});

describe('validation contract', () => {
  it('accepts the default mission without blocking errors', () => {
    const design = deriveDesign(baseChoices);
    expect(design.blockingIssues).toHaveLength(0);
  });

  it('blocks a mission with no science instruments', () => {
    const design = deriveDesign({ ...baseChoices, instruments: [] });
    const issue = design.issues.find((item) => item.code === 'NO_INSTRUMENTS');
    expect(issue?.severity).toBe('error');
    expect(issue?.step).toBe(3);
    expect(design.blockingIssues.some((item) => item.code === 'NO_INSTRUMENTS')).toBe(true);
  });

  it('blocks a power deficit in cruise and points to step 6', () => {
    const design = deriveDesign({
      ...baseChoices,
      power: { solarAreaM2: 0, rtgCount: 0, batteryKg: 10 },
    });
    const issues = design.blockingIssues.filter((item) => item.step === 6);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((item) => item.code === 'POWER_CRUISE')).toBe(true);
  });
});

describe('seeded simulation and scoring', () => {
  it('reproduces the same run for the same design and seed', () => {
    const design = deriveDesign(baseChoices);
    const first = runSimulation(design, baseChoices.seed, fixedDate);
    const second = runSimulation(design, baseChoices.seed, fixedDate);
    expect(second).toEqual(first);
    expect(second.runId).toBe(first.runId);
    expect(second.events.map((event) => event.id)).toEqual(first.events.map((event) => event.id));
  });

  it('produces a bounded score whose breakdown sums to the total', () => {
    const design = deriveDesign(baseChoices);
    const simulation = runSimulation(design, baseChoices.seed, fixedDate);
    const score = computeScore(design, simulation, fixedDate);
    const { science, budget, margins, reliability, total } = score.breakdown;
    expect(total).toBeCloseTo(science + budget + margins + reliability, 1);
    expect(total).toBeGreaterThanOrEqual(0);
    expect(total).toBeLessThanOrEqual(100);
    expect(['S', 'A', 'B', 'C', 'D', 'F']).toContain(score.grade);
    expect(score.improvements.length).toBeGreaterThan(0);
    expect(score.tierMet.science).toBe(simulation.scienceAchieved >= design.tier.minScience);
  });
});
