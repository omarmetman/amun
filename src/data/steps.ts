import type { LocalizedText } from './types';

export interface StepMeta {
  n: number;
  id: string;
  title: LocalizedText;
  short: LocalizedText;
  subtitle: LocalizedText;
  hint: LocalizedText;
  hintShort: LocalizedText;
  icon: string;
}

export const STEPS: StepMeta[] = [
  {
    n: 1,
    id: 'objectives',
    title: { ar: 'الأهداف', en: 'Objectives' },
    short: { ar: 'الهدف', en: 'Target' },
    subtitle: {
      ar: 'إلى أين نذهب، وماذا نريد أن نفعل هناك، وما معيار النجاح؟',
      en: 'Where are we going, what will we do there, and what counts as success?',
    },
    hint: {
      ar: 'المسافة إلى الهدف تحدد الطاقة المطلوبة للإطلاق، وميل مداره يحدد كلفة تغيير المستوى. اختر نوع مهمة مسموحًا به للهدف؛ فالهبوط وإرجاع العينات يتطلبان ميزانية دلتا-في أكبر.',
      en: 'Target distance sets departure energy, and orbital inclination drives plane-change cost. Pick a mission type the target supports; landing and sample return demand a much larger Δv budget.',
    },
    hintShort: {
      ar: 'الهدف يحدد الطاقة والدلتا-في. تحقق من الأنواع المسموحة قبل المتابعة.',
      en: 'The target sets energy and Δv. Check which mission types it supports.',
    },
    icon: 'target',
  },
  {
    n: 2,
    id: 'spacecraft',
    title: { ar: 'المركبة', en: 'Spacecraft' },
    short: { ar: 'المركبة', en: 'Bus' },
    subtitle: {
      ar: 'اختر المنصة ونظام الدفع ومستوى التكرار والحماية من الإشعاع.',
      en: 'Choose the bus, propulsion, redundancy level and radiation protection.',
    },
    hint: {
      ar: 'المنصة الأكبر تزيد الكتلة والكلفة لكنها ترفع سعة الحمولة والطاقة. التكرار الوقائي يضيف كتلة وكلفة مقابل تقليل احتمال الأعطال، والإلكترونيات المقاومة للإشعاع ضرورة قرب المشتري.',
      en: 'A larger bus costs mass and money but adds payload, power and storage. Redundancy trades mass and cost for lower failure risk; rad-hard electronics are essential near Jupiter.',
    },
    hintShort: {
      ar: 'الكبر يزيد القدرة والكلفة. التكرار والإشعاع يخفضان المخاطر بثمن.',
      en: 'Bigger adds capability and cost. Redundancy and shielding buy reliability.',
    },
    icon: 'satellite',
  },
  {
    n: 3,
    id: 'instruments',
    title: { ar: 'الأجهزة العلمية', en: 'Science Instruments' },
    short: { ar: 'العلم', en: 'Science' },
    subtitle: {
      ar: 'ابنِ حزمة قياسات تحقق معيار النجاح وتناسب بيئة الهدف.',
      en: 'Build a measurement suite that meets the success tier and fits the target.',
    },
    hint: {
      ar: 'معامل التوافق يضاعف قيمة الجهاز عندما يناسب بيئة الهدف. راقب الكتلة والطاقة ومعدل البيانات: كل جهاز يضيف كلفة وبيانات تحتاج اتصالًا لإرسالها.',
      en: 'Affinity multiplies an instrument’s value when it matches the target. Watch mass, power and data rate: every instrument adds cost and data that must be downlinked.',
    },
    hintShort: {
      ar: 'وازن العلم مع الكتلة والطاقة والبيانات. التوافق مع الهدف مهم.',
      en: 'Balance science against mass, power and data. Target affinity matters.',
    },
    icon: 'microscope',
  },
  {
    n: 4,
    id: 'launch',
    title: { ar: 'مركبة الإطلاق', en: 'Launch Vehicle' },
    short: { ar: 'الإطلاق', en: 'Launch' },
    subtitle: {
      ar: 'طابق الكتلة عند الإطلاق مع الحمولة المتاحة عند طاقة C3 الحالية.',
      en: 'Match launch mass to available payload at the current C3 energy.',
    },
    hint: {
      ar: 'كلما زادت C3 قلت الحمولة المتاحة. الصاروخ الأكبر يمنح هامشًا أوسع لكنه يرفع الكلفة ويقلل كفاءة الميزانية. لا تشترِ قدرة لا تستخدمها.',
      en: 'Higher C3 means less payload. A larger rocket buys margin but costs more and hurts budget efficiency. Do not buy capacity you will not use.',
    },
    hintShort: {
      ar: 'C3 الأعلى يعني حمولة أقل. الصاروخ الزائد يهدر الميزانية.',
      en: 'Higher C3 means less payload. Oversized rockets waste budget.',
    },
    icon: 'rocket',
  },
  {
    n: 5,
    id: 'budget',
    title: { ar: 'الميزانية', en: 'Budget' },
    short: { ar: 'الميزانية', en: 'Budget' },
    subtitle: {
      ar: 'اجمع بنود الكلفة، اختر مدة العمليات والاحتياطي، وابقَ داخل السقف.',
      en: 'Roll up cost lines, choose operations duration and reserve, and stay under the cap.',
    },
    hint: {
      ar: 'الاحتياطي مخصص لاستيعاب تضخم التكلفة أثناء المحاكاة، وليس بندًا مهدرًا. لكن احتياطيًا كبيرًا جدًا يرفع الكلفة الكلية. مدة العمليات تزيد العلم والبيانات والكلفة معًا.',
      en: 'The reserve absorbs cost growth during simulation; it is not waste. But an oversized reserve raises total cost. Operations days increase science, data and cost together.',
    },
    hintShort: {
      ar: 'احتياطي 10–20% يحمي من التضخم. الأيام الطويلة تكلف أكثر وتنتج أكثر.',
      en: 'A 10–20% reserve absorbs overruns. Longer ops cost more and produce more.',
    },
    icon: 'wallet',
  },
  {
    n: 6,
    id: 'power',
    title: { ar: 'الطاقة', en: 'Power' },
    short: { ar: 'الطاقة', en: 'Power' },
    subtitle: {
      ar: 'وازن توليد الألواح وRTG والبطارية مع أحمال الأنماط الثلاثة.',
      en: 'Balance solar, RTG and battery capacity against three operating modes.',
    },
    hint: {
      ar: 'التدفق الشمسي يتبع قانون التربيع العكسي: S = 1361 / r². عند المشتري لا يكاد يكفي، وهناك يلزم RTG. الألواح الزائدة تضيف كتلة، والناقصة تسبب خطأ مانعًا أو فقدان علم.',
      en: 'Solar flux follows the inverse-square law: S = 1361 / r². At Jupiter it is barely usable, so RTGs are needed. Oversized arrays add mass; undersized ones block simulation or lose science.',
    },
    hintShort: {
      ar: 'الطاقة تتناقص مع مربع المسافة. وازن التوليد مع الحمل والكسوف.',
      en: 'Power falls with distance squared. Balance generation, load and eclipse.',
    },
    icon: 'sun',
  },
  {
    n: 7,
    id: 'mass',
    title: { ar: 'الكتلة والوقود', en: 'Mass & Propellant' },
    short: { ar: 'الكتلة', en: 'Mass' },
    subtitle: {
      ar: 'احسب الوقود بمعادلة الصاروخ، ووازن هامش الكتلة داخل حمولة الصاروخ.',
      en: 'Solve the rocket equation and keep launch mass inside the launcher limit.',
    },
    hint: {
      ar: 'معادلة تسيولكوفسكي مع كتلة الخزان تُحل مغلقًا من أجل الوقود. احتياطي الوقود يرفع دلتا-في المتاح، لكنه يزيد الكتلة. الهامش الصحي 10–30% من سعة الصاروخ.',
      en: 'Tsiolkovsky with tank mass has a closed-form propellant solution. More propellant reserve raises available Δv but adds mass. A healthy margin is 10–30% of launcher capacity.',
    },
    hintShort: {
      ar: 'وقود أكثر = دلتا-في أكبر وكتلة أكبر. اهدف لهامش 10–30%.',
      en: 'More propellant means more Δv and more mass. Aim for a 10–30% margin.',
    },
    icon: 'weight',
  },
  {
    n: 8,
    id: 'comms',
    title: { ar: 'الاتصالات', en: 'Communications' },
    short: { ar: 'الاتصال', en: 'Comms' },
    subtitle: {
      ar: 'صمّم وصلة الإرسال بحيث تصل البيانات المنتجة إلى الأرض.',
      en: 'Design a downlink that actually returns the produced data to Earth.',
    },
    hint: {
      ar: 'معدل البيانات يتناسب عكسيًا مع مربع المسافة. زد قدرة الإرسال أو قطر الهوائي أو الكسب الأرضي، أو استخدم نطاق Ka. البيانات التي لا تُرسل تبقى في الذاكرة ثم تضيع.',
      en: 'Data rate falls with distance squared. Add transmit power, antenna diameter, ground gain, or use Ka-band. Undelivered data sits in memory and is eventually lost.',
    },
    hintShort: {
      ar: 'المسافة تقتل المعدل. وازن الهوائي والقدرة والمحطة والذاكرة.',
      en: 'Distance kills rate. Balance antenna, power, station and storage.',
    },
    icon: 'radio',
  },
  {
    n: 9,
    id: 'orbit',
    title: { ar: 'القيود المدارية', en: 'Orbital Constraints' },
    short: { ar: 'المدار', en: 'Orbit' },
    subtitle: {
      ar: 'حدد المسار ونافذة الإطلاق وميزانية دلتا-في المطلوبة مقابل المتاحة.',
      en: 'Set the trajectory, launch window, and required versus available Δv.',
    },
    hint: {
      ar: 'المسار السريع يضاعف C3 تقريبًا ويقلل الزمن، والمساعدة الجاذبية تخفض C3 لكنها تطيل الرحلة. تغيير المستوى المداري مكلف، ونافذة متأخرة تضيف عقوبة. المتاح يجب أن يغطي المطلوب مع هامش.',
      en: 'A fast transfer roughly doubles C3 but cuts travel time; a gravity assist lowers C3 but lengthens cruise. Plane changes are expensive, and later windows add penalty. Available Δv must cover required Δv with margin.',
    },
    hintShort: {
      ar: 'وازن زمن الرحلة مع C3 والدلتا-في. النافذة الأولى عادة الأفضل.',
      en: 'Trade cruise time against C3 and Δv. The first window is usually best.',
    },
    icon: 'orbit',
  },
  {
    n: 10,
    id: 'simulation',
    title: { ar: 'المحاكاة', en: 'Simulation' },
    short: { ar: 'المحاكاة', en: 'Simulate' },
    subtitle: {
      ar: 'شغّل مهمة حتمية بالبذرة نفسها، وتابع الأحداث مرحلة بمرحلة.',
      en: 'Run a deterministic seeded mission and follow events phase by phase.',
    },
    hint: {
      ar: 'البذرة نفسها مع التصميم نفسه تعطي النتيجة نفسها دائمًا. لا يمكن التشغيل قبل إصلاح الأخطاء المانعة. الأحداث لا تُغير الحسابات الفيزيائية، بل تستهلك الهوامش التي بنيتها.',
      en: 'The same seed and design always reproduce the same result. Simulation is blocked until errors are fixed. Events do not change the physics; they consume the margins you built.',
    },
    hintShort: {
      ar: 'نفس التصميم + نفس البذرة = نفس النتيجة. أصلح الأخطاء أولًا.',
      en: 'Same design + same seed = same result. Fix blockers first.',
    },
    icon: 'play',
  },
  {
    n: 11,
    id: 'evaluation',
    title: { ar: 'التقييم', en: 'Evaluation' },
    short: { ar: 'التقييم', en: 'Results' },
    subtitle: {
      ar: 'اقرأ سبب النتيجة، قارن القرارات، وأعد المحاولة ببذرة مختلفة أو مماثلة.',
      en: 'Understand the score, compare decisions, and retry with the same or a new seed.',
    },
    hint: {
      ar: 'النتيجة تفسيرية لا رقمية فقط: كل خصم يرتبط بقرار في خطوة محددة. استخدم «أصلح» للانتقال مباشرة، ثم أعد التشغيل بالبذرة نفسها لمقارنة أثر التعديل.',
      en: 'The report explains every deduction and links it to the step that caused it. Use “Fix” to jump there, then rerun with the same seed to isolate the effect of your change.',
    },
    hintShort: {
      ar: 'كل خصم له سبب وقرار. أصلح ثم أعد التشغيل بالبذرة نفسها.',
      en: 'Every deduction has a cause and a decision. Fix, then rerun with the same seed.',
    },
    icon: 'trophy',
  },
];

export const stepByNumber = (n: number): StepMeta => STEPS[Math.min(10, Math.max(0, n - 1))];
