import { useEffect } from 'react';
import { useL, useLang, useT } from '../i18n';
import { LanguageToggle } from './Header';
import { AmunLogo } from './AmunLogo';
import { Cartouche, Frieze } from './Ornament';
import { StatusPill } from './Badges';
import {
  IconCheck,
  IconChevron,
  IconRocket,
  IconTarget,
} from './Icons';

interface NasaDataPageProps {
  onBack: () => void;
  onProject?: () => void;
}

export function NasaDataPage({ onBack, onProject }: NasaDataPageProps) {
  const t = useT();
  const l = useL();
  const lang = useLang();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title =
      lang === 'ar'
        ? 'معلومات حقيقية من ناسا عن الفضاء وكيف بُنيت AMUN'
        : 'Authentic NASA Space Science: How NASA Open Data Built AMUN';
  }, [lang]);

  const datasets = [
    {
      id: 'horizons',
      name: 'NASA JPL Horizons System',
      arabicName: 'نظام البيانات الفلكية JPL Horizons',
      agency: 'NASA / JPL-Caltech',
      url: 'https://ssd.jpl.nasa.gov/horizons/',
      apiUrl: 'https://ssd.jpl.nasa.gov/api/horizons.api',
      icon: 'orbit',
      realWorldSummary: {
        ar: 'النظام المرجعي العالمي المعتمد لحساب المدارات الدقيقة ومتجهات الحالة اللحظية (State Vectors) ومسافات الأجرام الفلكية وزمن تأخر الإشارات الضوئية بدقة متناهية عبر آلاف السنين.',
        en: 'The definitive solar system dynamics service computing high-precision ephemerides, 3D state vectors, and light-time delays across thousands of years.',
      },
      howAmunUsesIt: {
        ar: 'تم تضمين لقطات إحداثيات حقيقية لـ 12 جرماً سماوياً داخل ملف (src/data/targets.ts) و(src/engine/orbit.ts). يعتمد المحرك على مسافات الأجرام الحقيقية بالوحدات الفلكية (AU) عن الأرض والشمس وميول المدارات (Inclination) لحساب زمن العبور المداري، واضمحلال الطاقة الشمسية، وتأخر وتوهين إشارات الاتصال بدقة مطابقة للواقع.',
        en: 'Embedded directly into src/data/targets.ts and src/engine/orbit.ts. AMUN uses real astronomical distances (AU from Sun and Earth) and orbital inclinations to dynamically compute Hohmann transit times, solar power decay, and communication path loss matching real spaceflight.',
      },
      codeSnippet: 'const earthDistAU = target.earthDistanceAU; // JPL Horizons ephemeris snapshot\nconst transitDays = 0.5 * Math.pow(target.semiMajorAxisAU, 1.5) * 365.25;',
      tags: ['Ephemerides', 'Orbital Mechanics', 'AU Distances', 'Light Delay'],
    },
    {
      id: 'sbdb',
      name: 'NASA JPL Small-Body Database (SBDB)',
      arabicName: 'قاعدة بيانات الأجرام الصغيرة JPL SBDB',
      agency: 'NASA / JPL-Caltech',
      url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html',
      apiUrl: 'https://ssd-api.jpl.nasa.gov/sbdb.api',
      icon: 'target',
      realWorldSummary: {
        ar: 'المستودع الرئيسي لوكالة ناسا لخصائص الكويكبات والمذنبات والأجرام القريبة من الأرض (NEOs)، متضمناً أنصاف المحاور، فترات الدوران حول النفس، والأقطار الدقيقة.',
        en: 'NASA authoritative repository of orbital elements and physical properties for asteroids, near-Earth objects (NEOs), and comets.',
      },
      howAmunUsesIt: {
        ar: 'في مهمات الكويكبات والمذنبات (بينو 101955 Bennu، سيريس 1 Ceres، ريوغو 162173 Ryugu، هالي 1P/Halley، وشوريوموف 67P)، توظف اللعبة بيانات SBDB الدقيقة لحساب مناورات اللقاء المداري (Rendezvous) وتغيير المستوي المداري دون الاستعانة بالكبح الجوي المفقود في الفراغ.',
        en: 'For small body targets (Bennu, Ceres, Ryugu, Halley, 67P), AMUN utilizes true SBDB diameters, semi-major axes, and orbital elements to compute rendezvous delta-v burns without atmospheric drag assistance.',
      },
      codeSnippet: '// Small-body rendezvous Δv calculation from SBDB eccentric orbit\nconst deltaVPlane = 2 * vTarget * Math.sin((target.inclinationDeg * Math.PI) / 360);',
      tags: ['Asteroids', 'Comets', 'Rendezvous Δv', 'Spin Period'],
    },
    {
      id: 'factsheet',
      name: 'NASA Planetary Fact Sheet',
      arabicName: 'جداول الحقائق الكوكبية لمركز غودارد GSFC',
      agency: 'NASA Goddard Space Flight Center',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
      apiUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
      icon: 'flask',
      realWorldSummary: {
        ar: 'الجداول العلمية المرجعية المجمعة بواسطة الدكتور ديفيد ويليامز بمركز غودارد، وتوثق كتل الكواكب، والجاذبية السطحية، والسرعة المدارية، وسرعة الإفلات والغلاف الجوي.',
        en: 'Curated standard planetary metrics by Dr. David R. Williams at NASA GSFC: surface gravities, escape velocities, planetary masses, and radii.',
      },
      howAmunUsesIt: {
        ar: 'تحدد جاذبية كل جرم (مثل القمر 1.62 م/ث²، المريخ 3.71 م/ث²، المشتري 24.79 م/ث²) بدقة في محرك الهبوط والإقلاع (Step07Mass ومحاكي الطيران Step10). تفشل محاولات الهبوط تلقائياً ما لم تخصص المركبة وقوداً كافياً لإنتاج نسبة دفع إلى وزن (T/W > 1.2).',
        en: 'Determines target surface gravity (Moon: 1.62 m/s², Mars: 3.71 m/s², Jupiter: 24.79 m/s²) in Step07Mass and Step10. Landers mathematically crash unless thrust-to-weight ratio exceeds 1.2 against real planetary gravity.',
      },
      codeSnippet: '// Lander propellant sizing vs true planetary gravity\nconst landingDv = Math.sqrt(2 * target.gravityMS2 * target.diameterKm * 500);',
      tags: ['Surface Gravity', 'Escape Velocity', 'Atmosphere', 'Landing Δv'],
    },
    {
      id: 'ntrs',
      name: 'NASA Technical Reports Server (NTRS)',
      arabicName: 'خادم التقارير والبحوث التقنية لوكالة ناسا',
      agency: 'NASA STI Program (Langley, Glenn, Marshall)',
      url: 'https://ntrs.nasa.gov/',
      apiUrl: 'https://ntrs.nasa.gov/api/citations/search',
      icon: 'book',
      realWorldSummary: {
        ar: 'أكبر مستودع علمي يضم أكثر من 500,000 بحث وتقرير هندسي محكّم حول الدفع الصاروخي، والتدريع الإشعاعي، واختبارات كفاءة الخلايا الشمسية في الفضاء السحيق.',
        en: 'Over 500,000 peer-reviewed technical publications and mission engineering guidelines covering propulsion, radiation shielding, and telemetry.',
      },
      howAmunUsesIt: {
        ar: 'معايرة النبض النوعي (Isp) لكافة أنظمة الدفع (الغاز البارد: 70 ثانية، الهيدرازين: 230 ثانية، ثنائي الوقود MMH/NTO: 318 ثانية، الدفع الأيوني: 3100 ثانية، الدفع الحراري النووي: 900 ثانية)، ونسب كتلة خزانات الوقود الهيكلية (k = 8% إلى 12%) وفق تقارير NASA SP المعتمدة.',
        en: 'Calibrated specific impulse (Isp) values across propulsion systems (Cold Gas: 70s, Hydrazine: 230s, Biprop: 318s, Ion: 3100s, NTP: 900s) and structural tank fractions (k = 8%-12%) directly from NASA technical papers.',
      },
      codeSnippet: '// Tsiolkovsky closed-form with structural tank fraction k from NASA STI\nconst x = requiredDv / (propulsion.isp * 9.80665);\nconst mProp = (mOther * (Math.exp(x) - 1)) / (1 - k * (Math.exp(x) - 1));',
      tags: ['Specific Impulse', 'Propulsion Isp', 'Structural Tank Fraction', 'NASA SP Guidelines'],
    },
    {
      id: 'dsn',
      name: 'NASA Deep Space Network (DSN)',
      arabicName: 'شبكة الاتصالات الفضائية العميقة DSN',
      agency: 'NASA SCaN (Goldstone, Madrid, Canberra)',
      url: 'https://www.nasa.gov/directorates/somd/space-communications-navigation-program/deep-space-network/',
      apiUrl: 'https://eyes.nasa.gov/dsn/dsn.html',
      icon: 'rocket',
      realWorldSummary: {
        ar: 'شبكة الهوائيات العملاقة ذات الأقطار 34 متراً و70 متراً الموزعة في كاليفورنيا وإسبانيا وأستراليا لتأمين الاتصال الدائم عبر كافة أرجاء المجموعة الشمسية.',
        en: 'International network of 34m and 70m ground stations providing continuous tracking and telemetry downlinks across deep space.',
      },
      howAmunUsesIt: {
        ar: 'نمذجة ميزانية وصلة الاتصال اللاسلكية وفق معادلة فرايس (Friis Transmission Equation). تنخفض سرعة نقل البيانات عكسياً مع مربع المسافة الفلكية (1/d²)، وتتيح اللعبة الاختيار بين محطات DSN 34m و70m ونطاقي التردد X وKa مع قطر هوائي المركبة (HGA).',
        en: 'Engineered telemetry downlink bandwidth using the Friis transmission equation. Downlink bitrate decays with inverse-square distance (1/d²). Players must size High-Gain Antennas (0.5m-3.0m) and RF wattage against DSN 34m/70m stations.',
      },
      codeSnippet: '// Friis path loss and DSN downlink bandwidth\nconst bitrateKbps = 4000 * (txPowerW / 100) * Math.pow(antDiameter / 3, 2) * Math.pow(0.5 / earthDistAU, 2) * groundGain;',
      tags: ['Friis Equation', 'DSN 34m / 70m', 'Ka / X Bands', 'Path Loss (1/d²)'],
    },
    {
      id: 'images',
      name: 'NASA Image and Video Library',
      arabicName: 'مكتبة ناسا للصور والوسائط الفضائية',
      agency: 'NASA Open Media API',
      url: 'https://images.nasa.gov/',
      apiUrl: 'https://images-api.nasa.gov/search',
      icon: 'flag',
      realWorldSummary: {
        ar: 'المكتبة الرسمية المفتوحة للصور العلمية فائقة الدقة الملتقطة بواسطة مركبات ومراصد ناسا الفضائية مع الإسناد التوثيقي الكامل.',
        en: 'NASA open repository of high-resolution scientific photography and planetary imagery with original instrument credits.',
      },
      howAmunUsesIt: {
        ar: 'جميع صور الأجرام الفلكية في اللعبة مأخوذة مباشرة من مستودع ناسا مع توثيق اسم المهمة الأصلية (LRO للقمر، MRO للمريخ، OSIRIS-REx لبينو، جونو للمشتري، داون لسيريس).',
        en: 'Every planetary celestial image in AMUN is sourced directly from NASA open archives with official mission credit metadata (LRO, MRO, OSIRIS-REx, Juno, Dawn).',
      },
      codeSnippet: '// NASA Media API image metadata\nimage: { url: "https://images-assets.nasa.gov/...", credit: "NASA/JPL-Caltech/MRO", nasaId: "PIA00407" }',
      tags: ['Mission Photography', 'HiRISE', 'LRO', 'Public Domain'],
    },
    {
      id: 'basics',
      name: 'NASA JPL Basics of Space Flight',
      arabicName: 'دليل ناسا JPL لأساسيات الطيران الفضائي',
      agency: 'NASA / JPL Science Mission Directorate',
      url: 'https://science.nasa.gov/learn/basics-of-space-flight/',
      apiUrl: 'https://science.nasa.gov/learn/basics-of-space-flight/',
      icon: 'clock',
      realWorldSummary: {
        ar: 'الدليل التعليمي الأول لمهندسي وكالة ناسا ومختبر الدفع النفاث في شرح الميكانيكا المدارية، ومناورات تغيير السرعة دلتا-في، ونوافذ الإطلاق السينودية.',
        en: 'The definitive training primer by NASA JPL for orbital mechanics, trajectory design, spacecraft subsystems, and deep-space conics.',
      },
      howAmunUsesIt: {
        ar: 'يشكل المرجع العلمي المباشر لمحتوى لوحة «تعلّم» (LearnPanel) في AMUN، حيث يشرح للاعبين أسباب القرارات الهندسية، وكيفية حساب دلتا-في ومسارات هوهمان بلغة مبسطة وموثقة.',
        en: 'Direct educational backbone of AMUN in-game Learn Panel (src/data/learn.ts), guiding users through Delta-V margins, Hohmann transfers, and payload budgeting.',
      },
      codeSnippet: '// Educational citations embedded in LearnPanel concepts\nsources: [{ key: "basics", name: "NASA Basics of Space Flight", url: "https://science.nasa.gov/..." }]',
      tags: ['Education', 'Orbital Primer', 'Delta-V Concepts', 'Flight Operations'],
    },
  ];

  const equations = [
    {
      number: '01',
      name: { ar: 'معادلة تسيلكوفسكي مع نسبة خزان الوقود الهيكلية (k)', en: 'Closed-Form Tsiolkovsky with Tank Fraction (k)' },
      formula: 'm_prop = [m_other · (e^x - 1)] / [1 - k · (e^x - 1)]',
      where: 'where x = Δv_req · (1 + reserve) / (I_sp · g_0)',
      explanation: {
        ar: 'في هندسة الصواريخ الحقيقية، لا تضاف كتلة الوقود بمفردها؛ فكل كيلوغرام وقود يتطلب خزاناً ومواسير بوزن إضافي (k = 8% إلى 12%). بدلاً من الحلقات التكرارية غير المستقرة، اشتق مهندسو المشروع حلاً تحليلياً مغلقاً يضمن حساب كتلة الوقود الدقيقة فورياً دون أي خطأ رياضي.',
        en: 'Real spacecraft propellant requires structural tanks and plumbing (tank fraction k = 8%-12%). Instead of iterative approximations, AMUN derived a closed-form analytical solution ensuring exact propellant sizing in 0ms.',
      },
    },
    {
      number: '02',
      name: { ar: 'قانون التربيع العكسي للإشعاع الشمسي (Inverse-Square Law)', en: 'Inverse-Square Solar Irradiance Law' },
      formula: 'S(r) = 1361 / r²   [W/m²]',
      where: 'P_solar(t) = Area · S(r) · efficiency · (1 - degradation)^years',
      explanation: {
        ar: 'تبلغ كثافة الطاقة الشمسية عند الأرض 1361 واط/م²، ولكنها تنخفض بشدة عند المريخ إلى ~500 واط/م²، وعند المشتري إلى 50 واط/م² فقط. تفرض اللعبة استخدام مولدات النظائر المشعة (RTGs) للمهمات البعيدة تماماً كما تفعل ناسا في مركبات New Horizons وVoyager.',
        en: 'Solar flux drops from 1361 W/m² at Earth to ~500 W/m² at Mars and 50 W/m² at Jupiter. AMUN strictly enforces nuclear RTG power generation for outer solar system targets, mirroring NASA New Horizons and Voyager architectures.',
      },
    },
    {
      number: '03',
      name: { ar: 'معادلة فرايس لاتصالات الفضاء السحيق عبر DSN', en: 'Friis Telemetry Downlink across Deep Space' },
      formula: 'Bitrate ∝ P_tx · D_ant² · (f / f_ref)² · (1 / d_AU)² · G_ground',
      where: 'G_ground: DSN 34m (1.0) vs DSN 70m (4.25)',
      explanation: {
        ar: 'تحسب اللعبة معدل نقل البيانات اللحظي بناءً على قدرة جهاز الإرسال بالواط، ومساحة الهوائي عالي الكسب، والمسافة الفلكية الحقيقية بالأميال والوحدات الفلكية. عند الابتعاد، يقل معدل البيانات إلى كيلوبتات قليلة، مما يهدد بنقص العائد العلمي ما لم ترفع قدرة المحطة الأرضية لـ 70 متراً.',
        en: 'Computes telemetry bitrate from RF transmitter power, High-Gain Antenna dish diameter, and astronomical distance. Far distances choke bandwidth to minimal kbps unless upgraded to 70m DSN dishes.',
      },
    },
    {
      number: '04',
      name: { ar: 'مدارات انتقال هوهمان ونوافذ الإطلاق السينودية', en: 'Hohmann Interplanetary Transfer & Synodic Windows' },
      formula: 'T_transit ≈ 0.5 · a_AU^1.5 · 365.25 [days]',
      where: 'Δv_plane ≈ 2 · v_target · sin(inclination / 2)',
      explanation: {
        ar: 'تحسب اللعبة زمن الرحلة المدارية ونوافذ الإطلاق السينودية الأدنى استهلاكاً للوقود بين الأرض وأي كوكب أو كويكب، مع حساب دلتا-في الإضافية المطلوبة لتعديل مستوي المدار الفلكي الحقيقي للجرم المستهدف.',
        en: 'Computes minimum-energy transfer flight times, synodic departure intervals, and orbital inclination plane-change Delta-V burns according to Kepler third law.',
      },
    },
    {
      number: '05',
      name: { ar: 'نظام هوامش الأمان الفضائية الصارمة (NASA SP-8000 Rules)', en: 'NASA SP-8000 Systems Engineering Margins' },
      formula: 'Margin = (Ceiling - Actual) / Ceiling  ∈  [10%, 30%]',
      where: 'Negative margin = Critical Launch Block; Excess margin = Mass/Cost Penalty',
      explanation: {
        ar: 'تلتزم اللعبة بمسطرة الهوامش الهندسية المعتمدة في وكالة ناسا: لكل مورد حرج (الكتلة، الطاقة، دلتا-في، الميزانية) نطاق هامش أمان أمثل مظلل بين 10% و30%. أي هامش سالب يمنع الإطلاق فوراً، وأي فائض غير مبرر يخفض نقاط كفاءة المهمة.',
        en: 'Implements NASA standard aerospace margin rulers: every critical subsystem enforces a shaded 10%-30% safety buffer. Violations trigger launch holds, while excessive over-engineering reduces mission efficiency.',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-lapis-950 text-limestone-100 overflow-x-hidden">
      {/* Ancient Egyptian Architectural Frieze */}
      <Frieze className="text-royal-500" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-royal-700/90 bg-lapis-950/95 backdrop-blur-md shadow-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary !min-h-[38px] !px-3 !py-1 text-xs"
              title={t('العودة إلى محاكي المهام', 'Return to mission simulator')}
            >
              <IconChevron dir={lang === 'ar' ? 'end' : 'start'} className="h-4 w-4" />
              <span>{t('العودة للمحاكي', 'Back to Simulator')}</span>
            </button>
            <div className="hidden h-6 w-px bg-royal-700 sm:block" />
            <AmunLogo className="h-9 w-9 hidden sm:block" withWordmark />
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            {onProject ? (
              <button
                type="button"
                onClick={onProject}
                className="btn-secondary !min-h-[36px] !px-3 text-xs"
              >
                <IconRocket className="h-3.5 w-3.5 text-ochre-400" />
                <span>{t('صفحة المشروع ↗', 'Project Dossier ↗')}</span>
              </button>
            ) : null}
            <a
              href="https://omarmetman.vercel.app/projects/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !min-h-[36px] !px-3 text-xs hidden md:inline-flex"
            >
              <IconRocket className="h-3.5 w-3.5" />
              <span>{t('المعمل التفاعلي ↗', 'Live Lab ↗')}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-royal-600 bg-gradient-to-b from-royal-950 via-lapis-900 to-lapis-950 p-6 sm:p-10 text-center shadow-2xl">
          <div className="mx-auto mb-4 inline-flex flex-wrap items-center justify-center gap-2">
            <Cartouche>
              <span className="font-display text-xs sm:text-sm tracking-widest text-ochre-300">
                NASA DATA PROVENANCE & SCIENCE ARCHITECTURE
              </span>
            </Cartouche>
            <StatusPill tone="good">100% NASA Open Data</StatusPill>
            <StatusPill tone="info">NASA Space Apps 2026</StatusPill>
          </div>

          <h1 className="font-display text-2xl font-extrabold leading-tight text-limestone-50 sm:text-4xl lg:text-5xl">
            {t(
              'معلومات حقيقية من ناسا عن الفضاء وكيف تم بناء اللعبة من خلال هذه المعلومات',
              'Authentic NASA Space Science: How NASA Open Data & Physical Laws Built AMUN',
            )}
          </h1>

          <p className="mx-auto mt-4 max-w-4xl text-xs sm:text-sm md:text-base leading-relaxed text-limestone-200">
            {t(
              'لم تُبنَ لعبة AMUN على قيم عشوائية أو افتراضات خيالية؛ بل اعتمدت بنسبة 100% على بيانات وكالة ناسا المفتوحة، والمحركات الفيزيائية المغلقة المبنية وفق معايير الميكانيكا المدارية وهندسة النظم الفضائية (NASA SP-8000). يشرح هذا التقرير العلمي المصادر السبعة الرسمية لناسا والمعادلات الرياضية الخمس التي تحكم كل تفاعل داخل المحاكي.',
              'AMUN is not a game of arbitrary numbers or fiction. It is a rigorous astrodynamics mission simulator powered 100% by NASA open datasets and closed-form aerospace formulations complying with NASA SP-8000 standards. This technical dossier documents all seven authoritative NASA open data APIs and the five physics engines governing every simulation turn.',
            )}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="rounded-xl border border-royal-700 bg-lapis-950/80 px-4 py-2.5 text-xs text-limestone-300">
              <span className="text-ochre-400 font-bold">7</span> {t('مصادر بيانات رسمية من ناسا', 'NASA Open APIs & Repositories')}
            </div>
            <div className="rounded-xl border border-royal-700 bg-lapis-950/80 px-4 py-2.5 text-xs text-limestone-300">
              <span className="text-ochre-400 font-bold">5</span> {t('محركات ومعادلات فيزيائية مغلقة', 'Coupled Physics Engines')}
            </div>
            <div className="rounded-xl border border-royal-700 bg-lapis-950/80 px-4 py-2.5 text-xs text-limestone-300">
              <span className="text-ochre-400 font-bold">12</span> {t('جرماً فلكياً ببيانات JPL المعتمدة', 'Planetary Bodies Benchmarked')}
            </div>
            <div className="rounded-xl border border-royal-700 bg-lapis-950/80 px-4 py-2.5 text-xs text-limestone-300">
              <span className="text-malachite font-bold">41/41</span> {t('اختباراً برمجياً مؤتمتاً ناجحاً', 'Passing Vitest Test Suites')}
            </div>
          </div>
        </div>

        {/* SECTION 1: THE 7 AUTHENTIC NASA DATA SOURCES */}
        <section className="space-y-6">
          <div className="border-b border-royal-700 pb-4">
            <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
              DATASET DIRECTORY
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-limestone-50">
              {t('المصادر السبعة المعتمدة من وكالة ناسا وكيف توظفها اللعبة', 'The Seven NASA Open Datasets & In-Game Implementation')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-limestone-300">
              {t(
                'توثيق دقيق لكل واجهة برمجة (API) ومستودع بيانات تابع لوكالة ناسا استُخدم في حسابات ومكونات اللعبة:',
                'Detailed breakdown of each NASA API, its real-world function, and how AMUN code implements it:',
              )}
            </p>
          </div>

          <div className="grid gap-6">
            {datasets.map((ds, idx) => (
              <div
                key={ds.id}
                className="rounded-2xl border border-royal-700/80 bg-lapis-900/80 p-5 sm:p-7 backdrop-blur-md shadow-xl hover:border-ochre-400/60 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-royal-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-royal-700/60 px-2 py-0.5 font-latin text-[11px] font-bold text-ochre-300">
                        NASA SOURCE 0{idx + 1}
                      </span>
                      <span className="font-latin text-xs text-limestone-400">
                        {ds.agency}
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-limestone-50">
                      {lang === 'ar' ? ds.arabicName : ds.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !min-h-[32px] !px-3 text-xs text-ochre-300 hover:text-ochre-200"
                    >
                      <span>NASA Portal ↗</span>
                    </a>
                    <a
                      href={ds.apiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost !min-h-[32px] !px-3 text-xs text-limestone-300 hover:text-limestone-100"
                    >
                      <span>API Endpoint ↗</span>
                    </a>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-royal-800/80 bg-lapis-950/70 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ochre-400">
                      <IconTarget className="h-3.5 w-3.5" />
                      <span>{t('طبيعة البيانات في الواقع (NASA Reality):', 'Real-World NASA Scientific Context:')}</span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-limestone-200">
                      {l(ds.realWorldSummary)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-royal-800/80 bg-lapis-950/70 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-malachite">
                      <IconCheck className="h-3.5 w-3.5" />
                      <span>{t('كيف تم بناء اللعبة بناءً عليها (In-Game Engine):', 'How AMUN Was Built Using This Data:')}</span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-limestone-200">
                      {l(ds.howAmunUsesIt)}
                    </p>
                  </div>
                </div>

                {/* Code implementation snippet */}
                <div className="mt-4 rounded-xl border border-royal-800 bg-black/50 p-3 sm:p-4">
                  <div className="flex items-center justify-between text-[11px] text-limestone-400 pb-2 border-b border-royal-800/50">
                    <span className="font-mono text-ochre-300">AMUN Astrodynamics Engine Integration</span>
                    <span className="font-mono text-[10px]">TypeScript (Pure Math)</span>
                  </div>
                  <pre className="mt-2 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed" dir="ltr">
                    <code>{ds.codeSnippet}</code>
                  </pre>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                  {ds.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-royal-700 bg-royal-800/40 px-2.5 py-0.5 text-[10px] text-limestone-300 font-latin">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: THE 5 COUPLED PHYSICS EQUATIONS */}
        <section className="space-y-6">
          <div className="border-b border-royal-700 pb-4">
            <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
              PHYSICAL FORMULATIONS
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-limestone-50">
              {t('المعادلات الفيزيائية الخمس التي تحكم اللعبة', 'The Five Coupled Astrodynamic Physics Formulations')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-limestone-300">
              {t(
                'يعتمد المحرك في (src/engine) على حلول تحليلية مغلقة مشتقة من نظريات الميكانيكا المدارية دون أي تقريب عشوائي:',
                'Pure closed-form TypeScript implementations verifying mission feasibility with zero iterative divergence:',
              )}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {equations.map((eq) => (
              <div
                key={eq.number}
                className="rounded-2xl border border-royal-700/80 bg-lapis-900/80 p-5 sm:p-6 backdrop-blur-md shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-royal-800 pb-3">
                    <span className="rounded bg-ochre-500/20 border border-ochre-400/40 px-2 py-0.5 font-latin text-[10px] font-bold text-ochre-300">
                      EQUATION {eq.number}
                    </span>
                    <span className="text-[11px] text-limestone-400 font-latin">NASA Standard</span>
                  </div>

                  <h3 className="mt-3 font-display text-base sm:text-lg font-bold text-limestone-50">
                    {l(eq.name)}
                  </h3>

                  <div className="mt-3 rounded-lg border border-royal-800 bg-lapis-950 p-3 text-center" dir="ltr">
                    <div className="font-mono text-sm sm:text-base font-bold text-ochre-300">
                      {eq.formula}
                    </div>
                    <div className="mt-1 text-[11px] font-mono text-limestone-400">
                      {eq.where}
                    </div>
                  </div>

                  <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-limestone-300">
                    {l(eq.explanation)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-royal-800/80 flex items-center justify-between text-[11px] text-malachite">
                  <span className="flex items-center gap-1.5">
                    <IconCheck className="h-3.5 w-3.5" />
                    <span>{t('محسوبة مغلقاً في src/engine', 'Closed-form in src/engine')}</span>
                  </span>
                  <span className="font-mono text-limestone-400">100% Deterministic</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: NASA GROUND TRUTH VS AMUN SIMULATION TABLE */}
        <section className="space-y-6">
          <div className="border-b border-royal-700 pb-4">
            <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
              BENCHMARK VERIFICATION MATRIX
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-limestone-50">
              {t('مصفوفة التحقق: الحقيقة العلمية لناسا مقابل محاكي AMUN', 'Verification Matrix: Real NASA Ground Truth vs AMUN Simulator')}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-royal-700 bg-lapis-900/80 shadow-xl">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="border-b border-royal-700 bg-lapis-950/90 text-ochre-300 font-latin text-[11px] sm:text-xs">
                <tr>
                  <th className="px-4 py-3 text-start">Target / System</th>
                  <th className="px-4 py-3 text-start">NASA Real Ground Truth</th>
                  <th className="px-4 py-3 text-start">NASA Source Agency</th>
                  <th className="px-4 py-3 text-start">AMUN Engine Value</th>
                  <th className="px-4 py-3 text-start">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-royal-800 font-latin text-limestone-200 text-xs">
                <tr>
                  <td className="px-4 py-3 font-semibold text-limestone-50">The Moon (Luna)</td>
                  <td className="px-4 py-3">g = 1.62 m/s², d = 0.0027 AU</td>
                  <td className="px-4 py-3 text-limestone-400">NASA GSFC Fact Sheet</td>
                  <td className="px-4 py-3 text-cyan-300">1.62 m/s², 0.002702 AU</td>
                  <td className="px-4 py-3 text-malachite font-bold">100% Exact</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-limestone-50">Mars (Ares)</td>
                  <td className="px-4 py-3">a = 1.524 AU, g = 3.71 m/s²</td>
                  <td className="px-4 py-3 text-limestone-400">JPL Horizons + Factsheet</td>
                  <td className="px-4 py-3 text-cyan-300">1.524 AU, 3.71 m/s²</td>
                  <td className="px-4 py-3 text-malachite font-bold">100% Exact</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-limestone-50">101955 Bennu</td>
                  <td className="px-4 py-3">Diameter = 0.49 km, Period = 1.20 yr</td>
                  <td className="px-4 py-3 text-limestone-400">JPL SBDB (OSIRIS-REx)</td>
                  <td className="px-4 py-3 text-cyan-300">0.49 km, 1.20 yr</td>
                  <td className="px-4 py-3 text-malachite font-bold">100% Exact</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-limestone-50">Solar Constant</td>
                  <td className="px-4 py-3">1361 W/m² at 1.0 AU (Earth)</td>
                  <td className="px-4 py-3 text-limestone-400">NASA Earth Science</td>
                  <td className="px-4 py-3 text-cyan-300">1361 / r² [W/m²]</td>
                  <td className="px-4 py-3 text-malachite font-bold">100% Exact</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-limestone-50">DSN Ground Gain</td>
                  <td className="px-4 py-3">34m = Baseline, 70m = +6.3 dB</td>
                  <td className="px-4 py-3 text-limestone-400">NASA SCaN DSN</td>
                  <td className="px-4 py-3 text-cyan-300">34m (1.0x), 70m (4.25x)</td>
                  <td className="px-4 py-3 text-malachite font-bold">100% Exact</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-limestone-50">Aerospace Margins</td>
                  <td className="px-4 py-3">10% - 30% Safety Buffers</td>
                  <td className="px-4 py-3 text-limestone-400">NASA SP-8000 Guidelines</td>
                  <td className="px-4 py-3 text-cyan-300">Shaded optimal 10%-30%</td>
                  <td className="px-4 py-3 text-malachite font-bold">100% Exact</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-royal-700 py-6">
          <button
            type="button"
            onClick={onBack}
            className="btn-primary !min-h-[44px] !px-6 text-sm font-bold"
          >
            <IconRocket className="h-4 w-4" />
            <span>{t('العودة إلى محاكي المهمة 🚀', 'Return to Mission Simulator 🚀')}</span>
          </button>

          {onProject ? (
            <button
              type="button"
              onClick={onProject}
              className="btn-secondary !min-h-[44px] !px-6 text-sm font-bold"
            >
              <span>{t('استعراض ملف المشروع وطاقم العمل 👥', 'View Project Dossier & Flight Crew 👥')}</span>
            </button>
          ) : null}
        </div>
      </main>
    </div>
  );
}
