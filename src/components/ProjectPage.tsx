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
} from './Icons';

import abdullahImg from '../assets/team/abdullah.jpg';
import omarImg from '../assets/team/omar.jpg';
import elshimaaImg from '../assets/team/elshimaa.jpg';
import mahmoudImg from '../assets/team/mahmoud.jpg';

interface ProjectPageProps {
  onBack: () => void;
}

export function ProjectPage({ onBack }: ProjectPageProps) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title =
      lang === 'ar'
        ? 'مشروع AMUN | الفريق المصري لمسابقة ناسا Space Apps'
        : 'Project AMUN | Egyptian NASA Space Apps Team';
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
        ar: 'القائد (رئيس الفريق وخبير النظم الفضائية)',
        en: 'Team Leader & Aerospace Systems Lead',
      },
      tag: { ar: 'القائد', en: 'Leader' },
      tagColor: 'border-ochre-400 bg-ochre-400/20 text-ochre-300',
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
      tagColor: 'border-cyan-400 bg-cyan-400/20 text-cyan-300',
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
      tagColor: 'border-amber-400 bg-amber-400/20 text-amber-300',
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
        ar: 'عضو فريق (مهندس البرمجيات ومسؤول القياس عن بعد)',
        en: 'Team Member & Software Telemetry Engineer',
      },
      tag: { ar: 'عضو فريق', en: 'Team Member' },
      tagColor: 'border-emerald-400 bg-emerald-400/20 text-emerald-300',
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
    <div className="min-h-screen bg-lapis-950 text-limestone-100">
      {/* Ancient Egyptian Architectural Frieze */}
      <Frieze className="text-royal-500" />

      {/* Standalone Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-royal-700 bg-lapis-900/95 backdrop-blur">
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
            <div className="h-6 w-px bg-royal-700" />
            <AmunLogo className="h-9 w-9" withWordmark />
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <a
              href="https://omarmetman.vercel.app/projects/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !min-h-[36px] !px-3 text-xs hidden sm:inline-flex"
            >
              <IconRocket className="h-3.5 w-3.5" />
              <span>{t('المعمل التفاعلي ↗', 'Live Lab ↗')}</span>
            </a>
            <a
              href="https://github.com/omarmetman/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !min-h-[36px] !px-2.5 text-xs font-latin"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Full Page Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-window border-2 border-royal-600 bg-gradient-to-b from-royal-950 via-lapis-900 to-lapis-950 p-6 sm:p-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2">
            <Cartouche>
              <span className="font-display text-sm tracking-widest text-ochre-300">
                PROJECT AMUN • مشروع آمون
              </span>
            </Cartouche>
            <StatusPill tone="good">NASA Space Apps 2026</StatusPill>
          </div>

          <h1 className="font-display text-3xl font-extrabold leading-tight text-limestone-50 sm:text-5xl">
            {t(
              'من النيل إلى النجوم: منصة هندسة ومحاكاة المهام الفضائية العميقة',
              'From the Nile to the Stars: Deep-Space Mission Engineering Simulator',
            )}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-limestone-200 sm:text-base">
            {t(
              'مشروع مفتوح المصدر تم تصميمه وبرمجته بأيدي نخبة من الشباب والمهندسين المصريين لتمثيل جمهورية مصر العربية في تحدي ناسا الدولي لتطبيقات الفضاء (NASA Space Apps Challenge 2026). يدمج المشروع بين عبقرية الفلك والهندسة المصرية القديمة، وأحدث النظريات الأستروجرافيكية ومصادر بيانات وكالة ناسا المعتمدة 100%.',
              'An open-source aerospace systems engineering platform engineered by an Egyptian crew to represent Egypt in the global NASA Space Apps Challenge 2026. Fusing ancient Nile astronomical precision with modern 21st-century interplanetary astrodynamics and 100% authentic NASA open datasets.',
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="btn-primary !min-h-[44px] !px-6 text-sm font-bold"
            >
              <IconRocket className="h-4 w-4" />
              <span>{t('تشغيل المحاكي الآن', 'Launch Simulator Now')}</span>
            </button>
            <a
              href="https://omarmetman.vercel.app/projects/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !min-h-[44px] !px-5 text-sm"
            >
              <span>{t('استعراض المعمل التفاعلي 🚀', 'Interactive Lab Showcase 🚀')}</span>
            </a>
            <a
              href="https://github.com/omarmetman/amun"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !min-h-[44px] !px-4 text-sm font-latin"
            >
              View GitHub Repo
            </a>
          </div>
        </div>

        {/* SECTION 1: OFFICIAL 30-SECOND PROMO VIDEO */}
        <section className="mt-12 rounded-window border border-royal-600 bg-lapis-900/70 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-royal-700 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
                  OFFICIAL MISSION DEMONSTRATION
                </span>
                <StatusPill tone="good">1080p 30 FPS</StatusPill>
              </div>
              <h2 className="mt-1 font-display text-2xl text-limestone-50 sm:text-3xl">
                {t('العرض الترويجي الرسمي (30.0 ثانية)', 'Official 30.0-Second Promotional Video')}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-limestone-300">
              <span className="rounded border border-royal-600 bg-royal-950/60 px-2 py-1 font-latin">
                Duration: 30.0s Exact
              </span>
              <span className="rounded border border-royal-600 bg-royal-950/60 px-2 py-1 font-latin">
                Size: 2.96 MB
              </span>
            </div>
          </div>

          {/* Real Video Player Component */}
          <div className="relative mt-6 overflow-hidden rounded-window border-2 border-ochre-400/80 bg-black shadow-2xl">
            <video
              ref={videoRef}
              src="/AMUN_promo.mp4"
              controls
              playsInline
              preload="metadata"
              poster="/assets/header-3d.svg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full max-h-[560px] object-contain mx-auto"
            >
              <source src="/AMUN_promo.mp4" type="video/mp4" />
              <source src="./AMUN_promo.mp4" type="video/mp4" />
              <source
                src="https://github.com/omarmetman/amun/raw/main/AMUN_promo.mp4"
                type="video/mp4"
              />
              <track
                kind="subtitles"
                src="/amun_subtitles_ar.vtt"
                srcLang="ar"
                label="العربية"
                default={lang === 'ar'}
              />
              <track
                kind="subtitles"
                src="/amun_subtitles_en.vtt"
                srcLang="en"
                label="English"
                default={lang === 'en'}
              />
              {t('المتصفح لا يدعم تشغيل الفيديو.', 'Your browser does not support HTML5 video.')}
            </video>

            {/* Quick Play Overlay if paused */}
            {!isPlaying ? (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors group cursor-pointer"
                aria-label={t('تشغيل الفيديو', 'Play video')}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-ochre-400 text-lapis-950 shadow-2xl transition-transform group-hover:scale-110">
                  <IconPlay className="h-10 w-10 fill-current" />
                </div>
              </button>
            ) : null}
          </div>

          {/* Video Metadata & Downloads */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-royal-700/80 pt-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/AMUN_promo.mp4"
                download="AMUN_promo.mp4"
                className="btn-secondary !min-h-[36px] !px-3 text-xs"
              >
                <IconDownload className="h-3.5 w-3.5 text-ochre-400" />
                <span>{t('تنزيل ملف الفيديو (MP4)', 'Download MP4 Video')}</span>
              </a>
              <a
                href="/amun_subtitles_ar.srt"
                download="amun_subtitles_ar.srt"
                className="btn-ghost !min-h-[36px] !px-3 text-xs"
              >
                <IconDownload className="h-3.5 w-3.5" />
                <span>{t('ترجمة عربية (.srt)', 'Arabic Subtitles (.srt)')}</span>
              </a>
              <a
                href="/amun_subtitles_en.srt"
                download="amun_subtitles_en.srt"
                className="btn-ghost !min-h-[36px] !px-3 text-xs"
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

        {/* SECTION 2: THE EGYPTIAN TEAM */}
        <section className="mt-12 rounded-window border border-royal-600 bg-lapis-900/70 p-6 sm:p-8">
          <div className="border-b border-royal-700 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-latin text-xs font-bold uppercase tracking-wider text-malachite">
                EGYPTIAN INNOVATORS • NASA SPACE APPS 2026
              </span>
              <StatusPill tone="good">100% Egyptian Crew</StatusPill>
            </div>
            <h2 className="mt-1 font-display text-2xl text-limestone-50 sm:text-3xl">
              {t('طاقم المهمة المصري (The Egyptian Flight Crew)', 'The Egyptian Flight Crew')}
            </h2>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-limestone-300 sm:text-sm">
              {t(
                'فريق مصري متكامل يجمع بين شغف استكشاف الفضاء والتميز البرمجي والهندسي؛ يضم طلبة ومهندسين متخصصين في هندسة الميكاترونكس، ديناميكا الطيران والميكانيكا المدارية، الفنون وتصميم الهويات البصرية، وهندسة البرمجيات والنظم الموزعة. استلهم الفريق اسم المشروع من الإله المصري القديم «آمون» رمز الهواء وخفايا الكون، لربط عبقرية الحضارة المصرية القديمة في علوم الفلك بأحدث آفاق الملاحة الفضائية الحديثة.',
                'A dedicated multidisciplinary Egyptian team uniting aerospace flight dynamics, mechatronics systems engineering, software architecture, and authentic cultural visual identity to represent Egypt at NASA Space Apps Challenge 2026.',
              )}
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name.en}
                className="flex flex-col justify-between rounded-window border-2 border-royal-700 bg-lapis-950/80 p-5 transition-all hover:border-ochre-400/70"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={member.image}
                      alt={l(member.name)}
                      className="h-24 w-24 shrink-0 rounded-window border-2 border-ochre-400 object-cover shadow-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded border px-2 py-0.5 font-latin text-[10px] font-bold uppercase tracking-wider ${member.tagColor}`}>
                          {l(member.tag)}
                        </span>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-latin text-[11px] font-semibold text-ochre-400 hover:underline"
                        >
                          LinkedIn ↗
                        </a>
                      </div>

                      <h3 className="mt-1 font-display text-lg font-bold text-limestone-50 sm:text-xl">
                        {l(member.name)}
                      </h3>
                      <div className="mt-0.5 text-xs font-semibold text-ochre-300">
                        {l(member.role)}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3.5 text-xs leading-relaxed text-limestone-200">
                    {l(member.bio)}
                  </p>

                  <div className="mt-4 border-t border-royal-800 pt-3">
                    <span className="font-latin text-[10px] font-bold uppercase tracking-wider text-ochre-400">
                      {t('أبرز الإسهامات الفنية في المشروع:', 'Core Technical Contributions:')}
                    </span>
                    <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-limestone-300">
                      {member.contributions.map((c, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-malachite" />
                          <span>{l(c)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 border-t border-royal-800 pt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-limestone-400">
                    {t('جمهورية مصر العربية', 'Arab Republic of Egypt')}
                  </span>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost !min-h-[30px] !px-2.5 text-xs text-ochre-300 hover:text-ochre-200"
                  >
                    <span>{t('عرض الملف الشخصي ↗', 'View LinkedIn Profile ↗')}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CONCEPT & SYSTEMS ARCHITECTURE */}
        <section className="mt-12 rounded-window border border-royal-600 bg-lapis-900/70 p-6 sm:p-8">
          <div className="border-b border-royal-700 pb-4">
            <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
              SYSTEMS ENGINEERING METHODOLOGY
            </span>
            <h2 className="mt-1 font-display text-2xl text-limestone-50 sm:text-3xl">
              {t('الفكرة الهندسية ومحركات الفيزياء الخمسة', 'Engineering Concept & Five Physics Engines')}
            </h2>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-limestone-300 sm:text-sm">
              {t(
                'يعتمد مشروع AMUN على محرك فيزيائي نقي مكتوب بلغة TypeScript بدون أي إطارات عمل خارجية، يربط بين خمس معادلات فيزيائية معتمدة لدى وكالة ناسا:',
                'AMUN implements a pure TypeScript astrodynamics engine (src/engine) coupling five closed-form physics formulations verified by NASA standards:',
              )}
            </p>
          </div>

          {/* 5 Physics Engines Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-window border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 01</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('معادلة تسيلكوفسكي لكتلة الوقود', 'Tsiolkovsky Propellant Mass')}
              </h3>
              <div className="mt-2 font-latin text-[11px] text-ochre-300" dir="ltr">
                m_prop = [m_other · (e^x - 1)] / [1 - k · (e^x - 1)]
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('حل تحليلي مغلق يأخذ في الاعتبار نسبة خزان الوقود الهيكلية (k = 8% إلى 12%) بدقة تامة.', 'Closed-form calculation incorporating structural tank fraction k without iterative divergence.')}
              </p>
            </div>

            <div className="rounded-window border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 02</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('قانون التربيع العكسي للإشعاع الشمسي', 'Inverse-Square Solar Irradiance')}
              </h3>
              <div className="mt-2 font-latin text-[11px] text-ochre-300" dir="ltr">
                S(r) = 1361 / r² [W/m²]
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('ينخفض التدفق الشمسي مع مربع المسافة من 1361 واط/م² عند الأرض إلى 50 واط/م² عند المشتري.', 'Irradiance drops with square of distance, enforcing nuclear RTGs for outer solar system targets.')}
              </p>
            </div>

            <div className="rounded-window border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 03</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('معادلة فرايس لاتصالات DSN', 'Friis Path Loss & DSN Link')}
              </h3>
              <div className="mt-2 font-latin text-[11px] text-ochre-300" dir="ltr">
                Bitrate ∝ P_tx · D_ant² · (f / f_ref)² · (1 / d_AU)²
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('تحدد سرعة تنزيل البيانات عبر الوحدات الفلكية لهوائيات محطات ناسا 34م و70م لنطاقي X وKa.', 'Computes empirical telemetry downlinks across astronomical units for Ka/X bands.')}
              </p>
            </div>

            <div className="rounded-window border border-royal-700 bg-lapis-950/70 p-4">
              <span className="font-latin text-[10px] uppercase tracking-wider text-ochre-400">EQUATION 04</span>
              <h3 className="mt-1 font-display text-sm font-bold text-limestone-100">
                {t('مدارات انتقال هوهمان الكوكبية', 'Hohmann Interplanetary Transfer')}
              </h3>
              <div className="mt-2 font-latin text-[11px] text-ochre-300" dir="ltr">
                T_transit ≈ 0.5 · a_AU^1.5 · 365.25 [days]
              </div>
              <p className="mt-2 text-xs leading-relaxed text-limestone-400">
                {t('تحسب زمن العبور المداري الأدنى للطاقة ونوافذ الإطلاق السينودية وتغيير مستوي المدار.', 'Determines minimum-energy transfer durations, synodic departure windows, and capture Delta-V.')}
              </p>
            </div>

            <div className="rounded-window border border-royal-700 bg-lapis-950/70 p-4 sm:col-span-2 lg:col-span-2">
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
        <section className="mt-12 rounded-window border border-royal-600 bg-lapis-900/70 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-royal-700 pb-4">
            <div>
              <span className="font-latin text-xs font-bold uppercase tracking-wider text-ochre-400">
                NASA DATA PROVENANCE
              </span>
              <h2 className="mt-1 font-display text-2xl text-limestone-50 sm:text-3xl">
                {t('مصادر بيانات NASA الرسمية المعتمدة 100%', '100% Authentic NASA Open Datasets')}
              </h2>
            </div>
            <StatusPill tone="good">Global Award Eligible</StatusPill>
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
              <div key={s.name} className="rounded border border-royal-700 bg-lapis-950/60 p-3.5">
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
