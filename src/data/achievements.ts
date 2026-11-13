import type {
  AchievementDef,
  LocalizedText,
  PilotProfile,
  PilotStats,
  TargetKind,
} from './types';

/**
 * Pilot profile content.
 *
 * Achievements are pure predicates over aggregate stats, never over a stored
 * design or simulation object. That keeps migration cheap and lets the same
 * definitions run offline against old attempts.
 */
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-run',
    category: 'milestone',
    tier: 'bronze',
    icon: 'Rocket',
    title: { ar: 'أول تشغيل', en: 'First ignition' },
    description: {
      ar: 'أكملت أول محاكاة لمهمة، مهما كانت النتيجة.',
      en: 'You completed your first mission simulation, whatever the outcome.',
    },
    hint: {
      ar: 'شغّل أي مهمة من الخطوة 10.',
      en: 'Run any mission from step 10.',
    },
    test: (stats) => stats.runs >= 1,
  },
  {
    id: 'first-success',
    category: 'milestone',
    tier: 'silver',
    icon: 'Trophy',
    title: { ar: 'مهمة ناجحة', en: 'Mission accomplished' },
    description: {
      ar: 'أتممت مهمة بنجاح واستوفيت أهدافها الأساسية.',
      en: 'You completed a mission successfully and met its core objectives.',
    },
    hint: {
      ar: 'أصلح الأخطاء المانعة وشغّل مهمة ناجحة.',
      en: 'Fix blocking errors and fly a successful mission.',
    },
    test: (stats) => stats.successes >= 1,
  },
  {
    id: 'lesson-learned',
    category: 'milestone',
    tier: 'bronze',
    icon: 'Lightbulb',
    title: { ar: 'الفشل بيانات', en: 'Failure is data' },
    description: {
      ar: 'سجّلت أول مهمة فاشلة وتعلّمت منها بدل أن تتوقف.',
      en: 'You recorded a failed mission and learned from it instead of stopping.',
    },
    hint: {
      ar: 'كل محاولة فاشلة تُحفظ في سجلك وتُحسب هنا.',
      en: 'Every failed attempt is saved in your record and counted here.',
    },
    test: (stats) => stats.failures >= 1,
  },
  {
    id: 'streak-3',
    category: 'milestone',
    tier: 'silver',
    icon: 'Flame',
    title: { ar: 'ثلاثية النجاح', en: 'Hat trick' },
    description: {
      ar: 'ثلاث مهام ناجحة متتالية دون فشل بينها.',
      en: 'Three successful missions in a row without a failure between them.',
    },
    hint: {
      ar: 'أكمل ثلاث محاولات ناجحة متتابعة.',
      en: 'Complete three successful attempts back to back.',
    },
    test: (stats) => stats.bestStreak >= 3,
  },
  {
    id: 'veteran-10',
    category: 'milestone',
    tier: 'gold',
    icon: 'History',
    title: { ar: 'خبير المحطات', en: 'Station veteran' },
    description: {
      ar: 'شغّلت عشر محاولات كاملة بمهامها المختلفة.',
      en: 'You ran ten complete attempts across different missions.',
    },
    hint: {
      ar: 'واصل التشغيل حتى تصل إلى 10 محاولات.',
      en: 'Keep flying until you reach 10 attempts.',
    },
    test: (stats) => stats.runs >= 10,
  },
  {
    id: 'grade-a',
    category: 'mastery',
    tier: 'silver',
    icon: 'Award',
    title: { ar: 'امتياز', en: 'Top of the class' },
    description: {
      ar: 'حصلت على تقدير A أو أعلى في مهمة كاملة.',
      en: 'You earned an A grade or better on a complete mission.',
    },
    hint: {
      ar: 'وازن العلم والميزانية والهوامش والموثوقية.',
      en: 'Balance science, budget, margins and reliability.',
    },
    test: (stats) => stats.aGrades >= 1,
  },
  {
    id: 'grade-s',
    category: 'mastery',
    tier: 'gold',
    icon: 'Crown',
    title: { ar: 'الدرجة S', en: 'S-grade' },
    description: {
      ar: 'حصلت على أعلى تقدير في اللعبة: S.',
      en: 'You reached the game’s highest grade: S.',
    },
    hint: {
      ar: 'اجمع 90 نقطة أو أكثر مع مهمة ناجحة.',
      en: 'Score 90 or more on a successful mission.',
    },
    test: (stats) => stats.sGrades >= 1,
  },
  {
    id: 'perfect-95',
    category: 'mastery',
    tier: 'gold',
    icon: 'Gem',
    title: { ar: 'شبه كامل', en: 'Near perfect' },
    description: {
      ar: 'تجاوزت 95 نقطة من 100 في مهمة واحدة.',
      en: 'You scored above 95 out of 100 in a single mission.',
    },
    hint: {
      ar: 'حسّن كل بُعد دون التضحية بالعلم أو الميزانية.',
      en: 'Improve every dimension without sacrificing science or budget.',
    },
    test: (stats) => stats.bestScore >= 95,
  },
  {
    id: 'moon',
    category: 'exploration',
    tier: 'bronze',
    icon: 'Moon',
    title: { ar: 'جارة الأرض', en: 'Lunar neighbour' },
    description: {
      ar: 'أتممت مهمة ناجحة إلى القمر.',
      en: 'You completed a successful mission to the Moon.',
    },
    hint: {
      ar: 'اختر القمر كهدف وأكمل المحاكاة بنجاح.',
      en: 'Choose the Moon as your target and run a successful simulation.',
    },
    test: (stats) => stats.targetsVisited.includes('moon'),
  },
  {
    id: 'mars',
    category: 'exploration',
    tier: 'silver',
    icon: 'Target',
    title: { ar: 'المريخ في المدار', en: 'Mars orbit' },
    description: {
      ar: 'أتممت مهمة ناجحة إلى المريخ.',
      en: 'You completed a successful mission to Mars.',
    },
    hint: {
      ar: 'اختر المريخ وأكمل مهمة ناجحة.',
      en: 'Choose Mars and complete a successful mission.',
    },
    test: (stats) => stats.targetsVisited.includes('mars'),
  },
  {
    id: 'venus',
    category: 'exploration',
    tier: 'silver',
    icon: 'Sun',
    title: { ar: 'توأم الأرض', en: 'Toxic twin' },
    description: {
      ar: 'أتممت مهمة ناجحة إلى الزهرة رغم قسوة بيئتها.',
      en: 'You completed a successful mission to Venus despite its harsh environment.',
    },
    hint: {
      ar: 'اختر الزهرة وصمّم مهمة تتحمل الحرارة والضغط.',
      en: 'Choose Venus and design a mission that survives heat and pressure.',
    },
    test: (stats) => stats.targetsVisited.includes('venus'),
  },
  {
    id: 'jupiter',
    category: 'exploration',
    tier: 'gold',
    icon: 'Orbit',
    title: { ar: 'عملاق النظام', en: 'Giant of the system' },
    description: {
      ar: 'أتممت مهمة ناجحة إلى المشتري.',
      en: 'You completed a successful mission to Jupiter.',
    },
    hint: {
      ar: 'اختر المشتري، وتذكّر الإشعاع والطاقة البعيدة.',
      en: 'Choose Jupiter, and remember radiation and distant power.',
    },
    test: (stats) => stats.targetsVisited.includes('jupiter'),
  },
  {
    id: 'asteroid',
    category: 'exploration',
    tier: 'bronze',
    icon: 'Compass',
    title: { ar: 'صائد الكويكبات', en: 'Asteroid hunter' },
    description: {
      ar: 'أتممت مهمة ناجحة إلى كويكب.',
      en: 'You completed a successful mission to an asteroid.',
    },
    hint: {
      ar: 'اختر بينو أو ريوغو أو إيروس أو فيستا.',
      en: 'Choose Bennu, Ryugu, Eros or Vesta.',
    },
    test: (stats) => stats.targetKindsVisited.includes('asteroid'),
  },
  {
    id: 'comet',
    category: 'exploration',
    tier: 'silver',
    icon: 'Sparkles',
    title: { ar: 'ملاح المذنبات', en: 'Comet sailor' },
    description: {
      ar: 'أتممت مهمة ناجحة إلى مذنب.',
      en: 'You completed a successful mission to a comet.',
    },
    hint: {
      ar: 'جرّب 67P أو Tempel 1، واحذر الغبار.',
      en: 'Try 67P or Tempel 1, and watch out for dust.',
    },
    test: (stats) => stats.targetKindsVisited.includes('comet'),
  },
  {
    id: 'sample-return',
    category: 'exploration',
    tier: 'silver',
    icon: 'Package',
    title: { ar: 'عد إلى الأرض', en: 'Bring it home' },
    description: {
      ar: 'أعدت عينات من مهمة ناجحة إلى الأرض.',
      en: 'You returned samples to Earth from a successful mission.',
    },
    hint: {
      ar: 'اختر نوع مهمة إرجاع العينات مع كبسولة مناسبة.',
      en: 'Choose sample return with a compatible capsule.',
    },
    test: (stats) => stats.sampleReturns >= 1,
  },
  {
    id: 'grand-tour',
    category: 'exploration',
    tier: 'gold',
    icon: 'Globe',
    title: { ar: 'جولة النظام الشمسي', en: 'Grand tour' },
    description: {
      ar: 'زرت بنجاح قمرًا وكوكبًا وعملاقًا غازيًا وكويكبًا ومذنبًا وكوكبًا قزمًا.',
      en: 'You successfully visited a moon, planet, gas giant, asteroid, comet and dwarf planet.',
    },
    hint: {
      ar: 'أكمل مهمة ناجحة لكل نوع من أنواع الأهداف الستة.',
      en: 'Complete a successful mission for all six target kinds.',
    },
    test: (stats) =>
      (['moon', 'planet', 'gasGiant', 'asteroid', 'comet', 'dwarfPlanet'] as TargetKind[]).every(
        (kind) => stats.targetKindsVisited.includes(kind),
      ),
  },
  {
    id: 'five-mission-types',
    category: 'exploration',
    tier: 'silver',
    icon: 'Layers',
    title: { ar: 'خمس طرق للاستكشاف', en: 'Five ways to explore' },
    description: {
      ar: 'أتممت بنجاح كل أنواع المهام الخمسة.',
      en: 'You successfully completed all five mission types.',
    },
    hint: {
      ar: 'جرّب العبور والمدار والهبوط واللقاء وإرجاع العينات.',
      en: 'Fly a flyby, orbiter, lander, rendezvous and sample return.',
    },
    test: (stats) => stats.missionTypesFlown.length >= 5,
  },
  {
    id: 'expert-success',
    category: 'mastery',
    tier: 'gold',
    icon: 'ShieldCheck',
    title: { ar: 'وضع الخبير', en: 'Expert mode' },
    description: {
      ar: 'أتممت مهمة ناجحة على مستوى الخبير.',
      en: 'You completed a successful mission on Expert difficulty.',
    },
    hint: {
      ar: 'اختر مستوى الخبير وحافظ على الميزانية الضيقة.',
      en: 'Choose Expert difficulty and stay within the tight budget.',
    },
    test: (stats) => stats.expertSuccesses >= 1,
  },
  {
    id: 'lean',
    category: 'engineering',
    tier: 'bronze',
    icon: 'Feather',
    title: { ar: 'تصميم رشيق', en: 'Lean machine' },
    description: {
      ar: 'أتممت مهمة ناجحة بأربعة أجهزة علمية أو أقل.',
      en: 'You completed a successful mission with four instruments or fewer.',
    },
    hint: {
      ar: 'قلّل الأجهزة مع الحفاظ على الحد العلمي المطلوب.',
      en: 'Cut instruments while still meeting the science threshold.',
    },
    test: (stats) => stats.leanSuccesses >= 1,
  },
  {
    id: 'budget-hawk',
    category: 'engineering',
    tier: 'silver',
    icon: 'Coins',
    title: { ar: 'صقر الميزانية', en: 'Budget hawk' },
    description: {
      ar: 'أتممت مهمة ناجحة بأقل من 70% من الميزانية.',
      en: 'You completed a successful mission using under 70% of the budget.',
    },
    hint: {
      ar: 'وفّر في الكتلة والوقود والأجهزة دون كسر الهدف.',
      en: 'Save on mass, propellant and instruments without missing the goal.',
    },
    test: (stats) => stats.budgetHawks >= 1,
  },
  {
    id: 'margin-ace',
    category: 'engineering',
    tier: 'silver',
    icon: 'Scale',
    title: { ar: 'هوامش ذهبية', en: 'Golden margins' },
    description: {
      ar: 'حصلت على 18 من 20 في بُعد الهوامش.',
      en: 'You earned 18 out of 20 on the margins dimension.',
    },
    hint: {
      ar: 'اترك هامش كتلة وطاقة وΔv صحيًا.',
      en: 'Leave a healthy mass, power and Δv margin.',
    },
    test: (stats) => stats.marginAces >= 1,
  },
  {
    id: 'reliability-ace',
    category: 'engineering',
    tier: 'silver',
    icon: 'Shield',
    title: { ar: 'موثوقية عالية', en: 'Built to last' },
    description: {
      ar: 'حصلت على 22 من 25 في بُعد الموثوقية.',
      en: 'You earned 22 out of 25 on the reliability dimension.',
    },
    hint: {
      ar: 'أضف احتياطيًا ودرعًا إشعاعيًا عند الحاجة.',
      en: 'Add redundancy and radiation hardening where needed.',
    },
    test: (stats) => stats.reliabilityAces >= 1,
  },
  {
    id: 'rtg',
    category: 'engineering',
    tier: 'silver',
    icon: 'Zap',
    title: { ar: 'طاقة في الظلام', en: 'Power in the dark' },
    description: {
      ar: 'أتممت مهمة ناجحة تعتمد على مولّد RTG.',
      en: 'You completed a successful mission powered by an RTG.',
    },
    hint: {
      ar: 'استخدم RTG في الأهداف البعيدة عن الشمس.',
      en: 'Use an RTG on targets far from the Sun.',
    },
    test: (stats) => stats.rtgSuccesses >= 1,
  },
  {
    id: 'no-redundancy',
    category: 'engineering',
    tier: 'gold',
    icon: 'ShieldOff',
    title: { ar: 'بلا احتياطي', en: 'No backup' },
    description: {
      ar: 'أتممت مهمة خبير ناجحة دون أي احتياطي.',
      en: 'You completed a successful Expert mission with no redundancy.',
    },
    hint: {
      ar: 'على مستوى الخبير، اختر «بلا احتياطي» وأكمل المهمة.',
      en: 'On Expert, choose no redundancy and complete the mission.',
    },
    test: (stats) => stats.noRedundancySuccesses >= 1,
  },
  {
    id: 'science-70',
    category: 'mastery',
    tier: 'silver',
    icon: 'FlaskConical',
    title: { ar: 'حصاد علمي', en: 'Science harvest' },
    description: {
      ar: 'بلغت 70 نقطة علم في مهمة ناجحة.',
      en: 'You reached 70 science points on a successful mission.',
    },
    hint: {
      ar: 'اختر أجهزة عالية التوافق مع الهدف وزد أيام التشغيل.',
      en: 'Pick instruments with strong target affinity and extend operations.',
    },
    test: (stats) => stats.bestScience >= 70,
  },
  {
    id: 'data-20',
    category: 'mastery',
    tier: 'silver',
    icon: 'Database',
    title: { ar: 'سيل البيانات', en: 'Data deluge' },
    description: {
      ar: 'أرسلت 20 غيغابايت أو أكثر في مهمة ناجحة.',
      en: 'You downlinked 20 GB or more on a successful mission.',
    },
    hint: {
      ar: 'حسّن الهوائي والطاقة والقدرة على الإرسال.',
      en: 'Improve the antenna, power and downlink capacity.',
    },
    test: (stats) => stats.bestDataGb >= 20,
  },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(
  ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]),
) as Record<string, AchievementDef>;

