export default function RecommendationCard({ title, message }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,_rgba(92,138,61,1)_0%,_rgba(62,97,40,1)_55%,_rgba(44,33,20,0.96)_100%)] px-5 py-6 text-white shadow-card">
      <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-white/10 blur-md" />
      <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-white/10 blur-md" />

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{title}</p>
        <p className="mt-4 text-2xl font-semibold leading-tight">{message}</p>
      </div>
    </section>
  );
}
