import type {
  CampaignChapter,
  CampaignCompletion,
  DesignChoices,
  Language,
  LocalizedText,
} from './types';

/**
 * AMUN Horizon — the game's six-chapter story campaign.
 *
 * The campaign is deliberately data-driven: chapters fix only the target,
 * mission type, difficulty, success tier and seed. Every engineering decision
 * (bus, instruments, launcher, power, comms, orbit) remains the player's.
 * The preset in each chapter is a tuned starting point, not a locked design.
 *
 * Narrative disclaimer: the storm, signal and 26-month cadence are fiction.
 * 1420.405 MHz is the real hydrogen line; the mission science uses the same
 * NASA-derived data and clearly-marked gameplay simplifications as freeplay.
 */

export interface CampaignSignalMeta {
  frequency: string;
  period: LocalizedText;
  points: LocalizedText;
  status: LocalizedText;
}

export interface CampaignMeta {
  title: LocalizedText;
  englishTitle: string;
  years: string;
  tagline: LocalizedText;
  overview: LocalizedText;
  hook: LocalizedText;
  finale: LocalizedText;
  disclaimer: LocalizedText;
  signal: CampaignSignalMeta;
}

export const CAMPAIGN: CampaignMeta = {
  title: { ar: 'أفق آمون', en: 'AMUN Horizon' },
  englishTitle: 'AMUN HORIZON',
  years: '2041 — 2051',
  tagline: {
    ar: 'ستة فصول. إشارة واحدة. أفق لا يعود منه من يصل إليه كما كان.',
    en: 'Six chapters. One signal. A horizon that changes everyone who reaches it.',
  },
  overview: {
    ar: 'في عام 2041، ضربت العاصفة الشمسية الكبرى شبكة الاتصال العميق. من بين الأنقاض، بدأت نبضة غامضة تتكرر كل 26 شهرًا من ستة مواقع في النظام الشمسي. أنت قائد برنامج آمون. مهمتك: إعادة بناء سلسلة المرسلات، وتتبع الإشارة من القمر إلى سيريس، واكتشاف من — أو ما — ينتظر عند الأفق.',
    en: 'In 2041, the Great Solar Storm struck the deep-space communications lattice. From the wreckage, a mysterious pulse began repeating every 26 months from six locations across the solar system. You command the AMUN programme. Your mission: rebuild the relay chain, follow the signal from the Moon to Ceres, and discover who — or what — is waiting at the horizon.',
  },
  hook: {
    ar: 'لم تكن الإشارة دعوة. كانت اختبارًا. ومن يجيب، عليه أن يبني الطريق بيديه.',
    en: 'The signal was not an invitation. It was a test. Whoever answers must build the road with their own hands.',
  },
  finale: {
    ar: 'لم تكن الإشارة نداءً من كائنات بعيدة. كانت بنية تحتية لم تبنها البشرية، تركتها حضارة سبقتنا بملايين السنين كي تختبر من يصل. في 2051، وقفت البشرية على حافة سيريس، ونظرت إلى ما وراء الأفق. لم تعد الأرض مركز الكون. صارت أول جسر إليه.',
    en: 'The signal was not a call from distant beings. It was infrastructure humanity did not build — left by a civilisation millions of years ahead of us to test who would arrive. In 2051, humanity stood at the edge of Ceres and looked beyond the horizon. Earth was no longer the centre of the universe. It became its first bridge.',
  },
  disclaimer: {
    ar: 'القصة والخط الزمني والاكتشافات خيال علمي. التردد 1420.405 ميغاهرتز هو خط الهيدروجين، قيمة فيزيائية حقيقية استخدمناها لأنها أشهر تردد في علم الفلك الراديوي. تصميم المهمة نفسه يخضع لقواعد البيانات والمحاكاة نفسها في اللعب الحر.',
    en: 'The story, timeline and discoveries are science fiction. The 1420.405 MHz frequency is the hydrogen line, a real physical value used because it is radio astronomy’s most famous frequency. Mission design still follows the same data rules and simulation as freeplay.',
  },
  signal: {
    frequency: '1420.405 MHz',
    period: { ar: 'كل 26 شهرًا', en: 'every 26 months' },
    points: { ar: 'ست نقاط في النظام الشمسي', en: 'six points across the solar system' },
    status: { ar: 'مصدر غير معروف', en: 'source unknown' },
  },
};

