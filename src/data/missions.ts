import type { MissionType, SuccessTier, DifficultyConfig } from './types';

export const MISSION_TYPES: MissionType[] = [
  {
    id: 'flyby',
    name: { ar: 'عبور سريع', en: 'Flyby' },
    short: { ar: 'عبور', en: 'Flyby' },
    description: {
      ar: 'المرور بجانب الهدف لالتقاط صور وقياسات لفترة قصيرة. الأرخص والأقل تعقيدًا، لكن العائد العلمي محدود.',
      en: 'Swing past the target for a short observation window. Cheapest and least complex, with limited science return.',
    },
    scienceMultiplier: 0.72,
    dataMultiplier: 0.55,
    complexity: 0.6,
    requiresLanding: false,
    requiresSampleReturn: false,
    requiresCapture: false,
    icon: 'wind',
  },
  {
    id: 'orbiter',
    name: { ar: 'مدارية', en: 'Orbiter' },
    short: { ar: 'مدار', en: 'Orbiter' },
    description: {
      ar: 'الالتقاط في مدار حول الهدف ودراسته على المدى الطويل. توازن جيد بين العلم والتكلفة.',
      en: 'Capture into orbit and study the target over time. A strong balance of science and cost.',
    },
    scienceMultiplier: 1.0,
    dataMultiplier: 1.0,
    complexity: 1.0,
    requiresLanding: false,
    requiresSampleReturn: false,
    requiresCapture: true,
    icon: 'orbit',
  },
  {
    id: 'lander',
    name: { ar: 'هبوط', en: 'Lander' },
    short: { ar: 'هبوط', en: 'Lander' },
    description: {
      ar: 'الهبوط على السطح وإجراء قياسات مباشرة. علم أعلى، لكن الهبوط يستهلك دلتا-في ويكشف المركبة للمخاطر.',
      en: 'Touch down and measure the surface in situ. More science, but landing costs Δv and exposes the vehicle to risk.',
    },
    scienceMultiplier: 1.15,
    dataMultiplier: 0.85,
    complexity: 1.2,
    requiresLanding: true,
    requiresSampleReturn: false,
    requiresCapture: true,
    icon: 'drill',
  },
  {
    id: 'rendezvous',
    name: { ar: 'لقاء مع جرم صغير', en: 'Small-body Rendezvous' },
    short: { ar: 'لقاء', en: 'Rendezvous' },
    description: {
      ar: 'مطابقة مدار جسم صغير والبقاء قريبًا منه. مثالي للمذنبات والكويكبات، ويتطلب مناورة دقيقة.',
      en: 'Match a small body’s orbit and station-keep nearby. Ideal for comets and asteroids, but requires precise manoeuvring.',
    },
    scienceMultiplier: 1.1,
    dataMultiplier: 1.05,
    complexity: 1.15,
    requiresLanding: false,
    requiresSampleReturn: false,
    requiresCapture: true,
    icon: 'target',
  },
  {
    id: 'sampleReturn',
    name: { ar: 'إرجاع عينات', en: 'Sample Return' },
    short: { ar: 'إرجاع', en: 'Sample Return' },
    description: {
      ar: 'جمع عينات وإعادتها إلى الأرض. أعلى قيمة علمية وأعلى تعقيد وكلفة؛ يحتاج كبسولة إرجاع ووقودًا إضافيًا.',
      en: 'Collect material and bring it home. The highest science value and complexity; needs a return capsule and extra propellant.',
    },
    scienceMultiplier: 1.3,
    dataMultiplier: 0.9,
    complexity: 1.35,
    requiresLanding: true,
    requiresSampleReturn: true,
    requiresCapture: true,
    icon: 'package',
  },
];

export const missionTypeById = Object.fromEntries(
  MISSION_TYPES.map((m) => [m.id, m]),
) as Record<MissionType['id'], MissionType>;

export const SUCCESS_TIERS: SuccessTier[] = [
  {
    id: 'minimum',
    name: { ar: 'الحد الأدنى', en: 'Minimum' },
    description: {
      ar: 'إثبات أن المهمة تعمل: علم محدود وبيانات كافية لإثبات التشغيل.',
      en: 'Prove the mission works: modest science and enough data to demonstrate operations.',
    },
    minScience: 20,
    minDataGb: 0.5,
  },
  {
    id: 'basic',
    name: { ar: 'أساسي', en: 'Baseline' },
    description: {
      ar: 'تحقيق الأهداف العلمية الأساسية مع تغطية واسعة للهدف.',
      en: 'Meet the core science goals with broad target coverage.',
    },
    minScience: 40,
    minDataGb: 3,
  },
  {
    id: 'ambitious',
    name: { ar: 'طموح', en: 'Ambitious' },
    description: {
      ar: 'نتائج من الطراز الأول: مسح شامل وبيانات غنية، ويتطلب تصميمًا متوازنًا بلا نقاط ضعف.',
      en: 'Flagship-class results: comprehensive coverage and rich data, requiring a balanced design with no weak spots.',
    },
    minScience: 70,
    minDataGb: 10,
  },
];

export const tierById = Object.fromEntries(SUCCESS_TIERS.map((t) => [t.id, t])) as Record<
  SuccessTier['id'],
  SuccessTier
>;

export const DIFFICULTIES: DifficultyConfig[] = [
  {
    id: 'beginner',
    name: { ar: 'مبتدئ', en: 'Beginner' },
    description: {
      ar: 'ميزانية مريحة، أحداث أقل، وتلميحات كاملة في كل خطوة.',
      en: 'A comfortable budget, fewer random events and full hints at every step.',
    },
    budgetM: 850,
    eventMultiplier: 0.6,
    opsCostPerDayM: 0.35,
    hints: 'full',
    color: 'good',
  },
  {
    id: 'normal',
    name: { ar: 'عادي', en: 'Normal' },
    description: {
      ar: 'الميزانية القياسية وأحداث متوازنة وتلميحات محدودة.',
      en: 'The standard budget, balanced events and limited hints.',
    },
    budgetM: 600,
    eventMultiplier: 1,
    opsCostPerDayM: 0.45,
    hints: 'limited',
    color: 'warn',
  },
  {
    id: 'expert',
    name: { ar: 'خبير', en: 'Expert' },
    description: {
      ar: 'ميزانية ضيقة، أحداث أكثر، ولا تلميحات. كل كيلوغرام وكل واط محسوب.',
      en: 'A tight budget, more events and no hints. Every kilogram and watt counts.',
    },
    budgetM: 420,
    eventMultiplier: 1.4,
    opsCostPerDayM: 0.6,
    hints: 'none',
    color: 'danger',
  },
];

export const difficultyById = Object.fromEntries(
  DIFFICULTIES.map((d) => [d.id, d]),
) as Record<DifficultyConfig['id'], DifficultyConfig>;
