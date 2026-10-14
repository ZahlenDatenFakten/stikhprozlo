import { chapters } from '@/data/poem';
import Stanza from '@/components/Stanza';
import BrushDivider from '@/components/BrushDivider';
import Finale from '@/components/Finale';
import { useReveal } from '@/hooks/useReveal';
import { Palette, Feather } from 'lucide-react';
import { calligraphyAudio, useCalligraphySync } from '@/lib/audio';

export default function PoemArtist() {
  const { ref: headerRef, shown: headerShown } = useReveal<HTMLDivElement>(0.2);
  const calligraphy = useCalligraphySync();
  const isArtistPlaying = calligraphy.isPlaying && calligraphy.activePoemId === 'artist';

  return (
    <div id="poem-artist" className="relative z-10 w-full overflow-hidden py-24 sm:py-32">
      {/* Фоновое янтарное свечение поэмы «Художник» */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-full -translate-x-1/2 opacity-35 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(217,164,65,0.2) 0%, rgba(139,42,30,0.15) 50%, transparent 80%)',
        }}
      />

      {/* Заголовок поэмы «Художник» */}
      <header
        ref={headerRef}
        className="relative mx-auto max-w-4xl px-6 text-center mb-16 sm:mb-24"
      >
        <div
          className={`fade-anim flex items-center justify-center gap-3 ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d9a441]/60" />
          <div className="flex items-center gap-2 rounded-full border border-[#d9a441]/25 bg-[#14100c]/60 px-3.5 py-1 backdrop-blur-sm">
            <Palette className="h-3 w-3 text-[#d9a441]" />
            <span className="font-ui text-[10px] font-medium tracking-[0.45em] uppercase text-[#d9a441]">
              Поэма в VI главах
            </span>
          </div>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d9a441]/60" />
        </div>

        <h2
          className={`font-display mt-8 text-5xl sm:text-7xl lg:text-8xl font-light tracking-[0.12em] text-[#f5efe6] fade-anim ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{
            textShadow: '0 0 45px rgba(217,164,65,0.25), 0 4px 20px rgba(0,0,0,0.9)',
            transitionDelay: '0.35s',
          }}
        >
          Художник
        </h2>

        <div
          className={`fade-anim my-6 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#d9a441] to-transparent ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.55s' }}
        />

        <p
          className={`font-poem max-w-lg mx-auto text-xl sm:text-2xl italic leading-relaxed text-[#c7beaf] fade-anim ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.75s' }}
        >
          о душе — холсте, о тьме и свете,
          <br />и о том, кто держит кисть
        </p>

        {/* Эстетичная кнопка оживления рукописи голосом автора */}
        <div
          className={`fade-anim mt-8 flex justify-center ${
            headerShown ? 'fade-shown' : 'fade-hidden'
          }`}
          style={{ transitionDelay: '0.9s' }}
        >
          <button
            onClick={() => calligraphyAudio.toggle('artist')}
            className={`group inline-flex items-center gap-2.5 rounded-full border px-6 py-2.5 backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 ${
              isArtistPlaying
                ? 'border-[#f0c169] bg-[#d9a441]/25 text-[#f5efe6] shadow-[0_0_25px_rgba(240,193,105,0.4)]'
                : 'border-[#d9a441]/40 bg-[#14100c]/80 text-[#e9dfd3] hover:border-[#f0c169] hover:bg-[#d9a441]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
            }`}
          >
            <Feather className={`h-4 w-4 ${isArtistPlaying ? 'text-[#f0c169] animate-pulse' : 'text-[#d9a441]'}`} />
            <span className="font-ui text-xs tracking-wider uppercase">
              {isArtistPlaying ? 'Пауза чтения' : 'Оживить рукопись голосом'}
            </span>
            <span className="font-ui text-[10px] text-[#d9a441]/70 uppercase tracking-widest">• ~3 мин</span>
          </button>
        </div>
      </header>

      {/* Главы поэмы с сохранением авторской логики */}
      {chapters.map((chapter, i) => (
        <div key={chapter.numeral}>
          <Stanza chapter={chapter} index={i} />
          {i < chapters.length - 1 && <BrushDivider variant={i} />}
        </div>
      ))}

      {/* Финал поэмы */}
      <Finale />
    </div>
  );
}
