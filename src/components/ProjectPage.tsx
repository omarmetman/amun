import { useRef, useState } from 'react';
import { GITHUB, LIVE_LAB } from '../data/links';
import { useLang, useT } from '../i18n';
import { Cartouche } from './Ornament';
import { IconCheck, IconDownload, IconExternal, IconPlay, IconRocket, IconTarget } from './Icons';
import { Ltr, PageFooter, SectionHeading, Stat } from './PagePrimitives';
import { PageShell } from './PageShell';
import { SiteHeader } from './SiteHeader';
import { TeamCard, type TeamMember } from './TeamCard';
import { StatusPill } from './Badges';

import abdullahImg from '../assets/team/abdullah.jpg';
import omarImg from '../assets/team/omar.jpg';
import elshimaaImg from '../assets/team/elshimaa.jpg';
import mahmoudImg from '../assets/team/mahmoud.jpg';

interface ProjectPageProps {
  onBack: () => void;
  onNasaData?: () => void;
}

const TEAM: TeamMember[] = [
  {
    name: { ar: 'عبدالله عزب', en: 'Abdullah Azb' },
    role: {
      ar: 'القائد (رئيس الفريق وخبير النظم الفضائية والميكانيكا المدارية)',
      en: 'Team Leader & Aerospace Systems Lead',
    },
    tag: { ar: 'القائد', en: 'Team Leader' },
    image: abdullahImg,
    linkedin: 'https://www.linkedin.com/in/abdullah-azb-18290a262',
    bio: {
      ar: 'قائد الفريق المصري لمشروع AMUN في مسابقة NASA Space Apps Challenge 2026، والمتخصص في النظم الفضائية والميكانيكا المدارية. قاد الفريق في تنسيق الرؤية الهندسية الشاملة ومطابقة الحسابات المدارية ومناورات هوهمان وطاقة الحقن C3 مع المعايير العلمية لناسا.',
      en: 'Team Leader of the Egyptian AMUN crew for NASA Space Apps Challenge 2026, specialized in aerospace systems and flight mechanics. Directed overall systems architecture, orbital Hohmann transfers, launcher C3 curves, and NASA scientific compliance.',
    },
    contributions: [
      {
        ar: 'القيادة العامة للفريق وتنسيق المعايير الهندسية والفيزيائية للمشروع.',
        en: 'Executive team leadership and aerospace systems synthesis.',
      },
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
    name: { ar: 'عمر محمد عتمان', en: 'Omar Mohammed Etman' },
    role: {
      ar: 'مطور المشروع (مهندس البرمجيات والنظم المعمارية)',
      en: 'Project Lead Developer & Systems Architect',
    },
    tag: { ar: 'مطور المشروع', en: 'Lead Developer' },
    image: omarImg,
    linkedin: 'https://www.linkedin.com/in/omar-m-etman',
    bio: {
      ar: 'طالب هندسة ميكاترونكس بجامعة الدلتا، ومطور برمجيات شامل بخبرة أكثر من 5 سنوات في الإنتاج. المطور والمبرمج الرئيسي لمنصة AMUN؛ بنى المحرك الحسابي المغلق (src/engine)، واشتق معادلة تسيلكوفسكي الدقيقة مع نسبة خزان الوقود الهيكلية (k)، وطوّر واجهة الويب الشاملة بـ React 18 وTypeScript وVite مع محرك الحالة Zustand ونشر المعمل التفاعلي.',
      en: 'Mechatronics engineering student at Delta University, full-stack software developer with 5+ years of production experience. Lead developer of AMUN: engineered the pure closed-form astrodynamics engine (src/engine), derived the exact Tsiolkovsky solver with tank fraction (k), and deployed the live interactive lab.',
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
        ar: 'بناء معمل الاستعراض التفاعلي الحي على موقعه الشخصي (omarmetman.vercel.app/projects/amun).',
        en: 'Engineered and deployed the live interactive lab showcase on personal portfolio.',
      },
      {
        ar: 'هندسة معمارية PWA تعمل 100% دون اتصال بالإنترنت مع دعم كامل لثنائية اللغة (عربي / إنجليزي).',
        en: 'Architected 100% offline-ready client-side PWA with native bilingual support.',
      },
    ],
  },
  {
    name: { ar: 'الشيماء سيد محمد', en: 'Elshimaa Sayed Mohamed' },
    role: {
      ar: 'مسؤولة الهوية البصرية (مديرة الإبداع وتجربة المستخدم)',
      en: 'Creative Director & Visual Identity Lead',
    },
    tag: { ar: 'الهوية البصرية', en: 'Visual Identity' },
    image: elshimaaImg,
    linkedin: 'http://linkedin.com/in/oshsayeddesigner',
    bio: {
      ar: 'المصممة الإبداعية المسؤولة عن الهوية البصرية والواجهات. ابتكرت لوحة الأصباغ المستوحاة من الجداريات المصرية القديمة (اللازورد، الأزرق المصري، الحجر الجيري، والمغرة الذهبية)، وصممت طاقم الأيقونات الهندسية الدقيقة 24px، والخرطوش الملكي، وإفريز اللوتس، مع تدقيق تجربة المستخدم لشاشات الهواتف المحمولة حتى عرض 360 بكسل.',
      en: 'Creative designer responsible for AMUN visual identity and UI/UX. Conceptualized the Ancient Egyptian mural pigment palette (Lapis, Egyptian Blue, Limestone, Gold Ochre), crafted the 24px technical stroke iconography, royal cartouches, and lotus friezes, optimized for 360px mobile viewports.',
    },
    contributions: [
      {
        ar: 'ابتكار لوحة ألوان الجداريات المصرية وتوظيفها كمخطط هندسي علمي صارم دون زخارف مبتذلة.',
        en: 'Designed the mural pigment palette and translated it into disciplined technical blueprint tokens.',
      },
      {
        ar: 'تصميم الخرطوش الملكي وإفريز اللوتس لعرض بيانات وتيليمتري المركبة بوقار حضاري.',
        en: 'Created the royal cartouche and lotus frieze components to frame flight telemetry.',
      },
      {
        ar: 'رسم الأيقونات الهندسية الدقيقة بشبكة 24 بكسل لتمثيل أجهزة المركبة والمراحل الـ 11.',
        en: 'Drew 24px technical stroke glyphs representing spacecraft subsystems and milestones.',
      },
      {
        ar: 'ضبط التجاوب البصري الدقيق لشاشات الهواتف المحمولة حتى عرض 360 بكسل.',
        en: 'Audited and optimized layout ergonomics for compact 360px mobile viewports.',
      },
    ],
  },
  {
    name: { ar: 'محمود عبدالحميد', en: 'Mahmoud Abdelhamid' },
    role: {
      ar: 'عضو فريق (مهندس البرمجيات والقياس عن بعد)',
      en: 'Team Member & Telemetry Software Engineer',
    },
    tag: { ar: 'عضو فريق', en: 'Team Member' },
    image: mahmoudImg,
    linkedin: 'https://www.linkedin.com/in/mahmoud-abdel-hamid-513363406/',
    bio: {
      ar: 'مهندس برمجيات وعضو الفريق المسؤول عن نمذجة اتصالات الفضاء العميق عبر شبكة DSN وفق معادلة فرايس، وتطوير محرك محاكاة مونت كارلو العشوائي الحتمي القائم على البذور، وتصميم حزم الاختبارات المؤتمتة التي حققت 41/41 اختبار ناجح بنسبة 100%.',
      en: 'Software engineer and team member specialized in telecommunications modeling and stochastic simulations. Formulated the Deep Space Network (DSN) link budget, the deterministic seeded Monte Carlo flight engine, and automated Vitest suites (41/41 passing).',
    },
    contributions: [
      {
        ar: 'نمذجة سرعة نقل البيانات وفق معادلة فرايس وهوائيات DSN بأقطار 34 متراً و70 متراً وترددات X وKa.',
        en: 'Engineered bitrate downlink models using Friis transmission equations for 34m/70m DSN dishes.',
      },
      {
        ar: 'برمجة محرك المحاكاة ذي المراحل الأربع (إطلاق، إبحار، وصول، عمليات) والأحداث العشوائية.',
        en: 'Constructed the 4-phase stochastic Monte Carlo engine with design-sensitive flight anomalies.',
      },
      {
        ar: 'كتابة وأتمتة حزمة الاختبارات البرمجية الشاملة بـ 41 اختبار وحدة ناجحاً بنسبة 100%.',
        en: 'Authored comprehensive Vitest test suites achieving 41/41 passing automated tests.',
      },
    ],
  },
];

