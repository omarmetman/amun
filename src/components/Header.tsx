import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ACHIEVEMENT_COUNT } from '../data/achievements';
import { CAMPAIGN_CHAPTERS } from '../data/campaign';
import { STEPS } from '../data/steps';
import { useL, useLang, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';
import { useCampaignProgress } from '../store/useCampaign';
import { AmunLogo } from './AmunLogo';
import {
  IconBook,
  IconDownload,
  IconExit,
  IconFlag,
  IconMedal,
  IconMenu,
  IconPlus,
  IconReset,
  IconUpload,
} from './Icons';

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const lang = useLang();
  const setLanguage = useMissionStore((state) => state.setLanguage);
  return (
    <div
      className="inline-flex items-center rounded-data border border-royal-600 p-0.5"
      role="group"
      aria-label="Language / اللغة"
    >
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={lang === 'ar'}
        className={`rounded-data px-2.5 py-1 text-[11px] font-medium transition-colors ${
          lang === 'ar' ? 'bg-ochre-400 text-lapis-950' : 'text-limestone-300 hover:text-limestone-50'
        }`}
      >
        {compact ? 'ع' : 'عربي'}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={lang === 'en'}
        className={`rounded-data px-2.5 py-1 font-latin text-[11px] font-medium transition-colors ${
          lang === 'en' ? 'bg-ochre-400 text-lapis-950' : 'text-limestone-300 hover:text-limestone-50'
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
      role="menuitem"
      onClick={() => {
        setMenu(false);
        action();
      }}
      className={`flex w-full items-center gap-2.5 px-2.5 py-2 text-start text-xs ${
        danger ? 'text-carnelian-300 hover:bg-carnelian/10' : 'text-limestone-200 hover:bg-royal-700/40'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-royal-700 bg-lapis-900">
      <div className="flex h-16 items-center justify-between gap-2 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="shrink-0 lg:hidden">
            <AmunLogo className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <div className="hidden lg:block">
              <div className="flex items-baseline gap-2 text-[11px] text-limestone-400">
                <span>{t('سجل المهمة', 'Mission log')}</span>
                <span className="font-latin tabular-nums text-ochre-400" dir="ltr">
                  {String(step).padStart(2, '0')} / 11
                </span>
              </div>
              <h1 className="mt-0.5 truncate font-display text-base text-limestone-50">{l(meta.title)}</h1>
            </div>
            <div className="flex min-w-0 items-baseline gap-2 lg:hidden">
              <span className="shrink-0 font-latin text-xs tabular-nums text-ochre-400" dir="ltr">
                {String(step).padStart(2, '0')}/11
              </span>
              <span className="truncate text-xs text-limestone-200">{l(meta.title)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <button
            type="button"
            onClick={onCampaign}
            className="hidden min-h-[36px] items-center gap-1.5 border border-royal-700 px-2 py-1 text-[11px] text-limestone-200 hover:border-limestone-400 sm:inline-flex"
            title={t(
              `الحملة: ${campaignProgress.completedCount} من ${CAMPAIGN_CHAPTERS.length} فصول مكتملة`,
              `Campaign: ${campaignProgress.completedCount} of ${CAMPAIGN_CHAPTERS.length} chapters completed`,
            )}
            aria-label={t(
              `افتح حملة أفق آمون: ${campaignProgress.completedCount} من ${CAMPAIGN_CHAPTERS.length} فصول مكتملة`,
              `Open AMUN Horizon campaign: ${campaignProgress.completedCount} of ${CAMPAIGN_CHAPTERS.length} chapters complete`,
            )}
          >
            <IconFlag className="h-4 w-4 text-ochre-400" />
            <span className="hidden lg:inline">{t('الحملة', 'Campaign')}</span>
            <span className="font-latin tabular-nums text-limestone-100" dir="ltr">
              {campaignProgress.completedCount}/{CAMPAIGN_CHAPTERS.length}
            </span>
          </button>
          <button
            type="button"
            onClick={onProfile}
            className="inline-flex min-h-[36px] items-center gap-1.5 border border-transparent px-2 py-1 text-[11px] text-limestone-200 hover:border-limestone-400"
            title={t(
              `ملف القائد: ${unlockedCount} من ${ACHIEVEMENT_COUNT} إنجازاً`,
              `Commander Profile: ${unlockedCount} of ${ACHIEVEMENT_COUNT} achievements`,
            )}
            aria-label={t(
              `افتح ملف القائد: ${unlockedCount} من ${ACHIEVEMENT_COUNT} إنجازًا`,
              `Open pilot profile: ${unlockedCount} of ${ACHIEVEMENT_COUNT} achievements`,
            )}
          >
            <IconMedal className="h-4 w-4 text-ochre-400" />
            <span className="hidden md:inline">{t('الملف', 'Profile')}</span>
            <span className="font-latin tabular-nums text-limestone-100" dir="ltr">
              {unlockedCount}/{ACHIEVEMENT_COUNT}
            </span>
          </button>
          <button
            type="button"
            onClick={onLearn}
            className="inline-flex min-h-[36px] items-center gap-1.5 border border-transparent px-2 py-1 text-[11px] text-limestone-200 hover:border-limestone-400"
            aria-label={t('افتح لوحة تعلّم', 'Open Learn panel')}
          >
            <IconBook className="h-4 w-4" />
            <span className="hidden md:inline">{t('تعلّم', 'Learn')}</span>
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
              <IconMenu className="h-4 w-4" />
            </button>
            {menu ? (
              <div
                role="menu"
                className="absolute end-0 top-11 z-50 w-56 border border-royal-600 bg-lapis-900 py-1"
              >
                <div className="flex items-center justify-between gap-2 px-2 py-1.5 sm:hidden">
                  <span className="text-[11px] text-limestone-400">{t('اللغة', 'Language')}</span>
                  <LanguageToggle compact />
                </div>
                <div className="my-1 h-px bg-royal-700 sm:hidden" />
                <div className="px-2.5 py-1 text-[10px] text-limestone-400">
                  {t('إدارة المهمة', 'Mission control')}
                </div>
                {item(<IconFlag className="h-4 w-4 text-ochre-400" />, t('حملة أفق آمون', 'AMUN Horizon campaign'), onCampaign)}
                {activeChapterId
                  ? item(<IconExit className="h-4 w-4" />, t('الخروج من الحملة', 'Exit campaign'), exitCampaign)
                  : null}
                <div className="my-1 h-px bg-royal-700" />
                {item(<IconPlus className="h-4 w-4" />, t('مهمة جديدة', 'New mission'), onNew)}
                {item(<IconDownload className="h-4 w-4" />, t('تصدير التصميم', 'Export design'), onExport)}
                {item(<IconUpload className="h-4 w-4" />, t('استيراد تصميم', 'Import design'), onImport)}
                <div className="my-1 h-px bg-royal-700" />
                {item(<IconReset className="h-4 w-4" />, t('تصفير كل شيء', 'Full reset'), onReset, true)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
