import { Clock3, FlaskConical, Info, Wallet } from 'lucide-react';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, RangeControl, Stat } from '../components/StepBits';

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

  return (
    <div className="space-y-4">
      <Section
        title={t('الميزانية الكلية', 'Total budget')}
        description={t(
          'كل قرار له كلفة. الميزانية تشمل الوقود والاحتياطي، والاحتياطي ليس هدرًا: إنه يمتص تضخم التكلفة أثناء المحاكاة.',
          'Every decision has a cost. The budget includes propellant and reserve; the reserve is not waste — it absorbs cost growth during simulation.',
        )}
        action={<StatusPill tone={cost.remainingM < 0 ? 'danger' : cost.remainingM < cost.budgetM * 0.08 ? 'warn' : 'good'}>
          {cost.remainingM < 0 ? t('متجاوزة', 'Over budget') : t('داخل السقف', 'Within budget')}
        </StatusPill>}
      >
        <div className="grid items-center gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="text-[10px] font-semibold text-slate-500">{t('التكلفة الكلية', 'Total cost')}</div>
                <div className={`font-latin text-3xl font-black tabular-nums ${cost.remainingM < 0 ? 'text-danger' : 'text-white'}`}>
                  {fmtMoney(cost.totalM)}
                </div>
              </div>
              <div className="text-end">
                <div className="text-[10px] text-slate-500">{t('الميزانية المتاحة', 'Available budget')}</div>
                <div className="font-latin text-xl font-extrabold text-gold-200">{fmtMoney(cost.budgetM, 0)}</div>
              </div>
            </div>
            <Bar
              ratio={used}
              tone={used > 1 ? 'danger' : used > 0.92 ? 'warn' : 'good'}
              className="mt-3 h-3"
              aria-label={t('استهلاك الميزانية', 'Budget consumption')}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className={`font-bold ${remainingTone === 'danger' ? 'text-danger' : remainingTone === 'warn' ? 'text-warn' : 'text-good'}`}>
                {cost.remainingM >= 0
                  ? t(`${fmtMoney(cost.remainingM)} متبقية`, `${fmtMoney(cost.remainingM)} remaining`)
                  : t(`تجاوز ${fmtMoney(Math.abs(cost.remainingM))}`, `${fmtMoney(Math.abs(cost.remainingM))} over`)}
              </span>
              <span className="num text-slate-500">{fmtPct(used)} {t('مستخدمة', 'used')}</span>
            </div>

            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.03]">
              {cost.lines.map((line) => (
                <div
                  key={line.id}
                  style={{ width: `${(line.amountM / Math.max(cost.totalM, 1)) * 100}%`, backgroundColor: line.color }}
                  title={`${l(line.label)}: ${fmtMoney(line.amountM)}`}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {cost.lines.map((line) => (
                <span key={line.id} className="inline-flex items-center gap-1 text-[9px] text-slate-500">
                  <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: line.color }} />
                  {l(line.label)}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat label={t('المجموع الفرعي', 'Subtotal')} value={fmtMoney(cost.subtotalM)} hint={t('قبل الاحتياطي', 'Before reserve')} />
            <Stat label={t('الاحتياطي', 'Reserve')} value={fmtMoney(cost.reserveM)} hint={`${fmt(cost.reservePercent)}%`} tone="gold" />
            <Stat label={t('الإطلاق', 'Launch')} value={fmtMoney(cost.launchCostM)} hint={l(design.launcher.name)} />
            <Stat label={t('الوقود', 'Propellant')} value={fmtMoney(cost.propellantCostM)} hint={`${fmt(design.mass.propellantKg)} kg`} />
            <Stat
              label={t('عمليات', 'Operations')}
              value={<>{fmt(cost.opsDays)} <span className="text-[10px]">d</span></>}
              hint={`${fmt(cost.dsnHours)} DSN h`}
            />
            <Stat
              label={t('هامش الميزانية', 'Budget margin')}
              value={fmtPct(cost.budgetM > 0 ? cost.remainingM / cost.budgetM : 0)}
              tone={remainingTone}
            />
          </div>
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Section
          title={t('بنود الكلفة', 'Cost lines')}
          description={t('كل بند محسوب من الاختيارات، وليس رقمًا يدويًا.', 'Each line is computed from your choices, not entered by hand.')}
          action={<GameBadge />}
        >
          <div className="space-y-0.5">
            {cost.lines.map((line) => (
              <div key={line.id} className="table-row">
                <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: line.color }} />
                  <span className="truncate">{l(line.label)}</span>
                  {line.simplified ? <FlaskConical className="h-3 w-3 shrink-0 text-gold-300/70" aria-hidden="true" /> : null}
                </span>
                <span className="shrink-0 font-latin text-[11px] font-bold text-slate-200">{fmtMoney(line.amountM)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-xs font-bold text-white">{t('الإجمالي', 'Total')}</span>
              <span className={`font-latin text-sm font-black ${cost.remainingM < 0 ? 'text-danger' : 'text-gold-200'}`}>{fmtMoney(cost.totalM)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{t('الميزانية المتاحة', 'Budget available')}</span>
              <span className="font-latin text-[11px] font-bold text-slate-200">{fmtMoney(cost.budgetM, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{t('المتبقي', 'Remaining')}</span>
              <span className={`font-latin text-[11px] font-bold ${cost.remainingM < 0 ? 'text-danger' : 'text-good'}`}>{fmtMoney(cost.remainingM)}</span>
            </div>
          </div>
        </Section>

        <div className="space-y-4">
          <Section title={t('مدة العمليات', 'Operations duration')} action={<Clock3 className="h-4 w-4 text-royal-300" aria-hidden="true" />}>
            <RangeControl
              id="ops-days"
              label={t('أيام العمليات العلمية', 'Science operations days')}
              value={design.choices.opsDays}
              min={5}
              max={180}
              step={5}
              unit={t('يوم', 'days')}
              onChange={(value) => setChoice('opsDays', value)}
              hint={t('أيام أكثر = علم وبيانات أكثر، لكن كلفة تشغيل ووقود اتصال أكثر.', 'More days = more science and data, but higher operations and link cost.')}
            />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label={t('علم متوقع', 'Science')} value={fmt(science, 1)} hint={`×${fmt(design.science.opsFactor, 2)} ${t('مدة', 'duration')}`} />
              <Stat label={t('بيانات', 'Data')} value={`${fmt(data, 2)} GB`} hint={t('إجمالي منتج', 'Total produced')} tone="royal" />
              <Stat label={t('تكلفة العمليات', 'Ops cost')} value={fmtMoney(design.difficulty.opsCostPerDayM * design.choices.opsDays)} hint={`${fmtMoney(design.difficulty.opsCostPerDayM, 2)}/${t('يوم', 'day')}`} />
            </div>
            <InlineNote tone="royal" className="mt-3">
              {t('مدة أطول تفيد العلم فقط إذا كانت الطاقة والاتصال قادرين على استيعابها.', 'A longer duration only helps if power and communications can absorb it.')}
            </InlineNote>
          </Section>

          <Section title={t('احتياطي الميزانية', 'Budget reserve')} action={<Wallet className="h-4 w-4 text-gold-300" aria-hidden="true" />}>
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
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Stat label={t('قيمة الاحتياطي', 'Reserve value')} value={fmtMoney(cost.reserveM)} tone="gold" />
              <Stat label={t('احتياطي متبقٍ', 'Reserve left')} value={fmtMoney(cost.reserveM)} hint={t('قبل المحاكاة', 'Before simulation')} />
            </div>
            {design.choices.reservePercent < 10 ? (
              <InlineNote tone="warn" className="mt-3">
                <Info className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
                {t('احتياطي أقل من 10% يعرضك لتجاوز الميزانية عند أول حدث تكلفة.', 'A reserve below 10% risks a budget overrun on the first cost event.')}
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
