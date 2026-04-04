import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { askQuestion, checkInDaily, clearAuthSession, getStoredUser, isGuestMode } from './api';
import { useCrops } from './hooks/useCrops';
import { useWeather } from './hooks/useWeather';
import { AppStoreProvider, useAppStore } from './store/useAppStore';
import Card from './components/shared/Card';
import BottomNav from './components/shared/BottomNav';
import { STORAGE_KEYS } from './constants/storageKeys';
import CropCard from './components/cultivo/CropCard';
import CropDetailPagePremium from './components/cultivo/CropDetailPagePremium';
import CropFormI18n from './components/cultivo/CropFormI18n';
import FloatingMitziBubble from './components/assistant/FloatingMitziBubble';
import GoogleLoginButton from './components/auth/GoogleLoginButton';
import LunarCalendarPage from './components/lunar/LunarCalendarPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import QuickQuestionI18n from './components/question/QuickQuestionI18n';
import SectionHeader from './components/shared/SectionHeader';
import WeatherDetailPage from './components/weather/WeatherDetailPage';
import AdminAgricolaPage from './components/admin/AdminAgricolaPage';
import WeatherHighlightCard from './components/weather/WeatherHighlightCard';

const {
  LAST_CHECK_DATE: LAST_CHECK_STORAGE_KEY,
  REMINDER_DISMISSED_DATE: REMINDER_DISMISSED_STORAGE_KEY,
  XP,
  ACHIEVEMENTS: ACHIEVEMENTS_STORAGE_KEY,
  ONBOARDING_DONE,
  ONBOARDING_LEGACY_DONE,
  ONBOARDING_SUCCESS,
  LOGIN_SUCCESS,
  MITZI_COMPLETION,
  CROP_SORT_ORDER
} = STORAGE_KEYS;

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
            ×
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
  const {
    crops,
    catalog: cropCatalog,
    loadCrops,
    createNewCrop,
    loading: cropsLoading,
    error: cropsError,
    setError: setCropError
  } = useCrops();
  const {
    recommendations: recommendationData,
    lunarPhase: lunarData,
    loadWeather,
    loading: weatherLoading,
    error: weatherError,
    setError: setWeatherError
  } = useWeather();
  const { state, dispatch } = useAppStore();

  useEffect(() => {
    dispatch({ type: 'SET_CROPS', payload: crops });
  }, [crops, dispatch]);

  const [savingCrop, setSavingCrop] = useState(false);
  const [reviewingToday, setReviewingToday] = useState(false);
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [cropSortOrder, setCropSortOrder] = useState(() => localStorage.getItem(CROP_SORT_ORDER) || 'DESC'); // Desc por defecto
  const [dismissedReminderDate, setDismissedReminderDate] = useState( () => localStorage.getItem(REMINDER_DISMISSED_STORAGE_KEY) || ''
  );
  const [xp, setXp] = useState(() => Number(localStorage.getItem(XP) || '0'));
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
  const [language, setLanguage] = useState(i18n.language); useEffect(() => {
    const handleLanguageChange = (lng) => { setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  const [onboardingComplete, setOnboardingComplete] = useState(() => localStorage.getItem(ONBOARDING_DONE) === 'true'
      || localStorage.getItem(ONBOARDING_LEGACY_DONE) === 'true'
  );
  const [onboardingSuccess, setOnboardingSuccess] = useState(() => localStorage.getItem(ONBOARDING_SUCCESS) || '');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState(() => localStorage.getItem(LOGIN_SUCCESS) || '');
  const [mitziCelebrationVisible, setMitziCelebrationVisible] = useState(false);

  const loadData = async () => {
    setDataLoaded(false);
    setError('');

    try {
      await Promise.all([loadCrops(), loadWeather()]);
      setCurrentUser(getStoredUser());
    } catch (err) {
      console.error('[AppMobile] loadData failed', err);
      setError(t('errors.load'));
    } finally {
      setDataLoaded(true);
    }
  }; useEffect(() => { loadData();
  }, [language]); useEffect(() => {
    localStorage.setItem(CROP_SORT_ORDER, cropSortOrder);
  }, [cropSortOrder]); useEffect(() => {
    if (localStorage.getItem(ONBOARDING_LEGACY_DONE) === 'true'
        && localStorage.getItem(ONBOARDING_DONE) !== 'true') {
      localStorage.setItem(ONBOARDING_DONE, 'true');
    }
  }, []); useEffect(() => {
    if (!onboardingSuccess) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      localStorage.removeItem(ONBOARDING_SUCCESS); setOnboardingSuccess('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [onboardingSuccess]); useEffect(() => {
    if (!loginSuccessMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      localStorage.removeItem(LOGIN_SUCCESS); setLoginSuccessMessage('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [loginSuccessMessage]); useEffect(() => {
    if (!mitziCelebrationVisible) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setMitziCelebrationVisible(false);
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [mitziCelebrationVisible]); useEffect(() => {
    const backendLastCheckDate = recommendationData?.dailyProgress?.lastCheckDate;

    if (backendLastCheckDate) {
      localStorage.setItem(LAST_CHECK_STORAGE_KEY, backendLastCheckDate);
    }
  }, [recommendationData]); useEffect(() => {
    if (!activeAchievement && achievementQueue.length) { setActiveAchievement(achievementQueue[0]); setAchievementQueue((current) => current.slice(1));
    }
  }, [achievementQueue, activeAchievement]); useEffect(() => {
    if (!activeAchievement) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => { setActiveAchievement('');
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [activeAchievement]);

  const handleCreateCrop = async (payload) => {
    try { setSavingCrop(true); setError('');
      await createNewCrop(payload);
      await loadData(); setCurrentScreen('crops');
    } catch { setError(t('errors.saveCrop'));
    } finally { setSavingCrop(false);
    }
  };

  const handleQuestion = async (question) => {
    console.log('AppMobile: handleQuestion called with:', question);
    try {
      console.log('AppMobile: Setting asking to true'); setAsking(true);
      console.log('AppMobile: Calling askQuestion API');
      const response = await askQuestion(question);
      console.log('AppMobile: API response received:', response); setAnswer(response.answer);
      console.log('AppMobile: Answer set to:', response.answer);
    } catch (error) {
      console.error('AppMobile: Error in handleQuestion:', error); setAnswer(t('errors.questionUnavailable'));
    } finally {
      console.log('AppMobile: Setting asking to false'); setAsking(false);
    }
  };

  const handleOnboardingSetup = async (payload) => {
    const createdCrop = await createNewCrop(payload);
    await Promise.all([loadCrops(), loadWeather()]);
    return { createdCrop };
  };

  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_DONE, 'true');
    localStorage.removeItem(ONBOARDING_LEGACY_DONE);
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
    localStorage.setItem(ONBOARDING_SUCCESS, t('onboarding.started')); setOnboardingSuccess(t('onboarding.started')); finishOnboarding();
  };

  const handleGoogleLoginSuccess = async (authResponse) => { setCurrentUser(authResponse.user || getStoredUser()); setError(''); setLoginModalOpen(false);
    localStorage.setItem(LOGIN_SUCCESS, t('login.photosSaved')); setLoginSuccessMessage(t('login.photosSaved'));
    await loadData();
  };

  const handleGoogleLoginError = () => { setError(t('login.googleError'));
  };

  const handleTodayReview = async () => {
    try { setReviewingToday(true); setError('');
      const progress = await checkInDaily();
      const nextXp = xp + 10;
      localStorage.setItem(MITZI_COMPLETION, new Date().toISOString());
      localStorage.setItem(XP, String(nextXp)); setXp(nextXp);
      const nextAchievements = [];

      if (!unlockedAchievements.includes(t('achievement.firstCare')) && progress.streakCount >= 1) {
        nextAchievements.push(t('achievement.firstCare'));
      }

      if (!unlockedAchievements.includes(t('achievement.threeDays')) && progress.streakCount >= 3) {
        nextAchievements.push(t('achievement.threeDays'));
      }

      if (!unlockedAchievements.includes(t('achievement.sevenDays')) && progress.streakCount >= 7) {
        nextAchievements.push(t('achievement.sevenDays'));
      }

      if (!unlockedAchievements.includes(t('achievement.firstHealthyPlant')) && featuredCrop && getStatusScore(featuredCrop) === 1) {
        nextAchievements.push(t('achievement.firstHealthyPlant'));
      }

      if (nextAchievements.length) {
        const updatedAchievements = [...unlockedAchievements, ...nextAchievements];
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements)); setUnlockedAchievements(updatedAchievements); setAchievementQueue((current) => [...current, ...nextAchievements]);
      } setMitziCelebrationVisible(true); triggerMicroFeedback();
      await loadData();
    } catch { setError(t('errors.dailyReview'));
    } finally { setReviewingToday(false);
    }
  };

  const weather = recommendationData?.weather;
  const progressProfile = getLevelFromXp(xp);
  const streakCount = recommendationData?.dailyProgress?.streakCount ?? 0;
  const todayDate = new Date().toISOString().slice(0, 10);
  const lastCheckDate = recommendationData?.dailyProgress?.lastCheckDate
    || localStorage.getItem(LAST_CHECK_STORAGE_KEY)
    || '';
  const navLabels = {
    home: t('nav.home'),
    crops: t('nav.crops'),
    add: t('nav.add'),
    questions: t('nav.questions'),
    profile: t('profile.account')
  };
  const cropsWithDetails = crops.map((crop) => ({
    crop,
    cropDetail: recommendationData?.cropDetails?.find((item) => item.cropId === crop.id) || null
  }));

  const getStatusScore = ({ crop, cropDetail }) => {
    const warningCount = cropDetail?.warnings?.length || 0;

    if (!crop.waterAvailable || warningCount >= 2) {
      return 3;
    }

    if (warningCount === 1) {
      return 2;
    }

    return 1;
  };

  const featuredCrop = cropsWithDetails.length
    ?
     [...cropsWithDetails].sort((left, right) => {
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
  const checkedToday = recommendationData?.dailyProgress?.checkedToday;
  const mitziReminderTime = localStorage.getItem(MITZI_COMPLETION) || '';
  const companionMood = mitziCelebrationVisible
    ? 'happy'
    : showReminderBanner
      ? 'worried'
      : 'neutral';
  const companionLevel = progressProfile.level;
  const shouldDelayMitziUntilPreferredHour = (() => {
    if (!mitziReminderTime || checkedToday) {
      return false;
    }

    const completionDate = new Date(mitziReminderTime);

    if (Number.isNaN(completionDate.getTime())) {
      return false;
    }

    if (completionDate.toISOString().slice(0, 10) === todayDate) {
      return false;
    }

    return new Date().getHours() < completionDate.getHours();
  })();
  const mitziMessage = mitziCelebrationVisible
    ? t('mitzi.successMessage')
    : showReminderBanner
      ? t('mitzi.worriedMessage')
      : recommendationData?.dailyMessage || t('mitzi.neutralMessage');
  const shouldShowMitziBubble = currentScreen === 'home'
    && Boolean(featuredCrop?.crop)
    && (mitziCelebrationVisible || (!checkedToday && !shouldDelayMitziUntilPreferredHour));

  const dismissReminder = () => {
    localStorage.setItem(REMINDER_DISMISSED_STORAGE_KEY, todayDate); setDismissedReminderDate(todayDate);
  };

  const handleLogout = async () => { clearAuthSession(); setCurrentUser(null);
    await loadData();
  };


  const shouldShowOnboarding = dataLoaded && !onboardingComplete && crops.length === 0;

  const renderHome = () => (
    <div className="space-y-5">
      <header className="sticky top-3 z-30 -mx-1 rounded-[28px] border border-white/75 bg-[linear-gradient(180deg,_rgba(255,255,255,0.92)_0%,_rgba(247,243,235,0.94)_100%)] px-4 py-3 shadow-[0_18px_38px_rgba(58,43,30,0.10)] backdrop-blur">
        <div className="flex items-center justify-center gap-3">
          <div className="inline-flex rounded-full bg-earth-50 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            {[
              { code: 'es', label: `🇲🇽 ${t('language.spanish')}` },
              { code: 'en', label: `🇺🇸 ${t('language.english')}` }
            ].map((option) => {
              const active = language.startsWith(option.code);

              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => i18n.changeLanguage(option.code)}
                  className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition ${
                    active ? 'bg-[#6FAE4F] text-white shadow-[0_8px_18px_rgba(111,174,79,0.20)]' : 'text-earth-700'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="grid min-w-[280px] grid-cols-3 gap-2">
            <div className="rounded-[18px] bg-earth-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-earth-500">{t('stats.streak')}</p>
              <p className="mt-1 text-sm font-semibold text-earth-900">{streakCount}</p>
            </div>
            <div className="rounded-[18px] bg-earth-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-earth-500">XP</p>
              <p className="mt-1 text-sm font-semibold text-earth-900">{progressProfile.currentXp}</p>
            </div>
            <div className="rounded-[18px] bg-earth-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-earth-500">{t('stats.level')}</p>
              <p className="mt-1 text-sm font-semibold text-earth-900">
                {t('today.levelValue', { value: progressProfile.level })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <WeatherHighlightCard
        weather={weather}
        lunarPhase={recommendationData?.lunarPhase ? t(`lunarPhases.${recommendationData.lunarPhase}`, { defaultValue: recommendationData.lunarPhase }) : t('dashboard.loading')}
        onOpenWeather={() => navigate('/weather')}
        onOpenLunar={() => navigate('/lunar')}
      />

      {shouldShowSavePrompt ? (
        <Card className="border border-leaf-100 bg-[linear-gradient(160deg,_rgba(248,252,242,0.98)_0%,_rgba(233,244,220,0.98)_100%)]">
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
              <span aria-hidden="true">🌱</span>
            </button>
          </div>
        </Card>
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
          <Card className="bg-earth-50/90">
            <p className="text-sm leading-6 text-earth-700">{t('summary.empty')}</p>
          </Card>
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
        <Card className="bg-earth-50/90">
          <p className="text-sm leading-6 text-earth-700">{t('tracking.empty')}</p>
        </Card>
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

      <Card className="bg-white/92">
        <CropFormI18n onSubmit={handleCreateCrop} loading={savingCrop} cropOptions={cropCatalog} />
      </Card>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-5">
      <header className="space-y-2">
        <SectionHeader eyebrow={t('quickQuestion.title')} title={t('quickQuestion.subtitle')} />
        <p className="text-sm leading-6 text-earth-700">{t('quickQuestion.description')}</p>
      </header>

      <Card className="bg-[linear-gradient(160deg,_rgba(214,237,243,0.95)_0%,_rgba(255,255,255,0.92)_100%)]">
        <QuickQuestionI18n onAsk={handleQuestion} loading={asking} answer={answer} />
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-5">
      <header className="space-y-2">
        <SectionHeader eyebrow={t('profile.title')} title={currentUser ? (currentUser.name || t('profile.account')) : t('login.saveProgress')} />
        <p className="text-sm leading-6 text-earth-700">
          {currentUser ? t('profile.description') : t('login.saveProgressDesc')}
        </p>
      </header>

      {currentUser ? (
        <Card className="bg-white/92">
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
        </Card>
      ) : (
        <Card className="bg-white/92">
          <GoogleLoginButton
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </Card>
      )}
    </div>
  );

  const shell = (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-28 pt-6 text-earth-900">
      <AchievementToast achievement={activeAchievement} label={t('achievements.unlocked')} />
      <div className="mx-auto max-w-md">
        <div className="space-y-5">
          {error ? (
            <Card className="border-rose-200 bg-rose-50/90 p-4">
              <p className="text-sm leading-6 text-rose-700">{error}</p>
            </Card>
          ) : null}

          {onboardingSuccess ? (
            <Card className="border-leaf-200 bg-[linear-gradient(160deg,_rgba(244,252,238,0.98)_0%,_rgba(231,245,216,0.98)_100%)] p-4">
              <p className="text-sm font-medium leading-6 text-earth-900">{onboardingSuccess}</p>
            </Card>
          ) : null}

          {loginSuccessMessage ? (
            <Card className="success-toast-bloom border-leaf-200 bg-[linear-gradient(160deg,_rgba(244,252,238,0.98)_0%,_rgba(231,245,216,0.98)_100%)] p-4">
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
            </Card>
          ) : null}

          {currentScreen === 'home' ? renderHome() : null}
          {currentScreen === 'crops' ? renderCrops() : null}
          {currentScreen === 'add' ? renderAdd() : null}
          {currentScreen === 'questions' ? renderQuestions() : null}
          {currentScreen === 'profile' ? renderProfile() : null}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} onChange={setCurrentScreen} labels={navLabels} />
      <FloatingMitziBubble
        visible={shouldShowMitziBubble}
        level={companionLevel}
        mood={companionMood}
        message={mitziMessage}
        cropName={featuredCrop?.crop?.cropDisplayName || featuredCrop?.crop?.cropName || ''}
        dayLabel={featuredCrop?.crop ? t('today.day', { value: featuredCrop.crop.daysSincePlanting }) : ''}
        success={mitziCelebrationVisible}
        reviewing={reviewingToday}
        onReview={handleTodayReview}
        onOpenDetail={() => {
          if (featuredCrop?.crop?.id) {
            navigate(`/crop/${featuredCrop.crop.id}`);
          }
        }}
      />


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

