import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { askQuestion, createCrop, fetchCrops, fetchRecommendations } from './api';
import AppCard from './components/AppCard';
import BottomNav from './components/BottomNav';
import CropCard from './components/CropCard';
import CropDetailPagePremium from './components/CropDetailPagePremium';
import CropFormI18n from './components/CropFormI18n';
import HighlightCard from './components/HighlightCard';
import LanguageSwitcher from './components/LanguageSwitcher';
import QuickQuestionI18n from './components/QuickQuestionI18n';
import RecommendationListI18n from './components/RecommendationListI18n';
import SectionHeader from './components/SectionHeader';

function InfoCard({ icon, label, value, tone = 'soft' }) {
  const tones = {
    soft: 'bg-white/88 text-earth-900',
    sky: 'bg-sky-100 text-sky-700',
    leaf: 'bg-leaf-100 text-leaf-700'
  };

  return (
    <AppCard className={`${tones[tone]} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{label}</p>
          <p className="mt-2 text-lg font-semibold text-current">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </AppCard>
  );
}

export default function AppMobile() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState('home');
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
      setCurrentScreen('crops');
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
  const navLabels = {
    home: t('nav.home'),
    crops: t('nav.crops'),
    add: t('nav.add'),
    questions: t('nav.questions')
  };

  const renderHome = () => (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-earth-500">{t('dashboard.brand')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-earth-900">{t('app.greeting')}</h1>
          <p className="mt-1 text-sm leading-6 text-earth-700">{t('home.welcome')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon="🌧️"
          label={t('dashboard.weather')}
          value={weather ? t('dashboard.temperature', { condition: weather.condition, value: weather.maxTemperature }) : t('dashboard.loading')}
          tone="soft"
        />
        <InfoCard
          icon="🌙"
          label={t('dashboard.moon')}
          value={recommendationData?.lunarPhase || t('dashboard.loading')}
          tone="soft"
        />
      </div>

      <HighlightCard recommendationData={recommendationData} onOpenQuestions={() => setCurrentScreen('questions')} />

      <section className="space-y-4">
        <SectionHeader
          eyebrow={t('summary.eyebrow')}
          title={t('summary.title')}
          action={
            <button
              type="button"
              onClick={() => setCurrentScreen('crops')}
              className="rounded-full bg-earth-100 px-4 py-2 text-xs font-semibold text-earth-700 transition hover:bg-earth-50 active:scale-95"
            >
              {t('summary.viewAll')}
            </button>
          }
        />

        {crops.length ? (
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
            {crops.map((crop) => (
              <div key={crop.id} className="snap-start">
                <CropCard crop={crop} compact />
              </div>
            ))}
          </div>
        ) : (
          <AppCard className="bg-earth-50/90">
            <p className="text-sm leading-6 text-earth-700">{t('summary.empty')}</p>
          </AppCard>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow={t('recommendations.title')} title={t('home.moreActions')} />
        <RecommendationListI18n items={recommendationData?.recommendations || []} />
      </section>
    </div>
  );

  const renderCrops = () => (
    <div className="space-y-5">
      <header className="space-y-2">
        <SectionHeader eyebrow={t('tracking.title')} title={t('tracking.subtitle')} />
        <p className="text-sm leading-6 text-earth-700">{t('crops.description')}</p>
      </header>

      {crops.length ? (
        <div className="space-y-4">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <AppCard className="bg-earth-50/90">
          <p className="text-sm leading-6 text-earth-700">{t('tracking.empty')}</p>
        </AppCard>
      )}
    </div>
  );

  const renderAdd = () => (
    <div className="space-y-5">
      <header className="space-y-2">
        <SectionHeader eyebrow={t('register.title')} title={t('register.subtitle')} />
        <p className="text-sm leading-6 text-earth-700">{t('register.description')}</p>
      </header>

      <AppCard className="bg-white/92">
        <CropFormI18n onSubmit={handleCreateCrop} loading={savingCrop} />
      </AppCard>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-5">
      <header className="space-y-2">
        <SectionHeader eyebrow={t('quickQuestion.title')} title={t('quickQuestion.subtitle')} />
        <p className="text-sm leading-6 text-earth-700">{t('quickQuestion.description')}</p>
      </header>

      <AppCard className="bg-[linear-gradient(160deg,_rgba(214,237,243,0.95)_0%,_rgba(255,255,255,0.92)_100%)]">
        <QuickQuestionI18n onAsk={handleQuestion} loading={asking} answer={answer} />
      </AppCard>
    </div>
  );

  const shell = (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-28 pt-6 text-earth-900">
      <div className="mx-auto max-w-md">
        <div className="space-y-5">
          {error ? (
            <AppCard className="border-rose-200 bg-rose-50/90 p-4">
              <p className="text-sm leading-6 text-rose-700">{error}</p>
            </AppCard>
          ) : null}

          {currentScreen === 'home' ? renderHome() : null}
          {currentScreen === 'crops' ? renderCrops() : null}
          {currentScreen === 'add' ? renderAdd() : null}
          {currentScreen === 'questions' ? renderQuestions() : null}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} onChange={setCurrentScreen} labels={navLabels} />
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={shell} />
      <Route path="/crop/:id" element={<CropDetailPagePremium crops={crops} recommendationData={recommendationData} />} />
    </Routes>
  );
}
