import { useTranslation } from 'react-i18next';
import PlantStageIllustration from './PlantStageIllustration';

const stageArt = {
  germination: {
    emoji: '🌱',
    gradient: 'from-leaf-500 via-leaf-700 to-earth-900'
  },
  flowering: {
    emoji: '🌼',
    gradient: 'from-sky-500 via-leaf-500 to-earth-900'
  },
  harvest: {
    emoji: '🌽',
    gradient: 'from-amber-300 via-earth-500 to-earth-900'
  },
  default: {
    emoji: '🌿',
    gradient: 'from-leaf-500 via-leaf-700 to-earth-900'
  }
};

function resolveStageArt(stageName = '') {
  const normalized = stageName.toLowerCase();
  if (normalized.includes('germin')) {
    return stageArt.germination;
  }
  if (normalized.includes('flor')) {
    return stageArt.flowering;
  }
  if (normalized.includes('harvest') || normalized.includes('cosecha')) {
    return stageArt.harvest;
  }
  return stageArt.default;
}

export default function CropHero({ crop }) {
  const { t } = useTranslation();
  const art = resolveStageArt(crop.growthStage);

  return (
    <section className={`relative overflow-hidden rounded-[34px] bg-gradient-to-br ${art.gradient} px-5 pb-6 pt-16 text-white shadow-card`}>
      <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-white/10 blur-sm" />
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/10 blur-md" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[radial-gradient(circle_at_center,_rgba(44,33,20,0.1),_rgba(44,33,20,0.55)_70%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{t('cropDetail.heroEyebrow')}</p>
            <h1 className="mt-3 text-4xl font-semibold capitalize leading-none">
              {t(`crop.names.${crop.cropName}`, crop.cropName)}
            </h1>
            <p className="mt-3 inline-flex rounded-full bg-white/14 px-3 py-1 text-sm font-medium text-white/92 backdrop-blur">
              {crop.growthStage}
            </p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/14 text-5xl backdrop-blur">
            {art.emoji}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] bg-white/12 px-4 py-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{t('summary.days')}</p>
            <p className="mt-2 text-2xl font-semibold">{crop.daysSincePlanting}</p>
          </div>
          <div className="rounded-[24px] bg-white/12 px-4 py-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{t('cropDetail.planted')}</p>
            <p className="mt-2 text-lg font-semibold">{crop.plantingDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