const preset = (input: CampaignChapter['preset']): CampaignChapter['preset'] => input;

export const CAMPAIGN_CHAPTERS: CampaignChapter[] = [
  {
    id: 'moon-echo',
    number: 1,
    code: 'NILE-2041',
    year: 2041,
    title: { ar: 'صدى القمر', en: 'Echo of the Moon' },
    subtitle: { ar: 'حيث بدأ كل شيء', en: 'Where it all began' },
    targetId: 'moon',
    missionType: 'orbiter',
    difficulty: 'beginner',
    successTier: 'basic',
    seed: 'NILE-2041',
    accent: 'royal',
    icon: 'Moon',
    prologue: {
      ar: 'في الثالث من آذار 2041، مزّقت العاصفة الشمسية الكبرى شبكة الاتصال بين الأرض والمدار. عندما عادت الكهرباء إلى غرفة التحكم، كان القمر يبث نبضة لا يعرف أحد كيف بدأت: 1420.405 ميغاهرتز، كل 26 شهرًا، تمامًا كخط الهيدروجين الذي يكتب به الكون صمته.',
      en: 'On 3 March 2041, the Great Solar Storm tore the communication lattice between Earth and orbit. When the control room came back online, the Moon was broadcasting a pulse no one could explain: 1420.405 MHz, every 26 months — the hydrogen line with which the universe writes its silence.',
    },
    briefing: {
      ar: 'مهمتك: إعادة تشغيل مِرساة الاتصال القمرية، ورسم مصدر النبضة على الوجه البعيد. لا نطلب منك مطاردة شبح؛ نطلب أن تثبت أننا ما زلنا نسمع.',
      en: 'Your job: restore the lunar relay and map the pulse source on the far side. We are not asking you to chase a ghost; we are asking you to prove we can still listen.',
    },
    objective: {
      ar: 'أعد تشغيل مِرساة القمر وحدد مصدر النبضة الأولى.',
      en: 'Restore the lunar relay and locate the first pulse source.',
    },
    transmission: {
      ar: '«إذا سمعتم هذا، فالأفق ليس نهاية الطريق. الأفق بداية.»',
      en: '“If you can hear this, the horizon is not the end of the road. The horizon is where the road begins.”',
    },
    epilogue: {
      ar: 'خلف القمر، وجدت المركبة هوائيًا أقدم من برنامج آمون نفسه، يعيد بث شيفرة على شكل خريطة. الخريطة لا تشير إلى القمر. تشير إلى المريخ — وإلى نقطة ثانية على الكوكب الأحمر لم تكن في أي سجل.',
      en: 'Behind the Moon, the spacecraft found an antenna older than the AMUN programme itself, rebroadcasting a map-shaped code. The map did not point to the Moon. It pointed to Mars — and to a second site on the Red Planet absent from every record.',
    },
    bonusObjectives: [
      {
        id: 'moon-grade',
        kind: 'grade',
        minGrade: 'A',
        title: { ar: 'استقبال نظيف', en: 'Clean reception' },
        description: {
          ar: 'أنهِ الفصل بتقدير A أو أعلى.',
          en: 'Complete the chapter with a grade of A or better.',
        },
      },
      {
        id: 'moon-science',
        kind: 'science',
        threshold: 45,
        title: { ar: 'مسح الوجه البعيد', en: 'Far-side survey' },
        description: {
          ar: 'اجمع 45 نقطة علم على الأقل.',
          en: 'Collect at least 45 science points.',
        },
      },
    ],
    preset: preset({
      busId: 'medium',
      propulsionId: 'biprop',
      redundancy: 'none',
      radHard: false,
      instruments: ['nac', 'wac', 'visnir', 'thermal', 'mag', 'lidar'],
      launcherId: 'pslv',
      launchWindowId: 'auto',
      transferType: 'hohmann',
      power: { solarAreaM2: 2.5, rtgCount: 0, batteryKg: 10 },
      comms: { antennaId: 'mga', band: 'X', txPowerW: 50, groundStation: 'dsn34' },
      opsDays: 30,
      reservePercent: 12,
      propellantReservePercent: 15,
    }),
  },
  {
    id: 'mars-dust',
    number: 2,
    code: 'RED-2043',
    year: 2043,
    title: { ar: 'غبار المريخ', en: 'Dust of Mars' },
    subtitle: { ar: 'الإشارة لا تنتظر', en: 'The signal does not wait' },
    targetId: 'mars',
    missionType: 'orbiter',
    difficulty: 'normal',
    successTier: 'basic',
    seed: '6KC5N8MD',
    accent: 'danger',
    icon: 'Orbit',
    prologue: {
      ar: 'في 2043، وصلت الحلقة الثانية. كان المريخ يغطي نصف سماء الليل بغبار أحمر، لكن النبضة عبرت الغبار كما يعبر الضوء زجاجًا. في تلك الليلة، فهم المهندسون شيئًا مرعبًا: الإشارة لا تنتظرنا. إنها تُبنى.',
      en: 'In 2043, the second ring arrived. Mars was covering half the night sky in red dust, but the pulse crossed it the way light crosses glass. That night the engineers understood something frightening: the signal is not waiting for us. It is being built.',
    },
    briefing: {
      ar: 'استعد مِرساة «أمل» في مدار المريخ، وراقب العاصفة الحمراء. النبضة الثانية مخبأة في الغلاف الجوي، والغبار قد يكون مفتاح فكّها.',
      en: 'Restore the “Amal” relay in Mars orbit and watch the red storm. The second pulse is hidden in the atmosphere, and the dust may be the key to decoding it.',
    },
    objective: {
      ar: 'أعد مِرساة المريخ والتقط الحلقة الثانية من الإشارة.',
      en: 'Restore the Mars relay and capture the second ring of the signal.',
    },
    transmission: {
      ar: '«الغبار لا يخفي شيئًا. الغبار يعلّمنا كيف نرى.»',
      en: '“Dust hides nothing. Dust teaches us how to see.”',
    },
    epilogue: {
      ar: 'في مدار المريخ، التقطت المركبة الحلقة الثانية: ست نقاط حول النظام الشمسي، وخط زمني واحد. إحدى النقاط كانت كويكبًا صغيرًا اسمه بنّو. النقطة الأخرى كانت الزهرة. لكن الترتيب لم يكن منطقيًا: من الداخل إلى الخارج، ثم إلى الداخل مرة أخرى.',
      en: 'In Mars orbit, the spacecraft captured the second ring: six points around the solar system and a single timeline. One point was a small asteroid called Bennu. Another was Venus. But the order made no sense: outward, then inward again.',
    },
    bonusObjectives: [
      {
        id: 'mars-grade',
        kind: 'grade',
        minGrade: 'A',
        title: { ar: 'يد ثابتة', en: 'Steady hand' },
        description: {
          ar: 'أنهِ الفصل بتقدير A أو أعلى.',
          en: 'Complete the chapter with a grade of A or better.',
        },
      },
      {
        id: 'mars-budget',
        kind: 'budget',
        threshold: 400,
        title: { ar: 'اقتصاد في العاصفة', en: 'Lean through the storm' },
        description: {
          ar: 'أبقِ التكلفة الكلية عند 400 مليون دولار أو أقل.',
          en: 'Keep the total cost at or below $400M.',
        },
      },
    ],
    preset: preset({
      busId: 'medium',
      propulsionId: 'biprop',
      redundancy: 'none',
      radHard: false,
      instruments: ['nac', 'wac', 'visnir', 'thermal', 'mag', 'lidar'],
      launcherId: 'pslv',
      launchWindowId: 'auto',
      transferType: 'hohmann',
      power: { solarAreaM2: 2.5, rtgCount: 0, batteryKg: 10 },
      comms: { antennaId: 'mga', band: 'X', txPowerW: 50, groundStation: 'dsn34' },
      opsDays: 30,
      reservePercent: 12,
      propellantReservePercent: 15,
    }),
  },
  {
    id: 'bennu-letter',
    number: 3,
    code: 'BENNU-2045',
    year: 2045,
    title: { ar: 'رسالة بنّو', en: 'The Bennu Letter' },
    subtitle: { ar: 'مادة أقدم من الذاكرة', en: 'Matter older than memory' },
    targetId: 'bennu',
    missionType: 'sampleReturn',
    difficulty: 'normal',
    successTier: 'basic',
    seed: 'BENNU-2045',
    accent: 'good',
    icon: 'Package',
    prologue: {
      ar: 'بنّو ليس مجرد كويكب. إنه كبسولة زمنية من بداية النظام الشمسي، يمر قرب الأرض كل ست سنوات. عندما حللنا الغبار الذي جمعته بعثة سابقة، وجدنا نظائر لا توجد في أي جسم معروف. كأن قطعة من السماء سقطت في جيب أحدهم.',
      en: 'Bennu is not just an asteroid. It is a time capsule from the birth of the solar system, passing near Earth every six years. When we analysed dust from an earlier mission, we found isotopes that exist on no known body — as if a piece of the sky had fallen into someone’s pocket.',
    },
    briefing: {
      ar: 'أعد عينات من بنّو قبل أن يبتعد. نحتاج المادة نفسها، لا صورة عنها. كل غرام يعود إلى الأرض قد يحمل مفتاح الحلقة الثالثة.',
      en: 'Return samples from Bennu before it drifts away. We need the material itself, not an image of it. Every gram that comes home may hold the key to the third ring.',
    },
    objective: {
      ar: 'اجمع عينة من بنّو وأعدها سالمة إلى الأرض.',
      en: 'Collect a Bennu sample and return it safely to Earth.',
    },
    transmission: {
      ar: '«ما تظنه قديمًا قد يكون رسالة وصلت قبل أن نتعلم القراءة.»',
      en: '“What you think is ancient may be a message that arrived before we learned to read.”',
    },
    epilogue: {
      ar: 'في مختبر العينات، تحت المجهر، لم تكن الصخرة صخرة. كانت طبقات من مادة تعيد ترتيب نفسها عند تسليط الضوء عليها. وفي قلبها، بصمة زمنية عمرها 4.5 مليار سنة — وبصمة ثانية عمرها 26 شهرًا فقط.',
      en: 'In the sample lab, under the microscope, the rock was not a rock. It was layers of material rearranging themselves when light touched them. At its heart lay a 4.5-billion-year-old time signature — and a second signature only 26 months old.',
    },
    bonusObjectives: [
      {
        id: 'bennu-grade',
        kind: 'grade',
        minGrade: 'A',
        title: { ar: 'عينة بلا خسارة', en: 'Sample intact' },
        description: {
          ar: 'أنهِ الفصل بتقدير A أو أعلى.',
          en: 'Complete the chapter with a grade of A or better.',
        },
      },
      {
        id: 'bennu-capsule',
        kind: 'instrument',
        instrumentId: 'sampleCapsule',
        title: { ar: 'كبسولة العودة', en: 'Return capsule' },
        description: {
          ar: 'أعد كبسولة العينات ضمن الحمولة.',
          en: 'Carry the sample-return capsule in the payload.',
        },
      },
    ],
    preset: preset({
      busId: 'medium',
      propulsionId: 'biprop',
      redundancy: 'none',
      radHard: false,
      instruments: ['nac', 'visnir', 'gamma', 'mag', 'sampleCapsule'],
      launcherId: 'falcon9',
      launchWindowId: 'auto',
      transferType: 'hohmann',
      power: { solarAreaM2: 4, rtgCount: 0, batteryKg: 60 },
      comms: { antennaId: 'hga', band: 'X', txPowerW: 80, groundStation: 'dsn34' },
      opsDays: 30,
      reservePercent: 12,
      propellantReservePercent: 15,
    }),
  },
  {
    id: 'venus-trial',
    number: 4,
    code: 'VENUS-2047',
    year: 2047,
    title: { ar: 'محاكمة الزهرة', en: 'The Venus Trial' },
    subtitle: { ar: 'لا شيء يبقى على حاله', en: 'Nothing stays intact' },
    targetId: 'venus',
    missionType: 'lander',
    difficulty: 'normal',
    successTier: 'basic',
    seed: 'VENUS-2047',
    accent: 'violet',
    icon: 'Flame',
    prologue: {
      ar: 'الزهرة لا تترك شيئًا على حاله. الضغط يسحق، والحرارة تذيب، والغلاف الحمضي يأكل ما لا يخاف. أرسلنا ثلاث مركبات في العقد الماضي. عادت واحدة. هذه المرة، المركبة لا تعود: عليها أن ترسل النبضة قبل أن تختفي.',
      en: 'Venus leaves nothing unchanged. Pressure crushes, heat melts, and the acid atmosphere eats whatever is not afraid. We sent three spacecraft over the past decade. One returned. This time the lander is not coming back: it must send the pulse before it disappears.',
    },
    briefing: {
      ar: 'اهبط في السهول الشمالية، وانشر مرحّلًا في الجحيم. الهدف ليس البقاء، بل إسماع الأرض ما تسمعه الزهرة.',
      en: 'Land on the northern plains and deploy a relay in hell. The goal is not to survive; it is to let Earth hear what Venus hears.',
    },
    objective: {
      ar: 'اهبط على الزهرة وانشر المرحّل قبل نهاية عمر المركبة.',
      en: 'Land on Venus and deploy the relay before the lander expires.',
    },
    transmission: {
      ar: '«لا تخف من النار. النار ليست نهاية المادة؛ إنها طريقها إلى شكل آخر.»',
      en: '“Do not fear fire. Fire is not the end of matter; it is its road to another shape.”',
    },
    epilogue: {
      ar: 'قبل أن يذوب المرحّل، وصلت صورة واحدة: تحت سحب الزهرة، أفق معدني يعكس نجمة لا تظهر في سمائنا. وفي الإطار نفسه، ساعة تعدّ تنازليًا. لم يكن العدّ للزهرة. كان لنا.',
      en: 'Before the relay melted, one image arrived: beneath the clouds of Venus, a metallic horizon reflecting a star that does not appear in our sky. In the same frame, a clock was counting down. It was not counting for Venus. It was counting for us.',
    },
    bonusObjectives: [
      {
        id: 'venus-grade',
        kind: 'grade',
        minGrade: 'A',
        title: { ar: 'النصر في الجحيم', en: 'Victory in hell' },
        description: {
          ar: 'أنهِ الفصل بتقدير A أو أعلى.',
          en: 'Complete the chapter with a grade of A or better.',
        },
      },
      {
        id: 'venus-data',
        kind: 'data',
        threshold: 15,
        title: { ar: 'صوت من تحت السحب', en: 'Voice below the clouds' },
        description: {
          ar: 'أرسل 15 GB على الأقل من البيانات.',
          en: 'Return at least 15 GB of data.',
        },
      },
    ],
    preset: preset({
      busId: 'medium',
      propulsionId: 'biprop',
      redundancy: 'none',
      radHard: false,
      instruments: ['nac', 'thermal', 'visnir', 'gamma', 'dust', 'wac', 'gpr'],
      launcherId: 'falcon9',
      launchWindowId: 'auto',
      transferType: 'hohmann',
      power: { solarAreaM2: 2, rtgCount: 0, batteryKg: 60 },
      comms: { antennaId: 'hga', band: 'X', txPowerW: 80, groundStation: 'dsn34' },
      opsDays: 20,
      reservePercent: 12,
      propellantReservePercent: 15,
    }),
  },
  {
    id: 'jupiter-eye',
    number: 5,
    code: 'JUPITER-2049',
    year: 2049,
    title: { ar: 'عين المشتري', en: 'Eye of Jupiter' },
    subtitle: { ar: 'القوة الحقيقية هي البقاء', en: 'Real power is survival' },
    targetId: 'jupiter',
    missionType: 'orbiter',
    difficulty: 'normal',
    successTier: 'basic',
    seed: 'JUPITER-2049',
    accent: 'cyan',
    icon: 'Sun',
    prologue: {
      ar: 'عند المشتري، تصبح الإشارة قوية. لكن المشتري لا يعطي شيئًا مجانًا. حزامه الإشعاعي يمحو الذاكرة، وجاذبيته تسحب كل خطأ حسابي إلى نهايته. المركبة التي تنجح هنا لا تكون محظوظة؛ تكون مصممة.',
      en: 'At Jupiter the signal becomes strong. But Jupiter gives nothing for free. Its radiation belt erases memory, and its gravity drags every calculation error to its conclusion. The spacecraft that succeeds here is not lucky; it is designed.',
    },
    briefing: {
      ar: 'ضع مِرساة في مدار المشتري، واحمِ ذاكرتك من الإشعاع. النبضة الخامسة لا تُسمع إلا من داخل الغلاف المغناطيسي، وهناك لا مكان للضعف.',
      en: 'Place a relay in Jupiter orbit and protect your memory from radiation. The fifth pulse can only be heard inside the magnetosphere, where there is no room for weakness.',
    },
    objective: {
      ar: 'ادخل مدار المشتري والتقط النبضة الخامسة.',
      en: 'Enter Jupiter orbit and capture the fifth pulse.',
    },
    transmission: {
      ar: '«كلما اقتربت من العملاق، أدركت أن القوة الحقيقية ليست في الجاذبية. إنها في القدرة على البقاء.»',
      en: '“The closer you come to the giant, the more you realise real power is not gravity. It is the ability to remain.”',
    },
    epilogue: {
      ar: 'النبضة الخامسة كانت خريطة مصفوفة: مدارات صغيرة حول المشتري، كلها تشير إلى حزام الكويكبات. في المركز: سيريس. في الهامش، ملاحظة بخط لا يعرفه أي نظام كتابة بشري: «المفتاح ينتظر من يجرؤ على النظر.»',
      en: 'The fifth pulse was an array map: small orbits around Jupiter, all pointing into the asteroid belt. At the centre: Ceres. In the margin, a note in a script no human writing system recognises: “The key waits for whoever dares to look.”',
    },
    bonusObjectives: [
      {
        id: 'jupiter-grade',
        kind: 'grade',
        minGrade: 'A',
        title: { ar: 'داخل عين العملاق', en: 'Inside the giant’s eye' },
        description: {
          ar: 'أنهِ الفصل بتقدير A أو أعلى.',
          en: 'Complete the chapter with a grade of A or better.',
        },
      },
      {
        id: 'jupiter-radhard',
        kind: 'radHard',
        title: { ar: 'ذاكرة محصّنة', en: 'Hardened memory' },
        description: {
          ar: 'زوّد المركبة بإلكترونيات مقاومة للإشعاع.',
          en: 'Equip the spacecraft with radiation-hardened electronics.',
        },
      },
    ],
    preset: preset({
      busId: 'small',
      propulsionId: 'biprop',
      redundancy: 'singleFault',
      radHard: true,
      instruments: ['nac', 'mag', 'thermal', 'visnir'],
      launcherId: 'vulcan',
      launchWindowId: 'auto',
      transferType: 'hohmann',
      power: { solarAreaM2: 0, rtgCount: 2, batteryKg: 30 },
      comms: { antennaId: 'hga', band: 'X', txPowerW: 100, groundStation: 'dsn70' },
      opsDays: 30,
      reservePercent: 12,
      propellantReservePercent: 15,
    }),
  },
  {
    id: 'ceres-horizon',
    number: 6,
    code: 'HORIZON-2051',
    year: 2051,
    title: { ar: 'أفق سيريس', en: 'The Ceres Horizon' },
    subtitle: { ar: 'الباب ينتظر من يفتحه', en: 'The door waits to be opened' },
    targetId: 'ceres',
    missionType: 'orbiter',
    difficulty: 'normal',
    successTier: 'basic',
    seed: 'HORIZON-2051',
    accent: 'gold',
    icon: 'Gem',
    prologue: {
      ar: 'سيريس ليس مجرد كوكب قزم. إنه أكبر جسم في حزام الكويكبات، وربما أقدم شاهد على فوضى النظام الشمسي. عندما وصلت آخر نبضة، توقف كل شيء. حتى الساعات في غرفة التحكم تأخرت ثانية. ثم عادت.',
      en: 'Ceres is not just a dwarf planet. It is the largest body in the asteroid belt and perhaps the oldest witness to the solar system’s chaos. When the final pulse arrived, everything stopped. Even the control-room clocks fell one second behind. Then they returned.',
    },
    briefing: {
      ar: 'ادخل مدار سيريس، وواجه القمر الصناعي الذي يختبئ في ظله. النبضة السادسة ليست إشارة استغاثة. إنها مفتاح. وأنت من سيقرر إن كان الباب يُفتح.',
      en: 'Enter Ceres orbit and face the satellite hiding in its shadow. The sixth pulse is not a distress call. It is a key. And you are the one who decides whether the door opens.',
    },
    objective: {
      ar: 'ادخل مدار سيريس وفعّل الأفق.',
      en: 'Enter Ceres orbit and activate the horizon.',
    },
    transmission: {
      ar: '«نحن لا نرسل هذه الرسالة إلى المستقبل. نحن نرسلها إلى من سيصبح مستقبلًا.»',
      en: '“We are not sending this message to the future. We are sending it to whoever becomes the future.”',
    },
    epilogue: {
      ar: 'حين أضاء سيريس، لم يكن هناك انفجار. كان هناك أفق. فتحتان في الفراغ، واحدة فوق الأرض وأخرى تحتنا، تتصلان بخط من الضوء. الرسالة الأخيرة كانت قصيرة: «أفق آمون مفتوح. من الآن، أنتم الجسر.»',
      en: 'When Ceres lit up, there was no explosion. There was a horizon. Two openings in the void, one above Earth and one beneath us, joined by a line of light. The final message was short: “The AMUN Horizon is open. From now on, you are the bridge.”',
    },
    bonusObjectives: [
      {
        id: 'ceres-grade',
        kind: 'grade',
        minGrade: 'S',
        title: { ar: 'نهاية مثالية', en: 'A perfect ending' },
        description: {
          ar: 'أنهِ الفصل بتقدير S.',
          en: 'Complete the chapter with an S grade.',
        },
      },
      {
        id: 'ceres-data',
        kind: 'data',
        threshold: 40,
        title: { ar: 'أرشيف الأفق', en: 'Horizon archive' },
        description: {
          ar: 'أرسل 40 GB على الأقل من البيانات.',
          en: 'Return at least 40 GB of data.',
        },
      },
    ],
    preset: preset({
      busId: 'medium',
      propulsionId: 'biprop',
      redundancy: 'none',
      radHard: false,
      instruments: ['nac', 'wac', 'visnir', 'gpr', 'gamma', 'thermal'],
      launcherId: 'falcon9',
      launchWindowId: 'auto',
      transferType: 'hohmann',
      power: { solarAreaM2: 4, rtgCount: 1, batteryKg: 40 },
      comms: { antennaId: 'hga', band: 'X', txPowerW: 80, groundStation: 'dsn70' },
      opsDays: 45,
      reservePercent: 12,
      propellantReservePercent: 15,
    }),
  },
];

