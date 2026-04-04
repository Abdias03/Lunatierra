import Card from '../shared/Card';
import MitziAvatar from '../plant/MitziAvatar';

export default function AssistantBubble({
  icon = '🐦',
  name = 'mitzi',
  message,
  tone = 'leaf',
  mood = 'neutral',
  level = 1,
  badge,
  dismissible = false,
  onDismiss
}) {
  const tones = {
    leaf: 'border-white/60 bg-[linear-gradient(160deg,_rgba(244,250,238,0.98)_0%,_rgba(230,241,219,0.98)_100%)]',
    warm: 'border-amber-200/70 bg-[linear-gradient(160deg,_rgba(255,250,237,0.98)_0%,_rgba(246,238,217,0.98)_100%)]',
    calm: 'border-sky-100/80 bg-[linear-gradient(160deg,_rgba(241,248,251,0.98)_0%,_rgba(224,239,243,0.98)_100%)]',
    alert: 'border-orange-200/80 bg-[linear-gradient(160deg,_rgba(255,245,236,0.98)_0%,_rgba(251,228,208,0.98)_100%)]',
    risk: 'border-rose-200/80 bg-[linear-gradient(160deg,_rgba(255,242,240,0.98)_0%,_rgba(248,220,214,0.98)_100%)]'
  };

  const badgeTones = {
    yellow: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200/90',
    orange: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200/90',
    red: 'bg-rose-100 text-rose-800 ring-1 ring-rose-200/90'
  };

  return (
    <Card data-testid="assistant-bubble" className={`assistant-bubble ${tones[tone] || tones.leaf} p-4 shadow-[0_16px_30px_rgba(67,88,43,0.08)]`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/75 shadow-[0_10px_20px_rgba(39,56,28,0.08)]">
            <MitziAvatar level={level} mood={mood} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">
                {name}
              </p>
              <span className="text-sm" aria-hidden="true">{icon}</span>
              {badge ? (
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeTones[badge.color] || badgeTones.yellow}`}>
                  {badge.label}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-medium leading-6 text-earth-900">
              {message}
            </p>
          </div>
        </div>
        {dismissible ? (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-earth-700 transition hover:bg-white"
            aria-label="Cerrar asistente"
          >
            ×
          </button>
        ) : null}
      </div>
    </Card>
  );
}
