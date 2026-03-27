import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppCard from './AppCard';

export default function GrowthPhotoGallery({
  cropId,
  photos,
  onPhotoUpload,
  onPhotoDelete,
  requiresAuth = false,
  guestSingleCropMode = false
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      await onPhotoUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error?.message || t('growthLog.uploadError', 'No pude guardar la foto. Intenta con una imagen más ligera.'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    if (!deleting) {
      setSelectedPhoto(null);
    }
  };

  const handleDeletePhoto = async () => {
    if (!selectedPhoto || !onPhotoDelete || deleting) {
      return;
    }

    setDeleting(true);
    try {
      await onPhotoDelete(selectedPhoto);
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AppCard className="bg-white/92">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t('growthLog.title', 'Growth Photos')}</h3>
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading || requiresAuth}
            className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
          >
            {uploading ? t('growthLog.uploading', 'Uploading...') : t('growthLog.addPhoto', 'Add Photo')}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {error ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {requiresAuth ? (
          <p className="mt-4 text-sm text-earth-600">
            {t('growthLog.signInRequired')}
          </p>
        ) : guestSingleCropMode ? (
          <p className="mt-4 text-sm text-earth-600">
            {t('growthLog.guestSingleCrop')}
          </p>
        ) : photos.length === 0 ? (
          <p className="mt-4 text-sm text-earth-600">{t('growthLog.noPhotos', 'No photos yet. Add your first growth photo!')}</p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openPhotoModal(photo)}
                className="aspect-square overflow-hidden rounded-lg bg-earth-100"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.description || t('growthLog.photoAlt', 'Growth photo')}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </AppCard>

      {selectedPhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closePhotoModal}>
          <div className="relative max-h-full max-w-full" onClick={(event) => event.stopPropagation()}>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.description || t('growthLog.photoAlt', 'Growth photo')}
              className="max-h-[85vh] max-w-full rounded-lg"
            />
            <div className="absolute right-2 top-2 flex items-center gap-2">
              {onPhotoDelete ? (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={deleting}
                  className="rounded-full bg-rose-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
                >
                  {deleting ? t('growthLog.deleting', 'Deleting...') : t('growthLog.delete', 'Delete')}
                </button>
              ) : null}
              <button
                type="button"
                onClick={closePhotoModal}
                className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                ×
              </button>
            </div>
            {selectedPhoto.description ? (
              <p className="absolute bottom-2 left-2 right-2 rounded bg-black/50 p-2 text-sm text-white">
                {selectedPhoto.description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
