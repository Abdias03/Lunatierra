import { useEffect, useState } from 'react';
import { askQuestion, createCrop, fetchCrops, fetchRecommendations } from './api';
import CropForm from './components/CropForm';
import CropTrackingList from './components/CropTrackingList';
import QuickQuestion from './components/QuickQuestion';
import RecommendationList from './components/RecommendationList';
import SectionCard from './components/SectionCard';

function StatPill({ label, value }) {
  return (
    <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-white/60">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-earth-900">{value}</p>
    </div>
  );
}

export default function App() {
  const [crops, setCrops] = useState([]);
  const [recommendationData, setRecommendationData] = useState(null);
  const [savingCrop, setSavingCrop] = useState(false);
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      const [cropData, recommendationResponse] = await Promise.all([
        fetchCrops(),
        fetchRecommendations(),
      ]);
      setCrops(cropData);
      setRecommendationData(recommendationResponse);
    } catch {
      setError('Could not load the farm data. Please confirm the backend is running.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCrop = async (payload) => {
    try {
      setSavingCrop(true);
      setError('');
      await createCrop(payload);
      await loadData();
    } catch {
      setError('The crop could not be registered. Check the date and try again.');
    } finally {
      setSavingCrop(false);
    }
  };

  const handleQuestion = async (question) => {
    try {
      setAsking(true);
      const response = await askQuestion(question);
      setAnswer(response.answer);
    } catch {
      setAnswer('The question service is unavailable right now.');
    } finally {
      setAsking(false);
    }
  };

  const weather = recommendationData?.weather;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(214,237,243,0.9),_rgba(247,242,231,0.9)_45%,_#f0e6d6_100%)] px-4 py-6 text-earth-900">
      <div className="mx-auto max-w-xl space-y-5">
        <header className="rounded-[32px] bg-earth-900 px-5 py-6 text-white shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-earth-100">Lunatierra</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight">What should I do today?</h1>
          <p className="mt-3 text-sm leading-6 text-earth-100">
            Practical daily guidance for small farmers, based on crop stage, weather, and moon cycle.
          </p>

          {recommendationData ? (
            <div className="mt-5 rounded-[28px] bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-100">Daily focus</p>
              <p className="mt-2 text-xl font-semibold">{recommendationData.dailyFocus}</p>
            </div>
          ) : null}
        </header>

        {error ? <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <section className="grid grid-cols-2 gap-3">
          <StatPill label="Moon" value={recommendationData?.lunarPhase || 'Loading...'} />
          <StatPill label="Weather" value={weather ? `${weather.condition}, ${weather.maxTemperature}°C` : 'Loading...'} />
          <StatPill label="Rain" value={weather ? `${weather.rainChance}% chance` : '...'} />
          <StatPill label="Humidity" value={weather ? `${weather.humidity}%` : '...'} />
        </section>

        <SectionCard title="Recommendations" subtitle="Clear actions for today" icon="🌱">
          <RecommendationList items={recommendationData?.recommendations || []} />
        </SectionCard>

        <SectionCard title="Register Crop" subtitle="Add a crop to start tracking" icon="📝">
          <CropForm onSubmit={handleCreateCrop} loading={savingCrop} />
        </SectionCard>

        <SectionCard title="Crop Tracking" subtitle="Stage, behavior, and field follow-up" icon="🌾">
          <CropTrackingList crops={crops} />
        </SectionCard>

        <SectionCard title="Quick Question" subtitle="Simple predefined support" icon="💬">
          <QuickQuestion onAsk={handleQuestion} loading={asking} answer={answer} />
        </SectionCard>
      </div>
    </main>
  );
}
