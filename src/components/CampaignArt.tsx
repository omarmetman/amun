import { useId } from 'react';
import { Flame, Gem, Moon, Orbit, Package, Star, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CampaignAccent, CampaignChapter } from '../data/types';

export const CAMPAIGN_ICONS: Record<string, LucideIcon> = {
  Moon,
  Orbit,
  Package,
  Flame,
  Sun,
  Gem,
};

export interface AccentStyle {
  border: string;
  bg: string;
  text: string;
  soft: string;
  gradient: string;
  ring: string;
  dot: string;
  hex: string;
}

/** Static class strings so Tailwind can see every accent at build time. */
export const CAMPAIGN_ACCENTS: Record<CampaignAccent, AccentStyle> = {
  gold: {
    border: 'border-gold-400/35',
    bg: 'bg-gold-400/10',
    text: 'text-gold-200',
    soft: 'bg-gold-400/[0.055]',
    gradient: 'from-gold-400/[0.16] via-gold-400/[0.04] to-transparent',
    ring: 'ring-gold-400/25',
    dot: 'bg-gold-400',
    hex: '#e8b949',
  },
  royal: {
    border: 'border-royal-400/35',
    bg: 'bg-royal-500/10',
    text: 'text-royal-200',
    soft: 'bg-royal-500/[0.055]',
    gradient: 'from-royal-500/[0.16] via-royal-500/[0.04] to-transparent',
    ring: 'ring-royal-400/25',
    dot: 'bg-royal-400',
    hex: '#6b93ff',
  },
  good: {
    border: 'border-good/35',
    bg: 'bg-good/10',
    text: 'text-good',
    soft: 'bg-good/[0.055]',
    gradient: 'from-good/[0.15] via-good/[0.035] to-transparent',
    ring: 'ring-good/25',
    dot: 'bg-good',
    hex: '#38d6a4',
  },
  danger: {
    border: 'border-danger/35',
    bg: 'bg-danger/10',
    text: 'text-danger',
    soft: 'bg-danger/[0.055]',
    gradient: 'from-danger/[0.14] via-danger/[0.035] to-transparent',
    ring: 'ring-danger/25',
    dot: 'bg-danger',
    hex: '#ff5d6c',
  },
  violet: {
    border: 'border-violet-400/35',
    bg: 'bg-violet-500/10',
    text: 'text-violet-200',
    soft: 'bg-violet-500/[0.055]',
    gradient: 'from-violet-500/[0.16] via-violet-500/[0.04] to-transparent',
    ring: 'ring-violet-400/25',
    dot: 'bg-violet-400',
    hex: '#a78bfa',
  },
  cyan: {
    border: 'border-cyan-400/35',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-200',
    soft: 'bg-cyan-500/[0.055]',
    gradient: 'from-cyan-500/[0.16] via-cyan-500/[0.04] to-transparent',
    ring: 'ring-cyan-400/25',
    dot: 'bg-cyan-400',
    hex: '#22d3ee',
  },
};

export function ChapterPatch({
  chapter,
  size = 'md',
  className = '',
}: {
  chapter: CampaignChapter;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const accent = CAMPAIGN_ACCENTS[chapter.accent];
  const Icon = CAMPAIGN_ICONS[chapter.icon] ?? Orbit;
  const box = size === 'lg' ? 'h-20 w-20 rounded-[1.6rem]' : size === 'sm' ? 'h-11 w-11 rounded-xl' : 'h-14 w-14 rounded-2xl';
  const icon = size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center border ${accent.border} ${accent.bg} ${box} ${className}`}
      aria-hidden="true"
    >
      <div className={`absolute inset-1.5 rounded-[inherit] border border-current opacity-[0.16] ${accent.text}`} />
      <Icon className={`relative ${icon} ${accent.text}`} />
      <span className="absolute -bottom-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-white/15 bg-void-950 px-1 font-latin text-[9px] font-black text-white">
        {String(chapter.number).padStart(2, '0')}
      </span>
    </div>
  );
}

export function CampaignStarRating({
  stars,
  size = 'md',
  label,
}: {
  stars: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}) {
  const dims = size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={label ?? `${stars} / 3`}
    >
      {[0, 1, 2].map((index) => (
        <Star
          key={index}
          className={`${dims} ${index < stars ? 'fill-gold-300 text-gold-300' : 'text-slate-700'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function SignalRings({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`signal-core-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8b949" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#4f7cff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4f7cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`signal-line-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93b4ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e8b949" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <circle cx="130" cy="130" r="74" fill={`url(#signal-core-${id})`} />
      <circle cx="130" cy="130" r="30" fill="#050814" stroke={`url(#signal-line-${id})`} strokeWidth="1.2" />
      <circle cx="130" cy="130" r="7" fill="#e8b949" />
      {[56, 84, 112].map((radius, index) => (
        <circle
          key={radius}
          cx="130"
          cy="130"
          r={radius}
          fill="none"
          stroke={index === 1 ? '#e8b949' : '#6b93ff'}
          strokeOpacity={0.2 - index * 0.04}
          strokeWidth="1"
          strokeDasharray={index === 2 ? '2 8' : undefined}
        />
      ))}
      <circle className="campaign-signal-pulse" cx="130" cy="130" r="56" fill="none" stroke="#e8b949" strokeOpacity="0.28" />
      <ellipse cx="130" cy="130" rx="112" ry="49" fill="none" stroke="#93b4ff" strokeOpacity="0.16" transform="rotate(-22 130 130)" />
      <circle cx="204" cy="83" r="3.2" fill="#e8b949" />
      <circle cx="53" cy="171" r="2.3" fill="#93b4ff" />
      <circle cx="196" cy="190" r="2" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}
