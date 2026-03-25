import { useTranslation } from 'react-i18next';

function resolveStageProgress(stageName = '') {
  const normalized = stageName.toLowerCase();

  if (normalized.includes('siembra') || normalized.includes('plant')) {
    return { icon: '🌰', progress: 12, step: 0, tone: 'from-[#d9c19a] to-[#b98d5f]' };
  }

  if (normalized.includes('germin')) {
    return { icon: '🌱', progress: 28, step: 1, tone: 'from-[#9fd96c] to-[#63a33d]' };
  }

  if (
    normalized.includes('veget') ||
    normalized.includes('growth') ||
    normalized.includes('crecimiento') ||
    normalized.includes('guia') ||
    normalized.includes('guía')
  ) {
    return { icon: '🌿', progress: 56, step: 2, tone: 'from-[#83cf5c] to-[#3f7f2f]' };
  }

  if (
    normalized.includes('flor') ||
    normalized.includes('fruit') ||
    normalized.includes('fruto') ||
    normalized.includes('mazorca') ||
    normalized.includes('vaina')
  ) {
    return { icon: '🌼', progress: 78, step: 3, tone: 'from-[#e7d66b] to-[#b99735]' };
  }

  if (normalized.includes('harvest') || normalized.includes('cosecha') || normalized.includes('madur') || normalized.includes('mature')) {
    return { icon: '🌽', progress: 100, step: 4, tone: 'from-[#f0c85a] to-[#ca9329]' };
  }

  return { icon: '🌿', progress: 52, step: 2, tone: 'from-[#83cf5c] to-[#3f7f2f]' };
}

export default function CropProgressIndicator({ stageName, compact = false, light = false }) {
  const { t } = useTranslation();
  const stage = resolveStageProgress(stageName);
  const steps = ['🌰', '🌱', '🌿', '🌼', '🌽'];

  return (
    <div className={`space-y-3 ${compact ? '' : 'rounded-[24px] border border-earth-100 bg-earth-50/80 p-4'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl shadow-sm ${light ? 'bg-white/14 text-white' : 'bg-white text-earth-900'}`}>
            {stage.icon}
          </span>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${light ? 'text-white/70' : 'text-earth-500'}`}>
              {t('crop.progressLabel')}
            </p>
            <p className={`mt-1 text-sm font-semibold ${light ? 'text-white' : 'text-earth-900'}`}>
              {t('crop.progressValue', { value: stage.progress })}
            </p>
          </div>
        </div>

        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${light ? 'bg-white/12 text-white/90' : 'bg-white text-earth-700'}`}>
          {stageName}
        </div>
      </div>

      <div className={`h-3 overflow-hidden rounded-full ${light ? 'bg-white/12' : 'bg-earth-200/80'}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${stage.tone} transition-all duration-500`}
          style={{ width: `${stage.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        {steps.map((icon, index) => (
          <div
            key={`${icon}-${index}`}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition duration-300 ${
              index <= stage.step
                ? light
                  ? 'bg-white/16 text-white shadow-[0_8px_18px_rgba(22,16,10,0.14)]'
                  : 'bg-white text-earth-900 shadow-sm'
                : light
                  ? 'bg-white/6 text-white/48'
                  : 'bg-earth-100 text-earth-400'
            }`}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}
