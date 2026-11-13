import type { ReactNode } from 'react';
import { fmt } from '../lib/format';

export type BarTone = 'royal' | 'gold' | 'good' | 'warn' | 'danger';

const barFill: Record<BarTone, string> = {
  royal: 'bg-royal-500',
  gold: 'bg-gold-400',
  good: 'bg-good',
  warn: 'bg-warn',
  danger: 'bg-danger',
};

/** Small, consistent progress bar used by every trade-off screen. */
export function Bar({
  ratio,
  tone = 'royal',
  className = '',
  'aria-label': ariaLabel,
}: {
  ratio: number;
  tone?: BarTone;
  className?: string;
  'aria-label'?: string;
}) {
  const width = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0)) * 100;
  return (
    <div
      className={`h-2 overflow-hidden rounded-full bg-white/[0.06] ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${barFill[tone]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export type StatTone = 'default' | 'good' | 'warn' | 'danger' | 'gold' | 'royal';

const statTone: Record<StatTone, string> = {
  default: 'text-white',
  good: 'text-good',
  warn: 'text-warn',
  danger: 'text-danger',
  gold: 'text-gold-200',
  royal: 'text-royal-200',
};

/** Compact metric tile with an optional explanation line. */
export function Stat({
  label,
  value,
  hint,
  tone = 'default',
  className = '',
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: StatTone;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/[0.07] bg-void-900/40 px-3 py-2.5 ${className}`}>
      <div className="text-[10px] font-semibold leading-snug text-slate-500">{label}</div>
      <div className={`mt-1 font-latin text-lg font-extrabold tabular-nums leading-tight ${statTone[tone]}`} dir="ltr">
        {value}
      </div>
      {hint ? <div className="mt-1 text-[10px] leading-snug text-slate-500">{hint}</div> : null}
    </div>
  );
}

/** Labelled range slider that keeps the technical value in Western digits. */
export function RangeControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  hint,
  formatValue,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  hint?: ReactNode;
  formatValue?: (value: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="label">
          {label}
        </label>
        <span className="num text-sm font-extrabold text-white">
          {formatValue ? formatValue(value) : fmt(value, step < 1 ? 1 : 0)}
          {unit ? <span className="ms-1 text-[10px] font-semibold text-slate-400">{unit}</span> : null}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-1 flex justify-between font-latin text-[9px] text-slate-600" dir="ltr">
        <span>
          {min}
          {unit ? ` ${unit}` : ''}
        </span>
        <span>
          {max}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      {hint ? <div className="mt-1.5 text-[10px] leading-relaxed text-slate-500">{hint}</div> : null}
    </div>
  );
}

/** Neutral explanatory strip used inside cards. */
export function InlineNote({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'danger' | 'royal';
  className?: string;
}) {
  const map = {
    neutral: 'border-white/[0.07] bg-white/[0.02] text-slate-400',
    good: 'border-good/20 bg-good/[0.05] text-good',
    warn: 'border-warn/25 bg-warn/[0.05] text-warn',
    danger: 'border-danger/25 bg-danger/[0.05] text-danger',
    royal: 'border-royal-400/20 bg-royal-500/[0.05] text-royal-200',
  };
  return (
    <div className={`rounded-xl border px-3 py-2 text-[11px] leading-relaxed ${map[tone]} ${className}`}>
      {children}
    </div>
  );
}
