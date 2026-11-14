import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '../i18n';
import { AmunLogo } from './AmunLogo';
import { LanguageToggle } from './LanguageToggle';
import { IconChevron, IconCross, IconMenu } from './Icons';

export interface HeaderNavItem {
  key: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}

export interface HeaderMenuItem {
  key: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  icon?: ReactNode;
  hint?: string;
  tone?: 'default' | 'danger';
  /** When set, the row renders as a real link instead of a button. */
  href?: string;
}

export interface HeaderMenuGroup {
  title?: string;
  items: HeaderMenuItem[];
}

interface SiteHeaderProps {
  context: ReactNode;
  nav?: HeaderNavItem[];
  menuGroups: HeaderMenuGroup[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  onLogoClick?: () => void;
  menuLabel?: string;
}

function MenuRows({
  groups,
  close,
  role,
}: {
  groups: HeaderMenuGroup[];
  close: () => void;
  role: 'menu' | 'dialog';
}) {
  return (
    <>
      {groups.map((group, groupIndex) => (
        <div key={group.title ?? groupIndex} className={groupIndex ? 'mt-1 border-t border-royal-700/70 pt-1' : ''}>
          {group.title ? (
            <div className="px-3 pb-1 pt-2.5 text-[10px] font-semibold text-limestone-400">{group.title}</div>
          ) : null}
          {group.items.map((item) => {
            const className = `flex min-h-[44px] w-full items-center gap-3 px-3 py-2.5 text-start text-sm transition-colors ${
              item.tone === 'danger'
                ? 'text-carnelian-300 hover:bg-carnelian/10'
                : item.active
                  ? 'bg-royal-700/40 text-limestone-50'
                  : 'text-limestone-200 hover:bg-royal-700/30 hover:text-limestone-50'
            }`;
            const content = (
              <>
                {item.icon ? <span className="flex h-5 w-5 shrink-0 items-center justify-center">{item.icon}</span> : null}
                <span className="min-w-0 flex-1">{item.label}</span>
                {item.hint ? (
                  <span className="shrink-0 font-latin text-[10px] tabular-nums text-limestone-400" dir="ltr">
                    {item.hint}
                  </span>
                ) : null}
              </>
            );

            if (item.href) {
              return (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  role={role === 'menu' ? 'menuitem' : undefined}
                  onClick={close}
                  className={className}
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                role={role === 'menu' ? 'menuitem' : undefined}
                aria-current={item.active ? 'page' : undefined}
                onClick={() => {
                  close();
                  item.onClick?.();
                }}
                className={className}
              >
                {content}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

/**
 * Shared application bar. Desktop keeps at most three navigation links, one
 * primary action, the language switch and one menu. Phones keep the mark, the
 * current context, a compact language switch and one menu button.
 */
export function SiteHeader({
  context,
  nav = [],
  menuGroups,
  primaryAction,
  onLogoClick,
  menuLabel,
}: SiteHeaderProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onPointer);
    const mobile = window.matchMedia('(max-width: 1023px)').matches;
    const previousOverflow = document.body.style.overflow;
    if (mobile) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const logo = (
    <span className="flex shrink-0 items-center gap-2.5">
      <AmunLogo className="h-9 w-9" />
      <span className="hidden font-display text-base font-semibold leading-none text-limestone-50 sm:block">AMUN</span>
    </span>
  );

  return (
    <header ref={rootRef} className="sticky top-0 z-50 border-b border-royal-700 bg-lapis-950/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {onLogoClick ? (
            <button type="button" onClick={onLogoClick} className="min-h-[44px] rounded-data" aria-label="AMUN">
              {logo}
            </button>
          ) : (
            logo
          )}
          <span className="hidden h-7 w-px shrink-0 bg-royal-700 md:block" aria-hidden="true" />
          <div className="min-w-0">{context}</div>
        </div>

        {nav.length ? (
          <nav className="hidden shrink-0 items-center lg:flex" aria-label={t('التنقل الرئيسي', 'Primary navigation')}>
            {nav.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                aria-current={item.active ? 'page' : undefined}
                className={`inline-flex min-h-[40px] items-center rounded-data px-3 text-xs font-medium transition-colors ${
                  item.active
                    ? 'text-ochre-300'
                    : 'text-limestone-300 hover:bg-royal-700/25 hover:text-limestone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        ) : null}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {primaryAction ? (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="btn-primary hidden min-h-[40px] !px-3 text-xs xl:inline-flex"
            >
              {primaryAction.icon}
              <span>{primaryAction.label}</span>
            </button>
          ) : null}
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={menuLabel ?? t('القائمة', 'Menu')}
            className="btn-icon"
          >
            {open ? <IconCross className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
        </div>

        {/* Desktop drop-down */}
        {open ? (
          <div
            role="menu"
            aria-label={menuLabel ?? t('القائمة', 'Menu')}
            className="sheet-open absolute end-0 top-[calc(100%+7px)] z-50 hidden w-80 border border-royal-600 bg-lapis-900 p-1 shadow-2xl lg:block"
          >
            <MenuRows groups={menuGroups} close={() => setOpen(false)} role="menu" />
          </div>
        ) : null}
      </div>

      {/* Mobile sheet */}
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            aria-label={t('إغلاق القائمة', 'Close menu')}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-lapis-950/80"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label={menuLabel ?? t('القائمة', 'Menu')}
            className="sheet-open absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto border-t border-royal-600 bg-lapis-900"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-royal-700 bg-lapis-900 px-4 py-3">
              <div className="min-w-0">
                <div className="text-[10px] text-limestone-400">{t('قائمة التنقل', 'Navigation')}</div>
                <div className="truncate font-display text-base text-limestone-50">AMUN</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="btn-icon" aria-label={t('إغلاق', 'Close')}>
                <IconCross className="h-4 w-4" />
              </button>
            </div>
            <div className="px-2 py-2">
              <MenuRows groups={menuGroups} close={() => setOpen(false)} role="dialog" />
            </div>
            {primaryAction ? (
              <div className="border-t border-royal-700 px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    primaryAction.onClick();
                  }}
                  className="btn-primary w-full text-sm"
                >
                  {primaryAction.icon}
                  <span>{primaryAction.label}</span>
                </button>
              </div>
            ) : null}
            <div className="px-4 pb-1 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-[40px] items-center gap-1.5 text-xs text-limestone-400 hover:text-limestone-100"
              >
                <IconChevron dir="down" className="h-3.5 w-3.5" />
                {t('إغلاق القائمة', 'Close menu')}
              </button>
            </div>
          </section>
        </div>,
            document.body,
          )
        : null}
    </header>
  );
}