export const ACHIEVEMENT_COUNT = ACHIEVEMENTS.length;

export interface PilotRank {
  title: LocalizedText;
  min: number;
}

export const PILOT_RANKS: PilotRank[] = [
  { min: 0, title: { ar: 'متدرب', en: 'Trainee' } },
  { min: 4, title: { ar: 'مهندس مساعد', en: 'Junior Engineer' } },
  { min: 9, title: { ar: 'مهندس مهام', en: 'Mission Engineer' } },
  { min: 15, title: { ar: 'قائد مهام', en: 'Mission Commander' } },
  { min: 21, title: { ar: 'أسطورة آمون', en: 'AMUN Legend' } },
];

export function rankFor(unlocked: number): { current: PilotRank; next: PilotRank | null } {
  let current = PILOT_RANKS[0];
  let next: PilotRank | null = null;
  for (const rank of PILOT_RANKS) {
    if (unlocked >= rank.min) current = rank;
    else if (!next) next = rank;
  }
  return { current, next };
}

export function emptyPilotStats(): PilotStats {
  return {
    runs: 0,
    successes: 0,
    failures: 0,
    bestScore: 0,
    bestScience: 0,
    bestDataGb: 0,
    totalScience: 0,
    totalDataGb: 0,
    sGrades: 0,
    aGrades: 0,
    currentStreak: 0,
    bestStreak: 0,
    targetsVisited: [],
    targetKindsVisited: [],
    missionTypesFlown: [],
    difficultiesWon: [],
    instrumentsFlown: [],
    sampleReturns: 0,
    leanSuccesses: 0,
    budgetHawks: 0,
    marginAces: 0,
    reliabilityAces: 0,
    rtgSuccesses: 0,
    expertSuccesses: 0,
    noRedundancySuccesses: 0,
  };
}

export function emptyPilotProfile(): PilotProfile {
  return {
    stats: emptyPilotStats(),
    unlocked: {},
    recordedRuns: [],
  };
}
