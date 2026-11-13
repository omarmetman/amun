import { useState } from 'react';
import type { MissionTarget } from '../data/types';
import { useL, useT } from '../i18n';
import { AmunLogo } from './AmunLogo';
import { IconAlert } from './Icons';

interface TargetImageProps {
  target: MissionTarget;
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}

const ART: Record<string, string> = {
  ryugu: 'ryugu',
};

/** NASA image with a drawn, flat fallback for offline use and illustrative bodies. */
export function TargetImage({ target, className = '', imageClassName = '', compact = false }: TargetImageProps) {
  const t = useT();
  const l = useL();
  const [failed, setFailed] = useState(false);
  const showArt = failed || !target.image.url || target.image.illustrative;
  const art = ART[target.id];

  return (
    <div className={`relative overflow-hidden bg-lapis-800 ${className}`}>
      {showArt ? (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {art === 'ryugu' ? (
            <svg viewBox="0 0 240 140" className="h-full w-full">
              <rect width="240" height="140" fill="#12295F" />
              <ellipse cx="120" cy="72" rx="48" ry="33" fill="#5C5040" />
              <path d="M90 53c15-10 43-10 59 0l-5 10c-15-7-34-7-49 1z" fill="#8A775F" />
              <circle cx="104" cy="66" r="4" fill="#2B2A26" />
              <circle cx="135" cy="82" r="6" fill="#2B2A26" />
              <circle cx="118" cy="92" r="3" fill="#2B2A26" />
              <path d="M56 72h10M174 72h10M120 26v8M120 110v8" stroke="#948C79" strokeWidth="1" />
            </svg>
          ) : (
            <div className="flex flex-col items-center gap-2 text-royal-300">
              <AmunLogo className="h-10 w-10" />
              <span className="text-[10px] text-limestone-400">
                {t('لا توجد صورة في اللقطة', 'No image in the snapshot')}
              </span>
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
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-royal-600 bg-lapis-950/90 px-2 py-1">
        <span className="min-w-0 truncate text-[10px] text-limestone-300" title={target.image.credit}>
          {target.image.credit}
        </span>
        {showArt ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-ochre-300">
            <IconAlert className="h-3 w-3" />
            {t('توضيح فني', 'Illustrative')}
          </span>
        ) : null}
      </div>

      {!compact ? (
        <span className="absolute inset-x-2 top-2 w-fit border border-royal-600 bg-lapis-950/90 px-1.5 py-0.5 font-latin text-[10px] text-limestone-200" dir="ltr">
          {target.image.nasaId ? `NASA ${target.image.nasaId}` : l(target.image.title ? { ar: target.image.title, en: target.image.title } : target.name)}
        </span>
      ) : null}
    </div>
  );
}
