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

/**
 * Real mission photograph with a credit bar that sits beside the frame rather
 * than on top of it, so full-disc worlds are never cropped or covered.
 */
export function TargetImage({ target, className = '', imageClassName = '', compact = false }: TargetImageProps) {
  const t = useT();
  const l = useL();
  const [failed, setFailed] = useState(false);
  const showArt = failed || !target.image.url || target.image.illustrative;
  const source = target.image.source;

  return (
    <div className={`flex flex-col overflow-hidden bg-lapis-800 ${className}`}>
      <div className="relative min-h-0 flex-1 bg-lapis-950">
        {showArt ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-royal-300" aria-hidden="true">
            <AmunLogo className={compact ? 'h-8 w-8' : 'h-12 w-12'} />
            <span className="px-2 text-center text-[10px] text-limestone-400">
              {t('لا توجد صورة متاحة', 'Image unavailable')}
            </span>
          </div>
        ) : (
          <img
            src={target.image.url}
            alt={`${l(target.name)} — ${target.image.title}`}
            loading={compact ? 'lazy' : 'eager'}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-contain p-1.5 sm:p-2 ${imageClassName}`}
          />
        )}

        {!compact && source ? (
          <span
            className="absolute start-2 top-2 inline-flex items-center gap-1 border border-royal-600 bg-lapis-950/85 px-1.5 py-0.5 font-latin text-[10px] tracking-wide text-limestone-200"
            dir="ltr"
          >
            {source}
            {target.image.nasaId ? <span className="text-limestone-400">{target.image.nasaId}</span> : null}
          </span>
        ) : null}

        {showArt ? (
          <span className="absolute end-2 top-2 inline-flex items-center gap-1 border border-royal-600 bg-lapis-950/85 px-1.5 py-0.5 text-[10px] text-ochre-300">
            <IconAlert className="h-3 w-3" />
            {t('توضيح فني', 'Illustrative')}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-royal-600 bg-lapis-900/95 px-2 py-1">
        <span
          className={`min-w-0 truncate ${compact ? 'text-[9px]' : 'text-[10px]'} text-limestone-300`}
          title={`${target.image.title} — ${target.image.credit}`}
        >
          {target.image.credit}
        </span>
        {!compact && source ? (
          <span className="shrink-0 font-latin text-[9px] uppercase tracking-wider text-limestone-400" dir="ltr">
            {target.image.nasaId ?? source}
          </span>
        ) : null}
      </div>
    </div>
  );
}
