import { useEffect, useState } from 'react';
import { STEPS } from './data/steps';
import { dirOf } from './i18n';
import { useLang } from './i18n';
import { useMissionStore } from './store/useMissionStore';
import { ContextHint } from './components/ContextHint';
import { IconAlert, IconDownload, IconReset, IconUpload } from './components/Icons';
import { CampaignBanner } from './components/CampaignBanner';
import { CampaignModal } from './components/CampaignModal';
import { Header } from './components/Header';
import { IssuesPanel } from './components/IssuesPanel';
import { LearnPanel } from './components/LearnPanel';
import { MobileDashboard } from './components/MobileDashboard';
import { Modal } from './components/Modal';
import { ProfileModal } from './components/ProfileModal';
import { ProjectPage } from './components/ProjectPage';
import { NasaDataPage } from './components/NasaDataPage';
import { Sidebar } from './components/Sidebar';
import { Stepper } from './components/Stepper';
import { StepIntro, StepNav } from './components/StepShell';
import { Toasts } from './components/Toasts';
import { InlineNote } from './components/StepBits';
import { Welcome } from './components/Welcome';
import { Step01Objectives } from './steps/Step01Objectives';
import { Step02Spacecraft } from './steps/Step02Spacecraft';
import { Step03Instruments } from './steps/Step03Instruments';
import { Step04Launch } from './steps/Step04Launch';
import { Step05Budget } from './steps/Step05Budget';
import { Step06Power } from './steps/Step06Power';
import { Step07Mass } from './steps/Step07Mass';
import { Step08Comms } from './steps/Step08Comms';
import { Step09Orbit } from './steps/Step09Orbit';
import { Step10Simulation } from './steps/Step10Simulation';
import { Step11Evaluation } from './steps/Step11Evaluation';

type ModalKind = 'new' | 'import' | 'reset' | 'profile' | 'campaign' | 'project' | null;

