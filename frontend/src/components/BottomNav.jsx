const navItems = [
  { id: 'home', icon: '🏠' },
  { id: 'crops', icon: '🌾' },
  { id: 'add', icon: '➕' },
  { id: 'questions', icon: '💬' }
];

export default function BottomNav({ currentScreen, onChange, labels }) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-[28px] border border-[#4f4242] bg-[#3B2F2F] p-2 shadow-card backdrop-blur">
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => {
          const isActive = item.id === currentScreen;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-h-[62px] flex-col items-center justify-center rounded-[16px] px-3 py-2 text-center transition duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#6FAE4F] text-white shadow-[0_10px_24px_rgba(111,174,79,0.28)]'
                  : 'text-white/60 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1 text-[11px] font-semibold">{labels[item.id]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
