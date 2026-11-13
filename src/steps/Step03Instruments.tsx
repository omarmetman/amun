import { Check, FlaskConical, Lock, Microscope, Sparkles, TriangleAlert } from 'lucide-react';
import { INSTRUMENTS, instrumentAffinity } from '../data/instruments';
import type { TargetKind } from '../data/types';
import { useL, useT } from '../i18n';
import { fmt, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, Stat } from '../components/StepBits';

const CATEGORY: Record<string, { ar: string; en: string }> = {
  imaging: { ar: 'تصوير', en: 'Imaging' },
  spectroscopy: { ar: 'تحليل طيفي', en: 'Spectroscopy' },
  geodesy: { ar: 'جيوديسيا', en: 'Geodesy' },
  fields: { ar: 'حقول', en: 'Fields' },
  geophysics: { ar: 'جيوفيزياء', en: 'Geophysics' },
  composition: { ar: 'تركيب', en: 'Composition' },
  sample: { ar: 'عينات', en: 'Sample' },
};

export function Step03Instruments() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const toggleInstrument = useMissionStore((state) => state.toggleInstrument);
  const selected = new Set(design.choices.instruments);
  const scienceRatio = design.tier.minScience > 0 ? design.science.raw / design.tier.minScience : 0;
  const payloadRatio = design.bus.payloadCapacityKg > 0 ? design.instrumentMassKg / design.bus.payloadCapacityKg : 0;
  const totalDataRate = design.instruments.reduce((sum, instrument) => sum + instrument.dataRateKbps, 0);
  const instrumentPower = design.instruments.reduce((sum, instrument) => sum + instrument.powerW, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <Stat
          label={t('الأجهزة المختارة', 'Instruments selected')}
          value={<>{design.instruments.length} <span className="text-[10px]">/ {INSTRUMENTS.length}</span></>}
          hint={t('واحد على الأقل شرط للمهمة', 'At least one is required')}
        />
        <Stat
          label={t('كتلة الحمولة', 'Payload mass')}
          value={<>{fmt(design.instrumentMassKg)} <span className="text-[10px]">kg</span></>}
          hint={t(`من ${fmt(design.bus.payloadCapacityKg)} كغ متاحة`, `of ${fmt(design.bus.payloadCapacityKg)} kg available`)}
          tone={payloadRatio > 1 ? 'danger' : payloadRatio > 0.85 ? 'warn' : 'good'}
        />
        <Stat
          label={t('العائد العلمي', 'Science output')}
          value={fmt(design.science.raw, 1)}
          hint={t(`المعيار ${design.tier.minScience} نقطة`, `Tier requires ${design.tier.minScience}`)}
          tone={scienceRatio >= 1 ? 'good' : 'warn'}
        />
        <Stat
          label={t('الطاقة العلمية', 'Science power')}
          value={<>{fmt(instrumentPower)} <span className="text-[10px]">W</span></>}
          hint={t('تُضاف إلى حمل العمليات', 'Added to the operations load')}
        />
        <Stat
          label={t('تدفق البيانات', 'Data rate')}
          value={<>{fmt(totalDataRate)} <span className="text-[10px]">kbit/s</span></>}
          hint={t(`إنتاج ≈ ${fmt(design.comms.producedGbPerDay, 2)} GB/يوم`, `≈${fmt(design.comms.producedGbPerDay, 2)} GB/day produced`)}
          tone="royal"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Section
          title={t('حزمة القياسات', 'Measurement suite')}
          description={t(
            'اختر أجهزة تناسب بيئة الهدف. معامل التوافق يضاعف قيمتها العلمية، لكن كل جهاز يضيف كتلة وطاقة وكلفة وبيانات.',
            'Choose instruments matched to the target. Affinity multiplies science value, but every instrument adds mass, power, cost and data.',
          )}
          action={<GameBadge />}
        >
          <div className="grid gap-2 md:grid-cols-2">
            {INSTRUMENTS.map((instrument) => {
              const active = selected.has(instrument.id);
              const missionLock = Boolean(
                instrument.requiresSampleReturn &&
                  (design.missionType.id !== 'sampleReturn' || !design.target.sampleReturnCapable),
              );
              const landingLock = Boolean(instrument.requiresLanding && !design.target.landingCapable);
              const locked = missionLock || landingLock;
              const affinity = instrumentAffinity(instrument, design.target.id, design.target.kind as TargetKind);
              const potential =
                instrument.scienceBase * affinity * design.missionType.scienceMultiplier * design.science.opsFactor;
              return (
                <button
                  key={instrument.id}
                  type="button"
                  onClick={() => toggleInstrument(instrument.id)}
                  disabled={locked}
                  aria-pressed={active}
                  className={`selectable p-3 text-start ${active ? 'selectable-on' : ''} ${locked ? 'cursor-not-allowed opacity-45' : ''}`}
                >
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-400'}`}>
                        <Microscope className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] font-bold text-white">{l(instrument.name)}</span>
                        <span className="text-[9px] font-semibold text-royal-300">{l(CATEGORY[instrument.category] ?? { ar: instrument.category, en: instrument.category })}</span>
                      </span>
                    </div>
                    {locked ? (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
                    ) : active ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-gold-300" aria-hidden="true" />
                    ) : null}
                  </div>
                  <p className="min-h-[2.4rem] text-[10px] leading-relaxed text-slate-400">{l(instrument.description)}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span className="chip !px-1.5 !py-0.5 !text-[9px]"><span className="num">{fmt(instrument.massKg)}</span> kg</span>
                    <span className="chip !px-1.5 !py-0.5 !text-[9px]"><span className="num">{fmt(instrument.powerW)}</span> W</span>
                    <span className="chip !px-1.5 !py-0.5 !text-[9px]"><span className="num">{fmt(instrument.dataRateKbps)}</span> kbit/s</span>
                    <span className="chip !px-1.5 !py-0.5 !text-[9px]"><span className="num">${fmt(instrument.costM)}</span>M</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold ${affinity >= 1.15 ? 'text-good' : affinity >= 0.9 ? 'text-slate-300' : 'text-warn'}`}>
                      {t('توافق', 'Affinity')} <span className="num" dir="ltr">×{fmt(affinity, 2)}</span>
                    </span>
                    <span className="text-[10px] text-gold-300">
                      <span className="num">+{fmt(potential, 1)}</span> {t('نقطة', 'pts')}
                    </span>
                  </div>
                  {locked ? (
                    <div className="mt-1.5 text-[9px] font-semibold text-warn">
                      {missionLock
                        ? t('متاح فقط في مهام إرجاع العينات على هدف مؤهل.', 'Only available on a sample-return mission to a capable target.')
                        : t('يتطلب هدفًا يمكن الهبوط عليه.', 'Requires a landing-capable target.')}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <DataSourceBadges sources={['nasaFact', 'game']} />
            <span className="text-[10px] text-slate-500">
              {t('القيم الهندسية تقديرية للفئات، والتوافق معامل لعب.', 'Engineering values are class estimates; affinity is a game coefficient.')}
            </span>
          </div>
        </Section>

        <div className="space-y-4">
          <Section title={t('الميزان العلمي', 'Science balance')} action={<StatusPill tone={scienceRatio >= 1 ? 'good' : 'warn'}>{scienceRatio >= 1 ? t('يحقق', 'Met') : t('أقل', 'Short')}</StatusPill>}>
            <div className="mb-1 flex items-end justify-between gap-2">
              <span className="font-latin text-2xl font-extrabold text-white">{fmt(design.science.raw, 1)}</span>
              <span className="text-[10px] text-slate-500">{t('من', 'of')} <span className="num">{design.tier.minScience}</span> {t('مطلوبة', 'required')}</span>
            </div>
            <Bar ratio={scienceRatio} tone={scienceRatio >= 1 ? 'good' : scienceRatio >= 0.75 ? 'warn' : 'danger'} />
            <div className="mt-3 space-y-1.5">
              <div className="table-row">
                <span className="text-[11px] text-slate-400">{t('متوسط التوافق', 'Average affinity')}</span>
                <span className={`num text-[11px] font-bold ${design.science.averageAffinity >= 1 ? 'text-good' : 'text-warn'}`}>
                  ×{fmt(design.science.averageAffinity, 2)}
                </span>
              </div>
              <div className="table-row">
                <span className="text-[11px] text-slate-400">{t('عامل مدة العمليات', 'Ops-duration factor')}</span>
                <span className="num text-[11px] font-bold text-slate-200">×{fmt(design.science.opsFactor, 2)}</span>
              </div>
              <div className="table-row">
                <span className="text-[11px] text-slate-400">{t('مضاعف نوع المهمة', 'Mission multiplier')}</span>
                <span className="num text-[11px] font-bold text-slate-200">×{fmt(design.missionType.scienceMultiplier, 2)}</span>
              </div>
              <div className="table-row">
                <span className="text-[11px] text-slate-400">{t('كتلة الحمولة', 'Payload mass')}</span>
                <span className={`num text-[11px] font-bold ${payloadRatio > 1 ? 'text-danger' : 'text-slate-200'}`}>{fmtPct(payloadRatio)}</span>
              </div>
            </div>
            <div className="mt-2">
              <Bar ratio={payloadRatio} tone={payloadRatio > 1 ? 'danger' : payloadRatio > 0.85 ? 'warn' : 'good'} />
            </div>
          </Section>

          <Section title={t('الأجهزة المختارة', 'Selected instruments')}>
            {design.instruments.length === 0 ? (
              <InlineNote tone="danger">
                <TriangleAlert className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
                {t('لا توجد أجهزة. المهمة لن تنتج علمًا ولن تُقبل المحاكاة.', 'No instruments. The mission produces no science and cannot be simulated.')}
              </InlineNote>
            ) : (
              <div className="space-y-1.5">
                {design.instruments.map((instrument) => {
                  const entry = design.science.byInstrument.find((item) => item.id === instrument.id);
                  return (
                    <div key={instrument.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-void-900/40 px-2 py-1.5">
                      <span className="min-w-0 truncate text-[10px] font-semibold text-slate-300">{l(instrument.name)}</span>
                      <span className="shrink-0 font-latin text-[10px] font-bold text-gold-300">+{fmt(entry?.value ?? 0, 1)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-royal-400/15 bg-royal-500/[0.05] px-3 py-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-royal-200">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t('نصيحة', 'Tip')}
              </span>
              <span className="text-[10px] text-slate-400">
                {t('أضف جهازًا واحدًا عالي التوافق أفضل من ثلاثة ضعيفة.', 'One high-affinity instrument beats three weak ones.')}
              </span>
            </div>
          </Section>

          <SimplifiedNote>
            {t(
              'الكتلة والطاقة ومعدلات البيانات تقديرات لفئات الأجهزة. الاستشعار الحقيقي يعتمد على تصميم الجهاز نفسه.',
              'Mass, power and data rates are class estimates. Real sensing depends on the instrument’s detailed design.',
            )}
          </SimplifiedNote>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <FlaskConical className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
            {t('كل جهاز يستهلك جزءًا من الكتلة والطاقة والاتصال.', 'Every instrument consumes part of the mass, power and link budget.')}
          </div>
        </div>
      </div>
    </div>
  );
}
