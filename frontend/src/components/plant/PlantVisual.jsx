import germinationImage from '../../assets/plants/1.webp';
import growthImage from '../../assets/plants/2.webp';
import developmentImage from '../../assets/plants/3.webp';
import productionImage from '../../assets/plants/4.webp';

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const plantImages = {
  germination: germinationImage,
  growth: growthImage,
  development: developmentImage,
  production: productionImage
};

function resolveStageImage(stage = '') {
  const normalized = normalizeText(stage);

  if (normalized.includes('germin') || normalized.includes('siembra')) {
    return plantImages.germination;
  }

  if (normalized.includes('crecimiento') || normalized.includes('veget')) {
    return plantImages.growth;
  }

  if (normalized.includes('desarrollo') || normalized.includes('flor')) {
    return plantImages.development;
  }

  if (normalized.includes('produccion') || normalized.includes('fruto')) {
    return plantImages.production;
  }

  return plantImages.growth;
}

export default function PlantVisual({stage}) {
  const imageSrc = resolveStageImage(stage);
  return (
    <div data-testid="plant-visual" className="plant-visual-container w-full overflow-hidden">
      <div className="flex w-full items-center justify-center py-6">
        <div
          className={`plant-visual-frame flex items-center justify-center}`}
        >
          <img
            src={imageSrc}
            alt={`Planta en etapa ${stage || 'de crecimiento'}`}
            className={`plant-visual-image h-full w-full object-contain`}
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
}
