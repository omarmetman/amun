import type { ReactNode } from 'react';
import { useT } from '../i18n';
import { fmt, fmtPct, fmtMoney, marginTone, type MarginTone } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { Gauge } from './Gauge';

interface Metric {
  key: string;
  label: string;
  value: string;
  marginLabel: string;
  sub: ReactNode;
  tone: MarginTone;
  ratio: number;
  step: number;
}

export function DashboardGrid({ compact = false, onJump }: { compact?: boolean; onJump?: (step: number) => void }) {
  const design = useDesign();
  const t = useT();
  const setStep = useMissionStore((state) => state.setStep);

  const modes = design.power.modes;
  const minPower = Math.min(modes.cruise.margin, modes.science.margin, modes.safe.margin);
  const worst =
    minPower === modes.cruise.margin
      ? { name: t('الإبحار', 'cruise'), data: modes.cruise }
      : minPower === modes.science.margin
        ? { name: t('العلم', 'science'), data: modes.science }
        : { name: t('آمن', 'safe'), data: modes.safe };

  const budget = design.cost.budgetM;
  const budgetMargin = budget > 0 ? design.cost.remainingM / budget : -1;

  const metrics: Metric[] = [
    {
      key: 'mass',
      label: t('كتلة الإطلاق', 'Launch mass'),
      value: `${fmt(design.mass.wetMassKg)} kg`,
      marginLabel: t(`هامش ${fmtPct(design.mass.massMargin)}`, `${fmtPct(design.mass.massMargin)} margin`),
      sub: t(
        `سعة الصاروخ ${fmt(design.mass.launcherCapacityKg)} kg`,
        `launcher capacity ${fmt(design.mass.launcherCapacityKg)} kg`,
      ),
      tone: marginTone(design.mass.massMargin),
      ratio: design.mass.massMargin / 0.4,
      step: 7,
    },
    {
      key: 'power',
      label: t('حمل الطاقة', 'Power load'),
      value: `${fmt(worst.data.loadW)} W`,
      marginLabel: t(`هامش ${fmtPct(minPower)}`, `${fmtPct(minPower)} margin`),
      sub: t(
        `أدنى نمط: ${worst.name}، توليد ${fmt(worst.data.generatedW)} W`,
        `worst mode: ${worst.name}, ${fmt(worst.data.generatedW)} W generated`,
      ),
      tone: marginTone(minPower),
      ratio: minPower / 0.4,
      step: 6,
    },
    {
      key: 'dv',
      label: t('دلتا-في المتاحة', 'Available Δv'),
      value: `${fmt(design.orbit.availableDvMS)} m/s`,
      marginLabel: t(`هامش ${fmtPct(design.orbit.dvMargin)}`, `${fmtPct(design.orbit.dvMargin)} margin`),
      sub: t(
        `المطلوب ${fmt(design.orbit.requiredDvMS)} m/s`,
        `${fmt(design.orbit.requiredDvMS)} m/s required`,
      ),
      tone: marginTone(design.orbit.dvMargin),
      ratio: design.orbit.dvMargin / 0.4,
      step: 9,
    },
    {
      key: 'budget',
      label: t('الميزانية المتبقية', 'Remaining budget'),
      value: fmtMoney(design.cost.remainingM),
      marginLabel: t(`هامش ${fmtPct(budgetMargin)}`, `${fmtPct(budgetMargin)} margin`),
      sub: t(`من ${fmtMoney(budget)}`, `of ${fmtMoney(budget)}`),
      tone: budgetMargin < 0 ? 'negative' : marginTone(budgetMargin),
      ratio: budgetMargin / 0.4,
      step: 5,
    },
  ];

  const jump = (step: number) => {
    if (onJump) onJump(step);
    else setStep(step);
  };

  return (
    <div className={compact ? 'grid grid-cols-2 gap-x-4' : 'grid gap-x-5'}>
      {metrics.map((metric, index) => (
        <Gauge
          key={metric.key}
          ratio={metric.ratio}
          tone={metric.tone}
          label={metric.label}
          value={metric.value}
          marginLabel={metric.marginLabel}
          sub={metric.sub}
          index={`0${index + 1}`}
          size={compact ? 'sm' : 'md'}
          onClick={() => jump(metric.step)}
        />
      ))}
    </div>
  );
}
