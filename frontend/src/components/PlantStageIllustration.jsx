function RootNetwork() {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" fill="none" aria-hidden="true">
      <g stroke="rgba(244,224,186,0.52)" strokeWidth="2.1" strokeLinecap="round">
        <path d="M110 0 C110 20 110 34 110 50" />
        <path d="M110 24 C102 40 96 56 87 76 C82 86 77 96 73 110" />
        <path d="M111 28 C122 46 131 66 139 88 C143 98 147 110 151 126" />
        <path d="M109 42 C100 58 97 76 95 99 C93 118 88 133 80 146" />
        <path d="M112 45 C121 63 124 82 125 102 C126 119 131 134 141 148" />
        <path d="M84 78 C74 86 68 95 62 108" />
        <path d="M137 88 C147 94 155 105 161 120" />
        <path d="M96 108 C90 116 86 126 84 139" />
        <path d="M124 112 C130 120 135 131 138 145" />
        <path d="M73 110 C68 114 64 121 60 131" />
        <path d="M152 126 C158 130 162 136 165 144" />
      </g>
      <g stroke="rgba(244,224,186,0.34)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M95 100 C88 104 84 110 81 118" />
        <path d="M125 101 C132 107 136 114 138 123" />
        <path d="M62 108 C57 112 54 117 52 124" />
        <path d="M161 120 C166 124 169 130 171 137" />
      </g>
      <g fill="rgba(196,145,90,0.34)">
        <circle cx="73" cy="110" r="5" />
        <circle cx="151" cy="126" r="4.5" />
        <circle cx="84" cy="139" r="3.5" />
        <circle cx="138" cy="145" r="3.5" />
        <circle cx="60" cy="131" r="3" />
      </g>
    </svg>
  );
}

