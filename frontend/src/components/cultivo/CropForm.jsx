import { useState } from 'react';

const initialForm = {
  cropName: 'corn',
  plantingDate: '',
  waterAvailable: true,
};

export default function CropForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialForm);
  };

  return (
    <form data-testid="crop-form-basic" className="crop-form-basic space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-earth-700">Crop</span>
        <select
          className="w-full rounded-2xl border border-earth-100 bg-earth-50 px-4 py-3 text-base text-earth-900 outline-none transition focus:border-leaf-500"
          value={form.cropName}
          onChange={(event) => setForm((current) => ({ ...current, cropName: event.target.value }))}
        >
          <option value="corn">Corn</option>
          <option value="beans">Beans</option>
          <option value="squash">Squash</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-earth-700">Planting date</span>
        <input
          required
          type="date"
          className="w-full rounded-2xl border border-earth-100 bg-earth-50 px-4 py-3 text-base text-earth-900 outline-none transition focus:border-leaf-500"
          value={form.plantingDate}
          onChange={(event) => setForm((current) => ({ ...current, plantingDate: event.target.value }))}
        />
      </label>

      <label className="flex items-center justify-between rounded-2xl border border-earth-100 bg-earth-50 px-4 py-3">
        <span className="text-sm font-medium text-earth-700">Water available</span>
        <input
          type="checkbox"
          checked={form.waterAvailable}
          onChange={(event) => setForm((current) => ({ ...current, waterAvailable: event.target.checked }))}
          className="h-5 w-5 rounded border-earth-300 text-leaf-600 focus:ring-leaf-500"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-earth-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(48,36,24,0.16)] transition hover:bg-earth-800 active:scale-95 disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Save crop'}
      </button>
    </form>
  );
}
