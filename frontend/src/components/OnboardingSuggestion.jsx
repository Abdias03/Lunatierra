const cropOptions = {
  corn: { label: 'Sembrar maíz', icon: '🌽' },
  beans: { label: 'Sembrar frijol', icon: '🌱' },
  squash: { label: 'Sembrar calabaza', icon: '🎃' }
};

export default function OnboardingSuggestion({
  recommendation,
  loading,
  onSelectCrop,
  onShowMore
}) {
  const recommendedCrops = recommendation?.recommendedCrops?.slice(0, 2) || [];
  const canPlant = recommendation?.actionType === 'plant' && recommendedCrops.length > 0;

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_50px_rgba(63,46,30,0.12)] backdrop-blur">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-leaf-100 text-5xl shadow-[0_18px_40px_rgba(100,145,63,0.14)]">
        🌙
      </div>

      <p className="mt-6 text-center text-base font-medium leading-7 text-earth-700">
        Hoy la luna está en fase {recommendation?.lunarPhase?.toLowerCase() || 'especial'}
      </p>
      <h2 className="mt-3 text-center text-3xl font-semibold text-earth-900">
        {recommendation?.message || 'Hoy puede ser un buen momento para empezar 🌱'}
      </h2>

      <div className="mt-6 space-y-3">
        {canPlant ? recommendedCrops.map((cropKey) => {
          const crop = cropOptions[cropKey];

          if (!crop) {
            return null;
          }

          return (
            <button
              key={cropKey}
              type="button"
              onClick={() => onSelectCrop(cropKey)}
              disabled={loading}
              className="flex w-full items-center justify-between rounded-[24px] border border-leaf-200 bg-leaf-100/80 px-5 py-4 text-left transition hover:border-leaf-400 active:scale-[0.98] disabled:opacity-70"
            >
              <span className="text-lg font-semibold text-earth-900">{crop.label}</span>
              <span className="text-3xl">{crop.icon}</span>
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
        ➡️ Ver más opciones
      </button>
    </section>
  );
}
