function Wing({ className = '', color = '#7cc7a5', opacity = 1, mirrored = false }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M52 61 C33 56 18 39 16 18 C34 21 48 34 57 54"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

function Flower({ className = '' }) {
  return (
    <svg viewBox="0 0 70 70" className={className} fill="none" aria-hidden="true">
      <circle cx="35" cy="35" r="8" fill="#f7bf4f" />
      <circle cx="35" cy="18" r="9" fill="#ff8ab1" />
      <circle cx="50" cy="26" r="9" fill="#ff8ab1" />
      <circle cx="50" cy="44" r="9" fill="#ff8ab1" />
      <circle cx="20" cy="26" r="9" fill="#ff8ab1" />
      <circle cx="20" cy="44" r="9" fill="#ff8ab1" />
    </svg>
  );
}

function BirdBody({ body = '#55b48e', belly = '#f4f8ef', beak = '#f4ad43', eye = '#1c2a1a' }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden="true">
      <ellipse cx="62" cy="60" rx="26" ry="31" fill={body} />
      <ellipse cx="60" cy="67" rx="16" ry="18" fill={belly} opacity="0.95" />
      <circle cx="68" cy="50" r="3.8" fill={eye} />
      <path d="M82 54 L98 58 L82 63 Z" fill={beak} />
      <path d="M42 77 C30 84 23 90 15 99 C28 97 39 92 50 83" fill={body} opacity="0.78" />
    </svg>
  );
}

function getPalette(level) {
  if (level >= 4) {
    return {
      body: '#73d6c8',
      belly: '#f8fffb',
      beak: '#f7c85d',
      aura: 'bg-[radial-gradient(circle,_rgba(142,245,226,0.62)_0%,_rgba(142,245,226,0.16)_52%,_transparent_76%)]'
    };
  }

  if (level === 3) {
    return {
      body: '#5fc4a5',
      belly: '#f7fbf6',
      beak: '#f4b24d',
      aura: 'bg-[radial-gradient(circle,_rgba(255,210,149,0.38)_0%,_rgba(255,210,149,0.10)_52%,_transparent_76%)]'
    };
  }

  if (level === 2) {
    return {
      body: '#62b99a',
      belly: '#f3f8f1',
      beak: '#f0aa48',
      aura: 'bg-[radial-gradient(circle,_rgba(168,226,198,0.30)_0%,_rgba(168,226,198,0.08)_52%,_transparent_76%)]'
    };
  }

  return {
    body: '#6bb18f',
    belly: '#f4f7f2',
    beak: '#efab4a',
    aura: 'bg-[radial-gradient(circle,_rgba(214,239,224,0.35)_0%,_rgba(214,239,224,0.08)_52%,_transparent_76%)]'
  };
}

export default function MitziAvatar({ level = 1, mood = 'neutral' }) {
  const palette = getPalette(level);
  const moodClass = mood === 'happy' ? 'pet-bounce-soft' : mood === 'worried' ? 'pet-worried-soft' : 'pet-float-soft';

  return (
    <div className={`relative h-14 w-14 ${moodClass}`}>
      <div className={`absolute inset-0 rounded-full ${palette.aura} ${level >= 4 ? 'mitzi-aura-pulse' : ''}`} />
      {level >= 3 ? (
        <div className="absolute -right-2 -top-1 h-8 w-8 opacity-90">
          <Flower />
        </div>
      ) : null}
      <div className="absolute left-[8%] top-[20%] h-8 w-8 opacity-85">
        <Wing color={level >= 4 ? '#8ee8dc' : '#92d7b8'} opacity={level >= 2 ? 0.95 : 0.72} />
      </div>
      <div className="absolute right-[8%] top-[16%] h-7 w-7 opacity-80">
        <Wing className={level >= 2 ? 'wing-flutter-soft' : ''} mirrored color={level >= 4 ? '#8ee8dc' : '#7cc7a5'} opacity={level >= 2 ? 0.95 : 0.7} />
      </div>
      <div className="absolute inset-[16%]">
        <BirdBody body={palette.body} belly={palette.belly} beak={palette.beak} />
      </div>
      {level >= 4 ? (
        <div className="absolute -bottom-1 left-1/2 h-4 w-10 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(142,245,226,0.38)_0%,_transparent_72%)] blur-md" />
      ) : null}
    </div>
  );
}
