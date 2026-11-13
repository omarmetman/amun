import type { ReactNode } from 'react';
import { Orbit, Wallet, Weight, Zap } from 'lucide-react';
import { useT } from '../i18n';
import { fmt, fmtPct, fmtMoney, marginTone, type MarginTone } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { Gauge } from './Gauge';

interface Metric {
  key: string;
  label: string;
  value: string;
  sub: ReactNode;
  tone: MarginTone;
  ratio: number;
  icon: ReactNode;
  step: number;
}

export function DashboardGrid({ compact = false, onJump }: { compact?: boolean; onJump?: (step: number) => void }) {
  const design = useDesign();
  const t = useT();
  const setStep = useMissionStore((state) => state.setStep);

  const minPower = Math.min(
    design.power.modes.cruise.margin,
    design.power.modes.science.margin,
    design.power.modes.safe.margin,
  );
  const worstMode =
    minPower === design.power.modes.cruise.margin
      ? t('الإبحار', 'cruise')
      : minPower === design.power.modes.science.margin
        ? t('العلم', 'science')
        : t('آمن', 'safe');
  const used = design.cost.budgetM > 0 ? design.cost.totalM / design.cost.budgetM : 1;

  const metrics: Metric[] = [
    {
      key: 'mass',
      label: t('هامش الكتلة', 'Mass margin'),
      value: fmtPct(design.mass.massMargin),
      sub: (
        <span dir="ltr" className="font-latin">
          {fmt(design.mass.wetMassKg)} / {fmt(design.mass.launcherCapacityKg)} kg
        </span>
      ),
      tone: marginTone(design.mass.massMargin),
      ratio: Math.min(1, Math.max(0, design.mass.massMargin / 0.4)),
      icon: <Weight className="h-4 w-4" aria-hidden="true" />,
      step: 7,
    },
    {
      key: 'power',
      label: t('هامش الطاقة', 'Power margin'),
      value: fmtPct(minPower),
      sub: t(`أدنى نمط: ${worstMode}`, `worst mode: ${worstMode}`),
      tone: marginTone(minPower),
      ratio: Math.min(1, Math.max(0, minPower / 0.4)),
      icon: <Zap className="h-4 w-4" aria-hidden="true" />,
      step: 6,
    },
    {
      key: 'dv',
      label: t('هامش Δv', 'Δv margin'),
      value: fmtPct(design.orbit.dvMargin),
      sub: (
        <span dir="ltr" className="font-latin">
          {fmt(design.orbit.availableDvMS)} / {fmt(design.orbit.requiredDvMS)} m/s
        </span>
      ),
      tone: marginTone(design.orbit.dvMargin),
      ratio: Math.min(1, Math.max(0, design.orbit.dvMargin / 0.4)),
      icon: <Orbit className="h-4 w-4" aria-hidden="true" />,
      step: 9,
    },
    {
      key: 'budget',
      label: t('الميزانية', 'Budget'),
      value: fmtPct(used),
      sub: t(`${fmtMoney(design.cost.remainingM)} متبقٍ`, `${fmtMoney(design.cost.remainingM)} left`),
      tone: used > 1 ? 'negative' : used > 0.92 ? 'low' : 'ideal',
      ratio: Math.min(1, Math.max(0, used)),
      icon: <Wallet className="h-4 w-4" aria-hidden="true" />,
      step: 5,
    },
  ];

  const jump = (step: number) => {
    if (onJump) onJump(step);
    else setStep(step);
  };

  return (
    <div className={compact ? 'grid grid-cols-2 gap-2' : 'grid gap-2 sm:grid-cols-2'}>
      {metrics.map((metric) => (
        <Gauge
          key={metric.key}
          ratio={metric.ratio}
          tone={metric.tone}
          label={metric.label}
          value={metric.value}
          sub={metric.sub}
          icon={metric.icon}
          size={compact ? 'sm' : 'md'}
          onClick={() => jump(metric.step)}
        />
      ))}
    </div>
  );
}
