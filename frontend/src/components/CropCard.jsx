import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AppCard from './AppCard';
import CropProgressIndicator from './CropProgressIndicator';

export default function CropCard({ crop, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/crop/${crop.id}`)}
      className={`block w-full text-left transition duration-200 hover:-translate-y-1 active:scale-[0.99] ${compact ? 'min-w-[250px]' : ''}`}
    >
      <AppCard className="overflow-hidden bg-[#F5F2EA]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7A7A7A]">{t('summary.cropEyebrow')}</p>
          <h3 className="mt-1 text-xl font-semibold capitalize text-[#1E1E1E]">
            {t(`crop.names.${crop.cropName}`, crop.cropName)}
          </h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${crop.waterAvailable ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-700'}`}>
          {crop.waterAvailable ? t('tracking.waterReady') : t('tracking.lowWater')}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">{t('crop.stage')}</p>
          <p className="mt-2 text-sm font-semibold text-[#1E1E1E]">{crop.growthStage}</p>
        </div>
        <div className="rounded-2xl bg-white/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">{t('summary.days')}</p>
          <p className="mt-2 text-sm font-semibold text-[#1E1E1E]">{t('summary.daysValue', { value: crop.daysSincePlanting })}</p>
        </div>
      </div>

      {!compact ? (
        <>
          <div className="mt-4">
            <CropProgressIndicator stageName={crop.growthStage} />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#5A5A5A]">{crop.expectedBehavior}</p>
        </>
      ) : (
        <div className="mt-4">
          <CropProgressIndicator stageName={crop.growthStage} compact />
        </div>
      )}
      </AppCard>
    </button>
  );
}