const ENGINES = [
  {
    number: '01',
    title: {
      ar: 'معادلة تسيلكوفسكي لكتلة الوقود',
      en: 'Tsiolkovsky Propellant Mass',
    },
    formula: 'm_prop = [m_other · (e^x - 1)] / [1 - k · (e^x - 1)]',
    description: {
      ar: 'حل تحليلي مغلق يأخذ في الاعتبار نسبة خزان الوقود الهيكلية (k = 8% إلى 12%) بدقة تامة.',
      en: 'Closed-form calculation incorporating structural tank fraction k without iterative divergence.',
    },
  },
  {
    number: '02',
    title: {
      ar: 'قانون التربيع العكسي للإشعاع الشمسي',
      en: 'Inverse-Square Solar Irradiance',
    },
    formula: 'S(r) = 1361 / r² [W/m²]',
    description: {
      ar: 'ينخفض التدفق الشمسي مع مربع المسافة من 1361 واط/م² عند الأرض إلى 50 واط/م² عند المشتري.',
      en: 'Irradiance drops with the square of distance, enforcing nuclear RTGs for outer solar system targets.',
    },
  },
  {
    number: '03',
    title: {
      ar: 'معادلة فرايس لاتصالات DSN',
      en: 'Friis Path Loss & DSN Link',
    },
    formula: 'Bitrate ∝ P_tx · D_ant² · (f / f_ref)² · (1 / d_AU)²',
    description: {
      ar: 'تحدد سرعة تنزيل البيانات عبر الوحدات الفلكية لهوائيات محطات ناسا 34م و70م لنطاقي X وKa.',
      en: 'Computes empirical telemetry downlinks across astronomical units for Ka/X bands.',
    },
  },
  {
    number: '04',
    title: {
      ar: 'مدارات انتقال هوهمان الكوكبية',
      en: 'Hohmann Interplanetary Transfer',
    },
    formula: 'T_transit ≈ 0.5 · a_AU^1.5 · 365.25 [days]',
    description: {
      ar: 'تحسب زمن العبور المداري الأدنى للطاقة ونوافذ الإطلاق السينودية وتغيير مستوي المدار.',
      en: 'Determines minimum-energy transfer durations, synodic departure windows, and capture Delta-V.',
    },
  },
];