export default function App() {
  const lang = useLang();
  const started = useMissionStore((state) => state.started);
  const step = useMissionStore((state) => state.step);
  const choices = useMissionStore((state) => state.choices);
  const activeChapterId = useMissionStore((state) => state.campaign.activeChapterId);
  const startGame = useMissionStore((state) => state.startGame);
  const resetAll = useMissionStore((state) => state.resetAll);
  const exportDesign = useMissionStore((state) => state.exportDesign);
  const importDesign = useMissionStore((state) => state.importDesign);
  const setStep = useMissionStore((state) => state.setStep);

  const [learnOpen, setLearnOpen] = useState(false);
  const [learnFocus, setLearnFocus] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);

  const [activePage, setActivePage] = useState<'simulator' | 'project' | 'nasa-data'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (
        hash === '#project' ||
        hash === '#/project' ||
        window.location.pathname.endsWith('/project')
      ) {
        return 'project';
      }
      if (
        hash === '#nasa-data' ||
        hash === '#/nasa-data' ||
        hash === '#science' ||
        hash === '#/science'
      ) {
        return 'nasa-data';
      }
    }
    return 'simulator';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#project' || hash === '#/project') {
        setActivePage('project');
      } else if (
        hash === '#nasa-data' ||
        hash === '#/nasa-data' ||
        hash === '#science' ||
        hash === '#/science'
      ) {
        setActivePage('nasa-data');
      } else {
        setActivePage('simulator');
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openProjectPage = () => {
    window.location.hash = '#project';
    setActivePage('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openNasaDataPage = () => {
    window.location.hash = '#nasa-data';
    setActivePage('nasa-data');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeToSimulator = () => {
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setActivePage('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dirOf(lang);

    const titles = {
      simulator: {
        ar: 'AMUN: مصمم المهام الفضائية',
        en: 'AMUN: Space Mission Designer',
      },
      project: {
        ar: 'مشروع آمون وطاقم العمل | NASA Space Apps 2026',
        en: 'Project AMUN & Crew | NASA Space Apps 2026',
      },
      'nasa-data': {
        ar: 'معلومات ناسا الحقيقية وكيف بُنيت AMUN',
        en: 'NASA Real Science & How AMUN Was Built',
      },
    } as const;

    document.title = titles[activePage][lang];
  }, [lang, activePage]);

  const openLearn = (focusKey?: string) => {
    setLearnFocus(focusKey ?? null);
    setLearnOpen(true);
  };

  const closeLearn = () => {
    setLearnOpen(false);
    setLearnFocus(null);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleExport = () => {
    const json = exportDesign();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    const safeSeed = choices.seed.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 40) || 'mission';
    anchor.download = `amun-design-${safeSeed}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const stepContent = (() => {
    switch (step) {
      case 1:
        return <Step01Objectives onCampaign={() => setModal('campaign')} />;
      case 2:
        return <Step02Spacecraft />;
      case 3:
        return <Step03Instruments />;
      case 4:
        return <Step04Launch />;
      case 5:
        return <Step05Budget />;
      case 6:
        return <Step06Power />;
      case 7:
        return <Step07Mass />;
      case 8:
        return <Step08Comms />;
      case 9:
        return <Step09Orbit />;
      case 10:
        return <Step10Simulation onLearn={openLearn} />;
      case 11:
        return (
          <Step11Evaluation
            onLearn={openLearn}
            onProfile={() => setModal('profile')}
            onCampaign={() => setModal('campaign')}
          />
        );
      default:
        return <Step01Objectives onCampaign={() => setModal('campaign')} />;
    }
  })();

  if (activePage === 'project') {
    return (
      <>
        <ProjectPage onBack={closeToSimulator} onNasaData={openNasaDataPage} />
        <Toasts />
      </>
    );
  }

  if (activePage === 'nasa-data') {
    return (
      <>
        <NasaDataPage onBack={closeToSimulator} onProject={openProjectPage} />
        <Toasts />
      </>
    );
  }

  if (!started) {
    return (
      <>
        <Welcome
          onProfile={() => setModal('profile')}
          onCampaign={() => setModal('campaign')}
          onProject={openProjectPage}
          onNasaData={openNasaDataPage}
        />
        {modal === 'profile' ? (
          <ProfileModal
            onClose={() => setModal(null)}
            onCampaign={() => setModal('campaign')}
          />
        ) : null}
        {modal === 'campaign' ? (
          <CampaignModal
            onClose={() => setModal(null)}
            onFreeplay={() => {
              startGame();
              setModal(null);
              window.scrollTo({ top: 0 });
            }}
          />
        ) : null}
        <Toasts />
      </>
    );
  }

  return (
    <>
      <a
        href="#mission-content"
        className="sr-only z-[100] rounded-data bg-ochre-400 px-3 py-2 text-xs font-semibold text-lapis-950 focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
      >
        {lang === 'ar' ? 'تخطَّ إلى محتوى المهمة' : 'Skip to mission content'}
      </a>

      <div className="flex min-h-screen">
        <Sidebar
          onLearn={() => openLearn()}
          onProject={openProjectPage}
          onNasaData={openNasaDataPage}
        />

        <div className="min-w-0 flex-1">
          <Header
            onLearn={() => openLearn()}
            onProfile={() => setModal('profile')}
            onCampaign={() => setModal('campaign')}
            onProject={openProjectPage}
            onNasaData={openNasaDataPage}
            onNew={() => setModal('new')}
            onExport={handleExport}
            onImport={() => setModal('import')}
            onReset={() => setModal('reset')}
          />

          <Stepper variant="mini" />

          <main id="mission-content" className="mx-auto w-full max-w-[1180px] px-3 pb-40 pt-4 sm:px-5 sm:pt-5 lg:px-7 lg:pb-10">
            <CampaignBanner onOpen={() => setModal('campaign')} />
            <StepIntro step={step} onLearn={() => openLearn()} contextHint={<ContextHint step={step} />} />
            <IssuesPanel />
            {stepContent}
            <StepNav step={step} />
          </main>
        </div>
      </div>

      <MobileDashboard onLearn={() => openLearn()} />
      <Toasts />
      <LearnPanel open={learnOpen} focusKey={learnFocus} onClose={closeLearn} />

      {modal === 'profile' ? (
        <ProfileModal
          onClose={() => setModal(null)}
          onCampaign={() => setModal('campaign')}
        />
      ) : null}

      {modal === 'campaign' ? (
        <CampaignModal
          onClose={() => setModal(null)}
          onFreeplay={() => {
            startGame();
            setModal(null);
            window.scrollTo({ top: 0 });
          }}
        />
      ) : null}

      {modal === 'new' ? (
        <Modal
          title={lang === 'ar' ? 'مهمة جديدة' : 'New mission'}
          description={
            lang === 'ar'
              ? 'سيُصفَّر التصميم الحالي وتعود إلى الخطوة الأولى.'
              : 'The current design will be cleared and you will return to step one.'
          }
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" onClick={() => setModal(null)} className="btn-ghost text-xs">
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  startGame();
                  setModal(null);
                  scrollTop();
                }}
                className="btn-primary text-xs"
              >
                {lang === 'ar' ? 'ابدأ التصميم' : 'Start designing'}
              </button>
            </>
          }
        >
          <InlineNote tone="warn">
            <IconAlert className="me-1 inline h-3.5 w-3.5" />
            {lang === 'ar'
              ? 'ستفقد المحاكاة الحالية، لكن المحاولات المحفوظة ولوحة الصدارة ستبقيان على هذا الجهاز.'
              : 'The current run will be lost, but saved attempts and the local leaderboard stay on this device.'}
          </InlineNote>
          {activeChapterId ? (
            <InlineNote tone="warn" className="mt-2">
              <IconAlert className="me-1 inline h-3.5 w-3.5" />
              {lang === 'ar'
                ? 'أنت داخل حملة «أفق آمون». بدء مهمة جديدة سيخرجك من الفصل النشط، لكن تقدم الحملة ونجومها ونهايات الفصول ستبقى محفوظة.'
                : 'You are inside the AMUN Horizon campaign. Starting a new mission exits the active chapter, but campaign progress, stars and unlocked endings stay saved.'}
            </InlineNote>
          ) : null}
          <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-limestone-300">
            <p>
              {lang === 'ar'
                ? 'ستحصل على تصميم افتراضي جديد وبذرة عشوائية جديدة. المستوى واللغة الحاليان محفوظان.'
                : 'You will get a fresh default design and a new random seed. Your difficulty and language are kept.'}
            </p>
            <p>
              {lang === 'ar'
                ? 'للمقارنة العادلة، استخدم «نفس البذرة» من صفحة التقييم بدلًا من البدء من الصفر.'
                : 'For a fair comparison, use “Same seed” from the evaluation page instead of starting from scratch.'}
            </p>
          </div>
        </Modal>
      ) : null}

      {modal === 'import' ? (
        <ImportModal
          onClose={() => setModal(null)}
          onImport={(json) => importDesign(json)}
          onSuccess={() => {
            setModal(null);
            scrollTop();
          }}
        />
      ) : null}

      {modal === 'reset' ? (
        <Modal
          title={lang === 'ar' ? 'تصفير كل شيء' : 'Full reset'}
          description={
            lang === 'ar'
              ? 'يمسح هذا الإجراء كل ما هو محفوظ محليًا.'
              : 'This clears everything saved locally.'
          }
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" onClick={() => setModal(null)} className="btn-ghost text-xs">
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  setModal(null);
                  closeLearn();
                  window.scrollTo({ top: 0 });
                }}
                className="btn border-carnelian bg-carnelian text-limestone-50 hover:bg-[#bf3a25]"
              >
                <IconReset className="h-3.5 w-3.5" />
                {lang === 'ar' ? 'امسح كل شيء' : 'Erase everything'}
              </button>
            </>
          }
        >
          <InlineNote tone="danger">
            <IconAlert className="me-1 inline h-3.5 w-3.5" />
            {lang === 'ar'
              ? 'سيُحذف التصميم والمحاكاة وكل المحاولات ولوحة الصدارة وملف القائد وإنجازاته وحملة أفق آمون نهائيًا من هذا المتصفح.'
              : 'The design, simulation, every attempt, the leaderboard, the pilot profile, its achievements and the AMUN Horizon campaign will be permanently removed from this browser.'}
          </InlineNote>
          <p className="mt-3 text-[11px] leading-relaxed text-limestone-300">
            {lang === 'ar'
              ? 'لا يوجد حساب أو نسخة سحابية لاستعادة البيانات. صدّر التصميم أولًا إذا أردت الاحتفاظ به.'
              : 'There is no account or cloud backup. Export the design first if you want to keep it.'}
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-data border border-royal-700 bg-lapis-900/40 px-3 py-2 font-latin text-[10px] text-limestone-400" dir="ltr">
            <IconDownload className="h-3.5 w-3.5" />
            amun-design-{choices.seed.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 24) || 'mission'}.json
          </div>
        </Modal>
      ) : null}

      <nav className="sr-only" aria-label={lang === 'ar' ? 'تنقل سريع بين الخطوات' : 'Quick step navigation'}>
        {STEPS.map((meta) => (
          <button key={meta.id} type="button" onClick={() => setStep(meta.n)}>
            {lang === 'ar' ? meta.title.ar : meta.title.en}
          </button>
        ))}
      </nav>
    </>
  );
}

function ImportModal({
  onClose,
  onImport,
  onSuccess,
}: {
  onClose: () => void;
  onImport: (json: string) => { ok: boolean; error?: string };
  onSuccess: () => void;
}) {
  const lang = useLang();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const errorText = (code?: string) => {
    if (lang === 'ar') {
      if (code === 'target') return 'الهدف المذكور غير معروف. تحقق من حقل targetId.';
      if (code === 'parse') return 'الملف ليس JSON صالحًا.';
      return 'الملف لا يحتوي على كائن choices صالح.';
    }
    if (code === 'target') return 'The target is unknown. Check the targetId field.';
    if (code === 'parse') return 'The file is not valid JSON.';
    return 'The file does not contain a valid choices object.';
  };

  const submit = () => {
    const result = onImport(text);
    if (result.ok) onSuccess();
    else setError(errorText(result.error));
  };

  return (
    <Modal
      title={lang === 'ar' ? 'استيراد تصميم' : 'Import design'}
      description={
        lang === 'ar'
          ? 'الصق JSON المُصدَّر من AMUN أو اختر ملفًا.'
          : 'Paste JSON exported from AMUN or choose a file.'
      }
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-ghost text-xs">
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="button" onClick={submit} disabled={!text.trim()} className="btn-primary text-xs">
            <IconUpload className="h-3.5 w-3.5" />
            {lang === 'ar' ? 'استورد وراجع' : 'Import & review'}
          </button>
        </>
      }
    >
      <label htmlFor="import-file" className="label mb-1.5 block">
        {lang === 'ar' ? 'ملف التصميم' : 'Design file'}
      </label>
      <input
        id="import-file"
        type="file"
        accept="application/json,.json"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setFileName(file.name);
          setText(await file.text());
          setError(null);
        }}
        className="field file:me-3 file:rounded-data file:border-0 file:bg-royal-500/20 file:px-2 file:py-1 file:text-[11px] file:font-bold file:text-royal-200"
      />
      {fileName ? (
        <p className="mt-1.5 font-latin text-[10px] text-limestone-400" dir="ltr">
          {fileName}
        </p>
      ) : null}

      <label htmlFor="import-json" className="label mb-1.5 mt-3 block">
        {lang === 'ar' ? 'أو الصق JSON' : 'Or paste JSON'}
      </label>
      <textarea
        id="import-json"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setError(null);
        }}
        rows={9}
        dir="ltr"
        spellCheck={false}
        placeholder={'{\n  "version": 1,\n  "choices": { ... }\n}'}
        className="field resize-y font-latin text-[11px] leading-relaxed"
      />

      {error ? (
        <InlineNote tone="danger" className="mt-3">
          <IconAlert className="me-1 inline h-3.5 w-3.5" />
          {error}
        </InlineNote>
      ) : (
        <InlineNote tone="neutral" className="mt-3">
          {lang === 'ar'
            ? 'يُعاد التحقق من الهدف والأجهزة بعد الاستيراد. قد تُزال أدوات غير متوافقة مع نوع المهمة.'
            : 'Target and instruments are re-validated after import. Instruments incompatible with the mission type may be removed.'}
        </InlineNote>
      )}
    </Modal>
  );
}
