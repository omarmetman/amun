import { useEffect } from 'react';
import { Info, TriangleAlert, X } from 'lucide-react';
import { useL, useT } from '../i18n';
import { useMissionStore } from '../store/useMissionStore';

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
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-3 py-2.5 shadow-2xl backdrop-blur-xl ${
        kind === 'warning'
          ? 'border-warn/30 bg-void-900/95 text-warn'
          : 'border-royal-400/30 bg-void-900/95 text-royal-300'
      }`}
    >
      {kind === 'warning' ? (
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <p className="min-w-0 flex-1 text-[11px] font-medium leading-relaxed text-slate-200">{l(text)}</p>
      <button
        type="button"
        onClick={() => dismiss(id)}
        aria-label={t('إغلاق الإشعار', 'Dismiss notification')}
        className="rounded p-0.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
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
