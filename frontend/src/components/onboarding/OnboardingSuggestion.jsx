import { useTranslation } from 'react-i18next';

export default function OnboardingSuggestion({
  recommendation,
  loading,
  cropOptions = [],
  onSelectCrop,
  onShowMore
}) {
  const { t } = useTranslation();

  const recommendedCrops =
    recommendation?.recommendedCrops ||
    recommendation?.recommendationResponse?.recommendedCrops ||
    recommendation?.recommendationResponse?.cropDetails?.map((crop) => crop.cropName) ||
    [];

  const topCrops = recommendedCrops.slice(0, 2);
  const canPlant = topCrops.length > 0;

  const catalogByCode = Object.fromEntries(
    cropOptions.map((crop) => [String(crop.code).toLowerCase(), crop])
  );

  console.log('🌙 [OnboardingSuggestion] FULL recommendation:', recommendation);
  console.log('🌱 [OnboardingSuggestion] recommendedCrops (raw):', recommendedCrops);
  console.log('🌱 [OnboardingSuggestion] topCrops:', topCrops);
  console.log('📋 [OnboardingSuggestion] catalogByCode keys:', Object.keys(catalogByCode));

  const matchedCrops = topCrops.map((cropKey) => {
    const normalized = String(cropKey).toLowerCase();
    const crop = catalogByCode[normalized];
    console.log(`🔍 [OnboardingSuggestion] Matching '${cropKey}' (${normalized}) → ${crop ? 'FOUND' : 'NOT FOUND'}`);
    return { key: cropKey, crop };
  });

  return (
    <section data-testid="onboarding-suggestion" className="onboarding-suggestion rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_50px_rgba(63,46,30,0.12)] backdrop-blur">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-leaf-100 text-5xl">
        🌙
      </div>

      <h2 className="mt-6 text-center text-2xl font-semibold text-earth-900">
        {recommendation?.recommendationResponse?.message ||
          recommendation?.message ||
          t('onboarding.suggestionDefault', { defaultValue: 'Buen momento para tu cultivo' })}
      </h2>

      <div className="mt-6 space-y-3">
        {canPlant ? (
          matchedCrops.map(({ key: cropKey, crop }) => {
            if (!crop) {
              console.warn(`⚠️ [OnboardingSuggestion] Crop '${cropKey}' not found in catalog`);
              return (
                <button
                  key={cropKey}
                  type="button"
                  onClick={() => onSelectCrop(cropKey)}
                  className="w-full rounded-[24px] bg-earth-100 px-5 py-4 text-left text-sm text-earth-600"
                >
                  🌱 {cropKey} (no disponible)
                </button>
              );
            }

            return (
              <button
                key={crop.code}
                type="button"
                onClick={() => onSelectCrop(crop.code)}
                disabled={loading}
                className="flex w-full items-center justify-between rounded-[24px] border border-leaf-200 bg-leaf-100 px-5 py-4 text-left hover:border-leaf-400 active:scale-[0.98] disabled:opacity-70"
              >
                <span className="text-lg font-semibold text-earth-900">
                  🌱 {crop.displayName}
                </span>
              </button>
            );
          })
        ) : (
          <>
            <div className="rounded-[24px] bg-earth-50 px-4 py-4 text-sm text-earth-700">
              Hoy conviene observar y cuidar 🌙
            </div>

            <button
              type="button"
              onClick={onShowMore}
              className="w-full rounded-[24px] bg-leaf-500 px-5 py-4 font-semibold text-white"
            >
              Elegir cultivo manualmente
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onShowMore}
        className="mt-5 w-full rounded-[24px] bg-earth-900 px-5 py-4 text-lg font-semibold text-white"
      >
        Ver más opciones
      </button>
    </section>
  );
}
