import { useL, useT } from '../i18n';
import { fmt, fmtMoney, fmtPct } from '../lib/format';
import { useDesign } from '../store/useDesign';
import { useMissionStore } from '../store/useMissionStore';
import { IconAlert, IconCheck, IconInfo } from './Icons';

/**
 * A live line under the step hint. Unlike the static hint, this reads the
 * current design so the player immediately sees which number is healthy or tight.
 */
export function ContextHint({ step }: { step: number }) {
  const design = useDesign();
  const t = useT();
  const l = useL();
  const score = useMissionStore((state) => state.score);
  const minPower = Math.min(
    design.power.modes.cruise.margin,
    design.power.modes.science.margin,
    design.power.modes.safe.margin,
  );

  let tone: 'good' | 'warn' | 'info' = 'info';
  let message: string;

  switch (step) {
    case 1:
      if (design.science.raw < design.tier.minScience) {
        tone = 'warn';
        message = t(
          `حزمة الأجهزة الحالية تنتج نحو ${fmt(design.science.raw, 1)} نقطة علم، أي أقل من ${design.tier.minScience} المطلوبة لمعيار «${l(design.tier.name)}».`,
          `The current suite yields about ${fmt(design.science.raw, 1)} science, below the ${design.tier.minScience} required by the “${l(design.tier.name)}” tier.`,
        );
      } else {
        tone = 'good';
        message = t(
          `الهدف يدعم «${l(design.missionType.name)}»، والعائد العلمي المتوقع ${fmt(design.science.raw, 1)} نقطة.`,
          `The target supports “${l(design.missionType.name)}”, with a projected ${fmt(design.science.raw, 1)} science points.`,
        );
      }
      break;
    case 2:
      if (design.target.hazardFactor >= 0.45 && !design.choices.radHard) {
        tone = 'warn';
        message = t(
          `خطورة ${l(design.target.name)} ${fmt(design.target.hazardFactor, 2)} وبدون إلكترونيات مقاومة للإشعاع. توقّع أعطالًا أكثر.`,
          `${l(design.target.name)} hazard is ${fmt(design.target.hazardFactor, 2)} without rad-hard electronics. Expect more failures.`,
        );
      } else {
        message = t(
          `المنصة «${l(design.bus.name)}» توفر ${fmt(design.payloadCapacityKg)} كغ للحمولة و${fmt(design.bus.storageGb)} GB تخزينًا.`,
          `The “${l(design.bus.name)}” bus offers ${fmt(design.payloadCapacityKg)} kg payload and ${fmt(design.bus.storageGb)} GB storage.`,
        );
      }
      break;
    case 3:
      if (design.science.averageAffinity < 0.9) {
        tone = 'warn';
        message = t(
          `متوسط توافق الأجهزة ${design.science.averageAffinity.toFixed(2)} فقط. أضف أو استبدل جهازًا يناسب طبيعة ${l(design.target.name)}.`,
          `Average instrument affinity is only ${design.science.averageAffinity.toFixed(2)}. Add or swap an instrument suited to ${l(design.target.name)}.`,
        );
      } else {
        tone = 'good';
        message = t(
          `${design.instruments.length} أجهزة تنتج ${fmt(design.comms.producedTotalGb, 2)} GB ومتوسط توافق ${design.science.averageAffinity.toFixed(2)}.`,
          `${design.instruments.length} instruments produce ${fmt(design.comms.producedTotalGb, 2)} GB at ${design.science.averageAffinity.toFixed(2)} average affinity.`,
        );
      }
      break;
    case 4: {
      const fit = design.mass.launcherCapacityKg > 0 ? design.mass.wetMassKg / design.mass.launcherCapacityKg : 1;
      tone = fit > 1 ? 'warn' : 'good';
      message = t(
        `الكتلة الرطبة ${fmt(design.mass.wetMassKg)} كغ = ${fmtPct(fit)} من حمولة ${l(design.launcher.name)} عند C3 الحالية.`,
        `Wet mass ${fmt(design.mass.wetMassKg)} kg = ${fmtPct(fit)} of ${l(design.launcher.name)} capacity at the current C3.`,
      );
      break;
    }
    case 5:
      if (design.cost.remainingM < 0) {
        tone = 'warn';
        message = t(
          `التكلفة تتجاوز الميزانية بـ ${fmtMoney(-design.cost.remainingM)} قبل أي أحداث. قلّل الصاروخ أو أيام العمليات أو الاحتياطي.`,
          `Cost exceeds the budget by ${fmtMoney(-design.cost.remainingM)} before events. Trim the launcher, ops days or reserve.`,
        );
      } else {
        message = t(
          `متبقٍ ${fmtMoney(design.cost.remainingM)} من ${fmtMoney(design.cost.budgetM, 0)}، والاحتياطي ${fmtMoney(design.cost.reserveM)}.`,
          `${fmtMoney(design.cost.remainingM)} left of ${fmtMoney(design.cost.budgetM, 0)}, with a ${fmtMoney(design.cost.reserveM)} reserve.`,
        );
      }
      break;
    case 6:
      tone = minPower < 0.1 ? 'warn' : 'good';
      message = t(
        `أدنى هامش طاقة ${fmtPct(minPower)} (الإبحار ${fmtPct(design.power.modes.cruise.margin)}، العلم ${fmtPct(design.power.modes.science.margin)}، الآمن ${fmtPct(design.power.modes.safe.margin)}).`,
        `Lowest power margin ${fmtPct(minPower)} (cruise ${fmtPct(design.power.modes.cruise.margin)}, science ${fmtPct(design.power.modes.science.margin)}, safe ${fmtPct(design.power.modes.safe.margin)}).`,
      );
      break;
    case 7:
      tone = design.mass.massMargin < 0.1 ? 'warn' : design.mass.massMargin > 0.3 ? 'info' : 'good';
      message = t(
        `هامش الكتلة ${fmtPct(design.mass.massMargin)}، والوقود ${fmt(design.mass.propellantKg)} كغ، والتحقق المغلق ${design.mass.equationClosed ? 'ناجح' : 'غير مكتمل'}.`,
        `Mass margin ${fmtPct(design.mass.massMargin)}, propellant ${fmt(design.mass.propellantKg)} kg, closed-form check ${design.mass.equationClosed ? 'passes' : 'incomplete'}.`,
      );
      break;
    case 8:
      tone = design.comms.lostTotalGb > 0.05 ? 'warn' : 'good';
      message = t(
        `معدل الإرسال ${fmt(design.comms.dataRateKbps, 1)} كيلوبت/ث، والمتوقع وصوله ${fmt(design.comms.sentTotalGb, 2)} من ${fmt(design.comms.producedTotalGb, 2)} GB.`,
        `Downlink ${fmt(design.comms.dataRateKbps, 1)} kbit/s, with ${fmt(design.comms.sentTotalGb, 2)} of ${fmt(design.comms.producedTotalGb, 2)} GB expected to arrive.`,
      );
      break;
    case 9:
      tone = design.orbit.dvMargin < 0.1 ? 'warn' : 'good';
      message = t(
        `المتاح ${fmt(design.orbit.availableDvMS)} م/ث مقابل مطلوب ${fmt(design.orbit.requiredDvMS)} م/ث، أي هامش ${fmtPct(design.orbit.dvMargin)}.`,
        `${fmt(design.orbit.availableDvMS)} m/s available versus ${fmt(design.orbit.requiredDvMS)} m/s required, a ${fmtPct(design.orbit.dvMargin)} margin.`,
      );
      break;
    case 10:
      tone = design.blockingIssues.length > 0 ? 'warn' : 'good';
      message = design.blockingIssues.length > 0
        ? t(
            `${design.blockingIssues.length} خطأ مانع يمنع التشغيل. راجع مركز التحقق أعلى الصفحة.`,
            `${design.blockingIssues.length} blocking error(s) prevent the run. Check the validation center above.`,
          )
        : t(
            `جاهز للتشغيل ببذرة ${design.choices.seed}. الطلب نفسه سيعطي النتيجة نفسها دائمًا.`,
            `Ready to run with seed ${design.choices.seed}. The same design always reproduces the same result.`,
          );
      break;
    case 11:
      if (score) {
        tone = score.breakdown.total >= 80 ? 'good' : score.breakdown.total >= 60 ? 'info' : 'warn';
        message = t(
          `النتيجة ${fmt(score.breakdown.total, 1)} / 100 بتقدير ${score.grade}. كل بند في التقرير يقودك إلى الخطوة المسؤولة.`,
          `Score ${fmt(score.breakdown.total, 1)} / 100, grade ${score.grade}. Every line in the report links to the responsible step.`,
        );
      } else {
        tone = 'warn';
        message = t(
          'لا توجد نتيجة محاكاة محفوظة. شغّل المحاكاة أولًا ثم عد للتقييم.',
          'No saved simulation result. Run the simulation first, then return to evaluation.',
        );
      }
      break;
    default:
      message = '';
  }

  const Icon = tone === 'good' ? IconCheck : tone === 'warn' ? IconAlert : IconInfo;
  const color = tone === 'good' ? 'text-malachite' : tone === 'warn' ? 'text-amber' : 'text-royal-300';

  return (
    <span className="inline-flex items-start gap-1.5">
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${color}`} />
      <span className="text-limestone-300">{message}</span>
    </span>
  );
}
