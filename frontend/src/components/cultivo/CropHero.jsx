import { useTranslation } from 'react-i18next';
import PlantStageIllustration from '../plant/PlantStageIllustration';

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
    <section data-testid="crop-hero" className={`crop-hero relative overflow-hidden rounded-[32px] bg-gradient-to-b ${art.gradient} px-5 pb-6 pt-5 text-white shadow-card`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_58%)]" />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{t('cropDetail.heroEyebrow')}</p>
        <h1 className="mt-2 text-4xl font-semibold">{crop.cropDisplayName || crop.cropName}</h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-sm font-medium text-white">
          <span>{art.emoji}</span>
          <span>{crop.growthStage}</span>
        </p>

        <div className="mt-5">
          <PlantStageIllustration cropName={crop.cropDisplayName || crop.cropName} stageName={crop.growthStage} />
        </div>
      </div>
    </section>
  );
}
