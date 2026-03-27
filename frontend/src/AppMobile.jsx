import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  askQuestion,
  checkInDaily,
  clearAuthSession,
  createCrop,
  fetchCropCatalog,
  fetchCrops,
  fetchLunarPhase,
  fetchRecommendations,
  getStoredUser,
  isGuestMode
} from './api';
import AppCard from './components/AppCard';
import AssistantBubble from './components/AssistantBubble';
import BottomNav from './components/BottomNav';
import CropCard from './components/CropCard';
import CropDetailPagePremium from './components/CropDetailPagePremium';
import CropFormI18n from './components/CropFormI18n';
import GoogleLoginButton from './components/GoogleLoginButton';
import LanguageSwitcher from './components/LanguageSwitcher';
import LunarCalendarPage from './components/LunarCalendarPage';
import OnboardingFlow from './components/OnboardingFlow';
import QuickQuestionI18n from './components/QuickQuestionI18n';
import SectionHeader from './components/SectionHeader';
import TodayFocusCard from './components/TodayFocusCard';
import WeatherDetailPage from './components/WeatherDetailPage';
import AdminAgricolaPage from './components/AdminAgricolaPage';

const LAST_CHECK_STORAGE_KEY = 'lunatierra-last-check-date';
const REMINDER_DISMISSED_STORAGE_KEY = 'lunatierra-reminder-dismissed-date';
const XP_STORAGE_KEY = 'lunatierra-xp';
const ACHIEVEMENTS_STORAGE_KEY = 'lunatierra-achievements';
const ONBOARDING_DONE_STORAGE_KEY = 'onboarding_completed';
const ONBOARDING_SUCCESS_KEY = 'lunatierra-onboarding-success';
const LOGIN_SUCCESS_KEY = 'lunatierra-login-success';

function getLevelFromXp(xp) {
  if (xp >= 200) {
    return { level: 4, currentXp: xp, previousThreshold: 200, nextThreshold: 200 };
  }

  if (xp >= 120) {
    return { level: 3, currentXp: xp, previousThreshold: 120, nextThreshold: 200 };
  }

  if (xp >= 50) {
    return { level: 2, currentXp: xp, previousThreshold: 50, nextThreshold: 120 };
  }

  return { level: 1, currentXp: xp, previousThreshold: 0, nextThreshold: 50 };
}

function triggerMicroFeedback() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(18);
  }

  if (typeof window === 'undefined') {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  try {
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(622, now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.018, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.18);
    oscillator.onended = () => {
      audioContext.close().catch(() => {});
    };
  } catch {
    // Keep the interaction silent if audio is unavailable.
  }
}

