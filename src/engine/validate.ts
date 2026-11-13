import type { LocalizedText, ValidationIssue } from '../data/types';
import { DATA_MIN_KBPS, MEMORY_LOSS_WARNING_GB } from '../data/comms';
import type { DesignBase } from './model';

const text = (ar: string, en: string): LocalizedText => ({ ar, en });
const fmt = (n: number, digits = 1): string => (Number.isFinite(n) ? n.toFixed(digits) : '∞');
const pct = (n: number): string => `${(n * 100).toFixed(1)}%`;

/**
 * Validation engine. Every issue carries a stable code, a severity, the step
 * responsible for fixing it, bilingual copy and a numeric metric when useful.
 * Errors block simulation; warnings and info do not.
 */
export function validateDesign(d: DesignBase): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (issue: ValidationIssue): void => {
    issues.push(issue);
  };

  const { target, missionType, tier, bus, propulsion, launcher, orbit, mass, power, comms, cost, science } = d;

  if (!target.allowedMissions.includes(missionType.id)) {
    add({
      code: 'MISSION_TYPE_INCOMPATIBLE',
      severity: 'error',
      step: 1,
      title: text('نوع المهمة غير متوافق مع الهدف', 'Mission type incompatible with target'),
      message: text(
        `${target.name.ar} لا يدعم «${missionType.name.ar}». اختر نوعًا متاحًا أو غيّر الهدف.`,
        `${target.name.en} does not support “${missionType.name.en}”. Pick a supported type or change the target.`,
      ),
    });
  }

  const capsule = d.instruments.find((i) => i.requiresSampleReturn);
  if (capsule && (missionType.id !== 'sampleReturn' || !target.sampleReturnCapable)) {
    add({
      code: 'SAMPLE_CAPSULE_MISMATCH',
      severity: 'error',
      step: 3,
      title: text('كبسولة العينات غير قابلة للاستخدام', 'Sample capsule cannot be used'),
      message: text(
        'كبسولة إرجاع العينات تتطلب مهمة «إرجاع عينات» وهدفًا يسمح بذلك. أزل الكبسولة أو غيّر نوع المهمة.',
        'A sample-return capsule requires a Sample Return mission and a compatible target. Remove it or change the mission type.',
      ),
    });
  }

  if (d.instruments.length === 0) {
    add({
      code: 'NO_INSTRUMENTS',
      severity: 'error',
      step: 3,
      title: text('لا توجد أجهزة علمية', 'No science instruments'),
      message: text(
        'المهمة بلا أجهزة لن تنتج أي علم. اختر جهازًا واحدًا على الأقل.',
        'A mission with no instruments produces no science. Select at least one instrument.',
      ),
    });
  }

  if (d.instrumentMassKg > bus.payloadCapacityKg + 1e-6) {
    add({
      code: 'PAYLOAD_CAPACITY',
      severity: 'error',
      step: 3,
      title: text('الحمولة العلمية تتجاوز سعة المنصة', 'Payload exceeds bus capacity'),
      message: text(
        `كتلة الأجهزة ${fmt(d.instrumentMassKg, 0)} كغ تتجاوز سعة ${bus.name.ar} (${fmt(bus.payloadCapacityKg, 0)} كغ). احذف جهازًا أو اختر منصة أكبر.`,
        `Instrument mass ${fmt(d.instrumentMassKg, 0)} kg exceeds the ${bus.name.en} capacity (${fmt(bus.payloadCapacityKg, 0)} kg). Remove an instrument or choose a larger bus.`,
      ),
      metric: d.instrumentMassKg - bus.payloadCapacityKg,
    });
  }

  if (!mass.equationClosed) {
    add({
      code: 'EQUATION_NO_CLOSE',
      severity: 'error',
      step: 7,
      title: text('معادلة الصاروخ لا تُغلق', 'Rocket equation does not close'),
      message: text(
        `نسبة الكتلة المطلوبة لدلتا-في ${fmt(orbit.requiredDvMS, 0)} م/ث تتجاوز الحد الفيزيائي مع Isp=${propulsion.ispS.toFixed(0)} ث ونسبة خزان ${(mass.tankFraction * 100).toFixed(0)}%. قلّل دلتا-في أو ارفع Isp.`,
        `The mass ratio for ${fmt(orbit.requiredDvMS, 0)} m/s exceeds the physical limit at Isp=${propulsion.ispS.toFixed(0)} s and a ${(mass.tankFraction * 100).toFixed(0)}% tank fraction. Reduce Δv or increase Isp.`,
      ),
    });
  }

  if (mass.wetMassKg > mass.launcherCapacityKg + 0.5) {
    add({
      code: 'MASS_OVER',
      severity: 'error',
      step: 7,
      title: text('الكتلة تتجاوز حمولة الصاروخ', 'Launch mass exceeds launcher capacity'),
      message: text(
        `الكتلة عند الإطلاق ${fmt(mass.wetMassKg, 0)} كغ، والحمولة المتاحة لـ${launcher.name.ar} عند C3=${fmt(orbit.c3, 1)} هي ${fmt(mass.launcherCapacityKg, 0)} كغ.`,
        `Launch mass is ${fmt(mass.wetMassKg, 0)} kg; ${launcher.name.en} offers ${fmt(mass.launcherCapacityKg, 0)} kg at C3=${fmt(orbit.c3, 1)}.`,
      ),
      metric: mass.wetMassKg - mass.launcherCapacityKg,
    });
  } else if (mass.massMargin < 0.1) {
    add({
      code: 'MASS_MARGIN_LOW',
      severity: 'warning',
      step: 7,
      title: text('هامش الكتلة منخفض', 'Low mass margin'),
      message: text(
        `هامش الكتلة ${pct(mass.massMargin)} فقط. الهدف الموصى به 10–30% لاستيعاب نمو الكتلة.`,
        `Mass margin is only ${pct(mass.massMargin)}. The recommended range is 10–30% to absorb mass growth.`,
      ),
      metric: mass.massMargin,
    });
  }

  if (mass.propellantLimited) {
    add({
      code: 'PROPELLANT_LIMITED',
      severity: 'warning',
      step: 7,
      title: text('الوقود مقيد بحمولة الصاروخ', 'Propellant limited by launcher capacity'),
      message: text(
        `حمولة الصاروخ لا تسمح بتحميل الوقود الكامل المطلوب لاحتياطي دلتا-في (${fmt(d.choices.propellantReservePercent, 0)}%). الهامش المتاح ${pct(orbit.dvMargin)}.`,
        `Launcher capacity cannot carry the full propellant load needed for the ${fmt(d.choices.propellantReservePercent, 0)}% Δv reserve. Available margin is ${pct(orbit.dvMargin)}.`,
      ),
      metric: orbit.dvMargin,
    });
  }

  if (orbit.requiredDvMS > 0 && orbit.availableDvMS + 1 < orbit.requiredDvMS) {
    add({
      code: 'DV_DEFICIT',
      severity: 'error',
      step: 9,
      title: text('دلتا-في المتاح أقل من المطلوب', 'Available Δv is below requirement'),
      message: text(
        `المتاح ${fmt(orbit.availableDvMS, 0)} م/ث مقابل مطلوب ${fmt(orbit.requiredDvMS, 0)} م/ث (عجز ${fmt(orbit.requiredDvMS - orbit.availableDvMS, 0)} م/ث).`,
        `Available ${fmt(orbit.availableDvMS, 0)} m/s versus required ${fmt(orbit.requiredDvMS, 0)} m/s (shortfall ${fmt(orbit.requiredDvMS - orbit.availableDvMS, 0)} m/s).`,
      ),
      metric: orbit.requiredDvMS - orbit.availableDvMS,
    });
  } else if (orbit.dvMargin >= 0 && orbit.dvMargin < 0.1) {
    add({
      code: 'DV_MARGIN_LOW',
      severity: 'warning',
      step: 9,
      title: text('هامش دلتا-في منخفض', 'Low Δv margin'),
      message: text(
        `هامش دلتا-في ${pct(orbit.dvMargin)}. أقل من 10% يجعل تصحيح المسار والوصول أكثر خطورة.`,
        `Δv margin is ${pct(orbit.dvMargin)}. Below 10% makes trajectory correction and arrival riskier.`,
      ),
      metric: orbit.dvMargin,
    });
  }

  const modeLabels = {
    cruise: { ar: 'الإبحار', en: 'Cruise' },
    science: { ar: 'العمليات العلمية', en: 'Science' },
    safe: { ar: 'النمط الآمن', en: 'Safe mode' },
  } as const;
  (Object.keys(modeLabels) as Array<keyof typeof modeLabels>).forEach((mode) => {
    const data = power.modes[mode];
    if (data.generatedW + 1e-6 < data.loadW) {
      const codes = {
        cruise: 'POWER_CRUISE',
        science: 'POWER_SCIENCE',
        safe: 'POWER_SAFE',
      } as const;
      add({
        code: codes[mode],
        severity: 'error',
        step: 6,
        title: text(
          `الطاقة غير كافية في نمط ${modeLabels[mode].ar}`,
          `Insufficient power in ${modeLabels[mode].en} mode`,
        ),
        message: text(
          `المولّد ${fmt(data.generatedW, 0)} واط مقابل حمل ${fmt(data.loadW, 0)} واط (عجز ${fmt(data.loadW - data.generatedW, 0)} واط).`,
          `Generated ${fmt(data.generatedW, 0)} W versus a ${fmt(data.loadW, 0)} W load (shortfall ${fmt(data.loadW - data.generatedW, 0)} W).`,
        ),
        metric: data.loadW - data.generatedW,
      });
    } else if (data.margin < 0.1) {
      add({
        code: 'POWER_MARGIN_LOW',
        severity: 'warning',
        step: 6,
        title: text(
          `هامش الطاقة منخفض في نمط ${modeLabels[mode].ar}`,
          `Low power margin in ${modeLabels[mode].en} mode`,
        ),
        message: text(
          `الهامش ${pct(data.margin)}. الهدف 10% على الأقل لكل نمط تشغيل.`,
          `Margin is ${pct(data.margin)}. Aim for at least 10% in every operating mode.`,
        ),
        metric: data.margin,
      });
    }
  });

  if (power.batteryRequiredWh > power.batteryCapacityWh + 1 && power.eclipseHours > 0) {
    add({
      code: 'POWER_BATTERY',
      severity: 'error',
      step: 6,
      title: text('سعة البطارية لا تكفي أثناء الكسوف', 'Battery cannot cover eclipse'),
      message: text(
        `الاحتياج ${fmt(power.batteryRequiredWh, 0)} واط-ساعة أثناء ${fmt(power.eclipseHours, 1)} ساعة كسوف، والسعة ${fmt(power.batteryCapacityWh, 0)} واط-ساعة. أضف بطارية.`,
        `Need ${fmt(power.batteryRequiredWh, 0)} Wh across ${fmt(power.eclipseHours, 1)} h of eclipse; capacity is ${fmt(power.batteryCapacityWh, 0)} Wh. Add battery mass.`,
      ),
      metric: power.batteryRequiredWh - power.batteryCapacityWh,
    });
  }

  if (comms.dataRateKbps < DATA_MIN_KBPS) {
    add({
      code: 'DATA_RATE_ZERO',
      severity: 'error',
      step: 8,
      title: text('معدل البيانات صفر عمليًا', 'Data rate is effectively zero'),
      message: text(
        `المعدل ${fmt(comms.dataRateKbps, 3)} كيلوبت/ث عند مسافة ${fmt(comms.distanceAU, 2)} و.ف. لا يمكن إرجاع بيانات بهذا المعدل.`,
        `Rate is ${fmt(comms.dataRateKbps, 3)} kbit/s at ${fmt(comms.distanceAU, 2)} AU. No usable data return at this rate.`,
      ),
      metric: comms.dataRateKbps,
    });
  }

  if (comms.lostTotalGb > MEMORY_LOSS_WARNING_GB) {
    add({
      code: 'DATA_MEMORY_LOSS',
      severity: 'warning',
      step: 8,
      title: text('بيانات ستضيع بسبب الذاكرة/الاتصال', 'Data will be lost to memory/link limits'),
      message: text(
        `ينتج العلم ${fmt(comms.producedTotalGb, 2)} GB ويُرسل ${fmt(comms.sentTotalGb, 2)} GB؛ ${fmt(comms.lostTotalGb, 2)} GB تتجاوز الذاكرة (${fmt(comms.memoryGb, 0)} GB).`,
        `Science produces ${fmt(comms.producedTotalGb, 2)} GB and sends ${fmt(comms.sentTotalGb, 2)} GB; ${fmt(comms.lostTotalGb, 2)} GB exceeds the ${fmt(comms.memoryGb, 0)} GB buffer.`,
      ),
      metric: comms.lostTotalGb,
    });
  }

  if (science.raw < tier.minScience) {
    add({
      code: 'AFFINITY_LOW',
      severity: 'warning',
      step: 3,
      title: text('الأجهزة لا تحقق معيار النجاح الأدنى', 'Instruments fall short of the minimum success tier'),
      message: text(
        `القيمة العلمية المتوقعة ${fmt(science.raw, 0)} نقطة، بينما «${tier.name.ar}» يتطلب ${tier.minScience}. أضف أجهزة ذات توافق أعلى مع ${target.name.ar}.`,
        `Projected science is ${fmt(science.raw, 0)} points; the “${tier.name.en}” tier requires ${tier.minScience}. Add instruments with stronger affinity for ${target.name.en}.`,
      ),
      metric: science.raw - tier.minScience,
    });
  } else if (science.averageAffinity < 0.85) {
    add({
      code: 'AFFINITY_LOW',
      severity: 'warning',
      step: 3,
      title: text('توافق ضعيف بين الأجهزة والهدف', 'Weak instrument–target affinity'),
      message: text(
        `متوسط معامل التوافق ${fmt(science.averageAffinity, 2)}. جرّب أجهزة مصممة لبيئة ${target.name.ar}.`,
        `Average affinity is ${fmt(science.averageAffinity, 2)}. Try instruments suited to the ${target.name.en} environment.`,
      ),
      metric: science.averageAffinity,
    });
  }

  if (d.choices.reservePercent < 10) {
    add({
      code: 'RESERVE_LOW',
      severity: 'warning',
      step: 5,
      title: text('احتياطي الميزانية أقل من 10%', 'Budget reserve below 10%'),
      message: text(
        `الاحتياطي ${fmt(d.choices.reservePercent, 0)}%. أحداث تضخم التكلفة قد تدفع المهمة فوق الميزانية.`,
        `Reserve is ${fmt(d.choices.reservePercent, 0)}%. Cost-overrun events may push the mission over budget.`,
      ),
      metric: d.choices.reservePercent,
    });
  }

  if (target.sunDistanceAU > 2.5 && d.choices.power.solarAreaM2 > 0) {
    add({
      code: 'SOLAR_FAR',
      severity: 'warning',
      step: 6,
      title: text('الشمس ضعيفة عند هذا الهدف', 'Sunlight is weak at this target'),
      message: text(
        `التدفق الشمسي ≈ ${fmt(power.solarFluxTargetWM2, 1)} واط/م² فقط (مقابل 1361 عند الأرض). قد لا تكفي الألواح عمليًا؛ فكّر في RTG.`,
        `Solar flux is only ≈${fmt(power.solarFluxTargetWM2, 1)} W/m² (versus 1361 at Earth). Arrays may be impractical; consider RTGs.`,
      ),
      metric: power.solarFluxTargetWM2,
    });
  }

  if (propulsion.id === 'ion' && power.modes.cruise.margin < 0.2) {
    add({
      code: 'ION_POWER',
      severity: 'warning',
      step: 6,
      title: text('هامش الطاقة منخفض للدفع الأيوني', 'Tight power margin for ion propulsion'),
      message: text(
        `الدفع الأيوني يستهلك 1200 واط إضافية؛ هامش الإبحار ${pct(power.modes.cruise.margin)}. زد الألواح/RTG أو غيّر الدفع.`,
        `Ion propulsion adds 1200 W; cruise margin is ${pct(power.modes.cruise.margin)}. Add arrays/RTGs or change propulsion.`,
      ),
      metric: power.modes.cruise.margin,
    });
  }

  if (cost.totalM > cost.budgetM + 0.01) {
    add({
      code: 'BUDGET_OVER',
      severity: 'error',
      step: 5,
      title: text('الميزانية متجاوزة', 'Budget exceeded'),
      message: text(
        `التكلفة الكلية ${fmt(cost.totalM, 1)} مليون دولار مقابل ميزانية ${fmt(cost.budgetM, 0)} مليون (تجاوز ${fmt(cost.totalM - cost.budgetM, 1)}).`,
        `Total cost is $${fmt(cost.totalM, 1)}M against a $${fmt(cost.budgetM, 0)}M budget (over by $${fmt(cost.totalM - cost.budgetM, 1)}M).`,
      ),
      metric: cost.totalM - cost.budgetM,
    });
  }

  if (orbit.windowPenalty > 0.05) {
    add({
      code: 'WINDOW_PENALTY',
      severity: 'info',
      step: 9,
      title: text('نافذة الإطلاق ليست مثالية', 'Launch window is not ideal'),
      message: text(
        `عقوبة النافذة ${pct(orbit.windowPenalty)} ترفع C3 ودلتا-في. النافذة الأولى عادةً الأفضل.`,
        `The ${pct(orbit.windowPenalty)} window penalty raises C3 and Δv. The first window is usually best.`,
      ),
      metric: orbit.windowPenalty,
    });
  }

  if (
    mass.launcherCapacityKg > 500 &&
    mass.wetMassKg < mass.launcherCapacityKg * 0.15 &&
    !mass.propellantLimited
  ) {
    add({
      code: 'LAUNCHER_OVERSIZED',
      severity: 'info',
      step: 4,
      title: text('الصاروخ أكبر من الحاجة', 'Launcher is oversized'),
      message: text(
        `تستخدم ${pct(mass.wetMassKg / mass.launcherCapacityKg)} فقط من الحمولة. صاروخ أصغر قد يحرر ميزانية.`,
        `You use only ${pct(mass.wetMassKg / mass.launcherCapacityKg)} of capacity. A smaller launcher could free budget.`,
      ),
      metric: mass.wetMassKg / mass.launcherCapacityKg,
    });
  }

  const order: Record<ValidationIssue['severity'], number> = { error: 0, warning: 1, info: 2 };
  return issues.sort((a, b) => order[a.severity] - order[b.severity] || a.step - b.step);
}
