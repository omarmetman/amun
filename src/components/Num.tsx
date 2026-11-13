import type { ReactNode } from 'react';
import { fmt } from '../lib/format';

interface NumProps {
  value: number;
  digits?: number;
  unit?: string;
  className?: string;
  unitClassName?: string;
}

/** Technical value: Western digits, tabular figures, LTR isolation. */
export function Num({ value, digits = 0, unit, className = '', unitClassName = '' }: NumProps) {
  return (
    <span className={`num ${className}`} dir="ltr">
      {fmt(value, digits)}
      {unit ? <span className={`ms-1 font-sans text-[0.72em] font-semibold text-slate-400 ${unitClassName}`}>{unit}</span> : null}
    </span>
  );
}

export function Value({
  label,
  children,
  hint,
  className = '',
}: {
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/[0.07] bg-void-900/40 px-3 py-2.5 ${className}`}>
      <div className="stat-label mb-1">{label}</div>
      <div className="font-latin text-lg font-extrabold tabular-nums text-white">{children}</div>
      {hint ? <div className="mt-1 text-[10px] leading-snug text-slate-500">{hint}</div> : null}
    </div>
  );
}
