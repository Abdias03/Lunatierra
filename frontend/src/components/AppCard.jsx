export default function AppCard({ className = '', children }) {
  return (
    <section
      className={`rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-card backdrop-blur transition duration-200 ${className}`}
    >
      {children}
    </section>
  );
}
