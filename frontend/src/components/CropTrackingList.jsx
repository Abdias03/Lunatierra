export default function CropTrackingList({ crops, sortOrder = 'DESC' }) {
  const sortedCrops = [...crops].sort((a, b) => {
    if (sortOrder === 'ASC') {
      return a.daysSincePlanting - b.daysSincePlanting;
    }
    return b.daysSincePlanting - a.daysSincePlanting;
  });

  if (!sortedCrops.length) {
    return (
      <div className="rounded-3xl bg-earth-50 p-4 text-sm leading-6 text-earth-700">
        No crops registered yet. Add one to start tracking growth stages.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedCrops.map((crop) => (
        <article key={crop.id} className="rounded-3xl bg-earth-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold capitalize text-earth-900">{crop.cropName}</h3>
              <p className="text-sm text-earth-700">
                Planted on {crop.plantingDate} • {crop.daysSincePlanting} days ago
              </p>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              {crop.waterAvailable ? 'Water ready' : 'Low water'}
            </span>
          </div>
          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-earth-500">Current stage</p>
            <p className="mt-1 text-lg font-semibold text-earth-900">{crop.growthStageIcon ? `${crop.growthStageIcon} ` : ''}{crop.growthStage}</p>
            <p className="mt-2 text-sm leading-6 text-earth-700">{crop.expectedBehavior}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
