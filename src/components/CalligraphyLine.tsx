import { useCalligraphySync, type TimedWord } from '@/lib/audio';

interface Props {
  poemId: 'artist' | 'threads';
  chapterIndex: number;
  lineIndex: number;
  lineText: string;
  timedWords?: TimedWord[];
  accentColor?: string;
  isShown: boolean;
  lineDelay: string;
}

export default function CalligraphyLine({
  poemId,
  chapterIndex,
  lineIndex,
  lineText,
  timedWords = [],
  accentColor = '#f0c169',
  isShown,
  lineDelay,
}: Props) {
  const calligraphy = useCalligraphySync();

  const isPoemActive = calligraphy.isPlaying && calligraphy.activePoemId === poemId;

  // Если каллиграфическое воспроизведение не включено — стандартный красивый показ
  if (!isPoemActive || timedWords.length === 0) {
    return (
      <p
        className={`font-poem text-[1.2rem] leading-[2.0] text-[#e9dfd3] sm:text-2xl sm:leading-[2] lg:text-[1.7rem] line-anim ${
          isShown ? 'line-shown' : 'line-hidden'
        }`}
        style={{
          transitionDelay: lineDelay,
          textShadow: '0 0 24px rgba(6,5,4,0.9)',
        }}
      >
        {lineText}
      </p>
    );
  }

  // Режим живого каллиграфического письма
  const currentChapterIdx = calligraphy.activeChapterIndex;
  const currentLineIdx = calligraphy.activeLineIndex;
  const currentWordIdx = calligraphy.activeWordIndex;
  const wordProgress = calligraphy.wordProgress;
  const currentTime = calligraphy.currentTime;
  const voiceEnergy = calligraphy.voiceEnergy;

  const isChapterPassed = currentChapterIdx > chapterIndex;
  const isChapterFuture = currentChapterIdx < chapterIndex;
  const isChapterCurrent = currentChapterIdx === chapterIndex;

  const isLinePassed = isChapterPassed || (isChapterCurrent && currentLineIdx > lineIndex);
  const isLineFuture = isChapterFuture || (isChapterCurrent && currentLineIdx < lineIndex);
  const isLineCurrent = isChapterCurrent && currentLineIdx === lineIndex;

  return (
    <p
      id={`line-wrap-${poemId}-${chapterIndex}-${lineIndex}`}
      className={`font-poem text-[1.2rem] leading-[2.0] sm:text-2xl sm:leading-[2] lg:text-[1.7rem] transition-opacity duration-700 ${
        isLineFuture ? 'opacity-15' : 'opacity-100'
      }`}
      style={{
        textShadow: '0 0 24px rgba(6,5,4,0.9)',
      }}
    >
      {timedWords.map((word, wIdx) => {
        let status: 'past' | 'active' | 'future' = 'future';

        if (isLinePassed) {
          status = 'past';
        } else if (isLineFuture) {
          status = 'future';
        } else if (isLineCurrent) {
          if (wIdx < currentWordIdx) {
            status = 'past';
          } else if (wIdx === currentWordIdx) {
            status = 'active';
          } else {
            status = 'future';
          }
        }

        // Проверяем эффект высыхания чернил (1.4 секунды после написания)
        const timeSinceEnd = currentTime - word.endTime;
        const isDrying = status === 'past' && isLineCurrent && timeSinceEnd >= 0 && timeSinceEnd <= 1.4;

        if (status === 'past') {
          return (
            <span
              key={word.id}
              id={word.id}
              className={`inline-block font-handwriting ${
                isDrying ? 'ink-drying' : 'ink-dry'
              }`}
            >
              {word.text}&nbsp;
            </span>
          );
        }

        if (status === 'future') {
          return (
            <span
              key={word.id}
              id={word.id}
              className="inline-block opacity-10 select-none font-handwriting"
            >
              {word.text}&nbsp;
            </span>
          );
        }

        // status === 'active' — Слово сейчас пишется пером
        const clipPercent = Math.max(0, Math.min(100, (1 - wordProgress) * 100));

        return (
          <span
            key={word.id}
            id={word.id}
            className="relative inline-block font-handwriting"
          >
            {/* Фантомная подложка для сохранения ширины слова */}
            <span className="opacity-0 select-none">{word.text}&nbsp;</span>

            {/* Прорисовывающееся слово из-под кончика пера */}
            <span
              className="absolute left-0 top-0 whitespace-nowrap text-[#f0c169] drop-shadow-[0_0_8px_rgba(240,193,105,0.7)]"
              style={{
                clipPath: `inset(0 ${clipPercent}% 0 0)`,
                textShadow: `0 0 ${12 + voiceEnergy * 16}px ${accentColor}, 0 0 ${24 + voiceEnergy * 24}px rgba(217,164,65,0.5)`,
              }}
            >
              {word.text}&nbsp;
            </span>
          </span>
        );
      })}
    </p>
  );
}
