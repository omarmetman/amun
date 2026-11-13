import type { CampaignAccent, CampaignChapter } from '../data/types';

export interface AccentStyle {
  border: string;
  bg: string;
  text: string;
  soft: string;
  dot: string;
  hex: string;
}

/** Static class strings so Tailwind can see every accent at build time. */
export const CAMPAIGN_ACCENTS: Record<CampaignAccent, AccentStyle> = {
  gold: {
    border: 'border-ochre-400/60',
    bg: 'bg-ochre-400/10',
    text: 'text-ochre-200',
    soft: 'bg-royal-700/20',
    dot: 'bg-ochre-400',
    hex: '#E3A92F',
  },
  royal: {
    border: 'border-royal-400/60',
    bg: 'bg-royal-700/30',
    text: 'text-limestone-100',
    soft: 'bg-royal-700/25',
    dot: 'bg-royal-300',
    hex: '#6F8FD8',
  },
  good: {
    border: 'border-malachite/50',
    bg: 'bg-malachite/10',
    text: 'text-malachite',
    soft: 'bg-royal-700/20',
    dot: 'bg-malachite',
    hex: '#3FA878',
  },
  danger: {
    border: 'border-carnelian/50',
    bg: 'bg-carnelian/10',
    text: 'text-carnelian-300',
    soft: 'bg-royal-700/20',
    dot: 'bg-carnelian',
    hex: '#D8452F',
  },
  violet: {
    border: 'border-limestone-400/50',
    bg: 'bg-royal-700/20',
    text: 'text-limestone-200',
    soft: 'bg-royal-700/20',
    dot: 'bg-limestone-300',
    hex: '#BDB39C',
  },
  cyan: {
    border: 'border-royal-300/50',
    bg: 'bg-royal-700/25',
    text: 'text-royal-300',
    soft: 'bg-royal-700/20',
    dot: 'bg-royal-300',
    hex: '#9FB6E8',
  },
};

/** Drawn chapter marks: crescent, orbit, sample, flame, sun, crystal. */
function ChapterGlyph({ name, className = '' }: { name: string; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'square' as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === 'Moon' ? (
        <g {...common}>
          <path d="M16 4a9 9 0 1 0 4 14A9.5 9.5 0 0 1 16 4Z" />
          <circle cx="10" cy="10" r="1.4" />
        </g>
      ) : null}
      {name === 'Orbit' ? (
        <g {...common}>
          <circle cx="12" cy="12" r="3" />
          <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-28 12 12)" />
          <circle cx="18.5" cy="7" r="1.2" fill="currentColor" stroke="none" />
        </g>
      ) : null}
      {name === 'Package' ? (
        <g {...common}>
          <path d="M4 8l8-4 8 4v8l-8 4-8-4Z" />
          <path d="M4 8l8 4 8-4M12 12v8" />
        </g>
      ) : null}
      {name === 'Flame' ? (
        <g {...common}>
          <path d="M12 21c3.5 0 6-2.3 6-5.5 0-3-2-4.8-3.4-7.3-1 1.7-2 2.4-2.6 3.7C11 9 10.2 7 9.2 5 8 6.8 6 9.5 6 13.5 6 18 8.5 21 12 21Z" />
        </g>
      ) : null}
      {name === 'Sun' ? (
        <g {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
        </g>
      ) : null}
      {name === 'Gem' ? (
        <g {...common}>
          <path d="M7 3h10l4 6-9 12L3 9Z" />
          <path d="M3 9h18M9 3l-1 6 4 12 4-12-1-6" />
        </g>
      ) : null}
    </svg>
  );
}

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
  const box =
    size === 'lg' ? 'h-16 w-16' : size === 'sm' ? 'h-10 w-10' : 'h-12 w-12';
  const icon = size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-data border ${accent.border} ${accent.bg} ${box} ${className}`}
      aria-hidden="true"
    >
      <ChapterGlyph name={chapter.icon} className={`${icon} ${accent.text}`} />
      <span className="absolute -bottom-1.5 -end-1.5 bg-lapis-900 px-1 font-latin text-[10px] tabular-nums text-limestone-200">
        {String(chapter.number).padStart(2, '0')}
      </span>
    </div>
  );
}

function RatingStar({ filled, className = '' }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path
        d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6Z"
        fill={filled ? '#E3A92F' : 'none'}
        stroke={filled ? '#E3A92F' : '#948C79'}
        strokeWidth="1"
      />
    </svg>
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
  const dims = size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={label ?? `${stars} / 3`}>
      {[0, 1, 2].map((index) => (
        <RatingStar key={index} filled={index < stars} className={dims} />
      ))}
    </span>
  );
}

