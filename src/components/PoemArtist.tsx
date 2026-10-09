import { chapters } from '@/data/poem';
import Stanza from '@/components/Stanza';
import BrushDivider from '@/components/BrushDivider';
import Finale from '@/components/Finale';
import { useReveal } from '@/hooks/useReveal';
import { Palette } from 'lucide-react';

export default function PoemArtist() {
  const { ref: headerRef, shown: headerShown } = useReveal<HTMLDivElement>(0.2);

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
