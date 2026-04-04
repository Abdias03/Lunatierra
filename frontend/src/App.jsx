import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { askQuestion } from './api';
import { getCrops, addCrop } from './services/cropService';
import { getRecommendations } from './services/weatherService';
import CropForm from './components/cultivo/CropForm';
import CropTrackingList from './components/cultivo/CropTrackingList';
import QuickQuestion from './components/question/QuickQuestion';
import RecommendationList from './components/recommendation/RecommendationList';
import SectionCard from './components/shared/SectionCard';
import { STORAGE_KEYS } from './constants/storageKeys';

const { CROP_SORT_ORDER } = STORAGE_KEYS;

function StatPill({ label, value }) {
  return (
    <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-white/60">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-earth-900">{value}</p>
    </div>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [recommendationData, setRecommendationData] = useState(null);
  const [savingCrop, setSavingCrop] = useState(false);
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [cropSortOrder, setCropSortOrder] = useState(() => localStorage.getItem(CROP_SORT_ORDER) || 'DESC'); // Desc por defecto (mayor a menor)

  const loadData = async () => {
    try { setError('');
      const [cropData, recommendationResponse] = await Promise.all([ getCrops(), getRecommendations() ]);
      setCrops(cropData);
      setRecommendationData(recommendationResponse);
    } catch (err) {
      console.error('[App] loadData failed', err);
      setError('Could not load the farm data. Please confirm the backend is running.');
    }
  }; useEffect(() => { loadData();
  }, []); useEffect(() => {
    localStorage.setItem(CROP_SORT_ORDER, cropSortOrder);
  }, [cropSortOrder]);

  const handleCreateCrop = async (payload) => {
    try { setSavingCrop(true); setError('');
      await addCrop(payload);
      await loadData();
    } catch (err) {
      console.error('[App] handleCreateCrop failed', err);
      setError('The crop could not be registered. Check the date and try again.');
    } finally { setSavingCrop(false);
    }
  };

  const handleQuestion = async (question) => {
    try { setAsking(true);
      const response = await askQuestion(question); setAnswer(response.answer);
    } catch { setAnswer('The question service is unavailable right now.');
    } finally { setAsking(false);
    }
  };

  const weather = recommendationData.weather;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(214,237,243,0.9),_rgba(247,242,231,0.9)_45%,_#f0e6d6_100%)] px-4 py-6 text-earth-900">
      <div className="mx-auto max-w-xl space-y-5">
        <header className="rounded-[32px] bg-earth-900 px-5 py-6 text-white shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-earth-100">{t('dashboard.brand')}</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight">{t('dashboard.title')}</h1>
          <p className="mt-3 text-sm leading-6 text-earth-100">
            {t('dashboard.subtitle')}
          </p>

          {recommendationData ? (
            <div className="mt-5 rounded-[28px] bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-100">{t('highlight.eyebrow')}</p>
              <p className="mt-2 text-xl font-semibold">{recommendationData.dailyFocus}</p>
            </div>
          ) : null}
        </header>

        {error  <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <section className="grid grid-cols-2 gap-3">
          <StatPill label="Moon" value={recommendationData.lunarPhase || 'Loading...'} />
          <StatPill label="Weather" value={weather ? `${weather.condition}, ${weather.maxTemperature}°C` : 'Loading...'} />
          <StatPill label="Rain" value={weather ? `${weather.rainChance}% chance` : '...'} />
          <StatPill label="Humidity" value={weather ? `${weather.humidity}%` : '...'} />
        </section>

        <SectionCard title="Recommendations" subtitle="Clear actions for today" icon="🌱">
          <RecommendationList items={recommendationData.recommendations || []} />
        </SectionCard>

        <SectionCard title="Register Crop" subtitle="Add a crop to start tracking" icon="📝">
          <CropForm onSubmit={handleCreateCrop} loading={savingCrop} />
        </SectionCard>

        <SectionCard title="Crop Tracking" subtitle="Stage, behavior, and field follow-up" icon="🌾">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-earth-700">
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                {cropSortOrder === 'DESC' ? (
                  <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M5 12l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
              <span>
                Orden actual: <strong>{cropSortOrder === 'DESC' ? 'Mayor a menor' : 'Menor a mayor'}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-xs font-semibold ${cropSortOrder === 'DESC' ? 'bg-earth-900 text-white' : 'bg-white text-earth-900 ring-1 ring-earth-200'}`}
                onClick={() => setCropSortOrder('DESC')}
              >
                Mayor a menor
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-xs font-semibold ${cropSortOrder === 'ASC' ? 'bg-earth-900 text-white' : 'bg-white text-earth-900 ring-1 ring-earth-200'}`}
                onClick={() => setCropSortOrder('ASC')}
              >
                Menor a mayor
              </button>
            </div>
          </div>
          <CropTrackingList crops={crops} sortOrder={cropSortOrder} />
        </SectionCard>

        <SectionCard title="Quick Question" subtitle="Simple predefined support" icon="💬">
          <QuickQuestion onAsk={handleQuestion} loading={asking} answer={answer} />
        </SectionCard>
      </div>
    </main>
  );
}
