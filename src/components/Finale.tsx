import { useReveal } from '@/hooks/useReveal';

export default function Finale() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.3);

  return (
    <footer className="relative z-10 flex min-h-[80svh] flex-col items-center justify-center px-6 py-32 text-center">
      <div ref={ref} className="flex max-w-xl flex-col items-center">
        {/* Финальный росчерк */}
        <svg viewBox="0 0 200 120" fill="none" className={`h-24 w-40 ${shown ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
          <defs>
            <linearGradient id="finale-stroke" x1="0" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#d9a441" />
              <stop offset="1" stopColor="#f0c169" />
            </linearGradient>
          </defs>
          <path
            d="M 30 90 C 60 30, 90 20, 100 55 C 108 85, 130 80, 170 35"
            pathLength={1}
            className={`brush-path ${shown ? 'brush-drawn' : ''}`}
            stroke="url(#finale-stroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <p
          className={`font-poem mt-12 text-xl italic leading-relaxed text-[#e9dfd3] sm:text-2xl line-anim ${
            shown ? 'line-shown' : 'line-hidden'
          }`}
          style={{ transitionDelay: '0.9s' }}
        >
          Художником и автором рисунка
          <br />
          был сам человек.
        </p>

        <div
          className={`mt-14 h-px w-16 bg-gradient-to-r from-transparent via-[#d9a441] to-transparent line-anim ${
            shown ? 'line-shown' : 'line-hidden'
          }`}
          style={{ transitionDelay: '1.5s' }}
        />

        <p
          className={`font-ui mt-14 text-[10px] font-light uppercase text-[#a89c8d] line-anim ${
            shown ? 'line-shown' : 'line-hidden'
          }`}
          style={{ letterSpacing: '0.45em', transitionDelay: '2s' }}
        >
          конец — и начало
        </p>
      </div>
    </footer>
  );
}
