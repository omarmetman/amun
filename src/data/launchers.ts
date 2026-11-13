import type { Launcher } from './types';

/**
 * Launch vehicles.
 * Payload-vs-C3 points are approximate published figures, interpolated
 * linearly by the engine. Treat them as game planning values, not certified
 * performance. Values at C3=80 are extrapolations for high-energy missions.
 */
export const LAUNCHERS: Launcher[] = [
  {
    id: 'electron',
    name: { ar: 'Electron', en: 'Electron' },
    country: 'NZ / USA',
    payloadAtC3: [
      { c3: 0, kg: 300 },
      { c3: 10, kg: 150 },
      { c3: 20, kg: 80 },
      { c3: 40, kg: 25 },
      { c3: 80, kg: 5 },
    ],
    costM: 7.5,
    reliability: 0.93,
    description: {
      ar: 'صاروخ صغير منخفض التكلفة، مناسب للأقمار الصغيرة والحمولات الخفيفة جدًا.',
      en: 'A low-cost small launcher for small satellites and very light payloads.',
    },
    sourceKeys: ['launchApprox'],
  },
  {
    id: 'pslv',
    name: { ar: 'PSLV-XL', en: 'PSLV-XL' },
    country: 'India',
    payloadAtC3: [
      { c3: 0, kg: 2100 },
      { c3: 10, kg: 1600 },
      { c3: 20, kg: 1000 },
      { c3: 40, kg: 480 },
      { c3: 80, kg: 140 },
    ],
    costM: 32,
    reliability: 0.92,
    description: {
      ar: 'صاروخ هندي متوسط الكلفة أثبت قدرته على إرسال مسبار إلى المريخ. صاروخ الاقتصادي للمهام المتوسطة نحو النظام الشمسي الداخلي.',
      en: 'An affordable Indian launcher proven on a Mars mission. A budget-conscious option for medium inner-solar-system payloads.',
    },
    sourceKeys: ['launchApprox'],
  },
  {
    id: 'falcon9',
    name: { ar: 'Falcon 9', en: 'Falcon 9' },
    country: 'USA',
    payloadAtC3: [
      { c3: 0, kg: 22800 },
      { c3: 10, kg: 8000 },
      { c3: 20, kg: 5500 },
      { c3: 40, kg: 3000 },
      { c3: 80, kg: 1200 },
    ],
    costM: 67,
    reliability: 0.98,
    description: {
      ar: 'العامل العالمي: كلفة معتدلة وموثوقية عالية وحمولة جيدة لمعظم أهداف النظام الشمسي الداخلي.',
      en: 'The workhorse: moderate cost, high reliability and good performance to most inner-solar-system targets.',
    },
    sourceKeys: ['launchApprox'],
  },
  {
    id: 'falconHeavy',
    name: { ar: 'Falcon Heavy', en: 'Falcon Heavy' },
    country: 'USA',
    payloadAtC3: [
      { c3: 0, kg: 63800 },
      { c3: 10, kg: 26700 },
      { c3: 20, kg: 16800 },
      { c3: 40, kg: 8000 },
      { c3: 80, kg: 3500 },
    ],
    costM: 150,
    reliability: 0.97,
    description: {
      ar: 'حمولة ثقيلة بكلفة أقل من SLS، مناسبة للمهام المدارية الكبيرة والأجسام الخارجية.',
      en: 'Heavy lift at a fraction of SLS cost, suitable for large orbiters and outer-system targets.',
    },
    sourceKeys: ['launchApprox'],
  },
  {
    id: 'atlas551',
    name: { ar: 'Atlas V 551', en: 'Atlas V 551' },
    country: 'USA',
    payloadAtC3: [
      { c3: 0, kg: 18500 },
      { c3: 10, kg: 8500 },
      { c3: 20, kg: 5700 },
      { c3: 40, kg: 3100 },
      { c3: 80, kg: 1200 },
    ],
    costM: 153,
    reliability: 0.97,
    description: {
      ar: 'صاروخ موثوق بخمسة معززات، استُخدم في مهام ناسا الكوكبية.',
      en: 'A reliable five-booster vehicle used by numerous NASA planetary missions.',
    },
    sourceKeys: ['launchApprox'],
  },
  {
    id: 'vulcan',
    name: { ar: 'Vulcan Centaur', en: 'Vulcan Centaur' },
    country: 'USA',
    payloadAtC3: [
      { c3: 0, kg: 27200 },
      { c3: 10, kg: 12000 },
      { c3: 20, kg: 7500 },
      { c3: 40, kg: 4000 },
      { c3: 80, kg: 1600 },
    ],
    costM: 110,
    reliability: 0.96,
    description: {
      ar: 'خليفة Atlas: أداء جيد وكلفة متوسطة، مع خيار Centaur للمدارات العالية.',
      en: 'Atlas’s successor: strong performance at mid cost, with a high-energy Centaur upper stage.',
    },
    sourceKeys: ['launchApprox'],
  },
  {
    id: 'ariane64',
    name: { ar: 'Ariane 6 (A64)', en: 'Ariane 6 (A64)' },
    country: 'EU',
    payloadAtC3: [
      { c3: 0, kg: 21600 },
      { c3: 10, kg: 10000 },
      { c3: 20, kg: 6500 },
      { c3: 40, kg: 3500 },
      { c3: 80, kg: 1400 },
    ],
    costM: 120,
    reliability: 0.96,
    description: {
      ar: 'الإطلاق الأوروبي الثقيل، بأربعة معززات وإصدار طاقة عالية للمهام البعيدة.',
      en: 'Europe’s heavy-lift option, with four boosters and a high-energy configuration for distant targets.',
    },
    sourceKeys: ['launchApprox'],
  },
  {
    id: 'sls1',
    name: { ar: 'SLS Block 1', en: 'SLS Block 1' },
    country: 'USA',
    payloadAtC3: [
      { c3: 0, kg: 95000 },
      { c3: 10, kg: 40000 },
      { c3: 20, kg: 27000 },
      { c3: 40, kg: 15000 },
      { c3: 80, kg: 6000 },
    ],
    costM: 2200,
    reliability: 0.95,
    description: {
      ar: 'أقوى صاروخ ناسا، لكن كلفته الاستثنائية تبتلع معظم الميزانية. استخدمه فقط لمهمة قصوى.',
      en: 'NASA’s most powerful rocket, but its extraordinary cost consumes most of the budget. Reserve it for a flagship mission.',
    },
    sourceKeys: ['launchApprox'],
  },
];

export const launcherById = Object.fromEntries(
  LAUNCHERS.map((l) => [l.id, l]),
) as Record<string, Launcher>;
