import { useState } from 'react';
import type { MissionTarget } from '../data/types';
import { useL, useT } from '../i18n';
import { AmunLogo } from './AmunLogo';

interface TargetImageProps {
  target: MissionTarget;
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}

const ART: Record<string, string> = {
  ryugu: 'ryugu',
};

/** NASA image with a designed fallback for offline use and illustrative bodies. */
export function TargetImage({ target, className = '', imageClassName = '', compact = false }: TargetImageProps) {
  const t = useT();
  const l = useL();
  const [failed, setFailed] = useState(false);
  const showArt = failed || !target.image.url || target.image.illustrative;
  const art = ART[target.id];

  return (
    <div className={`relative overflow-hidden bg-void-800 ${className}`}>
      {showArt ? (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(79,124,255,.22),transparent_62%),radial-gradient(circle_at_78%_20%,rgba(232,185,73,.14),transparent_48%)]" />
          {art === 'ryugu' ? (
            <svg viewBox="0 0 240 140" className="relative h-full w-full p-4">
              <defs>
                <linearGradient id="ryugu-body" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#8a775f" />
                  <stop offset="0.5" stopColor="#5c5040" />
                  <stop offset="1" stopColor="#2b2a26" />
                </linearGradient>
                <radialGradient id="ryugu-light" cx="0.35" cy="0.28" r="0.8">
                  <stop offset="0" stopColor="#d4b98d" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#050814" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="120" cy="74" rx="48" ry="34" fill="url(#ryugu-body)" />
              <ellipse cx="120" cy="74" rx="48" ry="34" fill="url(#ryugu-light)" />
              <path d="M90 53c15-10 43-10 59 0l-5 10c-15-7-34-7-49 1z" fill="#9c8769" opacity="0.55" />
              <circle cx="104" cy="66" r="4" fill="#27241f" opacity="0.7" />
              <circle cx="135" cy="82" r="6" fill="#27241f" opacity="0.6" />
              <circle cx="118" cy="92" r="3" fill="#27241f" opacity="0.55" />
              <ellipse cx="120" cy="75" rx="74" ry="45" fill="none" stroke="#4f7cff" strokeOpacity="0.25" strokeDasharray="3 7" />
              <circle cx="181" cy="57" r="1.8" fill="#e8b949" />
            </svg>
          ) : (
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full border border-royal-400/20" />
              <div className="absolute h-36 w-36 rounded-full border border-white/[0.06]" />
              <AmunLogo className="h-12 w-12 opacity-50" />
            </div>
          )}
        </div>
      ) : (
        <img
          src={target.image.url}
          alt={l(target.image.title ? { ar: target.image.title, en: target.image.title } : target.name)}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition duration-500 ${imageClassName}`}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void-950/85 via-void-950/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2">
        <span className="rounded-md bg-void-950/70 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300 backdrop-blur-sm">
          {target.image.credit}
        </span>
        {showArt ? (
          <span className="rounded-md border border-gold-400/30 bg-gold-500/15 px-1.5 py-0.5 text-[9px] font-bold text-gold-300 backdrop-blur-sm">
            {t('توضيح فني', 'Illustrative')}
          </span>
        ) : null}
      </div>
      {!compact ? (
        <span className="absolute inset-x-2 top-2 w-fit rounded-md bg-void-950/65 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300 backdrop-blur-sm">
          {target.image.nasaId ? `NASA ${target.image.nasaId}` : l(target.image.title ? { ar: target.image.title, en: target.image.title } : target.name)}
        </span>
      ) : null}
    </div>
  );
}
