import { useEffect } from 'react';
import { useL, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';
import { IconAlert, IconCross, IconInfo } from './Icons';

function Toast({ id, kind, text }: { id: string; kind: 'info' | 'warning'; text: { ar: string; en: string } }) {
  const l = useL();
  const t = useT();
  const dismiss = useMissionStore((state) => state.dismissNotice);

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(id), 8000);
    return () => window.clearTimeout(timer);
  }, [id, dismiss]);

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-2.5 border border-royal-600 bg-lapis-900 px-3 py-2.5 ${
        kind === 'warning' ? 'border-s-2 border-s-amber' : 'border-s-2 border-s-royal-400'
      }`}
    >
      {kind === 'warning' ? (
        <IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
      ) : (
        <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-royal-300" />
      )}
      <p className="min-w-0 flex-1 text-xs leading-relaxed text-limestone-200">{l(text)}</p>
      <button
        type="button"
        onClick={() => dismiss(id)}
        aria-label={t('إغلاق الإشعار', 'Dismiss notification')}
        className="p-0.5 text-limestone-400 transition-colors hover:text-limestone-50"
      >
        <IconCross className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Toasts() {
  const notices = useMissionStore((state) => state.notices);
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-24 z-[85] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-4 sm:end-4 sm:items-end">
      {notices.map((notice) => (
        <Toast key={notice.id} id={notice.id} kind={notice.kind} text={notice.text} />
      ))}
    </div>
  );
}
