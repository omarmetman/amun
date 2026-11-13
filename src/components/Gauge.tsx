import type { ReactNode } from 'react';
import { clamp01, type MarginTone } from '../lib/format';

const toneStroke: Record<MarginTone, string> = {
  negative: '#ff5d6c',
  low: '#ffc857',
  ideal: '#38d6a4',
  high: '#e8b949',
};

interface GaugeProps {
  ratio: number;
  tone: MarginTone;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export function Gauge({ ratio, tone, label, value, sub, icon, size = 'md', onClick }: GaugeProps) {
  const radius = size === 'sm' ? 18 : 27;
  const box = size === 'sm' ? 46 : 68;
  const stroke = size === 'sm' ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * clamp01(ratio);
  const color = toneStroke[tone];

  const content = (
    <>
      <div className="relative shrink-0" style={{ width: box, height: box }}>
        <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} aria-hidden="true" className="-rotate-90">
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,.08)"
            strokeWidth={stroke}
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            style={{ transition: 'stroke-dasharray .5s ease, stroke .3s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-slate-300">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[11px] font-semibold text-slate-400">{label}</span>
        </div>
        <div className="mt-0.5 font-latin text-lg font-extrabold leading-tight tabular-nums text-white">{value}</div>
        {sub ? <div className="mt-0.5 truncate text-[10px] text-slate-500">{sub}</div> : null}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-void-900/35 p-2 text-start transition hover:border-white/20 hover:bg-white/[0.04]"
      >
        {content}
      </button>
    );
  }

  return <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-void-900/35 p-2">{content}</div>;
}
