const navItems = [
  { id: 'home', icon: '🏠' },
  { id: 'crops', icon: '🌾' },
  { id: 'add', icon: '➕' },
  { id: 'questions', icon: '💬' }
];

export default function BottomNav({ currentScreen, onChange, labels }) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-[28px] border border-white/70 bg-earth-900/95 p-2 shadow-card backdrop-blur">
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => {
          const isActive = item.id === currentScreen;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-h-[62px] flex-col items-center justify-center rounded-[22px] px-2 py-2 text-center transition duration-200 active:scale-95 ${
                isActive ? 'bg-leaf-500 text-white shadow-lg' : 'text-earth-100/78 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-1 text-[11px] font-semibold">{labels[item.id]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
