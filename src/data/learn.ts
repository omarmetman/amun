import type { DesignResult } from '../engine/model';
import type { LocalizedText, SourceKey } from './types';
import { fmt, fmtMoney, fmtPct } from '../lib/format';

export interface LearnTopic {
  key: string;
  title: LocalizedText;
  summary: LocalizedText;
  points: LocalizedText[];
  formula?: {
    expression: string;
    caption: LocalizedText;
  };
  example?: (design: DesignResult) => LocalizedText;
  sources: SourceKey[];
  ntrsQuery?: string;
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    key: 'objectives',
    title: { ar: 'اختيار الهدف والمعيار', en: 'Choosing a target and success tier' },
    summary: {
      ar: 'الهدف ليس مجرد صورة: مسافته تحدد الطاقة التي يحتاجها الصاروخ، وميله المداري يحدد كلفة تغيير المستوى، وبيئته تحدد ما يمكن أن تفعله المهمة.',
      en: 'A target is more than a picture: its distance sets the energy the launcher must supply, its inclination sets plane-change cost, and its environment limits what the mission can do.',
    },
    points: [
      {
        ar: 'المهلة المدارية: العبور أرخص لكنه يمنح نافذة رصد قصيرة. المدار والهبوط يستهلكان دلتا-في إضافية.',
        en: 'Mission type: a flyby is cheapest but yields a short observation window. Orbit and landing consume extra Δv.',
      },
      {
        ar: 'المسافة الشمسية تؤثر في التدفق الشمسي وفي زمن الرحلة. مسافة الأرض تؤثر في معدل الاتصال.',
        en: 'Heliocentric distance drives solar flux and cruise time. Earth range drives the communication rate.',
      },
      {
        ar: 'معيار النجاح يحدد الحد الأدنى للعلم والبيانات. اختيار معيار طموح لا يزيد التكلفة فحسب، بل يخفض النتيجة إن لم تحققه.',
        en: 'The success tier sets minimum science and data. Choosing an ambitious tier does not add cost, but it lowers the score if you miss it.',
      },
    ],
    formula: {
      expression: 'r → C₃ = (v_transfer − v_Earth)²',
      caption: {
        ar: 'طاقة الإطلاق C3 تقيس مربع السرعة الزائدة فوق سرعة الأرض المدارية.',
        en: 'C3 is the square of the hyperbolic excess speed above Earth’s orbital speed.',
      },
    },
    example: (d) => ({
      ar: `هدفك ${d.target.name.ar} على ${fmt(d.target.sunDistanceAU, 3)} و.ف من الشمس و${fmt(d.target.earthDistanceAU, 3)} و.ف من الأرض، وميله ${fmt(d.target.inclinationDeg, 2)}°. النوع المختار «${d.missionType.name.ar}» ومستوى النجاح «${d.tier.name.ar}».`,
      en: `${d.target.name.en} sits ${fmt(d.target.sunDistanceAU, 3)} AU from the Sun and ${fmt(d.target.earthDistanceAU, 3)} AU from Earth, with a ${fmt(d.target.inclinationDeg, 2)}° inclination. You selected ${d.missionType.name.en} at the ${d.tier.name.en} tier.`,
    }),
    sources: ['horizons', 'sbdb', 'nasaFact', 'basics'],
    ntrsQuery: 'planetary mission design delta-v',
  },
  {
    key: 'spacecraft',
    title: { ar: 'المنصة والموثوقية', en: 'Bus and reliability' },
    summary: {
      ar: 'المنصة هي الهيكل والطاقة والذاكرة. حجمها يحدد ما تستطيع حمله، وموثوقيتها ونظام التكرار يحددان احتمال إكمال المهمة.',
      en: 'The bus provides structure, power and storage. Its size sets what you can carry, while reliability and redundancy set the chance of completing the mission.',
    },
    points: [
      {
        ar: 'التكرار أحادي العطل يضيف نحو 7% من كتلة المنصة، وثنائي العطل نحو 13%، مقابل خفض احتمال الأعطال.',
        en: 'Single-fault redundancy adds about 7% of bus dry mass and dual-fault about 13%, trading mass for lower failure probability.',
      },
      {
        ar: 'الإلكترونيات المقاومة للإشعاع تضيف كتلة وكلفة، لكنها تصبح ضرورة قرب المشتري حيث الإشعاع المحيطي شديد.',
        en: 'Rad-hard electronics add mass and cost but become essential near Jupiter, where trapped radiation is severe.',
      },
      {
        ar: 'نظام الدفع الأيوني كفء جدًا لكنه يستهلك 1200 واط إضافية ويطيل الرحلة. لا تختاره دون فائض طاقة.',
        en: 'Ion propulsion is very efficient but draws an extra 1200 W and lengthens the cruise. Do not choose it without power headroom.',
      },
    ],
    formula: {
      expression: 'm_dry = m_bus + m_instr + m_power + m_comms + m_prop + m_struct',
      caption: {
        ar: 'الكتلة الجافة النهائية هي مجموع الأنظمة والهيكل قبل إضافة الوقود والخزان.',
        en: 'Final dry mass sums the subsystems and structure before tank and propellant are added.',
      },
    },
    example: (d) => ({
      ar: `منصتك ${d.bus.name.ar} بكتلة جافة ${fmt(d.bus.dryMassKg)} كغ وقدرة حمولة ${fmt(d.bus.payloadCapacityKg)} كغ. تكرارك: ${d.choices.redundancy === 'none' ? 'بدون' : d.choices.redundancy === 'singleFault' ? 'أحادي العطل' : 'ثنائي العطل'}، والحماية من الإشعاع ${d.choices.radHard ? 'مفعّلة' : 'غير مفعّلة'}.`,
      en: `Your ${d.bus.name.en} has ${fmt(d.bus.dryMassKg)} kg dry mass and a ${fmt(d.bus.payloadCapacityKg)} kg payload allowance. Redundancy is ${d.choices.redundancy}, and radiation hardening is ${d.choices.radHard ? 'enabled' : 'off'}.`,
    }),
    sources: ['nasaFact', 'ntrs', 'game'],
    ntrsQuery: 'spacecraft bus redundancy radiation hardened',
  },
  {
    key: 'instruments',
    title: { ar: 'حزمة الأجهزة والعائد العلمي', en: 'Instrument suite and science return' },
    summary: {
      ar: 'كل جهاز ينتج قيمة علمية مشروطة بتوافقه مع الهدف، ويستهلك كتلة وطاقة ومعدل بيانات. العلم الحقيقي هو ما يصل إلى الأرض، لا ما يُقاس فقط.',
      en: 'Each instrument yields science proportional to its target affinity while consuming mass, power and data rate. Real science is what reaches Earth, not only what is measured.',
    },
    points: [
      {
        ar: 'معامل التوافق > 1 يعني أن الجهاز يناسب الهدف؛ < 1 يعني أنه غير مناسب لكنه ما زال يضيف قيمة صغيرة.',
        en: 'Affinity above 1 means the instrument suits the target; below 1 means it is poorly matched but still adds a little value.',
      },
      {
        ar: 'مدة العمليات تضاعف العائد ببطء (أس 0.35) لكنها تزيد الكلفة خطيًا. وازن مدة العمليات مع الميزانية.',
        en: 'Operations duration raises science sublinearly (exponent 0.35) but cost linearly. Balance duration against budget.',
      },
      {
        ar: 'البيانات المنتجة تحتاج وصلة قادرة وذاكرة كافية. الجهاز عالي المعدل بلا اتصال مناسب ينتج بيانات تُفقد.',
        en: 'Produced data needs a capable link and enough storage. A high-rate instrument without a matching downlink creates data that is lost.',
      },
    ],
    formula: {
      expression: 'Science = Σ (base_i × affinity_i) × type × ops_factor',
      caption: {
        ar: 'العائد المتوقع قبل أحداث المحاكاة؛ الأحداث وفقدان البيانات يخفضانه.',
        en: 'Projected science before simulation events; events and data loss reduce it.',
      },
    },
    example: (d) => ({
      ar: `حزمتك فيها ${d.instruments.length} أجهزة بكتلة ${fmt(d.instrumentMassKg)} كغ، وعائد متوقع ${fmt(d.science.raw, 1)} نقطة، ومتوسط توافق ${fmt(d.science.averageAffinity, 2)}. معيارك يحتاج ${d.tier.minScience} نقطة.`,
      en: `Your suite has ${d.instruments.length} instruments at ${fmt(d.instrumentMassKg)} kg, projecting ${fmt(d.science.raw, 1)} science points with mean affinity ${fmt(d.science.averageAffinity, 2)}. Your tier requires ${d.tier.minScience}.`,
    }),
    sources: ['nasaFact', 'ntrs', 'game'],
    ntrsQuery: 'planetary science instrument payload mass power data rate',
  },
  {
    key: 'launch',
    title: { ar: 'أداء الإطلاق وC3', en: 'Launch performance and C3' },
    summary: {
      ar: 'لا تشتري صاروخًا بالاسم فقط: الحمولة المتاحة تنخفض مع طاقة C3 المطلوبة. جدول كل صاروخ يربط C3 بالكتلة، واللعبة تستوفي بين النقاط خطيًا.',
      en: 'A launcher is not just a name: available payload falls as required C3 rises. Each rocket has a C3-to-mass table, linearly interpolated by the game.',
    },
    points: [
      {
        ar: 'C3 أعلى = سرعة زائدة أكبر عند مغادرة الأرض = وقود أكثر أو حمولة أقل.',
        en: 'Higher C3 means more hyperbolic excess speed at Earth departure, so more propellant or less payload.',
      },
      {
        ar: 'موثوقية الإطلاق تدخل مباشرة في احتمال فقدان المهمة عند اليوم الأول.',
        en: 'Launch reliability directly affects the chance of losing the mission on day one.',
      },
      {
        ar: 'الصاروخ الأكبر قد يمنح هامش كتلة مريحًا، لكن الهامش فوق 30% يعتبر كتلة غير مستثمرة في التقييم.',
        en: 'A larger rocket can provide a comfortable mass margin, but margins above 30% are scored as uninvested mass.',
      },
    ],
    formula: {
      expression: 'm_payload(C₃) = lerp(C₃ table)',
      caption: {
        ar: 'استيفاء خطي بين نقاط أداء الصاروخ المنشورة تقريبيًا.',
        en: 'Linear interpolation between approximate published performance points.',
      },
    },
    example: (d) => ({
      ar: `عند C3 = ${fmt(d.orbit.c3, 2)} كم²/ث² توفر ${d.launcher.name.ar} حمولة ${fmt(d.mass.launcherCapacityKg)} كغ. كتلتك عند الإطلاق ${fmt(d.mass.wetMassKg)} كغ، أي هامش ${fmtPct(d.mass.massMargin)}.`,
      en: `At C3 = ${fmt(d.orbit.c3, 2)} km²/s², ${d.launcher.name.en} offers ${fmt(d.mass.launcherCapacityKg)} kg. Your launch mass is ${fmt(d.mass.wetMassKg)} kg, a ${fmtPct(d.mass.massMargin)} margin.`,
    }),
    sources: ['launchApprox', 'basics'],
    ntrsQuery: 'launch vehicle performance C3 payload',
  },
  {
    key: 'budget',
    title: { ar: 'الكلفة والاحتياطي', en: 'Cost and reserve' },
    summary: {
      ar: 'الكلفة الكلية = مجموع البنود + احتياطي. الاحتياطي ليس هدرًا: هو ما يمنع حدث تضخم تكلفة من تحويل المهمة إلى تجاوز ميزانية.',
      en: 'Total cost = cost lines + reserve. The reserve is not waste: it prevents a cost-overrun event from turning the mission into a budget breach.',
    },
    points: [
      {
        ar: 'الإطلاق غالبًا أكبر بند منفرد. إن تجاوز 45% من الكلفة فالتصميم غير متوازن.',
        en: 'Launch is often the largest single line. If it exceeds 45% of cost, the design is unbalanced.',
      },
      {
        ar: 'مدة العمليات ترفع كلفة التشغيل ووقت DSN. البيانات والعلم يزيدان أيضًا، لذا القرار مقايضة لا خفض.',
        en: 'Operations duration raises both ops cost and DSN time. Science and data rise too, so this is a trade, not a pure cut.',
      },
      {
        ar: 'احتياطي 10–20% صحي. أقل من 10% يعرضك لحدث تكلفة، وأكثر من 20% يستهلك ميزانية كان يمكن استثمارها.',
        en: 'A 10–20% reserve is healthy. Below 10% exposes you to cost events; above 20% ties up budget that could be invested.',
      },
    ],
    formula: {
      expression: 'C_total = Σ C_i + r × Σ C_i',
      caption: {
        ar: 'الاحتياطي نسبة من مجموع البنود قبل الاحتياطي.',
        en: 'The reserve is a percentage of the pre-reserve subtotal.',
      },
    },
    example: (d) => ({
      ar: `تكلفتك ${fmtMoney(d.cost.totalM)} من ميزانية ${fmtMoney(d.cost.budgetM, 0)}، والمتبقي ${fmtMoney(d.cost.remainingM)}. الاحتياطي ${fmtMoney(d.cost.reserveM)} (${d.choices.reservePercent}%) والوقود ${fmtMoney(d.cost.propellantCostM, 2)}.`,
      en: `You cost ${fmtMoney(d.cost.totalM)} against a ${fmtMoney(d.cost.budgetM, 0)} budget, leaving ${fmtMoney(d.cost.remainingM)}. The reserve is ${fmtMoney(d.cost.reserveM)} (${fmt(d.choices.reservePercent)}%) and propellant costs ${fmtMoney(d.cost.propellantCostM, 2)}.`,
    }),
    sources: ['game', 'ntrs'],
    ntrsQuery: 'mission cost reserve operations budget',
  },
  {
    key: 'power',
    title: { ar: 'الطاقة الشمسية والكسوف', en: 'Solar power and eclipse' },
    summary: {
      ar: 'الألواح تولد من التدفق الشمسي، والتدفق يتناقص مع مربع المسافة. كل نظام له ثلاثة أحمال: الإبحار، العلم، والنمط الآمن. البطارية تغطي الكسوف حيث لا شمس.',
      en: 'Arrays generate from solar flux, which falls with distance squared. The system has three loads: cruise, science and safe mode. The battery covers eclipse when there is no sunlight.',
    },
    points: [
      {
        ar: 'كفاءة الخلايا 28% وعامل التعبئة 0.9 وتدهور 2.5% سنويًا. هذه قيم تخطيط مبسطة للعبة.',
        en: 'Cell efficiency is 28%, packing 0.9 and annual degradation 2.5%. These are simplified planning values.',
      },
      {
        ar: 'عند 2.5 و.ف وما بعدها يصبح التدفق ضعيفًا؛ RTG خيار عملي رغم كتلته وكلفته.',
        en: 'Beyond about 2.5 AU flux is weak; RTGs become practical despite their mass and cost.',
      },
      {
        ar: 'هامش كل نمط = (المولّد − الحمل) / الحمل. الهدف 10% على الأقل، والنطاق الأمثل للتقييم 10–30%.',
        en: 'Mode margin = (generated − load) / load. Aim for at least 10%, with 10–30% scoring best.',
      },
    ],
    formula: {
      expression: 'S = 1361 / r²  |  P = A × S × 0.28 × 0.9 × (1−0.025)^years',
      caption: {
        ar: 'التدفق الشمسي ثم قدرة المصفوفة بعد الكفاءة والتعبئة والتدهور.',
        en: 'Solar flux, then array output after efficiency, packing and degradation.',
      },
    },
    example: (d) => ({
      ar: `التدفق عند الهدف ${fmt(d.power.solarFluxTargetWM2)} واط/م² وعند الإبحار ${fmt(d.power.solarFluxCruiseWM2)} واط/م². لوحك ${fmt(d.power.solarAreaM2, 1)} م² يولد ${fmt(d.power.modes.science.generatedW)} واط مقابل حمل ${fmt(d.power.modes.science.loadW)} واط، أي هامش ${fmtPct(d.power.modes.science.margin)}.`,
      en: `Flux is ${fmt(d.power.solarFluxTargetWM2)} W/m² at the target and ${fmt(d.power.solarFluxCruiseWM2)} W/m² in cruise. Your ${fmt(d.power.solarAreaM2, 1)} m² array generates ${fmt(d.power.modes.science.generatedW)} W against a ${fmt(d.power.modes.science.loadW)} W load: a ${fmtPct(d.power.modes.science.margin)} margin.`,
    }),
    sources: ['nasaFact', 'ntrs', 'game'],
    ntrsQuery: 'solar array power degradation deep space RTG',
  },
  {
    key: 'mass',
    title: { ar: 'معادلة الصاروخ والكتلة', en: 'Rocket equation and mass' },
    summary: {
      ar: 'معادلة تسيولكوفسكي تربط دلتا-في بنسبة الكتلة الرطبة إلى الجافة. مع كتلة خزان تتناسب مع الوقود، يمكن حل كتلة الوقود في صيغة مغلقة.',
      en: 'Tsiolkovsky links Δv to the wet-to-dry mass ratio. With tank mass proportional to propellant, the required propellant has a closed-form solution.',
    },
    points: [
      {
        ar: 'x = Δv / (Isp·g0). إذا كان مقام الحل ≤ 0 فلا توجد كمية وقود تكفي؛ يجب رفع Isp أو تقليل Δv.',
        en: 'x = Δv / (Isp·g0). If the denominator is ≤ 0, no amount of propellant suffices; raise Isp or cut Δv.',
      },
      {
        ar: 'سعة الصاروخ قد تقيد الوقود. حينها ينخفض دلتا-في المتاح عن المطلوب، وتظهر مشكلة حقيقية لا مجرد تحذير.',
        en: 'Launcher capacity may cap propellant. Available Δv then falls below required, producing a real shortfall rather than a cosmetic warning.',
      },
      {
        ar: 'الهامش الأكبر ليس أفضل دائمًا: 10–30% يوازن القدرة على التصحيح مع عدم هدر سعة الإطلاق.',
        en: 'A bigger margin is not always better: 10–30% balances correction capability against wasting launch capacity.',
      },
    ],
    formula: {
      expression: 'm_p = m_other(e^x − 1) / (1 − k(e^x − 1)),  x = Δv/(Isp·g₀)',
      caption: {
        ar: 'm_other هي الكتلة الجافة بلا خزان، وk نسبة كتلة الخزان إلى الوقود.',
        en: 'm_other is dry mass excluding the tank, and k is tank mass per unit propellant.',
      },
    },
    example: (d) => ({
      ar: `Isp = ${fmt(d.propulsion.ispS)} ث وk = ${fmt(d.propulsion.tankFraction, 2)}. تطلب ${fmt(d.orbit.requiredDvMS)} م/ث مع احتياطي ${d.choices.propellantReservePercent}% فوقود ${fmt(d.mass.propellantKg)} كغ. الكتلة الرطبة ${fmt(d.mass.wetMassKg)} كغ والجافة ${fmt(d.mass.dryMassKg)} كغ.`,
      en: `Isp = ${fmt(d.propulsion.ispS)} s and k = ${fmt(d.propulsion.tankFraction, 2)}. The ${fmt(d.orbit.requiredDvMS)} m/s requirement plus a ${d.choices.propellantReservePercent}% reserve needs ${fmt(d.mass.propellantKg)} kg of propellant. Wet mass is ${fmt(d.mass.wetMassKg)} kg and dry mass ${fmt(d.mass.dryMassKg)} kg.`,
    }),
    sources: ['basics', 'ntrs', 'game'],
    ntrsQuery: 'rocket equation propellant mass tank fraction',
  },
  {
    key: 'comms',
    title: { ar: 'وصلة الاتصال والمسافة', en: 'The link and distance' },
    summary: {
      ar: 'معدل البيانات يتناسب عكسيًا مع مربع المسافة، وطرديًا مع قدرة الإرسال ومربع قطر الهوائي والكسب الأرضي. البيانات التي لا تُرسل تبقى في الذاكرة حتى تمتلئ.',
      en: 'Data rate falls with the square of distance and rises with transmit power, antenna diameter squared and ground gain. Undelivered data waits in memory until it fills.',
    },
    points: [
      {
        ar: 'نطاق Ka يضاعف الكسب أربع مرات (16× في القدرة) لكنه يضيف كلفة وتعقيدًا.',
        en: 'Ka-band provides a 4× amplitude gain (16× in power) at added cost and complexity.',
      },
      {
        ar: 'هوائي 70 م يضاعف الكسب 4.2 مرة مقارنة بـ34 م، لكنه أكثر كلفة وتنافسًا على الجدولة.',
        en: 'A 70 m station offers 4.2× ground gain over 34 m, at higher cost and scheduling pressure.',
      },
      {
        ar: 'الذاكرة مؤقتة: إن تجاوز الإنتاج قدرة الإرسال والذاكرة معًا، تُفقد البيانات وتخفض العلم.',
        en: 'Storage is temporary: if production exceeds downlink plus storage, data is lost and science falls.',
      },
    ],
    formula: {
      expression: 'R = R_ref (P/100)(D/3)² f_Ka² (0.5/d)² G',
      caption: {
        ar: 'نموذج وصلة مبسط؛ يتجاهل المطر والزوايا والترميز.',
        en: 'A simplified link model that ignores rain, elevation and coding.',
      },
    },
    example: (d) => ({
      ar: `عند ${fmt(d.comms.distanceAU, 3)} و.ف يبلغ المعدل ${fmt(d.comms.dataRateKbps, 1)} كيلوبت/ث مع ${fmt(d.comms.linkHoursPerDay, 1)} ساعة/يوم. ينتج العلم ${fmt(d.comms.producedTotalGb, 2)} GB ويُرسل ${fmt(d.comms.sentTotalGb, 2)} GB، ويضيع ${fmt(d.comms.lostTotalGb, 2)} GB.`,
      en: `At ${fmt(d.comms.distanceAU, 3)} AU the link reaches ${fmt(d.comms.dataRateKbps, 1)} kbit/s with ${fmt(d.comms.linkHoursPerDay, 1)} h/day. Science produces ${fmt(d.comms.producedTotalGb, 2)} GB, sends ${fmt(d.comms.sentTotalGb, 2)} GB and loses ${fmt(d.comms.lostTotalGb, 2)} GB.`,
    }),
    sources: ['dsn', 'nasaFact', 'game'],
    ntrsQuery: 'deep space network link budget data rate',
  },
  {
    key: 'orbit',
    title: { ar: 'المدار والانتقال ودلتا-في', en: 'Orbit, transfer and Δv' },
    summary: {
      ar: 'مهمة انتقال Hohmann تستخدم نصف قطع ناقص، وزمنها يتبع القانون الثالث لكبلر. تغيير المستوى المداري يستهلك 2v sin(i/2)، ولذلك يميل الهدف المائل إلى الكلفة.',
      en: 'A Hohmann transfer uses half an ellipse, with duration set by Kepler’s third law. A plane change costs 2v sin(i/2), which is why inclined targets are expensive.',
    },
    points: [
      {
        ar: 'المسار السريع يرفع C3 ودلتا-في لكنه يقلل الزمن. المساعدة الجاذبية تخفض C3 وترفع الزمن والمخاطر.',
        en: 'A fast trajectory raises C3 and Δv but cuts time. Gravity assists lower C3 while increasing time and risk.',
      },
      {
        ar: 'ميزانية دلتا-في تشمل TCM وتغيير المستوى والالتقاط والهبوط والتشغيل القريب والإرجاع.',
        en: 'The Δv budget covers TCM, plane change, capture, landing, proximity operations and return.',
      },
      {
        ar: 'هامش دلتا-في المتاح يأتي من احتياطي الوقود. أقل من 10% يرفع خطر الالتقاط وأحداث المناورة.',
        en: 'Available Δv margin comes from the propellant reserve. Below 10%, capture risk and manoeuvre anomalies rise.',
      },
    ],
    formula: {
      expression: 't_H = ½√(a³) years  |  Δv_plane = 2v sin(i/2)',
      caption: {
        ar: 'زمن الانتقال بنصف المحور a بالوحدات الفلكية، وكلفة تغيير المستوى.',
        en: 'Transfer time from semi-major axis a in AU, and plane-change cost.',
      },
    },
    example: (d) => ({
      ar: `C3 = ${fmt(d.orbit.c3, 2)} كم²/ث² وزمن الانتقال ${fmt(d.orbit.transferDays, 1)} يوم. المطلوب ${fmt(d.orbit.requiredDvMS)} م/ث والمتاح ${fmt(d.orbit.availableDvMS)} م/ث، أي هامش ${fmtPct(d.orbit.dvMargin)}.`,
      en: `C3 is ${fmt(d.orbit.c3, 2)} km²/s² with a ${fmt(d.orbit.transferDays, 1)}-day transfer. Required Δv is ${fmt(d.orbit.requiredDvMS)} m/s against ${fmt(d.orbit.availableDvMS)} m/s available: a ${fmtPct(d.orbit.dvMargin)} margin.`,
    }),
    sources: ['basics', 'sbdb', 'game'],
    ntrsQuery: 'Hohmann transfer delta-v plane change trajectory',
  },
  {
    key: 'simulation',
    title: { ar: 'الحتمية والبذرة', en: 'Determinism and seeds' },
    summary: {
      ar: 'المحاكاة دالة حتمية: f(التصميم، البذرة) = النتيجة نفسها دائمًا. هذا يسمح بمقارنة قرارات التصميم دون ضوضاء عشوائية.',
      en: 'The simulation is deterministic: f(design, seed) always equals the same result. That lets you compare design decisions without random noise.',
    },
    points: [
      {
        ar: 'كل حدث عشوائي يسحب من مولد Mulberry32 متسلسل. تغيير البذرة يغير السلسلة بالكامل.',
        en: 'Every event draws from a sequential Mulberry32 generator. Changing the seed changes the whole sequence.',
      },
      {
        ar: 'الأحداث تستهلك الهوامش ولا تغير الفيزياء. عاصفة شمسية قد تسبب نمطًا آمنًا يوقف العلم لكنها لا تخلق وقودًا.',
        en: 'Events consume margins and do not change the physics. A solar storm may force safe mode and pause science, but it cannot create propellant.',
      },
      {
        ar: 'استخدم «البذرة نفسها» لإعادة التصميم مع الاحتفاظ بسلسلة الأحداث، و«من الصفر» لتجربة جديدة كاملة.',
        en: 'Use “same seed” to redesign against an identical event sequence, or “from scratch” for a completely new run.',
      },
    ],
    formula: {
      expression: 'result = f(design, seed);  f is pure',
      caption: {
        ar: 'لا وقت حقيقي ولا عشوائية خارجية تدخل في النتيجة.',
        en: 'No wall-clock time or external randomness enters the result.',
      },
    },
    example: (d) => ({
      ar: `بذرتك الحالية ${d.choices.seed}. أي إعادة تشغيل بالتصميم نفسه ستعطي النتيجة نفسها، بما فيها الأحداث: عاصفة شمسية أو تعارض جدولة أو نمط آمن.`,
      en: `Your seed is ${d.choices.seed}. Any rerun with the same design reproduces the same result, including events such as solar storms, scheduling conflicts or safe mode.`,
    }),
    sources: ['game', 'basics'],
  },
  {
    key: 'evaluation',
    title: { ar: 'كيف تُحسب النتيجة؟', en: 'How the score works' },
    summary: {
      ar: 'النتيجة من 100: العلم 35، كفاءة الميزانية 20، الهوامش الهندسية 20، والموثوقية والتنفيذ 25. التقييم يقرأ السبب لا النتيجة فقط.',
      en: 'The score is out of 100: science 35, budget efficiency 20, engineering margins 20, reliability and execution 25. The report explains causes, not just points.',
    },
    points: [
      {
        ar: 'العلم يقاس مقابل 1.25× حدّ المعيار، لا مقابل الصفر. تجاوز الحد يمنح نقاطًا كاملة.',
        en: 'Science is measured against 1.25× the tier threshold, not zero. Exceeding it awards full points.',
      },
      {
        ar: 'الهوامش تُقيّم ضمن نطاق 10–30%. الهامش الكبير جدًا يفقد نقاطًا لأنه كتلة أو سعة غير مستثمرة.',
        en: 'Margins are scored within 10–30%. Oversized margins lose points as unused mass or capacity.',
      },
      {
        ar: 'الموثوقية تعتمد على نجاح المهمة وعدد الأحداث. فشل الإرجاع يبقي جزءًا من العلم، لذا يُعامل كنجاح جزئي.',
        en: 'Reliability depends on mission success and event load. A failed return leg preserves some science and counts as partial success.',
      },
    ],
    formula: {
      expression: 'Score = 35·S + 20·B + 20·M + 25·R',
      caption: {
        ar: 'S علم، B ميزانية، M هوامش، R موثوقية. الدرجات S/A/B/C/D/F.',
        en: 'S science, B budget, M margins, R reliability. Grades run S/A/B/C/D/F.',
      },
    },
    example: (d) => ({
      ar: `تصميمك يطمح إلى ${fmt(d.tier.minScience)} نقطة علم و${d.tier.minDataGb} GB بيانات. تقييم الهوامش يستخدم الكتلة ${fmtPct(d.mass.massMargin)} والطاقة ${fmtPct(Math.min(d.power.modes.cruise.margin, d.power.modes.science.margin, d.power.modes.safe.margin))} ودلتا-في ${fmtPct(d.orbit.dvMargin)}.`,
      en: `Your design targets ${d.tier.minScience} science points and ${d.tier.minDataGb} GB of data. Margin scoring uses mass ${fmtPct(d.mass.massMargin)}, power ${fmtPct(Math.min(d.power.modes.cruise.margin, d.power.modes.science.margin, d.power.modes.safe.margin))} and Δv ${fmtPct(d.orbit.dvMargin)}.`,
    }),
    sources: ['game'],
    ntrsQuery: 'mission success criteria science evaluation',
  },
  {
    key: 'radiation',
    title: { ar: 'الإشعاع والحماية', en: 'Radiation and hardening' },
    summary: {
      ar: 'الأشعة الكونية والجسيمات المحيطة تسبب أخطاء ذاكرة وأعطالًا. الحماية تقلل الاحتمال لكنها تضيف كتلة وكلفة وطاقة.',
      en: 'Cosmic rays and trapped particles cause memory upsets and faults. Hardening reduces the probability but adds mass, cost and power.',
    },
    points: [
      {
        ar: 'المشتري أخطر بيئة إشعاعية في النظام الشمسي الداخلي؛ الحماية هناك ليست رفاهية.',
        en: 'Jupiter is the harshest radiation environment in the inner solar system; hardening there is not optional.',
      },
      {
        ar: 'عاصفة شمسية قد تدفع المركبة إلى النمط الآمن. الحماية تقلل الخسارة لكنها لا تلغيها.',
        en: 'A solar storm may force safe mode. Hardening reduces losses but does not eliminate them.',
      },
    ],
    sources: ['nasaFact', 'ntrs', 'basics'],
    ntrsQuery: 'space radiation shielding electronics Jupiter',
  },
  {
    key: 'reliability',
    title: { ar: 'التكرار الوقائي', en: 'Redundancy' },
    summary: {
      ar: 'نسخة احتياطية من وظيفة حرجة تعني أن عطلًا واحدًا لا ينهي المهمة. الثمن كتلة وكلفة واستهلاك طاقة، والفائدة انخفاض احتمال الفشل.',
      en: 'A backup for a critical function means one failure does not end the mission. The price is mass, cost and power; the benefit is lower failure probability.',
    },
    points: [
      {
        ar: 'التكرار يؤثر في أحداث محددة: تحديد النجوم، الاصطدامات، وأعطال الأجهزة.',
        en: 'Redundancy affects specific events: star-tracker anomalies, impacts and instrument failures.',
      },
      {
        ar: 'لا تشترِ تكرارًا ثنائيًا لمهمة صغيرة بميزانية ضيقة؛ وازن الخطر مع الكلفة.',
        en: 'Do not buy dual redundancy for a small, tightly budgeted mission; balance risk against cost.',
      },
    ],
    sources: ['ntrs', 'game'],
    ntrsQuery: 'spacecraft redundancy fault tolerance reliability',
  },
  {
    key: 'arrival',
    title: { ar: 'الوصول والالتقاط', en: 'Arrival and capture' },
    summary: {
      ar: 'الالتقاط هو اللحظة التي تدفع فيها دلتا-في لإدخال المركبة في مدار الهدف. خطرها يعتمد على بيئة الهدف وهامش الدلتا-في ونوع المسار.',
      en: 'Capture is the burn that places the spacecraft into orbit around the target. Its risk depends on the target environment, Δv margin and transfer type.',
    },
    points: [
      {
        ar: 'هامش أقل من 10% يضاعف خطر الفشل عند الالتقاط تقريبًا.',
        en: 'A margin below 10% roughly doubles the chance of capture failure.',
      },
      {
        ar: 'الأهداف ذات الخطورة العالية مثل المشتري والمذنبات تتطلب تكرارًا وحماية أكبر.',
        en: 'High-hazard targets such as Jupiter and comets require more redundancy and protection.',
      },
    ],
    sources: ['basics', 'game'],
    ntrsQuery: 'orbit insertion capture delta-v risk',
  },
  {
    key: 'return',
    title: { ar: 'إرجاع العينة', en: 'Sample return' },
    summary: {
      ar: 'إرجاع العينة يضيف رحلة عودة وكبسولة ومخاطرة جديدة، لكنه يضاعف قيمة العلم لأن المادة تُحلّل في مختبرات الأرض.',
      en: 'Sample return adds a return leg and capsule plus new risk, but multiplies science value because material is analysed in Earth laboratories.',
    },
    points: [
      {
        ar: 'إذا فُقدت العينة أثناء العودة تبقى البيانات عن بُعد، لذا لا تنهار النتيجة كليًا.',
        en: 'If the sample is lost on return, remote data survives, so the score does not collapse completely.',
      },
      {
        ar: 'تأكد من توافق الهدف ونوع المهمة قبل إضافة الكبسولة؛ وإلا فستحصل على خطأ مانع.',
        en: 'Check target and mission-type compatibility before adding the capsule, or you get a blocking error.',
      },
    ],
    sources: ['basics', 'game'],
    ntrsQuery: 'sample return capsule entry descent landing',
  },
  {
    key: 'smallBodies',
    title: { ar: 'الأجسام الصغيرة والمذنبات', en: 'Small bodies and comets' },
    summary: {
      ar: 'جاذبية الكويكبات ضئيلة، لذا الالتقاء والتشغيل القريب أصعب مما يبدو. المذنبات تضيف غازًا وغبارًا يهددان الأجهزة.',
      en: 'Asteroid gravity is tiny, so rendezvous and proximity operations are harder than they look. Comets add gas and dust that threaten instruments.',
    },
    points: [
      {
        ar: 'مطياف الغبار يحول نشاط المذنب من خطر إلى بيانات، ويقلل احتمال الأحداث السلبية.',
        en: 'A dust spectrometer turns comet activity from a hazard into data and reduces adverse-event probability.',
      },
      {
        ar: 'الميل المداري العالي للمذنبات يجعل تغيير المستوى مكلفًا جدًا.',
        en: 'High cometary inclinations make plane changes extremely expensive.',
      },
    ],
    sources: ['sbdb', 'nasaImages', 'ntrs'],
    ntrsQuery: 'small body rendezvous comet proximity operations',
  },
  {
    key: 'gravityAssist',
    title: { ar: 'المساعدة الجاذبية', en: 'Gravity assists' },
    summary: {
      ar: 'المرور قرب كوكب يستعير زخمه المداري لتغيير مسار المركبة دون وقود كبير، لكنه يفرض نوافذ هندسية دقيقة ومسارًا أطول.',
      en: 'A planetary flyby borrows orbital momentum to bend the trajectory without much propellant, but imposes tight geometry and a longer path.',
    },
    points: [
      {
        ar: 'في اللعبة يخفض المسار المساعد C3 إلى 55% لكنه يطيل الزمن 45% ويضيف مخاطر تصحيح.',
        en: 'In the game an assist path cuts C3 to 55% but lengthens travel by 45% and adds correction risk.',
      },
    ],
    sources: ['basics', 'ntrs'],
    ntrsQuery: 'gravity assist trajectory design',
  },
];

