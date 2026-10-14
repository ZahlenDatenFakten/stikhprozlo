import { chapters, threadsStanzas } from '@/data/poem';

export interface TimedWord {
  id: string;
  text: string;
  cleanText: string;
  hasComma: boolean;
  hasSentenceEnd: boolean;
  hasDash: boolean;
  startTime: number;
  endTime: number;
  duration: number;
  chapterIndex: number;
  lineIndex: number;
  wordIndex: number;
  globalIndex: number;
}

export interface TimedLine {
  id: string;
  text: string;
  words: TimedWord[];
  startTime: number;
  endTime: number;
  chapterIndex: number;
  lineIndex: number;
}

export interface TimedChapter {
  id: string;
  numeral: string;
  title: string;
  mood: string;
  lines: TimedLine[];
  startTime: number;
  endTime: number;
}

export interface PoemTimingTrack {
  poemId: 'artist' | 'threads';
  title: string;
  audioSrc: string;
  totalDuration: number;
  chapters: TimedChapter[];
  allWords: TimedWord[];
}

/**
 * Базовые стартовые таймкоды строк для поэмы «Художник» (в секундах).
 * 6 глав: 4 строки, 4 строки, 8 строк, 8 строк, 8 строк, 8 строк.
 * При желании тайминги можно скорректировать под точную аудиозапись автора.
 */
export const ARTIST_LINE_TIMESTAMPS: number[][] = [
  // Глава I: Холст (4 строки)
  [0.8, 4.8, 9.0, 13.4],
  // Глава II: Тенета (4 строки)
  [21.0, 25.2, 29.8, 34.2],
  // Глава III: Кисть (8 строк)
  [42.0, 46.2, 50.4, 54.8, 59.2, 63.4, 67.8, 72.0],
  // Глава IV: Мост (8 строк)
  [80.0, 84.4, 88.6, 92.8, 97.2, 101.4, 105.6, 109.8],
  // Глава V: Мазок за мазком (8 строк)
  [118.0, 122.2, 126.4, 130.6, 135.0, 139.2, 143.6, 148.0],
  // Глава VI: Портрет (8 строк)
  [156.0, 160.4, 164.6, 168.8, 173.2, 177.4, 181.8, 186.0],
];

/**
 * Базовые стартовые таймкоды строк для стихотворения «Нити на ветру» (в секундах).
 * 4 строфы по 8 строк.
 */
export const THREADS_LINE_TIMESTAMPS: number[][] = [
  // Строфа I: Осенний след (8 строк)
  [0.8, 5.0, 9.4, 13.8, 18.6, 22.8, 27.2, 31.6],
  // Строфа II: Тени и коридор (8 строк)
  [36.0, 40.4, 44.8, 49.2, 53.6, 58.0, 62.4, 66.8],
  // Строфа III: Хрустальный пульс (8 строк)
  [71.5, 75.8, 80.2, 84.6, 89.0, 93.4, 97.8, 102.2],
  // Строфа IV: Неугасимая искра (8 строк)
  [107.0, 111.4, 115.8, 120.2, 124.8, 129.2, 133.8, 138.4],
];

/** Подсчет слогов и веса слова для естественного распределения времени письма */
function calculateWordWeight(word: string): {
  weight: number;
  hasComma: boolean;
  hasSentenceEnd: boolean;
  hasDash: boolean;
} {
  const clean = word.toLowerCase().replace(/[^а-яa-z0-9]/gi, '');
  const vowels = clean.match(/[аеёиоуыэюяaeiouy]/gi);
  const vowelCount = vowels ? vowels.length : 1;
  const consonantCount = Math.max(0, clean.length - vowelCount);

  const hasComma = word.includes(',');
  const hasSentenceEnd = /[.!?:]/.test(word);
  const hasDash = word.includes('—') || word.includes('-');

  // Базовый вес слова по фонетике
  let weight = vowelCount * 1.6 + consonantCount * 0.35;
  if (weight < 1) weight = 1;

  // Дополнительный вес пауз на знаках препинания
  if (hasComma) weight += 0.8;
  if (hasSentenceEnd) weight += 1.4;
  if (hasDash) weight += 0.9;

  return { weight, hasComma, hasSentenceEnd, hasDash };
}

