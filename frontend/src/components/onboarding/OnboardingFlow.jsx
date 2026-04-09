import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCropCatalog, fetchOnboardingRecommendation } from '../../api';
import { mapCropToBackend } from '../../utils/cropMapper';
import { useApiCall } from '../../hooks/useApiCall';
import OnboardingSuggestion from './OnboardingSuggestion';

const fallbackCrops = [
  { code: 'tomato', displayName: 'Jitomate' },
  { code: 'corn', displayName: 'Maíz' },
  { code: 'beans', displayName: 'Frijol' }
];

function buildFirstActions(result, selectedCropKey) {
  const cropDetails = result?.recommendationResponse?.cropDetails || [];
  const crops = result?.cropData || [];
  const createdCrop = crops.find((item) => String(item.cropName).toLowerCase() === String(selectedCropKey).toLowerCase()) || crops[0];
  const cropDetail = cropDetails.find((item) => item.cropId === createdCrop?.id);
  const generalRecommendations = result?.recommendationResponse?.recommendations || [];

  const actions = [
    cropDetail?.actionToday,
    cropDetail?.fieldObservation,
    generalRecommendations[0]?.message,
    generalRecommendations[1]?.message
  ]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 3);

  console.log('[OnboardingFlow] buildFirstActions', { selectedCropKey, createdCrop, cropDetail, generalRecommendations, actions });
  return actions;
}

