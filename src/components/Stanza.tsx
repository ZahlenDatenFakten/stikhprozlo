import { useEffect } from 'react';
import { useReveal } from '@/hooks/useReveal';
import type { Chapter } from '@/data/poem';
import { useCalligraphySync, getPoemTrack } from '@/lib/audio';
import CalligraphyLine from './CalligraphyLine';

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
  const calligraphy = useCalligraphySync();
  const style = moodStyles[chapter.mood];

  const track = getPoemTrack('artist');
  const timedChapter = track.chapters[index];

  const isPoemActive = calligraphy.isPlaying && calligraphy.activePoemId === 'artist';
  const isChapterActive = isPoemActive && calligraphy.activeChapterIndex === index;

  // Кинематографический автоскролл камеры за активной строкой
  useEffect(() => {
    if (isChapterActive && calligraphy.activeLineIndex >= 0) {
      const lineId = `line-wrap-artist-${index}-${calligraphy.activeLineIndex}`;
      const lineEl = document.getElementById(lineId);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isChapterActive, calligraphy.activeLineIndex, index]);

  return (
    <section
      id={`chapter-${index}`}
      className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 sm:px-8 lg:px-10 py-20 sm:py-28 overflow-hidden"
    >
      {/* Локальное свечение главы, тонко дышащее в такт голосу */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] rounded-full"
        style={{
          background: style.glow,
          opacity: shown ? (isChapterActive ? 0.75 + calligraphy.voiceEnergy * 0.4 : 1) : 0,
          transform: `translate(-50%, -50%) scale(${1 + (isChapterActive ? calligraphy.voiceEnergy * 0.14 : 0)})`,
          transition: isChapterActive
            ? 'transform 0.15s ease-out, opacity 0.2s ease-out'
            : 'opacity 2s cubic-bezier(0.2,0.6,0,1)',
        }}
      />

      {/* Призрачная цифра главы */}
      <span
        aria-hidden="true"
        className={`font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[48vmin] sm:text-[52vmin] font-light leading-none ${style.numeral}`}
        style={{
          opacity: shown ? (isChapterActive ? 0.08 + calligraphy.voiceEnergy * 0.05 : 0.055) : 0,
          transition: 'opacity 1.5s cubic-bezier(0.2,0.6,0,1)',
        }}
      >
        {chapter.numeral}
      </span>

      <div ref={ref} className="relative max-w-2xl w-full">
        <div
          className={`mb-8 sm:mb-12 flex items-center gap-4 sm:gap-5 line-anim ${shown ? 'line-shown' : 'line-hidden'}`}
        >
          <span className="h-px w-8 sm:w-10" style={{ background: style.accent, opacity: 0.6 }} />
          <span
            className="font-ui text-[10px] sm:text-[11px] font-light uppercase"
            style={{ letterSpacing: '0.45em', color: style.accent }}
          >
            {chapter.title}
          </span>
          {isChapterActive && (
            <span className="flex items-center gap-1.5 text-[10px] font-ui uppercase tracking-wider text-[#f0c169] animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f0c169]" />
              Звучит голос
            </span>
          )}
        </div>

        <div className="space-y-0">
          {chapter.lines.map((line, i) => {
            const timedLine = timedChapter?.lines[i];
            return (
              <div
                key={i}
                className={i > 0 && i % 4 === 0 ? 'mt-8 sm:mt-9' : ''}
              >
                <CalligraphyLine
                  poemId="artist"
                  chapterIndex={index}
                  lineIndex={i}
                  lineText={line}
                  timedWords={timedLine?.words}
                  accentColor={style.accent}
                  isShown={shown}
                  lineDelay={shown ? `${0.25 + i * 0.22}s` : '0s'}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
