import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Feather } from 'lucide-react';
import { ambientAudio } from '@/lib/audio';

interface Props {
  journey: number;
  onNavigate: (targetId: string) => void;
}

export default function FloatingNavbar({ journey, onNavigate }: Props) {
  const [audioActive, setAudioActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-tamerlan');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);

      const sections = [
        'hero-tamerlan',
        'poems-showcase',
        'poem-artist',
        'poem-threads',
        'poem-threads-meaning',
      ];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 0) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const next = ambientAudio.toggle();
    setAudioActive(next);
  };

  return (
    <>
      {/* Прогресс чтения по верхнему краю */}
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-transparent pointer-events-none">
        <div
          className="h-full origin-left bg-gradient-to-r from-[#8b2a1e] via-[#d9a441] to-[#f0c169] transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${journey})` }}
        />
      </div>

      {/* Парящий навбар */}
      <nav
        aria-label="Основная навигация"
        className={`fixed top-4 left-4 right-4 z-40 mx-auto max-w-5xl rounded-full border transition-all duration-500 ${
          isScrolled
            ? 'border-white/10 bg-[#0c0a08]/85 py-2.5 px-4 sm:px-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.65)]'
            : 'border-white/5 bg-[#0c0a08]/50 py-3 px-4 sm:px-6 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Бренд */}
          <button
            onClick={() => onNavigate('hero-tamerlan')}
            className="flex items-center gap-2 group cursor-pointer text-left shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10 transition-colors group-hover:border-[#f0c169] group-hover:bg-[#d9a441]/20">
              <Feather className="h-4 w-4 text-[#d9a441] transition-transform group-hover:scale-110" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-base font-medium tracking-wider text-[#f5efe6] group-hover:text-[#f0c169] transition-colors">
                Стихи Тамерлана
              </span>
            </div>
          </button>

          {/* Навигационные ссылки */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 no-scrollbar">
            <button
              onClick={() => onNavigate('poems-showcase')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'poems-showcase'
                  ? 'bg-[#d9a441]/20 text-[#f5efe6] border border-[#d9a441]/40 shadow-[0_0_12px_rgba(217,164,65,0.2)]'
                  : 'text-[#a89c8d] hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              Таблички стихов
            </button>

            <button
              onClick={() => onNavigate('poem-artist')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'poem-artist'
                  ? 'bg-[#d9a441]/20 text-[#f5efe6] border border-[#d9a441]/40 shadow-[0_0_12px_rgba(217,164,65,0.2)]'
                  : 'text-[#a89c8d] hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              «Художник»
            </button>

            <button
              onClick={() => onNavigate('poem-threads')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'poem-threads'
                  ? 'bg-[#d9a441]/20 text-[#f5efe6] border border-[#d9a441]/40 shadow-[0_0_12px_rgba(217,164,65,0.2)]'
                  : 'text-[#a89c8d] hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              «Нити на ветру»
            </button>

            <button
              onClick={() => onNavigate('poem-threads-meaning')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer hidden md:inline-flex ${
                activeSection === 'poem-threads-meaning'
                  ? 'bg-[#e09553]/25 text-[#f5efe6] border border-[#e09553]/50 shadow-[0_0_12px_rgba(224,149,83,0.3)]'
                  : 'text-[#e09553]/80 hover:text-[#f5efe6] hover:bg-[#e09553]/10'
              }`}
            >
              Смысл стиха
            </button>
          </div>

          {/* Правая часть: кнопка эмбиент-звука */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAudioToggle}
              title={audioActive ? 'Выключить атмосферный звук' : 'Включить атмосферный звук (Web Audio)'}
              aria-label={audioActive ? 'Выключить звук' : 'Включить атмосферный звук'}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-ui text-[11px] transition-all duration-300 cursor-pointer ${
                audioActive
                  ? 'border-[#d9a441] bg-[#d9a441]/20 text-[#f5efe6] shadow-[0_0_15px_rgba(217,164,65,0.3)]'
                  : 'border-white/10 bg-white/5 text-[#a89c8d] hover:border-white/20 hover:text-[#f5efe6]'
              }`}
            >
              {audioActive ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-[#f0c169] animate-pulse" />
                  <span className="hidden sm:inline">Эмбиент</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Звук</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
