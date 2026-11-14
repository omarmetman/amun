import { useEffect, useRef, useState } from 'react';
import { useL, useLang, useT } from '../i18n';
import { LanguageToggle } from './Header';
import { AmunLogo } from './AmunLogo';
import { Cartouche, Frieze } from './Ornament';
import { StatusPill } from './Badges';
import {
  IconCheck,
  IconChevron,
  IconDownload,
  IconPlay,
  IconRocket,
  IconTarget,
} from './Icons';

import abdullahImg from '../assets/team/abdullah.jpg';
import omarImg from '../assets/team/omar.jpg';
import elshimaaImg from '../assets/team/elshimaa.jpg';
import mahmoudImg from '../assets/team/mahmoud.jpg';

interface ProjectPageProps {
  onBack: () => void;
  onNasaData?: () => void;
}

export function ProjectPage({ onBack, onNasaData }: ProjectPageProps) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title =
      lang === 'ar'
        ? 'مشروع AMUN | الفريق المصري لمسابقة ناسا Space Apps 2026'
        : 'Project AMUN | Egyptian NASA Space Apps Team 2026';
  }, [lang]);

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

  const team = [
    {
      name: { ar: 'عبدالله عزب', en: 'Abdullah Azb' },
      role: {
        ar: 'القائد (رئيس الفريق وخبير النظم الفضائية والميكانيكا المدارية)',
        en: 'Team Leader & Aerospace Systems Lead',
      },
      tag: { ar: 'القائد', en: 'Team Leader' },
      tagColor: 'border-ochre-400/80 bg-ochre-500/15 text-ochre-300 ring-1 ring-ochre-400/30',
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
      tagColor: 'border-cyan-400/80 bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30',
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
      tagColor: 'border-amber-400/80 bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
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
      tagColor: 'border-emerald-400/80 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
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

  return (
    <div className="min-h-screen bg-lapis-950 text-limestone-100 overflow-x-hidden">
      {/* Ancient Egyptian Architectural Frieze */}
      <Frieze className="text-royal-500" />

      {/* Sticky Header Across Navigation */}
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
            {onNasaData ? (
              <button
                type="button"
                onClick={onNasaData}
                className="btn-secondary !min-h-[36px] !px-3 text-xs"
              >
                <IconTarget className="h-3.5 w-3.5 text-ochre-400" />
                <span>{t('معلومات ناسا الحقيقية ↗', 'NASA Real Science ↗')}</span>
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

      {/* Main Full Page Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-royal-600 bg-gradient-to-b from-royal-950 via-lapis-900 to-lapis-950 p-6 sm:p-10 text-center shadow-2xl">
          <div className="mx-auto mb-4 inline-flex flex-wrap items-center justify-center gap-2">
            <Cartouche>
              <span className="font-display text-xs sm:text-sm tracking-widest text-ochre-300">
                PROJECT AMUN • مشروع آمون
              </span>
            </Cartouche>
            <StatusPill tone="good">🇪🇬 الفريق المصري • NASA Space Apps 2026</StatusPill>
          </div>

          <h1 className="font-display text-2xl font-extrabold leading-tight text-limestone-50 sm:text-4xl lg:text-5xl">
            {t(
              'من النيل إلى النجوم: منصة هندسة ومحاكاة المهام الفضائية العميقة',
              'From the Nile to the Stars: Deep-Space Mission Engineering Simulator',
            )}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-limestone-200">
            {t(
              'مشروع مفتوح المصدر تم تصميمه وبرمجته بأيدي نخبة من الشباب والمهندسين المصريين لتمثيل جمهورية مصر العربية في تحدي ناسا الدولي لتطبيقات الفضاء (NASA Space Apps Challenge 2026). يدمج المشروع بين عبقرية الفلك والهندسة المصرية القديمة، وأحدث النظريات الأستروجرافيكية ومصادر بيانات وكالة ناسا المعتمدة 100%.',
              'An open-source aerospace systems engineering platform engineered by an Egyptian crew to represent Egypt in the global NASA Space Apps Challenge 2026. Fusing ancient Nile astronomical precision with modern 21st-century interplanetary astrodynamics and 100% authentic NASA open datasets.',
            )}
          </p>

          {/* Quick Action Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://omarmetman.vercel.app/projects/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !min-h-[42px] !px-5 text-xs sm:text-sm font-bold shadow-lg"
            >
              <IconRocket className="h-4 w-4" />
              <span>{t('فتح المعمل التفاعلي الحي ↗', 'Launch Live Lab ↗')}</span>
            </a>
            <a
              href="https://github.com/omarmetman/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !min-h-[42px] !px-5 text-xs sm:text-sm font-latin"
            >
              GitHub Repository ↗
            </a>
            {onNasaData ? (
              <button
                type="button"
                onClick={onNasaData}
                className="btn-ghost !min-h-[42px] !px-4 text-xs sm:text-sm text-ochre-300 hover:text-ochre-200"
              >
                <span>{t('تقرير بيانات ناسا وكيف بنيت اللعبة ↗', 'NASA Science Dossier ↗')}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* SECTION 1: OFFICIAL 30-SECOND TRAILER */}
        <section className="rounded-2xl border border-royal-600/80 bg-lapis-900/80 p-5 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-royal-700 pb-4">
            <div>
              <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
                OFFICIAL 30-SECOND PROMOTIONAL FILM
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-limestone-50">
                {t('العرض الترويجي الرسمي (AMUN Trailer)', 'AMUN Official 30s Trailer')}
              </h2>
            </div>
            <StatusPill tone="info">30.0s • 1080p • 30fps</StatusPill>
          </div>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-limestone-300">
            {t(
              'فيديو تعريفي مدته 30 ثانية يشرح رحلة مهندس المهمة في AMUN عبر 11 خطوة هندسية دقيقة من تحديد الهدف حتى تقرير التقييم، مع تعليق صوتي باللغة العربية الفصحى المبسطة وترجمة عربية وإنجليزية متزامنة.',
              'A 30-second official trailer illustrating the spacecraft engineering lifecycle across 11 disciplined steps from target selection to post-flight debrief, featuring simplified modern Arabic voiceover and synced WebVTT captions.',
            )}
          </p>

          {/* Responsive Video Container */}
          <div className="relative mt-6 w-full overflow-hidden rounded-xl border-2 border-royal-700 bg-black shadow-2xl">
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
                  label={t('العربية (Arabic)', 'Arabic')}
                  default={lang === 'ar'}
                />
                <track
                  kind="subtitles"
                  src="/amun_subtitles_en.vtt"
                  srcLang="en"
                  label={t('الإنجليزية (English)', 'English')}
                  default={lang === 'en'}
                />
                {t('متصفحك لا يدعم تشغيل الفيديو.', 'Your browser does not support the video tag.')}
              </video>

              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/25"
                  aria-label={t('تشغيل الفيديو', 'Play video')}
                >
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-ochre-400 bg-ochre-500/90 text-lapis-950 shadow-2xl transition-transform hover:scale-110">
                    <IconPlay className="h-7 w-7 sm:h-9 sm:w-9 translate-x-0.5" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Subtitle Downloads & Telemetry Info */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/amun_subtitles_ar.srt"
                download="amun_subtitles_ar.srt"
                className="btn-ghost !min-h-[30px] !px-2.5 text-xs text-ochre-300 hover:text-ochre-200"
              >
                <IconDownload className="h-3.5 w-3.5" />
                <span>{t('ترجمة عربية (.srt)', 'Arabic Subtitles (.srt)')}</span>
              </a>
              <a
                href="/amun_subtitles_en.srt"
                download="amun_subtitles_en.srt"
                className="btn-ghost !min-h-[30px] !px-2.5 text-xs text-ochre-300 hover:text-ochre-200"
              >
                <IconDownload className="h-3.5 w-3.5" />
                <span>{t('ترجمة إنجليزية (.srt)', 'English Subtitles (.srt)')}</span>
              </a>
            </div>

            <span className="font-latin text-[11px] text-limestone-400">
              Simplified Modern Arabic VO • Synchronized Subtitles • 00:30.0 Exact
            </span>
          </div>
        </section>

        {/* SECTION 2: THE EGYPTIAN FLIGHT CREW (RADICAL REDESIGN FOR MOBILE & DESKTOP) */}
        <section className="rounded-2xl border border-royal-600/80 bg-lapis-900/80 p-5 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="border-b border-royal-700 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-latin text-xs font-bold uppercase tracking-wider text-malachite">
                EGYPTIAN INNOVATORS • NASA SPACE APPS 2026
              </span>
              <StatusPill tone="good">100% Egyptian Crew</StatusPill>
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-limestone-50">
              {t('طاقم المهمة المصري (The Egyptian Flight Crew)', 'The Egyptian Flight Crew')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-limestone-300">
              {t(
                'فريق مصري متكامل يجمع بين شغف استكشاف الفضاء والتميز البرمجي والهندسي؛ يضم طلبة ومهندسين متخصصين في هندسة الميكاترونكس، ديناميكا الطيران والميكانيكا المدارية، الفنون وتصميم الهويات البصرية، وهندسة البرمجيات والنظم الموزعة. استلهم الفريق اسم المشروع من الإله المصري القديم «آمون» رمز الهواء وخفايا الكون، لربط عبقرية الحضارة المصرية القديمة في علوم الفلك بأحدث آفاق الملاحة الفضائية الحديثة.',
                'A dedicated multidisciplinary Egyptian team uniting aerospace flight dynamics, mechatronics systems engineering, software architecture, and authentic cultural visual identity to represent Egypt at NASA Space Apps Challenge 2026.',
              )}
            </p>
          </div>

          {/* Cards Grid: Perfectly responsive on Mobile (Vertical stack) and Desktop (2-column) */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name.en}
                className="flex flex-col justify-between rounded-2xl border border-royal-700/90 bg-gradient-to-b from-royal-950/90 via-lapis-900/95 to-lapis-950 p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-ochre-400/80 hover:shadow-2xl hover:shadow-ochre-500/10"
              >
                <div>
                  {/* Member Header: Stacks neatly on mobile, side-by-side on tablet/desktop */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start">
                    <img
                      src={member.image}
                      alt={l(member.name)}
                      className="h-28 w-28 sm:h-24 sm:w-24 shrink-0 rounded-2xl border-2 border-ochre-400 object-cover shadow-[0_0_20px_rgba(227,169,47,0.3)] ring-4 ring-royal-900/80"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 font-latin text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${member.tagColor}`}>
                          {l(member.tag)}
                        </span>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-latin text-xs font-semibold text-ochre-400 hover:text-ochre-300 hover:underline"
                        >
                          LinkedIn ↗
                        </a>
                      </div>

                      <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-limestone-50">
                        {l(member.name)}
                      </h3>
                      <div className="mt-1 text-xs sm:text-sm font-semibold text-ochre-300">
                        {l(member.role)}
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-limestone-200">
                    {l(member.bio)}
                  </p>

                  {/* Contributions Box */}
                  <div className="mt-5 rounded-xl border border-royal-800 bg-lapis-950/70 p-3.5 sm:p-4">
                    <span className="font-latin text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ochre-400">
                      {t('أبرز الإسهامات الهندسية في المشروع:', 'Core Technical Contributions:')}
                    </span>
                    <ul className="mt-2.5 space-y-2 text-xs sm:text-sm leading-relaxed text-limestone-300">
                      {member.contributions.map((c, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5">
                          <IconCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-malachite" />
                          <span>{l(c)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-royal-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-limestone-400">
                    {t('جمهورية مصر العربية 🇪🇬', 'Arab Republic of Egypt 🇪🇬')}
                  </span>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !min-h-[32px] !px-3 text-xs text-ochre-300 hover:text-ochre-200"
                  >
                    <span>{t('عرض الملف الشخصي ↗', 'LinkedIn Profile ↗')}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CONCEPT & SYSTEMS ARCHITECTURE */}
        <section className="rounded-2xl border border-royal-600/80 bg-lapis-900/80 p-5 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="border-b border-royal-700 pb-4">
            <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
              SYSTEMS ENGINEERING METHODOLOGY
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-limestone-50">
              {t('الفكرة الهندسية ومحركات الفيزياء الخمسة', 'Engineering Concept & Five Physics Engines')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-limestone-300">
              {t(
                'يعتمد مشروع AMUN على محرك فيزيائي نقي مكتوب بلغة TypeScript بدون أي إطارات عمل خارجية، يربط بين خمس معادلات فيزيائية معتمدة لدى وكالة ناسا:',
                'AMUN implements a pure TypeScript astrodynamics engine (src/engine) coupling five closed-form physics formulations verified by NASA standards:',
              )}
            </p>
          </div>

          {/* 5 Physics Engines Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 01</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('معادلة تسيلكوفسكي لكتلة الوقود', 'Tsiolkovsky Propellant Mass')}
              </h3>
              <div className="mt-2 font-mono text-[11px] text-ochre-300" dir="ltr">
                m_prop = [m_other · (e^x - 1)] / [1 - k · (e^x - 1)]
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('حل تحليلي مغلق يأخذ في الاعتبار نسبة خزان الوقود الهيكلية (k = 8% إلى 12%) بدقة تامة.', 'Closed-form calculation incorporating structural tank fraction k without iterative divergence.')}
              </p>
            </div>

            <div className="rounded-xl border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 02</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('قانون التربيع العكسي للإشعاع الشمسي', 'Inverse-Square Solar Irradiance')}
              </h3>
              <div className="mt-2 font-mono text-[11px] text-ochre-300" dir="ltr">
                S(r) = 1361 / r² [W/m²]
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('ينخفض التدفق الشمسي مع مربع المسافة من 1361 واط/م² عند الأرض إلى 50 واط/م² عند المشتري.', 'Irradiance drops with square of distance, enforcing nuclear RTGs for outer solar system targets.')}
              </p>
            </div>

            <div className="rounded-xl border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 03</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('معادلة فرايس لاتصالات DSN', 'Friis Path Loss & DSN Link')}
              </h3>
              <div className="mt-2 font-mono text-[11px] text-ochre-300" dir="ltr">
                Bitrate ∝ P_tx · D_ant² · (f / f_ref)² · (1 / d_AU)²
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('تحدد سرعة تنزيل البيانات عبر الوحدات الفلكية لهوائيات محطات ناسا 34م و70م لنطاقي X وKa.', 'Computes empirical telemetry downlinks across astronomical units for Ka/X bands.')}
              </p>
            </div>

            <div className="rounded-xl border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 04</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('مدارات انتقال هوهمان الكوكبية', 'Hohmann Interplanetary Transfer')}
              </h3>
              <div className="mt-2 font-mono text-[11px] text-ochre-300" dir="ltr">
                T_transit ≈ 0.5 · a_AU^1.5 · 365.25 [days]
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('تحسب زمن العبور المداري الأدنى للطاقة ونوافذ الإطلاق السينودية وتغيير مستوي المدار.', 'Determines minimum-energy transfer durations, synodic departure windows, and capture Delta-V.')}
              </p>
            </div>

            <div className="rounded-xl border border-royal-700 bg-lapis-950/70 p-4 sm:col-span-2 lg:col-span-2">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 05</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('مساطر الهوامش الهندسية الصارمة (Aerospace Margin Rulers)', 'Aerospace Margin Rulers & Optimization')}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-limestone-300">
                {t(
                  'تلتزم اللعبة بمعايير NASA SP-8000؛ حيث تفرض على كل مورد حرج (الكتلة، الطاقة، دلتا-في، الميزانية) نطاق هامش أمان أمثل مظلل بنسبة 10% إلى 30%. الهامش السالب يوقف المحاكاة بخطأ مانع، بينما الهامش الفائض يقلل نقاط الكفاءة الإجمالية.',
                  'Adheres strictly to NASA SP-8000 flight guidelines: each vital resource enforces a shaded 10%–30% safety band. Negative margins block flight with instant errors, while excessive margins penalize efficiency.',
                )}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: 100% NASA OPEN DATA SOURCES */}
        <section className="rounded-2xl border border-royal-600/80 bg-lapis-900/80 p-5 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-royal-700 pb-4">
            <div>
              <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
                NASA DATA PROVENANCE
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-limestone-50">
                {t('مصادر بيانات NASA الرسمية المعتمدة 100%', '100% Authentic NASA Open Datasets')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill tone="good">Global Award Eligible</StatusPill>
              {onNasaData ? (
                <button
                  type="button"
                  onClick={onNasaData}
                  className="btn-secondary !min-h-[30px] !px-2.5 text-xs text-ochre-300"
                >
                  {t('شرح كامل ↗', 'Full Report ↗')}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                name: 'NASA JPL Horizons API',
                url: 'https://ssd.jpl.nasa.gov/api/horizons.api',
                desc: t(
                  'المسافات الفلكية اللحظية، وميل المدارات، وسرعات التحليق لكافة الكواكب والأقمار.',
                  'Target-Earth and target-Sun ranges, inclinations, and orbital velocities.',
                ),
              },
              {
                name: 'NASA JPL Small-Body Database API (SBDB)',
                url: 'https://ssd-api.jpl.nasa.gov/sbdb.api',
                desc: t(
                  'العناصر المدارية والقطر وفترة الدوران للكويكبات والمذنبات (بنو، سيريس، هالي).',
                  'Orbital elements, diameters, and spin periods for small bodies and asteroids.',
                ),
              },
              {
                name: 'NASA Planetary Fact Sheet (GSFC)',
                url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
                desc: t(
                  'القيم الفيزيائية المرجعية القياسية: الجاذبية السطحية، القطر، وسرعة الإفلات.',
                  'Reference physical parameters: surface gravity, diameter, and escape velocities.',
                ),
              },
              {
                name: 'NASA Technical Reports Server (NTRS)',
                url: 'https://ntrs.nasa.gov/api/citations/search',
                desc: t(
                  'أوراق وتقارير ناسا العلمية في دفع الصواريخ والتدريع الإشعاعي للحافلات الفضائية.',
                  'Peer-reviewed NASA engineering literature for propulsion and radiation hardening.',
                ),
              },
              {
                name: 'NASA Image and Video Library API',
                url: 'https://images-api.nasa.gov/search',
                desc: t(
                  'الصور الفلكية عالية الدقة للأجرام السماوية مع الإسناد وحقوق النشر الرسمية.',
                  'High-resolution planetary photography with authentic NASA/JPL mission credits.',
                ),
              },
              {
                name: 'NASA JPL Basics of Space Flight',
                url: 'https://science.nasa.gov/learn/basics-of-space-flight/',
                desc: t(
                  'المفاهيم العلمية الأساسية للميكانيكا المدارية والاتصالات في لوحة تعلّم.',
                  'Conceptual primer for orbital mechanics and deep-space communications.',
                ),
              },
            ].map((s) => (
              <div key={s.name} className="rounded-xl border border-royal-700 bg-lapis-950/60 p-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-sm font-bold text-limestone-100">{s.name}</h4>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-latin text-[10px] text-ochre-400 hover:underline"
                    dir="ltr"
                  >
                    API ↗
                  </a>
                </div>
                <p className="mt-1.5 text-xs text-limestone-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Navigation Back to Simulator */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-royal-700 py-6">
          <button
            type="button"
            onClick={onBack}
            className="btn-primary !min-h-[44px] !px-6 text-sm font-bold"
          >
            <IconRocket className="h-4 w-4" />
            <span>{t('العودة إلى محاكي المهمة 🚀', 'Return to Mission Simulator 🚀')}</span>
          </button>

          <div className="flex items-center gap-4 text-xs text-limestone-400">
            <span>PROJECT AMUN • NASA Space Apps Challenge 2026</span>
            <span>MIT License</span>
          </div>
        </div>
      </main>
    </div>
  );
}
