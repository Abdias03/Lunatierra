import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../shared/Card';

function getStatus(crop, cropDetail) {
  if (!cropDetail) {
    return 'good';
  }
  
  const warningsCount = cropDetail.warnings.length || 0;

  if (!crop.waterAvailable || warningsCount >= 2) {
    return 'risk';
  }

  if (warningsCount === 1) {
    return 'attention';
  }

  return 'good';
}

function getXpProgress(progressProfile) {
  if (!progressProfile) {
    return { level: 1, currentXp: 0, nextThreshold: 50, percentage: 0 };
  }

  if (progressProfile.nextThreshold === progressProfile.previousThreshold) {
    return {
      level: progressProfile.level,
      currentXp: progressProfile.currentXp,
      nextThreshold: progressProfile.nextThreshold,
      percentage: 100
    };
  }

  const percentage = ((progressProfile.currentXp - progressProfile.previousThreshold)
    / (progressProfile.nextThreshold - progressProfile.previousThreshold)) * 100;

  return {
    level: progressProfile.level,
    currentXp: progressProfile.currentXp,
    nextThreshold: progressProfile.nextThreshold,
    percentage: Math.max(0, Math.min(100, percentage))
  };
}

const statusStyles = {
  good: 'bg-leaf-100 text-leaf-700 ring-1 ring-leaf-200/80',
  attention: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200/80',
  risk: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200/80'
};

export default function TodayFocusCard({
  crop,
  cropDetail,
  recommendationData,
  progressProfile,
  reviewing = false,
  onReview,
  onOpen
}) {
  const { t } = useTranslation();
  const status = useMemo(() => getStatus(crop, cropDetail), [crop, cropDetail]);
  const xpProgress = useMemo(() => getXpProgress(progressProfile), [progressProfile]);
  const reviewed = Boolean(recommendationData?.dailyProgress?.checkedToday);
  const cropName = crop?.cropDisplayName || crop?.cropName || '';
  const reviewingLabel = t('today.reviewing');

  if (!crop) {
    return (
      <Card data-testid="today-focus-card" className="today-focus-card bg-[linear-gradient(155deg,_rgba(255,255,255,0.96)_0%,_rgba(242,236,224,0.96)_100%)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-earth-500">{t('today.eyebrow')}</p>
        <h2 className="mt-2 text-2xl font-semibold text-earth-900">{t('today.title')}</h2>
        <p className="mt-3 text-sm leading-6 text-earth-700">{t('today.empty')}</p>
      </Card>
    );
  }

  return (
    <Card data-testid="today-focus-card" className="today-focus-card relative overflow-hidden bg-[linear-gradient(160deg,_rgba(96,145,63,0.98)_0%,_rgba(64,103,43,0.96)_55%,_rgba(53,38,24,0.96)_100%)] px-5 py-6 text-white shadow-[0_24px_60px_rgba(53,38,24,0.22)]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.10)_0%,_rgba(0,0,0,0.15)_100%)]" />
      <div className="absolute inset-x-8 top-6 h-28 rounded-full bg-[radial-gradient(circle,_rgba(214,255,199,0.3)_0%,_rgba(214,255,199,0)_72%)] blur-2xl" />
      <div className="absolute -right-10 top-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(180deg,_rgba(55,40,25,0)_0%,_rgba(44,31,18,0.55)_100%)]" />

      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/85">{t('today.eyebrow')}</p>
            <h2 className="mt-2 text-[2rem] font-semibold leading-none text-white">{cropName}</h2>
            <p className="mt-2 text-sm font-medium text-white/85">{t('today.day', { value: crop.daysSincePlanting })}</p>
          </div>

          <div className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[status]}`}>
            {t(`today.status.${status}`)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex w-full items-center justify-center rounded-full border border-white/18 bg-white/12 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {t('today.reviewNow')}
          </button>

          <button
            type="button"
            onClick={onReview}
            disabled={reviewed || reviewing}
            className={`reward-button inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold active:scale-[0.96] ${
              reviewed ? 'reward-success bg-[#6FAE4F] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_20px_rgba(111,174,79,0.36)]'
              : 'bg-white text-[#2F2F2F] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:translate-y-0 disabled:bg-white/80'
            }`}
          >
            {reviewing ? reviewingLabel : reviewed ? t('today.reviewedDone') : t('today.reviewed')}
          </button>
        </div>

        <div className="rounded-[22px] border border-white/14 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">
              {reviewed ? t('today.missionComplete')
                : t('today.quickCheck')}
            </p>
            <p className="text-xs font-medium text-white/80">
              {`${xpProgress.currentXp}/${xpProgress.nextThreshold} XP`}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className={`h-full rounded-full bg-white transition-[width] duration-500 ${reviewed ? 'reward-success' : ''}`}
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
        </div>

        {reviewed ? (
          <div className="reward-bloom inline-flex items-center gap-2 self-start rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-semibold text-white/92 backdrop-blur-sm">
            <span>{t('today.rewardMessage')}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