function SeedArt() {
  return (
    <svg viewBox="0 0 220 220" className="h-full w-full" fill="none" aria-hidden="true">
      <ellipse cx="110" cy="110" rx="28" ry="20" fill="#c4945a" />
      <path d="M110 120 C106 138 98 149 92 164" stroke="#f1d9b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M112 122 C122 140 130 152 137 166" stroke="#f1d9b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M108 122 C108 141 108 154 108 172" stroke="#f1d9b8" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function SproutArt() {
  return (
    <svg viewBox="0 0 220 220" className="h-full w-full" fill="none" aria-hidden="true">
      <path d="M110 160 C110 138 110 112 112 78" stroke="#dff5b2" strokeWidth="8" strokeLinecap="round" />
      <path d="M112 78 C87 78 72 67 58 48 C84 40 104 45 118 63" fill="#85bf54" />
      <path d="M112 88 C133 84 150 72 165 52 C145 44 126 49 114 71" fill="#6fa646" />
      <circle cx="110" cy="162" r="7" fill="#d9b17d" />
    </svg>
  );
}

function GrowthArt() {
  return (
    <svg viewBox="0 0 220 240" className="h-full w-full" fill="none" aria-hidden="true">
      <path d="M110 190 C111 165 111 138 113 82" stroke="#e4f8ba" strokeWidth="10" strokeLinecap="round" />
      <path d="M113 108 C82 110 58 96 39 70 C75 56 102 66 120 89" fill="#7fba4e" />
      <path d="M113 130 C142 126 164 106 183 78 C151 67 126 79 112 103" fill="#5f983c" />
      <path d="M113 72 C95 52 84 33 82 14 C108 20 122 34 126 62" fill="#96cf64" />
      <circle cx="110" cy="190" r="8" fill="#d9b17d" />
    </svg>
  );
}

function MatureArt() {
  return (
    <svg viewBox="0 0 220 250" className="h-full w-full" fill="none" aria-hidden="true">
      <path d="M110 196 C111 160 111 122 112 48" stroke="#d7f1a0" strokeWidth="10" strokeLinecap="round" />
      <path d="M112 88 C84 94 62 86 42 65 C73 51 100 58 116 77" fill="#7eb84d" />
      <path d="M112 118 C142 116 165 98 184 72 C153 63 129 73 113 98" fill="#5f973c" />
      <path d="M105 84 C99 100 97 114 97 135 C112 129 122 113 124 92" fill="#f1c44f" />
      <path d="M121 83 C124 101 128 116 136 134 C120 132 108 118 105 96" fill="#e3ad32" />
      <path d="M114 56 C103 35 101 20 104 6 C122 18 130 34 128 56" fill="#8cc95a" />
    </svg>
  );
}

function resolveArtVariant(stageName = '') {
  const normalized = stageName.toLowerCase();
  if (normalized.includes('siembra') || normalized.includes('plant')) {
    return 'seed';
  }
  if (normalized.includes('germin')) {
    return 'sprout';
  }
  if (
    normalized.includes('veget') ||
    normalized.includes('growth') ||
    normalized.includes('crecimiento') ||
    normalized.includes('guia') ||
    normalized.includes('guía')
  ) {
    return 'growth';
  }
  if (
    normalized.includes('flor') ||
    normalized.includes('fruit') ||
    normalized.includes('fruto') ||
    normalized.includes('mazorca') ||
    normalized.includes('vaina')
  ) {
    return 'mature';
  }
  if (
    normalized.includes('harvest') ||
    normalized.includes('cosecha') ||
    normalized.includes('mature') ||
    normalized.includes('madur')
  ) {
    return 'mature';
  }
  return 'growth';
}

export default function PlantStageIllustration({ stageName, animateGrowth = false }) {
  const variant = resolveArtVariant(stageName);

  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[310px]">
      <div className="absolute left-1/2 top-[9%] h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(190,243,140,0.34)_0%,_rgba(190,243,140,0.14)_42%,_transparent_75%)] blur-[10px]" />
      <div className="absolute left-1/2 top-[7%] h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(247,255,206,0.98)_0%,_rgba(236,255,188,0.42)_42%,_transparent_75%)] blur-[3px]" />
      <div className="absolute left-1/2 top-[18%] h-[110px] w-[210px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.35)_0%,_transparent_70%)] blur-xl" />
      <div className="absolute inset-x-0 top-0 h-[59%] rounded-[44px] bg-[radial-gradient(circle_at_50%_15%,_rgba(247,255,224,0.98),_rgba(223,242,177,0.16)_55%,_transparent_72%)]" />

      <div className={`plant-float absolute left-1/2 top-[1%] h-[280px] w-[280px] -translate-x-1/2 drop-shadow-[0_24px_36px_rgba(34,24,16,0.18)] ${animateGrowth ? 'plant-evolve' : ''}`}>
        {variant === 'seed' ? <SeedArt /> : null}
        {variant === 'sprout' ? <SproutArt /> : null}
        {variant === 'growth' ? <GrowthArt /> : null}
        {variant === 'mature' ? <MatureArt /> : null}
      </div>

      <div className="absolute inset-x-0 bottom-[31%] h-[22px] rounded-full bg-[radial-gradient(circle,_rgba(63,46,30,0.62),_rgba(63,46,30,0.16)_65%,_transparent_80%)] blur-md" />
      <div className="absolute inset-x-[12%] bottom-[28%] h-[28px] rounded-full bg-[radial-gradient(circle,_rgba(24,17,11,0.55),_rgba(24,17,11,0.08)_70%,_transparent_82%)] blur-xl" />

      <div className="absolute inset-x-0 bottom-0 h-[48%] overflow-hidden rounded-b-[36px] rounded-t-[34px] bg-[linear-gradient(180deg,_rgba(135,98,67,0.2)_0%,_rgba(86,60,41,0.8)_16%,_rgba(47,33,22,0.96)_48%,_rgba(21,15,10,1)_100%)] blur-[0.2px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.08),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.05)_0%,_transparent_34%,_rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-12 bg-[radial-gradient(circle_at_50%_0%,_rgba(153,117,82,0.26),_rgba(56,39,27,0.76)_72%,_transparent_100%)] blur-sm" />
        <div className="absolute inset-x-[5%] bottom-[12%] h-[34%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.24)_0%,_transparent_72%)] blur-3xl" />
        <div className="absolute inset-0 opacity-75">
          <RootNetwork />
        </div>
        <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-white/6 blur-2xl" />
        <div className="absolute right-[8%] top-[24%] h-24 w-24 rounded-full bg-black/18 blur-2xl" />
        <div className="absolute -right-8 bottom-2 h-36 w-36 rounded-full bg-black/24 blur-3xl" />
      </div>
    </div>
  );
}
