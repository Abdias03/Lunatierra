export default function CropStatusCard({ icon, label, value, tone = 'soft' }) {
  const tones = {
    soft: 'bg-[#F5F2EA] text-[#1E1E1E]',
    sky: 'bg-[#EAF4F8] text-[#1E1E1E]',
    leaf: 'bg-[#EEF5E8] text-[#1E1E1E]',
    earth: 'bg-[#F0ECE3] text-[#1E1E1E]'
  };

  return (
    <article data-testid="crop-status-card" className={`crop-status-card rounded-[24px] border border-white/80 p-4 shadow-card ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">{label}</p>
          <p className="mt-2 text-sm font-semibold leading-5 text-[#5A5A5A]">{value}</p>
        </div>
        <span className="text-2xl text-[#1E1E1E]">{icon}</span>
      </div>
    </article>
  );
}
