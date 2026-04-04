import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../shared/Card';
import CropProgressIndicator from './CropProgressIndicator';
import PlantVisual from '../plant/PlantVisual';

function getStatus(crop) {
  return crop.waterAvailable ? 'healthy' : 'attention';
}

export default function CropCard({ crop, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cropName = crop.cropDisplayName || crop.cropName;
  const status = getStatus(crop);

  return (
    <button
      data-testid="crop-card"
      type="button"
      onClick={() => navigate(`/crop/${crop.id}`)}
      className={`cultivo-card block w-full text-left transition duration-300 hover:-translate-y-1 active:scale-[0.985] ${compact ? 'min-w-[286px]' : ''}`}
    >
      <Card className="premium-card-rise relative overflow-hidden border border-[#ebe3d6] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(249,246,239,0.98)_100%)] p-0 shadow-[0_22px_52px_rgba(95,78,54,0.10)]">
        <div className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
                {t('summary.cropEyebrow')}
              </p>
              <h3 className="mt-2 text-[1.55rem] font-semibold capitalize leading-none text-[#1e1e1e]">
                {cropName}
              </h3>
            </div>

            <div className="rounded-full border border-[#e8dfcf] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#5a5a5a] shadow-[0_10px_18px_rgba(89,72,48,0.06)]">
              {crop.daysSincePlanting}d
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-[0_10px_18px_rgba(89,72,48,0.06)] ${
                status === 'healthy'
                  ? 'bg-[#edf7e7] text-[#4f7d3d]'
                  : 'bg-[#fff4e9] text-[#9a6a2e]'
              }`}
            >
              <span>{status === 'healthy' ? '✔' : '⚠'}</span>
              <span>{status === 'healthy' ? t('today.status.good') : t('today.status.attention')}</span>
            </div>
          </div>

          <div className="mt-5 rounded-[30px] border border-[#ebe4d8] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(247,244,238,0.94)_100%)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_28px_rgba(107,88,62,0.07)]">
            <div className="w-full overflow-hidden">
              <div className="flex w-full items-center justify-center py-6">
                <div className="flex h-56 w-56 items-center justify-center rounded-[28px] bg-white/60 shadow-[0_12px_24px_rgba(95,78,54,0.08)] backdrop-blur-sm">
                  <PlantVisual stage={crop.growthStage} sizeClass="h-56 w-56" imageClassName="scale-110" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-[24px] border border-[#ebe4d8] bg-white/90 px-4 py-4 shadow-[0_14px_24px_rgba(95,78,54,0.06)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                {t('crop.stage')}
              </p>
              <p className="mt-2 text-xl font-semibold text-[#1e1e1e]">
                {crop.growthStage}
              </p>
              {!compact ? (
                <p className="mt-2 text-sm leading-6 text-[#5a5a5a]">
                  {crop.expectedBehavior}
                </p>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-[#ebe4d8] bg-white/90 px-4 py-4 shadow-[0_14px_24px_rgba(95,78,54,0.06)]">
              <CropProgressIndicator
                cropName={crop.cropName}
                stageName={crop.growthStage}
                daysSincePlanting={crop.daysSincePlanting}
                stageMinDay={crop.stageMinDay}
                stageMaxDay={crop.stageMaxDay}
                compact={compact}
              />
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
