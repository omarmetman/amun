import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  Flag,
  Lock,
  Radio,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import type { CampaignChapter } from '../data/types';
import { CAMPAIGN, CAMPAIGN_CHAPTERS, campaignProgress } from '../data/campaign';
import { difficultyById, missionTypeById, tierById } from '../data/missions';
import { targetById } from '../data/targets';
import { isChapterUnlocked } from '../engine/campaign';
import { useL, useLang, useT } from '../i18n';
import { fmt, fmtDateTime } from '../lib/format';
import { useMissionStore } from '../store/useMissionStore';
import { CampaignStarRating, CAMPAIGN_ACCENTS, ChapterPatch, SignalRings } from './CampaignArt';
import { Modal } from './Modal';
import { SimplifiedNote, StatusPill } from './Badges';
import { TargetImage } from './TargetImage';

export function CampaignModal({
  onClose,
  onFreeplay,
}: {
  onClose: () => void;
  onFreeplay: () => void;
}) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const campaign = useMissionStore((state) => state.campaign);
  const pilotName = useMissionStore((state) => state.pilotName);
  const startCampaign = useMissionStore((state) => state.startCampaign);
  const startCampaignChapter = useMissionStore((state) => state.startCampaignChapter);
  const progress = campaignProgress(campaign.completed);
  const activeChapterId = campaign.activeChapterId;
  const next = progress.nextChapter;
  const [expanded, setExpanded] = useState<string | null>(
    activeChapterId ?? next?.id ?? CAMPAIGN_CHAPTERS[0].id,
  );
  const activeIsNext = Boolean(activeChapterId && next && activeChapterId === next.id);

  const begin = (chapter: CampaignChapter) => {
    if (!isChapterUnlocked(chapter.id, campaign.completed)) return;
    if (startCampaignChapter(chapter.id)) onClose();
  };

  const beginNext = () => {
    if (activeIsNext) {
      onClose();
      return;
    }
    if (next) {
      begin(next);
      return;
    }
    if (startCampaign()) onClose();
  };

  const primaryLabel = next
    ? activeIsNext
      ? t('تابع الفصل الحالي', 'Continue current chapter')
      : t(`ابدأ الفصل ${next.number}`, `Start chapter ${next.number}`)
    : t('أعد الفصل الأخير', 'Replay the final chapter');

  return (
    <Modal
      title={t('حملة أفق آمون', 'AMUN Horizon campaign')}
      description={t(
        'ستة فصول مترابطة، هدف ثابت في كل فصل، وحريتك الكاملة في الهندسة.',
        'Six linked chapters, one fixed destination per chapter, and full engineering freedom.',
      )}
      onClose={onClose}
      extraWide
    >
      <section className="relative overflow-hidden rounded-2xl border border-gold-400/25 bg-gradient-to-br from-royal-500/[0.13] via-gold-400/[0.055] to-transparent p-4 sm:p-5">
        <div className="campaign-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute -end-24 -top-28 h-72 w-72 opacity-70" aria-hidden="true">
          <SignalRings className="h-full w-full" />
        </div>
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-gold-200">{t('برنامج آمون · أرشيف 2041–2051', 'AMUN PROGRAMME · 2041–2051 ARCHIVE')}</span>
            <span className="h-1 w-1 rounded-full bg-gold-400/60" />
            <span className="font-latin text-[9px] font-bold tracking-[0.2em] text-slate-400" dir="ltr">
              {CAMPAIGN.englishTitle}
            </span>
          </div>
          <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
            {l(CAMPAIGN.title)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-slate-200">
            {l(CAMPAIGN.tagline)}
          </p>
          <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-slate-400">
            {l(CAMPAIGN.overview)}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-slate-400">
                <span>
                  {t(
                    `${progress.completedCount} من ${CAMPAIGN_CHAPTERS.length} فصول مكتملة`,
                    `${progress.completedCount} of ${CAMPAIGN_CHAPTERS.length} chapters complete`,
                  )}
                </span>
                <span className="font-latin text-gold-200" dir="ltr">
                  {progress.totalStars} / {progress.maxStars} ★
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-void-950/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-royal-500 via-royal-400 to-gold-300 transition-all"
                  style={{ width: `${(progress.completedCount / CAMPAIGN_CHAPTERS.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={beginNext} className="btn-primary px-4 py-2.5 text-xs">
                <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
                {primaryLabel}
              </button>
              <button type="button" onClick={onFreeplay} className="btn-ghost px-3 py-2.5 text-xs">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                {t('تصميم حر', 'Freeplay')}
              </button>
            </div>
          </div>

          {activeChapterId ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.08] bg-void-950/35 px-3 py-2 text-[10px] text-slate-300">
              <Radio className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t(
                'هناك فصل نشط. بدء فصل جديد سيستبدل التصميم الحالي، لكن تقدم الحملة يبقى محفوظًا.',
                'A chapter is active. Starting a new one replaces the current design, but campaign progress is kept.',
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-3 grid gap-2 sm:grid-cols-3">
        <SignalStat
          label={t('تردد الإشارة', 'Signal frequency')}
          value={CAMPAIGN.signal.frequency}
          hint={t('خط الهيدروجين — قيمة حقيقية', 'Hydrogen line — a real value')}
        />
        <SignalStat
          label={t('دورة التكرار', 'Repetition')}
          value={l(CAMPAIGN.signal.period)}
          hint={t('تخييل القصة', 'Story fiction')}
        />
        <SignalStat
          label={t('نقاط المصدر', 'Source points')}
          value={t('6', '6')}
          hint={l(CAMPAIGN.signal.points)}
        />
      </section>

      <div className="mt-5 flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="eyebrow">{t('خط الحملة', 'Campaign line')}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mt-3 space-y-3">
        {CAMPAIGN_CHAPTERS.map((chapter) => {
          const unlocked = isChapterUnlocked(chapter.id, campaign.completed);
          const record = campaign.completed[chapter.id];
          const isActive = activeChapterId === chapter.id;
          const isNext = next?.id === chapter.id;
          const open = expanded === chapter.id;
          const accent = CAMPAIGN_ACCENTS[chapter.accent];
          const target = targetById[chapter.targetId];
          const mission = missionTypeById[chapter.missionType];
          const difficulty = difficultyById[chapter.difficulty];
          const tier = tierById[chapter.successTier];
          return (
            <article
              key={chapter.id}
              className={`relative overflow-hidden rounded-2xl border transition ${
                isActive
                  ? `${accent.border} ${accent.soft} ring-1 ${accent.ring}`
                  : isNext
                    ? 'border-gold-400/25 bg-white/[0.035]'
                    : 'border-white/[0.08] bg-white/[0.02]'
              } ${!unlocked ? 'opacity-75' : ''}`}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-60`} aria-hidden="true" />
              <div className="relative grid sm:grid-cols-[9.5rem_1fr]">
                <div className="relative hidden min-h-[12rem] overflow-hidden sm:block">
                  {target ? (
                    <TargetImage target={target} className="h-full w-full" imageClassName="scale-105" />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void-950/90 via-void-950/20 to-transparent" />
                  <div className="absolute bottom-2 start-2 end-2">
                    <ChapterPatch chapter={chapter} size="sm" />
                  </div>
                </div>

                <div className="p-3.5 sm:p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="sm:hidden">
                        <ChapterPatch chapter={chapter} size="sm" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`font-latin text-[9px] font-bold tracking-[0.18em] ${accent.text}`} dir="ltr">
                            CHAPTER {String(chapter.number).padStart(2, '0')} · {chapter.code}
                          </span>
                          <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-latin text-[9px] text-slate-400" dir="ltr">
                            {chapter.year}
                          </span>
                          {record ? (
                            <StatusPill tone="good">
                              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                              {t('مكتمل', 'Complete')}
                            </StatusPill>
                          ) : isActive ? (
                            <StatusPill tone="warn">
                              <Radio className="h-3 w-3" aria-hidden="true" />
                              {t('نشط', 'Active')}
                            </StatusPill>
                          ) : isNext ? (
                            <StatusPill tone="info">
                              <Flag className="h-3 w-3" aria-hidden="true" />
                              {t('التالي', 'Next')}
                            </StatusPill>
                          ) : !unlocked ? (
                            <StatusPill tone="muted">
                              <Lock className="h-3 w-3" aria-hidden="true" />
                              {t('مقفل', 'Locked')}
                            </StatusPill>
                          ) : null}
                        </div>
                        <h3 className="mt-1 text-base font-black text-white sm:text-lg">{l(chapter.title)}</h3>
                        <p className="text-[10px] font-semibold text-slate-400">{l(chapter.subtitle)}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {record ? (
                        <>
                          <CampaignStarRating
                            stars={record.stars}
                            size="sm"
                            label={t(`${record.stars} من 3 نجوم`, `${record.stars} of 3 stars`)}
                          />
                          <span className="font-latin text-[10px] font-bold text-gold-200" dir="ltr">
                            {fmt(record.bestScore, 1)} · {record.bestGrade}
                          </span>
                        </>
                      ) : unlocked ? (
                        <CampaignStarRating stars={0} size="sm" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-600" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  <p className={`mt-2 text-[11px] leading-relaxed text-slate-400 ${open ? '' : 'line-clamp-2'}`}>
                    {l(chapter.prologue)}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="chip !px-2 !py-0.5 !text-[9px]">
                      <Target className="h-3 w-3 text-royal-300" aria-hidden="true" />
                      {target ? l(target.name) : chapter.targetId}
                    </span>
                    <span className="chip !px-2 !py-0.5 !text-[9px]">{mission ? l(mission.short) : chapter.missionType}</span>
                    <span className="chip !px-2 !py-0.5 !text-[9px]">{difficulty ? l(difficulty.name) : chapter.difficulty}</span>
                    <span className="chip !px-2 !py-0.5 !text-[9px]">{tier ? l(tier.name) : chapter.successTier}</span>
                  </div>

                  {open ? (
                    <div className="mt-3 space-y-3 border-t border-white/[0.07] pt-3">
                      <div>
                        <div className="eyebrow mb-1">{t('التوجيه', 'Directive')}</div>
                        <p className="text-[11px] font-semibold leading-relaxed text-slate-200">{l(chapter.objective)}</p>
                        <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{l(chapter.briefing)}</p>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center gap-1.5">
                          <Trophy className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                          <span className="eyebrow">{t('أهداف إضافية', 'Bonus objectives')}</span>
                        </div>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {chapter.bonusObjectives.map((objective) => {
                            const met = Boolean(record?.objectives[objective.id]);
                            return (
                              <div
                                key={objective.id}
                                className={`flex items-start gap-2 rounded-xl border px-2.5 py-2 ${
                                  met
                                    ? 'border-good/25 bg-good/[0.055]'
                                    : 'border-white/[0.07] bg-void-950/30'
                                }`}
                              >
                                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${met ? 'bg-good/15 text-good' : 'bg-white/[0.05] text-slate-500'}`}>
                                  {met ? <Check className="h-2.5 w-2.5" aria-hidden="true" /> : <Lock className="h-2.5 w-2.5" aria-hidden="true" />}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-[10px] font-bold text-slate-200">{l(objective.title)}</div>
                                  <p className="text-[9px] leading-relaxed text-slate-500">{l(objective.description)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {record ? (
                        <div className="rounded-xl border border-gold-400/20 bg-gold-400/[0.045] p-3">
                          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                            <span className="eyebrow text-gold-200">{t('نهاية الفصل', 'Chapter ending')}</span>
                            <span className="font-latin text-[9px] text-slate-500" dir="ltr">
                              {fmtDateTime(record.completedAt, lang)}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-300">{l(chapter.epilogue)}</p>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-white/[0.07] bg-void-950/30 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                            <Lock className="h-3 w-3" aria-hidden="true" />
                            {t('نهاية الفصل مقفلة حتى تكتمل المهمة.', 'The chapter ending unlocks when the mission is complete.')}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl border border-royal-400/15 bg-royal-500/[0.045] p-3">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-royal-300/80">
                          {t('إشارة معترضة', 'Intercepted transmission')}
                        </div>
                        <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-200">{l(chapter.transmission)}</p>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : chapter.id)}
                      aria-expanded={open}
                      className="btn-ghost !px-2.5 !py-1.5 text-[10px]"
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                      {open ? t('أغلق الملف', 'Close file') : t('افتح ملف الفصل', 'Open chapter file')}
                    </button>
                    {unlocked ? (
                      <button
                        type="button"
                        onClick={() => begin(chapter)}
                        className={record ? 'btn-secondary !px-3 !py-1.5 text-[10px]' : 'btn-primary !px-3 !py-1.5 text-[10px]'}
                      >
                        {record ? <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> : <Rocket className="h-3 w-3" aria-hidden="true" />}
                        {record
                          ? t('أعد الفصل', 'Replay chapter')
                          : isActive
                            ? t('تابع الفصل', 'Continue chapter')
                            : t('ابدأ الفصل', 'Start chapter')}
                        {lang === 'ar' ? <ArrowLeft className="h-3 w-3" aria-hidden="true" /> : <ArrowRight className="h-3 w-3" aria-hidden="true" />}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-void-950/30 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        {t('أكمل الفصل السابق', 'Complete the previous chapter')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {progress.allCompleted ? (
        <section className="relative mt-4 overflow-hidden rounded-2xl border border-gold-400/35 bg-gradient-to-br from-gold-400/[0.14] via-royal-500/[0.08] to-transparent p-4 sm:p-5">
          <div className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 opacity-80" aria-hidden="true">
            <SignalRings className="h-full w-full" />
          </div>
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-300" aria-hidden="true" />
              <span className="eyebrow text-gold-200">{t('شهادة إتمام الحملة', 'Campaign completion record')}</span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">{t('الأفق مفتوح', 'The horizon is open')}</h2>
            <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-slate-300">{l(CAMPAIGN.finale)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip !border-gold-400/30 !bg-gold-400/10 !text-gold-100">
                <Trophy className="h-3 w-3" aria-hidden="true" />
                {pilotName}
              </span>
              <span className="chip">
                <Star className="h-3 w-3 fill-gold-300 text-gold-300" aria-hidden="true" />
                <span className="font-latin" dir="ltr">{progress.totalStars} / {progress.maxStars}</span>
              </span>
              <span className="chip">{CAMPAIGN.years}</span>
            </div>
          </div>
        </section>
      ) : null}

      <SimplifiedNote className="mt-4">{l(CAMPAIGN.disclaimer)}</SimplifiedNote>
    </Modal>
  );
}

function SignalStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-void-950/35 px-3 py-2.5">
      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-0.5 font-latin text-sm font-extrabold text-slate-100" dir="ltr">
        {value}
      </div>
      <div className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{hint}</div>
    </div>
  );
}
