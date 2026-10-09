import { useEffect, useState } from 'react';
import { ArrowDown, BookOpen, Sparkles, Feather } from 'lucide-react';

interface Props {
  onScrollToCatalog: () => void;
  onScrollToFirstPoem: () => void;
}

export default function TamerlanHero({ onScrollToCatalog, onScrollToFirstPoem }: Props) {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 120);
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      id="hero-tamerlan"
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center select-none overflow-hidden"
    >
      {/* Мягкие световые ореолы заставки */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(217,164,65,0.18) 0%, rgba(139,42,30,0.12) 45%, rgba(0,0,0,0) 70%)',
          transform: `translate(calc(-50% + ${mousePos.x * 0.8}px), calc(-50% + ${mousePos.y * 0.8}px))`,
        }}
      />

      {/* Верхний вензель / эмблема пера */}
      <div
        className={`fade-anim flex items-center justify-center gap-3 ${
          mounted ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '0.2s' }}
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#d9a441]/50" />
        <div className="flex items-center gap-2 rounded-full border border-[#d9a441]/25 bg-[#14100c]/80 px-4 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <Feather className="h-3.5 w-3.5 text-[#d9a441] animate-pulse" />
          <span
            className="font-ui text-[10px] font-medium tracking-[0.45em] text-[#d9a441] uppercase"
          >
            Собрание сочинений
          </span>
        </div>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#d9a441]/50" />
      </div>

      {/* Главный заголовок: Стихи Тамерлана */}
      <div
        className="relative mt-8 max-w-5xl"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -0.15}deg) rotateY(${mousePos.x * 0.15}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        <h1
          className={`font-display text-[14vw] sm:text-[9vw] lg:text-[7.2vw] font-light leading-[1.05] tracking-[0.08em] text-[#f5efe6] fade-anim ${
            mounted ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{
            textShadow: '0 0 45px rgba(217,164,65,0.22), 0 4px 18px rgba(0,0,0,0.9)',
            transitionDelay: '0.5s',
          }}
        >
          Стихи Тамерлана
        </h1>

        <p
          className={`font-ui mt-4 text-[11px] sm:text-xs uppercase tracking-[0.6em] text-[#a89c8d] fade-anim ${
            mounted ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          Поэзия тишины • Внутренний свет • Поиск пути
        </p>
      </div>

      {/* Декоративная золотая разделительная нить */}
      <div
        className={`fade-anim my-8 flex items-center justify-center gap-4 ${
          mounted ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '1.1s' }}
      >
        <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#d9a441]/70 to-transparent" />
        <span className="h-1.5 w-1.5 rotate-45 border border-[#d9a441] bg-[#d9a441]/30 shadow-[0_0_8px_#d9a441]" />
        <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#d9a441]/70 to-transparent" />
      </div>

      {/* Эпиграф / описание */}
      <p
        className={`font-poem max-w-xl text-xl sm:text-2xl italic leading-relaxed text-[#d6cbbe] fade-anim px-4 ${
          mounted ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '1.4s' }}
      >
        «Каждый вздох — это вопрос к вечности. В мире остывающей золы и теней всегда остаётся искра,
        чиста и горяча.»
      </p>

      {/* Информационные плашки / Особенности альбома */}
      <div
        className={`fade-anim mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 ${
          mounted ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '1.7s' }}
      >
        <div className="flex items-center gap-2 rounded-lg border border-[#2a241d] bg-[#0f0d0b]/70 px-3.5 py-1.5 backdrop-blur-sm">
          <BookOpen className="h-3.5 w-3.5 text-[#d9a441]" />
          <span className="font-ui text-xs text-[#a89c8d]">Альбом: «Холст и Нити» (2 части)</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[#2a241d] bg-[#0f0d0b]/70 px-3.5 py-1.5 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#f0c169]" />
          <span className="font-ui text-xs text-[#a89c8d]">Живой рукописный мост</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[#2a241d] bg-[#0f0d0b]/70 px-3.5 py-1.5 backdrop-blur-sm">
          <Feather className="h-3.5 w-3.5 text-[#e09553]" />
          <span className="font-ui text-xs text-[#a89c8d]">Искренний диалог с душой</span>
        </div>
      </div>

      {/* Кнопки призыва к действию */}
      <div
        className={`fade-anim mt-10 flex flex-col sm:flex-row items-center gap-4 ${
          mounted ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '2.0s' }}
      >
        <button
          onClick={onScrollToCatalog}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-[#d9a441] bg-gradient-to-r from-[#d9a441]/20 to-[#f0c169]/15 px-8 py-3.5 text-sm font-medium text-[#f5efe6] backdrop-blur-md transition-all duration-300 hover:border-[#f0c169] hover:bg-[#d9a441]/30 hover:shadow-[0_0_30px_rgba(217,164,65,0.35)] cursor-pointer active:scale-95"
        >
          <span className="font-ui text-xs tracking-[0.25em] uppercase">Открыть альбом</span>
          <ArrowDown className="h-4 w-4 text-[#d9a441] transition-transform duration-300 group-hover:translate-y-1" />
        </button>

        <button
          onClick={onScrollToFirstPoem}
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-[#a89c8d] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-[#f5efe6] cursor-pointer active:scale-95"
        >
          <BookOpen className="h-4 w-4 text-[#a89c8d] group-hover:text-[#f5efe6] transition-colors" />
          <span className="font-ui text-xs tracking-[0.2em] uppercase">Войти в чтение</span>
        </button>
      </div>

      {/* Индикатор скролла вниз */}
      <div
        onClick={onScrollToCatalog}
        className={`fade-anim mt-16 sm:mt-20 flex flex-col items-center gap-3 cursor-pointer group ${
          mounted ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '2.3s' }}
      >
        <span
          className="font-ui text-[10px] uppercase text-[#a89c8d] tracking-[0.45em] transition-colors group-hover:text-[#d9a441]"
        >
          Листайте вниз к табличкам
        </span>
        <div className="relative h-14 w-px overflow-hidden bg-[#2a241d]">
          <span className="scroll-drip absolute left-0 top-0 h-6 w-px bg-gradient-to-b from-[#d9a441] to-[#f0c169]" />
        </div>
      </div>
    </section>
  );
}
