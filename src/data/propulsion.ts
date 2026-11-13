import type { PropulsionSystem } from './types';

/**
 * Propulsion records. Isp values are textbook/published approximations and are
 * labelled as game-simplified in the UI because real engines vary by design.
 */
export const PROPULSION: PropulsionSystem[] = [
  {
    id: 'biprop',
    name: { ar: 'ثنائي الوقود (Bipropellant)', en: 'Bipropellant' },
    ispS: 320,
    dryMassKg: 120,
    costM: 35,
    powerW: 15,
    tankFraction: 0.06,
    tripTimeFactor: 1,
    reliability: 0.99,
    description: {
      ar: 'دفع كيميائي ناضج بكفاءة جيدة (Isp ≈ 320 ث). التوازن الافتراضي بين الكتلة والزمن.',
      en: 'Mature chemical propulsion with good efficiency (Isp ≈ 320 s). The default mass/time trade-off.',
    },
  },
  {
    id: 'monoprop',
    name: { ar: 'أحادي الوقود (Monopropellant)', en: 'Monopropellant' },
    ispS: 220,
    dryMassKg: 55,
    costM: 18,
    powerW: 8,
    tankFraction: 0.05,
    tripTimeFactor: 1.05,
    reliability: 0.985,
    description: {
      ar: 'نظام بسيط ورخيص وخفيف، لكن كفاءته منخفضة (Isp ≈ 220 ث) فيحتاج وقودًا أكثر.',
      en: 'Simple, cheap and light, but inefficient (Isp ≈ 220 s), so it needs more propellant.',
    },
  },
  {
    id: 'ion',
    name: { ar: 'دفع أيوني (Ion)', en: 'Ion Propulsion' },
    ispS: 3000,
    dryMassKg: 140,
    costM: 55,
    powerW: 1200,
    tankFraction: 0.08,
    tripTimeFactor: 1.6,
    reliability: 0.98,
    description: {
      ar: 'كفاءة استثنائية (Isp ≈ 3000 ث) لكنه يستهلك ≈ 1200 واط ويطيل الرحلة. رائع إن توفرت الطاقة.',
      en: 'Exceptional efficiency (Isp ≈ 3000 s) but draws ≈ 1200 W and lengthens the trip. Great when power is available.',
    },
  },
];

export const propulsionById = Object.fromEntries(
  PROPULSION.map((p) => [p.id, p]),
) as Record<string, PropulsionSystem>;
