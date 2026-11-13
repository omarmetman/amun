import type { PowerComponent } from './types';

/**
 * Power system constants and components.
 * Solar constant 1361 W/m² is the NASA/TSI mean value. Efficiency, packing and
 * degradation are engineering planning values simplified for gameplay.
 */
export const SOLAR_CONSTANT_W_M2 = 1361;
export const SOLAR_EFFICIENCY = 0.28;
export const SOLAR_DEGRADATION_PER_YEAR = 0.025;
export const SOLAR_PACKING_FACTOR = 0.9;
export const RTG_BOL_W = 290;
export const RTG_DECAY_PER_YEAR = 0.008;
export const BATTERY_WH_PER_KG = 120;
export const BATTERY_DEPTH_OF_DISCHARGE = 0.9;
export const ECLIPSE_FRACTION = 0.35;
export const ION_CRUISE_POWER_W = 1200;
export const COMMS_TX_DC_FACTOR = 2.5;

export const POWER_COMPONENTS: PowerComponent[] = [
  {
    id: 'solar',
    name: { ar: 'ألواح شمسية', en: 'Solar Arrays' },
    massPerUnit: 2.5,
    costPerUnitM: 2,
    unit: 'm²',
    description: {
      ar: 'كتلة ≈ 2.5 كغ/م² وكلفة ≈ 2 مليون دولار/م². الكفاءة 28% مع تدهور 2.5% سنويًا.',
      en: 'About 2.5 kg/m² and $2M/m². 28% efficiency with 2.5% annual degradation.',
    },
    sourceKeys: ['nasaFact', 'game'],
  },
  {
    id: 'rtg',
    name: { ar: 'مولد RTG', en: 'RTG' },
    massPerUnit: 45,
    costPerUnitM: 75,
    unit: 'unit',
    description: {
      ar: '≈ 290 واط في بداية العمر لكل وحدة و45 كغ، مع تدهور 0.8% سنويًا. مكلف لكنه يعمل حيث لا تصل الشمس.',
      en: '≈290 W beginning-of-life per unit at 45 kg, with 0.8% annual decay. Expensive, but works where sunlight is weak.',
    },
    sourceKeys: ['nasaFact', 'game'],
  },
  {
    id: 'battery',
    name: { ar: 'بطارية', en: 'Battery' },
    massPerUnit: 1,
    costPerUnitM: 0.35,
    unit: 'kg',
    description: {
      ar: '≈ 120 واط-ساعة لكل كغ، مع عمق تفريغ مسموح 90% أثناء الكسوف.',
      en: '≈120 Wh/kg, with a 90% allowable depth of discharge during eclipse.',
    },
    sourceKeys: ['game'],
  },
];
