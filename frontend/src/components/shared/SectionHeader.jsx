export default function SectionHeader({ eyebrow, title, action }) {
  return (
    <div data-testid="section-header" className="section-header flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-500">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-semibold text-earth-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}
