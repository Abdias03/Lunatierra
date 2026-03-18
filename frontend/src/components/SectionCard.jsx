export default function SectionCard({ title, icon, subtitle, children }) {
  return (
    <section className="rounded-[28px] bg-white/90 p-5 shadow-card ring-1 ring-earth-100 backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-earth-500">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-earth-700/80">{subtitle}</p> : null}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {children}
    </section>
  );
}
