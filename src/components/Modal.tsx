import { useEffect, useRef, type ReactNode } from 'react';
import { useT } from '../i18n';
import { IconCross } from './Icons';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  title,
  description,
  onClose,
  children,
  footer,
  wide = false,
  extraWide = false,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  extraWide?: boolean;
}) {
  const t = useT();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () =>
      Array.from(node?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.getClientRects().length > 0 && el.tabIndex !== -1,
      );

    focusable()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !node) return;

      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('إغلاق', 'Close')}
        className="absolute inset-0 bg-lapis-950/80"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-window border border-royal-600 bg-lapis-900 ${
          extraWide ? 'max-w-4xl' : wide ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-royal-700 px-5 py-4">
          <div>
            <h2 className="font-display text-base text-limestone-50">{title}</h2>
            {description ? <p className="mt-1 text-xs leading-relaxed text-limestone-400">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="btn-icon" aria-label={t('إغلاق', 'Close')}>
            <IconCross className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-royal-700 px-5 py-3">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
