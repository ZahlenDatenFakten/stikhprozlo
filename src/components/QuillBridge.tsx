import { useRef, useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Feather, Sparkles } from 'lucide-react';

interface Props {
  onContinue: () => void;
}

export default function QuillBridge({ onContinue }: Props) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.15);
  const [quillOffset, setQuillOffset] = useState(0);
  const bridgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bridgeRef.current) return;
      const rect = bridgeRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.top <= windowH && rect.bottom >= 0) {
        const progress = Math.min(1, Math.max(0, (windowH - rect.top) / (rect.height + windowH * 0.5)));
        setQuillOffset(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="album-bridge"
      ref={bridgeRef}
      className="relative z-10 mx-auto min-h-[110svh] max-w-4xl px-6 py-28 sm:py-36 text-center select-none overflow-hidden"
    >
      {/* Мягкий переходный световой туман: золотое тепло уступает осенней мгле */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[750px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[130px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(217,164,65,0.18) 0%, rgba(138,51,36,0.16) 40%, rgba(30,37,56,0.2) 75%, transparent 100%)',
        }}
      />

      <div ref={ref} className="relative z-10 flex flex-col items-center">
        {/* Индикатор связи альбома */}
        <div
          className={`fade-anim flex items-center justify-center gap-3 ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d9a441]/50" />
          <div className="flex items-center gap-2 rounded-full border border-[#d9a441]/30 bg-[#16120e]/80 px-4 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <Feather className="h-3.5 w-3.5 text-[#f0c169] animate-pulse" />
            <span className="font-ui text-[10px] font-medium tracking-[0.45em] uppercase text-[#f0c169]">
              Связующая нить альбома
            </span>
          </div>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d9a441]/50" />
        </div>

        {/* Заголовок перехода: Диалог с душой */}
        <h2
          className={`font-display mt-8 text-4xl sm:text-6xl font-light tracking-[0.08em] text-[#f5efe6] fade-anim ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{
            textShadow: '0 0 35px rgba(217,164,65,0.2), 0 4px 15px rgba(0,0,0,0.9)',
            transitionDelay: '0.3s',
          }}
        >
          Когда высыхают краски...
        </h2>

        <p
          className={`font-ui mt-3 text-xs tracking-[0.4em] uppercase text-[#a89c8d] fade-anim ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.45s' }}
        >
          От тишины холста — к осеннему ветру
        </p>

        {/* Интерактивная живая линия пера (Рукописный росчерк) */}
        <div
          className={`fade-anim relative my-12 w-full max-w-xl ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.6s' }}
        >
          <svg
            viewBox="0 0 600 120"
            fill="none"
            className="w-full h-24 overflow-visible"
          >
            <defs>
              <linearGradient id="bridge-ink" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d9a441" stopOpacity="0.2" />
                <stop offset="40%" stopColor="#f0c169" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#e09553" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b0503c" stopOpacity="0.9" />
              </linearGradient>
              <filter id="ink-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Проводящая рукописная линия */}
            <path
              d="M 20 60 Q 150 10, 300 65 T 580 55"
              pathLength={1}
              stroke="url(#bridge-ink)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#ink-glow)"
              className={`brush-path ${shown ? 'brush-drawn' : ''}`}
            />

            {/* Вторая деликатная нить */}
            <path
              d="M 40 65 Q 180 95, 320 50 T 560 65"
              pathLength={1}
              stroke="url(#bridge-ink)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="4 8"
              className={`brush-path ${shown ? 'brush-drawn' : ''}`}
              style={{ transitionDelay: '0.4s' }}
            />
          </svg>

          {/* Парящее светящееся перо, следующее за рукописным жестом */}
          <div
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
            style={{
              left: `${Math.min(92, Math.max(8, quillOffset * 90))}%`,
              transform: `translate(-50%, calc(-50% + ${Math.sin(quillOffset * Math.PI * 4) * 16}px)) rotate(${15 + Math.sin(quillOffset * Math.PI * 2) * 20}deg)`,
            }}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#d9a441]/15 backdrop-blur-sm border border-[#d9a441]/50 shadow-[0_0_20px_#d9a441]">
              <Feather className="h-5 w-5 text-[#f0c169]" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-[#f0c169] animate-ping" />
            </div>
          </div>
        </div>

        {/* Текст прямого диалога с читателем (Сайт говорит с человеком один на один) */}
        <div className="relative mx-auto max-w-2xl px-4 text-left sm:text-center space-y-8">
          <p
            className={`font-poem text-xl sm:text-2xl lg:text-[1.55rem] italic leading-[2.1] text-[#f5efe6] line-anim ${
              shown ? 'line-shown' : 'line-hidden'
            }`}
            style={{
              transitionDelay: '0.75s',
              textShadow: '0 2px 14px rgba(6,5,4,0.9)',
            }}
          >
            «Вслушайся в эту тишину... Холст завершён. Мастер вытер слёзы с лица, и в глубине комнаты
            родился свет. Но жизнь не остаётся застывшей в раме.»
          </p>

          <p
            className={`font-poem text-lg sm:text-xl lg:text-[1.35rem] leading-[2.1] text-[#d6cbbe] line-anim ${
              shown ? 'line-shown' : 'line-hidden'
            }`}
            style={{
              transitionDelay: '1.1s',
              textShadow: '0 2px 14px rgba(6,5,4,0.9)',
            }}
          >
            За порогом мастерской поднимается зябкий ветер, и на остывающий мир опускается осень.
            Человек остаётся наедине с пустыми коридорами, тенями на стенах и медленным мраком.
            Там, где замирает кисть, начинают дрожать тонкие, невидимые нити.
          </p>

          <p
            className={`font-poem text-lg sm:text-xl lg:text-[1.35rem] leading-[2.1] text-[#e09553] italic line-anim ${
              shown ? 'line-shown' : 'line-hidden'
            }`}
            style={{
              transitionDelay: '1.45s',
              textShadow: '0 0 20px rgba(224,149,83,0.3)',
            }}
          >
            Но свет, однажды зажжённый в сердце, уже невозможно отнять.
            <br />
            Даже в самой глубокой ночи он остаётся негасимой искрой.
          </p>
        </div>

        {/* Символический переход к следующей главе альбома */}
        <div
          className={`fade-anim mt-14 flex flex-col items-center gap-4 ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '1.8s' }}
        >
          <button
            onClick={onContinue}
            className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-[#e09553]/60 bg-gradient-to-r from-[#e09553]/20 via-[#d9a441]/15 to-[#8a3324]/20 px-8 py-3.5 text-xs font-medium text-[#f5efe6] backdrop-blur-md transition-all duration-300 hover:border-[#f0c169] hover:bg-[#e09553]/30 hover:shadow-[0_0_25px_rgba(224,149,83,0.35)] cursor-pointer active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-[#f0c169] transition-transform group-hover:rotate-12" />
            <span className="font-ui tracking-[0.25em] uppercase">
              Часть II: Войти в «Нити на ветру»
            </span>
          </button>

          <span className="font-ui text-[10px] tracking-[0.4em] uppercase text-[#a89c8d]/60">
            Листайте вниз к продолжению истории
          </span>
        </div>
      </div>
    </section>
  );
}