const topicByKey = Object.fromEntries(LEARN_TOPICS.map((topic) => [topic.key, topic])) as Record<
  string,
  LearnTopic
>;

export const LEARN_ALIASES: Record<string, string> = {
  deltaV: 'orbit',
  launch: 'launch',
  arrival: 'arrival',
  return: 'return',
  radiation: 'radiation',
  redundancy: 'reliability',
  landing: 'arrival',
  scienceOps: 'instruments',
  comet: 'smallBodies',
  gravityAssist: 'gravityAssist',
  power: 'power',
  comms: 'comms',
  budget: 'budget',
};

const STEP_TOPIC: Record<number, string> = {
  1: 'objectives',
  2: 'spacecraft',
  3: 'instruments',
  4: 'launch',
  5: 'budget',
  6: 'power',
  7: 'mass',
  8: 'comms',
  9: 'orbit',
  10: 'simulation',
  11: 'evaluation',
};

export const learnTopicForStep = (step: number): LearnTopic =>
  topicByKey[STEP_TOPIC[step] ?? 'objectives'] ?? LEARN_TOPICS[0];

export const learnTopicForEvent = (learnKey: string): LearnTopic | undefined => {
  const key = LEARN_ALIASES[learnKey] ?? learnKey;
  return topicByKey[key];
};

export const learnTopicByKey = (key: string): LearnTopic | undefined => topicByKey[key];
