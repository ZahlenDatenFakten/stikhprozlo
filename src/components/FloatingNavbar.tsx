import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Feather, Menu, X, QrCode, Sparkles } from 'lucide-react';
import { ambientAudio, calligraphyAudio, useCalligraphySync } from '@/lib/audio';
import MobileConnectModal from './MobileConnectModal';

interface Props {
  journey: number;
  onNavigate: (targetId: string) => void;
}

const navSections = [
  { id: 'hero-tamerlan', label: 'Заставка', short: '✧ Главная' },
  { id: 'poems-showcase', label: 'Альбом: «Холст и Нити»', short: '❖ Альбом' },
  { id: 'poem-artist', label: 'Часть I: «Художник»', short: 'I. Художник' },
  { id: 'album-bridge', label: 'Связующая нить (Мост)', short: '〰 Мост пера' },
  { id: 'poem-threads', label: 'Часть II: «Нити на ветру»', short: 'II. Нити' },
  { id: 'poem-threads-meaning', label: 'Смысл стиха (От автора)', short: '✎ Смысл' },
];

export default function FloatingNavbar({ journey, onNavigate }: Props) {
  const calligraphy = useCalligraphySync();
  const [audioActive, setAudioActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-tamerlan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      const sectionIds = [
        'hero-tamerlan',
        'poems-showcase',
        'poem-artist',
        'album-bridge',
        'poem-threads',
        'poem-threads-meaning',
      ];

      for (const sectionId of sectionIds) {
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

  const handleRecitationToggle = () => {
    if (calligraphy.isPlaying) {
      calligraphyAudio.pause();
    } else {
      const targetPoem = activeSection.startsWith('poem-threads') ? 'threads' : 'artist';
      calligraphyAudio.play(targetPoem);
      if (activeSection === 'hero-tamerlan' || activeSection === 'poems-showcase') {
        onNavigate('poem-artist');
      }
    }
  };

  const handleMobileNav = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const currentNav = navSections.find((s) => s.id === activeSection) || navSections[0];

  return (
    <>
      {/* Прогресс чтения по верхнему краю */}
      <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent pointer-events-none">
        <div
          className="h-full origin-left bg-gradient-to-r from-[#8b2a1e] via-[#d9a441] to-[#f0c169] transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${journey})` }}
        />
      </div>

      {/* Парящий навбар */}
      <nav
        aria-label="Основная навигация"
        className={`fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-40 mx-auto max-w-5xl rounded-full border transition-all duration-500 ${
          isScrolled
            ? 'border-white/10 bg-[#0c0a08]/90 py-2 sm:py-2.5 px-3.5 sm:px-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
            : 'border-white/5 bg-[#0c0a08]/60 py-2.5 sm:py-3 px-3.5 sm:px-6 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Бренд */}
          <button
            onClick={() => onNavigate('hero-tamerlan')}
            className="flex items-center gap-2 group cursor-pointer text-left shrink-0"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10 transition-colors group-hover:border-[#f0c169] group-hover:bg-[#d9a441]/20">
              <Feather className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#d9a441] transition-transform group-hover:scale-110" />
            </div>
            <div className="hidden xs:block">
              <span className="font-display text-sm sm:text-base font-medium tracking-wider text-[#f5efe6] group-hover:text-[#f0c169] transition-colors">
                Стихи Тамерлана
              </span>
            </div>
          </button>

          {/* Индикатор текущего раздела на мобильных */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex sm:hidden items-center gap-1.5 rounded-full border border-[#d9a441]/30 bg-[#d9a441]/10 px-2.5 py-1 text-[11px] font-ui text-[#f0c169] cursor-pointer"
          >
            <span className="truncate max-w-[130px]">{currentNav.short}</span>
            <Menu className="h-3.5 w-3.5 text-[#d9a441]" />
          </button>

          {/* Десктопные навигационные ссылки */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 no-scrollbar">
            <button
              onClick={() => onNavigate('poems-showcase')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'poems-showcase'
                  ? 'bg-[#d9a441]/20 text-[#f5efe6] border border-[#d9a441]/40 shadow-[0_0_12px_rgba(217,164,65,0.2)]'
                  : 'text-[#a89c8d] hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              Альбом
            </button>

            <button
              onClick={() => onNavigate('poem-artist')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'poem-artist'
                  ? 'bg-[#d9a441]/20 text-[#f5efe6] border border-[#d9a441]/40 shadow-[0_0_12px_rgba(217,164,65,0.2)]'
                  : 'text-[#a89c8d] hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              Часть I
            </button>

            <button
              onClick={() => onNavigate('album-bridge')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer hidden md:inline-flex ${
                activeSection === 'album-bridge'
                  ? 'bg-[#f0c169]/25 text-[#f5efe6] border border-[#f0c169]/40 shadow-[0_0_12px_rgba(240,193,105,0.2)]'
                  : 'text-[#a89c8d] hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              Связующая нить
            </button>

            <button
              onClick={() => onNavigate('poem-threads')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeSection === 'poem-threads'
                  ? 'bg-[#d9a441]/20 text-[#f5efe6] border border-[#d9a441]/40 shadow-[0_0_12px_rgba(217,164,65,0.2)]'
                  : 'text-[#a89c8d] hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              Часть II
            </button>

            <button
              onClick={() => onNavigate('poem-threads-meaning')}
              className={`rounded-full px-3 py-1.5 font-ui text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer hidden lg:inline-flex ${
                activeSection === 'poem-threads-meaning'
                  ? 'bg-[#e09553]/25 text-[#f5efe6] border border-[#e09553]/50 shadow-[0_0_12px_rgba(224,149,83,0.3)]'
                  : 'text-[#e09553]/80 hover:text-[#f5efe6] hover:bg-white/5'
              }`}
            >
              Смысл
            </button>
          </div>

          {/* Правая часть: кнопка оживления голоса, QR и эмбиент-звука */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Кнопка оживления рукописи голосом */}
            <button
              onClick={handleRecitationToggle}
              title={calligraphy.isPlaying ? 'Приостановить чтение' : 'Оживить рукопись голосом автора'}
              aria-label="Оживить рукопись голосом"
              className={`flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-ui text-[11px] transition-all duration-300 cursor-pointer ${
                calligraphy.isPlaying
                  ? 'border-[#f0c169] bg-[#d9a441]/25 text-[#f5efe6] shadow-[0_0_15px_rgba(240,193,105,0.4)]'
                  : 'border-[#d9a441]/40 bg-[#d9a441]/10 text-[#f0c169] hover:border-[#f0c169] hover:bg-[#d9a441]/20'
              }`}
            >
              <Feather className={`h-3.5 w-3.5 ${calligraphy.isPlaying ? 'text-[#f0c169] animate-pulse' : 'text-[#d9a441]'}`} />
              <span className="hidden sm:inline font-medium">
                {calligraphy.isPlaying ? 'Пауза' : 'Оживить голос'}
              </span>
            </button>

            {/* Кнопка открытия на телефоне (QR) */}
            <button
              onClick={() => setQrOpen(true)}
              title="Открыть на телефоне по QR-коду"
              aria-label="QR код для телефона"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 sm:py-1.5 font-ui text-[11px] text-[#a89c8d] hover:border-[#d9a441]/50 hover:text-[#f5efe6] transition-colors cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5 text-[#d9a441]" />
              <span className="hidden md:inline">Телефон</span>
            </button>

            {/* Звук */}
            <button
              onClick={handleAudioToggle}
              title={audioActive ? 'Выключить атмосферный звук' : 'Включить атмосферный звук'}
              aria-label={audioActive ? 'Выключить звук' : 'Включить атмосферный звук'}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 font-ui text-[11px] transition-all duration-300 cursor-pointer ${
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

      {/* Мобильное всплывающее меню / Bottom Sheet */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200 sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl border-t border-[#d9a441]/30 bg-[#0e0c0a]/95 p-6 pb-10 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Верхняя планка закрытия */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Feather className="h-4 w-4 text-[#d9a441]" />
                <span className="font-display text-lg text-[#f5efe6]">Оглавление альбома</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-1.5 text-[#a89c8d] hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Прогресс чтения в меню */}
            <div className="my-4 flex items-center justify-between text-xs font-ui text-[#a89c8d]">
              <span>Прогресс чтения</span>
              <span className="text-[#f0c169] font-medium">{Math.round(journey * 100)}%</span>
            </div>

            {/* Список разделов с удобными крупными кнопками для пальцев */}
            <div className="space-y-2 mt-4">
              {navSections.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNav(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl p-3.5 text-left font-ui text-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#d9a441]/20 text-[#f5efe6] border border-[#d9a441]/50 font-medium'
                        : 'bg-white/[0.03] text-[#c7beaf] hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <Sparkles className="h-4 w-4 text-[#f0c169]" />}
                  </button>
                );
              })}
            </div>

            {/* Кнопка оживления голоса в мобильной шторке */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleRecitationToggle();
                }}
                className={`w-full flex items-center justify-center gap-2.5 rounded-full border py-3 font-ui text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  calligraphy.isPlaying
                    ? 'border-[#f0c169] bg-[#d9a441]/25 text-[#f5efe6] shadow-[0_0_20px_rgba(240,193,105,0.3)]'
                    : 'border-[#d9a441]/40 bg-[#d9a441]/15 text-[#f0c169] hover:bg-[#d9a441]/25'
                }`}
              >
                <Feather className={`h-4 w-4 ${calligraphy.isPlaying ? 'text-[#f0c169] animate-pulse' : 'text-[#d9a441]'}`} />
                <span className="font-medium">
                  {calligraphy.isPlaying ? 'Приостановить чтение' : 'Оживить рукопись голосом'}
                </span>
              </button>
            </div>

            {/* Нижние кнопки в меню */}
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleAudioToggle}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 font-ui text-xs uppercase tracking-wider text-[#f5efe6]"
              >
                {audioActive ? <Volume2 className="h-4 w-4 text-[#f0c169]" /> : <VolumeX className="h-4 w-4" />}
                <span>{audioActive ? 'Звук: Вкл' : 'Звук: Выкл'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setQrOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#d9a441]/40 bg-[#d9a441]/15 py-2.5 font-ui text-xs uppercase tracking-wider text-[#f0c169]"
              >
                <QrCode className="h-4 w-4" />
                <span>QR-код</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно с QR-кодом для телефона */}
      <MobileConnectModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
