import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { buildAuthHeaders, isGuestMode } from '../api';
import AppCard from './AppCard';
import CropHeroPremium from './CropHeroPremium';
import CropProgressIndicator from './CropProgressIndicator';
import CropStatusCard from './CropStatusCard';
import GrowthPhotoGallery from './GrowthPhotoGallery';
import RecommendationCard from './RecommendationCard';
import SectionHeader from './SectionHeader';

const GUEST_GROWTH_LOGS_KEY = 'guest_growth_logs';
const GUEST_GROWTH_LOG_CROP_KEY = 'guest_growth_log_crop_id';

function readGuestGrowthLogs() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_GROWTH_LOGS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeGuestGrowthLogs(logsByCropId) {
  localStorage.setItem(GUEST_GROWTH_LOGS_KEY, JSON.stringify(logsByCropId));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la foto.'));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo procesar la foto.'));
    image.src = dataUrl;
  });
}

async function buildGuestPhotoDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file);

  if (typeof document === 'undefined') {
    return originalDataUrl;
  }

  const image = await loadImageFromDataUrl(originalDataUrl);
  const maxSize = 1400;
  const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return originalDataUrl;
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = 0.82;
  let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

  while (compressedDataUrl.length > 900_000 && quality > 0.45) {
    quality -= 0.1;
    compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  return compressedDataUrl;
}

