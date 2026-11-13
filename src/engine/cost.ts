import type {
  Bus,
  CostLine,
  DifficultyConfig,
  GroundStation,
  Instrument,
  Launcher,
  MissionType,
  PropulsionSystem,
} from '../data/types';
import type { CostSolution } from './model';

export interface CostInput {
  bus: Bus;
  instruments: Instrument[];
  propulsion: PropulsionSystem;
  launcher: Launcher;
  missionType: MissionType;
  difficulty: DifficultyConfig;
  ground: GroundStation;
  powerCostM: number;
  commsCostM: number;
  linkHoursPerDay: number;
  opsDays: number;
  reservePercent: number;
  propellantKg: number;
  redundancyCostM: number;
  radHardCostM: number;
}

const FUEL_COST_PER_KG_M = 0.002;

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Full cost roll-up in millions of USD. Reserve is an allocation, not spend. */
export function computeCost(input: CostInput): CostSolution {
  const {
    bus,
    instruments,
    propulsion,
    launcher,
    difficulty,
    ground,
    powerCostM,
    commsCostM,
    linkHoursPerDay,
    opsDays,
    reservePercent,
    propellantKg,
    redundancyCostM,
    radHardCostM,
  } = input;

  const instrumentsCost = instruments.reduce((sum, i) => sum + i.costM, 0);
  const opsCost = difficulty.opsCostPerDayM * opsDays;
  const dsnHours = linkHoursPerDay * opsDays;
  const dsnCost = ground.costPerHourM * dsnHours;
  const propellantCost = propellantKg * FUEL_COST_PER_KG_M;

  const lines: CostLine[] = [
    { id: 'bus', label: { ar: 'المنصة', en: 'Spacecraft bus' }, amountM: round2(bus.costM), color: '#4f7cff' },
    {
      id: 'instruments',
      label: { ar: 'الأجهزة العلمية', en: 'Science instruments' },
      amountM: round2(instrumentsCost),
      color: '#6b93ff',
      simplified: true,
    },
    {
      id: 'power',
      label: { ar: 'منظومة الطاقة', en: 'Power system' },
      amountM: round2(powerCostM),
      color: '#e8b949',
      simplified: true,
    },
    {
      id: 'comms',
      label: { ar: 'الاتصالات', en: 'Communications' },
      amountM: round2(commsCostM),
      color: '#38d6a4',
      simplified: true,
    },
    {
      id: 'propulsion',
      label: { ar: 'نظام الدفع', en: 'Propulsion' },
      amountM: round2(propulsion.costM),
      color: '#f4d58a',
      simplified: true,
    },
    {
      id: 'launch',
      label: { ar: `الإطلاق (${launcher.name.ar})`, en: `Launch (${launcher.name.en})` },
      amountM: round2(launcher.costM),
      color: '#93b4ff',
      simplified: true,
    },
    {
      id: 'ops',
      label: { ar: `العمليات (${opsDays} يوم)`, en: `Operations (${opsDays} days)` },
      amountM: round2(opsCost),
      color: '#ffc857',
      simplified: true,
    },
    {
      id: 'dsn',
      label: { ar: 'وقت الشبكة العميقة', en: 'Deep Space Network time' },
      amountM: round2(dsnCost),
      color: '#a8b3d6',
      simplified: true,
    },
    {
      id: 'redundancy',
      label: { ar: 'التكرار الوقائي', en: 'Redundancy' },
      amountM: round2(redundancyCostM),
      color: '#c084fc',
      simplified: true,
    },
    {
      id: 'radhard',
      label: { ar: 'إلكترونيات مقاومة للإشعاع', en: 'Radiation hardening' },
      amountM: round2(radHardCostM),
      color: '#f472b6',
      simplified: true,
    },
    {
      id: 'fuel',
      label: { ar: 'الوقود', en: 'Propellant' },
      amountM: round2(propellantCost),
      color: '#64748b',
      simplified: true,
    },
  ].filter((line) => line.amountM > 0);

  const subtotal = lines.reduce((sum, line) => sum + line.amountM, 0);
  const reserve = subtotal * (Math.max(0, reservePercent) / 100);
  const total = subtotal + reserve;
  const budget = difficulty.budgetM;
  const remaining = budget - total;

  if (reserve > 0) {
    lines.push({
      id: 'reserve',
      label: { ar: `احتياطي الميزانية (${reservePercent}%)`, en: `Budget reserve (${reservePercent}%)` },
      amountM: round2(reserve),
      color: '#d4a02e',
      simplified: true,
    });
  }

  return {
    lines,
    subtotalM: round2(subtotal),
    reserveM: round2(reserve),
    totalM: round2(total),
    budgetM: budget,
    remainingM: round2(remaining),
    reservePercent,
    opsDays,
    dsnHours,
    launchCostM: launcher.costM,
    propellantCostM: round2(propellantCost),
  };
}

export const missionOpsNote = (mission: MissionType) =>
  mission.id === 'flyby' ? 0.7 : mission.id === 'sampleReturn' ? 1.2 : 1;