const SOURCES = [
  {
    name: 'NASA JPL Horizons API',
    url: 'https://ssd.jpl.nasa.gov/api/horizons.api',
    desc: {
      ar: 'المسافات الفلكية اللحظية، وميل المدارات، وسرعات التحليق لكافة الكواكب والأقمار.',
      en: 'Target-Earth and target-Sun ranges, inclinations, and orbital velocities.',
    },
  },
  {
    name: 'NASA JPL Small-Body Database API',
    url: 'https://ssd-api.jpl.nasa.gov/sbdb.api',
    desc: {
      ar: 'العناصر المدارية والقطر وفترة الدوران للكويكبات والمذنبات (بنو، سيريس، هالي).',
      en: 'Orbital elements, diameters, and spin periods for small bodies and asteroids.',
    },
  },
  {
    name: 'NASA Planetary Fact Sheet',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
    desc: {
      ar: 'القيم الفيزيائية المرجعية القياسية: الجاذبية السطحية، القطر، وسرعة الإفلات.',
      en: 'Reference physical parameters: surface gravity, diameter, and escape velocities.',
    },
  },
  {
    name: 'NASA Technical Reports Server',
    url: 'https://ntrs.nasa.gov/api/citations/search',
    desc: {
      ar: 'أوراق وتقارير ناسا العلمية في دفع الصواريخ والتدريع الإشعاعي للحافلات الفضائية.',
      en: 'Peer-reviewed NASA engineering literature for propulsion and radiation hardening.',
    },
  },
  {
    name: 'Mission imagery archives',
    url: 'https://images.nasa.gov/',
    desc: {
      ar: 'صور حقيقية عالية الدقة للأجرام السماوية من ناسا وESA وJAXA مع الإسناد الأصلي لكل مهمة.',
      en: 'Real high-resolution planetary photography from NASA, ESA and JAXA with the original mission credit for every frame.',
    },
  },
  {
    name: 'NASA JPL Basics of Space Flight',
    url: 'https://science.nasa.gov/learn/basics-of-space-flight/',
    desc: {
      ar: 'المفاهيم العلمية الأساسية للميكانيكا المدارية والاتصالات في لوحة تعلّم.',
      en: 'Conceptual primer for orbital mechanics and deep-space communications.',
    },
  },
];

