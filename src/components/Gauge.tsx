import type { ReactNode } from 'react';
import { clamp01, type MarginTone } from '../lib/format';

const toneText: Record<MarginTone, string> = {
  negative: 'text-carnelian-300',
  low: 'text-amber',
  ideal: 'text-malachite',
  high: 'text-ochre-400',
};

const toneMark: Record<MarginTone, string> = {
  negative: 'bg-carnelian',
  low: 'bg-amber',
  ideal: 'bg-malachite',
  high: 'bg-ochre-400',
};

interface GaugeProps {
  /** Margin as a fraction of the 40% useful ceiling. */
  ratio: number;
  tone: MarginTone;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  marginLabel?: string;
  index?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

/**
 * A margin ruler, not a dial: the optimum band (10–30% margin) is shaded,
 * the ceiling is a hard tick, and the current margin is a moving marker.
 */
export function Gauge({
  ratio,
  tone,
  label,
  value,
  sub,
  marginLabel,
  index,
  size = 'md',
  onClick,
}: GaugeProps) {
  const position = clamp01(Number.isFinite(ratio) ? ratio : 0);
  const compact = size === 'sm';

  const content = (
    <>
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-xs ${compact ? 'text-limestone-300' : 'text-limestone-200'}`}>{label}</span>
        {index ? <span className="font-latin text-[10px] tabular-nums text-limestone-400">{index}</span> : null}
      </div>

      <div
        className={`relative ${compact ? 'mt-1 h-4' : 'mt-1.5 h-6'}`}
        role="img"
        aria-label={`${label}: ${marginLabel ?? ''}`}
      >
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-royal-500" aria-hidden="true" />
        {/* Optimum band: 10–30% margin on a 0–40% ruler. */}
        <span
          className="absolute top-1/2 h-2 -translate-y-1/2 bg-malachite/20"
          style={{ left: '25%', width: '50%' }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-y-0 right-0 w-px bg-limestone-400"
          aria-hidden="true"
        />
        <span
          className={`absolute top-1/2 w-[2px] -translate-y-1/2 ${toneMark[tone]}`}
          style={{ left: `calc(${position * 100}% - 1px)`, height: compact ? '12px' : '18px' }}
          aria-hidden="true"
        />
        <span
          className={`absolute top-0 h-1.5 w-1.5 -translate-x-1/2 ${toneMark[tone]}`}
          style={{ left: `${position * 100}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-2">
        <span className={`font-latin tabular-nums text-limestone-50 ${compact ? 'text-sm' : 'text-lg'}`} dir="ltr">
          {value}
        </span>
        {marginLabel ? (
          <span className={`text-xs font-medium ${toneText[tone]}`}>{marginLabel}</span>
        ) : null}
      </div>
      {sub && !compact ? <div className="mt-0.5 text-[11px] leading-relaxed text-limestone-400">{sub}</div> : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full border-b border-royal-700 py-2.5 text-start transition-colors last:border-0 hover:bg-royal-700/20 focus-visible:bg-royal-700/25"
      >
        {content}
      </button>
    );
  }

  return <div className="border-b border-royal-700 py-2.5 last:border-0">{content}</div>;
}
