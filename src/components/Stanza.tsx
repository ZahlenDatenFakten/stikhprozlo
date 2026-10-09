import { useReveal } from '@/hooks/useReveal';
import type { Chapter } from '@/data/poem';

const moodStyles: Record<
  Chapter['mood'],
  { numeral: string; glow: string; accent: string }
> = {
  ash: {
    numeral: 'text-[#e9dfd3]',
    glow: 'radial-gradient(circle, rgba(120,116,130,0.14) 0%, rgba(120,116,130,0) 62%)',
    accent: '#a89c8d',
  },
  ember: {
    numeral: 'text-[#8b2a1e]',
    glow: 'radial-gradient(circle, rgba(139,42,30,0.20) 0%, rgba(139,42,30,0) 62%)',
    accent: '#b0503c',
  },
  dawn: {
    numeral: 'text-[#d9a441]',
    glow: 'radial-gradient(circle, rgba(217,164,65,0.13) 0%, rgba(217,164,65,0) 62%)',
    accent: '#d9a441',
  },
  struggle: {
    numeral: 'text-[#b0503c]',
    glow: 'radial-gradient(circle, rgba(150,70,40,0.16) 0%, rgba(150,70,40,0) 62%)',
    accent: '#c97b4a',
  },
  glow: {
    numeral: 'text-[#d9a441]',
    glow: 'radial-gradient(circle, rgba(224,176,92,0.20) 0%, rgba(224,176,92,0) 62%)',
    accent: '#e0b05c',
  },
  light: {
    numeral: 'text-[#f0c169]',
    glow: 'radial-gradient(circle, rgba(240,193,105,0.26) 0%, rgba(240,193,105,0) 60%)',
    accent: '#f0c169',
  },
};

export default function Stanza({ chapter, index }: { chapter: Chapter; index: number }) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.2);
  const style = moodStyles[chapter.mood];

  return (
    <section
      id={`chapter-${index}`}
      className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-28 sm:px-10"
    >
      {/* Локальное свечение главы */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: style.glow, opacity: shown ? 1 : 0, transition: 'opacity 2s cubic-bezier(0.2,0.6,0,1)' }}
      />

      {/* Призрачная цифра главы */}
      <span
        aria-hidden="true"
        className={`font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[52vmin] font-light leading-none ${style.numeral}`}
        style={{ opacity: shown ? 0.055 : 0, transition: 'opacity 2.5s cubic-bezier(0.2,0.6,0,1)' }}
      >
        {chapter.numeral}
      </span>

      <div ref={ref} className="relative max-w-2xl">
        <div
          className={`mb-12 flex items-center gap-5 line-anim ${shown ? 'line-shown' : 'line-hidden'}`}
        >
          <span className="h-px w-10" style={{ background: style.accent, opacity: 0.6 }} />
          <span
            className="font-ui text-[10px] font-light uppercase"
            style={{ letterSpacing: '0.45em', color: style.accent }}
          >
            {chapter.title}
          </span>
        </div>

        <div className="space-y-0">
          {chapter.lines.map((line, i) => (
            <p
              key={i}
              className={`font-poem text-[1.35rem] leading-[2.05] text-[#e9dfd3] sm:text-2xl sm:leading-[2] lg:text-[1.7rem] line-anim ${
                shown ? 'line-shown' : 'line-hidden'
              } ${i > 0 && i % 4 === 0 ? 'mt-9' : ''}`}
              style={{
                transitionDelay: shown ? `${0.25 + i * 0.22}s` : '0s',
                textShadow: '0 0 24px rgba(6,5,4,0.9)',
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
