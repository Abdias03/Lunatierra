import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AppCard from './AppCard';

function getStatus(crop, cropDetail) {
  const warningsCount = cropDetail?.warnings?.length || 0;

  if (!crop?.waterAvailable || warningsCount >= 2) {
    return 'risk';
  }

  if (warningsCount === 1) {
    return 'attention';
  }

  return 'good';
}

function buildActions(crop, cropDetail, recommendationData, fallbackActions) {
  const rawActions = [
    cropDetail?.actionToday,
    cropDetail?.fieldObservation,
    recommendationData?.recommendations?.[0]?.message,
    crop?.waterAvailable ? null : fallbackActions.water,
    fallbackActions.soil,
    fallbackActions.weeds
  ];

  return rawActions.filter(Boolean).filter((value, index, array) => array.indexOf(value) === index).slice(0, 3);
}

const statusStyles = {
  good: 'bg-leaf-100 text-leaf-700 ring-1 ring-leaf-200/80',
  attention: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200/80',
  risk: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200/80'
};

function getStageTone(stageName = '') {
  const normalizedStage = stageName.toLowerCase();

  if (normalizedStage.includes('germin')) {
    return 'germination';
  }

  if (normalizedStage.includes('flor')) {
    return 'flowering';
  }

  if (normalizedStage.includes('madur') || normalizedStage.includes('matur')) {
    return 'mature';
  }

  return 'growth';
}

function getMotivationMessage(t, { crop, status, streakCount, reviewed }) {
  const stageTone = getStageTone(crop?.growthStage);

  if (status === 'risk') {
    return t('today.motivation.risk');
  }

  if (status === 'attention') {
    return t('today.motivation.attention');
  }

  if (reviewed) {
    return t('today.motivation.reviewed');
  }

  if (streakCount >= 5) {
    return t('today.motivation.streakStrong');
  }

  if (streakCount >= 1) {
    return t('today.motivation.streakGrowing');
  }

  return t(`today.motivation.stage.${stageTone}`);
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

export default function TodayFocusCard({ crop, cropDetail, recommendationData, progressProfile, reviewing = false, onReview }) {
  const { t } = useTranslation();
  const fallbackActions = useMemo(
    () => ({
      water: t('today.fallbackWaterAction'),
      soil: t('today.fallbackSoilAction'),
      weeds: t('today.fallbackWeedsAction')
    }),
    [t]
  );

  const status = useMemo(() => getStatus(crop, cropDetail), [crop, cropDetail]);
  const actions = useMemo(
    () => buildActions(crop, cropDetail, recommendationData, fallbackActions),
    [crop, cropDetail, recommendationData, fallbackActions]
  );
  const cropName = crop?.cropDisplayName || t(`crop.names.${crop?.cropName}`, crop?.cropName || '');
  const streakCount = recommendationData?.dailyProgress?.streakCount ?? 0;
  const reviewed = Boolean(recommendationData?.dailyProgress?.checkedToday);
  const streakLabel = t('today.streak', { count: streakCount });
  const reviewingLabel = t('today.reviewing');
  const xpProgress = useMemo(() => getXpProgress(progressProfile), [progressProfile]);
  const motivationMessage = useMemo(
    () => getMotivationMessage(t, { crop, status, streakCount, reviewed }),
    [t, crop, status, streakCount, reviewed]
  );

  if (!crop) {
    return (
      <AppCard className="bg-[linear-gradient(155deg,_rgba(255,255,255,0.96)_0%,_rgba(242,236,224,0.96)_100%)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-earth-500">{t('today.eyebrow')}</p>
        <h2 className="mt-2 text-2xl font-semibold text-earth-900">{t('today.title')}</h2>
        <p className="mt-3 text-sm leading-6 text-earth-700">{t('today.empty')}</p>
      </AppCard>
    );
  }

  return (
    <AppCard className="relative overflow-hidden bg-[linear-gradient(160deg,_rgba(96,145,63,0.98)_0%,_rgba(64,103,43,0.96)_55%,_rgba(53,38,24,0.96)_100%)] px-5 py-6 text-white shadow-[0_24px_60px_rgba(53,38,24,0.22)]">
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
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <span>🔥</span>
              <span>{streakLabel}</span>
            </p>
          </div>

          <div className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[status]}`}>
            {t(`today.status.${status}`)}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/16 bg-white/12 px-4 py-4 backdrop-blur-sm">
          <div className="mb-4 rounded-[20px] border border-white/14 bg-black/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">
                {`🌱 Nivel ${xpProgress.level}`}
              </p>
              <p className="text-xs font-medium text-white/80">
                {`${xpProgress.currentXp}/${xpProgress.nextThreshold} XP`}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-sm leading-7 text-white">{motivationMessage}</p>
        </div>

        <div className="rounded-[26px] border border-white/16 bg-white/12 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/85">{t('today.actionsTitle')}</p>
          <div className="mt-3 space-y-3">
            {actions.map((action, index) => (
              <div key={`${action}-${index}`} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/16 text-sm">✓</span>
                <p className="text-sm leading-6 text-white/85">{action}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onReview}
          disabled={reviewed || reviewing}
          className={`reward-button inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold active:scale-[0.96] ${
            reviewed
              ? 'reward-success bg-[#6FAE4F] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_20px_rgba(111,174,79,0.36)]'
              : 'bg-white text-[#2F2F2F] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:translate-y-0 disabled:bg-white/80'
          }`}
        >
          {reviewing ? reviewingLabel : reviewed ? t('today.reviewedDone') : t('today.reviewed')}
        </button>

        {reviewed ? (
          <div className="reward-bloom inline-flex items-center gap-2 self-start rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-semibold text-white/92 backdrop-blur-sm">
            <span>{t('today.rewardMessage')}</span>
          </div>
        ) : null}
      </div>
    </AppCard>
  );
}
