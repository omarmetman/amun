import { useState } from 'react';
import { DIFFICULTIES } from '../data/missions';
import { ACHIEVEMENT_COUNT } from '../data/achievements';
import { CAMPAIGN, CAMPAIGN_CHAPTERS, campaignProgress } from '../data/campaign';
import { isChapterUnlocked } from '../engine/campaign';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime, fmtMoney } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { AmunLogo } from './AmunLogo';
import { SimplifiedNote } from './Badges';
import { CampaignStarRating, CAMPAIGN_ACCENTS, ChapterPatch } from './CampaignArt';
import { LanguageToggle } from './Header';
import { IconBook, IconChevron, IconFlag, IconMedal, IconRocket, IconTarget } from './Icons';
import { Cartouche, Frieze } from './Ornament';
import { Trajectory } from './Stepper';

const HERO_TARGETS = ['moon', 'mars', 'venus', 'jupiter', 'bennu', 'ryugu', '67p', 'halley'];

export function Welcome({
  onProfile,
  onCampaign,
  onProject,
  onNasaData,
}: {
  onProfile?: () => void;
  onCampaign?: () => void;
  onProject?: () => void;
  onNasaData?: () => void;
}) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const [stage, setStage] = useState(1);
  const [pilotError, setPilotError] = useState(false);
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
  const [heroTarget] = useState(() => HERO_TARGETS[Math.floor(Math.random() * HERO_TARGETS.length)]);
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
    if (!pilot.trim()) {
      setPilotError(true);
      return;
    }
    setPilotError(false);
    setDifficulty(difficulty);
    setPilotName(pilot.trim());
    startGame();
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen">
      <Frieze className="text-royal-500" />

      {/* Sticky Header Across Welcome Page */}
      <header className="sticky top-0 z-50 border-b border-royal-700/90 bg-lapis-950/95 backdrop-blur-md shadow-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="sm:hidden">
              <AmunLogo className="h-9 w-9" />
            </span>
            <span className="hidden sm:block">
              <AmunLogo className="h-10 w-10" withWordmark />
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageToggle />
            {onNasaData ? (
              <button
                type="button"
                onClick={onNasaData}
                className="inline-flex min-h-[36px] items-center gap-1.5 border border-royal-700 bg-royal-950/60 px-2.5 py-1 text-[11px] font-semibold text-malachite hover:border-malachite"
                title={t('معلومات حقيقية من ناسا عن الفضاء وكيف تم بناء اللعبة', 'Authentic NASA Space Science: How NASA Open Data Built AMUN')}
              >
                <IconTarget className="h-3.5 w-3.5 text-malachite" />
                <span className="hidden sm:inline">{t('بيانات ناسا', 'NASA Science')}</span>
              </button>
            ) : null}
            {onProject ? (
              <button
                type="button"
                onClick={onProject}
                className="inline-flex min-h-[36px] items-center gap-1.5 border border-royal-700 bg-royal-950/60 px-2.5 py-1 text-[11px] font-semibold text-ochre-300 hover:border-ochre-400"
                title={t('المشروع: الروابط، الفكرة، وبيانات ناسا، وطاقم العمل', 'Project: Links, Concept, NASA Data & Flight Crew')}
              >
                <IconRocket className="h-4 w-4 text-ochre-400" />
                <span>{t('المشروع', 'Project')}</span>
              </button>
            ) : null}
            {onProfile ? (
              <button
                type="button"
                onClick={onProfile}
                className="inline-flex min-h-[36px] items-center gap-1.5 border border-transparent px-2 py-1 text-[11px] text-limestone-200 hover:border-limestone-400"
                aria-label={t(
                  `افتح ملف القائد: ${unlockedCount} من ${ACHIEVEMENT_COUNT} إنجازًا`,
                  `Open pilot profile: ${unlockedCount} of ${ACHIEVEMENT_COUNT} achievements`,
                )}
              >
                <IconMedal className="h-4 w-4 text-ochre-400" />
                <span className="hidden sm:inline">{t('الملف', 'Profile')}</span>
                <span className="font-latin tabular-nums" dir="ltr">
                  {unlockedCount}/{ACHIEVEMENT_COUNT}
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-8">
        {stage === 1 ? (
          <>
            <section className="grid items-center gap-6 pt-2 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <Cartouche>
                    <span className="font-display text-sm text-ochre-300">
                      AMUN
                      <span className="mx-2 text-limestone-400">/</span>
                      {t('آمون', 'Amun')}
                    </span>
                  </Cartouche>
                  <span className="text-[11px] text-limestone-400">{t('ملف تصميم مهمة', 'Mission design file')}</span>
                </div>

                <Trajectory
                  step={11}
                  allDone
                  variant="hero"
                  targetId={heroTarget}
                  transferType="hohmann"
                  rtl={lang === 'ar'}
                />
              </div>

              <div className="min-w-0 lg:border-s lg:border-royal-700 lg:ps-6">
                <h1 className="font-display text-[30px] leading-[1.25] text-limestone-50 sm:text-[38px]">
                  {t('من ورقة تصميم واحدة إلى تقرير مهمة كامل.', 'From one design sheet to a complete mission report.')}
                </h1>
                <p className="mt-3 text-base text-limestone-200">
                  {t(
                    'صمّم مركبة، وازن كتلتها وطاقتها ووقودها، ثم شغّل محاكاة واقرأ تقريرًا يشرح نتيجة مهمتك.',
                    'Design a spacecraft, balance its mass, power and propellant, then run a simulation and read why the mission ended the way it did.',
                  )}
                </p>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <button type="button" onClick={() => setStage(3)} className="btn-primary w-full text-sm sm:w-auto font-bold shadow-lg">
                    <IconRocket className="h-4 w-4" />
                    <span>{t('ابدأ مهمة جديدة', 'Start a new mission')}</span>
                  </button>
                  {onProject ? (
                    <button
                      type="button"
                      onClick={onProject}
                      className="btn-secondary w-full text-sm sm:w-auto font-semibold"
                    >
                      <IconRocket className="h-4 w-4 text-ochre-400" />
                      <span>{t('مشروع آمون وطاقم العمل 🇪🇬', 'Project AMUN & Egyptian Crew 🇪🇬')}</span>
                    </button>
                  ) : null}
                  {onNasaData ? (
                    <button
                      type="button"
                      onClick={onNasaData}
                      className="btn-secondary w-full text-sm sm:w-auto font-semibold"
                    >
                      <IconTarget className="h-4 w-4 text-malachite" />
                      <span>{t('معلومات ناسا الحقيقية 🪐', 'NASA Real Science 🪐')}</span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={continueGame}
                    disabled={!savedAt}
                    className="btn-ghost w-full text-sm sm:w-auto"
                  >
                    {t('تابع المهمة المحفوظة', 'Continue the saved mission')}
                  </button>
                </div>
                {!savedAt ? (
                  <p className="mt-2 text-[11px] text-limestone-400">
                    {t('لا توجد مهمة محفوظة بعد.', 'There is no saved mission yet.')}
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-limestone-400">
                    {t('آخر حفظ', 'Last saved')}: <span className="font-latin tabular-nums">{fmtDateTime(savedAt, lang)}</span>
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStage(2)}
                    className="inline-flex items-center gap-1.5 border-b border-royal-400 pb-px text-xs text-limestone-300 hover:text-limestone-50"
                  >
                    <IconBook className="h-4 w-4" />
                    {t('كيف تعمل اللعبة', 'How the game works')}
                  </button>
                </div>
              </div>
            </section>

            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 border-y border-royal-700 divide-x divide-royal-700 rtl:divide-x-reverse bg-lapis-950/40">
              {[
                { value: '06', label: t('فصول حملة قصصية عميقة', 'deep story chapters') },
                { value: '11', label: t('خطوة تصميم ونظم هندسية', 'engineering systems steps') },
                { value: '12', label: t('جرماً ببيانات JPL المعتمدة', 'JPL benchmarked targets') },
                { value: '05', label: t('محركات فيزيائية متكاملة', 'coupled physics engines') },
              ].map((item) => (
                <div key={item.value} className="px-3 py-3 text-center sm:text-start">
                  <dt className="font-latin text-2xl tabular-nums font-bold text-ochre-400">{item.value}</dt>
                  <dd className="mt-0.5 text-[11px] leading-snug text-limestone-300">{item.label}</dd>
                </div>
              ))}
            </dl>

            <CampaignTeaser onEnter={enterCampaign} onOpen={onCampaign} />
          </>
        ) : null}

        {stage === 2 ? (
          <section className="mx-auto max-w-5xl pt-2">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-royal-700 pb-3">
              <div>
                <div className="text-xs text-limestone-400">{t('دليل مختصر', 'Short guide')}</div>
                <h2 className="mt-1 font-display text-3xl text-limestone-50">
                  {t('ثلاث مراحل، أحد عشر قرارًا', 'Three acts, eleven decisions')}
                </h2>
              </div>
              <button type="button" onClick={() => setStage(1)} className="btn-ghost text-xs">
                <IconChevron dir={lang === 'ar' ? 'end' : 'start'} className="h-4 w-4" />
                {t('رجوع', 'Back')}
              </button>
            </div>

            <ol>
              {[
                {
                  title: t('صمّم', 'Design'),
                  text: t(
                    'اختر الهدف ونوع المهمة والمنصة والأجهزة والصاروخ، ثم اضبط الطاقة والكتلة والاتصالات والمدار.',
                    'Choose the target, mission type, bus, instruments and launcher, then tune power, mass, communications and orbit.',
                  ),
                  detail: t('الخطوات 01 إلى 09', 'Steps 01 to 09'),
                },
                {
                  title: t('تحقّق', 'Validate'),
                  text: t(
                    'يفحص المحرك الكتلة والميزانية والطاقة ودلتا-في والاتصال. الخطأ المانع يوقف التشغيل، والتحذير يشرح المقايضة.',
                    'The engine checks mass, budget, power, Δv and the link. A blocking error stops the run; a warning explains the trade-off.',
                  ),
                  detail: t('خطأ / تحذير / معلومة', 'Error / warning / info'),
                },
                {
                  title: t('شغّل وقيّم', 'Simulate and score'),
                  text: t(
                    'محاكاة حتمية بالبذرة وأحداث مرتبطة بتصميمك، ثم تقرير من 100 نقطة يشرح كل خصم وكيف تصلحه.',
                    'A seeded deterministic simulation with design-linked events, then a 100-point report explaining every deduction and how to fix it.',
                  ),
                  detail: t('الخطوتان 10 و11', 'Steps 10 and 11'),
                },
              ].map((act, index) => (
                <li key={act.title} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-b border-royal-700 py-4 sm:grid-cols-[64px_minmax(0,1fr)_160px]">
                  <span className="font-latin text-2xl tabular-nums text-royal-400">{String(index + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg text-limestone-50">{act.title}</h3>
                    <p className="mt-1 text-sm text-limestone-300">{act.text}</p>
                  </div>
                  <span className="col-start-2 text-[11px] text-limestone-400 sm:col-start-3 sm:text-end">{act.detail}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_250px]">
              <div>
                <h3 className="mb-2 font-display text-base text-limestone-100">{t('مسار المهمة الكامل', 'Full mission flow')}</h3>
                <ol className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  {STEPS_FOR_WELCOME.map(([ar, en], index) => (
                    <li key={en} className="flex items-baseline gap-3 border-b border-royal-700 py-1.5">
                      <span className="font-latin text-[11px] tabular-nums text-limestone-400">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-xs text-limestone-200">{lang === 'ar' ? ar : en}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <aside className="border-s border-royal-700 ps-4">
                <h3 className="mb-2 font-display text-base text-limestone-100">{t('ثلاث معادلات تحكم اللعبة', 'Three governing equations')}</h3>
                <dl className="space-y-3 text-xs">
                  <div>
                    <dt className="text-limestone-400">{t('معادلة الصاروخ', 'Rocket equation')}</dt>
                    <dd className="mt-0.5 font-latin text-limestone-100" dir="ltr">Δv = Isp × g₀ × ln(m₀/m_f)</dd>
                  </div>
                  <div>
                    <dt className="text-limestone-400">{t('الflux الشمسي', 'Solar flux')}</dt>
                    <dd className="mt-0.5 font-latin text-limestone-100" dir="ltr">S = 1361 / r²</dd>
                  </div>
                  <div>
                    <dt className="text-limestone-400">{t('الاتصال الهابط', 'Downlink')}</dt>
                    <dd className="mt-0.5 font-latin text-limestone-100" dir="ltr">R ∝ P × D² / d²</dd>
                  </div>
                </dl>
              </aside>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-royal-700 pt-4">
              <button type="button" onClick={() => setStage(1)} className="btn-ghost text-xs">
                <IconChevron dir={lang === 'ar' ? 'end' : 'start'} className="h-4 w-4" />
                {t('رجوع', 'Back')}
              </button>
              <button type="button" onClick={() => setStage(3)} className="btn-primary text-xs">
                {t('اضبط المهمة', 'Set up the mission')}
                <IconChevron dir={lang === 'ar' ? 'start' : 'end'} className="h-4 w-4" />
              </button>
            </div>
          </section>
        ) : null}

        {stage === 3 ? (
          <section className="mx-auto max-w-4xl pt-2">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-royal-700 pb-3">
              <div>
                <div className="text-xs text-limestone-400">{t('قبل الإطلاق', 'Before launch')}</div>
                <h2 className="mt-1 font-display text-3xl text-limestone-50">{t('اختر مستوى التحدي', 'Choose the challenge level')}</h2>
                <p className="mt-1 text-sm text-limestone-300">
                  {t(
                    'المستوى يغيّر الميزانية ومعدل الأحداث والتلميحات المتاحة.',
                    'The level changes the budget, event rate and available hints.',
                  )}
                </p>
              </div>
              <button type="button" onClick={() => setStage(2)} className="btn-ghost text-xs">
                <IconChevron dir={lang === 'ar' ? 'end' : 'start'} className="h-4 w-4" />
                {t('رجوع', 'Back')}
              </button>
            </div>

            <div role="radiogroup" aria-label={t('مستوى التحدي', 'Challenge level')}>
              {DIFFICULTIES.map((config, index) => {
                const active = difficulty === config.id;
                return (
                  <button
                    key={config.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setLocalDifficulty(config.id)}
                    className={`grid w-full grid-cols-[32px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2 border-b border-royal-700 py-3 text-start sm:grid-cols-[32px_minmax(0,1fr)_88px_96px] ${
                      active ? 'bg-royal-700/40' : 'hover:bg-royal-700/20'
                    }`}
                    style={active ? { boxShadow: 'inset 0 0 0 1px #E3A92F' } : undefined}
                  >
                    <span className="font-latin text-sm tabular-nums text-limestone-400">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-2">
                        <span className={`text-sm ${active ? 'text-limestone-50' : 'text-limestone-100'}`}>{l(config.name)}</span>
                        {active ? <span className="text-[10px] text-ochre-400">{t('مختار', 'Selected')}</span> : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-limestone-400">{l(config.description)}</span>
                    </span>
                    <span className="col-start-2 sm:col-start-auto sm:text-end">
                      <span className="block text-[10px] text-limestone-400">{t('الميزانية', 'Budget')}</span>
                      <span className="font-latin text-sm tabular-nums text-limestone-100">{fmtMoney(config.budgetM, 0)}</span>
                    </span>
                    <span className="col-start-2 sm:col-start-auto sm:text-end">
                      <span className="block text-[10px] text-limestone-400">{t('الأحداث', 'Events')}</span>
                      <span className="font-latin text-sm tabular-nums text-limestone-100">×{fmt(config.eventMultiplier, 1)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="margin-note mt-2">
              {difficulty === 'beginner'
                ? t('تلميحات كاملة في كل خطوة.', 'Full hints on every step.')
                : difficulty === 'normal'
                  ? t('تلميحات مختصرة في كل خطوة.', 'Short hints on every step.')
                  : t('بلا تلميحات: القرار لك بالكامل.', 'No hints: the decision is entirely yours.')}
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="pilot" className="label mb-2 flex items-center justify-between">
                  <span className="font-semibold text-limestone-100">
                    {t('اسم قائد المهمة', 'Mission commander')}
                    <span className="ms-1.5 text-carnelian font-bold">* ({t('إجباري', 'Required')})</span>
                  </span>
                  {pilotError && (
                    <span className="text-[11px] font-bold text-carnelian animate-pulse">
                      {t('اسم القائد إجباري!', 'Commander name required!')}
                    </span>
                  )}
                </label>
                <input
                  id="pilot"
                  value={pilot}
                  onChange={(event) => {
                    setPilot(event.target.value.slice(0, 40));
                    if (event.target.value.trim()) setPilotError(false);
                  }}
                  placeholder={t('اكتب اسمك الكامل للمتابعة (مطلوب)', 'Enter your full name to proceed (required)')}
                  className={`field ${pilotError ? '!border-carnelian focus:!ring-carnelian ring-1 ring-carnelian' : ''}`}
                  maxLength={40}
                  required
                  autoComplete="nickname"
                />
                {pilotError ? (
                  <p className="mt-1.5 text-xs text-carnelian font-semibold">
                    {t('⚠️ لا يمكن بدء المهمة دون كتابة اسم قائد المهمة.', '⚠️ Cannot launch mission without entering commander name.')}
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] leading-relaxed text-limestone-400">
                    {t(
                      'يُحفظ التقدم محليًا في متصفحك فقط. لا خادم ولا حساب.',
                      'Progress is saved locally in your browser only. No server, no account.',
                    )}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-limestone-300">
                  <span>{t('حفظ تلقائي', 'Auto-save')}</span>
                  <span>{t('تصدير JSON', 'JSON export')}</span>
                  <span>{t('مقارنة محاولات', 'Attempt comparison')}</span>
                </div>
              </div>

              <div className="border-s border-royal-700 ps-4">
                <div className="mb-2 flex items-center gap-2 text-limestone-100">
                  <IconFlag className="h-4 w-4 text-ochre-400" />
                  <span className="font-display text-sm">{t('عهد البيانات', 'Data promise')}</span>
                </div>
                <p className="text-xs leading-relaxed text-limestone-300">
                  {t(
                    'المسافات والعناصر المدارية من JPL، والصور من مكتبة NASA. كل قيمة تقريبية موسومة، وكل مصدر يحمل حالته ووقت جلبه.',
                    'Distances and orbital elements come from JPL; imagery from NASA. Approximate values are marked, and every source carries its state and fetch time.',
                  )}
                </p>
                <SimplifiedNote className="mt-3">
                  {t('هذه لعبة تعليمية وليست أداة هندسية معتمدة.', 'This is an educational game, not a certified engineering tool.')}
                </SimplifiedNote>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-royal-700 pt-4">
              <span className="text-xs text-limestone-400">
                {t('سيبقى التقدم محفوظًا إن أغلقت الصفحة.', 'Progress stays saved if you close the page.')}
              </span>
              <button type="button" onClick={begin} className="btn-primary px-6 text-sm">
                <IconTarget className="h-4 w-4" />
                {t('أطلق المهمة', 'Launch the mission')}
              </button>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-royal-700 px-4 py-4 text-[11px] text-limestone-400 sm:px-8">
        <span>AMUN / {t('مصمم مهام فضائية تعليمي', 'educational space mission designer')}</span>
        <span>{t('مستوحى من آمون، رمز الريح والقوة', 'Inspired by Amun, symbol of wind and power')}</span>
      </footer>
    </div>
  );
}

const STEPS_FOR_WELCOME: Array<[string, string]> = [
  ['الأهداف', 'Objectives'],
  ['المركبة', 'Spacecraft'],
  ['الأجهزة', 'Instruments'],
  ['الإطلاق', 'Launch'],
  ['الميزانية', 'Budget'],
  ['الطاقة', 'Power'],
  ['الكتلة', 'Mass'],
  ['الاتصالات', 'Comms'],
  ['المدار', 'Orbit'],
  ['المحاكاة', 'Simulation'],
  ['التقييم', 'Evaluation'],
];

function CampaignTeaser({ onEnter, onOpen }: { onEnter: () => void; onOpen?: () => void }) {
  const t = useT();
  const l = useL();
  const campaign = useMissionStore((state) => state.campaign);
  const progress = campaignProgress(campaign.completed);
  const next = progress.nextChapter;

  return (
    <section className="mt-8 border border-royal-600 bg-royal-700/15">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[11px] text-ochre-300">{t('الحملة القصصية، أرشيف 2041 إلى 2051', 'Story campaign, 2041 to 2051 archive')}</span>
              <span className="font-latin text-[10px] text-limestone-400" dir="ltr">
                {CAMPAIGN.englishTitle}
              </span>
            </div>
            <h2 className="mt-1 font-display text-2xl leading-tight text-limestone-50 sm:text-3xl">{l(CAMPAIGN.title)}</h2>
            <p className="mt-1 text-sm text-limestone-200">{l(CAMPAIGN.tagline)}</p>
            <p className="mt-1.5 max-w-[65ch] text-xs leading-relaxed text-limestone-400">{l(CAMPAIGN.overview)}</p>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]">
              <span className="inline-flex items-baseline gap-1 text-limestone-200">
                <IconFlag className="h-3.5 w-3.5 self-center text-ochre-400" />
                {t(
                  `${progress.completedCount} من ${CAMPAIGN_CHAPTERS.length} فصول مكتملة`,
                  `${progress.completedCount} of ${CAMPAIGN_CHAPTERS.length} chapters complete`,
                )}
              </span>
              <span className="inline-flex items-baseline gap-1 text-limestone-300">
                <span className="font-latin tabular-nums" dir="ltr">
                  {progress.totalStars} / {progress.maxStars}
                </span>
                <span>{t('نجمة', 'stars')}</span>
              </span>
              <span className="text-limestone-400">
                {t('تردد الإشارة', 'Signal')}: <span className="font-latin tabular-nums text-limestone-200" dir="ltr">{CAMPAIGN.signal.frequency}</span>
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[15rem]">
            <button type="button" onClick={progress.allCompleted ? onOpen : onEnter} className="btn-primary w-full px-5 text-sm">
              {progress.allCompleted
                ? t('افتح شهادة الحملة', 'Open the campaign record')
                : next
                  ? progress.completedCount === 0
                    ? t('ابدأ الفصل الأول', 'Start chapter one')
                    : t(`تابع إلى الفصل ${next.number}`, `Continue to chapter ${next.number}`)
                  : t('استعرض الحملة', 'Explore the campaign')}
            </button>
            <button type="button" onClick={onOpen} className="btn-ghost w-full px-4 text-xs">
              <IconBook className="h-4 w-4" />
              {t('ملف الحملة والفصول', 'Campaign dossier and chapters')}
            </button>
            <div className="h-1 bg-lapis-950">
              <div
                className="h-full bg-ochre-400"
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
                  `الفصل ${chapter.number}: ${l(chapter.title)}${unlocked ? '' : ', مقفل'}`,
                  `Chapter ${chapter.number}: ${l(chapter.title)}${unlocked ? '' : ', locked'}`,
                )}
                className={`border p-2.5 text-start transition-colors ${
                  isNext
                    ? 'border-ochre-400 bg-ochre-400/10'
                    : record
                      ? `${accent.border} ${accent.soft}`
                      : unlocked
                        ? 'border-royal-700 hover:border-limestone-400'
                        : 'border-royal-700/60 opacity-55'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <ChapterPatch chapter={chapter} size="sm" />
                  {unlocked ? (
                    <CampaignStarRating stars={record?.stars ?? 0} size="sm" />
                  ) : (
                    <span className="text-[10px] text-limestone-400">{t('مقفل', 'Locked')}</span>
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-1.5 text-[10px]">
                  <span className="font-latin tabular-nums text-limestone-400" dir="ltr">
                    {String(chapter.number).padStart(2, '0')} / {chapter.year}
                  </span>
                  {isNext ? <span className="text-ochre-300">{t('التالي', 'next')}</span> : null}
                </div>
                <div className="mt-0.5 truncate text-xs text-limestone-100">{l(chapter.title)}</div>
                <div className="truncate text-[10px] text-limestone-400">{l(chapter.subtitle)}</div>
              </button>
            );
          })}
        </div>

        <SimplifiedNote className="mt-3">{l(CAMPAIGN.disclaimer)}</SimplifiedNote>
      </div>
    </section>
  );
}