export default function OnboardingFlow({ cropOptions = [], onSetupComplete, onQuickStart, onFinish }) {
  const { t } = useTranslation();
  const { data: catalog, loading: catalogLoading, error: catalogError, execute: loadCatalog, retry } = useApiCall([]);
  const [step, setStep] = useState(0);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [waterAvailable, setWaterAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [setupResult, setSetupResult] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCatalog(fetchCropCatalog);
  }, [loadCatalog]);

  useEffect(() => {
    console.log('Catalog loaded, waiting for user selection');
  }, [catalog]);

  useEffect(() => {
    console.log('🌱 catalog:', catalog);
    console.log('🌱 selectedCrop:', selectedCrop);
    console.log('📍 currentStep:', step);
  }, [catalog, selectedCrop, step]);

  const firstActions = useMemo(
    () => buildFirstActions(setupResult, selectedCrop),
    [setupResult, selectedCrop]
  );

  const cardBase = 'mx-auto flex min-h-screen w-full max-w-md flex-col justify-between bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.7),_rgba(247,242,231,0.98)_34%,_#efe2cf_100%)] px-5 pb-10 pt-8 text-earth-900';
  const panelBase = 'rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_50px_rgba(63,46,30,0.12)] backdrop-blur';

  const handleNeedRecommendation = async () => {
    setError('');
    setRecommendationLoading(true);
    console.log('[OnboardingFlow] handleNeedRecommendation: start', { selectedCrop, plantingDate, waterAvailable });

    try {
      const response = await fetchOnboardingRecommendation();
      console.log('[OnboardingFlow] fetchOnboardingRecommendation response', response);
      setRecommendation(response);
      setStep(2);
    } catch (recommendationError) {
      console.error('[OnboardingFlow] fetchOnboardingRecommendation failed', recommendationError);
      setStep(3);
    } finally {
      setRecommendationLoading(false);
      console.log('[OnboardingFlow] handleNeedRecommendation: end');
    }
  };

  const startSetup = async () => {
    if (!selectedCrop) {
      console.error('No crop selected');
      setError('Selecciona un cultivo primero');
      return;
    }

    if (!plantingDate) {
      setError('Elige una fecha para seguir');
      return;
    }

    const selectedCropData = catalog.find((crop) => crop.code === selectedCrop);
    if (!selectedCropData) {
      console.error('No matching catalog crop for selectedCrop', selectedCrop);
      setError('Selecciona un cultivo válido');
      setStep(3);
      return;
    }

    const backendCrop = mapCropToBackend(selectedCropData.code);
    if (!backendCrop) {
      console.error('Invalid crop mapping', selectedCropData.code);
      setError('El cultivo seleccionado no es válido. Intenta otro.');
      return;
    }

    const payload = {
      cropName: backendCrop,
      plantingDate,
      waterAvailable
    };

    console.log('🌱 Frontend crop:', selectedCropData.code);
    console.log('🔄 Backend crop:', backendCrop);
    console.log('🚀 Payload:', payload);

    setError('');
    setLoading(true);
    setStep(5);

    try {
      const minimumLoading = new Promise((resolve) => window.setTimeout(resolve, 1400));
      const setupPromise = onSetupComplete(payload);

      const [result] = await Promise.all([setupPromise, minimumLoading]);
      setSetupResult(result);
      setStep(6);
    } catch (setupError) {
      console.error('[OnboardingFlow] startSetup failed', setupError);
      setError('No pude preparar tu cultivo. Intenta otra vez.');
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onFinish();
    setStep(7);
  };

  if (step === 0) {
    return (
      <main data-testid="onboarding-flow" className={cardBase}>
        <div className="pt-6" />
        <section className={`${panelBase} animate-[rewardBloom_420ms_ease-out] text-center`}>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-leaf-100 text-5xl shadow-[0_18px_40px_rgba(100,145,63,0.14)]">
            🌱
          </div>
          <h1 className="mt-6 text-4xl font-semibold">{t('onboarding.welcome')}</h1>
          <p className="mt-4 text-lg leading-8 text-earth-700">
            Tu planta necesita cuidados todos los días.
            <br />
            Nosotros te decimos qué hacer.
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-8 w-full rounded-[24px] bg-leaf-500 px-5 py-4 text-lg font-semibold text-white transition hover:bg-leaf-700 active:scale-[0.98]"
          >
            Comenzar
          </button>
        </section>
        <div />
      </main>
    );
  }

  if (step === 1) {
    return (
      <main data-testid="onboarding-flow" className={cardBase}>
        <div className="pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-earth-500">Paso 1 de 6</p>
          <h2 className="mt-4 text-3xl font-semibold">¿Ya sabes qué sembrar?</h2>
          <p className="mt-3 text-base leading-7 text-earth-700">
            Si quieres, te damos una sugerencia rápida para hoy.
          </p>
        </div>

        <section className="space-y-4">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full rounded-[28px] border border-white/70 bg-white/88 px-5 py-5 text-left transition hover:border-earth-200 active:scale-[0.98]"
          >
            <p className="text-xl font-semibold text-earth-900">Sí</p>
            <p className="mt-1 text-sm text-earth-600">{t('onboarding.chooseCare')}</p>
          </button>

          <button
            type="button"
            onClick={handleNeedRecommendation}
            disabled={recommendationLoading}
            className="w-full rounded-[28px] border border-leaf-200 bg-leaf-100/80 px-5 py-5 text-left transition hover:border-leaf-400 active:scale-[0.98] disabled:opacity-70"
          >
            <p className="text-xl font-semibold text-earth-900">No, recomiéndame</p>
            <p className="mt-1 text-sm text-earth-700">
              {recommendationLoading
                ? 'Buscando una buena opción para hoy...'
                : 'Te guiamos según la luna y el momento del año.'}
            </p>
          </button>
        </section>
      </main>
    );
  }

  if (step === 2) {
    return (
      <main data-testid="onboarding-flow" className={cardBase}>
        <div className="pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-earth-500">Paso 2 de 6</p>
        </div>
        <OnboardingSuggestion
          recommendation={recommendation}
          loading={recommendationLoading}
          cropOptions={catalog}
          onSelectCrop={(cropCode) => {
            if (!cropCode) {
              console.error('No crop code received from recommendation');
              return;
            }
            setSelectedCrop(cropCode);
            setStep(4);
          }}
          onShowMore={() => setStep(3)}
        />
        {error ? (
          <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>
        ) : <div />}
      </main>
    );
  }

  if (step === 3) {
    return (
      <main data-testid="onboarding-flow" className={cardBase}>
        <div className="pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-earth-500">Paso 2 de 6</p>
          <h2 className="mt-4 text-3xl font-semibold">¿Qué quieres cuidar hoy?</h2>
        </div>

        <section className="space-y-4">
          {catalogError && (
            <div className="text-center">
              <p className="text-red-500 mb-2">{t('onboarding.loadError')}</p>
              <p className="text-sm text-earth-600 mb-4">{t('onboarding.fallbackMessage')}</p>
              <button onClick={retry} className="px-4 py-2 bg-leaf-500 text-white rounded">{t('onboarding.retry')}</button>
            </div>
          )}
          {catalogLoading ? (
            <p className="text-center text-earth-500">{t('onboarding.loadingCrops')}</p>
          ) : (catalog.length > 0 ? catalog : fallbackCrops).map((crop) => (
            <button
              key={crop.code}
              type="button"
              onClick={() => setSelectedCrop(crop.code)}
              className={`w-full rounded-[28px] border px-5 py-5 text-left transition ${
                selectedCrop === crop.code
                  ? 'border-leaf-500 bg-leaf-100 shadow-[0_18px_35px_rgba(100,145,63,0.14)]'
                  : 'border-white/70 bg-white/88'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold">{crop.displayName}</p>
                  <p className="mt-1 text-sm text-earth-600">{t('onboarding.accompany')}</p>
                </div>
                <span className="text-4xl">🌱</span>
              </div>
            </button>
          ))}
        </section>

        <button
          type="button"
          onClick={() => {
            if (!selectedCrop) {
              alert('Selecciona un cultivo primero');
              return;
            }
            setStep(4);
          }}
          className="w-full rounded-[24px] bg-earth-900 px-5 py-4 text-lg font-semibold text-white transition active:scale-[0.98]"
        >
          Seguir
        </button>
      </main>
    );
  }

  if (step === 4) {
    return (
      <main data-testid="onboarding-flow" className={cardBase}>
        <div className="pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-earth-500">Paso 3 de 6</p>
          <h2 className="mt-4 text-3xl font-semibold">¿Cuándo sembraste?</h2>
        </div>

        <section className={`${panelBase} space-y-5`}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-earth-700">{t('onboarding.plantingDate')}</span>
            <input
              type="date"
              value={plantingDate}
              onChange={(event) => setPlantingDate(event.target.value)}
              className="w-full rounded-[22px] border border-earth-100 bg-earth-50 px-4 py-4 text-base text-earth-900 outline-none transition focus:border-leaf-500 focus:bg-white"
            />
          </label>

          <label className="flex items-center justify-between rounded-[22px] border border-earth-100 bg-earth-50 px-4 py-4">
            <div>
              <p className="text-sm font-medium text-earth-700">¿Tienes agua disponible?</p>
              <p className="mt-1 text-xs text-earth-500">{t('onboarding.usefulGuide')}</p>
            </div>
            <button
              type="button"
              onClick={() => setWaterAvailable((current) => !current)}
              className={`relative h-8 w-14 rounded-full transition ${waterAvailable ? 'bg-leaf-500' : 'bg-earth-300'}`}
              aria-pressed={waterAvailable}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${waterAvailable ? 'left-7' : 'left-1'}`}
              />
            </button>
          </label>

          {catalogError ? (
            <p className="text-sm font-medium text-rose-600">{catalogError}</p>
          ) : null}

          <button
            type="button"
            onClick={startSetup}
            disabled={loading}
            className="w-full rounded-[24px] bg-leaf-500 px-5 py-4 text-lg font-semibold text-white transition hover:bg-leaf-700 active:scale-[0.98] disabled:opacity-70"
          >
            Continuar
          </button>
        </section>
      </main>
    );
  }

  if (step === 5) {
    return (
      <main data-testid="onboarding-flow" className={cardBase}>
        <div className="flex-1" />
        <section className={`${panelBase} text-center`}>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-leaf-100 text-5xl plant-float">
            🌱
          </div>
          <h2 className="mt-6 text-3xl font-semibold">{t('onboarding.analyzing')}</h2>
          <p className="mt-3 text-base leading-7 text-earth-700">
            Estamos preparando tu primera guía para hoy.
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-earth-100">
            <div className="h-full w-2/3 rounded-full bg-leaf-500 animate-[fadeUp_0.8s_ease_forwards]" />
          </div>
        </section>
        <div className="flex-1" />
      </main>
    );
  }

  if (step === 6) {
    return (
      <main data-testid="onboarding-flow" className={cardBase}>
        <div className="pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-earth-500">{t('onboarding.firstValue')}</p>
          <h2 className="mt-4 text-3xl font-semibold">✅ Hoy tu planta necesita esto:</h2>
        </div>

        <section className={`${panelBase} space-y-3`}>
          {firstActions.map((action, index) => (
            <div key={`${action}-${index}`} className="flex items-start gap-3 rounded-[22px] bg-earth-50 px-4 py-4">
              <span className="mt-1 text-lg">🌱</span>
              <p className="text-base leading-7 text-earth-800">{action}</p>
            </div>
          ))}
          {!firstActions.length ? (
            <div className="rounded-[22px] bg-earth-50 px-4 py-4 text-base leading-7 text-earth-800">
              Revisa la humedad del suelo y acompaña tu planta con calma hoy.
            </div>
          ) : null}
        </section>

        <button
          type="button"
          onClick={() => setStep(7)}
          className="w-full rounded-[24px] bg-earth-900 px-5 py-4 text-lg font-semibold text-white transition active:scale-[0.98]"
        >
          Entendido
        </button>
      </main>
    );
  }

  return (
    <main data-testid="onboarding-flow" className={cardBase}>
      <div className="flex-1" />
      <section className={`${panelBase} text-center`}>
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-amber-100 text-5xl shadow-[0_18px_40px_rgba(199,140,47,0.12)]">
          🔥
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-earth-500">{t('onboarding.firstStreak')}</p>
        <h2 className="mt-2 text-3xl font-semibold">Día 1 de cuidado</h2>
        <p className="mt-4 text-lg leading-8 text-earth-700">
          Si regresas mañana, tu planta crecerá mejor.
        </p>
        <button
          type="button"
          onClick={handleFinish}
          className="mt-8 w-full rounded-[24px] bg-leaf-500 px-5 py-4 text-lg font-semibold text-white transition hover:bg-leaf-700 active:scale-[0.98]"
        >
          Ir a mi cultivo
        </button>
      </section>
      <div className="flex-1" />
    </main>
  );
}
