import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';
import RecommendationCard from '../recommendation/RecommendationCard';
import CropHeroPremium from './CropHeroPremium';
import CropStatusCard from './CropStatusCard';

export default function CropDetailPage({ crops, recommendationData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const crop = crops.find((item) => String(item.id) === id);
  const cropDetail = recommendationData.cropDetails.find((item) => String(item.cropId) === id) || null;

  if (!crop) {
    return (
      <main data-testid="crop-detail-page-legacy" className="crop-detail-page-legacy min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 py-6 text-earth-900">
        <div className="mx-auto max-w-md space-y-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-earth-700 shadow-sm transition hover:-translate-y-0.5"
          >
            ← {t('cropDetail.back')}
          </button>
          <Card>
            <p className="text-sm leading-6 text-earth-700">{t('cropDetail.notFound')}</p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="crop-detail-page-legacy" className="crop-detail-page-legacy min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-14 pt-6 text-earth-900">
      <div className="mx-auto max-w-md space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-earth-700 shadow-sm transition hover:-translate-y-0.5 active:scale-95"
        >
          ← {t('cropDetail.back')}
        </button>

        <CropHeroPremium crop={crop} />

        <section className="-mt-1 grid grid-cols-3 gap-3">
          <CropStatusCard icon="🌙" label={t('dashboard.moon')} value={recommendationData.lunarPhase ? t(`lunarPhases.${recommendationData.lunarPhase}`, { defaultValue: recommendationData.lunarPhase }) : t('dashboard.loading')} tone="soft" />
          <CropStatusCard
            icon="🌧️"
            label={t('dashboard.weather')}
            value={recommendationData.weather
              ? t('dashboard.temperature', {
                  condition: recommendationData.weather.condition,
                  value: recommendationData.weather.maxTemperature
                })
              : t('dashboard.loading')}
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
          message={cropDetail?.actionToday || recommendationData.dailyFocus || t('dashboard.loading')}
        />

        <section className="space-y-4">
          <SectionHeader eyebrow={t('cropDetail.observeEyebrow')} title={t('cropDetail.observeTitle')} />
          <Card className="bg-white/92">
            <p className="text-sm leading-7 text-earth-700">{cropDetail?.fieldObservation || crop.expectedBehavior}</p>
          </Card>
        </section>
      </div>
    </main>
  );
}
