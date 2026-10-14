import { useEffect } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { threadsStanzas, threadsMeaning, type StanzaItem } from '@/data/poem';
import { Feather, Sparkles } from 'lucide-react';
import { calligraphyAudio, useCalligraphySync, getPoemTrack } from '@/lib/audio';
import CalligraphyLine from './CalligraphyLine';

export default function PoemThreads() {
  const { ref: headerRef, shown: headerShown } = useReveal<HTMLDivElement>(0.2);
  const { ref: meaningRef, shown: meaningShown } = useReveal<HTMLDivElement>(0.2);
  const calligraphy = useCalligraphySync();

  const isThreadsPlaying = calligraphy.isPlaying && calligraphy.activePoemId === 'threads';

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

        {/* Единственная эстетичная кнопка оживления рукописи голосом автора */}
        <div
          className={`fade-anim mt-8 flex justify-center ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.75s' }}
        >
          <button
            onClick={() => calligraphyAudio.toggle('threads')}
            className={`group inline-flex items-center gap-2.5 rounded-full border px-6 py-2.5 backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 ${
              isThreadsPlaying
                ? 'border-[#f0c169] bg-[#d9a441]/25 text-[#f5efe6] shadow-[0_0_25px_rgba(240,193,105,0.4)]'
                : 'border-[#e09553]/40 bg-[#14100c]/80 text-[#e9dfd3] hover:border-[#f0c169] hover:bg-[#e09553]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
            }`}
          >
            <Feather className={`h-4 w-4 ${isThreadsPlaying ? 'text-[#f0c169] animate-pulse' : 'text-[#e09553]'}`} />
            <span className="font-ui text-xs tracking-wider uppercase">
              {isThreadsPlaying ? 'Пауза чтения' : 'Оживить рукопись голосом'}
            </span>
            <span className="font-ui text-[10px] text-[#e09553]/70 uppercase tracking-widest">• ~2 мин</span>
          </button>
        </div>

        {/* Анимированная золотая нить ветра */}
        <div
          className={`fade-anim mt-10 mx-auto max-w-md ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.9s' }}
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
          className={`relative overflow-hidden rounded-3xl border border-[#d9a441]/35 bg-gradient-to-b from-[#14100c]/95 via-[#0e0c0a]/95 to-[#16120e]/95 p-5 sm:p-10 lg:p-14 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(217,164,65,0.08)] line-anim ${
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

            <div className="my-5 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[#d9a441] to-transparent" />
          </div>

          {/* Абзацы осмысления автора */}
          <div className="mt-8 space-y-6">
            {threadsMeaning.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="font-poem text-base sm:text-xl lg:text-[1.28rem] italic leading-[2.05] sm:leading-[2.1] text-[#d6cbbe]"
                style={{ textShadow: '0 1px 12px rgba(6,5,4,0.8)' }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Нижний акцент карточки смысла */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-xs font-ui text-[#d9a441]">
              <Sparkles className="h-4 w-4 text-[#f0c169]" />
              <span className="tracking-[0.2em] uppercase">Откровение автора</span>
            </div>
            <span className="font-poem text-sm italic text-[#a89c8d]">Тамерлан</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StanzaProps {
  stanza: StanzaItem;
  index: number;
}

const stanzaMoods = {
  autumn: {
    accent: '#e09553',
    glow: 'radial-gradient(circle, rgba(224,149,83,0.18) 0%, rgba(138,51,36,0.12) 55%, transparent 75%)',
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
  const calligraphy = useCalligraphySync();
  const mood = stanzaMoods[stanza.mood as keyof typeof stanzaMoods] || stanzaMoods.autumn;

  const track = getPoemTrack('threads');
  const timedStanza = track.chapters[index];

  const isPoemActive = calligraphy.isPlaying && calligraphy.activePoemId === 'threads';
  const isStanzaActive = isPoemActive && calligraphy.activeChapterIndex === index;

  // Кинематографический автоскролл камеры за активной строкой
  useEffect(() => {
    if (isStanzaActive && calligraphy.activeLineIndex >= 0) {
      const lineId = `line-wrap-threads-${index}-${calligraphy.activeLineIndex}`;
      const lineEl = document.getElementById(lineId);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isStanzaActive, calligraphy.activeLineIndex, index]);

  return (
    <section
      id={`threads-stanza-${index}`}
      className="relative flex min-h-[90svh] items-center justify-center px-4 sm:px-8 lg:px-10 py-16 sm:py-20 overflow-hidden"
    >
      {/* Фоновое сферическое свечение строфы, дышащее в такт голосу */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: mood.glow,
          opacity: shown ? (isStanzaActive ? 0.75 + calligraphy.voiceEnergy * 0.4 : 1) : 0,
          transform: `translate(-50%, -50%) scale(${1 + (isStanzaActive ? calligraphy.voiceEnergy * 0.14 : 0)})`,
          transition: isStanzaActive
            ? 'transform 0.15s ease-out, opacity 0.2s ease-out'
            : 'opacity 2s cubic-bezier(0.2, 0.6, 0, 1)',
        }}
      />

      {/* Призрачная римская цифра на фоне */}
      <span
        aria-hidden="true"
        className={`font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[48vmin] sm:text-[50vmin] font-light leading-none ${mood.watermark}`}
        style={{
          opacity: shown ? (isStanzaActive ? 0.08 + calligraphy.voiceEnergy * 0.05 : 0.05) : 0,
          transition: 'opacity 1.5s cubic-bezier(0.2, 0.6, 0, 1)',
        }}
      >
        {stanza.numeral}
      </span>

      <div ref={ref} className="relative z-10 max-w-2xl w-full">
        {/* Заголовок строфы */}
        <div
          className={`mb-8 sm:mb-10 flex items-center gap-3.5 sm:gap-4 line-anim ${
            shown ? 'line-shown' : 'line-hidden'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <span className="h-px w-8 sm:w-10" style={{ background: mood.accent, opacity: 0.6 }} />
          <span
            className="font-ui text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.45em]"
            style={{ color: mood.accent }}
          >
            Строфа {stanza.numeral} {stanza.subtitle && `• ${stanza.subtitle}`}
          </span>
          {isStanzaActive && (
            <span className="flex items-center gap-1.5 text-[10px] font-ui uppercase tracking-wider text-[#f0c169] animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f0c169]" />
              Звучит голос
            </span>
          )}
        </div>

        {/* Текст строфы (8 строк с пословным выводом пером) */}
        <div className="space-y-0">
          {stanza.lines.map((line, lineIdx) => {
            const timedLine = timedStanza?.lines[lineIdx];
            return (
              <div
                key={lineIdx}
                className={lineIdx === 4 ? 'mt-7 sm:mt-8' : ''}
              >
                <CalligraphyLine
                  poemId="threads"
                  chapterIndex={index}
                  lineIndex={lineIdx}
                  lineText={line}
                  timedWords={timedLine?.words}
                  accentColor={mood.accent}
                  isShown={shown}
                  lineDelay={shown ? `${0.2 + lineIdx * 0.18}s` : '0s'}
                />
              </div>
            );
          })}
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
