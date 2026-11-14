import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '../i18n';
import { AmunLogo } from './AmunLogo';
import { LanguageToggle } from './LanguageToggle';
import { IconCross, IconExternal, IconMenu } from './Icons';

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
            <div className="px-2.5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-limestone-400">
              {group.title}
            </div>
          ) : null}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const className = `relative flex min-h-[46px] w-full items-center gap-3 rounded-data px-2.5 py-2 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ochre-400 ${
                item.tone === 'danger'
                  ? 'text-carnelian-300 hover:bg-carnelian/10 focus-visible:bg-carnelian/10'
                  : item.active
                    ? 'bg-royal-700/40 text-limestone-50'
                    : 'text-limestone-200 hover:bg-royal-700/30 hover:text-limestone-50 focus-visible:bg-royal-700/30'
              }`;
              const content = (
                <>
                  {item.active ? (
                    <span className="absolute inset-y-1.5 start-0 w-0.5 rounded-full bg-ochre-400" aria-hidden="true" />
                  ) : null}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-data border ${
                      item.tone === 'danger'
                        ? 'border-carnelian/40 bg-carnelian/10 text-carnelian-300'
                        : 'border-royal-700 bg-lapis-950/70 text-limestone-300'
                    }`}
                    aria-hidden="true"
                  >
                    {item.icon ?? <span className="h-1 w-1 rounded-full bg-royal-400" />}
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
                  {item.href ? (
                    <IconExternal className="h-3 w-3 shrink-0 text-limestone-400" />
                  ) : item.hint ? (
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
                    data-menu-row
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
                  data-menu-row
                  className={className}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Shared application bar. Phones get a full-height menu sheet; desktop gets a
 * scrollable drop-down with the same groups and the same primary action.
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
  const [mobile, setMobile] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const focusables = (root: HTMLElement | null) =>
      Array.from(
        root?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [role="menuitem"]:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.offsetParent !== null || element === document.activeElement);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      const root = mobile ? sheetRef.current : dropdownRef.current;
      if (!root) return;

      if (mobile && event.key === 'Tab') {
        const items = focusables(root);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (!mobile && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        const items = focusables(root);
        if (!items.length) return;
        event.preventDefault();
        const index = items.indexOf(document.activeElement as HTMLElement);
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : event.key === 'ArrowDown'
                ? index < 0 || index === items.length - 1
                  ? 0
                  : index + 1
                : index <= 0
                  ? items.length - 1
                  : index - 1;
        items[next]?.focus();
      }
    };

    const onPointer = (event: MouseEvent) => {
      if (mobile) return;
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onPointer);

    const previousOverflow = document.body.style.overflow;
    if (mobile) document.body.style.overflow = 'hidden';

    const frame = window.requestAnimationFrame(() => {
      const root = mobile ? sheetRef.current : dropdownRef.current;
      const firstRow = root?.querySelector<HTMLElement>('[data-menu-row]');
      (firstRow ?? focusables(root)[0])?.focus();
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointer);
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
    };
  }, [open, mobile, close]);

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
            ref={triggerRef}
            type="button"
            onClick={() => (open ? close(false) : setOpen(true))}
            aria-haspopup={mobile ? 'dialog' : 'menu'}
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
            ref={dropdownRef}
            role="menu"
            aria-label={menuLabel ?? t('القائمة', 'Menu')}
            className="sheet-open absolute end-1 top-[calc(100%+7px)] z-50 hidden w-[22rem] max-w-[calc(100vw-1.5rem)] border border-royal-600 bg-lapis-900 shadow-2xl lg:block"
          >
            <div className="flex max-h-[min(52rem,calc(100dvh-5.5rem))] flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-royal-700 bg-lapis-950/60 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-limestone-400">
                    {menuLabel ?? t('القائمة', 'Menu')}
                  </div>
                  <div className="mt-0.5 font-display text-sm leading-none text-limestone-50">AMUN</div>
                </div>
                <span className="font-latin text-[9px] uppercase tracking-[0.18em] text-royal-300" dir="ltr">
                  {t('تنقل', 'NAV')}
                </span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5">
                <MenuRows groups={menuGroups} close={() => close(false)} role="menu" />
              </div>

              {primaryAction ? (
                <div className="border-t border-royal-700 bg-lapis-950/40 p-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      primaryAction.onClick();
                    }}
                    className="btn-primary w-full text-sm"
                  >
                    {primaryAction.icon}
                    <span>{primaryAction.label}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Mobile full-height sheet */}
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[90] lg:hidden">
              <section
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-label={menuLabel ?? t('القائمة', 'Menu')}
                className="sheet-open absolute inset-0 flex h-[100dvh] flex-col bg-lapis-950"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-royal-700 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <AmunLogo className="h-8 w-8" />
                    <div className="min-w-0">
                      <div className="truncate text-[10px] uppercase tracking-[0.14em] text-limestone-400">
                        {menuLabel ?? t('القائمة', 'Menu')}
                      </div>
                      <div className="font-display text-base leading-tight text-limestone-50">AMUN</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <LanguageToggle compact />
                    <button
                      type="button"
                      onClick={() => close()}
                      className="btn-icon"
                      aria-label={t('إغلاق القائمة', 'Close menu')}
                    >
                      <IconCross className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2">
                  <MenuRows groups={menuGroups} close={() => close(false)} role="dialog" />
                </div>

                <div className="border-t border-royal-700 bg-lapis-900/50 px-4 py-3">
                  {primaryAction ? (
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        primaryAction.onClick();
                      }}
                      className="btn-primary w-full text-sm"
                    >
                      {primaryAction.icon}
                      <span>{primaryAction.label}</span>
                    </button>
                  ) : null}
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-limestone-400">
                      {t('كل الأدوات في مكان واحد', 'Every tool in one place')}
                    </span>
                    <span className="font-latin text-[9px] uppercase tracking-[0.16em] text-royal-300" dir="ltr">
                      Space Apps 2026
                    </span>
                  </div>
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
