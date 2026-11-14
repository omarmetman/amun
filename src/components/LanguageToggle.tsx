import { useLang } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';

/**
 * One compact, accessible language switch used by every header and page.
 * The labels shorten on phones instead of shrinking the hit area.
 */
export function LanguageToggle({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  const lang = useLang();
  const setLanguage = useMissionStore((state) => state.setLanguage);

  const base = 'inline-flex min-h-[38px] items-center justify-center rounded-data px-2.5 text-[11px] font-medium transition-colors sm:px-3';
  const active = 'bg-ochre-400 text-lapis-950';
  const idle = 'text-limestone-300 hover:text-limestone-50';

  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-data border border-royal-600 bg-lapis-950/40 p-0.5 ${className}`}
      role="group"
      aria-label="Language / اللغة"
    >
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={lang === 'ar'}
        className={`${base} ${lang === 'ar' ? active : idle}`}
      >
        {compact ? 'ع' : (
          <>
            <span className="sm:hidden">ع</span>
            <span className="hidden sm:inline">العربية</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={lang === 'en'}
        className={`${base} font-latin ${lang === 'en' ? active : idle}`}
      >
        {compact ? 'EN' : (
          <>
            <span className="sm:hidden">EN</span>
            <span className="hidden sm:inline">English</span>
          </>
        )}
      </button>
    </div>
  );
}
