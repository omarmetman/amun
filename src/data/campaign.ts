import type {
  CampaignChapter,
  CampaignCompletion,
  DesignChoices,
  Language,
  LocalizedText,
} from './types';

/**
 * AMUN Horizon: the game's six-chapter story campaign.
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
  years: '2041–2051',
  tagline: {
    ar: 'ستة فصول. إشارة واحدة. أفق لا يعود منه من يصل إليه كما كان.',
    en: 'Six chapters. One signal. A horizon that changes everyone who reaches it.',
  },
  overview: {
    ar: 'في عام 2041، ضربت العاصفة الشمسية الكبرى شبكة الاتصال العميق. من بين الأنقاض، بدأت نبضة غامضة تتكرر كل 26 شهرًا من ستة مواقع في النظام الشمسي. أنت قائد برنامج آمون. مهمتك: إعادة بناء سلسلة المرسلات، وتتبع الإشارة من القمر إلى سيريس، واكتشاف ما ينتظر عند الأفق.',
    en: 'In 2041, the Great Solar Storm struck the deep-space communications lattice. From the wreckage, a mysterious pulse began repeating every 26 months from six locations across the solar system. You command the AMUN programme. Your mission: rebuild the relay chain, follow the signal from the Moon to Ceres, and discover who, or what, is waiting at the horizon.',
  },
  hook: {
    ar: 'لم تكن الإشارة دعوة. كانت اختبارًا. ومن يجيب، عليه أن يبني الطريق بيديه.',
    en: 'The signal was not an invitation. It was a test. Whoever answers must build the road with their own hands.',
  },
  finale: {
    ar: 'لم تكن الإشارة نداءً من كائنات بعيدة. كانت بنية تحتية لم تبنها البشرية، تركتها حضارة سبقتنا بملايين السنين كي تختبر من يصل. في 2051، وقفت البشرية على حافة سيريس، ونظرت إلى ما وراء الأفق. لم تعد الأرض مركز الكون. صارت أول جسر إليه.',
    en: 'The signal was not a call from distant beings. It was infrastructure humanity did not build, left by a civilisation millions of years ahead of us to test who would arrive. In 2051, humanity stood at the edge of Ceres and looked beyond the horizon. Earth was no longer the centre of the universe. It became its first bridge.',
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
      en: 'On 3 March 2041, the Great Solar Storm tore the communication lattice between Earth and orbit. When the control room came back online, the Moon was broadcasting a pulse no one could explain: 1420.405 MHz, every 26 months; the hydrogen line with which the universe writes its silence.',
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
      ar: 'خلف القمر، وجدت المركبة هوائيًا أقدم من برنامج آمون نفسه، يعيد بث شيفرة على شكل خريطة. الخريطة لا تشير إلى القمر. تشير إلى المريخ، وإلى نقطة ثانية على الكوكب الأحمر لم تكن في أي سجل.',
      en: 'Behind the Moon, the spacecraft found an antenna older than the AMUN programme itself, rebroadcasting a map-shaped code. The map did not point to the Moon. It pointed to Mars, and to a second site on the Red Planet absent from every record.',
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
    nasaDossier: {
      benchmarkMission: {
        ar: 'مسبار الاستطلاع القمري NASA LRO ومهمة LCROSS',
        en: 'NASA Lunar Reconnaissance Orbiter (LRO) & LCROSS',
      },
      historicalPrecedent: {
        ar: 'أثبتت قياسات مقياس الارتفاع الليزري LOLA ومستشعر الحرارة Diviner وجود جليد مائي نقي محاصر في فوهات القطب الجنوبي المظلمة دائمًا مثل فوهة شاكلتون.',
        en: 'LOLA laser altimetry and Diviner thermal data proved pristine water ice is cold-trapped in permanently shadowed polar craters like Shackleton.',
      },
      realWorldFacts: [
        {
          ar: 'الجاذبية السطحية للقمر هي 1.62 م/ث² (سدس جاذبية الأرض)، وسرعة الإفلات 2.38 كم/ث.',
          en: 'Lunar surface gravity is 1.62 m/s² (1/6th Earth), and escape velocity is 2.38 km/s.',
        },
        {
          ar: 'الجانب البعيد من القمر هو أهدأ بيئة كهرومغناطيسية في النظام الشمسي الداخلي لحجبه الضوضاء الراديوية للأرض تمامًا.',
          en: 'The lunar far side is the quietest electromagnetic environment in the inner solar system, completely shielded from terrestrial RFI.',
        },
        {
          ar: 'تتراوح درجات الحرارة السطحية بين -130°C أثناء الليل القمري و+120°C عند الظهيرة.',
          en: 'Surface temperatures swing from -130°C during the lunar night to +120°C at lunar noon.',
        },
      ],
      primaryChallenge: {
        ar: 'البقاء خلال الكسوف القمري والتعامل مع التدرجات الحرارية الشديدة بين النور والظلام.',
        en: 'Surviving lunar eclipses and extreme thermal gradients between sunlit and shadowed sectors.',
      },
      engineeringHint: {
        ar: 'احرص على بطارية لا تقل عن 10 كجم لتجاوز فترات الكسوف. مساحة ألواح شمسية 2.5 م² كافية تمامًا عند 1.0 AU.',
        en: 'Ensure a battery of at least 10 kg to survive eclipses. A solar area of 2.5 m² is ample at 1.0 AU.',
      },
      orbitalData: {
        distanceAU: '0.00257 AU (384,400 km)',
        gravityMs2: 1.62,
        escapeVelocityKms: 2.38,
        solarIrradianceWm2: 1361,
        oneWayLightTimeMinutes: 0.021,
      },
    },
    environmentalHazards: [
      {
        id: 'lunarThermalShock',
        name: { ar: 'صدمة حرارية ليلية', en: 'Lunar Night Thermal Shock' },
        severity: 'moderate',
        description: {
          ar: 'انخفاض سريع لدرجة الحرارة إلى ما دون -130°C يتطلب تفريغ بطاريات منتظم لتشغيل سخانات الأجهزة.',
          en: 'Rapid plunge below -130°C requiring steady battery draw to maintain instrument survival heaters.',
        },
        mitigation: {
          ar: 'تخصيص سعة بطارية كافية مع تدفئة كهروحرارية ذاتية.',
          en: 'Allocate sufficient battery capacity with autonomous electric heaters.',
        },
      },
      {
        id: 'regolithAdhesion',
        name: { ar: 'التصاق الغبار الكهروستاتيكي', en: 'Electrostatic Regolith Dust Adhesion' },
        severity: 'low',
        description: {
          ar: 'جسيمات الغبار المشحونة كهرومغناطيسيًا تلتصق بالعدسات والألواح وتقلل كفاءة الرصد.',
          en: 'Electrostatically lofted sub-micron dust clings to optics and panels, reducing transmission.',
        },
        mitigation: {
          ar: 'تنظيف أجهزة الاستشعار واستخدام طلاءات مضادة للشحن الكهروستاتيكي.',
          en: 'Optical baffles and conductive indium-tin-oxide surface coatings.',
        },
      },
    ],
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
    nasaDossier: {
      benchmarkMission: {
        ar: 'مركبة استطلاع المريخ NASA MRO ومسبار MAVEN ومسبار الأمل',
        en: 'NASA Mars Reconnaissance Orbiter (MRO), MAVEN & Hope Probe',
      },
      historicalPrecedent: {
        ar: 'كشفت كاميرا HiRISE ومسبار MAVEN عن معدلات تجريد الرياح الشمسية للغلاف الجوي المريخي الرقيق بمعدل 100 غرام/ثانية، ورصدت ديناميكيات العواصف الغبارية العالمية.',
        en: 'HiRISE imagery and MAVEN revealed solar wind sputtering strips Mars upper atmosphere at 100 g/s, tracking global dust storm dynamics.',
      },
      realWorldFacts: [
        {
          ar: 'متوسط بعد المريخ عن الشمس 1.524 AU، مما يقلص التدفق الشمسي إلى 590 واط/م² فقط (43% من الأرض).',
          en: 'Mars sits at 1.524 AU, reducing solar irradiance to only 590 W/m² (43% of Earth).',
        },
        {
          ar: 'الغلاف الجوي رقيق للغاية بضغط سطحي 610 باسكال (أقل من 1% من ضغط الأرض) ومعظمه ثاني أكسيد الكربون.',
          en: 'Surface pressure averages 610 Pa (<1% of Earth), composed of 95% carbon dioxide.',
        },
        {
          ar: 'العواصف الغبارية العالمية تحجب ما يصل إلى 99% من ضوء الشمس الساقط لعدة أشهر متواصلة.',
          en: 'Global dust storms can block up to 99% of incident sunlight for months at a time.',
        },
      ],
      primaryChallenge: {
        ar: 'انخفاض الطاقة الشمسية وتلاشي الإشارة الراديوية عبر مسافات سحيقة تصل إلى 2.5 AU في نقطة الاقتران.',
        en: 'Solar power degradation and telecom attenuation across distances up to 2.5 AU at conjunction.',
      },
      engineeringHint: {
        ar: 'استخدم نطاق X أو Ka مع هوائي MGA/HGA، وارفع مساحة الألواح الشمسية إلى 4 م² أو ادعمها ببطارية احتياطية أكبر.',
        en: 'Deploy X or Ka band with an MGA/HGA antenna, and expand solar array to 4 m² or boost battery reserves.',
      },
      orbitalData: {
        distanceAU: '1.524 AU (227.9M km)',
        gravityMs2: 3.72,
        escapeVelocityKms: 5.03,
        solarIrradianceWm2: 586,
        oneWayLightTimeMinutes: 12.6,
      },
    },
    environmentalHazards: [
      {
        id: 'martianDustStorm',
        name: { ar: 'عاصفة غبارية كوكبية', en: 'Planet-Encircling Dust Storm' },
        severity: 'critical',
        description: {
          ar: 'غبار أكسيد الحديد المعلق في الغلاف الجوي يحجب الإشعاع الشمسي بنسبة تصل إلى 80%.',
          en: 'Atmospheric ferric oxide dust elevates optical depth above 4.0, cutting solar flux by 80%.',
        },
        mitigation: {
          ar: 'تكبير مساحة الألواح بنسبة 35% وإضافة بطاريات ذات سعة تفريغ ممتدة.',
          en: 'Oversize solar array margins and maintain deep-cycle lithium-ion reserves.',
        },
      },
      {
        id: 'solarWindSputtering',
        name: { ar: 'تجريد الرياح الشمسية', en: 'Solar Wind Induced Atmospheric Drag' },
        severity: 'moderate',
        description: {
          ar: 'تفاعلات الرياح الشمسية غير المصدودة بغلاف مغناطيسي تسبب اضطرابات في كثافة الغلاف الجوي العلوي.',
          en: 'Unshielded solar wind interactions cause unpredictable scale height expansions in the exobase.',
        },
        mitigation: {
          ar: 'رفع الحضيض المداري لتجنب مقاومة الغاز المتبقي.',
          en: 'Maintain periapsis above 250 km to minimize atmospheric torque and decay.',
        },
      },
    ],
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
      en: 'Bennu is not just an asteroid. It is a time capsule from the birth of the solar system, passing near Earth every six years. When we analysed dust from an earlier mission, we found isotopes that exist on no known body, as if a piece of the sky had fallen into someone’s pocket.',
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
      ar: 'في مختبر العينات، تحت المجهر، لم تكن الصخرة صخرة. كانت طبقات من مادة تعيد ترتيب نفسها عند تسليط الضوء عليها. وفي قلبها، بصمة زمنية عمرها 4.5 مليار سنة، وبصمة ثانية عمرها 26 شهرًا فقط.',
      en: 'In the sample lab, under the microscope, the rock was not a rock. It was layers of material rearranging themselves when light touched them. At its heart lay a 4.5-billion-year-old time signature, and a second signature only 26 months old.',
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
    nasaDossier: {
      benchmarkMission: {
        ar: 'مهمة NASA OSIRIS-REx لجمع عينات الكويكبات',
        en: 'NASA OSIRIS-REx Asteroid Sample Return Mission',
      },
      historicalPrecedent: {
        ar: 'أكدت قياسات OSIRIS-REx أن كويكب بنو عبارة عن كومة ركامية مسامية غنية بالكربون والمعادن المائية يعود تاريخها إلى فجر النظام الشمسي.',
        en: 'OSIRIS-REx confirmed Bennu is a microgravity rubble-pile asteroid rich in carbon and hydrated minerals from the dawn of the solar system.',
      },
      realWorldFacts: [
        {
          ar: 'الجاذبية السطحية متناهية الصغر وتبلغ 0.000008 م/ث²، مما يجعل التماسك بين أجزائه ناتجاً عن قوى فان دير فالس.',
          en: 'Surface gravity is an ultra-weak 0.000008 m/s², where cohesive forces dominate over gravity.',
        },
        {
          ar: 'يغير تأثير ياركوفسكي الحراري مدار بنو بمقدار 284 متراً سنوياً.',
          en: 'The Yarkovsky thermal thrust shifts Bennus orbit by 284 meters every year.',
        },
        {
          ar: 'عادت كبسولة عينات OSIRIS-REx إلى الأرض في سبتمبر 2023 محملة بـ 121.6 غرام من المادة البكر.',
          en: 'The OSIRIS-REx capsule returned to Earth in Sep 2023 with 121.6 g of pristine asteroid material.',
        },
      ],
      primaryChallenge: {
        ar: 'توفير دلتا-في مضاعفة للذهاب والعودة، مع حمل كبسولة عينات ثقيلة ودرع إعادة الدخول.',
        en: 'Providing two-way Delta-V for Earth departure and return while hauling a heavy sample capsule and heat shield.',
      },
      engineeringHint: {
        ar: 'اختر صاروخ فالكون 9 لتأمين طاقة إطلاق C3 عالية، وحافظ على كبسولة العينات ضمن الحمولة، واستخدم مرحلة دفع ثنائية.',
        en: 'Select Falcon 9 to secure high C3 launch energy, keep the sample capsule loaded, and use bipropellant propulsion.',
      },
      orbitalData: {
        distanceAU: '1.126 AU (168.4M km)',
        gravityMs2: 0.000008,
        escapeVelocityKms: 0.0002,
        solarIrradianceWm2: 1073,
        oneWayLightTimeMinutes: 9.3,
      },
    },
    environmentalHazards: [
      {
        id: 'particleEjection',
        name: { ar: 'انبعاث جسيمات من السطح', en: 'Active Surface Particle Ejection' },
        severity: 'moderate',
        description: {
          ar: 'ينفث بنو شظايا صخرية دقيقة في الفضاء المحيط بسبب التكسر الحراري للنيازك الدقيقة.',
          en: 'Thermal fracturing triggers spontaneous ejection of centimeter-scale pebbles into proximity orbit.',
        },
        mitigation: {
          ar: 'الحفاظ على مسار طيران نسبي وتحديد مسافة اقتراب آمنة.',
          en: 'Adopt hyperbolic flyby trajectories with standoff distances during initial survey.',
        },
      },
      {
        id: 'surfaceFluidity',
        name: { ar: 'مقاومة سطحية غير متماسكة', en: 'Porous Regolith Fluidization' },
        severity: 'critical',
        description: {
          ar: 'يتصرف السطح كسائل غير متماسك تحت الضغط مما قد يبتلع أذرع أخذ العينات إذا لم تكن مزودة بآلية ارتداد فوري.',
          en: 'Surface behaves like a fluid bed upon contact; touching without immediate back-away thrusters risks sinking.',
        },
        mitigation: {
          ar: 'استخدام آلية TAGSAM مجهزة بغاز نيتروجين مضغوط مع مناورة ارتداد فورية.',
          en: 'Deploy nitrogen gas burst with autonomous reverse burn within 5 seconds of touch.',
        },
      },
    ],
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
    nasaDossier: {
      benchmarkMission: {
        ar: 'مهمات NASA DAVINCI و VERITAS وماجلان',
        en: 'NASA DAVINCI, VERITAS & Magellan Missions',
      },
      historicalPrecedent: {
        ar: 'رسم رادار ماجلان 98% من تضاريس الزهرة البركانية، وتستعد مهمة DAVINCI للغوص عبر الغلاف الجوي لقياس الغازات النبيلة والحرارة.',
        en: 'Magellan radar mapped 98% of Venus volcanic topography, while DAVINCI prepares to probe noble gases in the deep atmosphere.',
      },
      realWorldFacts: [
        {
          ar: 'الضغط الجوي السطحي 92 بار يعادل الغوص 900 متر تحت محيطات الأرض.',
          en: 'Surface atmospheric pressure is 92 bar, equivalent to 900 m depth in Earth oceans.',
        },
        {
          ar: 'تصل درجة الحرارة السطحية إلى 465°C بسبب الاحتباس الحراري الفائق، كافية لصهر الرصاص.',
          en: 'Surface heat reaches 465°C due to runaway greenhouse effect, hot enough to melt lead.',
        },
        {
          ar: 'سحب حمض الكبريتيك المركزة بين ارتفاع 48 و68 كم تعكس 75% من ضوء الشمس.',
          en: 'Sulfuric acid cloud decks between 48 and 68 km reflect 75% of sunlight.',
        },
      ],
      primaryChallenge: {
        ar: 'الانهيار الحراري السريع وانعدام الضوء على السطح مما يمنع الألواح الشمسية.',
        en: 'Rapid thermal soak and darkness at the surface making solar panels useless.',
      },
      engineeringHint: {
        ar: 'اعتمد على البطاريات فقط للهبوط مع بطارية 60 كجم، واستخدم درعًا حراريًا، ونطاق X عالي القدرة مع محطة DSN 34.',
        en: 'Rely solely on chemical batteries (60 kg) for descent with heat shielding and high-power X-band.',
      },
      orbitalData: {
        distanceAU: '0.723 AU (108.2M km)',
        gravityMs2: 8.87,
        escapeVelocityKms: 10.36,
        solarIrradianceWm2: 2601,
        oneWayLightTimeMinutes: 6.0,
      },
    },
    environmentalHazards: [
      {
        id: 'supercriticalAcid',
        name: { ar: 'وسط حمضي فائق الحرج', en: 'Supercritical Acidic Medium' },
        severity: 'critical',
        description: {
          ar: 'غلاف جوي من ثاني أكسيد الكربون فائق الحرج مشبع ببخار حمض الكبريتيك يهاجم الوصلات المعدنية المكشوفة.',
          en: 'Dense supercritical CO2 laced with sulfuric acid vapors rapidly corrodes structural seals.',
        },
        mitigation: {
          ar: 'تغليف الهيكل بسبائك التيتانيوم ومواد السيراميك العازلة.',
          en: 'Encase vital electronics in hermetically sealed titanium pressure spheres.',
        },
      },
      {
        id: 'thermalRunaway',
        name: { ar: 'انفلات حراري سطحي', en: 'Surface Thermal Soak' },
        severity: 'critical',
        description: {
          ar: 'درجة حرارة 465°C تخترق العوازل تدريجيًا وتسبب فشل الدوائر المتكاملة خلال ساعتين.',
          en: 'Ambient 738 K temperatures overwhelm passive insulation, degrading silicon chips within 120 minutes.',
        },
        mitigation: {
          ar: 'استخدام بطاريات امتصاص حراري ونقل أكبر قدر من البيانات أثناء الهبوط المظلي.',
          en: 'Phase-change thermal sinks and prioritized high-rate data downlink during parachute descent.',
        },
      },
    ],
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
    nasaDossier: {
      benchmarkMission: {
        ar: 'مهمات NASA جونو ويوروبا كليبر وغاليليو',
        en: 'NASA Juno, Europa Clipper & Galileo Missions',
      },
      historicalPrecedent: {
        ar: 'أثبتت قياسات غاليليو وجونو أن حزام إشعاع المشتري يحمل ملايين الإلكترونات النسبية المحصورة، وتتطلب المهمات خزنة تيتانيوم سميكة لحماية الإلكترونيات.',
        en: 'Galileo and Juno proved Jupiters radiation belts trap relativistic electrons, requiring heavy titanium vaults to protect electronics.',
      },
      realWorldFacts: [
        {
          ar: 'بعد المشتري 5.20 AU يقلص الطاقة الشمسية إلى 50 واط/م² فقط (أقل من 4% من الأرض).',
          en: 'Jupiter at 5.20 AU slashes solar flux to 50 W/m² (<4% of Earth).',
        },
        {
          ar: 'الحقل المغناطيسي أقوى بـ 20,000 مرة من الأرض ويولد إشعاع سنكروتروني فتاك.',
          en: 'The magnetic field is 20,000x stronger than Earth, generating lethal synchrotron radiation.',
        },
        {
          ar: 'جاذبية المشتري الهائلة تتطلب دلتا-في كبح مداري ضخمة أو مناورات مساعدة جاذبية دقيقة.',
          en: 'Massive Jovian gravity requires substantial orbital capture Delta-V or precision gravity assists.',
        },
      ],
      primaryChallenge: {
        ar: 'التلف الإشعاعي الفوري وعجز الألواح الشمسية العادية على هذا البعد السحيق.',
        en: 'Severe radiation damage and total insufficiency of regular solar arrays at 5.2 AU.',
      },
      engineeringHint: {
        ar: 'استخدم مولدين نوويين RTG، وفعّل تدريع الإشعاع (radHard: true)، وتواصل عبر هوائي DSN 70m.',
        en: 'Equip 2 nuclear RTGs, enable radiation hardening (radHard: true), and link via DSN 70m dish.',
      },
      orbitalData: {
        distanceAU: '5.204 AU (778.5M km)',
        gravityMs2: 24.79,
        escapeVelocityKms: 59.5,
        solarIrradianceWm2: 50.3,
        oneWayLightTimeMinutes: 43.2,
      },
    },
    environmentalHazards: [
      {
        id: 'jovianSynchrotron',
        name: { ar: 'أحزمة إشعاع سنكروتروني قاسية', en: 'Severe Jovian Synchrotron Belts' },
        severity: 'critical',
        description: {
          ar: 'جسيمات مشحونة عالية الطاقة تخترق المكونات وتسبب أخطاء بتات مفردة (SEUs) أو انهيار عوازل السيليكون.',
          en: 'Trapped relativistic electrons induce Single Event Upsets (SEUs) and deep dielectric charging.',
        },
        mitigation: {
          ar: 'تفعيل خيار الإلكترونيات المقاومة للإشعاع (Radiation Hardening) مع هيكل تيتانيوم مضاعف.',
          en: 'Mandate rad-hardened silicon-on-insulator chips shielded by titanium vaults.',
        },
      },
      {
        id: 'extremeLightLag',
        name: { ar: 'تأخر الإشارة الراديوية (43 دقيقة)', en: '43-Minute One-Way Light Delay' },
        severity: 'moderate',
        description: {
          ar: 'التأخير الزمني الضخم يجعل التحكم المباشر من الأرض مستحيلاً ويتطلب إدارة ذاتية كاملة.',
          en: 'Huge round-trip telecom latency rules out human-in-the-loop crisis intervention.',
        },
        mitigation: {
          ar: 'برمجة خوارزميات إبحار ذاتية واختيار محطة DSN 70 م لزيادة معامل الكسب.',
          en: 'Deploy autonomous fault protection and utilize DSN 70m high-gain downlink.',
        },
      },
    ],
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
    nasaDossier: {
      benchmarkMission: {
        ar: 'مهمة NASA داون (Dawn) لكوكب سيريس القزم',
        en: 'NASA Dawn Mission to Dwarf Planet Ceres',
      },
      historicalPrecedent: {
        ar: 'اكتشف مسبار Dawn بقع أوكاتور الساطعة (Cerealia Faculae) المكونة من كربونات الصوديوم الناتجة عن محيط ملحي جوفي متجمد وبراكين جليدية (Ahuna Mons).',
        en: 'Dawn discovered the bright faculae of Occator Crater formed by sodium carbonate brine from a relict subsurface reservoir and cryovolcano Ahuna Mons.',
      },
      realWorldFacts: [
        {
          ar: 'سيريس هو أكبر جسم في حزام الكويكبات بقطر 940 كم ويحتوي على ثلث كتلة الحزام بالكامل.',
          en: 'Ceres is the largest asteroid belt body (940 km diameter), holding 1/3 of the entire belt mass.',
        },
        {
          ar: 'يقع سيريس عند 2.77 AU، وتدفق الشمس عليه 177 واط/م².',
          en: 'Ceres orbits at 2.77 AU with a solar flux of 177 W/m².',
        },
        {
          ar: 'سرعة الإفلات 0.51 كم/ث وجاذبيته 0.28 م/ث²، مما يتيح مدارات علمية منخفضة وفعالة.',
          en: 'Escape velocity is 0.51 km/s with gravity of 0.28 m/s², enabling highly efficient low mapping orbits.',
        },
      ],
      primaryChallenge: {
        ar: 'تحقيق تقدير امتياز S ونقل حجم بيانات علمية ضخم يتجاوز 40 جيجابايت مع هامش ميزانية منضبط.',
        en: 'Achieving an S-rank debrief while downlinking a massive 40+ GB scientific payload under tight budget.',
      },
      engineeringHint: {
        ar: 'اجمع بين ألواح شمسية 4 م² ومولد RTG واحد، وضع هوائي HGA مع تردد Ka لنقل البيانات بأعلى سرعة.',
        en: 'Combine 4 m² solar arrays with 1 RTG, and use an HGA on Ka-band for maximum data throughput.',
      },
      orbitalData: {
        distanceAU: '2.767 AU (413.9M km)',
        gravityMs2: 0.28,
        escapeVelocityKms: 0.51,
        solarIrradianceWm2: 177,
        oneWayLightTimeMinutes: 23.0,
      },
    },
    environmentalHazards: [
      {
        id: 'micrometeoroidBelt',
        name: { ar: 'كثافة نيازك حزام الكويكبات', en: 'Main Asteroid Belt Debris Flux' },
        severity: 'moderate',
        description: {
          ar: 'العبور في قلب حزام الكويكبات يرفع احتمالية الاصطدامات النيزكية الدقيقة.',
          en: 'Transit through the main asteroid belt increases cumulative micrometeoroid collision probability.',
        },
        mitigation: {
          ar: 'تضمين طبقات Whipple shield واختيار تكرار الأنظمة الفردية.',
          en: 'Equip Kevlar Whipple bumpers and single-fault redundancy.',
        },
      },
      {
        id: 'cryoVaporPlumes',
        name: { ar: 'أبخرة تسامي جليدية عابرة', en: 'Transient Water Vapor Sublimation' },
        severity: 'low',
        description: {
          ar: 'تسامي جليد الماء السطحي تحت أشعة الشمس قد يولد قوى عزم دورانية خفيفة على المركبة.',
          en: 'Localized sublimation of water ice near sub-solar points generates faint torques on attitude control.',
        },
        mitigation: {
          ar: 'معايرة عجلات العزم (Reaction Wheels) لمقاومة الاضطراب الطفيف.',
          en: 'Trim reaction wheel desaturation cycles during low-altitude passes.',
        },
      },
    ],
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