export function ProjectPage({ onBack, onNasaData }: ProjectPageProps) {
  const t = useT();
  const lang = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const projectNav = {
    key: 'project',
    label: t('المشروع', 'Project'),
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
              <div className="text-[10px] leading-none text-limestone-400">{t('ملف المشروع', 'Project dossier')}</div>
              <div className="mt-1 truncate font-display text-sm leading-none text-limestone-50">
                {t('مشروع آمون وطاقم العمل', 'Project AMUN & crew')}
              </div>
            </div>
          }
          nav={[
            { key: 'simulator', label: t('المحاكي', 'Simulator'), onClick: onBack },
            projectNav,
            ...(onNasaData
              ? [{ key: 'nasa', label: t('بيانات ناسا', 'NASA science'), onClick: onNasaData }]
              : []),
          ]}
          menuGroups={[
            {
              title: t('الصفحات', 'Pages'),
              items: [
                { key: 'simulator', label: t('محاكي المهام', 'Mission simulator'), onClick: onBack },
                { ...projectNav, label: t('مشروع آمون وطاقم العمل', 'Project AMUN & crew') },
                ...(onNasaData
                  ? [
                      {
                        key: 'nasa',
                        label: t('معلومات ناسا الحقيقية', 'NASA real science'),
                        onClick: onNasaData,
                      },
                    ]
                  : []),
              ],
            },
            {
              title: t('أقسام الصفحة', 'On this page'),
              items: [
                { key: 'trailer', label: t('العرض الترويجي', 'Official trailer'), onClick: () => goToSection('trailer') },
                { key: 'crew', label: t('الفريق المصري', 'The Egyptian crew'), onClick: () => goToSection('crew') },
                { key: 'engineering', label: t('الفكرة الهندسية', 'Engineering concept'), onClick: () => goToSection('engineering') },
                { key: 'nasa-sources', label: t('مصادر ناسا', 'NASA sources'), onClick: () => goToSection('nasa-sources') },
              ],
            },
            {
              title: t('روابط المشروع', 'Project links'),
              items: [
                { key: 'lab', label: t('المعمل التفاعلي الحي', 'Live interactive lab'), href: LIVE_LAB },
                { key: 'github', label: 'GitHub', href: GITHUB },
              ],
            },
          ]}
          primaryAction={{
            label: t('المعمل التفاعلي', 'Live lab'),
            onClick: () => window.open(LIVE_LAB, '_blank', 'noopener,noreferrer'),
            icon: <IconRocket className="h-4 w-4" />,
          }}
          menuLabel={t('قائمة المشروع', 'Project menu')}
        />
      }
    >
      <div className="space-y-12">
        {/* Hero */}
        <section className="grid gap-6 border-b border-royal-700 pb-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Cartouche>
                <span className="font-latin text-[10px] tracking-[0.18em] text-ochre-300">PROJECT AMUN / 2026</span>
              </Cartouche>
              <StatusPill tone="good">{t('الفريق المصري', 'Egyptian crew')}</StatusPill>
              <StatusPill tone="info">NASA Space Apps 2026</StatusPill>
            </div>

            <h1 className="mt-5 max-w-[24ch] font-display text-[28px] leading-[1.3] text-limestone-50 sm:text-4xl">
              {t('من النيل إلى النجوم: منصة هندسة ومحاكاة المهام الفضائية العميقة', 'From the Nile to the stars: a deep-space mission engineering lab')}
            </h1>

            <p className="mt-4 max-w-[70ch] text-sm leading-[1.9] text-limestone-200 sm:text-base">
              {t(
                'مشروع مفتوح المصدر صممه وبرمجه فريق مصري لتمثيل جمهورية مصر العربية في تحدي ناسا الدولي لتطبيقات الفضاء 2026. يدمج المشروع بين دقة الفلك المصري القديم والنظريات الحديثة للميكانيكا المدارية، فوق بيانات مفتوحة موثقة من وكالة ناسا.',
                'An open-source aerospace systems platform engineered by an Egyptian crew to represent Egypt in the NASA Space Apps Challenge 2026. It fuses ancient Nile astronomical precision with modern astrodynamics, built on documented NASA open data.',
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a href={LIVE_LAB} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs sm:text-sm">
                <IconRocket className="h-4 w-4" />
                <span>{t('فتح المعمل التفاعلي', 'Open the live lab')}</span>
                <IconExternal className="h-3.5 w-3.5" />
              </a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn-secondary font-latin text-xs sm:text-sm">
                <span>GitHub</span>
                <IconExternal className="h-3.5 w-3.5" />
              </a>
              {onNasaData ? (
                <button type="button" onClick={onNasaData} className="btn-ghost text-xs sm:text-sm">
                  <IconTarget className="h-4 w-4 text-malachite" />
                  <span>{t('تقرير بيانات ناسا', 'NASA science dossier')}</span>
                </button>
              ) : null}
            </div>
          </div>

          <aside className="min-w-0 border border-royal-700 bg-lapis-900/40">
            <div className="flex items-center justify-between gap-2 border-b border-royal-700 px-4 py-2.5">
              <span className="text-[10px] font-semibold tracking-wide text-limestone-400">
                {t('بطاقة المهمة', 'Mission file')}
              </span>
              <span className="font-latin text-[10px] tabular-nums text-ochre-300" dir="ltr">
                AMUN-2026
              </span>
            </div>
            <dl className="divide-y divide-royal-700 text-xs">
              {[
                [t('البرنامج', 'Program'), 'NASA Space Apps Challenge'],
                [t('الفريق', 'Crew'), t('فريق مصري متعدد التخصصات', 'Multidisciplinary Egyptian crew')],
                [t('نطاق المحاكاة', 'Scope'), t('11 خطوة هندسية', '11 engineering steps')],
                [t('مصادر البيانات', 'Data'), t('7 مصادر ناسا مفتوحة', '7 NASA open sources')],
                [t('الاختبارات', 'Tests'), t('41/41 ناجح', '41/41 passing')],
                [t('الترخيص', 'License'), 'MIT'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3 px-4 py-2">
                  <dt className="shrink-0 text-limestone-400">{label}</dt>
                  <dd className="min-w-0 text-end text-limestone-100">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-royal-700 px-4 py-3">
              <p className="text-[10px] leading-relaxed text-limestone-400">
                {t(
                  'منصة تعليمية مفتوحة المصدر، وليست أداة هندسية معتمدة.',
                  'An open-source educational platform, not a certified engineering tool.',
                )}
              </p>
            </div>
          </aside>
        </section>

        {/* 01 — Trailer */}
        <section id="trailer" className="scroll-mt-24">
          <SectionHeading
            number="01"
            eyebrow={t('الفيلم التعريفي', 'Promotional film')}
            title={t('العرض الترويجي الرسمي', 'The official trailer')}
            description={t(
              'فيديو تعريفي مدته 30 ثانية يشرح رحلة مهندس المهمة عبر 11 خطوة، من تحديد الهدف حتى تقرير التقييم، مع تعليق عربي وترجمة متزامنة.',
              'A 30-second trailer tracing the mission engineer across 11 steps, from target selection to the final debrief, with Arabic voiceover and synced captions.',
            )}
            action={<StatusPill tone="muted">30.0s / 1080p / 30fps</StatusPill>}
          />

          <div className="border border-royal-700 bg-black">
            <div className="relative aspect-video w-full">
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/AMUN_promo.mp4" type="video/mp4" />
                <track
                  kind="subtitles"
                  src="/amun_subtitles_ar.vtt"
                  srcLang="ar"
                  label={t('العربية', 'Arabic')}
                  default={lang === 'ar'}
                />
                <track
                  kind="subtitles"
                  src="/amun_subtitles_en.vtt"
                  srcLang="en"
                  label={t('الإنجليزية', 'English')}
                  default={lang === 'en'}
                />
                {t('متصفحك لا يدعم تشغيل الفيديو.', 'Your browser does not support the video tag.')}
              </video>

              {!isPlaying ? (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-lapis-950/45 transition-colors hover:bg-lapis-950/25"
                  aria-label={t('تشغيل الفيديو', 'Play video')}
                >
                  <span className="flex h-16 w-16 items-center justify-center border border-ochre-300 bg-ochre-400 text-lapis-950 sm:h-20 sm:w-20">
                    <IconPlay className="h-8 w-8 sm:h-10 sm:w-10" />
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <a
                href="/amun_subtitles_ar.srt"
                download="amun_subtitles_ar.srt"
                className="inline-flex min-h-[36px] items-center gap-1.5 text-[11px] text-limestone-300 transition-colors hover:text-ochre-200"
              >
                <IconDownload className="h-3.5 w-3.5" />
                <span>{t('الترجمة العربية (.srt)', 'Arabic subtitles (.srt)')}</span>
              </a>
              <span className="hidden h-4 w-px self-center bg-royal-700 sm:block" aria-hidden="true" />
              <a
                href="/amun_subtitles_en.srt"
                download="amun_subtitles_en.srt"
                className="inline-flex min-h-[36px] items-center gap-1.5 text-[11px] text-limestone-300 transition-colors hover:text-ochre-200"
              >
                <IconDownload className="h-3.5 w-3.5" />
                <span>{t('الترجمة الإنجليزية (.srt)', 'English subtitles (.srt)')}</span>
              </a>
            </div>
            <span className="font-latin text-[10px] text-limestone-400">
              AR voiceover / synced subtitles / 00:30.0
            </span>
          </div>
        </section>

        {/* 02 — Crew */}
        <section id="crew" className="scroll-mt-24">
          <SectionHeading
            number="02"
            eyebrow={t('طاقم المهمة', 'Flight crew')}
            title={t('الفريق المصري', 'The Egyptian crew')}
            description={t(
              'فريق متكامل يجمع هندسة الميكاترونكس وديناميكا الطيران والبرمجيات والهوية البصرية. استُلهم اسم آمون من رمز الهواء وخفايا الكون في الحضارة المصرية القديمة.',
              'A multidisciplinary crew spanning mechatronics, flight dynamics, software and visual identity. The name Amun comes from the ancient Egyptian symbol of wind and the hidden order of the cosmos.',
            )}
            action={
              <span className="inline-flex items-center gap-1.5 text-[11px] text-malachite">
                <IconCheck className="h-3.5 w-3.5" />
                {t('فريق مصري 100%', '100% Egyptian')}
              </span>
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            {TEAM.map((member, index) => (
              <TeamCard key={member.name.en} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* 03 — Engineering model */}
        <section id="engineering" className="scroll-mt-24">
          <SectionHeading
            number="03"
            eyebrow={t('منهجية هندسة النظم', 'Systems engineering')}
            title={t('الفكرة الهندسية ومحركات الفيزياء الخمسة', 'The engineering concept and five physics engines')}
            description={t(
              'يعتمد AMUN على محرك فيزيائي نقي مكتوب بلغة TypeScript بدون إطارات عمل خارجية، يربط خمس معادلات مغلقة معتمدة لدى وكالة ناسا.',
              'AMUN implements a pure TypeScript astrodynamics engine coupling five closed-form formulations verified against NASA standards.',
            )}
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENGINES.map((engine) => (
              <div key={engine.number} className="flex flex-col border border-royal-700 bg-lapis-900/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-latin text-[10px] tabular-nums tracking-[0.16em] text-ochre-300" dir="ltr">
                    EQUATION {engine.number}
                  </span>
                  <span className="font-latin text-[9px] uppercase text-limestone-400">closed form</span>
                </div>
                <h3 className="mt-2 font-display text-sm leading-snug text-limestone-100">{t(engine.title.ar, engine.title.en)}</h3>
                <div className="mt-3 border border-royal-700 bg-lapis-950 px-2.5 py-2" dir="ltr">
                  <code className="break-anywhere block font-mono text-[11px] leading-relaxed text-ochre-200">
                    {engine.formula}
                  </code>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-limestone-400">{t(engine.description.ar, engine.description.en)}</p>
              </div>
            ))}

            <div className="flex flex-col border border-royal-700 bg-lapis-900/40 p-4 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-latin text-[10px] tabular-nums tracking-[0.16em] text-ochre-300" dir="ltr">
                  EQUATION 05
                </span>
                <span className="font-latin text-[9px] uppercase text-limestone-400">NASA SP-8000</span>
              </div>
              <h3 className="mt-2 font-display text-sm leading-snug text-limestone-100">
                {t('مساطر الهوامش الهندسية الصارمة', 'Aerospace margin rulers and optimisation')}
              </h3>
              <p className="mt-2.5 max-w-[70ch] text-xs leading-relaxed text-limestone-300">
                {t(
                  'تلتزم اللعبة بمعايير NASA SP-8000؛ لكل مورد حرج (الكتلة، الطاقة، دلتا-في، الميزانية) نطاق هامش أمان أمثل بين 10% و30%. الهامش السالب يوقف المحاكاة بخطأ مانع، والهامش الفائض يقلل نقاط الكفاءة.',
                  'AMUN adheres to NASA SP-8000: every critical resource (mass, power, Delta-V, budget) enforces a 10%–30% safety band. A negative margin blocks the flight, while an oversized margin penalises efficiency.',
                )}
              </p>
            </div>
          </div>
        </section>

        {/* 04 — Data provenance */}
        <section id="nasa-sources" className="scroll-mt-24">
          <SectionHeading
            number="04"
            eyebrow={t('مصادر البيانات', 'Data provenance')}
            title={t('بيانات ناسا المفتوحة', '100% authentic NASA open data')}
            description={t(
              'كل رقم هندسي في المحاكي يعود إلى مصدر ناسا موثق. هذه الجهات هي مرجع المسافات والعناصر المدارية والخصائص الفيزيائية للصواريخ والاتصالات.',
              'Every engineering figure in the simulator traces back to a documented NASA source for distances, orbital elements, propulsion and communications.',
            )}
            action={
              onNasaData ? (
                <button type="button" onClick={onNasaData} className="btn-secondary text-xs">
                  {t('التقرير الكامل', 'Full report')}
                  <IconExternal className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />

          <ul className="grid gap-px border border-royal-700 bg-royal-700 sm:grid-cols-2">
            {SOURCES.map((source, index) => (
              <li key={source.name} className="group flex min-w-0 flex-col bg-lapis-950 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-baseline gap-2.5">
                    <span className="font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="break-words font-display text-sm leading-snug text-limestone-100">{source.name}</h3>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`فتح ${source.name}`, `Open ${source.name}`)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-royal-700 text-limestone-300 transition-colors hover:border-ochre-400 hover:text-ochre-200"
                  >
                    <IconExternal className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-limestone-300">{t(source.desc.ar, source.desc.en)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-2 divide-x divide-royal-700 border border-royal-700 sm:grid-cols-4 rtl:divide-x-reverse">
            <Stat value="04" label={t('أعضاء الفريق', 'crew members')} />
            <Stat value="07" label={t('مصادر ناسا', 'NASA sources')} />
            <Stat value="05" label={t('محركات فيزيائية', 'physics engines')} tone="royal" />
            <Stat value="41/41" label={t('اختباراً ناجحاً', 'tests passing')} tone="malachite" />
          </div>
        </section>

        <PageFooter
          start={
            <>
              <button type="button" onClick={onBack} className="btn-primary text-xs">
                <IconRocket className="h-4 w-4" />
                <span>{t('العودة إلى المحاكي', 'Return to the simulator')}</span>
              </button>
              {onNasaData ? (
                <button type="button" onClick={onNasaData} className="btn-secondary text-xs">
                  <IconTarget className="h-4 w-4 text-malachite" />
                  <span>{t('معلومات ناسا الحقيقية', 'NASA real science')}</span>
                </button>
              ) : null}
            </>
          }
          end={
            <span>
              <Ltr>PROJECT AMUN</Ltr> / NASA Space Apps Challenge 2026 / MIT
            </span>
          }
        />
      </div>
    </PageShell>
  );
}
