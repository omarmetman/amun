import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Flag,
  FlaskConical,
  Lock,
  Orbit,
  Radio,
  Rocket,
  Satellite,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Weight,
  Zap,
} from 'lucide-react';
import { DIFFICULTIES } from '../data/missions';
import { ACHIEVEMENT_COUNT } from '../data/achievements';
import { CAMPAIGN, CAMPAIGN_CHAPTERS, campaignProgress } from '../data/campaign';
import { isChapterUnlocked } from '../engine/campaign';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime, fmtMoney } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { AmunLogo } from './AmunLogo';
import { SimplifiedNote } from './Badges';
import { CampaignStarRating, CAMPAIGN_ACCENTS, ChapterPatch, SignalRings } from './CampaignArt';
import { LanguageToggle } from './Header';

const heroOrbits = (
  <svg viewBox="0 0 420 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
    <defs>
      <radialGradient id="hero-core" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#e8b949" />
        <stop offset="0.55" stopColor="#4f7cff" />
        <stop offset="1" stopColor="#4f7cff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#93b4ff" stopOpacity="0.55" />
        <stop offset="0.5" stopColor="#e8b949" stopOpacity="0.35" />
        <stop offset="1" stopColor="#4f7cff" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    <circle cx="210" cy="210" r="56" fill="url(#hero-core)" opacity="0.28" />
    <circle cx="210" cy="210" r="31" fill="#0a1024" stroke="url(#hero-ring)" strokeWidth="1.4" />
    <ellipse cx="210" cy="210" rx="99" ry="52" fill="none" stroke="url(#hero-ring)" strokeWidth="1.2" transform="rotate(-24 210 210)" />
    <ellipse cx="210" cy="210" rx="148" ry="80" fill="none" stroke="#4f7cff" strokeOpacity="0.18" strokeWidth="1" transform="rotate(18 210 210)" />
    <ellipse cx="210" cy="210" rx="190" ry="104" fill="none" stroke="#e8b949" strokeOpacity="0.12" strokeWidth="1" transform="rotate(-9 210 210)" />
    <circle cx="306" cy="150" r="7" fill="#6b93ff" />
    <circle cx="306" cy="150" r="13" fill="#6b93ff" fillOpacity="0.12" />
    <circle cx="96" cy="272" r="4" fill="#e8b949" />
    <circle cx="352" cy="284" r="5" fill="#93b4ff" />
    <circle cx="141" cy="116" r="3" fill="#f4d58a" />
    <path d="M306 150a99 52 0 0 1-62 56" fill="none" stroke="#93b4ff" strokeOpacity="0.2" strokeDasharray="2 6" />
  </svg>
);

const iconFor = (index: number) => {
  const icons = [Target, Cpu, FlaskConical, Rocket, Weight, Zap, Weight, Satellite, Orbit, Rocket, Trophy];
  const Icon = icons[index] ?? Sparkles;
  return <Icon className="h-3.5 w-3.5" aria-hidden="true" />;
};

