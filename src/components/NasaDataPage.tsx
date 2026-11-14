import { useL, useLang, useT } from '../i18n';
import { GITHUB, LIVE_LAB } from '../data/links';
import { Cartouche } from './Ornament';
import { IconCheck, IconExternal, IconRocket, IconTarget } from './Icons';
import { Ltr, PageFooter, SectionHeading, Stat } from './PagePrimitives';
import { PageShell } from './PageShell';
import { SiteHeader } from './SiteHeader';
import { StatusPill } from './Badges';

interface NasaDataPageProps {
  onBack: () => void;
  onProject?: () => void;
}

const DATASETS = [
  {
    id: 'horizons',
    name: 'NASA JPL Horizons System',
    arabicName: 'نظام البيانات الفلكية JPL Horizons',
    agency: 'NASA / JPL-Caltech',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    apiUrl: 'https://ssd.jpl.nasa.gov/api/horizons.api',
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
    realWorldSummary: {
      ar: 'المستودع الرئيسي لوكالة ناسا لخصائص الكويكبات والمذنبات والأجرام القريبة من الأرض (NEOs)، متضمناً أنصاف المحاور، وفترات الدوران حول النفس، والأقطار الدقيقة.',
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
    realWorldSummary: {
      ar: 'الجداول العلمية المرجعية المجمعة بواسطة الدكتور ديفيد ويليامز بمركز غودارد، وتوثق كتل الكواكب، والجاذبية السطحية، والسرعة المدارية، وسرعة الإفلات والغلاف الجوي.',
      en: 'Curated standard planetary metrics by Dr. David R. Williams at NASA GSFC: surface gravities, escape velocities, planetary masses, and radii.',
    },
    howAmunUsesIt: {
      ar: 'تحدد جاذبية كل جرم (مثل القمر 1.62 م/ث²، المريخ 3.71 م/ث²، المشتري 24.79 م/ث²) بدقة في محرك الهبوط والإقلاع. تفشل محاولات الهبوط تلقائياً ما لم تخصص المركبة وقوداً كافياً لإنتاج نسبة دفع إلى وزن أكبر من 1.2.',
      en: 'Determines target surface gravity (Moon: 1.62 m/s², Mars: 3.71 m/s², Jupiter: 24.79 m/s²) in the landing and ascent model. Landers crash unless thrust-to-weight ratio exceeds 1.2 against real planetary gravity.',
    },
    codeSnippet: '// Lander propellant sizing vs true planetary gravity\nconst landingDv = Math.sqrt(2 * target.gravityMS2 * target.diameterKm * 500);',
    tags: ['Surface Gravity', 'Escape Velocity', 'Atmosphere', 'Landing Δv'],
  },
  {
    id: 'ntrs',
    name: 'NASA Technical Reports Server (NTRS)',
    arabicName: 'خادم التقارير والبحوث التقنية لوكالة ناسا',
    agency: 'NASA STI Program',
    url: 'https://ntrs.nasa.gov/',
    apiUrl: 'https://ntrs.nasa.gov/api/citations/search',
    realWorldSummary: {
      ar: 'أكبر مستودع علمي يضم أكثر من 500,000 بحث وتقرير هندسي محكّم حول الدفع الصاروخي، والتدريع الإشعاعي، واختبارات كفاءة الخلايا الشمسية في الفضاء السحيق.',
      en: 'Over 500,000 peer-reviewed technical publications and mission engineering guidelines covering propulsion, radiation shielding, and telemetry.',
    },
    howAmunUsesIt: {
      ar: 'معايرة النبض النوعي (Isp) لكافة أنظمة الدفع (الغاز البارد: 70 ثانية، الهيدرازين: 230 ثانية، ثنائي الوقود MMH/NTO: 318 ثانية، الدفع الأيوني: 3100 ثانية، الدفع الحراري النووي: 900 ثانية)، ونسب كتلة خزانات الوقود الهيكلية (k = 8% إلى 12%) وفق تقارير NASA SP المعتمدة.',
      en: 'Calibrated specific impulse (Isp) across propulsion systems (cold gas 70s, hydrazine 230s, bipropellant 318s, ion 3100s, NTP 900s) and structural tank fractions (k = 8%–12%) from NASA technical papers.',
    },
    codeSnippet: '// Tsiolkovsky closed-form with structural tank fraction k from NASA STI\nconst x = requiredDv / (propulsion.isp * 9.80665);\nconst mProp = (mOther * (Math.exp(x) - 1)) / (1 - k * (Math.exp(x) - 1));',
    tags: ['Specific Impulse', 'Propulsion Isp', 'Tank Fraction', 'NASA SP Guidelines'],
  },
  {
    id: 'dsn',
    name: 'NASA Deep Space Network (DSN)',
    arabicName: 'شبكة الاتصالات الفضائية العميقة DSN',
    agency: 'NASA SCaN',
    url: 'https://www.nasa.gov/directorates/somd/space-communications-navigation-program/deep-space-network/',
    apiUrl: 'https://eyes.nasa.gov/dsn/dsn.html',
    realWorldSummary: {
      ar: 'شبكة الهوائيات العملاقة ذات الأقطار 34 متراً و70 متراً الموزعة في كاليفورنيا وإسبانيا وأستراليا لتأمين الاتصال الدائم عبر كافة أرجاء المجموعة الشمسية.',
      en: 'International network of 34m and 70m ground stations providing continuous tracking and telemetry downlinks across deep space.',
    },
    howAmunUsesIt: {
      ar: 'نمذجة ميزانية وصلة الاتصال اللاسلكية وفق معادلة فرايس. تنخفض سرعة نقل البيانات عكسياً مع مربع المسافة الفلكية، وتتيح اللعبة الاختيار بين محطات DSN 34m و70m ونطاقي X وKa مع قطر هوائي المركبة.',
      en: 'Engineered telemetry downlink bandwidth using the Friis transmission equation. Bitrate decays with inverse-square distance. Players size high-gain antennas and RF wattage against DSN 34m/70m stations.',
    },
    codeSnippet: '// Friis path loss and DSN downlink bandwidth\nconst bitrateKbps = 4000 * (txPowerW / 100) * Math.pow(antDiameter / 3, 2) * Math.pow(0.5 / earthDistAU, 2) * groundGain;',
    tags: ['Friis Equation', 'DSN 34m / 70m', 'Ka / X Bands', 'Path Loss'],
  },
  {
    id: 'images',
    name: 'NASA Image and Video Library',
    arabicName: 'مكتبة ناسا للصور والوسائط الفضائية',
    agency: 'NASA Open Media API',
    url: 'https://images.nasa.gov/',
    apiUrl: 'https://images-api.nasa.gov/search',
    realWorldSummary: {
      ar: 'المكتبة الرسمية المفتوحة للصور العلمية فائقة الدقة الملتقطة بواسطة مركبات ومراصد ناسا الفضائية مع الإسناد التوثيقي الكامل.',
      en: 'NASA open repository of high-resolution scientific photography and planetary imagery with original instrument credits.',
    },
    howAmunUsesIt: {
      ar: 'معظم صور الأجرام من مكتبة ناسا (غاليليو للقمر، مارينر 10 للزهرة، جونو للمشتري، داون لفيستا وسيريس، جيوتو لهالي، ديب إمباكت لتيمبل 1). وتُستخدم صور حقيقية من ESA لمريخ روزيتا والمذنب 67P، ومن JAXA لهايابوسا2/ريوغو. كل صورة تحمل إسناد مهمتها الأصلي.',
      en: 'Most target photographs come from NASA archives (Galileo for the Moon, Mariner 10 for Venus, Juno for Jupiter, Dawn for Vesta and Ceres, Giotto for Halley, Deep Impact for Tempel 1). Real ESA imagery covers Rosetta’s Mars and comet 67P, and JAXA/Hayabusa2 covers Ryugu. Every image carries its original mission credit.',
    },
    codeSnippet: '// Local, optimised mission photography with explicit credit\nimage: { url: "/targets/moon.jpg", source: "NASA", credit: "NASA/JPL-Caltech (Galileo)", nasaId: "PIA00405" }',
    tags: ['Mission Photography', 'NASA / ESA / JAXA', 'Original Credits', 'Local Assets'],
  },
  {
    id: 'basics',
    name: 'NASA JPL Basics of Space Flight',
    arabicName: 'دليل ناسا JPL لأساسيات الطيران الفضائي',
    agency: 'NASA / JPL Science Mission Directorate',
    url: 'https://science.nasa.gov/learn/basics-of-space-flight/',
    apiUrl: 'https://science.nasa.gov/learn/basics-of-space-flight/',
    realWorldSummary: {
      ar: 'الدليل التعليمي الأول لمهندسي وكالة ناسا ومختبر الدفع النفاث في شرح الميكانيكا المدارية، ومناورات تغيير السرعة دلتا-في، ونوافذ الإطلاق السينودية.',
      en: 'The definitive training primer by NASA JPL for orbital mechanics, trajectory design, spacecraft subsystems, and deep-space conics.',
    },
    howAmunUsesIt: {
      ar: 'يشكل المرجع العلمي المباشر لمحتوى لوحة «تعلّم» في AMUN، حيث يشرح للاعبين أسباب القرارات الهندسية، وكيفية حساب دلتا-في ومسارات هوهمان بلغة مبسطة وموثقة.',
      en: 'Direct educational backbone of the in-game Learn panel, guiding users through Delta-V margins, Hohmann transfers, and payload budgeting.',
    },
    codeSnippet: '// Educational citations embedded in LearnPanel concepts\nsources: [{ key: "basics", name: "NASA Basics of Space Flight", url: "https://science.nasa.gov/..." }]',
    tags: ['Education', 'Orbital Primer', 'Delta-V Concepts', 'Flight Operations'],
  },
];

const EQUATIONS = [
  {
    number: '01',
    name: { ar: 'معادلة تسيلكوفسكي مع نسبة خزان الوقود الهيكلية (k)', en: 'Closed-form Tsiolkovsky with tank fraction (k)' },
    formula: 'm_prop = [m_other · (e^x - 1)] / [1 - k · (e^x - 1)]',
    where: 'where x = Δv_req · (1 + reserve) / (I_sp · g_0)',
    explanation: {
      ar: 'في هندسة الصواريخ الحقيقية، لا تضاف كتلة الوقود بمفردها؛ فكل كيلوغرام وقود يتطلب خزاناً ومواسير بوزن إضافي (k = 8% إلى 12%). بدلاً من الحلقات التكرارية غير المستقرة، اشتق مهندسو المشروع حلاً تحليلياً مغلقاً يضمن حساب كتلة الوقود الدقيقة فورياً دون أي خطأ رياضي.',
      en: 'Real spacecraft propellant requires structural tanks and plumbing (tank fraction k = 8%–12%). Instead of iterative approximations, AMUN derived a closed-form analytical solution ensuring exact propellant sizing instantly.',
    },
  },
  {
    number: '02',
    name: { ar: 'قانون التربيع العكسي للإشعاع الشمسي', en: 'Inverse-square solar irradiance law' },
    formula: 'S(r) = 1361 / r²   [W/m²]',
    where: 'P_solar(t) = Area · S(r) · efficiency · (1 - degradation)^years',
    explanation: {
      ar: 'تبلغ كثافة الطاقة الشمسية عند الأرض 1361 واط/م²، ولكنها تنخفض بشدة عند المريخ إلى نحو 500 واط/م²، وعند المشتري إلى 50 واط/م² فقط. تفرض اللعبة استخدام مولدات النظائر المشعة (RTGs) للمهمات البعيدة تماماً كما تفعل ناسا في مركبات New Horizons وVoyager.',
      en: 'Solar flux drops from 1361 W/m² at Earth to about 500 W/m² at Mars and 50 W/m² at Jupiter. AMUN enforces nuclear RTG power generation for outer solar system targets, mirroring NASA New Horizons and Voyager architectures.',
    },
  },
  {
    number: '03',
    name: { ar: 'معادلة فرايس لاتصالات الفضاء السحيق عبر DSN', en: 'Friis telemetry downlink across deep space' },
    formula: 'Bitrate ∝ P_tx · D_ant² · (f / f_ref)² · (1 / d_AU)² · G_ground',
    where: 'G_ground: DSN 34m (1.0) vs DSN 70m (4.25)',
    explanation: {
      ar: 'تحسب اللعبة معدل نقل البيانات اللحظي بناءً على قدرة جهاز الإرسال بالواط، ومساحة الهوائي عالي الكسب، والمسافة الفلكية الحقيقية. عند الابتعاد، يقل معدل البيانات إلى كيلوبتات قليلة، مما يهدد بنقص العائد العلمي ما لم ترفع قدرة المحطة الأرضية إلى 70 متراً.',
      en: 'Computes telemetry bitrate from RF transmitter power, high-gain antenna dish diameter, and astronomical distance. Far distances choke bandwidth to minimal kbps unless upgraded to 70m DSN dishes.',
    },
  },
  {
    number: '04',
    name: { ar: 'مدارات انتقال هوهمان ونوافذ الإطلاق السينودية', en: 'Hohmann interplanetary transfer and synodic windows' },
    formula: 'T_transit ≈ 0.5 · a_AU^1.5 · 365.25 [days]',
    where: 'Δv_plane ≈ 2 · v_target · sin(inclination / 2)',
    explanation: {
      ar: 'تحسب اللعبة زمن الرحلة المدارية ونوافذ الإطلاق السينودية الأدنى استهلاكاً للوقود بين الأرض وأي كوكب أو كويكب، مع حساب دلتا-في الإضافية المطلوبة لتعديل مستوي المدار الفلكي الحقيقي للجرم المستهدف.',
      en: 'Computes minimum-energy transfer flight times, synodic departure intervals, and orbital inclination plane-change Delta-V burns according to Kepler’s third law.',
    },
  },
  {
    number: '05',
    name: { ar: 'نظام هوامش الأمان الفضائية الصارمة (NASA SP-8000)', en: 'NASA SP-8000 systems engineering margins' },
    formula: 'Margin = (Ceiling - Actual) / Ceiling  ∈  [10%, 30%]',
    where: 'Negative margin = launch hold; excess margin = mass / cost penalty',
    explanation: {
      ar: 'تلتزم اللعبة بمسطرة الهوامش الهندسية المعتمدة في وكالة ناسا: لكل مورد حرج (الكتلة، الطاقة، دلتا-في، الميزانية) نطاق هامش أمان أمثل بين 10% و30%. أي هامش سالب يمنع الإطلاق فوراً، وأي فائض غير مبرر يخفض نقاط كفاءة المهمة.',
      en: 'Implements NASA standard aerospace margin rulers: every critical subsystem enforces a 10%–30% safety buffer. Violations trigger launch holds, while excessive over-engineering reduces mission efficiency.',
    },
  },
];

const BENCHMARKS = [
  {
    target: { ar: 'القمر (لونا)', en: 'The Moon (Luna)' },
    truth: 'g = 1.62 m/s², d = 0.0027 AU',
    source: 'NASA GSFC Fact Sheet',
    amun: '1.62 m/s², 0.002702 AU',
  },
  {
    target: { ar: 'المريخ (آريس)', en: 'Mars (Ares)' },
    truth: 'a = 1.524 AU, g = 3.71 m/s²',
    source: 'JPL Horizons + Fact Sheet',
    amun: '1.524 AU, 3.71 m/s²',
  },
  {
    target: { ar: 'الكويكب بينو 101955', en: '101955 Bennu' },
    truth: 'Diameter = 0.49 km, Period = 1.20 yr',
    source: 'JPL SBDB (OSIRIS-REx)',
    amun: '0.49 km, 1.20 yr',
  },
  {
    target: { ar: 'الثابت الشمسي', en: 'Solar constant' },
    truth: '1361 W/m² at 1.0 AU (Earth)',
    source: 'NASA Earth Science',
    amun: '1361 / r² [W/m²]',
  },
  {
    target: { ar: 'كسب محطة DSN الأرضية', en: 'DSN ground gain' },
    truth: '34m = baseline, 70m = +6.3 dB',
    source: 'NASA SCaN DSN',
    amun: '34m (1.0x), 70m (4.25x)',
  },
  {
    target: { ar: 'هوامش الأمان الهندسية', en: 'Aerospace margins' },
    truth: '10% – 30% safety buffers',
    source: 'NASA SP-8000 Guidelines',
    amun: 'Shaded optimal 10%–30%',
  },
];

export function NasaDataPage({ onBack, onProject }: NasaDataPageProps) {
  const t = useT();
  const l = useL();
  const lang = useLang();

  const nasaNav = {
    key: 'nasa',
    label: t('بيانات ناسا', 'NASA science'),
    onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    active: true,
  };

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageShell
      header={
        <SiteHeader
          onLogoClick={onBack}
          context={
            <div className="min-w-0">
              <div className="text-[10px] leading-none text-limestone-400">{t('التقرير العلمي', 'Science dossier')}</div>
              <div className="mt-1 truncate font-display text-sm leading-none text-limestone-50">
                {t('معلومات ناسا الحقيقية', 'NASA real science')}
              </div>
            </div>
          }
          nav={[
            { key: 'simulator', label: t('المحاكي', 'Simulator'), onClick: onBack },
            ...(onProject
              ? [{ key: 'project', label: t('المشروع', 'Project'), onClick: onProject }]
              : []),
            nasaNav,
          ]}
          menuGroups={[
            {
              title: t('الصفحات', 'Pages'),
              items: [
                { key: 'simulator', label: t('محاكي المهام', 'Mission simulator'), onClick: onBack },
                ...(onProject
                  ? [{ key: 'project', label: t('مشروع آمون وطاقم العمل', 'Project AMUN & crew'), onClick: onProject }]
                  : []),
                { ...nasaNav, label: t('معلومات ناسا الحقيقية', 'NASA real science') },
              ],
            },
            {
              title: t('أقسام الصفحة', 'On this page'),
              items: [
                { key: 'sources', label: t('المصادر السبعة', 'The seven sources'), onClick: () => goToSection('sources') },
                { key: 'equations', label: t('المعادلات الخمس', 'The five equations'), onClick: () => goToSection('equations') },
                { key: 'comparison', label: t('الحقيقة مقابل المحاكي', 'Ground truth vs simulator'), onClick: () => goToSection('comparison') },
              ],
            },
            {
              title: t('المصادر', 'Sources'),
              items: [
                { key: 'horizons', label: 'JPL Horizons', href: 'https://ssd.jpl.nasa.gov/horizons/' },
                { key: 'sbdb', label: 'JPL Small-Body Database', href: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html' },
                { key: 'factsheet', label: 'NASA Planetary Fact Sheet', href: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
                { key: 'ntrs', label: 'NASA Technical Reports Server', href: 'https://ntrs.nasa.gov/' },
              ],
            },
            {
              title: t('المعمل والكود', 'Lab & code'),
              items: [
                { key: 'lab', label: t('المعمل التفاعلي الحي', 'Live interactive lab'), href: LIVE_LAB },
                { key: 'github', label: 'GitHub', href: GITHUB },
              ],
            },
          ]}
          primaryAction={{
            label: t('المحاكي', 'Simulator'),
            onClick: onBack,
            icon: <IconRocket className="h-4 w-4" />,
          }}
          menuLabel={t('قائمة التقرير', 'Science menu')}
        />
      }
    >
      <div className="space-y-12">
        {/* Hero */}
        <section className="grid gap-6 border-b border-royal-700 pb-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Cartouche>
                <span className="font-latin text-[10px] tracking-[0.18em] text-ochre-300">NASA DATA / PROVENANCE</span>
              </Cartouche>
              <StatusPill tone="good">{t('بيانات ناسا وصور ESA/JAXA', 'NASA data + ESA/JAXA imagery')}</StatusPill>
              <StatusPill tone="info">Space Apps 2026</StatusPill>
            </div>

            <h1 className="mt-5 max-w-[24ch] font-display text-[28px] leading-[1.3] text-limestone-50 sm:text-4xl">
              {t(
                'معلومات حقيقية من ناسا عن الفضاء وكيف بُنيت اللعبة',
                'Authentic NASA space science and how AMUN was built on it',
              )}
            </h1>

            <p className="mt-4 max-w-[70ch] text-sm leading-[1.9] text-limestone-200 sm:text-base">
              {t(
                'لم تُبنَ AMUN على قيم عشوائية أو افتراضات خيالية؛ بل اعتمدت على بيانات وكالة ناسا المفتوحة، والمحركات الفيزيائية المغلقة المبنية وفق معايير الميكانيكا المدارية وهندسة النظم الفضائية. يشرح هذا التقرير المصادر السبعة الرسمية والمعادلات الخمس التي تحكم كل تفاعل داخل المحاكي.',
                'AMUN is not a game of arbitrary numbers. It is an astrodynamics mission simulator powered by NASA open datasets and closed-form aerospace formulations compliant with NASA SP-8000. This dossier documents all seven authoritative sources and the five physics engines behind every simulation turn.',
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button type="button" onClick={onBack} className="btn-primary text-xs sm:text-sm">
                <IconRocket className="h-4 w-4" />
                <span>{t('جرّب المحاكي', 'Try the simulator')}</span>
              </button>
              {onProject ? (
                <button type="button" onClick={onProject} className="btn-secondary text-xs sm:text-sm">
                  <IconTarget className="h-4 w-4 text-ochre-300" />
                  <span>{t('ملف المشروع وطاقم العمل', 'Project dossier & crew')}</span>
                </button>
              ) : null}
            </div>
          </div>

          <aside className="min-w-0 border border-royal-700 bg-lapis-900/40">
            <div className="flex items-center justify-between gap-2 border-b border-royal-700 px-4 py-2.5">
              <span className="text-[10px] font-semibold tracking-wide text-limestone-400">
                {t('ملخص التقرير', 'Dossier summary')}
              </span>
              <span className="font-latin text-[10px] text-ochre-300" dir="ltr">
                NASA-2026
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-royal-700 rtl:divide-x-reverse">
              <Stat value="07" label={t('مصادر ناسا مفتوحة', 'NASA open sources')} />
              <Stat value="05" label={t('معادلات مغلقة', 'closed-form engines')} tone="royal" />
              <Stat value="12" label={t('جرم فلكي معتمد', 'benchmarked bodies')} />
              <Stat value="41/41" label={t('اختباراً ناجحاً', 'tests passing')} tone="malachite" />
            </div>
            <p className="border-t border-royal-700 px-4 py-3 text-[10px] leading-relaxed text-limestone-400">
              {t(
                'كل قيمة تقريبية موسومة، وكل مصدر يحمل اسمه وجهته.',
                'Every approximate value is marked, and every source carries its agency and link.',
              )}
            </p>
          </aside>
        </section>

        {/* 01 — Datasets */}
        <section id="sources" className="scroll-mt-24">
          <SectionHeading
            number="01"
            eyebrow={t('دليل المصادر', 'Dataset directory')}
            title={t('المصادر السبعة المعتمدة وكيف توظفها اللعبة', 'The seven NASA sources and their in-game implementation')}
            description={t(
              'توثيق دقيق لكل واجهة برمجة ومستودع بيانات تابع لوكالة ناسا استُخدم في حسابات ومكونات اللعبة.',
              'A precise breakdown of each NASA API and data repository used in the simulator’s calculations and components.',
            )}
          />

          <div className="space-y-4">
            {DATASETS.map((dataset, index) => (
              <article key={dataset.id} className="min-w-0 border border-royal-700 bg-lapis-900/40">
                <header className="grid gap-3 border-b border-royal-700 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="font-latin text-[10px] tabular-nums tracking-[0.16em] text-ochre-300" dir="ltr">
                        NASA SOURCE {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="h-3 w-px bg-royal-600" aria-hidden="true" />
                      <span className="font-latin text-[10px] text-limestone-400" dir="ltr">
                        {dataset.agency}
                      </span>
                    </div>
                    <h3
                      className="mt-1.5 break-words font-display text-lg leading-snug text-limestone-50"
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {lang === 'ar' ? dataset.arabicName : dataset.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={dataset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-1.5 border border-royal-600 px-2.5 text-[11px] text-limestone-200 transition-colors hover:border-ochre-400 hover:text-ochre-200"
                    >
                      <span>{t('بوابة ناسا', 'NASA portal')}</span>
                      <IconExternal className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={dataset.apiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-1.5 px-1 text-[11px] text-limestone-300 transition-colors hover:text-limestone-50"
                    >
                      <span className="font-latin">API</span>
                      <IconExternal className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </header>

                <div className="grid gap-px bg-royal-700 md:grid-cols-2">
                  <div className="min-w-0 bg-lapis-950 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wide text-royal-300">
                      <IconTarget className="h-3.5 w-3.5" />
                      <span>{t('السياق العلمي في الواقع', 'Real-world NASA context')}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-limestone-200 sm:text-sm">{l(dataset.realWorldSummary)}</p>
                  </div>

                  <div className="min-w-0 bg-lapis-950 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wide text-malachite">
                      <IconCheck className="h-3.5 w-3.5" />
                      <span>{t('كيف بُنيت اللعبة عليها', 'How AMUN uses this data')}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-limestone-200 sm:text-sm">{l(dataset.howAmunUsesIt)}</p>
                  </div>
                </div>

                <div className="border-t border-royal-700 p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2">
                    <span className="text-[10px] text-limestone-400">{t('مقتطف من المحرك', 'Engine integration')}</span>
                    <span className="font-latin text-[10px] text-limestone-400" dir="ltr">
                      TypeScript / pure math
                    </span>
                  </div>
                  <pre
                    className="code-wrap min-w-0 border border-royal-700 bg-lapis-950 p-3 font-mono text-[11px] leading-relaxed text-royal-200"
                    dir="ltr"
                  >
                    <code>{dataset.codeSnippet}</code>
                  </pre>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {dataset.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-royal-700 bg-royal-700/20 px-2 py-0.5 font-latin text-[10px] text-limestone-300"
                        dir="ltr"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 02 — Equations */}
        <section id="equations" className="scroll-mt-24">
          <SectionHeading
            number="02"
            eyebrow={t('الصيغ الفيزيائية', 'Physical formulations')}
            title={t('المعادلات الخمس التي تحكم اللعبة', 'The five physics formulations behind the game')}
            description={t(
              'يعتمد المحرك على حلول تحليلية مغلقة مشتقة من نظريات الميكانيكا المدارية دون أي تقريب عشوائي.',
              'Pure closed-form implementations derived from orbital mechanics, with no arbitrary approximations.',
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {EQUATIONS.map((equation) => (
              <article
                key={equation.number}
                className={`flex min-w-0 flex-col border border-royal-700 bg-lapis-900/40 p-4 sm:p-5 ${
                  equation.number === '05' ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-royal-700 pb-2.5">
                  <span className="font-latin text-[10px] tabular-nums tracking-[0.16em] text-ochre-300" dir="ltr">
                    EQUATION {equation.number}
                  </span>
                  <span className="font-latin text-[9px] uppercase text-limestone-400">NASA standard</span>
                </div>

                <h3 className="mt-3 font-display text-base leading-snug text-limestone-50">{l(equation.name)}</h3>

                <div className="mt-3 border border-royal-700 bg-lapis-950 p-3" dir="ltr">
                  <code className="break-anywhere block font-mono text-[12px] font-medium leading-relaxed text-ochre-200">
                    {equation.formula}
                  </code>
                  <div className="mt-1.5 break-anywhere font-mono text-[10px] leading-relaxed text-limestone-400">
                    {equation.where}
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-limestone-300 sm:text-sm">{l(equation.explanation)}</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-royal-700 pt-2.5 text-[10px]">
                  <span className="inline-flex items-center gap-1.5 text-malachite">
                    <IconCheck className="h-3.5 w-3.5" />
                    {t('محسوبة مغلقاً في المحرك', 'Closed-form in the engine')}
                  </span>
                  <span className="font-latin text-limestone-400" dir="ltr">
                    100% deterministic
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 03 — Verification */}
        <section id="comparison" className="scroll-mt-24">
          <SectionHeading
            number="03"
            eyebrow={t('مصفوفة التحقق', 'Benchmark verification')}
            title={t('الحقيقة العلمية مقابل محاكي AMUN', 'NASA ground truth versus the AMUN simulator')}
            description={t(
              'عينة من القيم المرجعية التي يعتمدها المحرك، مقارنة بالمصدر العلمي الأصلي لكل قيمة.',
              'A sample of the reference values hard-coded in the engine, compared against their original scientific source.',
            )}
            action={<StatusPill tone="good">{t('مطابقة تامة', 'Exact match')}</StatusPill>}
          />

          <div className="grid gap-px border border-royal-700 bg-royal-700 sm:grid-cols-2 lg:grid-cols-3">
            {BENCHMARKS.map((row) => (
              <article key={row.target.en} className="min-w-0 bg-lapis-950 p-4">
                <div className="flex items-start justify-between gap-2 border-b border-royal-700 pb-2.5">
                  <h3 className="min-w-0 font-display text-sm leading-snug text-limestone-50">{l(row.target)}</h3>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-malachite">
                    <IconCheck className="h-3 w-3" />
                    {t('مطابق', 'Exact')}
                  </span>
                </div>

                <dl className="mt-2.5 space-y-2 text-xs">
                  <div>
                    <dt className="text-[10px] text-limestone-400">{t('قيمة ناسا المرجعية', 'NASA ground truth')}</dt>
                    <dd className="mt-0.5 font-latin text-limestone-200" dir="ltr">
                      {row.truth}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-limestone-400">{t('المصدر', 'Source')}</dt>
                    <dd className="mt-0.5 font-latin text-limestone-400" dir="ltr">
                      {row.source}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-limestone-400">{t('قيمة محرك AMUN', 'AMUN engine value')}</dt>
                    <dd className="mt-0.5 font-latin text-royal-200" dir="ltr">
                      {row.amun}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-royal-700 bg-lapis-900/40 p-4">
            <p className="max-w-[70ch] text-xs leading-relaxed text-limestone-400">
              {t(
                'هذا التقرير تعليمي ويوضح طريقة ربط البيانات المفتوحة بالمحاكاة؛ وهو ليس منشوراً علمياً محكّماً ولا أداة هندسية معتمدة.',
                'This dossier is educational and shows how open data is wired into the simulator. It is not a peer-reviewed publication or a certified engineering tool.',
              )}
            </p>
            <span className="font-latin text-[10px] text-limestone-400" dir="ltr">
              <Ltr>NASA Space Apps Challenge 2026</Ltr>
            </span>
          </div>
        </section>

        <PageFooter
          start={
            <>
              <button type="button" onClick={onBack} className="btn-primary text-xs">
                <IconRocket className="h-4 w-4" />
                <span>{t('العودة إلى المحاكي', 'Return to the simulator')}</span>
              </button>
              {onProject ? (
                <button type="button" onClick={onProject} className="btn-secondary text-xs">
                  <IconTarget className="h-4 w-4 text-ochre-300" />
                  <span>{t('ملف المشروع والطاقم', 'Project dossier & crew')}</span>
                </button>
              ) : null}
            </>
          }
          end={<span>7 NASA sources / 5 closed-form engines / 41/41 tests</span>}
        />
      </div>
    </PageShell>
  );
}
