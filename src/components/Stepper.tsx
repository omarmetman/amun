import { useEffect, useMemo, useRef, useState } from 'react';
import { STEPS } from '../data/steps';
import type { TransferType } from '../data/types';
import { useL, useLang, useT } from '../i18n';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { IconCross } from './Icons';

interface Point {
  n: number;
  x: number;
  y: number;
}

function curvePoints(
  baseline: number,
  startX: number,
  endX: number,
  arcHeight: number,
  assist: boolean,
): Point[] {
  return Array.from({ length: 11 }, (_, index) => {
    const t = index / 10;
    const bend = assist ? Math.sin(2 * Math.PI * t) * (arcHeight * 0.14) : 0;
    return {
      n: index + 1,
      x: startX + (endX - startX) * t,
      y: baseline - Math.sin(Math.PI * t) * arcHeight + bend,
    };
  });
}

function TargetGlyph({ id, x, y, r }: { id: string; x: number; y: number; r: number }) {
  const asteroids = ['bennu', 'ryugu', 'eros', 'vesta', 'ceres'];
  const comets = ['67p', 'halley', 'tempel1'];

  if (asteroids.includes(id)) {
    const s = r / 9;
    return (
      <polygon
        points={`${x - 9 * s},${y + 2 * s} ${x - 6 * s},${y - 7 * s} ${x + 2 * s},${y - 9 * s} ${x + 9 * s},${y - 2 * s} ${x + 7 * s},${y + 7 * s} ${x - 2 * s},${y + 9 * s}`}
        fill="none"
        stroke="#EDE7D8"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  if (comets.includes(id)) {
    return (
      <g stroke="#EDE7D8" fill="none" strokeWidth={1.3} vectorEffect="non-scaling-stroke">
        <circle cx={x + r * 0.35} cy={y - r * 0.3} r={r * 0.45} />
        <path d={`M${x - r * 0.05} ${y - r * 0.1}L${x - r * 1.6} ${y + r * 0.9}`} opacity="0.35" />
        <path d={`M${x + r * 0.1} ${y - r * 0.55}L${x - r * 1.4} ${y - r * 1.1}`} opacity="0.25" />
      </g>
    );
  }

  return (
    <g stroke="#EDE7D8" fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke">
      <circle cx={x} cy={y} r={r} />
      {id === 'mars' ? (
        <>
          <path d={`M${x - r * 0.78} ${y - r * 0.5}H${x + r * 0.2}`} />
          <path d={`M${x - r * 0.3} ${y + r * 0.65}H${x + r * 0.78}`} />
          <circle cx={x + r * 0.35} cy={y + r * 0.1} r={r * 0.16} />
        </>
      ) : null}
      {id === 'jupiter' ? (
        <>
          <path d={`M${x - r} ${y - r * 0.35}H${x + r}`} />
          <path d={`M${x - r * 0.9} ${y + r * 0.35}H${x + r * 0.9}`} />
        </>
      ) : null}
      {id === 'moon' ? (
        <>
          <circle cx={x - r * 0.3} cy={y - r * 0.25} r={r * 0.2} />
          <circle cx={x + r * 0.35} cy={y + r * 0.3} r={r * 0.14} />
        </>
      ) : null}
    </g>
  );
}

function Trajectory({
  step,
  allDone = false,
  variant = 'panel',
  targetId,
  transferType,
  rtl,
  onSelect,
}: {
  step: number;
  allDone?: boolean;
  variant?: 'panel' | 'hero' | 'mini';
  targetId: string;
  transferType: TransferType;
  rtl: boolean;
  onSelect?: (n: number) => void;
}) {
  const hero = variant === 'hero';
  const mini = variant === 'mini';
  const width = hero ? 520 : 320;
  const height = hero ? 200 : 104;
  const baseline = hero ? 168 : 88;
  const padStart = hero ? 34 : 22;
  const padEnd = hero ? 62 : 38;
  const startX = rtl ? width - padStart : padStart;
  const endX = rtl ? padEnd : width - padEnd;
  const arcHeight = hero ? 104 : transferType === 'hohmann' ? 58 : transferType === 'assist' ? 50 : 30;
  const assist = transferType === 'assist';
  const points = useMemo(
    () => curvePoints(baseline, startX, endX, arcHeight, assist),
    [baseline, startX, endX, arcHeight, assist],
  );

  const currentIndex = allDone ? 10 : Math.min(10, Math.max(0, step - 1));
  const completedIndex = allDone ? 10 : Math.max(0, step - 2);
  const target = points[10];
  const nodeR = hero ? 4.5 : mini ? 2.6 : 3.2;
  const currentR = hero ? 7 : mini ? 4.2 : 5.4;
  const groundLabel = hero ? 13 : mini ? 8 : 9.5;

  const line = (from: number, to: number) => {
    const slice = points.slice(from, to + 1);
    if (slice.length < 2) return '';
    return slice
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(' ');
  };

  const completedLine = allDone ? line(0, 10) : line(0, completedIndex + 1);
  const remainingLine = allDone ? '' : line(currentIndex, 10);

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`w-full ${hero ? 'h-auto' : mini ? 'h-[44px]' : 'h-auto'}`}
        aria-hidden="true"
      >
        {/* Datum and ground ticks: the path starts on a measured line. */}
        <g stroke="#1A3A85" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d={`M8 ${baseline + 5}H${width - 8}`} />
          {Array.from({ length: 17 }, (_, i) => 8 + (i * (width - 16)) / 16).map((x) => (
            <path key={x} d={`M${x} ${baseline + 5}V${baseline + (i0(x) ? 10 : 8)}`} strokeWidth="1" />
          ))}
        </g>

        <text
          x={rtl ? startX : startX}
          y={baseline + (hero ? 26 : 20)}
          textAnchor={rtl ? 'end' : 'start'}
          fill="#BDB39C"
          fontSize={groundLabel}
          fontFamily="IBM Plex Sans Arabic, IBM Plex Sans, sans-serif"
        >
          {rtl ? 'الأرض' : 'Ground'}
        </text>

        {remainingLine ? (
          <path
            d={remainingLine}
            fill="none"
            stroke="#EDE7D8"
            strokeOpacity="0.4"
            strokeWidth={hero ? 1.6 : 1.4}
            strokeDasharray="4 5"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
            style={{ animation: 'path-trace 1600ms 120ms both' }}
          />
        ) : null}

        {completedLine ? (
          <path
            d={completedLine}
            fill="none"
            stroke="#E3A92F"
            strokeWidth={hero ? 2.4 : 2}
            strokeLinecap="round"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            className="path-trace"
          />
        ) : null}

        <TargetGlyph id={targetId} x={target.x} y={target.y} r={hero ? 18 : mini ? 5 : 8} />

        {points.map((point, index) => {
          const isCurrent = !allDone && index === currentIndex;
          const isDone = index <= completedIndex;
          return (
            <g key={point.n}>
              {isCurrent ? (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={currentR + 4}
                  fill="none"
                  stroke="#E3A92F"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              <circle
                cx={point.x}
                cy={point.y}
                r={isCurrent ? currentR : nodeR}
                fill={isCurrent ? '#E3A92F' : isDone ? '#E3A92F' : '#0D1F4C'}
                stroke={isCurrent || isDone ? '#E3A92F' : '#EDE7D8'}
                strokeOpacity={isCurrent || isDone ? 1 : 0.45}
                strokeWidth={hero ? 1.4 : 1}
                vectorEffect="non-scaling-stroke"
              />
              {!hero ? (
                <text
                  x={point.x}
                  y={point.y + (isCurrent ? 17 : 15)}
                  textAnchor="middle"
                  fill={isCurrent ? '#E3A92F' : isDone ? '#EDE7D8' : '#948C79'}
                  fontSize={mini ? 6.5 : 8}
                  fontWeight={isCurrent ? 600 : 400}
                  fontFamily="IBM Plex Sans, sans-serif"
                >
                  {point.n}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* Real buttons rather than SVG hit targets, so focus, touch and
          screen readers behave normally. */}
      {onSelect ? (
        <div className="absolute inset-0">
          {points.map((point) => (
            <button
              key={point.n}
              type="button"
              onClick={() => onSelect(point.n)}
              aria-label={`${STEPS[point.n - 1].n}. ${STEPS[point.n - 1].title.ar} / ${STEPS[point.n - 1].title.en}`}
              aria-current={!allDone && point.n === step ? 'step' : undefined}
              className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-data hover:bg-limestone-100/10 focus-visible:bg-limestone-100/15"
              style={{ left: `${(point.x / width) * 100}%`, top: `${(point.y / height) * 100}%` }}
            >
              <span className="sr-only">{STEPS[point.n - 1].title.ar}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function i0(value: number) {
  return Math.round(value) % 4 === 0;
}

/** Horizontal margin ruler used by the dashboard. */
function StepSheet({
  step,
  onClose,
  onSelect,
}: {
  step: number;
  onClose: () => void;
  onSelect: (n: number) => void;
}) {
  const l = useL();
  const t = useT();
  const design = useDesign();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[75] lg:hidden">
      <button
        type="button"
        aria-label={t('إغلاق قائمة الخطوات', 'Close step list')}
        onClick={onClose}
        className="absolute inset-0 bg-lapis-950/80"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('خطوات المهمة', 'Mission steps')}
        tabIndex={-1}
        className="sheet-open absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-window border-t border-royal-600 bg-lapis-900 pb-6 outline-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-royal-700 bg-lapis-900 px-4 py-3">
          <div>
            <h2 className="font-display text-lg leading-tight">{t('خطوات المهمة', 'Mission steps')}</h2>
            <p className="text-xs text-limestone-300">
              {t(`الخطوة ${step} من 11`, `Step ${step} of 11`)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-icon" aria-label={t('إغلاق', 'Close')}>
            <IconCross className="h-4 w-4" />
          </button>
        </div>
        <ol className="px-2 py-2">
          {STEPS.map((meta) => {
            const active = step === meta.n;
            const complete = step > meta.n;
            const errors = design.issues.filter((issue) => issue.severity === 'error' && issue.step === meta.n).length;
            return (
              <li key={meta.id}>
                <button
                  type="button"
                  onClick={() => onSelect(meta.n)}
                  aria-current={active ? 'step' : undefined}
                  className={`flex w-full items-center gap-3 rounded-data px-3 py-2.5 text-start ${
                    active ? 'bg-royal-700/40' : 'hover:bg-royal-700/20'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-data border font-latin text-xs tabular-nums ${
                      active
                        ? 'border-ochre-400 bg-ochre-400 text-lapis-950'
                        : complete
                          ? 'border-ochre-400 text-ochre-400'
                          : 'border-royal-500 text-limestone-300'
                    }`}
                  >
                    {meta.n}
                  </span>
                  <span className={`min-w-0 flex-1 text-sm ${active ? 'text-limestone-50' : 'text-limestone-200'}`}>
                    {l(meta.title)}
                  </span>
                  {errors > 0 ? (
                    <span className="text-xs font-semibold text-carnelian-300" title={t('أخطاء مانعة', 'Blocking errors')}>
                      {errors}
                    </span>
                  ) : complete ? (
                    <span className="text-xs text-malachite">{t('تم', 'Done')}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function Stepper({ onNavigate, variant = 'panel' }: { onNavigate?: () => void; variant?: 'panel' | 'mini' }) {
  const l = useL();
  const lang = useLang();
  const t = useT();
  const design = useDesign();
  const step = useMissionStore((state) => state.step);
  const setStep = useMissionStore((state) => state.setStep);
  const [sheet, setSheet] = useState(false);
  const [mapKey] = useState(() => Math.random());
  const meta = STEPS[Math.min(10, Math.max(0, step - 1))];

  const go = (next: number) => {
    setStep(next);
    onNavigate?.();
    setSheet(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === 'mini') {
    return (
      <>
        <div className="border-b border-royal-700 bg-lapis-950/50 lg:hidden">
          <button
            type="button"
            onClick={() => setSheet(true)}
            aria-haspopup="dialog"
            aria-expanded={sheet}
            className="block w-full px-3 pb-1.5 pt-1 text-start"
          >
            <Trajectory
              key={mapKey}
              step={step}
              variant="mini"
              targetId={design.target.id}
              transferType={design.choices.transferType}
              rtl={lang === 'ar'}
            />
            <span className="mt-0.5 flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-xs text-limestone-200">
                <span className="font-latin tabular-nums text-ochre-400">{String(step).padStart(2, '0')}</span>
                <span className="mx-1.5 text-limestone-400">/</span>
                {l(meta.title)}
              </span>
              <span className="shrink-0 text-[11px] text-limestone-400">{t('كل الخطوات', 'All steps')}</span>
            </span>
          </button>
        </div>
        {sheet ? <StepSheet step={step} onClose={() => setSheet(false)} onSelect={go} /> : null}
      </>
    );
  }

  return (
    <nav aria-label={t('خطوات المهمة', 'Mission steps')} className="border-y border-royal-700 py-3">
      <Trajectory
        key={mapKey}
        step={step}
        targetId={design.target.id}
        transferType={design.choices.transferType}
        rtl={lang === 'ar'}
        onSelect={go}
      />
      <p className="mt-2 flex items-baseline gap-2 text-xs text-limestone-300">
        <span className="font-latin tabular-nums text-ochre-400">{String(step).padStart(2, '0')}</span>
        <span className="text-limestone-400">/ 11</span>
        <span className="min-w-0 truncate text-limestone-200">{l(meta.title)}</span>
      </p>
    </nav>
  );
}

export { Trajectory };
