import type { Antenna, GroundStation } from './types';

/**
 * Communications hardware. Diameters and DSN station classes are real; masses,
 * costs and the link budget coefficients are simplified for gameplay.
 */
export const ANTENNAS: Antenna[] = [
  {
    id: 'lga',
    name: { ar: 'هوائي منخفض الكسب (LGA)', en: 'Low-Gain Antenna (LGA)' },
    diameterM: 1.5,
    massKg: 3,
    costM: 5,
    description: {
      ar: 'هوائي صغير موثوق للاتصال المنخفض المعدل. يعمل حتى لو فقدت المركبة توجيهها.',
      en: 'A small, robust antenna for low-rate links. Works even after attitude loss.',
    },
  },
  {
    id: 'mga',
    name: { ar: 'هوائي متوسط الكسب (MGA)', en: 'Medium-Gain Antenna (MGA)' },
    diameterM: 2.5,
    massKg: 8,
    costM: 20,
    description: {
      ar: 'توازن جيد بين الكتلة ومعدل البيانات، المناسب للمدار والعمليات العلمية.',
      en: 'A good mass/data-rate balance for orbital and science operations.',
    },
  },
  {
    id: 'hga',
    name: { ar: 'هوائي عالي الكسب (HGA)', en: 'High-Gain Antenna (HGA)' },
    diameterM: 4,
    massKg: 25,
    costM: 60,
    description: {
      ar: 'معدل بيانات عالٍ حتى من مسافات كبيرة، لكنه أثقل ويحتاج توجيهًا دقيقًا.',
      en: 'High data rates even from large distances, but heavier and requiring precise pointing.',
    },
  },
];

export const antennaById = Object.fromEntries(ANTENNAS.map((a) => [a.id, a])) as Record<string, Antenna>;

export const GROUND_STATIONS: GroundStation[] = [
  {
    id: 'dsn34',
    name: { ar: 'DSN هوائي 34 م', en: 'DSN 34 m' },
    diameterM: 34,
    gainFactor: 1,
    linkHoursPerDay: 8,
    costPerHourM: 0.008,
    description: {
      ar: 'المحطة القياسية للشبكة العميقة. توفر عادةً 8 ساعات اتصال يوميًا مع مشاركة الجدولة.',
      en: 'The standard Deep Space Network station, typically providing 8 link hours per day under sharing.',
    },
  },
  {
    id: 'dsn70',
    name: { ar: 'DSN هوائي 70 م', en: 'DSN 70 m' },
    diameterM: 70,
    gainFactor: 4.2,
    linkHoursPerDay: 8,
    costPerHourM: 0.02,
    description: {
      ar: 'هوائي عملاق يرفع الكسب ×4.2، لكنه مطلوب بشدة وأكثر كلفة.',
      en: 'A giant dish with 4.2× gain, but heavily oversubscribed and more expensive.',
    },
  },
];

export const groundStationById = Object.fromEntries(
  GROUND_STATIONS.map((g) => [g.id, g]),
) as Record<string, GroundStation>;

/** Reference link rate calibrated loosely on MRO-class X-band downlink. */
export const REFERENCE_RATE_KBPS = 4000;
export const REFERENCE_TX_W = 100;
export const REFERENCE_DIAMETER_M = 3;
export const REFERENCE_RANGE_AU = 0.5;
export const KA_BAND_GAIN = 4;
export const SCIENCE_HOURS_PER_DAY = 6;
export const DATA_MIN_KBPS = 1;
export const MEMORY_LOSS_WARNING_GB = 0.05;
