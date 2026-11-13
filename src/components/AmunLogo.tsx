import { useId } from 'react';

interface AmunLogoProps {
  className?: string;
  withWordmark?: boolean;
  tagline?: boolean;
}

/** Two-feather mark of Amun, drawn as a compact SVG for every screen size. */
export function AmunLogo({ className = 'h-11 w-11', withWordmark = false, tagline = false }: AmunLogoProps) {
  const id = useId().replace(/:/g, '');
  const gradient = `amun-g-${id}`;

  const mark = (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="AMUN"
      className={className}
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#93b4ff" />
          <stop offset="0.55" stopColor="#4f7cff" />
          <stop offset="1" stopColor="#e8b949" />
        </linearGradient>
        <radialGradient id={`${gradient}-glow`} cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#3560e0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#050814" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30.5" fill="#070b1a" stroke="rgba(147,180,255,.22)" />
      <circle cx="32" cy="32" r="30" fill={`url(#${gradient}-glow)`} />
      <ellipse cx="32" cy="35" rx="24" ry="9.5" fill="none" stroke="#4f7cff" strokeOpacity="0.35" strokeWidth="1.1" transform="rotate(-24 32 35)" />
      <circle cx="51" cy="22" r="1.7" fill="#e8b949" />
      <circle cx="12" cy="41" r="1.2" fill="#93b4ff" />
      <path d="M32 55V23" stroke={`url(#${gradient})`} strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M31 23C19 19 13.5 10.5 13.5 5.5c8.5 0 16.2 5.4 18.5 15"
        fill="none"
        stroke={`url(#${gradient})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 23c12-4 17.5-12.5 17.5-17.5-8.5 0-16.2 5.4-18.5 15"
        fill="none"
        stroke={`url(#${gradient})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 40c-8.5-2-12.5-7.5-12.5-11.5 6.3 0 10.5 4.4 12.5 9.5M32 40c8.5-2 12.5-7.5 12.5-11.5-6.3 0-10.5 4.4-12.5 9.5"
        fill="none"
        stroke="#4f7cff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
    </svg>
  );

  if (!withWordmark) return mark;

  return (
    <div className="flex items-center gap-3">
      {mark}
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-latin text-xl font-extrabold tracking-[0.24em] text-white">AMUN</span>
          <span className="text-lg font-bold text-gold-300">آمون</span>
        </div>
        {tagline ? (
          <p className="text-[10px] font-semibold tracking-wide text-slate-400">
            مصمم المهام الفضائية · Mission Designer
          </p>
        ) : null}
      </div>
    </div>
  );
}
