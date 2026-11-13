import { LAUNCHERS } from '../data/launchers';
import { payloadCapacityAtC3 } from '../engine/orbit';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, SpecTable, Stat } from '../components/StepBits';
import { IconRocket } from '../components/Icons';

export function Step04Launch() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setChoice = useMissionStore((state) => state.setChoice);
  const capacity = design.mass.launcherCapacityKg;
  const margin = design.mass.massMargin;
  const launchShare = design.cost.totalM > 0 ? design.launcher.costM / design.cost.totalM : 0;
  const fitTone = margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : margin > 0.3 ? 'warn' : 'good';

  const launcherOptions = LAUNCHERS.map((launcher) => {
    const cap = payloadCapacityAtC3(launcher, design.orbit.c3);
    const difference = cap - design.mass.wetMassKg;
    const fits = difference >= 0;
    return {
      id: launcher.id,
      title: l(launcher.name),
      icon: <IconRocket className="h-4 w-4" />,
      note: (
        <>
          <span className="block text-[10px] text-royal-300">{launcher.country}</span>
          {l(launcher.description)}
        </>
      ),
      cells: {
        capacity: `${fmt(cap)} kg`,
        cost: fmtMoney(launcher.costM),
        reliability: fmtPct(launcher.reliability),
        fit: (
          <span className={fits ? 'text-malachite' : 'text-carnelian-300'}>
            {fits
              ? t(`فائض ${fmt(difference)}`, `${fmt(difference)} spare`)
              : t(`عجز ${fmt(Math.abs(difference))}`, `${fmt(Math.abs(difference))} short`)}
          </span>
        ),
      },
    };
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
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
        <SpecTable
          label={t('الصاروخ', 'Launcher')}
          columns={[
            { key: 'capacity', label: t('السعة', 'Capacity') },
            { key: 'cost', label: t('الكلفة', 'Cost') },
            { key: 'reliability', label: t('الموثوقية', 'Reliability') },
            { key: 'fit', label: t('الهامش', 'Fit'), numeric: false },
          ]}
          options={launcherOptions}
          selectedId={design.choices.launcherId}
          onSelect={(id) => {
            const launcher = LAUNCHERS.find((entry) => entry.id === id);
            if (launcher) setChoice('launcherId', launcher.id);
          }}
        />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-royal-700 pt-2">
          <DataSourceBadges sources={['launchApprox', 'game']} />
          <span className="text-[10px] text-limestone-400">
            {t('الجداول تقريبية ومُستوفاة بين نقاط C₃ المنشورة.', 'Tables are approximate and linearly interpolated between published C₃ points.')}
          </span>
        </div>
      </Section>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Section
          title={t('ملاءمة الصاروخ', 'Launcher fit')}
          action={
            <StatusPill tone={margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : 'good'}>
              {margin < 0 ? t('لا يتسع', 'Does not fit') : t('يتسع', 'Fits')}
            </StatusPill>
          }
        >
          <div className="border-t border-royal-700 pt-2">
            <div className="mb-1 flex items-baseline justify-between gap-2 text-[10px]">
              <span className="text-limestone-400">{t('الكتلة الرطبة مقابل السعة', 'Wet mass vs capacity')}</span>
              <span className="font-latin tabular-nums text-limestone-200" dir="ltr">
                {fmt(design.mass.wetMassKg)} / {fmt(capacity)} kg
              </span>
            </div>
            <Bar
              ratio={capacity > 0 ? design.mass.wetMassKg / capacity : 1}
              tone={margin < 0 ? 'danger' : margin < 0.1 ? 'warn' : 'good'}
            />
          </div>
          <div className="mt-2">
            <div className="table-row">
              <span className="text-xs text-limestone-300">{t('كلفة الإطلاق', 'Launch cost')}</span>
              <span className="font-latin text-xs tabular-nums text-ochre-300" dir="ltr">{fmtMoney(design.launcher.costM)}</span>
            </div>
            <div className="table-row">
              <span className="text-xs text-limestone-300">{t('نسبة من التكلفة', 'Share of total cost')}</span>
              <span className={`font-latin text-xs tabular-nums ${launchShare > 0.45 ? 'text-amber' : 'text-limestone-100'}`} dir="ltr">
                {fmtPct(launchShare)}
              </span>
            </div>
            <div className="table-row">
              <span className="text-xs text-limestone-300">{t('هامش الكتلة المتوقع', 'Expected mass margin')}</span>
              <span className={`font-latin text-xs tabular-nums ${margin < 0.1 ? 'text-amber' : 'text-malachite'}`} dir="ltr">
                {fmtPct(margin)}
              </span>
            </div>
            <div className="table-row">
              <span className="text-xs text-limestone-300">{t('طاقة الإطلاق', 'Launch energy')}</span>
              <span className="font-latin text-xs tabular-nums text-royal-200" dir="ltr">
                {fmt(design.orbit.c3, 2)} km²/s²
              </span>
            </div>
          </div>

          {margin < 0 ? (
            <InlineNote tone="danger" className="mt-3">
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
          <p className="text-xs leading-[1.8] text-limestone-300">
            {t(
              'لكل صاروخ جدول حمولة مقابل C₃. نستوفي خطيًا عند الطاقة الحالية، ثم نقارن الناتج بالكتلة الرطبة المحسوبة من معادلة الصاروخ.',
              'Each vehicle has a payload-vs-C3 table. We interpolate linearly at the current energy, then compare the result with the wet mass from the rocket equation.',
            )}
          </p>
          <div className="mt-3 border-t border-royal-700">
            <table className="w-full text-start text-[11px]">
              <thead>
                <tr className="border-b border-limestone-400/40 text-limestone-400">
                  <th className="py-1.5 pe-2 text-start font-medium">C₃ (km²/s²)</th>
                  <th className="py-1.5 ps-2 text-start font-medium">{t('الحمولة', 'Payload')} (kg)</th>
                </tr>
              </thead>
              <tbody>
                {design.launcher.payloadAtC3.map((point) => (
                  <tr
                    key={point.c3}
                    className={`border-b border-royal-700 last:border-b-0 ${
                      Math.abs(point.c3 - design.orbit.c3) < 5 ? 'bg-royal-700/40' : ''
                    }`}
                  >
                    <td className="py-1.5 pe-2 font-latin tabular-nums text-limestone-300" dir="ltr">{point.c3}</td>
                    <td className="py-1.5 ps-2 font-latin font-medium tabular-nums text-limestone-100" dir="ltr">{fmt(point.kg)}</td>
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