export const campaignChapterById = Object.fromEntries(
  CAMPAIGN_CHAPTERS.map((chapter) => [chapter.id, chapter]),
) as Record<string, CampaignChapter>;

export const campaignChapterIndex = (id: string): number =>
  CAMPAIGN_CHAPTERS.findIndex((chapter) => chapter.id === id);

export function nextCampaignChapter(id: string): CampaignChapter | null {
  const index = campaignChapterIndex(id);
  if (index < 0) return null;
  return CAMPAIGN_CHAPTERS[index + 1] ?? null;
}

export interface CampaignProgress {
  completedCount: number;
  totalStars: number;
  maxStars: number;
  nextChapter: CampaignChapter | null;
  allCompleted: boolean;
}

export function campaignProgress(
  completed: Record<string, CampaignCompletion>,
): CampaignProgress {
  const completedCount = CAMPAIGN_CHAPTERS.filter((chapter) => completed[chapter.id]).length;
  const totalStars = CAMPAIGN_CHAPTERS.reduce(
    (sum, chapter) => sum + (completed[chapter.id]?.stars ?? 0),
    0,
  );
  const nextChapter =
    CAMPAIGN_CHAPTERS.find((chapter) => !completed[chapter.id]) ?? null;
  return {
    completedCount,
    totalStars,
    maxStars: CAMPAIGN_CHAPTERS.length * 3,
    nextChapter,
    allCompleted: completedCount === CAMPAIGN_CHAPTERS.length,
  };
}

/** A complete, legal starting design for a campaign chapter. */
export function campaignChoices(chapter: CampaignChapter, language: Language): DesignChoices {
  return {
    difficulty: chapter.difficulty,
    language,
    seed: chapter.seed,
    missionType: chapter.missionType,
    targetId: chapter.targetId,
    successTier: chapter.successTier,
    ...chapter.preset,
    power: { ...chapter.preset.power },
    comms: { ...chapter.preset.comms },
    instruments: [...chapter.preset.instruments],
  };
}
