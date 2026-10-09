import { useState, useRef } from 'react';
import { allPoems, type PoemItem } from '@/data/poem';
import { useReveal } from '@/hooks/useReveal';
import { ArrowRight, Sparkles, Feather, Clock, Quote, Compass } from 'lucide-react';

interface Props {
  onSelectPoem: (poemId: string) => void;
}

export default function PoemCardsShowcase({ onSelectPoem }: Props) {
  const { ref: sectionRef, shown } = useReveal<HTMLDivElement>(0.15);
  const [filter, setFilter] = useState<string>('all');
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  const filteredPoems =
    filter === 'all' ? allPoems : allPoems.filter((p) => p.id === filter);

  return (
    <section
      id="poems-showcase"
      ref={sectionRef}
      className="relative z-10 mx-auto min-h-screen w-full max-w-7xl px-4 py-28 sm:px-6 lg:px-12"
    >
      {/* Фоновое мягкое свечение секции витрины */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[800px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[130px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(217,164,65,0.15) 0%, rgba(139,42,30,0.08) 50%, transparent 75%)',
        }}
      />

      {/* Верхний заголовок секции витрины */}
      <div className="relative text-center">
        <div
          className={`fade-anim flex items-center justify-center gap-3 ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <span className="h-px w-8 bg-[#d9a441]/40" />
          <span className="font-ui text-[11px] font-medium tracking-[0.4em] uppercase text-[#d9a441]">
            Галерея произведений
          </span>
          <span className="h-px w-8 bg-[#d9a441]/40" />
        </div>

        <h2
          className={`font-display mt-5 text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.06em] text-[#f5efe6] fade-anim ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.25s' }}
        >
          Стихи Тамерлана
        </h2>

        <p
          className={`font-poem mt-4 max-w-2xl mx-auto text-lg sm:text-xl italic text-[#a89c8d] fade-anim ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          Выберите стихотворение для погружения. Каждое слово сохранено в первозданной чистоте.
        </p>

        {/* Фильтры-таблички */}
        <div
          className={`fade-anim mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 ${
            shown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.55s' }}
        >
          <button
            onClick={() => setFilter('all')}
            className={`font-ui rounded-full px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
              filter === 'all'
                ? 'border border-[#d9a441] bg-[#d9a441]/15 text-[#f5efe6] shadow-[0_0_20px_rgba(217,164,65,0.25)]'
                : 'border border-white/5 bg-white/[0.02] text-[#a89c8d] hover:border-white/15 hover:text-[#e9dfd3]'
            }`}
          >
            Все стихи ({allPoems.length})
          </button>
          {allPoems.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilter(p.id)}
              className={`font-ui rounded-full px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                filter === p.id
                  ? 'border border-[#d9a441] bg-[#d9a441]/15 text-[#f5efe6] shadow-[0_0_20px_rgba(217,164,65,0.25)]'
                : 'border border-white/5 bg-white/[0.02] text-[#a89c8d] hover:border-white/15 hover:text-[#e9dfd3]'
              }`}
            >
              «{p.title}»
            </button>
          ))}
        </div>
      </div>

      {/* Сетка интерактивных табличек (3D Tilt Cards) */}
      <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {filteredPoems.map((poem, index) => (
          <PoemShowcaseCard
            key={poem.id}
            poem={poem}
            index={index}
            isShown={shown}
            isActive={activeHoverId === poem.id}
            onHover={(id) => setActiveHoverId(id)}
            onSelect={() => onSelectPoem(poem.id)}
          />
        ))}
      </div>

      {/* Нижняя подсказка для читателя */}
      <div
        className={`fade-anim mt-16 text-center text-xs text-[#a89c8d]/60 font-ui tracking-[0.2em] uppercase ${
          shown ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '0.9s' }}
      >
        Нажмите на карточку или кнопку «Читать», чтобы перейти к полному тексту со скролл-эффектами
      </div>
    </section>
  );
}

interface CardProps {
  poem: PoemItem;
  index: number;
  isShown: boolean;
  isActive: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
}

function PoemShowcaseCard({
  poem,
  index,
  isShown,
  onHover,
  onSelect,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -7;
    const rotY = ((x - centerX) / centerX) * 7;
    setRotate({ x: rotX, y: rotY });

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    onHover(null);
  };

  const isThreads = poem.id === 'threads';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(poem.id)}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-2xl p-[1px] transition-all duration-700 fade-anim ${
        isShown ? 'fade-shown' : 'fade-hidden'
      }`}
      style={{
        transitionDelay: `${0.3 + index * 0.2}s`,
        perspective: '1200px',
      }}
    >
      {/* Внешняя светящаяся граница */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(800px circle at ${glare.x}% ${glare.y}%, ${poem.borderGlow}, transparent 55%)`,
        }}
      />

      {/* Основное тело карточки с 3D поворотом */}
      <div
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d0b09]/90 p-8 sm:p-10 backdrop-blur-xl transition-all duration-300 ease-out shadow-[0_20px_50px_rgba(0,0,0,0.65)] group-hover:border-[#d9a441]/40 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(10px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Интерактивный блик стекла (Glare) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.12), transparent 45%)`,
            opacity: glare.opacity,
          }}
        />

        {/* Фоновый градиент карточки */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${poem.gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-35`}
        />

        {/* Верхняя строка карточки: Категория и время */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: poem.accentColor, boxShadow: `0 0 10px ${poem.accentColor}` }}
            />
            <span className="font-ui text-[11px] font-medium tracking-[0.25em] uppercase text-[#a89c8d]">
              {poem.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 font-ui text-[10px] text-[#a89c8d]">
            <Clock className="h-3 w-3 text-[#d9a441]" />
            <span>{poem.readingTime}</span>
          </div>
        </div>

        {/* Основной контент: Название и описание */}
        <div className="relative z-10 mt-7">
          <h3
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.05em] text-[#f5efe6] transition-colors duration-300 group-hover:text-[#f0c169]"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}
          >
            «{poem.title}»
          </h3>

          <p className="font-ui mt-2 text-xs font-light tracking-[0.15em] text-[#d9a441]">
            {poem.subtitle}
          </p>

          <p className="font-poem mt-4 text-base sm:text-lg italic leading-relaxed text-[#c7beaf]">
            {poem.description}
          </p>

          {/* Цитата в рамочке */}
          <div className="mt-6 rounded-xl border border-[#d9a441]/20 bg-[#16120e]/70 p-4 backdrop-blur-sm transition-all duration-300 group-hover:border-[#d9a441]/40 group-hover:bg-[#1c1712]/80">
            <div className="flex items-start gap-3">
              <Quote className="h-4 w-4 shrink-0 text-[#d9a441] mt-1 opacity-70" />
              <p className="font-poem text-base sm:text-lg italic text-[#e9dfd3] leading-snug">
                {poem.previewQuote}
              </p>
            </div>
          </div>

          {/* Тематические теги */}
          <div className="mt-6 flex flex-wrap gap-2">
            {poem.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1 font-ui text-[10px] tracking-wider text-[#a89c8d] transition-colors group-hover:border-white/10 group-hover:text-[#e0d6c9]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Индикатор структуры */}
          <div className="mt-6 flex items-center gap-4 text-xs font-ui text-[#a89c8d]/80 border-t border-white/5 pt-4">
            <div className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#d9a441]" />
              <span>
                {isThreads ? '4 строфы' : '6 глав'}
              </span>
            </div>
            {poem.meaning && (
              <div className="flex items-center gap-1.5 text-[#e09553]">
                <Feather className="h-3.5 w-3.5" />
                <span>Включает смысл стиха</span>
              </div>
            )}
          </div>
        </div>

        {/* Нижняя плашка с кнопкой перехода */}
        <div className="relative z-10 mt-8 flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-ui text-[#d9a441] tracking-[0.2em] uppercase">
            <Sparkles className="h-3.5 w-3.5 text-[#f0c169] animate-pulse" />
            <span>{isThreads ? 'Открыть произведение' : 'Открыть поэму'}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10 px-5 py-2.5 text-xs font-medium text-[#f5efe6] transition-all duration-300 group-hover:border-[#f0c169] group-hover:bg-[#d9a441] group-hover:text-[#060504] group-hover:shadow-[0_0_20px_rgba(217,164,65,0.4)]">
            <span className="font-ui tracking-wider uppercase font-medium">Читать</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
