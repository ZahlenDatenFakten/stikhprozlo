/** Глобальное свечение сцены: тлеющий багрянец сменяется золотом по мере чтения */
export default function AmbientGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Тьма и тление начала */}
      <div
        className="absolute -left-[20%] top-[55%] h-[80vmin] w-[80vmin] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,42,30,0.28) 0%, rgba(139,42,30,0) 65%)',
          opacity: 'calc(0.9 - var(--journey) * 0.75)',
          filter: 'blur(10px)',
        }}
      />
      {/* Растущий золотой свет */}
      <div
        className="absolute -right-[25%] top-[-10%] h-[110vmin] w-[110vmin] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(217,164,65,0.34) 0%, rgba(217,164,65,0) 62%)',
          opacity: 'calc(0.12 + var(--journey) * 0.88)',
          filter: 'blur(6px)',
        }}
      />
      {/* Нижнее тёплое зарево финала */}
      <div
        className="absolute bottom-[-30%] left-1/2 h-[90vmin] w-[120vmin] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(240,193,105,0.22) 0%, rgba(240,193,105,0) 60%)',
          opacity: 'calc(var(--journey) * var(--journey))',
        }}
      />
      {/* Виньетка */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
