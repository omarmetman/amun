import type { Bus } from './types';

export const BUSES: Bus[] = [
  {
    id: 'small',
    name: { ar: 'منصة صغيرة', en: 'Small Bus' },
    dryMassKg: 180,
    basePowerW: 45,
    costM: 45,
    payloadCapacityKg: 60,
    storageGb: 8,
    reliability: 0.97,
    description: {
      ar: 'خفيفة ورخيصة، مناسبة للعبور أو مهمة كويكب بسيطة. سعة الحمولة والذاكرة محدودتان.',
      en: 'Light and affordable, suited to a flyby or a simple asteroid mission. Payload and storage are limited.',
    },
  },
  {
    id: 'medium',
    name: { ar: 'منصة متوسطة', en: 'Medium Bus' },
    dryMassKg: 450,
    basePowerW: 90,
    costM: 110,
    payloadCapacityKg: 180,
    storageGb: 32,
    reliability: 0.982,
    description: {
      ar: 'الخيار المتوازن: حمولة علمية جيدة وطاقة وذاكرة كافيتان لمهمة مدارية.',
      en: 'The balanced choice: solid payload capacity, power and storage for an orbital mission.',
    },
  },
  {
    id: 'large',
    name: { ar: 'منصة كبيرة', en: 'Large Bus' },
    dryMassKg: 900,
    basePowerW: 160,
    costM: 220,
    payloadCapacityKg: 400,
    storageGb: 96,
    reliability: 0.99,
    description: {
      ar: 'منصة مهام رئيسية: حمولة ضخمة وذاكرة واسعة، لكن كتلتها وكلفتها تستهلكان الصاروخ والميزانية.',
      en: 'A flagship bus: huge payload and storage, but its mass and cost consume launcher capacity and budget.',
    },
  },
];

export const busById = Object.fromEntries(BUSES.map((b) => [b.id, b])) as Record<string, Bus>;
