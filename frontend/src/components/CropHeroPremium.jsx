import { useTranslation } from 'react-i18next';
import PlantStageIllustration from './PlantStageIllustration';

function resolveGradient(stageName = '') {
  const normalized = stageName.toLowerCase();
  if (normalized.includes('siembra') || normalized.includes('plant')) {
    return 'from-[#dff1a4] via-[#7ca84f] to-[#2f241a]';
  }
  if (normalized.includes('germin')) {
    return 'from-[#eef8b5] via-[#7fb251] to-[#2d241c]';
  }
  if (
    normalized.includes('veget') ||
    normalized.includes('growth') ||
    normalized.includes('crecimiento') ||
    normalized.includes('guia') ||
    normalized.includes('guía')
  ) {
    return 'from-[#dbf2a4] via-[#4e8a38] to-[#241c16]';
  }
  if (
    normalized.includes('flor') ||
    normalized.includes('fruto') ||
    normalized.includes('fruit') ||
    normalized.includes('mazorca') ||
    normalized.includes('vaina')
  ) {
    return 'from-[#f2e48c] via-[#7da044] to-[#241c16]';
  }
  if (normalized.includes('harvest') || normalized.includes('cosecha') || normalized.includes('madur')) {
    return 'from-[#f0d878] via-[#93af45] to-[#241c16]';
  }
  return 'from-[#def0ab] via-[#6d9d49] to-[#241c16]';
}

export default function CropHeroPremium({ crop }) {
  const { t } = useTranslation();
  const gradient = resolveGradient(crop.growthStage);

  return (
    <section className={`relative overflow-hidden rounded-[36px] bg-gradient-to-b ${gradient} px-5 pb-6 pt-5 text-white shadow-card`}>
      <div className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(circle_at_50%_15%,_rgba(248,255,224,0.86),_rgba(248,255,224,0.09)_58%,_transparent_74%)]" />
      <div className="absolute -left-20 top-12 h-40 w-40 rounded-full bg-white/16 blur-3xl" />
      <div className="absolute right-[-2rem] top-0 h-48 w-48 rounded-full bg-white/14 blur-3xl" />
      <div className="absolute left-1/2 top-[26%] h-20 w-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.18)_0%,_transparent_74%)] blur-xl" />
      <div className="absolute left-1/2 top-[22%] h-44 w-44 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(190,243,140,0.18)_0%,_transparent_72%)] blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-[49%] bg-[linear-gradient(180deg,_rgba(37,27,18,0)_0%,_rgba(37,27,18,0.14)_10%,_rgba(24,17,11,0.84)_52%,_rgba(17,12,8,0.98)_100%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[12rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{t('cropDetail.heroEyebrow')}</p>
            <h1 className="mt-3 text-4xl font-semibold capitalize leading-none">
              {t(`crop.names.${crop.cropName}`, crop.cropName)}
            </h1>
            <p className="mt-3 inline-flex rounded-full bg-white/14 px-3 py-1 text-sm font-medium text-white/92 backdrop-blur">
              {crop.growthStage}
            </p>
          </div>
          <div className="mt-1 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/82 backdrop-blur">
            Lunatierra
          </div>
        </div>

        <div className="mt-2">
          <PlantStageIllustration stageName={crop.growthStage} />
        </div>

        <div className="-mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] border border-white/10 bg-white/12 px-4 py-4 shadow-[0_12px_30px_rgba(20,14,10,0.14)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{t('summary.days')}</p>
            <p className="mt-2 text-2xl font-semibold">{crop.daysSincePlanting}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/12 px-4 py-4 shadow-[0_12px_30px_rgba(20,14,10,0.14)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{t('cropDetail.planted')}</p>
            <p className="mt-2 text-lg font-semibold">{crop.plantingDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