export default function CropDetailPagePremium({ crops, recommendationData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);

  const crop = crops.find((item) => String(item.id) === id);
  const cropDetail = recommendationData?.cropDetails?.find((item) => String(item.cropId) === id) || null;

  useEffect(() => {
    if (crop) {
      fetchPhotos();
    }
  }, [crop]);

  const fetchPhotos = async () => {
    if (isGuestMode()) {
      const guestLogs = readGuestGrowthLogs();
      setPhotos(Array.isArray(guestLogs[crop.id]) ? guestLogs[crop.id] : []);
      return;
    }

    try {
      const response = await fetch(`/api/growth-log/${crop.id}`, {
        headers: buildAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    }
  };

  const handlePhotoUpload = async (file) => {
    if (isGuestMode()) {
      const assignedCropId = localStorage.getItem(GUEST_GROWTH_LOG_CROP_KEY);

      if (assignedCropId && assignedCropId !== String(crop.id)) {
        throw new Error(t('growthLog.singleCropLimit'));
      }

      const dataUrl = await buildGuestPhotoDataUrl(file);
      const guestLogs = readGuestGrowthLogs();
      const cropLogs = Array.isArray(guestLogs[crop.id]) ? guestLogs[crop.id] : [];
      const nextPhoto = {
        id: Date.now(),
        userCropId: crop.id,
        imageUrl: dataUrl,
        description: '',
        createdAt: new Date().toISOString()
      };

      guestLogs[crop.id] = [nextPhoto, ...cropLogs];
      try {
        writeGuestGrowthLogs(guestLogs);
      } catch {
        throw new Error(t('growthLog.uploadError', 'No pude guardar la foto. Intenta con una imagen más ligera.'));
      }
      localStorage.setItem(GUEST_GROWTH_LOG_CROP_KEY, String(crop.id));
      setPhotos(guestLogs[crop.id]);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userCropId', crop.id);

    try {
      const response = await fetch('/api/growth-log', {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: formData,
      });

      if (response.ok) {
        await fetchPhotos(); // Refresh photos
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handlePhotoDelete = async (photo) => {
    if (isGuestMode()) {
      const guestLogs = readGuestGrowthLogs();
      const cropLogs = Array.isArray(guestLogs[crop.id]) ? guestLogs[crop.id] : [];
      const nextLogs = cropLogs.filter((item) => String(item.id) !== String(photo.id));

      if (nextLogs.length) {
        guestLogs[crop.id] = nextLogs;
      } else {
        delete guestLogs[crop.id];
      }

      writeGuestGrowthLogs(guestLogs);

      if (!Object.keys(guestLogs).length) {
        localStorage.removeItem(GUEST_GROWTH_LOG_CROP_KEY);
      }

      setPhotos(nextLogs);
      return;
    }

    const response = await fetch(`/api/growth-log/${crop.id}/${photo.id}`, {
      method: 'DELETE',
      headers: buildAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    await fetchPhotos();
  };

  if (!crop) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 py-6 text-earth-900">
        <div className="mx-auto max-w-md space-y-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-[14px] py-2 text-sm font-medium text-[#2F2F2F] shadow-sm backdrop-blur-md transition hover:bg-white/85"
          >
            ← {t('cropDetail.back')}
          </button>
          <AppCard>
            <p className="text-sm leading-6 text-earth-700">{t('cropDetail.notFound')}</p>
          </AppCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-14 pt-6 text-earth-900">
      <div className="mx-auto max-w-md space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-[14px] py-2 text-sm font-medium text-[#2F2F2F] shadow-sm backdrop-blur-md transition hover:bg-white/85 active:scale-95"
        >
          ← {t('cropDetail.back')}
        </button>

        <CropHeroPremium crop={crop} />

        <section className="space-y-4">
          <SectionHeader eyebrow={t('crop.progressEyebrow')} title={t('crop.progressTitle')} />
          <AppCard className="bg-white/92">
            <CropProgressIndicator
              cropName={crop.cropName}
              stageName={crop.growthStage}
              daysSincePlanting={crop.daysSincePlanting}
              stageMinDay={crop.stageMinDay}
              stageMaxDay={crop.stageMaxDay}
            />
          </AppCard>
        </section>

        <section className="-mt-1 grid grid-cols-3 gap-3">
          <CropStatusCard icon="🌙" label={t('dashboard.moon')} value={recommendationData?.lunarPhase ? t(`lunarPhases.${recommendationData.lunarPhase}`, { defaultValue: recommendationData.lunarPhase }) : t('dashboard.loading')} tone="soft" />
          <CropStatusCard
            icon="🌧️"
            label={t('dashboard.weather')}
            value={
              recommendationData?.weather
                ? t('dashboard.temperature', {
                    condition: recommendationData.weather.condition,
                    value: recommendationData.weather.maxTemperature
                  })
                : t('dashboard.loading')
            }
            tone="sky"
          />
          <CropStatusCard
            icon="💧"
            label={t('register.waterAvailable')}
            value={crop.waterAvailable ? t('tracking.waterReady') : t('tracking.lowWater')}
            tone="leaf"
          />
        </section>

        <RecommendationCard
          title={t('cropDetail.mainAction')}
          message={cropDetail?.actionToday || recommendationData?.dailyFocus || t('dashboard.loading')}
        />

        <section className="space-y-4">
          <SectionHeader eyebrow={t('cropDetail.observeEyebrow')} title={t('cropDetail.observeTitle')} />
          <AppCard className="bg-white/92">
            <p className="text-sm leading-7 text-earth-700">{cropDetail?.fieldObservation || crop.expectedBehavior}</p>
          </AppCard>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow={t('cropDetail.tipsEyebrow')} title={t('cropDetail.tipsTitle')} />
          <div className="space-y-3">
            {cropDetail?.warnings?.length ? cropDetail.warnings.map((warning, index) => (
              <AppCard key={`${warning}-${index}`} className="bg-amber-50/95">
                <p className="text-sm leading-6 text-earth-700">{warning}</p>
              </AppCard>
            )) : (
              <AppCard className="bg-earth-50/95">
                <p className="text-sm leading-6 text-earth-700">{t('cropDetail.noWarnings')}</p>
              </AppCard>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow={t('growthLog.eyeBrow', 'Growth Log')} title={t('growthLog.title', 'Photo History')} />
          <GrowthPhotoGallery
            cropId={crop.id}
            photos={photos}
            onPhotoUpload={handlePhotoUpload}
            onPhotoDelete={handlePhotoDelete}
            requiresAuth={false}
            guestSingleCropMode={isGuestMode()}
          />
        </section>
      </div>
    </main>
  );
}
