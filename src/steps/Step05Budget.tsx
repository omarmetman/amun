import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, RangeControl, Stat } from '../components/StepBits';
import { IconAlert, IconClock, IconFlask, IconWallet } from '../components/Icons';

/* Section colours are assigned by the drawing, not read from the engine. */
const LINE_PIGMENT = [
  '#E3A92F',
  '#3FA878',
  '#6F8FD8',
  '#EDE7D8',
  '#F28C28',
  '#D8452F',
  '#BDB39C',
  '#9FB6E8',
  '#C48F1F',
  '#948C79',
  '#F3D08A',
];

export function Step05Budget() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setChoice = useMissionStore((state) => state.setChoice);
  const cost = design.cost;
  const used = cost.budgetM > 0 ? cost.totalM / cost.budgetM : 1;
  const remainingTone = cost.remainingM < 0 ? 'danger' : used > 0.92 ? 'warn' : 'good';
  const science = design.science.raw;
  const data = design.comms.producedTotalGb;
  const totalForShares = Math.max(cost.totalM, 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-5 sm:grid-cols-4">
        <Stat
          label={t('التكلفة الكلية', 'Total cost')}
          value={fmtMoney(cost.totalM)}
          hint={t('كل البنود قبل الاحتياطي', 'All lines before reserve')}
          tone={cost.remainingM < 0 ? 'danger' : 'default'}
        />
        <Stat
          label={t('الميزانية المتاحة', 'Available budget')}
          value={fmtMoney(cost.budgetM, 0)}
          hint={l(design.difficulty.name)}
          tone="gold"
        />
        <Stat
          label={t('المتبقي', 'Remaining')}
          value={fmtMoney(cost.remainingM)}
          hint={cost.remainingM < 0 ? t('تجاوز السقف', 'Over the ceiling') : t('داخل السقف', 'Within the ceiling')}
          tone={remainingTone}
        />
        <Stat
          label={t('المستخدم من الميزانية', 'Budget used')}
          value={fmtPct(used)}
          hint={t('السقف 100%', 'The ceiling is 100%')}
          tone={remainingTone}
        />
      </div>

      <Section
        title={t('الميزانية الكلية', 'Total budget')}
        description={t(
          'كل قرار له كلفة. الميزانية تشمل الوقود والاحتياطي، والاحتياطي ليس هدرًا: إنه يمتص تضخم التكلفة أثناء المحاكاة.',
          'Every decision has a cost. The budget includes propellant and reserve; the reserve is not waste, it absorbs cost growth during simulation.',
        )}
        action={
          <StatusPill tone={cost.remainingM < 0 ? 'danger' : cost.remainingM < cost.budgetM * 0.08 ? 'warn' : 'good'}>
            {cost.remainingM < 0 ? t('متجاوزة', 'Over budget') : t('داخل السقف', 'Within budget')}
          </StatusPill>
        }
      >
        <Bar
          ratio={used}
          tone={used > 1 ? 'danger' : used > 0.92 ? 'warn' : 'good'}
          className="h-2.5"
          aria-label={t('استهلاك الميزانية', 'Budget consumption')}
        />

        <div className="mt-3 flex h-2.5 w-full overflow-hidden border border-royal-700" aria-hidden="true">
          {cost.lines.map((line, index) => (
            <div
              key={line.id}
              style={{
                width: `${(line.amountM / totalForShares) * 100}%`,
                backgroundColor: LINE_PIGMENT[index % LINE_PIGMENT.length],
              }}
              title={`${l(line.label)}: ${fmtMoney(line.amountM)}`}
            />
          ))}
        </div>

        <dl className="mt-3 grid gap-x-6 border-t border-royal-700 sm:grid-cols-2">
          {cost.lines.map((line, index) => (
            <div
              key={line.id}
              className="flex items-baseline justify-between gap-3 border-b border-royal-700 py-1.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
            >
              <dt className="flex min-w-0 items-baseline gap-2 text-xs text-limestone-200">
                <span
                  className="h-2 w-2 shrink-0 self-center"
                  style={{ backgroundColor: LINE_PIGMENT[index % LINE_PIGMENT.length] }}
                  aria-hidden="true"
                />
                <span className="truncate">{l(line.label)}</span>
                {line.simplified ? (
                  <IconFlask className="h-3.5 w-3.5 shrink-0 self-center text-ochre-300" />
                ) : null}
              </dt>
              <dd className="shrink-0 font-latin text-xs tabular-nums text-limestone-100" dir="ltr">
                {fmtMoney(line.amountM)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
          <div className="flex items-baseline justify-between gap-3 border-t border-royal-700 pt-2">
            <span className="text-sm text-limestone-50">{t('الإجمالي', 'Total')}</span>
            <span className={`font-latin text-base tabular-nums ${cost.remainingM < 0 ? 'text-carnelian-300' : 'text-ochre-300'}`} dir="ltr">
              {fmtMoney(cost.totalM)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-royal-700 pt-2">
            <span className="text-sm text-limestone-200">{t('الميزانية المتاحة', 'Budget available')}</span>
            <span className="font-latin text-base tabular-nums text-limestone-50" dir="ltr">
              {fmtMoney(cost.budgetM, 0)}
            </span>
          </div>
        </div>
      </Section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Section
          title={t('بنود الكلفة', 'Cost lines')}
          description={t('كل بند محسوب من الاختيارات، وليس رقمًا يدويًا.', 'Each line is computed from your choices, not entered by hand.')}
          action={<GameBadge />}
        >
          <div>
            {[
              { label: t('المجموع الفرعي', 'Subtotal'), value: fmtMoney(cost.subtotalM), hint: t('قبل الاحتياطي', 'Before reserve') },
              { label: t('الاحتياطي', 'Reserve'), value: fmtMoney(cost.reserveM), hint: `${fmt(cost.reservePercent)}%` },
              { label: t('الإطلاق', 'Launch'), value: fmtMoney(cost.launchCostM), hint: l(design.launcher.name) },
              { label: t('الوقود', 'Propellant'), value: fmtMoney(cost.propellantCostM), hint: `${fmt(design.mass.propellantKg)} kg` },
              { label: t('العمليات', 'Operations'), value: fmtMoney(design.difficulty.opsCostPerDayM * design.choices.opsDays), hint: `${fmt(cost.opsDays)} ${t('يوم', 'days')}` },
              { label: t('وقت الشبكة', 'Network time'), value: fmtMoney(cost.dsnHours * design.ground.costPerHourM), hint: `${fmt(cost.dsnHours)} DSN h` },
            ].map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-royal-700 py-2">
                <span className="text-sm text-limestone-200">{row.label}</span>
                <span className="min-w-0 text-end">
                  <span className="block font-latin text-sm tabular-nums text-limestone-100" dir="ltr">
                    {row.value}
                  </span>
                  <span className="block text-[11px] text-limestone-400">{row.hint}</span>
                </span>
              </div>
            ))}
          </div>
          <InlineNote tone={remainingTone} className="mt-3">
            {cost.remainingM >= 0
              ? t(
                  `${fmtMoney(cost.remainingM)} متبقية من السقف. الاحتياطي يغطي أول حدث تكلفة.`,
                  `${fmtMoney(cost.remainingM)} remains under the ceiling. The reserve covers the first cost event.`,
                )
              : t(
                  `تجاوز ${fmtMoney(Math.abs(cost.remainingM))}. خفّض المنصة أو الأجهزة أو مدة العمليات.`,
                  `${fmtMoney(Math.abs(cost.remainingM))} over. Reduce the bus, instruments or operations duration.`,
                )}
          </InlineNote>
        </Section>

        <div className="space-y-5">
          <Section title={t('مدة العمليات', 'Operations duration')} action={<IconClock className="h-5 w-5 text-royal-300" />}>
            <RangeControl
              id="ops-days"
              label={t('أيام العمليات العلمية', 'Science operations days')}
              value={design.choices.opsDays}
              min={5}
              max={180}
              step={5}
              unit={t('يوم', 'days')}
              onChange={(value) => setChoice('opsDays', value)}
              hint={t(
                'أيام أكثر = علم وبيانات أكثر، لكن كلفة تشغيل ووقود اتصال أكثر.',
                'More days = more science and data, but higher operations and link cost.',
              )}
            />
            <div className="mt-3 grid grid-cols-3 gap-x-4">
              <Stat label={t('علم متوقع', 'Science')} value={fmt(science, 1)} hint={`×${fmt(design.science.opsFactor, 2)}`} />
              <Stat label={t('بيانات', 'Data')} value={`${fmt(data, 2)}`} hint="GB" tone="royal" />
              <Stat
                label={t('تكلفة العمليات', 'Ops cost')}
                value={fmtMoney(design.difficulty.opsCostPerDayM * design.choices.opsDays)}
                hint={`${fmtMoney(design.difficulty.opsCostPerDayM, 2)}/${t('يوم', 'day')}`}
              />
            </div>
            <InlineNote tone="royal" className="mt-3">
              {t(
                'مدة أطول تفيد العلم فقط إذا كانت الطاقة والاتصال قادرين على استيعابها.',
                'A longer duration only helps if power and communications can absorb it.',
              )}
            </InlineNote>
          </Section>

          <Section title={t('احتياطي الميزانية', 'Budget reserve')} action={<IconWallet className="h-5 w-5 text-ochre-300" />}>
            <RangeControl
              id="reserve"
              label={t('نسبة الاحتياطي', 'Reserve percentage')}
              value={design.choices.reservePercent}
              min={0}
              max={40}
              step={1}
              unit="%"
              onChange={(value) => setChoice('reservePercent', value)}
              hint={t('10–20% يغطي تضخم التكلفة دون تضخيم الإجمالي.', '10–20% covers cost growth without inflating the total.')}
            />
            <div className="mt-3 grid grid-cols-2 gap-x-4">
              <Stat label={t('قيمة الاحتياطي', 'Reserve value')} value={fmtMoney(cost.reserveM)} tone="gold" />
              <Stat
                label={t('الاحتياطي كنسبة', 'Reserve share')}
                value={fmtPct(cost.totalM > 0 ? cost.reserveM / cost.totalM : 0)}
                hint={t('من التكلفة الكلية', 'of the total cost')}
              />
            </div>
            {design.choices.reservePercent < 10 ? (
              <InlineNote tone="warn" className="mt-3">
                <IconAlert className="me-1 inline h-3.5 w-3.5" />
                {t(
                  'احتياطي أقل من 10% يعرضك لتجاوز الميزانية عند أول حدث تكلفة.',
                  'A reserve below 10% risks a budget overrun on the first cost event.',
                )}
              </InlineNote>
            ) : (
              <InlineNote tone="good" className="mt-3">
                {t('الاحتياطي الحالي يمكنه استيعاب صدمة تكلفة معقولة.', 'The current reserve can absorb a reasonable cost shock.')}
              </InlineNote>
            )}
          </Section>

          <SimplifiedNote>
            {t(
              'بنود الكلفة تقديرات تخطيطية بملايين الدولارات. الأرقام الحقيقية تتغير مع العقود والسوق والجدول.',
              'Cost lines are planning estimates in millions of dollars. Real numbers vary with contracts, market and schedule.',
            )}
          </SimplifiedNote>
        </div>
      </div>
    </div>
  );
}
