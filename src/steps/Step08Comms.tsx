import { Check, Database, RadioTower, SatelliteDish, TriangleAlert } from 'lucide-react';
import { ANTENNAS, GROUND_STATIONS } from '../data/comms';
import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { DataSourceBadges, FormulaBadge, GameBadge, SimplifiedNote, StatusPill } from '../components/Badges';
import { Section } from '../components/StepShell';
import { Bar, InlineNote, RangeControl, Stat } from '../components/StepBits';

export function Step08Comms() {
  const design = useDesign();
  const l = useL();
  const t = useT();
  const setComms = useMissionStore((state) => state.setComms);
  const comms = design.comms;
  const delivered = comms.producedTotalGb > 0 ? comms.sentTotalGb / comms.producedTotalGb : 1;
  const lost = comms.lostTotalGb > 0.05;
  const memoryRatio = comms.producedTotalGb > 0 ? comms.memoryGb / Math.max(comms.producedTotalGb, 0.01) : 0;
  const dsnCost = design.ground.costPerHourM * comms.linkHoursPerDay * design.choices.opsDays;

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={t('معدل الإرسال', 'Downlink rate')}
          value={<>{fmt(comms.dataRateKbps, 1)} <span className="text-[10px]">kbit/s</span></>}
          hint={`${fmt(comms.distanceAU, 3)} AU ${t('إلى الأرض', 'to Earth')}`}
          tone={comms.dataRateKbps < 1 ? 'danger' : 'royal'}
        />
        <Stat
          label={t('ساعات الاتصال', 'Link hours')}
          value={<>{fmt(comms.linkHoursPerDay, 1)} <span className="text-[10px]">h/${t('يوم', 'day')}</span></>}
          hint={l(design.ground.name)}
        />
        <Stat
          label={t('البيانات المنتجة', 'Data produced')}
          value={<>{fmt(comms.producedTotalGb, 2)} <span className="text-[10px]">GB</span></>}
          hint={`${fmt(comms.producedGbPerDay, 2)} GB/${t('يوم', 'day')}`}
          tone="gold"
        />
        <Stat
          label={t('البيانات المرسلة', 'Data returned')}
          value={<>{fmt(comms.sentTotalGb, 2)} <span className="text-[10px]">GB</span></>}
          hint={lost ? `${fmt(comms.lostTotalGb, 2)} GB ${t('مفقودة', 'lost')}` : t('كل البيانات تصل', 'All data arrives')}
          tone={lost ? 'warn' : 'good'}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Section
          title={t('هوائي المركبة', 'Spacecraft antenna')}
          description={t(
            'قطر الهوائي يرفع الكسب تربيعيًا، لكنه يضيف كتلة. الهوائي الصغير قد يمنع إرسال بيانات كافية من مسافة بعيدة.',
            'Antenna diameter raises gain quadratically but adds mass. A small dish may fail to return enough data from a distant target.',
          )}
          action={<GameBadge />}
        >
          <div className="space-y-2">
            {ANTENNAS.map((antenna) => {
              const active = design.choices.comms.antennaId === antenna.id;
              return (
                <button
                  key={antenna.id}
                  type="button"
                  onClick={() => setComms({ antennaId: antenna.id })}
                  aria-pressed={active}
                  className={`selectable flex w-full items-start gap-3 p-3 text-start ${active ? 'selectable-on' : ''}`}
                >
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.05] text-slate-400'}`}>
                    <SatelliteDish className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{l(antenna.name)}</span>
                      <span className="font-latin text-[10px] font-bold text-gold-300">{fmt(antenna.diameterM, 1)} m</span>
                    </span>
                    <span className="mt-1 block text-[10px] leading-relaxed text-slate-400">{l(antenna.description)}</span>
                    <span className="mt-1.5 flex gap-1">
                      <span className="chip !px-2 !py-0.5 !text-[9px]">{fmt(antenna.massKg)} kg</span>
                      <span className="chip !px-2 !py-0.5 !text-[9px]">{fmtMoney(antenna.costM)}</span>
                    </span>
                  </span>
                  {active ? <Check className="mt-1 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <div className="mb-1.5 text-[10px] font-bold text-slate-400">{t('النطاق', 'Band')}</div>
            <div className="grid grid-cols-2 gap-2">
              {(['X', 'Ka'] as const).map((band) => {
                const active = design.choices.comms.band === band;
                return (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setComms({ band })}
                    aria-pressed={active}
                    className={`rounded-xl border px-3 py-2 text-start transition ${active ? 'border-gold-400/60 bg-gold-400/[0.08]' : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-latin text-sm font-black text-white">{band}</span>
                      {active ? <Check className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" /> : null}
                    </div>
                    <div className="mt-0.5 text-[9px] text-slate-500">
                      {band === 'Ka' ? t('كسب أعلى، كلفة أعلى', 'Higher gain, higher cost') : t('النطاق القياسي', 'The standard band')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <RangeControl
              id="tx-power"
              label={t('قدرة الإرسال', 'Transmit power')}
              value={design.choices.comms.txPowerW}
              min={10}
              max={200}
              step={5}
              unit="W"
              onChange={(value) => setComms({ txPowerW: value })}
              hint={t('قدرة أعلى ترفع المعدل، لكنها تستهلك طاقة المركبة.', 'More power raises the rate but draws more spacecraft power.')}
            />
          </div>
        </Section>

        <div className="space-y-4">
          <Section title={t('محطة الأرض', 'Ground station')} action={<RadioTower className="h-4 w-4 text-royal-300" aria-hidden="true" />}>
            <div className="grid gap-2 sm:grid-cols-2">
              {GROUND_STATIONS.map((station) => {
                const active = design.choices.comms.groundStation === station.id;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => setComms({ groundStation: station.id })}
                    aria-pressed={active}
                    className={`selectable p-2.5 text-start ${active ? 'selectable-on' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-white">{l(station.name)}</span>
                      {active ? <Check className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" /> : null}
                    </div>
                    <div className="mt-1 text-[10px] leading-relaxed text-slate-400">{l(station.description)}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="chip !px-1.5 !py-0.5 !text-[9px]">×{fmt(station.gainFactor, 1)}</span>
                      <span className="chip !px-1.5 !py-0.5 !text-[9px]">{fmt(station.linkHoursPerDay)} h/{t('يوم', 'day')}</span>
                      <span className="chip !px-1.5 !py-0.5 !text-[9px]">{fmtMoney(station.costPerHourM, 2)}/h</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.07] bg-void-900/40 px-3 py-2">
              <span className="text-[10px] text-slate-400">{t('كلفة وقت DSN', 'DSN time cost')}</span>
              <span className="font-latin text-[11px] font-bold text-gold-200">{fmtMoney(dsnCost)}</span>
            </div>
          </Section>

          <Section title={t('ميزان البيانات', 'Data balance')} action={<StatusPill tone={lost ? 'warn' : 'good'}>{lost ? t('فقدان', 'Loss') : t('مكتمل', 'Complete')}</StatusPill>}>
            <div className="mb-1 flex items-end justify-between gap-2">
              <span className="font-latin text-lg font-extrabold text-white">{fmt(comms.sentTotalGb, 2)} <span className="text-[10px] text-slate-500">GB</span></span>
              <span className="text-[10px] text-slate-500">{t('من', 'of')} <span className="num">{fmt(comms.producedTotalGb, 2)}</span> GB</span>
            </div>
            <Bar ratio={delivered} tone={lost ? 'warn' : 'good'} className="h-3" />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Stat label={t('معدل الإنتاج اليومي', 'Produced per day')} value={<>{fmt(comms.producedGbPerDay, 2)} <span className="text-[10px]">GB</span></>} />
              <Stat label={t('معدل الإرسال اليومي', 'Downlink per day')} value={<>{fmt(comms.downlinkGbPerDay, 2)} <span className="text-[10px]">GB</span></>} tone="royal" />
              <Stat label={t('الذاكرة', 'Memory')} value={<>{fmt(comms.memoryGb)} <span className="text-[10px]">GB</span></>} hint={t('منصة المركبة', 'Bus storage')} />
              <Stat label={t('المفقود', 'Lost')} value={<>{fmt(comms.lostTotalGb, 2)} <span className="text-[10px]">GB</span></>} tone={lost ? 'warn' : 'good'} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span className="text-[10px] text-slate-500">
                {t('الذاكرة تحتفظ بالبيانات إذا تأخر الاتصال، لكنها محدودة.', 'Memory buffers data when the link is delayed, but it is finite.')}
              </span>
            </div>
            {memoryRatio > 1 ? (
              <InlineNote tone="warn" className="mt-3">
                <TriangleAlert className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
                {t('البيانات المنتجة تتجاوز الذاكرة؛ البيانات الزائدة قد تضيع.', 'Produced data exceeds memory; excess may be lost.')}
              </InlineNote>
            ) : null}
            {lost ? (
              <InlineNote tone="warn" className="mt-2">
                {t(
                  `سينتج العلم ${fmt(comms.producedTotalGb, 2)} GB لكن ${fmt(comms.lostTotalGb, 2)} GB لن تصل. ارفع الهوائي أو القدرة أو استخدم محطة 70 م.`,
                  `Science produces ${fmt(comms.producedTotalGb, 2)} GB but ${fmt(comms.lostTotalGb, 2)} GB never arrives. Use a larger antenna, more power or the 70 m station.`,
                )}
              </InlineNote>
            ) : null}
          </Section>

          <Section title={t('ميزانية الوصلة', 'Link budget')} action={<FormulaBadge label="R ∝ P·D² / d²" />}>
            <div className="grid grid-cols-2 gap-2">
              <Stat label={t('كسب الوصلة', 'Link gain')} value={`×${fmt(comms.linkBudgetGain, 2)}`} tone="royal" />
              <Stat label={t('قدرة الإرسال DC', 'TX DC power')} value={<>{fmt(comms.txDcPowerW)} <span className="text-[10px]">W</span></>} />
              <Stat label={t('كلفة الاتصالات', 'Comms cost')} value={fmtMoney(comms.commsCostM)} tone="gold" />
              <Stat label={t('كتلة الهوائي', 'Antenna mass')} value={<>{fmt(comms.antennaMassKg)} <span className="text-[10px]">kg</span></>} />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <DataSourceBadges sources={['dsn', 'game']} />
              <span className="text-[10px] text-slate-500">{fmtPct(delivered)} {t('من البيانات تصل', 'of data returned')}</span>
            </div>
          </Section>

          <SimplifiedNote>
            {t(
              'هذا نموذج تخطيطي وليس حساب وصلة اتصالات هندسيًا. المطر والارتفاع والتشفير وفقدان الهوائي غير مشمولة.',
              'This is a planning model, not an engineering telecom link budget. Rain, elevation, coding and antenna losses are excluded.',
            )}
          </SimplifiedNote>
        </div>
      </div>
    </div>
  );
}
