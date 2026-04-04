import { useTranslation } from 'react-i18next';

export default function CropTrackingListI18n({ crops, sortOrder = 'DESC' }) {
  const { t } = useTranslation();

  const sortedCrops = [...crops].sort((a, b) => {
    if (sortOrder === 'ASC') {
      return a.daysSincePlanting - b.daysSincePlanting;
    }
    return b.daysSincePlanting - a.daysSincePlanting;
  });

  if (!sortedCrops.length) {
    return (
      <div className="rounded-3xl bg-earth-50 p-4 text-sm leading-6 text-earth-700">
        {t('tracking.empty')}
      </div>
    );
  }

  return (
    <div data-testid="crop-tracking-list-i18n" className="crop-tracking-list-i18n space-y-3">
      {sortedCrops.map((crop) => (
        <article key={crop.id} className="rounded-3xl bg-earth-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold capitalize text-earth-900">{crop.cropDisplayName || crop.cropName}</h3>
              <p className="text-sm text-earth-700">
                {t('tracking.plantedOn', { date: crop.plantingDate, days: crop.daysSincePlanting })}
              </p>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              {crop.waterAvailable ? t('tracking.waterReady') : t('tracking.lowWater')}
            </span>
          </div>
          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-earth-500">{t('crop.stage')}</p>
            <p className="mt-1 text-lg font-semibold text-earth-900">{crop.growthStageIcon ? `${crop.growthStageIcon} ` : ''}{crop.growthStage}</p>
            <p className="mt-2 text-sm leading-6 text-earth-700">{crop.expectedBehavior}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
