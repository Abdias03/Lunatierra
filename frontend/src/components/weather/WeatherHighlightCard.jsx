import { useTranslation } from 'react-i18next';
import Card from '../shared/Card';

function getMoonIcon(phase = '') {
  const normalized = phase.toLowerCase();

  if (normalized.includes('new')) return '🌑';
  if (normalized.includes('first') || normalized.includes('quarter')) return '🌓';
  if (normalized.includes('full')) return '🌕';
  if (normalized.includes('waning')) return '🌘';
  return '🌒';
}

export default function WeatherHighlightCard({ weather, lunarPhase, onOpenWeather, onOpenLunar }) {
  const { t } = useTranslation();

  return (
    <div data-testid="weather-highlight-card" className="weather-highlight-card grid grid-cols-2 gap-3">
      <button type="button" onClick={onOpenWeather} className="block w-full text-left">
        <Card className="premium-card-rise h-full overflow-hidden border border-white/80 bg-[linear-gradient(160deg,_rgba(251,255,247,0.98)_0%,_rgba(232,245,226,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(73,96,50,0.12)] transition duration-300 hover:-translate-y-0.5 active:scale-[0.98]">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#708364]">{t('dashboard.weather')}</p>
              <span className="text-2xl" aria-hidden="true">🌦️</span>
            </div>
            <div className="mt-6">
              <p className="text-[2.3rem] font-semibold leading-none text-[#1e2d18]">
                {weather ? `${weather.maxTemperature}°` : '--°'}
              </p>
              <p className="mt-2 text-sm font-medium text-[#55664d]">
                {weather?.condition || t('dashboard.loading')}
              </p>
            </div>
          </div>
        </Card>
      </button>

      <button type="button" onClick={onOpenLunar} className="block w-full text-left">
        <Card className="premium-card-rise h-full overflow-hidden border border-white/80 bg-[linear-gradient(160deg,_rgba(251,248,240,0.98)_0%,_rgba(239,230,215,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(76,63,44,0.12)] transition duration-300 hover:-translate-y-0.5 active:scale-[0.98]">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d715e]">{t('dashboard.moon')}</p>
              <span className="text-2xl" aria-hidden="true">{getMoonIcon(lunarPhase)}</span>
            </div>
            <div className="mt-6">
              <p className="text-lg font-semibold leading-6 text-[#1f201c]">
                {lunarPhase || t('dashboard.loading')}
              </p>
            </div>
          </div>
        </Card>
      </button>
    </div>
  );
}
