interface AmunLogoProps {
  className?: string;
  withWordmark?: boolean;
  tagline?: boolean;
}

/**
 * The crown of Amun: two tall plumes and a sun disc, drawn as flat geometry
 * with a single 1.75 stroke. No gradients, no glow, no ready-made icon.
 */
export function AmunLogo({ className = 'h-11 w-11', withWordmark = false, tagline = false }: AmunLogoProps) {
  const mark = (
    <svg viewBox="0 0 64 64" role="img" aria-label="AMUN" className={className} fill="none">
      <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
        {/* Left plume */}
        <path d="M30 53C24.5 43 21.5 29 22.5 11.5C29 21 32 37.5 34 53Z" />
        <path d="M27.5 43C29 39 30.5 35.5 32 32.5" strokeWidth="1.2" />
        {/* Right plume */}
        <path d="M34 53C39.5 43 42.5 29 41.5 11.5C35 21 32 37.5 30 53Z" />
        <path d="M36.5 43C35 39 33.5 35.5 32 32.5" strokeWidth="1.2" />
        {/* Crown base and datum line */}
        <path d="M24 53H40" />
        <path d="M21 57H43" strokeWidth="1.2" />
        <path d="M26 53V57M38 53V57" strokeWidth="1.2" />
      </g>
      {/* Sun disc */}
      <circle cx="32" cy="22.5" r="6" fill="#E3A92F" />
      <circle cx="32" cy="22.5" r="6" stroke="#0D1F4C" strokeWidth="1" />
    </svg>
  );

  if (!withWordmark && !tagline) return mark;

  return (
    <span className="inline-flex items-center gap-3">
      <span className="shrink-0 text-limestone-100">{mark}</span>
      <span className="min-w-0">
        <span className="block font-display text-lg font-semibold leading-none text-limestone-50">AMUN</span>
        {tagline ? (
          <span className="mt-1 block text-[11px] leading-snug text-limestone-300">
            مكتب تصميم المهام
          </span>
        ) : null}
      </span>
    </span>
  );
}
