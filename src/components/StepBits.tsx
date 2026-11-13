import type { CSSProperties, ReactNode } from 'react';
import { fmt } from '../lib/format';

export type BarTone = 'royal' | 'gold' | 'good' | 'warn' | 'danger';

const barFill: Record<BarTone, string> = {
  royal: 'bg-royal-400',
  gold: 'bg-ochre-400',
  good: 'bg-malachite',
  warn: 'bg-amber',
  danger: 'bg-carnelian',
};

/** A measured bar: square ends, one pigment, no glow. */
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
    <div className={`h-1.5 bg-royal-700 ${className}`} role="img" aria-label={ariaLabel}>
      <div
        className={`h-full transition-[width] duration-500 ${barFill[tone]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export type StatTone = 'default' | 'good' | 'warn' | 'danger' | 'gold' | 'royal';

const statTone: Record<StatTone, string> = {
  default: 'text-limestone-50',
  good: 'text-malachite',
  warn: 'text-amber',
  danger: 'text-carnelian-300',
  gold: 'text-ochre-300',
  royal: 'text-limestone-100',
};

/** A figure on a specification sheet, not a floating tile. */
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
    <div className={`border-t border-royal-700 px-1 py-2.5 ${className}`}>
      <div className="text-[11px] leading-snug text-limestone-400">{label}</div>
      <div className={`mt-0.5 font-latin text-lg tabular-nums leading-tight ${statTone[tone]}`} dir="ltr">
        {value}
      </div>
      {hint ? <div className="mt-0.5 text-[10px] leading-snug text-limestone-400">{hint}</div> : null}
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
        <span className="font-latin text-sm font-medium tabular-nums text-limestone-50" dir="ltr">
          {formatValue ? formatValue(value) : fmt(value, step < 1 ? 1 : 0)}
          {unit ? <span className="ms-1 text-[10px] font-normal text-limestone-400">{unit}</span> : null}
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
      <div className="mt-1 flex justify-between font-latin text-[10px] text-limestone-400" dir="ltr">
        <span>
          {min}
          {unit ? ` ${unit}` : ''}
        </span>
        <span>
          {max}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      {hint ? <div className="mt-1.5 text-[10px] leading-relaxed text-limestone-400">{hint}</div> : null}
    </div>
  );
}

/** Explaining text sits in the margin with a rule, not inside a coloured box. */
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
    neutral: 'border-limestone-400 text-limestone-300',
    good: 'border-malachite text-malachite',
    warn: 'border-amber text-amber',
    danger: 'border-carnelian text-carnelian-300',
    royal: 'border-royal-400 text-limestone-200',
  };
  return (
    <div className={`border-s-2 py-1 ps-3 text-xs leading-relaxed ${map[tone]} ${className}`}>
      {children}
    </div>
  );
}

export interface SpecColumn {
  key: string;
  label: ReactNode;
  numeric?: boolean;
}

export interface SpecOption {
  id: string;
  title: ReactNode;
  note?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  cells: Record<string, ReactNode>;
}

/**
 * Comparison sheet: one row per option, numeric columns on one baseline, and
 * an inner ochre edge on the chosen row. Not a grid of identical cards.
 */
export function SpecTable({
  columns,
  options,
  selectedId,
  selectedIds,
  onSelect,
  label,
  disabled = false,
}: {
  columns: SpecColumn[];
  options: SpecOption[];
  selectedId?: string;
  selectedIds?: string[];
  onSelect: (id: string) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div role="group" aria-label={label}>
      <div
        className="spec-head-row items-end border-b border-limestone-400/40 pb-1"
        style={{ '--spec-cols': columns.length } as CSSProperties}
      >
        <span className="spec-head">{label}</span>
        {columns.map((column) => (
          <span key={column.key} className="spec-head text-end">
            {column.label}
          </span>
        ))}
        <span className="w-4" />
      </div>
      {options.map((option, index) => {
        const selected = selectedIds ? selectedIds.includes(option.id) : option.id === selectedId;
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled || option.disabled}
            onClick={() => onSelect(option.id)}
            aria-pressed={selected}
            className={`spec-row w-full text-start transition-colors disabled:opacity-50 ${
              selected ? 'bg-royal-700/40' : 'hover:bg-royal-700/20'
            }`}
            style={{
              '--spec-cols': columns.length,
              boxShadow: selected ? 'inset 0 0 0 1px #E3A92F' : undefined,
            } as CSSProperties}
          >
            <span className="min-w-0">
              <span className={`flex items-baseline gap-1.5 text-sm ${selected ? 'text-limestone-50' : 'text-limestone-100'}`}>
                <span className="font-latin text-[10px] tabular-nums text-limestone-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {option.icon ? <span className="self-center text-limestone-300">{option.icon}</span> : null}
                <span className="min-w-0">{option.title}</span>
              </span>
              {option.note ? (
                <span className="mt-0.5 block text-[11px] leading-relaxed text-limestone-400">{option.note}</span>
              ) : null}
            </span>
            <span className="col-span-full flex flex-wrap gap-x-4 gap-y-1 sm:contents">
              {columns.map((column) => (
                <span key={column.key} className="min-w-0 sm:text-end">
                  <span className="me-1 text-[10px] text-limestone-400 sm:me-0 sm:block">{column.label}</span>
                  <span className={column.numeric === false ? 'text-xs text-limestone-200' : 'spec-num'}>
                    {option.cells[column.key]}
                  </span>
                </span>
              ))}
            </span>
            <span
              aria-hidden="true"
              className={`hidden h-3 w-3 shrink-0 self-center sm:block ${
                selected ? 'bg-ochre-400' : 'border border-royal-500'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
