import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { askQuestion, createCrop, fetchCrops, fetchRecommendations } from './api';
import CropFormI18n from './components/CropFormI18n';
import CropTrackingListI18n from './components/CropTrackingListI18n';
import LanguageSwitcher from './components/LanguageSwitcher';
import QuickQuestionI18n from './components/QuickQuestionI18n';
import RecommendationListI18n from './components/RecommendationListI18n';
import SectionCard from './components/SectionCard';

function StatPill({ label, value }) {
  return (
    <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-white/60">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-earth-900">{value}</p>
    </div>
  );
}

export default function AppI18n() {
  const { t } = useTranslation();
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
        fetchRecommendations()
      ]);
      setCrops(cropData);
      setRecommendationData(recommendationResponse);
    } catch {
      setError(t('errors.load'));
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
      setError(t('errors.saveCrop'));
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
      setAnswer(t('errors.questionUnavailable'));
    } finally {
      setAsking(false);
    }
  };

  const weather = recommendationData?.weather;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(214,237,243,0.9),_rgba(247,242,231,0.9)_45%,_#f0e6d6_100%)] px-4 py-6 text-earth-900">
      <div className="mx-auto max-w-xl space-y-5">
        <header className="rounded-[32px] bg-earth-900 px-5 py-6 text-white shadow-card">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-earth-100">{t('dashboard.brand')}</p>
            <LanguageSwitcher />
          </div>
          <h1 className="mt-3 font-serif text-3xl leading-tight">{t('dashboard.title')}</h1>
          <p className="mt-3 text-sm leading-6 text-earth-100">{t('dashboard.subtitle')}</p>

          {recommendationData ? (
            <div className="mt-5 rounded-[28px] bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-100">{t('dashboard.dailyFocus')}</p>
              <p className="mt-2 text-xl font-semibold">{recommendationData.dailyFocus}</p>
            </div>
          ) : null}
        </header>

        {error ? <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <section className="grid grid-cols-2 gap-3">
          <StatPill label={t('dashboard.moon')} value={recommendationData?.lunarPhase || t('dashboard.loading')} />
          <StatPill
            label={t('dashboard.weather')}
            value={weather ? t('dashboard.temperature', { condition: weather.condition, value: weather.maxTemperature }) : t('dashboard.loading')}
          />
          <StatPill label={t('dashboard.rain')} value={weather ? t('dashboard.rainChance', { value: weather.rainChance }) : '...'} />
          <StatPill label={t('dashboard.humidity')} value={weather ? `${weather.humidity}%` : '...'} />
        </section>

        <SectionCard title={t('recommendations.title')} subtitle={t('recommendations.subtitle')} icon="🌱">
          <RecommendationListI18n items={recommendationData?.recommendations || []} />
        </SectionCard>

        <SectionCard title={t('register.title')} subtitle={t('register.subtitle')} icon="📝">
          <CropFormI18n onSubmit={handleCreateCrop} loading={savingCrop} />
        </SectionCard>

        <SectionCard title={t('tracking.title')} subtitle={t('tracking.subtitle')} icon="🌾">
          <CropTrackingListI18n crops={crops} />
        </SectionCard>

        <SectionCard title={t('quickQuestion.title')} subtitle={t('quickQuestion.subtitle')} icon="💬">
          <QuickQuestionI18n onAsk={handleQuestion} loading={asking} answer={answer} />
        </SectionCard>
      </div>
    </main>
  );
}