/** Построение пословной структуры и таймингов для поэтического произведения */
function buildPoemTrack(
  poemId: 'artist' | 'threads',
  title: string,
  audioSrc: string,
  rawChapters: { numeral: string; title: string; mood: string; lines: string[] }[],
  timestamps: number[][]
): PoemTimingTrack {
  const chaptersResult: TimedChapter[] = [];
  const allWordsResult: TimedWord[] = [];
  let globalWordIndex = 0;

  for (let chIdx = 0; chIdx < rawChapters.length; chIdx++) {
    const rawChapter = rawChapters[chIdx];
    const chapterLineStarts = timestamps[chIdx] || [];
    const timedLines: TimedLine[] = [];

    const chapterStartTime = chapterLineStarts[0] ?? 0;
    let chapterEndTime = chapterStartTime;

    for (let lIdx = 0; lIdx < rawChapter.lines.length; lIdx++) {
      const lineText = rawChapter.lines[lIdx];
      const lineStart = chapterLineStarts[lIdx] ?? (chapterStartTime + lIdx * 4.2);

      // Определяем окно строки до следующей строки или до паузы между главами
      let nextLineStart: number;
      if (lIdx + 1 < rawChapter.lines.length) {
        nextLineStart = chapterLineStarts[lIdx + 1] ?? (lineStart + 4.2);
      } else {
        // Последняя строка главы: даем строке 4.5 сек звучания
        nextLineStart = lineStart + 4.5;
      }

      const rawWords = lineText.trim().split(/\s+/).filter(Boolean);
      const wordStats = rawWords.map((w) => calculateWordWeight(w));
      const totalWeight = wordStats.reduce((acc, cur) => acc + cur.weight, 0);

      // Оставляем небольшой дыхательный интервал в конце строки
      const lineWindow = Math.max(2.0, nextLineStart - lineStart);
      const lineBreathingTail = 0.55; // секунд тишины/вдоха перед следующей строкой
      const usableSpeechDuration = Math.max(1.5, lineWindow - lineBreathingTail);

      const timedWords: TimedWord[] = [];
      let currentWordStart = lineStart + 0.15; // микро-пауза перед первым словом строки

      for (let wIdx = 0; wIdx < rawWords.length; wIdx++) {
        const text = rawWords[wIdx];
        const cleanText = text.replace(/[^а-яА-ЯёЁa-zA-Z0-9-]/g, '');
        const stat = wordStats[wIdx];

        // Пропорциональная длительность слова
        const rawDuration = (stat.weight / totalWeight) * usableSpeechDuration;
        const duration = Math.max(0.28, rawDuration);
        const wordEnd = currentWordStart + duration;

        const timedWord: TimedWord = {
          id: `word-${poemId}-${chIdx}-${lIdx}-${wIdx}`,
          text,
          cleanText,
          hasComma: stat.hasComma,
          hasSentenceEnd: stat.hasSentenceEnd,
          hasDash: stat.hasDash,
          startTime: Math.round(currentWordStart * 100) / 100,
          endTime: Math.round(wordEnd * 100) / 100,
          duration: Math.round(duration * 100) / 100,
          chapterIndex: chIdx,
          lineIndex: lIdx,
          wordIndex: wIdx,
          globalIndex: globalWordIndex++,
        };

        timedWords.push(timedWord);
        allWordsResult.push(timedWord);

        // Пауза перед следующим словом
        let intraWordPause = 0.08;
        if (stat.hasComma) intraWordPause = 0.22;
        if (stat.hasSentenceEnd) intraWordPause = 0.40;
        if (stat.hasDash) intraWordPause = 0.25;

        currentWordStart = wordEnd + intraWordPause;
      }

      const lineEnd = timedWords.length > 0 ? timedWords[timedWords.length - 1].endTime : lineStart + 3;
      chapterEndTime = Math.max(chapterEndTime, lineEnd);

      timedLines.push({
        id: `line-${poemId}-${chIdx}-${lIdx}`,
        text: lineText,
        words: timedWords,
        startTime: lineStart,
        endTime: lineEnd,
        chapterIndex: chIdx,
        lineIndex: lIdx,
      });
    }

    chaptersResult.push({
      id: `chapter-${poemId}-${chIdx}`,
      numeral: rawChapter.numeral,
      title: rawChapter.title,
      mood: rawChapter.mood,
      lines: timedLines,
      startTime: chapterStartTime,
      endTime: chapterEndTime,
    });
  }

  const lastChapter = chaptersResult[chaptersResult.length - 1];
  const totalDuration = lastChapter ? lastChapter.endTime + 4.0 : 180;

  return {
    poemId,
    title,
    audioSrc,
    totalDuration,
    chapters: chaptersResult,
    allWords: allWordsResult,
  };
}

/** Сгенерированная дорожка таймингов для «Художника» */
export const artistTimingTrack: PoemTimingTrack = buildPoemTrack(
  'artist',
  'Художник',
  '/audio/artist-voice.mp3',
  chapters.map((c) => ({
    numeral: c.numeral,
    title: c.title,
    mood: c.mood,
    lines: c.lines,
  })),
  ARTIST_LINE_TIMESTAMPS
);

/** Сгенерированная дорожка таймингов для «Нитей на ветру» */
export const threadsTimingTrack: PoemTimingTrack = buildPoemTrack(
  'threads',
  'Нити на ветру',
  '/audio/threads-voice.mp3',
  threadsStanzas.map((s) => ({
    numeral: s.numeral,
    title: s.subtitle || `Строфа ${s.numeral}`,
    mood: s.mood,
    lines: s.lines,
  })),
  THREADS_LINE_TIMESTAMPS
);

/** Получение дорожки по ID */
export function getPoemTrack(poemId: 'artist' | 'threads'): PoemTimingTrack {
  return poemId === 'artist' ? artistTimingTrack : threadsTimingTrack;
}
