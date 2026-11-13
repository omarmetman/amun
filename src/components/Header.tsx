import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BookOpen, Download, Flag, Globe2, LogOut, MoreHorizontal, Plus, RotateCcw, Trophy, Upload } from 'lucide-react';
import { ACHIEVEMENT_COUNT } from '../data/achievements';
import { CAMPAIGN_CHAPTERS } from '../data/campaign';
import { STEPS } from '../data/steps';
import { useL, useLang, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';
import { useCampaignProgress } from '../store/useCampaign';
import { AmunLogo } from './AmunLogo';

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const lang = useLang();
  const setLanguage = useMissionStore((state) => state.setLanguage);
  return (
    <div
      className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-0.5"
      role="group"
      aria-label="Language / اللغة"
    >
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={lang === 'ar'}
        className={`inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-[11px] font-bold transition ${
          lang === 'ar' ? 'bg-royal-500 text-white shadow' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Globe2 className="h-3 w-3" aria-hidden="true" />
        {compact ? 'ع' : 'عربي'}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={lang === 'en'}
        className={`rounded-[10px] px-2.5 py-1.5 font-latin text-[11px] font-bold transition ${
          lang === 'en' ? 'bg-royal-500 text-white shadow' : 'text-slate-400 hover:text-white'
        }`}
      >
        {compact ? 'EN' : 'English'}
      </button>
    </div>
  );
}

interface HeaderProps {
  onLearn: () => void;
  onProfile: () => void;
  onCampaign: () => void;
  onNew: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

export function Header({ onLearn, onProfile, onCampaign, onNew, onExport, onImport, onReset }: HeaderProps) {
  const t = useT();
  const l = useL();
  const step = useMissionStore((state) => state.step);
  const profile = useMissionStore((state) => state.profile);
  const activeChapterId = useMissionStore((state) => state.campaign.activeChapterId);
  const exitCampaign = useMissionStore((state) => state.exitCampaign);
  const campaignProgress = useCampaignProgress();
  const unlockedCount = Object.keys(profile.unlocked).length;
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = STEPS[step - 1] ?? STEPS[0];

  useEffect(() => {
    if (!menu) return;
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenu(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', key);
    };
  }, [menu]);

  const item = (icon: ReactNode, label: string, action: () => void, danger = false) => (
    <button
      type="button"
      onClick={() => {
        setMenu(false);
        action();
      }}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-xs font-semibold transition hover:bg-white/[0.07] ${
        danger ? 'text-danger' : 'text-slate-300 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-void-950/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="lg:hidden">
            <AmunLogo className="h-9 w-9" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="font-latin text-sm font-extrabold tracking-[0.18em] text-white">AMUN</span>
              <span className="rounded-md bg-royal-500/15 px-1.5 py-0.5 text-[9px] font-bold text-royal-300" dir="ltr">
                <span className="num">{step}</span>/11
              </span>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span>{t('المهمة', 'Mission')}</span>
                <span className="text-slate-700">/</span>
                <span className="num text-gold-300/80" dir="ltr">
                  {String(step).padStart(2, '0')} / 11
                </span>
              </div>
              <h1 className="mt-0.5 truncate text-sm font-bold text-white">{l(meta.title)}</h1>
            </div>
            <div className="truncate text-[11px] font-semibold text-slate-400 lg:hidden">{l(meta.title)}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <div className="sm:hidden">
            <LanguageToggle compact />
          </div>
          <button
            type="button"
            onClick={onCampaign}
            className="btn-ghost hidden !h-10 !rounded-xl !px-2.5 sm:inline-flex"
            aria-label={t(
              `افتح حملة أفق آمون: ${campaignProgress.completedCount} من ${CAMPAIGN_CHAPTERS.length} فصول مكتملة`,
              `Open AMUN Horizon campaign: ${campaignProgress.completedCount} of ${CAMPAIGN_CHAPTERS.length} chapters complete`,
            )}
          >
            <Flag className="h-4 w-4 text-gold-300" aria-hidden="true" />
            <span className="hidden text-[11px] lg:inline">{t('الحملة', 'Campaign')}</span>
            <span className="rounded-md bg-royal-500/15 px-1.5 py-0.5 font-latin text-[9px] font-bold text-royal-200" dir="ltr">
              {campaignProgress.completedCount}/{CAMPAIGN_CHAPTERS.length}
            </span>
          </button>
          <button
            type="button"
            onClick={onProfile}
            className="btn-ghost !h-10 !rounded-xl !px-2.5"
            aria-label={t(
              `افتح ملف القائد: ${unlockedCount} من ${ACHIEVEMENT_COUNT} إنجازًا`,
              `Open pilot profile: ${unlockedCount} of ${ACHIEVEMENT_COUNT} achievements`,
            )}
          >
            <Trophy className="h-4 w-4 text-gold-300" aria-hidden="true" />
            <span className="hidden text-[11px] md:inline">{t('الملف', 'Profile')}</span>
            <span className="rounded-md bg-gold-400/15 px-1.5 py-0.5 font-latin text-[9px] font-bold text-gold-200" dir="ltr">
              {unlockedCount}/{ACHIEVEMENT_COUNT}
            </span>
          </button>
          <button
            type="button"
            onClick={onLearn}
            className="btn-ghost !h-10 !rounded-xl !px-2.5"
            aria-label={t('افتح لوحة تعلّم', 'Open Learn panel')}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span className="hidden text-[11px] md:inline">{t('تعلّم', 'Learn')}</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenu((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={menu}
              aria-label={t('قائمة المهمة', 'Mission menu')}
              className="btn-icon"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
            {menu ? (
              <div
                role="menu"
                className="absolute end-0 top-12 z-50 w-52 rounded-2xl border border-white/15 bg-void-900/98 p-1.5 shadow-2xl backdrop-blur-2xl"
              >
                <div className="px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  {t('إدارة المهمة', 'Mission control')}
                </div>
                {item(
                  <Flag className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />,
                  t('حملة أفق آمون', 'AMUN Horizon campaign'),
                  onCampaign,
                )}
                {activeChapterId
                  ? item(
                      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />,
                      t('الخروج من الحملة', 'Exit campaign'),
                      exitCampaign,
                    )
                  : null}
                <div className="my-1 h-px bg-white/[0.07]" />
                {item(<Plus className="h-3.5 w-3.5" aria-hidden="true" />, t('مهمة جديدة', 'New mission'), onNew)}
                {item(<Download className="h-3.5 w-3.5" aria-hidden="true" />, t('تصدير التصميم', 'Export design'), onExport)}
                {item(<Upload className="h-3.5 w-3.5" aria-hidden="true" />, t('استيراد تصميم', 'Import design'), onImport)}
                <div className="my-1 h-px bg-white/[0.07]" />
                {item(<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />, t('تصفير كل شيء', 'Full reset'), onReset, true)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
