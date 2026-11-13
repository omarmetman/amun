import { Check, Rocket, TriangleAlert } from 'lucide-react';
import { LAUNCHERS } from '../data/launchers';
import { payloadCapacityAtC3 } from '../engine/orbit';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, Stat } from '../components/StepBits';

export function Step04Launch() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setChoice = useMissionStore((state) => state.setChoice);
  const capacity = design.mass.launcherCapacityKg;
  const margin = design.mass.massMargin;
  const launchShare = design.cost.totalM > 0 ? design.launcher.costM / design.cost.totalM : 0;
  const fitTone = margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : margin > 0.3 ? 'warn' : 'good';

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={t('طاقة الإطلاق C₃', 'Launch energy C₃')}
          value={<>{fmt(design.orbit.c3, 2)} <span className="text-[10px]">km²/s²</span></>}
          hint={t('تأتي من المسار ونافذة الإطلاق', 'Set by trajectory and launch window')}
          tone="royal"
        />
        <Stat
          label={t('الكتلة عند الإطلاق', 'Launch mass')}
          value={<>{fmt(design.mass.wetMassKg)} <span className="text-[10px]">kg</span></>}
          hint={t('تشمل الوقود والخزان والحمولة', 'Includes propellant, tank and payload')}
        />
        <Stat
          label={t('سعة الصاروخ المختار', 'Selected capacity')}
          value={<>{fmt(capacity)} <span className="text-[10px]">kg</span></>}
          hint={l(design.launcher.name)}
          tone={margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : 'good'}
        />
        <Stat
          label={t('هامش الكتلة', 'Mass margin')}
          value={fmtPct(margin)}
          hint={t('النطاق الصحي 10–30%', 'Healthy band is 10–30%')}
          tone={fitTone}
        />
      </div>

      <Section
        title={t('اختر مركبة الإطلاق', 'Choose a launch vehicle')}
        description={t(
          'الحمولة المتاحة تتناقص مع ارتفاع C₃. الصاروخ يجب أن يحمل الكتلة الرطبة كاملة، مع هامش للنمو وتصحيح المسار.',
          'Available payload falls as C3 rises. The vehicle must carry the full wet mass with room for growth and trajectory correction.',
        )}
        action={<GameBadge />}
      >
        <div className="grid gap-2 md:grid-cols-2">
          {LAUNCHERS.map((launcher) => {
            const active = design.choices.launcherId === launcher.id;
            const cap = payloadCapacityAtC3(launcher, design.orbit.c3);
            const difference = cap - design.mass.wetMassKg;
            const fits = difference >= 0;
            const utilization = cap > 0 ? design.mass.wetMassKg / cap : 2;
            return (
              <button
                key={launcher.id}
                type="button"
                onClick={() => setChoice('launcherId', launcher.id)}
                aria-pressed={active}
                className={`selectable p-3 text-start ${active ? 'selectable-on' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-400'}`}>
                      <Rocket className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-white">{l(launcher.name)}</div>
                      <div className="text-[9px] font-semibold text-slate-500">{launcher.country}</div>
                    </div>
                  </div>
                  {active ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400 text-void-950">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 min-h-[2.4rem] text-[10px] leading-relaxed text-slate-400">{l(launcher.description)}</p>

                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400">
                    {t('سعة عند C₃', 'Capacity at C₃')}:{' '}
                    <span className="num font-bold text-slate-200">{fmt(cap)}</span> kg
                  </span>
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400">
                    {t('الكلفة', 'Cost')}: <span className="num font-bold text-gold-300">{fmtMoney(launcher.costM)}</span>
                  </span>
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400">
                    {t('موثوقية', 'Reliability')}: <span className="num font-bold text-slate-200">{fmtPct(launcher.reliability)}</span>
                  </span>
                  <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${fits ? 'bg-good/[0.06] text-good' : 'bg-danger/[0.06] text-danger'}`}>
                    {fits
                      ? t(`فائض ${fmt(difference)} كغ`, `${fmt(difference)} kg spare`)
                      : t(`عجز ${fmt(Math.abs(difference))} كغ`, `${fmt(Math.abs(difference))} kg short`)}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-[9px] text-slate-500">
                    <span>{t('استخدام السعة', 'Capacity used')}</span>
                    <span className="num">{fmtPct(utilization)}</span>
                  </div>
                  <Bar ratio={utilization} tone={!fits ? 'danger' : utilization > 0.9 ? 'warn' : 'good'} />
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <DataSourceBadges sources={['launchApprox', 'game']} />
          <span className="text-[10px] text-slate-500">
            {t('الجداول تقريبية ومُستوفاة بين نقاط C₃ المنشورة.', 'Tables are approximate and linearly interpolated between published C₃ points.')}
          </span>
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Section title={t('ملاءمة الصاروخ', 'Launcher fit')} action={<StatusPill tone={margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : 'good'}>{margin < 0 ? t('لا يتسع', 'Does not fit') : t('يتسع', 'Fits')}</StatusPill>}>
          <div className="space-y-2">
            <div>
              <div className="mb-1 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">{t('الكتلة الرطبة مقابل السعة', 'Wet mass vs capacity')}</span>
                <span className="num text-slate-300">{fmt(design.mass.wetMassKg)} / {fmt(capacity)} kg</span>
              </div>
              <Bar ratio={capacity > 0 ? design.mass.wetMassKg / capacity : 1} tone={margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : 'good'} />
            </div>
            <div className="table-row">
              <span className="text-[11px] text-slate-400">{t('كلفة الإطلاق', 'Launch cost')}</span>
              <span className="num text-[11px] font-bold text-gold-200">{fmtMoney(design.launcher.costM)}</span>
            </div>
            <div className="table-row">
              <span className="text-[11px] text-slate-400">{t('نسبة من التكلفة', 'Share of total cost')}</span>
              <span className={`num text-[11px] font-bold ${launchShare > 0.45 ? 'text-warn' : 'text-slate-200'}`}>{fmtPct(launchShare)}</span>
            </div>
            <div className="table-row">
              <span className="text-[11px] text-slate-400">{t('هامش الكتلة المتوقع', 'Expected mass margin')}</span>
              <span className={`num text-[11px] font-bold ${margin < 0.1 ? 'text-warn' : 'text-good'}`}>{fmtPct(margin)}</span>
            </div>
            <div className="table-row">
              <span className="text-[11px] text-slate-400">{t('طاقة الإطلاق', 'Launch energy')}</span>
              <span className="num text-[11px] font-bold text-royal-200">{fmt(design.orbit.c3, 2)} km²/s²</span>
            </div>
          </div>
          {margin < 0 ? (
            <InlineNote tone="danger" className="mt-3">
              <TriangleAlert className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {t('المركبة أثقل من الحمولة المتاحة. صاروخ أكبر أو تصميم أخف مطلوب قبل المحاكاة.', 'The spacecraft is heavier than available payload. A larger vehicle or lighter design is required before simulation.')}
            </InlineNote>
          ) : margin < 0.1 ? (
            <InlineNote tone="warn" className="mt-3">
              {t('الهامش ضيق. أي نمو في الكتلة أو وقود إضافي قد يخرق السعة.', 'The margin is tight. Any mass growth or extra propellant may break capacity.')}
            </InlineNote>
          ) : margin > 0.3 ? (
            <InlineNote tone="warn" className="mt-3">
              {t('فائض كبير: تدفع مقابل سعة لا تستخدمها. صاروخ أصغر قد يحرر ميزانية.', 'Large surplus: you are paying for unused capacity. A smaller vehicle could free budget.')}
            </InlineNote>
          ) : (
            <InlineNote tone="good" className="mt-3">
              {t('الهامش داخل النطاق الصحي 10–30%.', 'The margin is inside the healthy 10–30% band.')}
            </InlineNote>
          )}
        </Section>

        <Section title={t('كيف تُحسب السعة؟', 'How capacity is calculated')} action={<GameBadge />}>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {t(
              'لكل صاروخ جدول حمولة مقابل C₃. نستوفي خطيًا عند الطاقة الحالية، ثم نقارن الناتج بالكتلة الرطبة المحسوبة من معادلة الصاروخ.',
              'Each vehicle has a payload-vs-C3 table. We interpolate linearly at the current energy, then compare the result with the wet mass from the rocket equation.',
            )}
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.07]">
            <table className="w-full text-start text-[10px]">
              <thead className="bg-white/[0.04] text-slate-500">
                <tr>
                  <th className="px-2 py-1.5 text-start font-semibold">C₃ (km²/s²)</th>
                  <th className="px-2 py-1.5 text-start font-semibold">{t('الحمولة', 'Payload')} (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {design.launcher.payloadAtC3.map((point) => (
                  <tr key={point.c3} className={Math.abs(point.c3 - design.orbit.c3) < 5 ? 'bg-royal-500/[0.06]' : ''}>
                    <td className="px-2 py-1.5 font-latin text-slate-400" dir="ltr">{point.c3}</td>
                    <td className="px-2 py-1.5 font-latin font-semibold text-slate-200" dir="ltr">{fmt(point.kg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SimplifiedNote className="mt-3">
            {t(
              'هذه جداول تخطيط مبسطة وليست ضمانات إطلاق. الأداء الحقيقي يعتمد على الموقع والطقس والمسار الدقيق.',
              'These are simplified planning tables, not launch guarantees. Real performance depends on site, weather and exact trajectory.',
            )}
          </SimplifiedNote>
        </Section>
      </div>
    </div>
  );
}
