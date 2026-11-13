import {
  Check,
  Microscope,
  Orbit,
  PlayCircle,
  RadioTower,
  Rocket,
  Satellite,
  Sun,
  Target,
  Trophy,
  Wallet,
  Weight,
  type LucideIcon,
} from 'lucide-react';
import { STEPS } from '../data/steps';
import { useL } from '../i18n';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';

const ICONS: Record<string, LucideIcon> = {
  target: Target,
  satellite: Satellite,
  microscope: Microscope,
  rocket: Rocket,
  wallet: Wallet,
  sun: Sun,
  weight: Weight,
  radio: RadioTower,
  orbit: Orbit,
  play: PlayCircle,
  trophy: Trophy,
};

export function Stepper({ onNavigate }: { onNavigate?: () => void }) {
  const l = useL();
  const design = useDesign();
  const step = useMissionStore((state) => state.step);
  const setStep = useMissionStore((state) => state.setStep);

  const go = (next: number) => {
    setStep(next);
    onNavigate?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav aria-label={l({ ar: 'خطوات المهمة', en: 'Mission steps' })}>
      <ol className="relative space-y-0.5">
        {STEPS.map((meta, index) => {
          const Icon = ICONS[meta.icon] ?? Target;
          const active = step === meta.n;
          const complete = step > meta.n;
          const errors = design.issues.filter((issue) => issue.severity === 'error' && issue.step === meta.n).length;
          const warnings = design.issues.filter((issue) => issue.severity === 'warning' && issue.step === meta.n).length;
          return (
            <li key={meta.id} className="relative">
              {index < STEPS.length - 1 ? (
                <span
                  className={`absolute start-[21px] top-9 h-[calc(100%-20px)] w-px ${
                    complete ? 'bg-good/30' : 'bg-white/[0.07]'
                  }`}
                  aria-hidden="true"
                />
              ) : null}
              <button
                type="button"
                onClick={() => go(meta.n)}
                aria-current={active ? 'step' : undefined}
                className={`group flex w-full items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-start transition ${
                  active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition ${
                    active
                      ? 'border-gold-400/80 bg-gold-400 text-void-950 shadow-gold'
                      : complete
                        ? 'border-good/40 bg-good/10 text-good'
                        : 'border-white/10 bg-void-900 text-slate-400 group-hover:border-white/30'
                  }`}
                >
                  {complete ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : meta.n}
                </span>
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-gold-300' : 'text-slate-500'}`}
                  aria-hidden="true"
                />
                <span
                  className={`min-w-0 flex-1 truncate text-[12px] font-semibold ${
                    active ? 'text-white' : complete ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {l(meta.title)}
                </span>
                {errors > 0 ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-danger/15 px-1 text-[9px] font-bold text-danger" title={l({ ar: 'أخطاء مانعة', en: 'Blocking errors' })}>
                    {errors}
                  </span>
                ) : warnings > 0 ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-warn/80" title={l({ ar: 'تحذيرات', en: 'Warnings' })} />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