export function Welcome({
  onProfile,
  onCampaign,
}: {
  onProfile?: () => void;
  onCampaign?: () => void;
}) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const [stage, setStage] = useState(1);
  const startGame = useMissionStore((state) => state.startGame);
  const continueGame = useMissionStore((state) => state.continueGame);
  const setDifficulty = useMissionStore((state) => state.setDifficulty);
  const setPilotName = useMissionStore((state) => state.setPilotName);
  const savedAt = useMissionStore((state) => state.savedAt);
  const storePilot = useMissionStore((state) => state.pilotName);
  const profile = useMissionStore((state) => state.profile);
  const campaign = useMissionStore((state) => state.campaign);
  const startCampaignChapter = useMissionStore((state) => state.startCampaignChapter);
  const unlockedCount = Object.keys(profile.unlocked).length;
  const currentDifficulty = useMissionStore((state) => state.choices.difficulty);
  const [difficulty, setLocalDifficulty] = useState(currentDifficulty);
  const [pilot, setPilot] = useState(storePilot === 'قائد المهمة' ? '' : storePilot);
  const progress = campaignProgress(campaign.completed);
  const nextChapter = progress.nextChapter;

  const enterCampaign = () => {
    if (nextChapter && startCampaignChapter(nextChapter.id)) {
      window.scrollTo({ top: 0 });
      return;
    }
    onCampaign?.();
  };

  const begin = () => {
    setDifficulty(difficulty);
    setPilotName(pilot.trim() || t('قائد المهمة', 'Mission Commander'));
    startGame();
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 start-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-royal-600/15 blur-[120px] rtl:translate-x-1/2" />
        <div className="absolute bottom-0 end-0 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-[110px]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-5 sm:px-8">
        <span className="sm:hidden">
          <AmunLogo className="h-10 w-10" />
        </span>
        <span className="hidden sm:block">
          <AmunLogo className="h-10 w-10" withWordmark />
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          {onProfile ? (
            <button
              type="button"
              onClick={onProfile}
              className="btn-ghost text-[11px]"
              aria-label={t(
                `افتح ملف القائد: ${unlockedCount} من ${ACHIEVEMENT_COUNT} إنجازًا`,
                `Open pilot profile: ${unlockedCount} of ${ACHIEVEMENT_COUNT} achievements`,
              )}
            >
              <Trophy className="h-4 w-4 text-gold-300" aria-hidden="true" />
              <span className="hidden sm:inline">{t('ملف القائد', 'Pilot profile')}</span>
              <span className="rounded-md bg-gold-400/15 px-1.5 py-0.5 font-latin text-[9px] font-bold text-gold-200" dir="ltr">
                {unlockedCount}/{ACHIEVEMENT_COUNT}
              </span>
            </button>
          ) : null}
          {savedAt ? (
            <button type="button" onClick={continueGame} className="btn-ghost hidden text-[11px] sm:inline-flex">
              {t('متابعة المهمة', 'Continue mission')}
            </button>
          ) : null}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStage(value)}
              aria-current={stage === value ? 'step' : undefined}
              aria-label={t(`الشاشة ${value}`, `Screen ${value}`)}
              className={`h-1.5 rounded-full transition-all ${stage === value ? 'w-10 bg-gold-400' : value < stage ? 'w-5 bg-good/60' : 'w-5 bg-white/15'}`}
            />
          ))}
        </div>

        {stage === 1 ? (
          <>
          <section className="grid min-h-[70vh] items-center gap-10 py-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-center lg:text-start">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.06] px-3 py-1.5 text-[10px] font-bold text-gold-200">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t('فيزياء حقيقية · بيانات NASA · قرارات تُقاس', 'Real physics · NASA data · decisions that matter')}
              </div>
              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="font-latin tracking-[0.12em] text-gold-300">AMUN</span>
                <span className="mx-2 text-slate-600">/</span>
                <span>آمون</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg font-semibold text-slate-200 sm:text-xl">
                {t('صمّم مهمة فضائية كاملة، من الهدف إلى تقرير التقييم.', 'Design a complete space mission, from target selection to the final report.')}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 lg:mx-0">
                {t(
                  'اختر وجهة، ابنِ مركبة، وازن الكتلة والطاقة والاتصالات ودلتا-في، ثم شغّل محاكاة حتمية. كل رقم حقيقي يحمل مصدره، وكل قرار طاقة أو وقود له نتيجة واضحة.',
                  'Pick a destination, build a spacecraft, balance mass, power, communications and Δv, then run a deterministic simulation. Every real number carries its source, and every power or propellant decision has a visible consequence.',
                )}
              </p>
              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                <button type="button" onClick={enterCampaign} className="btn-primary w-full px-6 py-3 text-sm sm:w-auto">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {progress.allCompleted
                    ? t('اعرض شهادة الحملة', 'View the campaign record')
                    : progress.completedCount === 0
                      ? t('ابدأ حملة أفق آمون', 'Begin AMUN Horizon')
                      : t('تابع حملة أفق آمون', 'Continue AMUN Horizon')}
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setStage(2)} className="btn-secondary w-full px-5 py-3 text-sm sm:w-auto">
                  <Target className="h-4 w-4" aria-hidden="true" />
                  {t('تصميم حر', 'Freeplay')}
                </button>
                {savedAt ? (
                  <button type="button" onClick={continueGame} className="btn-ghost w-full px-4 py-3 text-sm sm:w-auto">
                    {t('تابع من حيث توقفت', 'Continue where you left off')}
                  </button>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-500 lg:justify-start">
                <button type="button" onClick={onCampaign} className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-slate-300 hover:underline">
                  <Flag className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                  {t('استعرض الفصول الستة', 'Explore the six chapters')}
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('لا يلزم تسجيل أو خادم', 'No account or backend required')}
                </span>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5 text-center lg:text-start">
                <div>
                  <div className="font-latin text-2xl font-extrabold text-gold-300">6</div>
                  <div className="text-[10px] font-semibold text-slate-500">{t('فصول حملة قصصية', 'story campaign chapters')}</div>
                </div>
                <div>
                  <div className="font-latin text-2xl font-extrabold text-white">11</div>
                  <div className="text-[10px] font-semibold text-slate-500">{t('خطوة تصميم وتقييم', 'design & evaluation steps')}</div>
                </div>
                <div>
                  <div className="font-latin text-2xl font-extrabold text-white">12</div>
                  <div className="text-[10px] font-semibold text-slate-500">{t('هدفًا من القمر إلى هالي', 'targets from Moon to Halley')}</div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[440px]">
              <div className="absolute inset-8 rounded-full border border-white/[0.05]" />
              <div className="floaty absolute inset-0">{heroOrbits}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-gold-400/30 bg-void-900/70 shadow-gold backdrop-blur-xl">
                  <AmunLogo className="h-16 w-16" />
                </div>
              </div>
              <div className="absolute bottom-7 start-3 rounded-xl border border-white/10 bg-void-900/80 px-3 py-2 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" />
                  {t('الهدف: المريخ', 'Target: Mars')}
                </div>
                <div className="mt-1 font-latin text-[10px] text-slate-500" dir="ltr">
                  1.6058 AU · C₃ 8.68 km²/s²
                </div>
              </div>
              <div className="absolute end-1 top-10 rounded-xl border border-white/10 bg-void-900/80 px-3 py-2 backdrop-blur-xl">
                <div className="font-latin text-lg font-extrabold text-good">S</div>
                <div className="text-[9px] text-slate-500">{t('تقييم المهمة', 'mission grade')}</div>
              </div>
            </div>
          </section>
          <CampaignTeaser onEnter={enterCampaign} onOpen={onCampaign} />
          </>
        ) : null}

        {stage === 2 ? (
          <section className="mx-auto max-w-5xl py-4">
            <div className="mb-7 text-center">
              <div className="eyebrow mb-2">{t('كيف تعمل اللعبة', 'How the game works')}</div>
              <h2 className="text-3xl font-black text-white sm:text-4xl">{t('ثلاث مراحل، أحد عشر قرارًا', 'Three acts, eleven decisions')}</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                {t('كل خطوة تغذي نفس المحرك الفيزيائي. لا أرقام مزخرفة: الخيارات تُحسب، والتحقق يمنع المحاكاة عند وجود خطأ مانع.', 'Every step feeds the same physics engine. No decorative numbers: choices are computed, and validation blocks simulation when a mission cannot fly.')}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  title: t('صمّم', 'Design'),
                  text: t('اختر الهدف ونوع المهمة والمنصة والأجهزة والصاروخ. اضبط الطاقة والكتلة والاتصالات والمدار.', 'Choose target, mission type, bus, instruments and launcher. Tune power, mass, communications and orbit.'),
                  icon: <Satellite className="h-5 w-5" aria-hidden="true" />,
                  detail: t('الخطوات 01–09', 'Steps 01–09'),
                },
                {
                  title: t('تحقّق', 'Validate'),
                  text: t('محرك التحقق يفحص الكتلة والميزانية والطاقة ودلتا-في والاتصال. الأخطاء تمنع التشغيل، والتحذيرات تشرح المقايضة.', 'The validation engine checks mass, budget, power, Δv and link. Errors block the run; warnings explain the trade-off.'),
                  icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
                  detail: t('أخطاء / تحذيرات / معلومات', 'Errors / warnings / info'),
                },
                {
                  title: t('شغّل وقيّم', 'Simulate & score'),
                  text: t('محاكاة حتمية بالبذرة، أحداث مرتبطة بتصميمك، ثم تقرير من 100 نقطة يشرح سبب كل خصم وكيف تصلحه.', 'A seeded deterministic simulation, design-linked events, then a 100-point report explaining every deduction and how to fix it.'),
                  icon: <Trophy className="h-5 w-5" aria-hidden="true" />,
                  detail: t('الخطوتان 10–11', 'Steps 10–11'),
                },
              ].map((card, index) => (
                <div key={card.title} className="card card-pad">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-royal-400/25 bg-royal-500/10 text-royal-300">
                      {card.icon}
                    </span>
                    <span className="font-latin text-2xl font-black text-white/10">0{index + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{card.title}</h3>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{card.text}</p>
                  <div className="mt-3 text-[10px] font-bold text-gold-300/80">{card.detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 card card-pad">
              <div className="eyebrow mb-3">{t('مسار المهمة الكامل', 'Full mission flow')}</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  t('الأهداف', 'Objectives'),
                  t('المركبة', 'Spacecraft'),
                  t('الأجهزة', 'Instruments'),
                  t('الإطلاق', 'Launch'),
                  t('الميزانية', 'Budget'),
                  t('الطاقة', 'Power'),
                  t('الكتلة', 'Mass'),
                  t('الاتصالات', 'Comms'),
                  t('المدار', 'Orbit'),
                  t('المحاكاة', 'Simulation'),
                  t('التقييم', 'Evaluation'),
                ].map((label, index) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[10px] font-semibold text-slate-300">
                    <span className="text-slate-600">{iconFor(index)}</span>
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-white/[0.07] bg-void-900/40 p-3">
                  <div className="text-[9px] font-bold text-slate-500">ROCKET EQUATION</div>
                  <div className="mt-1 font-latin text-[11px] font-bold text-gold-200" dir="ltr">Δv = Isp·g₀·ln(m₀/m_f)</div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-void-900/40 p-3">
                  <div className="text-[9px] font-bold text-slate-500">SOLAR FLUX</div>
                  <div className="mt-1 font-latin text-[11px] font-bold text-gold-200" dir="ltr">S = 1361 / r²</div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-void-900/40 p-3">
                  <div className="text-[9px] font-bold text-slate-500">DOWNLINK</div>
                  <div className="mt-1 font-latin text-[11px] font-bold text-gold-200" dir="ltr">R ∝ P·D² / d²</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setStage(1)} className="btn-ghost text-xs">
                <ChevronRight className="h-4 w-4 rtl:hidden" aria-hidden="true" />
                <ChevronLeft className="hidden h-4 w-4 rtl:block" aria-hidden="true" />
                {t('رجوع', 'Back')}
              </button>
              <button type="button" onClick={() => setStage(3)} className="btn-primary px-6 text-xs">
                {t('اضبط المهمة', 'Set up the mission')}
                <ChevronLeft className="h-4 w-4 ltr:hidden" aria-hidden="true" />
                <ChevronRight className="hidden h-4 w-4 ltr:block" aria-hidden="true" />
              </button>
            </div>
          </section>
        ) : null}

        {stage === 3 ? (
          <section className="mx-auto max-w-4xl py-4">
            <div className="mb-6 text-center">
              <div className="eyebrow mb-2">{t('قبل الإطلاق', 'Before launch')}</div>
              <h2 className="text-3xl font-black text-white sm:text-4xl">{t('اختر مستوى التحدي', 'Choose your challenge')}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {t('المستوى يغير الميزانية، معدل الأحداث، والتلميحات المتاحة.', 'Difficulty changes the budget, event rate and available hints.')}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {DIFFICULTIES.map((config) => {
                const active = difficulty === config.id;
                return (
                  <button
                    key={config.id}
                    type="button"
                    onClick={() => setLocalDifficulty(config.id)}
                    aria-pressed={active}
                    className={`selectable p-4 text-start ${active ? 'selectable-on' : ''}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          config.id === 'beginner'
                            ? 'bg-good/10 text-good'
                            : config.id === 'normal'
                              ? 'bg-warn/10 text-warn'
                              : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {config.id === 'beginner' ? <Sparkles className="h-4 w-4" /> : config.id === 'normal' ? <Orbit className="h-4 w-4" /> : <FlameIcon />}
                      </span>
                      {active ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-void-950">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </div>
                    <div className="text-base font-bold text-white">{l(config.name)}</div>
                    <p className="mt-1 min-h-[3.5rem] text-[11px] leading-relaxed text-slate-400">{l(config.description)}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      <span className="chip !px-2 !py-0.5 font-latin !text-[10px]">{fmtMoney(config.budgetM, 0)}</span>
                      <span className="chip !px-2 !py-0.5 !text-[10px]">
                        {t(`أحداث ×${fmt(config.eventMultiplier, 1)}`, `events ×${fmt(config.eventMultiplier, 1)}`)}
                      </span>
                      <span className="chip !px-2 !py-0.5 !text-[10px]">
                        {config.hints === 'full' ? t('تلميحات كاملة', 'full hints') : config.hints === 'limited' ? t('تلميحات مختصرة', 'short hints') : t('بلا تلميحات', 'no hints')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.1fr]">
              <div className="card card-pad">
                <label htmlFor="pilot" className="label mb-2 block">
                  {t('اسم قائد المهمة', 'Mission commander')}
                </label>
                <input
                  id="pilot"
                  value={pilot}
                  onChange={(event) => setPilot(event.target.value.slice(0, 40))}
                  placeholder={t('اكتب اسمك ليظهر في لوحة الصدارة', 'Enter a name for the leaderboard')}
                  className="field"
                  maxLength={40}
                  autoComplete="nickname"
                />
                <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                  {t('يُحفظ التقدم محليًا في متصفحك فقط. لا خادم ولا حساب.', 'Progress is saved locally in your browser only. No server, no account.')}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="chip">{t('حفظ تلقائي', 'Auto-save')}</span>
                  <span className="chip">{t('تصدير JSON', 'JSON export')}</span>
                  <span className="chip">{t('مقارنة بالمحاولات', 'Compare attempts')}</span>
                </div>
              </div>

              <div className="card card-pad">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-good" aria-hidden="true" />
                  <span className="text-xs font-bold text-white">{t('عهد البيانات', 'Data promise')}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {t(
                    'المسافات والعناصر المدارية من JPL، والصور من مكتبة NASA. تُوسم القيم التقريبية بوضوح، وكل مصدر يحمل حالته (مباشر/مخزّن/لقطة) ووقت جلبه.',
                    'Distances and orbital elements come from JPL; imagery from NASA’s library. Approximate values are clearly marked, and every source shows its state (live/cached/snapshot) and fetch time.',
                  )}
                </p>
                <SimplifiedNote className="mt-3">
                  {t('هذه لعبة تعليمية وليست أداة هندسية معتمدة.', 'This is an educational game, not a certified engineering tool.')}
                </SimplifiedNote>
                {savedAt ? (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-void-900/40 px-3 py-2">
                    <span className="text-[10px] text-slate-400">{t('آخر حفظ', 'Last saved')}</span>
                    <span className="font-latin text-[10px] text-slate-300">{fmtDateTime(savedAt, lang)}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setStage(2)} className="btn-ghost text-xs">
                <ChevronRight className="h-4 w-4 rtl:hidden" aria-hidden="true" />
                <ChevronLeft className="hidden h-4 w-4 rtl:block" aria-hidden="true" />
                {t('رجوع', 'Back')}
              </button>
              <button type="button" onClick={begin} className="btn-primary px-7 py-3 text-sm">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                {t('أطلق المهمة', 'Launch the mission')}
              </button>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-4 py-4 text-[10px] text-slate-600 sm:px-8">
        <span>AMUN · {t('مصمم مهام فضائية تعليمي', 'educational space mission designer')}</span>
        <span>{t('مستوحى من آمون، رمز الرياح والقوة', 'Inspired by Amun, symbol of wind and power')}</span>
      </footer>
    </div>
  );
}

function CampaignTeaser({ onEnter, onOpen }: { onEnter: () => void; onOpen?: () => void }) {
  const t = useT();
  const l = useL();
  const campaign = useMissionStore((state) => state.campaign);
  const progress = campaignProgress(campaign.completed);
  const next = progress.nextChapter;

  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-gold-400/25 bg-gradient-to-br from-royal-500/[0.12] via-gold-400/[0.055] to-transparent">
      <div className="campaign-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -end-24 -top-32 h-80 w-80 opacity-70" aria-hidden="true">
        <SignalRings className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute -bottom-32 -start-24 h-72 w-72 rounded-full bg-royal-600/15 blur-3xl" aria-hidden="true" />

      <div className="relative p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-gold-200">{t('الحملة القصصية · أرشيف 2041–2051', 'STORY CAMPAIGN · 2041–2051 ARCHIVE')}</span>
              <span className="font-latin text-[9px] font-bold tracking-[0.2em] text-slate-500" dir="ltr">
                {CAMPAIGN.englishTitle}
              </span>
            </div>
            <h2 className="mt-1.5 text-3xl font-black leading-tight text-white sm:text-4xl">
              {l(CAMPAIGN.title)}
            </h2>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-200">{l(CAMPAIGN.tagline)}</p>
            <p className="mt-1.5 max-w-2xl text-[11px] leading-relaxed text-slate-400">{l(CAMPAIGN.overview)}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="chip !border-gold-400/25 !bg-gold-400/10 !text-gold-100">
                <Flag className="h-3 w-3" aria-hidden="true" />
                {t(
                  `${progress.completedCount} من ${CAMPAIGN_CHAPTERS.length} فصول مكتملة`,
                  `${progress.completedCount} of ${CAMPAIGN_CHAPTERS.length} chapters complete`,
                )}
              </span>
              <span className="chip">
                <Star className="h-3 w-3 text-gold-300" aria-hidden="true" />
                <span className="font-latin" dir="ltr">{progress.totalStars} / {progress.maxStars}</span>
              </span>
              <span className="chip">
                <Radio className="h-3 w-3 text-royal-300" aria-hidden="true" />
                {t('تردد الإشارة', 'Signal')}: <span className="font-latin" dir="ltr">{CAMPAIGN.signal.frequency}</span>
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[15rem]">
            <button type="button" onClick={progress.allCompleted ? onOpen : onEnter} className="btn-primary w-full px-5 py-3 text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {progress.allCompleted
                ? t('افتح شهادة الحملة', 'Open the campaign record')
                : next
                  ? progress.completedCount === 0
                    ? t('ابدأ الفصل الأول', 'Start chapter one')
                    : t(`تابع إلى الفصل ${next.number}`, `Continue to chapter ${next.number}`)
                  : t('استعرض الحملة', 'Explore the campaign')}
            </button>
            <button type="button" onClick={onOpen} className="btn-ghost w-full px-4 py-2.5 text-xs">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {t('ملف الحملة والفصول', 'Campaign dossier & chapters')}
            </button>
            <div className="h-1.5 overflow-hidden rounded-full border border-white/10 bg-void-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-royal-500 via-royal-400 to-gold-300"
                style={{ width: `${(progress.completedCount / CAMPAIGN_CHAPTERS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {CAMPAIGN_CHAPTERS.map((chapter) => {
            const record = campaign.completed[chapter.id];
            const unlocked = isChapterUnlocked(chapter.id, campaign.completed);
            const isNext = next?.id === chapter.id;
            const accent = CAMPAIGN_ACCENTS[chapter.accent];
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={onOpen}
                aria-label={t(
                  `الفصل ${chapter.number}: ${l(chapter.title)}${unlocked ? '' : ' — مقفل'}`,
                  `Chapter ${chapter.number}: ${l(chapter.title)}${unlocked ? '' : ' — locked'}`,
                )}
                className={`group relative overflow-hidden rounded-2xl border p-2.5 text-start transition hover:-translate-y-0.5 ${
                  isNext
                    ? 'border-gold-400/45 bg-gold-400/[0.07] shadow-gold'
                    : record
                      ? `${accent.border} ${accent.soft}`
                      : unlocked
                        ? 'border-white/10 bg-white/[0.025] hover:border-white/25'
                        : 'border-white/[0.06] bg-void-950/30 opacity-55'
                }`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-0 transition group-hover:opacity-100`} aria-hidden="true" />
                <div className="relative flex items-start justify-between gap-1">
                  <ChapterPatch chapter={chapter} size="sm" />
                  {unlocked ? (
                    <CampaignStarRating stars={record?.stars ?? 0} size="sm" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  )}
                </div>
                <div className="relative mt-2 flex items-center gap-1">
                  <span className={`font-latin text-[8px] font-bold tracking-[0.14em] ${accent.text}`} dir="ltr">
                    {String(chapter.number).padStart(2, '0')} · {chapter.year}
                  </span>
                  {isNext ? (
                    <span className="rounded bg-gold-400/15 px-1 py-0.5 text-[7px] font-bold text-gold-200">
                      {t('التالي', 'NEXT')}
                    </span>
                  ) : null}
                </div>
                <div className="relative mt-0.5 truncate text-[10px] font-bold text-white">{l(chapter.title)}</div>
                <div className="relative truncate text-[8px] text-slate-500">{l(chapter.subtitle)}</div>
              </button>
            );
          })}
        </div>

        <SimplifiedNote className="mt-3">{l(CAMPAIGN.disclaimer)}</SimplifiedNote>
      </div>
    </section>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 22c4.4 0 7-2.8 7-6.5 0-3.5-2.3-5.8-4-8.5-1.2 2-2.4 2.8-3.1 4.3C10.6 9 9.6 6.7 8.4 4 7.1 6 5 9.2 5 13.5 5 19.2 7.6 22 12 22Z" />
    </svg>
  );
}
