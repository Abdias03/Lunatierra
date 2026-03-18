export default function CropStatusCard({ icon, label, value, tone = 'soft' }) {
  const tones = {
    soft: 'bg-white/88 text-earth-900',
    sky: 'bg-sky-100 text-sky-700',
    leaf: 'bg-leaf-100 text-leaf-700',
    earth: 'bg-earth-100 text-earth-700'
  };

  return (
    <article className={`rounded-[24px] border border-white/80 p-4 shadow-card ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{label}</p>
          <p className="mt-2 text-sm font-semibold leading-5 text-current">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </article>
  );
}
