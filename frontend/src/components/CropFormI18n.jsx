import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const initialForm = {
  cropName: 'corn',
  plantingDate: '',
  waterAvailable: true
};

export default function CropFormI18n({ onSubmit, loading }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialForm);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-earth-700">{t('register.crop')}</span>
        <select
          className="w-full rounded-[22px] border border-earth-100 bg-earth-50 px-4 py-4 text-base text-earth-900 outline-none transition focus:border-leaf-500 focus:bg-white"
          value={form.cropName}
          onChange={(event) => setForm((current) => ({ ...current, cropName: event.target.value }))}
        >
          <option value="corn">{t('crop.names.corn')}</option>
          <option value="beans">{t('crop.names.beans')}</option>
          <option value="squash">{t('crop.names.squash')}</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-earth-700">{t('register.plantingDate')}</span>
        <input
          required
          type="date"
          className="w-full rounded-[22px] border border-earth-100 bg-earth-50 px-4 py-4 text-base text-earth-900 outline-none transition focus:border-leaf-500 focus:bg-white"
          value={form.plantingDate}
          onChange={(event) => setForm((current) => ({ ...current, plantingDate: event.target.value }))}
        />
      </label>

      <label className="flex items-center justify-between rounded-[22px] border border-earth-100 bg-earth-50 px-4 py-4">
        <span className="text-sm font-medium text-earth-700">{t('register.waterAvailable')}</span>
        <input
          type="checkbox"
          className="h-5 w-5 accent-leaf-500"
          checked={form.waterAvailable}
          onChange={(event) => setForm((current) => ({ ...current, waterAvailable: event.target.checked }))}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[24px] bg-leaf-500 px-4 py-4 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-leaf-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-leaf-500/60"
      >
        {loading ? t('register.saving') : t('register.submit')}
      </button>
    </form>
  );
}
