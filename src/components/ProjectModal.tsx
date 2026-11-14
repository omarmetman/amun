import { useState } from 'react';
import { useL, useT } from '../i18n';
import { AmunLogo } from './AmunLogo';
import { Modal } from './Modal';
import { Cartouche, Frieze } from './Ornament';
import { StatusPill } from './Badges';
import {
  IconCompass,
  IconCheck,
  IconDownload,
  IconFlag,
  IconOrbit,
  IconRocket,
  IconWrench,
} from './Icons';

import omarImg from '../assets/team/omar.jpg';
import elshimaaImg from '../assets/team/elshimaa.jpg';
import abdullahImg from '../assets/team/abdullah.jpg';
import mahmoudImg from '../assets/team/mahmoud.jpg';

type ProjectTab = 'links' | 'concept' | 'team' | 'nasa';

export function ProjectModal({
  onClose,
  onCampaign,
}: {
  onClose: () => void;
  onCampaign?: () => void;
}) {
  const t = useT();
  const l = useL();
  const [tab, setTab] = useState<ProjectTab>('links');

  const team = [
    {
      name: { ar: 'عمر محمد عتمان', en: 'Omar Mohammed Etman' },
      role: {
        ar: 'قائد المهمة ومهندس النظم المعمارية',
        en: 'Mission Commander & Systems Architect',
      },
      image: omarImg,
      linkedin: 'https://www.linkedin.com/in/omar-m-etman',
      bio: {
        ar: 'طالب هندسة ميكاترونكس بجامعة الدلتا، ومطور برمجيات شامل بخبرة أكثر من 5 سنوات في الإنتاج. قاد الهيكل الرياضي لمحرك أستروجرافيكس الحسابي المغلق، ومعادلة تسيلكوفسكي، وتكامل React 18 وTypeScript وVite مع محرك الحالة Zustand.',
        en: 'Mechatronics engineering student at Delta University, full-stack software developer with 5+ years of production experience. Architected the closed-form astrodynamics engine, Tsiolkovsky solver, and React 18/TypeScript/Vite state pipeline.',
      },
      contributions: [
        {
          ar: 'تطوير المحرك الحسابي المغلق بالكامل (src/engine) بدون أي اعتماديات خارجية.',
          en: 'Authored the pure deterministic aerospace calculation engine (src/engine).',
        },
        {
          ar: 'صياغة معادلة تسيلكوفسكي التحليلية المغلقة مع نسبة كتلة خزان الوقود الهيكلية (k).',
          en: 'Derived the closed-form propellant equation incorporating structural tank fraction (k).',
        },
        {
          ar: 'بناء واجهة المستخدم التفاعلية وهندسة الحفظ المحلي والمزامنة مع واجهات ناسا.',
          en: 'Engineered responsive UI, client persistence, and NASA Horizons/SBDB data fallbacks.',
        },
      ],
    },
    {
      name: { ar: 'الشيماء سيد محمد', en: 'Elshimaa Sayed Mohamed' },
      role: {
        ar: 'مديرة الإبداع والهوية البصرية',
        en: 'Creative Director & Visual Identity Lead',
      },
      image: elshimaaImg,
      linkedin: 'http://linkedin.com/in/oshsayeddesigner',
      bio: {
        ar: 'مصممة جرافيك وواجهات مستخدم متخصصة في الهويات البصرية المبتكرة. صممت فلسفة الألوان الفريدة المستوحاة من الجداريات المصرية القديمة (اللازورد، الأزرق المصري، الحجر الجيري، والمغرة الذهبية)، وأيقونات 24px الهندسية الدقيقة.',
        en: 'Graphic and UI/UX designer specializing in bespoke visual identities. Conceptualized the Ancient Egyptian mural pigment palette (Lapis, Egyptian Blue, Limestone, Gold Ochre) and the crisp 24px technical stroke iconography.',
      },
      contributions: [
        {
          ar: 'ابتكار لوحة ألوان الجداريات المصرية وتوظيفها كمخطط هندسي علمي صارم.',
          en: 'Designed the mural pigment palette and translated it into disciplined technical blueprint tokens.',
        },
        {
          ar: 'تصميم الخرطوش الملكي وإفريز اللوتس لعرض بيانات وتيليمتري المركبة بوقار حضاري.',
          en: 'Created the royal cartouche and lotus frieze components to frame flight telemetry.',
        },
        {
          ar: 'ضبط التجاوب البصري الدقيق لشاشات الهواتف المحمولة حتى عرض 360 بكسل.',
          en: 'Audited and optimized layout ergonomics for compact 360px mobile viewports.',
        },
      ],
    },
    {
      name: { ar: 'عبدالله عزب', en: 'Abdullah Azb' },
      role: {
        ar: 'خبير النظم الفضائية وديناميكا الطيران',
        en: 'Aerospace Systems & Flight Dynamics Specialist',
      },
      image: abdullahImg,
      linkedin: 'https://www.linkedin.com/in/abdullah-azb-18290a262',
      bio: {
        ar: 'متخصص في ديناميكا الطيران والميكانيكا المدارية ونظم الفضاء. عمل على نمذجة مسارات انتقال هوهمان الكوكبية، وتحليل نوافذ الإطلاق السينودية، واستيفاء جداول طاقة الحقن المميزة (C3) لصواريخ الإطلاق العالمية.',
        en: 'Specialist in flight dynamics, orbital mechanics, and aerospace systems. Modeled interplanetary Hohmann transfer trajectories, synodic launch windows, and characteristic injection energy (C3) parabolic interpolation curves.',
      },
      contributions: [
        {
          ar: 'معايرة معادلات زمن الرحلة المدارية وزوايا ميل المدار وتغيير المستوي (Plane-Change Δv).',
          en: 'Calibrated orbital transit equations, orbital inclinations, and plane-change Delta-V.',
        },
        {
          ar: 'بناء جداول استيفاء طاقة الحقن C3 لصواريخ فالكون 9 وفالكون الثقيل وأطلس 5 وسويوز وPSLV.',
          en: 'Formulated payload-vs-C3 curves for Falcon 9, Falcon Heavy, Atlas V, Vulcan, and PSLV.',
        },
        {
          ar: 'مطابقة الأجرام الفضائية وخصائصها الفيزيائية مع سجلات JPL Horizons وSBDB.',
          en: 'Benchmarked physical planetary attributes against NASA JPL Horizons and SBDB datasets.',
        },
      ],
    },
    {
      name: { ar: 'محمود عبدالحميد', en: 'Mahmoud Abdelhamid' },
      role: {
        ar: 'مهندس بيانات',
        en: 'Data Engineer',
      },
      image: mahmoudImg,
      linkedin: 'https://www.linkedin.com/in/mahmoud-abdel-hamid-513363406/',
      bio: {
        ar: 'مهندس بيانات بالفريق، مسؤول عن جمع وتنظيم مجموعات البيانات الفلكية وسجلات وكالة ناسا داخل المشروع، والتحقق من دقة الأرقام والمدخلات الخاصة بالأجرام والمهام الفضائية.',
        en: 'Data engineer responsible for processing and structuring NASA astronomical datasets within the platform, ensuring data consistency and accuracy across celestial targets and mission parameters.',
      },
      contributions: [
        {
          ar: 'جمع وتنظيم بيانات الأجرام والكواكب من سجلات ناسا الرسمية (JPL Horizons & SBDB).',
          en: 'Collected and structured planetary datasets from NASA JPL Horizons and SBDB.',
        },
        {
          ar: 'هيكلة جداول البيانات ومطابقة المعايير الفيزيائية للأهداف الفضائية.',
          en: 'Organized data tables and verified physical parameters for mission targets.',
        },
        {
          ar: 'مراجعة وتدقيق مدخلات التيليمتري والأرقام المرجعية داخل النظام.',
          en: 'Audited telemetry figures and reference benchmarks across the simulator.',
        },
      ],
    },
  ];

  return (
    <Modal
      title={t('ملف مشروع AMUN | آمون', 'Project AMUN Dossier')}
      description={t(
        'الدليل الموحد: الروابط الرسمية، الفكرة الهندسية، بيانات NASA الحقيقية 100%، وطاقم المهمة.',
        'Unified dossier: official links, systems engineering concept, 100% NASA data, and flight crew.',
      )}
      onClose={onClose}
      extraWide
    >
      {/* Visual Header Frieze */}
      <div className="-mx-5 -mt-4 mb-4">
        <Frieze className="text-royal-600" />
      </div>

      {/* Hero Banner with Cartouche & Tagline */}
      <div className="relative mb-5 overflow-hidden rounded-window border border-royal-600 bg-lapis-950 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AmunLogo className="h-10 w-10 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <Cartouche>
                  <span className="font-display text-sm tracking-wider text-ochre-300">
                    PROJECT AMUN / آمون
                  </span>
                </Cartouche>
                <StatusPill tone="good">NASA Space Apps 2026</StatusPill>
              </div>
              <p className="mt-1 font-display text-xs text-limestone-300 sm:text-sm">
                {t(
                  'من النيل إلى النجوم — مصمم ومحاكي المهام الفضائية العميقة',
                  'From the Nile to the Stars — Deep Space Mission Designer & Simulator',
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://omarmetman.vercel.app/projects/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !min-h-[36px] !px-3 !py-1 text-xs"
            >
              <span>{t('زيارة المعمل الحي', 'Launch Live Lab')}</span>
            </a>
            <a
              href="https://github.com/omarmetman/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !min-h-[36px] !px-3 !py-1 text-xs"
            >
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-5 flex border-b border-royal-700">
        {[
          { id: 'links', label: t('الروابط والعرض', 'Links & Demo'), icon: IconRocket },
          { id: 'concept', label: t('الفكرة والهندسة', 'Concept & Engineering'), icon: IconOrbit },
          { id: 'team', label: t('طاقم المهمة', 'Flight Crew & Team'), icon: IconWrench },
          { id: 'nasa', label: t('بيانات ناسا الحقيقية', '100% NASA Data'), icon: IconCompass },
        ].map((tabItem) => {
          const Icon = tabItem.icon;
          const active = tab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => setTab(tabItem.id as ProjectTab)}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-2.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-ochre-400 bg-royal-800/40 text-ochre-300'
                  : 'border-transparent text-limestone-300 hover:border-royal-600 hover:text-limestone-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tabItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LINKS & OFFICIAL DEMO */}
      {tab === 'links' ? (
        <div className="space-y-5">
          {/* Live Showcase Banner */}
          <div className="rounded-window border border-royal-600 bg-lapis-950/70 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-latin text-[10px] uppercase tracking-wider text-malachite">
                  {t('المعمل التفاعلي الحي', 'Official Interactive Lab')}
                </span>
                <h3 className="mt-1 font-display text-lg text-limestone-50">
                  {t('استعراض المشروع على موقع عمر عتمان', 'Project Showcase at Omar Metman Portfolio')}
                </h3>
                <p className="mt-1 max-w-[65ch] text-xs leading-relaxed text-limestone-300">
                  {t(
                    'تم نشر المشروع بالكامل كمعمل استعراضي حي يمكن تجربته مباشرة بدون أي تنزيل، مع دعم العمل بدون إنترنت ودعم ثنائي اللغة.',
                    'The project is live as an interactive demonstration lab. Runs 100% client-side with zero installation, full offline PWA resilience, and bilingual support.',
                  )}
                </p>
                <div className="mt-2.5 font-latin text-xs font-semibold text-ochre-400" dir="ltr">
                  https://omarmetman.vercel.app/projects/amun
                </div>
              </div>
              <a
                href="https://omarmetman.vercel.app/projects/amun"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !min-h-[40px] !px-4 text-xs font-bold"
              >
                {t('فتح المعمل', 'Open Lab')}
              </a>
            </div>
          </div>

          {/* Video Player Section */}
          <div className="rounded-window border border-royal-600 bg-lapis-950/70 p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-royal-700 pb-2.5">
              <div>
                <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">
                  {t('الفيديو الترويجي الرسمي', 'Official Mission Trailer')}
                </span>
                <h3 className="font-display text-base text-limestone-50">
                  {t('فيديو تعريفي مدته 30.0 ثانية بدقة 1080p', 'Official 30.0-Second Demo Video (1080p 30 FPS)')}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill tone="info">30.0s Exact</StatusPill>
                <StatusPill tone="good">Stereo Arabic VO</StatusPill>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-window border border-royal-700 bg-black">
              <video
                src="./AMUN_promo.mp4"
                controls
                className="w-full max-h-[380px] object-contain"
                poster="./assets/header-3d.svg"
              >
                <source src="./AMUN_promo.mp4" type="video/mp4" />
                <track
                  kind="subtitles"
                  src="./amun_subtitles_ar.srt"
                  srcLang="ar"
                  label="العربية"
                  default
                />
                <track
                  kind="subtitles"
                  src="./amun_subtitles_en.srt"
                  srcLang="en"
                  label="English"
                />
                {t(
                  'المتصفح لا يدعم تشغيل الفيديو مباشرة.',
                  'Your browser does not support the video tag.',
                )}
              </video>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="./AMUN_promo.mp4"
                  download="AMUN_promo.mp4"
                  className="inline-flex items-center gap-1.5 text-ochre-300 hover:text-ochre-200"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  <span>{t('تحميل الفيديو (MP4)', 'Download Video (MP4)')}</span>
                </a>
                <a
                  href="./amun_subtitles_ar.srt"
                  download="amun_subtitles_ar.srt"
                  className="inline-flex items-center gap-1.5 text-limestone-300 hover:text-limestone-100"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  <span>{t('ملف الترجمة العربي (.srt)', 'Arabic Subtitles (.srt)')}</span>
                </a>
                <a
                  href="./amun_subtitles_en.srt"
                  download="amun_subtitles_en.srt"
                  className="inline-flex items-center gap-1.5 text-limestone-300 hover:text-limestone-100"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  <span>{t('ملف الترجمة الإنجليزي (.srt)', 'English Subtitles (.srt)')}</span>
                </a>
              </div>
              <span className="font-latin text-[11px] text-limestone-400">
                2.96 MB • H.264 / AAC
              </span>
            </div>
          </div>

          {/* Core Repository & NASA Links Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-window border border-royal-700 bg-lapis-900/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-ochre-300">
                  {t('المستودع المفتوح على GitHub', 'GitHub Repository')}
                </span>
                <span className="font-latin text-[10px] text-malachite">MIT License</span>
              </div>
              <p className="mt-1 text-xs text-limestone-300">
                {t(
                  'الكود المصدري بالكامل، وحزمة 41 اختبار وحدة آلي ناجحة، وتوثيق README الفضائي ثلاثي الأبعاد.',
                  'Complete source code, 41/41 passing Vitest suites, and centered 3D space README.',
                )}
              </p>
              <a
                href="https://github.com/omarmetman/amun"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 font-latin text-xs font-semibold text-ochre-400 hover:underline"
                dir="ltr"
              >
                https://github.com/omarmetman/amun
              </a>
            </div>

            <div className="rounded-window border border-royal-700 bg-lapis-900/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-ochre-300">
                  {t('بيانات NASA المعتمدة', 'NASA Data Integration')}
                </span>
                <span className="font-latin text-[10px] text-malachite">7 Endpoints</span>
              </div>
              <p className="mt-1 text-xs text-limestone-300">
                {t(
                  'ربط حي مع JPL Horizons وSBDB وNTRS وبيانات Fact Sheet مع لقطات احتياطية مدمجة تعمل دون إنترنت.',
                  'Live API feeds from Horizons, SBDB, and NTRS with built-in offline failover snapshots.',
                )}
              </p>
              <button
                type="button"
                onClick={() => setTab('nasa')}
                className="mt-2.5 inline-flex items-center gap-1 text-xs text-ochre-400 hover:underline"
              >
                <span>{t('استعراض مصادر ناسا السبعة', 'Explore 7 NASA sources')}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* TAB 2: CONCEPT & SYSTEMS ARCHITECTURE */}
      {tab === 'concept' ? (
        <div className="space-y-5">
          {/* Vision Statement */}
          <div className="rounded-window border border-royal-600 bg-lapis-950/70 p-4 sm:p-5">
            <h3 className="font-display text-base text-limestone-50 sm:text-lg">
              {t(
                'لماذا قمنا ببناء AMUN (آمون)؟',
                'Why Did We Engineer AMUN?',
              )}
            </h3>
            <p className="mt-2 text-xs leading-[1.8] text-limestone-200">
              {t(
                'تعتبر هندسة المهمات الفضائية من أعقد التخصصات العلمية على الإطلاق؛ حيث يقف الراغب في تعلمها أمام خيارين: إما معادلات رياضية جافة ومستندات NASA الفنية المعقدة، أو ألعاب خيال علمي تفتقد إلى الدقة الفيزيائية. جاء مشروع AMUN ليكون الجسر المفقود: منصة ويب خفيفة وسريعة، تصمم من خلالها مهمة فضائية روبوتية كاملة عبر 11 خطوة هندسية واقعية، وتعتمد على خمس معادلات فيزيائية حقيقية ومصادر بيانات ناسا الرسمية بنسبة 100%، دون التنازل عن متعة المحاكاة وتأثيرات الأحداث العشوائية.',
                'Aerospace mission engineering is historically bifurcated: learners face either dry academic textbooks and dense NASA SP-8000 series monographs, or arcade sci-fi games lacking physical rigor. AMUN was built to be the definitive bridge: a lightweight, responsive web laboratory guiding players through an authentic 11-step systems engineering lifecycle, governed by five closed-form physics engines and 100% authentic NASA datasets—without sacrificing stochastic simulation excitement.',
              )}
            </p>
          </div>

          {/* 11 Steps Overview */}
          <div className="rounded-window border border-royal-700 bg-lapis-900/60 p-4">
            <h4 className="font-display text-sm text-ochre-300">
              {t('دورة حياة هندسة النظم في 11 خطوة', '11-Step Systems Engineering Lifecycle')}
            </h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { num: '01', title: t('الهدف العلمي', 'Objectives'), desc: t('اختيار الجرم الفلكي وحدود العلم الأساسي والكامل', 'Target celestial body & mission success thresholds') },
                { num: '02', title: t('المركبة والدفع', 'Spacecraft Bus'), desc: t('تحديد هيكل الحافلة، الدفع الثنائي، والتدريع الإشعاعي', 'Bus structural mass, propulsion & rad-hardening') },
                { num: '03', title: t('الأجهزة العلمية', 'Payload Instruments'), desc: t('موازنة الكتلة والطاقة لأجهزة المطياف والرادار والكاميرات', 'Sizing spectrometers, LIDAR, and cameras') },
                { num: '04', title: t('صاروخ الإطلاق', 'Launch Vehicle'), desc: t('مطابقة الكتلة مع منحنيات طاقة الحقن C3 للصاروخ', 'Matching mass against booster C3 interpolation curves') },
                { num: '05', title: t('الميزانية والاحتياطي', 'Budget & Reserves'), desc: t('تكاليف التطوير، العمليات اليومية، واحتياطي المخاطر', 'Hardware expenditure, operations, and risk reserves') },
                { num: '06', title: t('ميزانية الطاقة', 'Power Budget'), desc: t('قانون التربيع العكسي للشمس ومولدات RTG والبطاريات', 'Inverse-square solar irradiance, RTGs, and batteries') },
                { num: '07', title: t('الكتلة ودلتا-في', 'Mass & Sizing'), desc: t('معادلة تسيلكوفسكي المغلقة لحساب كتلة الوقود الصافية', 'Closed-form Tsiolkovsky rocket propellant mass') },
                { num: '08', title: t('الاتصالات والوصلة', 'Deep-Space Link'), desc: t('معادلة فرايس لفقد المسار وهوائيات DSN بقدرات 34م و70م', 'Friis path loss & DSN 34m/70m link throughput') },
                { num: '09', title: t('المسار والمدار', 'Orbital Trajectory'), desc: t('حساب مدارات هومان، زمن الرحلة، ونوافذ الإطلاق', 'Hohmann transit time & synodic launch window') },
                { num: '10', title: t('المحاكاة الاحتمالية', 'Flight Simulation'), desc: t('أربع مراحل محاكاة بالبذرة العشوائية مع أخطار الفضاء', '4-phase seeded Monte Carlo flight engine') },
                { num: '11', title: t('التقرير والتقييم', 'Evaluation & Debrief'), desc: t('تقييم من 100 نقطة يحلل العلم والميزانية والهوامش', '100-point transparent scoring debrief (S to F)') },
              ].map((s) => (
                <div key={s.num} className="border border-royal-700 bg-lapis-950/40 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-latin text-xs font-bold text-ochre-400">{s.num}</span>
                    <span className="text-xs font-semibold text-limestone-100">{s.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-limestone-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Coupled Physics Engines */}
          <div className="rounded-window border border-royal-700 bg-lapis-900/60 p-4">
            <h4 className="font-display text-sm text-ochre-300">
              {t('المعادلات الفيزيائية الخمس المترابطة', 'Five Coupled Real-World Physics Engines')}
            </h4>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="border border-royal-700 bg-lapis-950/40 p-3">
                <span className="font-semibold text-malachite">1. {t('معادلة تسيلكوفسكي المغلقة لكتلة الوقود', 'Closed-Form Tsiolkovsky Rocket Equation')}</span>
                <div className="mt-1 font-latin text-[11px] text-ochre-300" dir="ltr">
                  x = Δv / (Isp · g0) &nbsp; | &nbsp; m_prop = [m_other · (e^x - 1)] / [1 - k · (e^x - 1)]
                </div>
                <p className="mt-1 text-[11px] text-limestone-300">
                  {t('تحسب كتلة الوقود المطلوبة مع أخذ كتلة خزان الوقود الهيكلية (k = 8% إلى 12%) في الاعتبار بدقة مغلقة دون تقريب.', 'Calculates exact propellant mass factoring in structural tank fraction without iterative divergence.')}
                </p>
              </div>

              <div className="border border-royal-700 bg-lapis-950/40 p-3">
                <span className="font-semibold text-malachite">2. {t('قانون التربيع العكسي للإشعاع الشمسي', 'Inverse-Square Solar Irradiance Law')}</span>
                <div className="mt-1 font-latin text-[11px] text-ochre-300" dir="ltr">
                  S(r) = 1361 / r² [W/m²] &nbsp; | &nbsp; P_solar = A · S(r) · η · (1 - δ)^t
                </div>
                <p className="mt-1 text-[11px] text-limestone-300">
                  {t('ينخفض التدفق الشمسي من 1361 واط/م² عند الأرض إلى 586 واط/م² عند المريخ و50 واط/م² عند المشتري، مما يفرض استخدام RTG عند الأجرام البعيدة.', 'Irradiance drops dramatically with distance, making nuclear RTGs mandatory beyond the asteroid belt.')}
                </p>
              </div>

              <div className="border border-royal-700 bg-lapis-950/40 p-3">
                <span className="font-semibold text-malachite">3. {t('معادلة فرايس لفقد مسار الاتصال العميق (DSN)', 'Friis Transmission & DSN Telecommunications')}</span>
                <div className="mt-1 font-latin text-[11px] text-ochre-300" dir="ltr">
                  Bitrate ∝ P_tx · D_ant² · (f / f_ref)² · (1 / d_AU)² · G_ground
                </div>
                <p className="mt-1 text-[11px] text-limestone-300">
                  {t('تحدد سرعة إرسال البيانات وفق قطر هوائي المركبة وقدرة الإرسال وتردد Ka أو X ومحطات DSN الأرضية (34م أو 70م).', 'Computes empirical telemetry downlinks across astronomical units for Ka/X bands.')}
                </p>
              </div>

              <div className="border border-royal-700 bg-lapis-950/40 p-3">
                <span className="font-semibold text-malachite">4. {t('ديناميكا مدارات انتقال هوهمان', 'Hohmann Interplanetary Transfer Dynamics')}</span>
                <div className="mt-1 font-latin text-[11px] text-ochre-300" dir="ltr">
                  T_transit = π · √(a³ / μ_sun) ≈ 0.5 · a_AU^1.5 · 365.25 [days]
                </div>
                <p className="mt-1 text-[11px] text-limestone-300">
                  {t('تحدد زمن الرحلة المداري الأمثل ونافذة الإطلاق السينودية وتغيير مستوي المدار.', 'Determines minimum-energy transfer durations, synodic departure windows, and capture Delta-V.')}
                </p>
              </div>

              <div className="border border-royal-700 bg-lapis-950/40 p-3">
                <span className="font-semibold text-malachite">5. {t('هندسة الهوامش الصارمة (Margin Rulers)', 'Aerospace Margin Rulers')}</span>
                <p className="mt-1 text-[11px] text-limestone-300">
                  {t('كل مورد (الكتلة، الطاقة، دلتا-في، الميزانية) يخضع لهامش أمان أمثل مظلل بنسبة 10% إلى 30%. الهامش السالب يمنع الإطلاق، والهامش الفائض يقلص كفاءة المهمة.', 'Linear aerospace margin rulers enforce 10%–30% optimal safety bands based on NASA flight standards.')}
                </p>
              </div>
            </div>
          </div>

          {/* Collaborative Model */}
          <div className="rounded-window border border-royal-700 bg-lapis-900/60 p-4">
            <h4 className="font-display text-sm text-ochre-300">
              {t('نموذج التعاون الهندسي: 50% ذكاء اصطناعي / 50% هندسة بشرية', 'Collaborative Model: 50% AI / 50% Human Systems')}
            </h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
              <div className="border border-royal-700 bg-lapis-950/40 p-3">
                <span className="font-bold text-limestone-100">{t('المساهمة البشرية (50%)', 'Human Systems Architecture (50%)')}</span>
                <ul className="mt-2 space-y-1 text-[11px] text-limestone-300">
                  <li>• {t('اشتقاق وصياغة المعادلات الفيزيائية المغلقة للصاروخ والمدار.', 'Derivation of closed-form rocket and astrodynamic formulas.')}</li>
                  <li>• {t('تأليف قصة حملة «أفق آمون» وفصولها الستة وأسرار الإشارة 1420.405 MHz.', 'Crafting the 6-chapter "AMUN Horizon" campaign lore and signals.')}</li>
                  <li>• {t('ابتكار الهوية البصرية المصرية العريقة وتصميم الأيقونات والخرطوش.', 'Directing the ancient Egyptian visual identity and cartouche design.')}</li>
                  <li>• {t('مطابقة واعتماد بيانات ناسا العلمية من Horizons وSBDB وFact Sheets.', 'Vetting and calibrating NASA Horizons, SBDB, and GSFC benchmarks.')}</li>
                </ul>
              </div>

              <div className="border border-royal-700 bg-lapis-950/40 p-3">
                <span className="font-bold text-limestone-100">{t('تسريع الذكاء الاصطناعي (50% نماذج مجانية)', 'AI Implementation Acceleration (50% Free Models)')}</span>
                <ul className="mt-2 space-y-1 text-[11px] text-limestone-300">
                  <li>• <b>DeepSeek 4.1 Flash (Free Tier)</b>: {t('تأسيس كود TypeScript، وتجهيز الدوال الحسابية، وحزم اختبارات Vitest.', 'TypeScript scaffolding, pure math functions, and Vitest test suites.')}</li>
                  <li>• <b>Google Gemini Flash (Free Tier)</b>: {t('تطوير الواجهة البصرية، ودعم الشاشات الصغيرة، والترجمة، وتثبيت الإنتاج.', 'Visual redesign execution, 360px mobile viewport audit, and production build.')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* TAB 3: MISSION FLIGHT CREW */}
      {tab === 'team' ? (
        <div className="space-y-5">
          <div className="rounded-window border border-royal-600 bg-lapis-950/70 p-4">
            <h3 className="font-display text-base text-limestone-50">
              {t('طاقم قيادة المهمة والشركاء الأساسيون', 'AMUN Core Flight Crew & Lead Architects')}
            </h3>
            <p className="mt-1 text-xs text-limestone-300">
              {t(
                'فريق متعدد التخصصات يجمع بين هندسة الميكاترونكس، ديناميكا الطيران الفضائي، التصميم الإبداعي، وهندسة البرمجيات.',
                'An interdisciplinary team combining mechatronics engineering, aerospace flight dynamics, creative visual identity, and software architecture.',
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name.en}
                className="flex flex-col justify-between rounded-window border border-royal-700 bg-lapis-900/60 p-4"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={member.image}
                      alt={l(member.name)}
                      className="h-20 w-20 shrink-0 rounded-window border-2 border-ochre-400/80 object-cover shadow-md"
                    />
                    <div className="min-w-0">
                      <h4 className="font-display text-base font-bold text-limestone-50">
                        {l(member.name)}
                      </h4>
                      <div className="mt-0.5 text-xs font-semibold text-ochre-300">
                        {l(member.role)}
                      </div>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 rounded border border-royal-600 bg-royal-950/70 px-2 py-0.5 font-latin text-[10px] text-limestone-200 hover:border-ochre-400 hover:text-ochre-300"
                      >
                        <span>LinkedIn Profile</span>
                      </a>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-limestone-300">
                    {l(member.bio)}
                  </p>

                  <div className="mt-3 border-t border-royal-700/80 pt-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-ochre-400">
                      {t('أبرز الإسهامات الهندسية', 'Key Technical Contributions')}
                    </span>
                    <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-limestone-400">
                      {member.contributions.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <IconCheck className="mt-[3px] h-3 w-3 shrink-0 text-malachite" />
                          <span>{l(c)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* TAB 4: 100% AUTHENTIC NASA DATA */}
      {tab === 'nasa' ? (
        <div className="space-y-5">
          <div className="rounded-window border border-royal-600 bg-lapis-950/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-limestone-50">
                {t('مصادر بيانات NASA الرسمية المعتمدة', 'NASA Authentic Open Datasets & Resources')}
              </h3>
              <StatusPill tone="good">100% NASA Data Compliant</StatusPill>
            </div>
            <p className="mt-1 text-xs text-limestone-300">
              {t(
                'جميع الأرقام والمعايير المدارية والفيزيائية مستمدة مباشرة من قواعد بيانات وكالة ناسا المفتوحة، مع طبقة تخزين مؤقت ولقطات مدمجة تسمح بالعمل دون اتصال.',
                'Every physical constant and ephemeris benchmark is verified against official NASA data endpoints, backed by embedded snapshots for 100% offline flight design.',
              )}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'horizons',
                name: 'NASA JPL Horizons API',
                url: 'https://ssd.jpl.nasa.gov/api/horizons.api',
                desc: {
                  ar: 'تحديد المسافات الدقيقة بين الأرض والشمس وكافة الكواكب والأقمار، وميل المدارات وسرعات التحليق في العصر المرجعي.',
                  en: 'Precise ephemerides, target-Earth and target-Sun ranges, inclinations, and orbital velocities.',
                },
                role: { ar: 'حساب المسافة وزمن الرحلة وهندسة الانتقال المداري', en: 'Distances, transit durations, and transfer geometry' },
              },
              {
                key: 'sbdb',
                name: 'NASA JPL Small-Body Database API (SBDB)',
                url: 'https://ssd-api.jpl.nasa.gov/sbdb.api',
                desc: {
                  ar: 'العناصر المدارية والقطر وفترة الدوران والكتلة للكويكبات والمذنبات مثل 101955 بنو و1 سيريس ومذنب هالي.',
                  en: 'High-precision orbital elements, diameters, and spin periods for asteroids and comets.',
                },
                role: { ar: 'بيانات أهداف الكويكبات والمذنبات في الحملة واللعب الحر', en: 'Asteroid and comet target profiles' },
              },
              {
                key: 'factsheet',
                name: 'NASA Planetary Fact Sheet (Goddard Space Flight Center)',
                url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
                desc: {
                  ar: 'القيم المرجعية الفيزيائية القياسية: الجاذبية السطحية، القطر الاستوائي، الكثافة، وسرعة الإفلات.',
                  en: 'Standard physical planetary values: surface gravity, escape velocity, and diameters.',
                },
                role: { ar: 'معايرة سرعة الإفلات ودلتا-في الكبح المداري والهبوط', en: 'Surface gravity and capture Delta-V benchmarking' },
              },
              {
                key: 'ntrs',
                name: 'NASA Technical Reports Server (NTRS)',
                url: 'https://ntrs.nasa.gov/api/citations/search',
                desc: {
                  ar: 'الأبحاث والتقارير الهندسية المنشورة من مراكز ناسا لدفع الصواريخ، وتصميم أنظمة الحماية من الإشعاع، وهندسة الحافلات.',
                  en: 'Peer-reviewed NASA engineering reports for propulsion, radiation shielding, and bus sizing.',
                },
                role: { ar: 'مراجع ودراسات لوحة «تعلّم» ودلائل التصميم', en: 'Scientific references in the Learn Panel' },
              },
              {
                key: 'images',
                name: 'NASA Image and Video Library API',
                url: 'https://images-api.nasa.gov/search',
                desc: {
                  ar: 'الصور الفلكية عالية الدقة لكافة الأجرام السماوية مع الإسناد وحقوق النشر الرسمية لبعثات ناسا.',
                  en: 'High-resolution space imagery with original mission credits and public-domain licensing.',
                },
                role: { ar: 'صور الأجرام والمركبات الفضائية في خطوات التصميم', en: 'Target and spacecraft visual assets' },
              },
              {
                key: 'basics',
                name: 'NASA JPL Basics of Space Flight',
                url: 'https://science.nasa.gov/learn/basics-of-space-flight/',
                desc: {
                  ar: 'المرجع التعليمي المفاهيمي للهندسة المدارية، وميكانيكا التحليق، والاتصالات العميقة.',
                  en: 'Conceptual primer for orbital mechanics, trajectory design, and deep-space communications.',
                },
                role: { ar: 'المفاهيم التعليمية الأساسية في نافذة المساعدة وتعلّم', en: 'Core educational concepts in the Learn Panel' },
              },
              {
                key: 'dsn',
                name: 'NASA Deep Space Network (DSN) Specifications',
                url: 'https://www.nasa.gov/directorates/somd/space-communications-navigation-program/experimental-dsn/',
                desc: {
                  ar: 'مواصفات هوائيات محطات جولدستون ومدريد وكانبيرا بأقطار 34 متراً و70 متراً، ومعاملات الكسب وترددات X وKa.',
                  en: 'Antenna gain, noise temperatures, and frequency bands for 34m and 70m ground tracking complexes.',
                },
                role: { ar: 'معايرة سرعة نقل البيانات وفق معادلة فرايس في خطوة الاتصالات', en: 'Downlink throughput calibration across deep space' },
              },
            ].map((source) => (
              <div
                key={source.key}
                className="rounded-window border border-royal-700 bg-lapis-900/60 p-3.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-display text-sm font-bold text-limestone-50">
                    {source.name}
                  </h4>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-latin text-[11px] text-ochre-400 hover:underline"
                    dir="ltr"
                  >
                    {source.url.replace('https://', '')}
                  </a>
                </div>
                <p className="mt-1.5 text-xs text-limestone-300">{l(source.desc)}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-malachite">
                  <span className="font-semibold">{t('التطبيق في اللعبة:', 'Application in AMUN:')}</span>
                  <span className="text-limestone-200">{l(source.role)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Footer Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-royal-700 pt-4">
        <div className="text-[11px] text-limestone-400">
          <span>PROJECT AMUN</span>
          <span className="mx-1.5 text-royal-500">/</span>
          <span className="text-ochre-400">NASA Space Apps Challenge 2026</span>
        </div>
        <div className="flex items-center gap-2">
          {onCampaign ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onCampaign();
              }}
              className="btn-secondary !min-h-[36px] text-xs"
            >
              <IconFlag className="h-3.5 w-3.5 text-ochre-400" />
              <span>{t('فتح الحملة القصصية', 'Open Campaign')}</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost !min-h-[36px] text-xs"
          >
            {t('إغلاق الدليل', 'Close Dossier')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
