import type { SimulationEventDef } from './types';

/**
 * Random mission events.
 * Probabilities are gameplay base rates; the engine multiplies them by design
 * conditions (power/Δv margins, radiation hardening, redundancy, target type)
 * and by difficulty. Each event links to a Learn-panel topic.
 */
export const EVENTS: SimulationEventDef[] = [
  {
    id: 'solarStorm',
    name: { ar: 'عاصفة شمسية', en: 'Solar Storm' },
    phases: ['cruise', 'operations'],
    severity: 'warning',
    baseProbability: 0.12,
    description: {
      ar: 'انبعاث كتلي إكليلي يزيد الإشعاع ويجبر الأنظمة على الحماية. الإلكترونيات المقاومة للإشعاع تقلل الأثر.',
      en: 'A coronal mass ejection raises radiation and forces protective modes. Rad-hard electronics reduce the impact.',
    },
    learnKey: 'radiation',
    probabilityModifiers: [{ when: 'noRadHard', multiplier: 2.2 }],
    effects: { delayDays: 3, scienceLossPct: 4, safeMode: true },
  },
  {
    id: 'micrometeoroid',
    name: { ar: 'اصطدام بغبار دقيق', en: 'Micrometeoroid Strike' },
    phases: ['cruise', 'operations'],
    severity: 'warning',
    baseProbability: 0.07,
    description: {
      ar: 'جسيم سريع يضرب الهيكل أو الألواح. التكرار يسمح بتحويل الوظائف إلى نظام احتياطي.',
      en: 'A fast particle strikes the structure or arrays. Redundancy allows failing functions to switch to a backup.',
    },
    learnKey: 'redundancy',
    probabilityModifiers: [
      { when: 'comet', multiplier: 2 },
      { when: 'redundancy', multiplier: 0.6 },
    ],
    effects: { delayDays: 2, scienceLossPct: 2 },
  },
  {
    id: 'starTracker',
    name: { ar: 'شذوذ في محدد النجوم', en: 'Star-Tracker Anomaly' },
    phases: ['cruise'],
    severity: 'warning',
    baseProbability: 0.05,
    description: {
      ar: 'فقدان مؤقت للاتجاه المرجعي. يحتاج النظام إلى إعادة اكتساب النجوم قبل استئناف المناورات.',
      en: 'A temporary loss of attitude reference. The spacecraft must reacquire stars before manoeuvring again.',
    },
    learnKey: 'redundancy',
    probabilityModifiers: [{ when: 'redundancy', multiplier: 0.35 }],
    effects: { delayDays: 3, scienceLossPct: 1 },
  },
  {
    id: 'tcmAnomaly',
    name: { ar: 'شذوذ في الدفاعات أثناء TCM', en: 'Thruster Anomaly During TCM' },
    phases: ['cruise', 'arrival'],
    severity: 'error',
    baseProbability: 0.04,
    description: {
      ar: 'مناورة تصحيح المسار لا تنفذ بالكامل. مع هامش دلتا-في ضعيف قد لا يوجد وقود كافٍ للتعويض.',
      en: 'A trajectory-correction burn underperforms. With a thin Δv margin there may be no propellant left to recover.',
    },
    learnKey: 'deltaV',
    probabilityModifiers: [{ when: 'lowDvMargin', multiplier: 3 }],
    effects: { delayDays: 2, missionLossRisk: 0.08, budgetOverrunPct: 0.01 },
  },
  {
    id: 'dsnConflict',
    name: { ar: 'تعارض جدولة DSN', en: 'DSN Scheduling Conflict' },
    phases: ['operations'],
    severity: 'warning',
    baseProbability: 0.16,
    description: {
      ar: 'محطة الأرض محجوزة لمهمة أخرى، فتقل ساعات الاتصال. البيانات غير المرسلة تتراكم في الذاكرة.',
      en: 'The ground station is booked by another mission, cutting link hours. Unsent data piles up in memory.',
    },
    learnKey: 'comms',
    effects: { linkHoursFactor: 0.55, linkHoursDays: 8, scienceLossPct: 2 },
  },
  {
    id: 'costOverrun',
    name: { ar: 'تضخم التكلفة', en: 'Cost Overrun' },
    phases: ['cruise', 'operations'],
    severity: 'warning',
    baseProbability: 0.18,
    description: {
      ar: 'مشكلة هندسية غير متوقعة تستهلك احتياطي الميزانية. الاحتياطي غير المستخدم يحسّن كفاءة الميزانية.',
      en: 'An unexpected engineering issue consumes the budget reserve. Unused reserve improves budget efficiency.',
    },
    learnKey: 'budget',
    effects: { budgetOverrunPct: 0.12, delayDays: 4 },
  },
  {
    id: 'surfaceSurprise',
    name: { ar: 'خصائص سطح غير متوقعة', en: 'Unexpected Surface Conditions' },
    phases: ['arrival', 'operations'],
    severity: 'warning',
    baseProbability: 0.16,
    requires: { missionType: ['lander', 'sampleReturn'] },
    description: {
      ar: 'السطح أكثر وعورة أو نعومة من المتوقع. الرادار والكاميرا يقللان المفاجأة ويساعدان على إعادة التخطيط.',
      en: 'The surface is rougher or softer than predicted. Radar and cameras reduce the surprise and aid replanning.',
    },
    learnKey: 'landing',
    probabilityModifiers: [],
    effects: { delayDays: 2, scienceLossPct: 3 },
  },
  {
    id: 'calibrationSuccess',
    name: { ar: 'معايرة ناجحة', en: 'Successful Calibration' },
    phases: ['operations'],
    severity: 'info',
    baseProbability: 0.22,
    description: {
      ar: 'فريق العمليات يعاير الأجهزة بكفاءة أعلى من المتوقع، فتزداد جودة البيانات العلمية.',
      en: 'The operations team calibrates the instruments better than expected, improving science data quality.',
    },
    learnKey: 'scienceOps',
    effects: { scienceBonusPct: 5 },
  },
  {
    id: 'safeMode',
    name: { ar: 'دخول النمط الآمن', en: 'Safe-Mode Entry' },
    phases: ['cruise', 'operations'],
    severity: 'warning',
    baseProbability: 0.08,
    description: {
      ar: 'الطاقة المتاحة أقل من المطلوب لهذا النمط، فتدخل المركبة النمط الآمن وتوقف العلم حتى استعادة الطاقة.',
      en: 'Available power falls below the mode load, so the spacecraft enters safe mode and pauses science until power recovers.',
    },
    learnKey: 'power',
    probabilityModifiers: [
      { when: 'lowPowerMargin', multiplier: 4 },
      { when: 'safeModeRisk', multiplier: 2 },
    ],
    effects: { safeMode: true, scienceLossPct: 6, linkHoursFactor: 0.5, linkHoursDays: 5 },
  },
  {
    id: 'radiationDamage',
    name: { ar: 'ضرر إشعاعي متراكم', en: 'Cumulative Radiation Damage' },
    phases: ['cruise', 'operations'],
    severity: 'warning',
    baseProbability: 0.08,
    requires: { targetKind: ['planet', 'gasGiant'] },
    description: {
      ar: 'بيئة الإشعاع حول الهدف تسبب أخطاء في الذاكرة وأعطالًا. الإلكترونيات المقاومة تقلل الخطر.',
      en: 'The radiation environment causes memory upsets and faults. Rad-hard electronics lower the risk.',
    },
    learnKey: 'radiation',
    probabilityModifiers: [
      { when: 'noRadHard', multiplier: 2.5 },
      { when: 'gasGiant', multiplier: 2.2 },
    ],
    effects: { scienceLossPct: 4, delayDays: 2 },
  },
  {
    id: 'cometOutgassing',
    name: { ar: 'نشاط غازي للمذنب', en: 'Comet Outgassing' },
    phases: ['cruise', 'operations'],
    severity: 'warning',
    baseProbability: 0.18,
    requires: { targetKind: ['comet'] },
    description: {
      ar: 'ذؤابة الغاز والغبار تحجب الرؤية وتزيد الاضطراب. مطياف الغبار يسمح بفهم النشاط بدلًا من تفاديه فقط.',
      en: 'The gas/dust coma obscures the view and increases disturbance. A dust spectrometer turns the activity into data.',
    },
    learnKey: 'comet',
    probabilityModifiers: [],
    effects: { scienceLossPct: 3, delayDays: 2 },
  },
  {
    id: 'instrumentFailure',
    name: { ar: 'عطل في جهاز علمي', en: 'Instrument Failure' },
    phases: ['cruise', 'operations'],
    severity: 'warning',
    baseProbability: 0.05,
    description: {
      ar: 'قناة قياس تفقد حساسيتها. الأنظمة الاحتياطية قد تنقذ جزءًا من القدرة العلمية.',
      en: 'A measurement channel loses sensitivity. Redundant systems may preserve part of the science capability.',
    },
    learnKey: 'redundancy',
    probabilityModifiers: [{ when: 'redundancy', multiplier: 0.4 }],
    effects: { scienceLossPct: 3 },
  },
  {
    id: 'gravityAssistAnomaly',
    name: { ar: 'شذوذ في مناورة المساعدة الجاذبية', en: 'Gravity-Assist Anomaly' },
    phases: ['cruise'],
    severity: 'error',
    baseProbability: 0.07,
    requires: { transferType: ['assist'] },
    description: {
      ar: 'خطأ صغير في اقتراب المساعدة الجاذبية يتضخم في المسار. المسار المرن يحتاج تصحيحًا إضافيًا.',
      en: 'A small gravity-assist targeting error amplifies downstream. The flexible path needs an extra correction.',
    },
    learnKey: 'gravityAssist',
    probabilityModifiers: [{ when: 'lowDvMargin', multiplier: 2.5 }],
    effects: { delayDays: 5, missionLossRisk: 0.06, budgetOverrunPct: 0.02 },
  },
  {
    id: 'antennaPointing',
    name: { ar: 'خطأ في توجيه الهوائي', en: 'Antenna Pointing Error' },
    phases: ['operations'],
    severity: 'warning',
    baseProbability: 0.08,
    description: {
      ar: 'انحراف بسيط في التوجيه يخفض معدل الاتصال. التكرار يسمح باستعادة التوجيه بسرعة.',
      en: 'A small pointing error lowers the link rate. Redundancy enables faster attitude recovery.',
    },
    learnKey: 'comms',
    probabilityModifiers: [{ when: 'redundancy', multiplier: 0.7 }],
    effects: { linkHoursFactor: 0.5, linkHoursDays: 4, scienceLossPct: 1 },
  },
];

export const eventById = Object.fromEntries(EVENTS.map((e) => [e.id, e])) as Record<string, SimulationEventDef>;
