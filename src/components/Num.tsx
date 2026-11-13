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
      {unit ? <span className={`ms-1 font-sans text-[0.72em] font-semibold text-limestone-300 ${unitClassName}`}>{unit}</span> : null}
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
    <div className={`rounded-data border border-royal-700 bg-lapis-900/40 px-3 py-2.5 ${className}`}>
      <div className="stat-label mb-1">{label}</div>
      <div className="font-latin text-lg font-semibold tabular-nums text-limestone-50">{children}</div>
      {hint ? <div className="mt-1 text-[10px] leading-snug text-limestone-400">{hint}</div> : null}
    </div>
  );
}
