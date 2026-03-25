import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AppCard from './AppCard';
import CropHeroPremium from './CropHeroPremium';
import CropProgressIndicator from './CropProgressIndicator';
import CropStatusCard from './CropStatusCard';
import RecommendationCard from './RecommendationCard';
import SectionHeader from './SectionHeader';

export default function CropDetailPagePremium({ crops, recommendationData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const crop = crops.find((item) => String(item.id) === id);
  const cropDetail = recommendationData?.cropDetails?.find((item) => String(item.cropId) === id) || null;

  if (!crop) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 py-6 text-earth-900">
        <div className="mx-auto max-w-md space-y-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-[14px] py-2 text-sm font-medium text-[#2F2F2F] shadow-sm backdrop-blur-md transition hover:bg-white/85"
          >
            ← {t('cropDetail.back')}
          </button>
          <AppCard>
            <p className="text-sm leading-6 text-earth-700">{t('cropDetail.notFound')}</p>
          </AppCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-14 pt-6 text-earth-900">
      <div className="mx-auto max-w-md space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-[14px] py-2 text-sm font-medium text-[#2F2F2F] shadow-sm backdrop-blur-md transition hover:bg-white/85 active:scale-95"
        >
          ← {t('cropDetail.back')}
        </button>

        <CropHeroPremium crop={crop} />

        <section className="space-y-4">
          <SectionHeader eyebrow={t('crop.progressEyebrow')} title={t('crop.progressTitle')} />
          <AppCard className="bg-white/92">
            <CropProgressIndicator stageName={crop.growthStage} />
          </AppCard>
        </section>

        <section className="-mt-1 grid grid-cols-3 gap-3">
          <CropStatusCard icon="🌙" label={t('dashboard.moon')} value={recommendationData?.lunarPhase || t('dashboard.loading')} tone="soft" />
          <CropStatusCard
            icon="🌧️"
            label={t('dashboard.weather')}
            value={
              recommendationData?.weather
                ? t('dashboard.temperature', {
                    condition: recommendationData.weather.condition,
                    value: recommendationData.weather.maxTemperature
                  })
                : t('dashboard.loading')
            }
            tone="sky"
          />
          <CropStatusCard
            icon="💧"
            label={t('register.waterAvailable')}
            value={crop.waterAvailable ? t('tracking.waterReady') : t('tracking.lowWater')}
            tone="leaf"
          />
        </section>

        <RecommendationCard
          title={t('cropDetail.mainAction')}
          message={cropDetail?.actionToday || recommendationData?.dailyFocus || t('dashboard.loading')}
        />

        <section className="space-y-4">
          <SectionHeader eyebrow={t('cropDetail.observeEyebrow')} title={t('cropDetail.observeTitle')} />
          <AppCard className="bg-white/92">
            <p className="text-sm leading-7 text-earth-700">{cropDetail?.fieldObservation || crop.expectedBehavior}</p>
          </AppCard>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow={t('cropDetail.tipsEyebrow')} title={t('cropDetail.tipsTitle')} />
          <div className="space-y-3">
            {cropDetail?.warnings?.length ? cropDetail.warnings.map((warning, index) => (
              <AppCard key={`${warning}-${index}`} className="bg-amber-50/95">
                <p className="text-sm leading-6 text-earth-700">{warning}</p>
              </AppCard>
            )) : (
              <AppCard className="bg-earth-50/95">
                <p className="text-sm leading-6 text-earth-700">{t('cropDetail.noWarnings')}</p>
              </AppCard>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
