import { useEffect, useState } from 'react';
import {
  getPoemTrack,
  type PoemTimingTrack,
  type TimedWord,
  type TimedChapter,
  type TimedLine,
} from './calligraphyTiming';

export interface CalligraphyState {
  isPlaying: boolean;
  activePoemId: 'artist' | 'threads' | null;
  currentTime: number;
  duration: number;
  voiceEnergy: number; // 0..1 — громкость и экспрессия голоса
  activeChapterIndex: number;
  activeLineIndex: number;
  activeWordIndex: number;
  wordProgress: number; // 0..1 — прогресс прорисовки активного слова
  activeWord: TimedWord | null;
  activeLine: TimedLine | null;
  activeChapter: TimedChapter | null;
  isFallback: boolean; // true если аудиофайл еще не залит и работает встроенный синтез таймингов
}

type CalligraphyListener = (state: CalligraphyState) => void;

class CalligraphyEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;

  private isPlaying = false;
  private activePoemId: 'artist' | 'threads' | null = null;
  private currentTrack: PoemTimingTrack | null = null;

  // Fallback / Software Clock
  private isFallback = true;
  private fallbackStartTime = 0;
  private fallbackPausedAt = 0;

  private animFrameId: number | null = null;
  private listeners = new Set<CalligraphyListener>();

  // Cached state
  private state: CalligraphyState = {
    isPlaying: false,
    activePoemId: null,
    currentTime: 0,
    duration: 180,
    voiceEnergy: 0,
    activeChapterIndex: -1,
    activeLineIndex: -1,
    activeWordIndex: -1,
    wordProgress: 0,
    activeWord: null,
    activeLine: null,
    activeChapter: null,
    isFallback: true,
  };

  constructor() {
    // Lazy audio setup
  }

  private initAudioContext() {
    if (this.audioCtx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount) as unknown as Uint8Array<ArrayBuffer>;
    } catch {
      // AudioContext unavailable
    }
  }

  public subscribe(listener: CalligraphyListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): CalligraphyState {
    return this.state;
  }

  public async play(poemId: 'artist' | 'threads') {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch {
        // ignore
      }
    }

    if (this.activePoemId !== poemId) {
      this.stopCurrentAudio();
      this.activePoemId = poemId;
      this.currentTrack = getPoemTrack(poemId);
      this.fallbackPausedAt = 0;
    }

    this.isPlaying = true;
    const track = this.currentTrack || getPoemTrack(poemId);
    this.currentTrack = track;

    // Пробуем запустить реальный аудиофайл
    const audio = new Audio();
    audio.src = track.audioSrc;
    audio.preload = 'auto';

    let audioLoaded = false;

    audio.addEventListener('canplaythrough', () => {
      audioLoaded = true;
      this.isFallback = false;
      this.audioElement = audio;

      try {
        if (this.audioCtx && !this.mediaSource && this.analyser) {
          this.mediaSource = this.audioCtx.createMediaElementSource(audio);
          this.mediaSource.connect(this.analyser);
          this.analyser.connect(this.audioCtx.destination);
        }
        audio.currentTime = this.state.currentTime;
        audio.play().catch(() => {
          this.fallbackToSoftwareClock();
        });
      } catch {
        this.fallbackToSoftwareClock();
      }
    });

    audio.addEventListener('error', () => {
      // Аудиофайл еще не залит в public/audio/ -> плавный fallback
      this.fallbackToSoftwareClock();
    });

    audio.addEventListener('ended', () => {
      this.pause();
      this.seek(0);
    });

    // Страховочный таймаут: если за 400мс аудио не подгрузилось, стартуем мгновенный fallback
    setTimeout(() => {
      if (!audioLoaded && this.isPlaying) {
        this.fallbackToSoftwareClock();
      }
    }, 450);

    // Запуск цикла обновления кадров
    this.fallbackStartTime = performance.now() - this.fallbackPausedAt * 1000;
    this.startTickLoop();
  }

  private fallbackToSoftwareClock() {
    this.isFallback = true;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {
        // ignore
      }
      this.audioElement = null;
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {
        // ignore
      }
    }
    this.fallbackPausedAt = this.state.currentTime;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.updateState({
      isPlaying: false,
      voiceEnergy: 0,
    });
  }

  public toggle(poemId: 'artist' | 'threads' = 'artist') {
    if (this.isPlaying) {
      if (this.activePoemId === poemId) {
        this.pause();
      } else {
        this.play(poemId);
      }
    } else {
      this.play(poemId);
    }
  }

  public seek(seconds: number) {
    const clamped = Math.max(0, Math.min(seconds, this.state.duration));
    this.fallbackPausedAt = clamped;
    this.fallbackStartTime = performance.now() - clamped * 1000;

    if (this.audioElement) {
      try {
        this.audioElement.currentTime = clamped;
      } catch {
        // ignore
      }
    }

    this.computeFrame(clamped);
  }

  private stopCurrentAudio() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.audioElement = null;
    }
    this.state.currentTime = 0;
    this.fallbackPausedAt = 0;
  }

  private startTickLoop() {
    if (this.animFrameId) return;

    const tick = () => {
      if (!this.isPlaying) return;

      let time = 0;
      if (!this.isFallback && this.audioElement && !this.audioElement.paused) {
        time = this.audioElement.currentTime;
      } else {
        time = (performance.now() - this.fallbackStartTime) / 1000;
      }

      const track = this.currentTrack;
      if (track && time >= track.totalDuration) {
        this.pause();
        this.seek(0);
        return;
      }

      this.computeFrame(time);
      this.animFrameId = requestAnimationFrame(tick);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }

  private computeFrame(currentTime: number) {
    const track = this.currentTrack;
    if (!track) return;

    // 1. Расчет voiceEnergy
    let voiceEnergy = 0;
    if (!this.isFallback && this.analyser && this.freqData) {
      this.analyser.getByteFrequencyData(this.freqData as unknown as Uint8Array<ArrayBuffer>);
      // Диапазон голоса: бины 2..22 (~300..3500 Гц)
      let sum = 0;
      const count = 20;
      for (let i = 2; i < 22 && i < this.freqData.length; i++) {
        sum += this.freqData[i];
      }
      const rawAvg = sum / count / 255;
      voiceEnergy = Math.min(1, Math.max(0, rawAvg * 1.6));
    }

    // 2. Поиск активной главы, строки и слова
    let activeChapterIndex = -1;
    let activeLineIndex = -1;
    let activeWordIndex = -1;
    let wordProgress = 0;
    let activeWord: TimedWord | null = null;
    let activeLine: TimedLine | null = null;
    let activeChapter: TimedChapter | null = null;

    // Ищем текущую главу
    for (let c = 0; c < track.chapters.length; c++) {
      const ch = track.chapters[c];
      if (currentTime >= ch.startTime && currentTime <= ch.endTime + 2.5) {
        activeChapterIndex = c;
        activeChapter = ch;
        break;
      }
    }

    if (activeChapter) {
      // Ищем строку
      for (let l = 0; l < activeChapter.lines.length; l++) {
        const line = activeChapter.lines[l];
        if (currentTime >= line.startTime && currentTime <= line.endTime + 0.8) {
          activeLineIndex = l;
          activeLine = line;
          break;
        }
      }
    }

    if (activeLine) {
      // Ищем слово
      for (let w = 0; w < activeLine.words.length; w++) {
        const word = activeLine.words[w];
        if (currentTime >= word.startTime && currentTime <= word.endTime) {
          activeWordIndex = w;
          activeWord = word;
          const progress = (currentTime - word.startTime) / Math.max(0.01, word.duration);
          wordProgress = Math.min(1, Math.max(0, progress));
          break;
        } else if (w < activeLine.words.length - 1 && currentTime > word.endTime && currentTime < activeLine.words[w + 1].startTime) {
          // Пауза между словами внутри строки: перо удерживает позицию конца предыдущего слова
          activeWordIndex = w;
          activeWord = word;
          wordProgress = 1;
          break;
        } else if (w === activeLine.words.length - 1 && currentTime > word.endTime) {
          // Конец строки
          activeWordIndex = w;
          activeWord = word;
          wordProgress = 1;
        }
      }
    }

    // Если синтетический fallback: генерируем органическую пульсацию энергии голоса
    if (this.isFallback) {
      if (activeWord && wordProgress > 0 && wordProgress < 1) {
        // Слово сейчас пишется/произносится
        const t = currentTime;
        const wave = 0.42 + 0.35 * Math.sin(t * 11) + 0.15 * Math.sin(t * 19.3);
        voiceEnergy = Math.min(1, Math.max(0.15, wave));
      } else {
        // Пауза между словами или строками
        voiceEnergy = 0.04;
      }
    }

    this.updateState({
      isPlaying: this.isPlaying,
      activePoemId: this.activePoemId,
      currentTime,
      duration: track.totalDuration,
      voiceEnergy,
      activeChapterIndex,
      activeLineIndex,
      activeWordIndex,
      wordProgress,
      activeWord,
      activeLine,
      activeChapter,
      isFallback: this.isFallback,
    });
  }

  private updateState(partial: Partial<CalligraphyState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const calligraphyAudio = new CalligraphyEngine();

/** Реактивный хук для подключения компонентов к каллиграфическому чтению */
export function useCalligraphySync(): CalligraphyState {
  const [state, setState] = useState<CalligraphyState>(calligraphyAudio.getState());

  useEffect(() => {
    return calligraphyAudio.subscribe((next) => {
      setState(next);
    });
  }, []);

  return state;
}
