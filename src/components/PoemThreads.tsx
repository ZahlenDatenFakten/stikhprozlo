import { useReveal } from '@/hooks/useReveal';
import { threadsStanzas, threadsMeaning } from '@/data/poem';
import { Feather, Sparkles } from 'lucide-react';

export default function PoemThreads() {
  const { ref: headerRef, shown: headerShown } = useReveal<HTMLDivElement>(0.2);
  const { ref: meaningRef, shown: meaningShown } = useReveal<HTMLDivElement>(0.2);

  return (
    <div id="poem-threads" className="relative z-10 w-full overflow-hidden py-24 sm:py-32">
      {/* Атмосферный фон стиха «Нити на ветру» */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-full -translate-x-1/2 opacity-30 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(138,51,36,0.3) 0%, rgba(30,37,56,0.2) 50%, transparent 80%)',
        }}
      />

      {/* Вводная заставка стиха «Нити на ветру» */}
      <header
        ref={headerRef}
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        <div
          className={`fade-anim flex items-center justify-center gap-3 ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#e09553]/60" />
          <span className="font-ui text-[11px] font-medium tracking-[0.45em] uppercase text-[#e09553]">
            Философская лирика
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#e09553]/60" />
        </div>

        <h2
          className={`font-display mt-8 text-5xl sm:text-7xl lg:text-8xl font-light tracking-[0.08em] text-[#f5efe6] fade-anim ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{
            textShadow: '0 0 40px rgba(224,149,83,0.25), 0 4px 20px rgba(0,0,0,0.9)',
            transitionDelay: '0.35s',
          }}
        >
          Нити на ветру
        </h2>

        <p
          className={`font-poem mt-6 max-w-xl mx-auto text-xl sm:text-2xl italic leading-relaxed text-[#c7beaf] fade-anim ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.6s' }}
        >
          о времени, осенней тишине и негасимой искре, спрятанной глубоко в сердце
        </p>

        {/* Анимированная золотая нить ветра */}
        <div
          className={`fade-anim mt-10 mx-auto max-w-md ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.85s' }}
        >
          <svg viewBox="0 0 400 40" fill="none" className="w-full h-8 opacity-70">
            <path
              d="M 10 20 C 100 5, 200 35, 300 12 S 370 24, 390 20"
              stroke="url(#thread-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 6"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="thread-gradient" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#e09553" stopOpacity="0" />
                <stop offset="0.3" stopColor="#e09553" stopOpacity="0.8" />
                <stop offset="0.7" stopColor="#f0c169" stopOpacity="0.9" />
                <stop offset="1" stopColor="#f0c169" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </header>

      {/* Строфы стихотворения */}
      <div className="relative mt-20 space-y-24 sm:space-y-36">
        {threadsStanzas.map((stanza, i) => (
          <ThreadsStanzaBlock key={stanza.numeral} stanza={stanza} index={i} />
        ))}
      </div>

      {/* Блок авторского смысла стиха */}
      <div
        id="poem-threads-meaning"
        ref={meaningRef}
        className="relative mx-auto mt-36 max-w-3xl px-6 sm:px-8"
      >
        {/* Фоновое янтарное сияние */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #e09553 0%, #8a3324 40%, transparent 70%)',
          }}
        />

        {/* Карточка-рукопись со смыслом стиха */}
        <div
          className={`relative overflow-hidden rounded-3xl border border-[#d9a441]/35 bg-gradient-to-b from-[#14100c]/95 via-[#0e0c0a]/95 to-[#16120e]/95 p-8 sm:p-14 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(217,164,65,0.08)] line-anim ${
            meaningShown ? 'line-shown' : 'line-hidden'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          {/* Декоративные уголки старинной рукописи */}
          <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l border-t border-[#d9a441]/40" />
          <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r border-t border-[#d9a441]/40" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b border-l border-[#d9a441]/40" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b border-r border-[#d9a441]/40" />

          {/* Заголовок смысла стиха */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10 shadow-[0_0_20px_rgba(217,164,65,0.25)]">
              <Feather className="h-6 w-6 text-[#f0c169]" />
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#d9a441]/40" />
              <span className="font-ui text-[11px] font-semibold tracking-[0.35em] uppercase text-[#d9a441]">
                {threadsMeaning.subtitle}
              </span>
              <span className="h-px w-8 bg-[#d9a441]/40" />
            </div>

            <h3
              className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.06em] text-[#f5efe6]"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
            >
              {threadsMeaning.title}
            </h3>

            <div className="my-8 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#d9a441]/60 to-transparent" />
          </div>

          {/* Неискаженный точный текст смысла стиха */}
          <div className="space-y-7 text-left">
            {threadsMeaning.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="font-poem text-lg sm:text-xl lg:text-[1.32rem] leading-[2.15] text-[#e8dfd4] tracking-[0.01em]"
                style={{
                  textShadow: '0 1px 12px rgba(6,5,4,0.8)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Подпись автора и печать */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-[#d9a441]" />
              <span className="font-ui text-xs tracking-[0.25em] uppercase text-[#a89c8d]">
                Стихи Тамерлана • Авторская мысль
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#d9a441]/30 bg-[#d9a441]/10 px-5 py-2 font-display text-lg italic text-[#f0c169]">
              Тамерлан
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StanzaProps {
  stanza: (typeof threadsStanzas)[0];
  index: number;
}

const stanzaMoods = {
  autumn: {
    accent: '#e09553',
    glow: 'radial-gradient(circle, rgba(224,149,83,0.15) 0%, rgba(138,51,36,0.08) 55%, transparent 75%)',
    watermark: 'text-[#e09553]',
  },
  corridor: {
    accent: '#a89c8d',
    glow: 'radial-gradient(circle, rgba(120,116,130,0.15) 0%, rgba(54,73,88,0.1) 55%, transparent 75%)',
    watermark: 'text-[#8b857c]',
  },
  dawn: {
    accent: '#d9a441',
    glow: 'radial-gradient(circle, rgba(217,164,65,0.18) 0%, rgba(30,37,56,0.12) 55%, transparent 75%)',
    watermark: 'text-[#d9a441]',
  },
  spark: {
    accent: '#f0c169',
    glow: 'radial-gradient(circle, rgba(240,193,105,0.22) 0%, rgba(176,80,60,0.12) 55%, transparent 75%)',
    watermark: 'text-[#f0c169]',
  },
};

function ThreadsStanzaBlock({ stanza, index }: StanzaProps) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.2);
  const mood = stanzaMoods[stanza.mood as keyof typeof stanzaMoods] || stanzaMoods.autumn;

  return (
    <section
      id={`threads-stanza-${index}`}
      className="relative flex min-h-[90svh] items-center justify-center px-6 py-20 sm:px-10"
    >
      {/* Фоновое сферическое свечение строфы */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: mood.glow,
          opacity: shown ? 1 : 0,
          transition: 'opacity 2s cubic-bezier(0.2, 0.6, 0, 1)',
        }}
      />

      {/* Призрачная римская цифра на фоне */}
      <span
        aria-hidden="true"
        className={`font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[50vmin] font-light leading-none ${mood.watermark}`}
        style={{
          opacity: shown ? 0.05 : 0,
          transition: 'opacity 2.5s cubic-bezier(0.2, 0.6, 0, 1)',
        }}
      >
        {stanza.numeral}
      </span>

      <div ref={ref} className="relative z-10 max-w-2xl w-full">
        {/* Заголовок строфы */}
        <div
          className={`mb-10 flex items-center gap-4 line-anim ${
            shown ? 'line-shown' : 'line-hidden'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <span className="h-px w-10" style={{ background: mood.accent, opacity: 0.6 }} />
          <span
            className="font-ui text-[11px] font-medium uppercase tracking-[0.45em]"
            style={{ color: mood.accent }}
          >
            Строфа {stanza.numeral} {stanza.subtitle && `• ${stanza.subtitle}`}
          </span>
        </div>

        {/* Текст строфы (8 строк с деликатным межстрочным интервалом и задержкой появления) */}
        <div className="space-y-0">
          {stanza.lines.map((line, lineIdx) => (
            <p
              key={lineIdx}
              className={`font-poem text-[1.35rem] leading-[2.1] text-[#f0e7db] sm:text-2xl sm:leading-[2.05] lg:text-[1.7rem] line-anim ${
                shown ? 'line-shown' : 'line-hidden'
              } ${lineIdx === 4 ? 'mt-8' : ''}`}
              style={{
                transitionDelay: shown ? `${0.2 + lineIdx * 0.18}s` : '0s',
                textShadow: '0 0 24px rgba(6,5,4,0.9)',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Тонкий разделитель нити между строфами */}
        {index < 3 && (
          <div
            className={`mt-16 flex items-center justify-center line-anim ${
              shown ? 'line-shown' : 'line-hidden'
            }`}
            style={{ transitionDelay: '1.8s' }}
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#e09553]/40 to-transparent" />
            <span className="h-1 w-1 rounded-full bg-[#e09553]/60 mx-2" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent via-[#e09553]/40 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
