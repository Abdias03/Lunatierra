import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppCard from './AppCard';
import SectionHeader from './SectionHeader';

function buildInterpretation(weather) {
  if (!weather) {
    return 'Hoy el clima se sigue actualizando. En un momento te diremos qué hacer.';
  }

  if (weather.rainChance >= 70) {
    return 'Hoy hay alta probabilidad de lluvia. Evita aplicar pesticidas.';
  }

  if (weather.humidity <= 40) {
    return 'Hoy el ambiente se siente seco. Revisa la humedad del suelo antes de regar.';
  }

  if (weather.condition?.toLowerCase().includes('nubl')) {
    return 'Hoy el clima está más suave. Aprovecha para revisar tu planta con calma.';
  }

  return 'Hoy el clima se ve estable. Una revisión ligera será suficiente.';
}

export default function WeatherDetailPage({ recommendationData, lunarData, locationLabel = 'San Luis Acatlán, Guerrero' }) {
  const navigate = useNavigate();
  const weather = recommendationData?.weather;
  const interpretation = useMemo(() => buildInterpretation(weather), [weather]);
  const lunarActivities = lunarData?.activities?.slice(0, 3) || [];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-14 pt-6 text-earth-900">
      <div className="mx-auto max-w-md space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-[14px] py-2 text-sm font-medium text-[#2F2F2F] shadow-sm backdrop-blur-md transition hover:bg-white/85 active:scale-95"
        >
          ← Volver
        </button>

        <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,_rgba(210,232,242,0.98)_0%,_rgba(255,255,255,0.94)_54%,_rgba(241,234,221,0.96)_100%)] p-5 shadow-[0_24px_50px_rgba(63,46,30,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">Clima de hoy</p>
          <h1 className="mt-3 text-3xl font-semibold text-earth-900">{locationLabel}</h1>
          <p className="mt-2 text-sm leading-6 text-earth-700">Mira el clima y la luna para decidir mejor qué hacer hoy.</p>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow="🌧️ Panorama" title="Weather" />
          <div className="grid grid-cols-3 gap-3">
            <AppCard className="bg-white/92 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">Temperatura</p>
              <p className="mt-3 text-2xl font-semibold text-earth-900">{weather?.maxTemperature ?? '--'}°</p>
            </AppCard>
            <AppCard className="bg-white/92 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">Humedad</p>
              <p className="mt-3 text-2xl font-semibold text-earth-900">{weather?.humidity ?? '--'}%</p>
            </AppCard>
            <AppCard className="bg-white/92 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">Lluvia</p>
              <p className="mt-3 text-2xl font-semibold text-earth-900">{weather?.rainChance ?? '--'}%</p>
            </AppCard>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow="☀️ Lectura simple" title="Interpretación" />
          <AppCard className="bg-[linear-gradient(160deg,_rgba(255,255,255,0.96)_0%,_rgba(244,239,229,0.96)_100%)]">
            <p className="text-sm leading-7 text-earth-800">{interpretation}</p>
          </AppCard>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow="🌙 Luna" title="Lunar" />
          <AppCard className="bg-[linear-gradient(160deg,_rgba(241,246,252,0.98)_0%,_rgba(255,255,255,0.94)_100%)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">Fase</p>
            <p className="mt-2 text-xl font-semibold text-earth-900">{lunarData?.displayName || recommendationData?.lunarPhase || '—'}</p>
            <div className="mt-4 space-y-3">
              {lunarActivities.map((activity, index) => (
                <div key={`${activity}-${index}`} className="flex items-start gap-3 rounded-[20px] bg-white/90 px-4 py-3">
                  <span className="mt-0.5 text-lg">🌱</span>
                  <p className="text-sm leading-6 text-earth-800">{activity}</p>
                </div>
              ))}
              {!lunarActivities.length ? (
                <div className="rounded-[20px] bg-white/90 px-4 py-3">
                  <p className="text-sm leading-6 text-earth-800">Hoy basta con observar tu cultivo con calma.</p>
                </div>
              ) : null}
            </div>
          </AppCard>
        </section>
      </div>
    </main>
  );
}