function InfoCard({ icon, label, value, tone = 'soft', onClick }) {
  const tones = {
    soft: 'bg-white/88 text-earth-900',
    sky: 'bg-sky-100 text-sky-700',
    leaf: 'bg-leaf-100 text-leaf-700'
  };

  const content = (
    <AppCard className={`${tones[tone]} p-4 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{label}</p>
          <p className="mt-2 text-lg font-semibold text-current">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </AppCard>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

function AchievementToast({ achievement, label }) {
  if (!achievement) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
      <div className="rounded-[24px] border border-amber-200/70 bg-[linear-gradient(160deg,_rgba(255,250,237,0.98)_0%,_rgba(246,238,217,0.98)_100%)] px-4 py-3 shadow-[0_18px_40px_rgba(92,72,24,0.16)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-earth-900">
          {achievement}
        </p>
      </div>
    </div>
  );
}

function ModalShell({ title, description, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 pb-6 pt-10 backdrop-blur-sm sm:items-center">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-sm rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(248,244,236,0.98)_100%)] p-5 shadow-[0_24px_80px_rgba(37,28,20,0.2)] animate-[fadeUp_0.22s_ease_forwards]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-earth-900">{title}</h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-earth-700">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-earth-100 px-3 py-1 text-sm font-medium text-earth-700 transition hover:bg-earth-200 active:scale-95"
          >
            ✕
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export default function AppMobile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [crops, setCrops] = useState([]);
  const [cropCatalog, setCropCatalog] = useState([]);
  const [recommendationData, setRecommendationData] = useState(null);
  const [lunarData, setLunarData] = useState(null);
  const [savingCrop, setSavingCrop] = useState(false);
  const [reviewingToday, setReviewingToday] = useState(false);
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [cropSortOrder, setCropSortOrder] = useState(() => localStorage.getItem('cropSortOrder') || 'DESC'); // Desc por defecto
  const [dismissedReminderDate, setDismissedReminderDate] = useState(
    () => localStorage.getItem(REMINDER_DISMISSED_STORAGE_KEY) || ''
  );
  const [xp, setXp] = useState(() => Number(localStorage.getItem(XP_STORAGE_KEY) || '0'));
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [activeAchievement, setActiveAchievement] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  const [onboardingComplete, setOnboardingComplete] = useState(
    () => localStorage.getItem(ONBOARDING_DONE_STORAGE_KEY) === 'true'
      || localStorage.getItem('lunatierra-onboarding-complete') === 'true'
  );
  const [onboardingSuccess, setOnboardingSuccess] = useState(
    () => localStorage.getItem(ONBOARDING_SUCCESS_KEY) || ''
  );
  const [loginSuccessMessage, setLoginSuccessMessage] = useState(
    () => localStorage.getItem(LOGIN_SUCCESS_KEY) || ''
  );

  const loadData = async () => {
    try {
      setError('');
      const [cropData, catalogResponse, recommendationResponse, lunarPhaseResponse] = await Promise.all([
        fetchCrops(),
        fetchCropCatalog(),
        fetchRecommendations(),
        fetchLunarPhase()
      ]);
      setCrops(cropData);
      setCropCatalog(catalogResponse);
      setRecommendationData(recommendationResponse);
      setLunarData(lunarPhaseResponse);
      setCurrentUser(getStoredUser());
    } catch {
      setError(t('errors.load'));
    } finally {
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cropSortOrder', cropSortOrder);
  }, [cropSortOrder]);

  useEffect(() => {
    if (localStorage.getItem('lunatierra-onboarding-complete') === 'true'
        && localStorage.getItem(ONBOARDING_DONE_STORAGE_KEY) !== 'true') {      localStorage.setItem(ONBOARDING_DONE_STORAGE_KEY, 'true');
    }
  }, []);

  useEffect(() => {
    if (!onboardingSuccess) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      localStorage.removeItem(ONBOARDING_SUCCESS_KEY);
      setOnboardingSuccess('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [onboardingSuccess]);

  useEffect(() => {
    if (!loginSuccessMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      localStorage.removeItem(LOGIN_SUCCESS_KEY);
      setLoginSuccessMessage('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [loginSuccessMessage]);

  useEffect(() => {
    const backendLastCheckDate = recommendationData?.dailyProgress?.lastCheckDate;

    if (backendLastCheckDate) {
      localStorage.setItem(LAST_CHECK_STORAGE_KEY, backendLastCheckDate);
    }
  }, [recommendationData]);

  useEffect(() => {
    if (!activeAchievement && achievementQueue.length) {
      setActiveAchievement(achievementQueue[0]);
      setAchievementQueue((current) => current.slice(1));
    }
  }, [achievementQueue, activeAchievement]);

  useEffect(() => {
    if (!activeAchievement) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveAchievement('');
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [activeAchievement]);

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
    console.log('AppMobile: handleQuestion called with:', question);
    try {
      console.log('AppMobile: Setting asking to true');
      setAsking(true);
      console.log('AppMobile: Calling askQuestion API');
      const response = await askQuestion(question);
      console.log('AppMobile: API response received:', response);
      setAnswer(response.answer);
      console.log('AppMobile: Answer set to:', response.answer);
    } catch (error) {
      console.error('AppMobile: Error in handleQuestion:', error);
      setAnswer(t('errors.questionUnavailable'));
    } finally {
      console.log('AppMobile: Setting asking to false');
      setAsking(false);
    }
  };

  const handleOnboardingSetup = async (payload) => {
    const createdCrop = await createCrop(payload);
    const [cropData, catalogResponse, recommendationResponse, lunarPhaseResponse] = await Promise.all([
      fetchCrops(),
      fetchCropCatalog(),
      fetchRecommendations(),
      fetchLunarPhase()
    ]);

    setCrops(cropData);
    setCropCatalog(catalogResponse);
    setRecommendationData(recommendationResponse);
    setLunarData(lunarPhaseResponse);
    return { createdCrop, cropData, recommendationResponse };
  };

  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_DONE_STORAGE_KEY, 'true');
    localStorage.removeItem('lunatierra-onboarding-complete');
    setOnboardingComplete(true);
    setCurrentScreen('home');
  };

  const handleOnboardingQuickStart = async (cropName) => {
    await createCrop({
      cropName,
      plantingDate: new Date().toISOString().slice(0, 10),
      waterAvailable: true
    });
    await loadData();
    localStorage.setItem(ONBOARDING_SUCCESS_KEY, t('onboarding.started'));
    setOnboardingSuccess(t('onboarding.started'));
    finishOnboarding();
  };

  const handleGoogleLoginSuccess = async (authResponse) => {
    setCurrentUser(authResponse?.user || getStoredUser());
    setError('');
    setLoginModalOpen(false);
    setProfileModalOpen(false);
    localStorage.setItem(LOGIN_SUCCESS_KEY, t('login.photosSaved'));
    setLoginSuccessMessage(t('login.photosSaved'));
    await loadData();
  };

  const handleGoogleLoginError = () => {
    setError(t('login.googleError'));
  };

  const handleTodayReview = async () => {
    try {
      setReviewingToday(true);
      setError('');
      const progress = await checkInDaily();
      const nextXp = xp + 10;
      localStorage.setItem(XP_STORAGE_KEY, String(nextXp));
      setXp(nextXp);
      const nextAchievements = [];

      if (!unlockedAchievements.includes(t('achievement.firstCare')) && progress?.streakCount >= 1) {
        nextAchievements.push(t('achievement.firstCare'));
      }

      if (!unlockedAchievements.includes(t('achievement.threeDays')) && progress?.streakCount >= 3) {
        nextAchievements.push(t('achievement.threeDays'));
      }

      if (!unlockedAchievements.includes(t('achievement.sevenDays')) && progress?.streakCount >= 7) {
        nextAchievements.push(t('achievement.sevenDays'));
      }

      if (!unlockedAchievements.includes(t('achievement.firstHealthyPlant')) && featuredCrop && getStatusScore(featuredCrop) === 1) {
        nextAchievements.push(t('achievement.firstHealthyPlant'));
      }

      if (nextAchievements.length) {
        const updatedAchievements = [...unlockedAchievements, ...nextAchievements];
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));
        setUnlockedAchievements(updatedAchievements);
        setAchievementQueue((current) => [...current, ...nextAchievements]);
      }

      triggerMicroFeedback();
      await loadData();
    } catch {
      setError(t('errors.dailyReview'));
    } finally {
      setReviewingToday(false);
    }
  };

  const weather = recommendationData?.weather;
  const progressProfile = getLevelFromXp(xp);
  const todayDate = new Date().toISOString().slice(0, 10);
  const lastCheckDate = recommendationData?.dailyProgress?.lastCheckDate
    || localStorage.getItem(LAST_CHECK_STORAGE_KEY)
    || '';
  const navLabels = {
    home: t('nav.home'),
    crops: t('nav.crops'),
    add: t('nav.add'),
    questions: t('nav.questions')
  };
  const cropsWithDetails = crops.map((crop) => ({
    crop,
    cropDetail: recommendationData?.cropDetails?.find((item) => item.cropId === crop.id) || null
  }));

  const getStatusScore = ({ crop, cropDetail }) => {
    if (!crop.waterAvailable || (cropDetail?.warnings?.length || 0) >= 2) {
      return 3;
    }

    if ((cropDetail?.warnings?.length || 0) === 1) {
      return 2;
    }

    return 1;
  };

  const featuredCrop = cropsWithDetails.length
    ? [...cropsWithDetails].sort((left, right) => {
        const scoreDifference = getStatusScore(right) - getStatusScore(left);

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        return left.crop.daysSincePlanting - right.crop.daysSincePlanting;
      })[0]
    : null;

  const getReminderMessage = () => {
    if (lastCheckDate === todayDate || recommendationData?.dailyProgress?.checkedToday) {
      return '';
    }

    if (!lastCheckDate) {
      return t('reminders.plantWaiting');
    }

    const lastCheck = new Date(`${lastCheckDate}T00:00:00`);
    const today = new Date(`${todayDate}T00:00:00`);
    const diffDays = Math.floor((today - lastCheck) / (1000 * 60 * 60 * 24));

    if (diffDays >= 3) {
      return t('reminders.plantRisk');
    }

    if (diffDays >= 2) {
      return t('reminders.plantAttention');
    }

    return t('reminders.plantWaiting');
  };

  const getInactivityRisk = () => {
    if (lastCheckDate === todayDate || recommendationData?.dailyProgress?.checkedToday) {
      return null;
    }

    if (!lastCheckDate) {
      return {
        tone: 'warm',
        badge: { label: t('reminders.todayTouch'), color: 'yellow' }
      };
    }

    const lastCheck = new Date(`${lastCheckDate}T00:00:00`);
    const today = new Date(`${todayDate}T00:00:00`);
    const diffDays = Math.floor((today - lastCheck) / (1000 * 60 * 60 * 24));

    if (diffDays >= 3) {
      return {
        tone: 'risk',
        badge: { label: t('reminders.softRisk'), color: 'red' }
      };
    }

    if (diffDays >= 2) {
      return {
        tone: 'alert',
        badge: { label: t('today.status.attention'), color: 'orange' }
      };
    }

    return {
      tone: 'warm',
      badge: { label: t('reminders.todayTouch'), color: 'yellow' }
    };
  };

  const reminderMessage = getReminderMessage();
  const inactivityRisk = getInactivityRisk();
  const showReminderBanner = Boolean(reminderMessage) && dismissedReminderDate !== todayDate;
  const shouldShowSavePrompt = onboardingComplete
    && isGuestMode()
    && (crops.length > 0 || progressProfile.currentXp >= 30 || (recommendationData?.dailyProgress?.streakCount ?? 0) >= 3);
  const assistantMessage = recommendationData?.dailyProgress?.checkedToday
    ? t('assistant.checkedToday')
    : showReminderBanner
      ? reminderMessage
      : recommendationData?.dailyMessage || t('assistant.defaultMessage');
  const assistantTone = recommendationData?.dailyProgress?.checkedToday
    ? 'leaf'
    : showReminderBanner
      ? (inactivityRisk?.tone || 'warm')
      : 'calm';
  const assistantIcon = recommendationData?.dailyProgress?.checkedToday ? '🌙' : '🌱';

  const dismissReminder = () => {
    localStorage.setItem(REMINDER_DISMISSED_STORAGE_KEY, todayDate);
    setDismissedReminderDate(todayDate);
  };

  const handleLogout = async () => {
    clearAuthSession();
    setCurrentUser(null);
    setProfileModalOpen(false);
    await loadData();
  };

  const renderAuthAction = () => {
    if (currentUser) {
      return (
        <button
          type="button"
          onClick={() => setProfileModalOpen(true)}
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/80 shadow-[0_8px_20px_rgba(43,32,22,0.12)] backdrop-blur transition hover:bg-white active:scale-95"
          aria-label={t('profile.avatarAlt')}
        >
          {currentUser.picture ? (
            <img src={currentUser.picture} alt={currentUser.name || t('profile.avatarAlt')} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg">👤</span>
          )}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setLoginModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-earth-900 shadow-[0_10px_24px_rgba(43,32,22,0.14)] transition hover:bg-earth-50 active:scale-95"
      >
        <span>{t('login.signIn')}</span>
        <span aria-hidden="true">🌱</span>
      </button>
    );
  };

  const shouldShowOnboarding = dataLoaded && !onboardingComplete && crops.length === 0;

  const renderHome = () => (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-earth-500">{t('dashboard.brand')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-earth-900">{t('app.greeting')}</h1>
          <p className="mt-1 text-sm leading-6 text-earth-700">{t('home.welcome')}</p>
          {currentUser?.name ? (
            <p className="mt-2 text-xs font-medium text-earth-500">
              {currentUser.name}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {renderAuthAction()}
        </div>
      </header>

      <AssistantBubble
        icon={assistantIcon}
        name="Luno"
        message={assistantMessage}
        tone={assistantTone}
        badge={showReminderBanner ? inactivityRisk?.badge : null}
        dismissible={showReminderBanner}
        onDismiss={dismissReminder}
      />

      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon="🌧️"
          label={t('dashboard.weather')}
          value={weather ? t('dashboard.temperature', { condition: weather.condition, value: weather.maxTemperature }) : t('dashboard.loading')}
          tone="soft"
          onClick={() => navigate('/weather')}
        />
        <InfoCard
          icon="🌙"
          label={t('dashboard.moon')}
          value={recommendationData?.lunarPhase ? t(`lunarPhases.${recommendationData.lunarPhase}`, { defaultValue: recommendationData.lunarPhase }) : t('dashboard.loading')}
          tone="soft"
          onClick={() => navigate('/lunar')}
        />
      </div>

      <TodayFocusCard
        crop={featuredCrop?.crop || null}
        cropDetail={featuredCrop?.cropDetail || null}
        recommendationData={recommendationData}
        progressProfile={progressProfile}
        reviewing={reviewingToday}
        onReview={handleTodayReview}
      />

      {shouldShowSavePrompt ? (
        <AppCard className="border border-leaf-100 bg-[linear-gradient(160deg,_rgba(248,252,242,0.98)_0%,_rgba(233,244,220,0.98)_100%)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{t('login.saveProgress')}</p>
          <p className="mt-2 text-sm font-medium leading-6 text-earth-900">
            {t('login.saveProgressDesc')}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-earth-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(48,36,24,0.18)] transition hover:bg-earth-800 active:scale-95"
            >
              <span>{t('login.continueWithGoogle')}</span>
              <span aria-hidden="true">🌿</span>
            </button>
          </div>
        </AppCard>
      ) : null}

      <section className="space-y-4">
        <SectionHeader
          eyebrow={t('summary.eyebrow')}
          title={t('summary.title')}
          action={(
            <button
              type="button"
              onClick={() => setCurrentScreen('crops')}
              className="rounded-full bg-earth-100 px-4 py-2 text-xs font-semibold text-earth-700 transition hover:bg-earth-50 active:scale-95"
            >
              {t('summary.viewAll')}
            </button>
          )}
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
    </div>
  );

  const renderCrops = () => {
    const sortedCrops = [...crops].sort((a, b) => {
      if (cropSortOrder === 'ASC') {
        return a.daysSincePlanting - b.daysSincePlanting;
      }
      return b.daysSincePlanting - a.daysSincePlanting;
    });

    return (
      <div className="space-y-5">
        <header className="space-y-2">
          <SectionHeader eyebrow={t('tracking.title')} title={t('tracking.subtitle')} />
          <p className="text-sm leading-6 text-earth-700">{t('crops.description')}</p>
        </header>

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
              {t('tracking.currentOrder', 'Orden actual')}: <strong>{cropSortOrder === 'DESC' ? t('tracking.sortDesc', 'Mayor a menor') : t('tracking.sortAsc', 'Menor a mayor')}</strong>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${cropSortOrder === 'DESC' ? 'bg-earth-900 text-white' : 'bg-white text-earth-900 ring-1 ring-earth-200'}`}
              onClick={() => setCropSortOrder('DESC')}
            >
              {t('tracking.sortDesc', 'Mayor a menor')}
            </button>
            <button
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${cropSortOrder === 'ASC' ? 'bg-earth-900 text-white' : 'bg-white text-earth-900 ring-1 ring-earth-200'}`}
              onClick={() => setCropSortOrder('ASC')}
            >
              {t('tracking.sortAsc', 'Menor a mayor')}
            </button>
          </div>
        </div>

        {sortedCrops.length ? (
          <div className="space-y-4">
            {sortedCrops.map((crop) => (
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
};

  const renderAdd = () => (
    <div className="space-y-5">
      <header className="space-y-2">
        <SectionHeader eyebrow={t('register.title')} title={t('register.subtitle')} />
        <p className="text-sm leading-6 text-earth-700">{t('register.description')}</p>
      </header>

      <AppCard className="bg-white/92">
        <CropFormI18n onSubmit={handleCreateCrop} loading={savingCrop} cropOptions={cropCatalog} />
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
      <AchievementToast achievement={activeAchievement} label={t('achievements.unlocked')} />
      <div className="mx-auto max-w-md">
        <div className="space-y-5">
          {error ? (
            <AppCard className="border-rose-200 bg-rose-50/90 p-4">
              <p className="text-sm leading-6 text-rose-700">{error}</p>
            </AppCard>
          ) : null}

          {onboardingSuccess ? (
            <AppCard className="border-leaf-200 bg-[linear-gradient(160deg,_rgba(244,252,238,0.98)_0%,_rgba(231,245,216,0.98)_100%)] p-4">
              <p className="text-sm font-medium leading-6 text-earth-900">{onboardingSuccess}</p>
            </AppCard>
          ) : null}

          {loginSuccessMessage ? (
            <AppCard className="success-toast-bloom border-leaf-200 bg-[linear-gradient(160deg,_rgba(244,252,238,0.98)_0%,_rgba(231,245,216,0.98)_100%)] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/75 text-lg shadow-[0_8px_18px_rgba(92,134,44,0.14)]">
                  🌱
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-700">
                    {t('login.progressSaved')}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-earth-900">{loginSuccessMessage}</p>
                </div>
              </div>
            </AppCard>
          ) : null}

          {currentScreen === 'home' ? renderHome() : null}
          {currentScreen === 'crops' ? renderCrops() : null}
          {currentScreen === 'add' ? renderAdd() : null}
          {currentScreen === 'questions' ? renderQuestions() : null}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} onChange={setCurrentScreen} labels={navLabels} />

      {loginModalOpen ? (
        <ModalShell
          title={t('login.saveProgress')}
          description={t('login.saveProgressDesc')}
          onClose={() => setLoginModalOpen(false)}
        >
          <GoogleLoginButton
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </ModalShell>
      ) : null}

      {profileModalOpen && currentUser ? (
        <ModalShell
          title={t('profile.title')}
          description={t('profile.description')}
          onClose={() => setProfileModalOpen(false)}
        >
          <div className="flex items-center gap-4 rounded-[24px] bg-earth-50/90 p-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-leaf-100">
              {currentUser.picture ? (
                <img src={currentUser.picture} alt={currentUser.name || t('profile.avatarAlt')} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-earth-900">{currentUser.name || t('profile.account')}</p>
              <p className="text-sm text-earth-600">{currentUser.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 w-full rounded-full bg-earth-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(48,36,24,0.16)] transition hover:bg-earth-800 active:scale-95"
          >
            {t('profile.logout')}
          </button>
        </ModalShell>
      ) : null}
    </main>
  );

  return (
    <Routes key={language}>
      <Route
        path="/"
        element={shouldShowOnboarding ? (
          <OnboardingFlow
            cropOptions={cropCatalog}
            onSetupComplete={handleOnboardingSetup}
            onQuickStart={handleOnboardingQuickStart}
            onFinish={finishOnboarding}
          />
        ) : shell}
      />
      <Route path="/weather" element={<WeatherDetailPage recommendationData={recommendationData} lunarData={lunarData} />} />
      <Route path="/lunar" element={<LunarCalendarPage lunarData={lunarData} />} />
      <Route path="/crop/:id" element={<CropDetailPagePremium crops={crops} recommendationData={recommendationData} />} />
      <Route path="/admin" element={<AdminAgricolaPage />} />
    </Routes>
  );
}
