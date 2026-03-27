import { useTranslation } from 'react-i18next';

export default function OnboardingSuggestion({
  recommendation,
  loading,
  cropOptions = [],
  onSelectCrop,
  onShowMore
}) {
  const { t } = useTranslation();
  const recommendedCrops = recommendation?.recommendedCrops?.slice(0, 2) || [];
  const canPlant = recommendation?.actionType === 'plant' && recommendedCrops.length > 0;
  const catalogByCode = Object.fromEntries(
    cropOptions.map((crop) => [String(crop.code).toLowerCase(), crop])
  );

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_50px_rgba(63,46,30,0.12)] backdrop-blur">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-leaf-100 text-5xl shadow-[0_18px_40px_rgba(100,145,63,0.14)]">
        🌙
      </div>

      <p className="mt-6 text-center text-base font-medium leading-7 text-earth-700">
        {`${t('onboarding.moonPhase')} ${(recommendation?.lunarPhase ? t(`lunarPhases.${recommendation.lunarPhase}`, { defaultValue: recommendation.lunarPhase }) : 'especial').toLowerCase()}`}
      </p>
      <h2 className="mt-3 text-center text-3xl font-semibold text-earth-900">
        {recommendation?.message || t('onboarding.goodTime')}
      </h2>

      <div className="mt-6 space-y-3">
        {canPlant ? recommendedCrops.map((cropKey) => {
          const crop = catalogByCode[String(cropKey).toLowerCase()];

          if (!crop) {
            return null;
          }

          return (
            <button
              key={crop.code}
              type="button"
              onClick={() => onSelectCrop(crop.code)}
              disabled={loading}
              className="flex w-full items-center justify-between rounded-[24px] border border-leaf-200 bg-leaf-100/80 px-5 py-4 text-left transition hover:border-leaf-400 active:scale-[0.98] disabled:opacity-70"
            >
              <span className="text-lg font-semibold text-earth-900">{`Sembrar ${crop.displayName}`}</span>
              <span className="text-3xl">🌱</span>
            </button>
          );
        }) : (
          <div className="rounded-[24px] bg-earth-50 px-4 py-4 text-sm leading-6 text-earth-700">
            Hoy conviene cuidar y observar. Si prefieres, puedes elegir otro cultivo.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onShowMore}
        className="mt-5 w-full rounded-[24px] bg-earth-900 px-5 py-4 text-lg font-semibold text-white transition active:scale-[0.98]"
      >
        Ver más opciones
      </button>
    </section>
  );
}
