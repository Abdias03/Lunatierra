import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AppCard from './AppCard';
import SectionHeader from './SectionHeader';

function buildInterpretation(weather, t) {
  if (!weather) {
    return t('weatherDetail.interpretation.loading');
  }

  if (weather.rainChance >= 70) {
    return t('weatherDetail.interpretation.rainHigh');
  }

  if (weather.humidity <= 40) {
    return t('weatherDetail.interpretation.dry');
  }

  if (weather.condition?.toLowerCase().includes('nubl')) {
    return t('weatherDetail.interpretation.cloudy');
  }

  return t('weatherDetail.interpretation.stable');
}

export default function WeatherDetailPage({ recommendationData, lunarData, locationLabel = 'San Luis Acatlán, Guerrero' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const weather = recommendationData?.weather;
  const interpretation = useMemo(() => buildInterpretation(weather, t), [weather, t]);
  const lunarActivities = lunarData?.activities?.slice(0, 3) || [];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-14 pt-6 text-earth-900">
      <div className="mx-auto max-w-md space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-[14px] py-2 text-sm font-medium text-[#2F2F2F] shadow-sm backdrop-blur-md transition hover:bg-white/85 active:scale-95"
        >
          ← {t('common.back')}
        </button>

        <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,_rgba(210,232,242,0.98)_0%,_rgba(255,255,255,0.94)_54%,_rgba(241,234,221,0.96)_100%)] p-5 shadow-[0_24px_50px_rgba(63,46,30,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{t('weatherDetail.headerEyebrow')}</p>
          <h1 className="mt-3 text-3xl font-semibold text-earth-900">{locationLabel}</h1>
          <p className="mt-2 text-sm leading-6 text-earth-700">{t('weatherDetail.headerSubtitle')}</p>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow={t('weatherDetail.weatherEyebrow')} title={t('weatherDetail.weatherTitle')} />
          <div className="grid grid-cols-3 gap-3">
            <AppCard className="bg-white/92 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{t('weatherDetail.temperature')}</p>
              <p className="mt-3 text-2xl font-semibold text-earth-900">{weather?.maxTemperature ?? '--'}°</p>
            </AppCard>
            <AppCard className="bg-white/92 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{t('weatherDetail.humidity')}</p>
              <p className="mt-3 text-2xl font-semibold text-earth-900">{weather?.humidity ?? '--'}%</p>
            </AppCard>
            <AppCard className="bg-white/92 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{t('weatherDetail.rain')}</p>
              <p className="mt-3 text-2xl font-semibold text-earth-900">{weather?.rainChance ?? '--'}%</p>
            </AppCard>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow={t('weatherDetail.interpretationEyebrow')} title={t('weatherDetail.interpretationTitle')} />
          <AppCard className="bg-[linear-gradient(160deg,_rgba(255,255,255,0.96)_0%,_rgba(244,239,229,0.96)_100%)]">
            <p className="text-sm leading-7 text-earth-800">{interpretation}</p>
          </AppCard>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow={t('weatherDetail.lunarEyebrow')} title={t('weatherDetail.lunarTitle')} />
          <AppCard className="bg-[linear-gradient(160deg,_rgba(241,246,252,0.98)_0%,_rgba(255,255,255,0.94)_100%)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{t('weatherDetail.phase')}</p>
            <p className="mt-2 text-xl font-semibold text-earth-900">{lunarData?.displayName || (recommendationData?.lunarPhase ? t(`lunarPhases.${recommendationData.lunarPhase}`, { defaultValue: recommendationData.lunarPhase }) : '—')}</p>
            <div className="mt-4 space-y-3">
              {lunarActivities.map((activity, index) => (
                <div key={`${activity}-${index}`} className="flex items-start gap-3 rounded-[20px] bg-white/90 px-4 py-3">
                  <span className="mt-0.5 text-lg">🌱</span>
                  <p className="text-sm leading-6 text-earth-800">{activity}</p>
                </div>
              ))}
              {!lunarActivities.length ? (
                <div className="rounded-[20px] bg-white/90 px-4 py-3">
                  <p className="text-sm leading-6 text-earth-800">{t('weatherDetail.lunarEmpty')}</p>
                </div>
              ) : null}
            </div>
          </AppCard>
        </section>
      </div>
    </main>
  );
}
