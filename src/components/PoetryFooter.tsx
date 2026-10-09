import { Feather, ArrowUp } from 'lucide-react';

interface Props {
  onScrollToTop: () => void;
  onNavigate: (id: string) => void;
}

export default function PoetryFooter({ onScrollToTop, onNavigate }: Props) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#060504]/90 px-6 py-20 text-center backdrop-blur-xl">
      <div className="mx-auto max-w-4xl">
        {/* Иконка пера */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d9a441]/30 bg-[#d9a441]/10">
          <Feather className="h-5 w-5 text-[#f0c169]" />
        </div>

        <h3 className="font-display mt-6 text-3xl sm:text-4xl font-light tracking-wide text-[#f5efe6]">
          Стихи Тамерлана
        </h3>

        <p className="font-poem mt-4 max-w-md mx-auto text-lg italic text-[#a89c8d]">
          «Но в самой глубокой и темной ночи останется искра, чиста и горяча...»
        </p>

        {/* Навигационные ссылки подвала */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-ui text-xs tracking-widest uppercase text-[#a89c8d]">
          <button
            onClick={() => onNavigate('hero-tamerlan')}
            className="hover:text-[#f0c169] transition-colors cursor-pointer"
          >
            Заставка
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => onNavigate('poems-showcase')}
            className="hover:text-[#f0c169] transition-colors cursor-pointer"
          >
            Таблички стихов
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => onNavigate('poem-artist')}
            className="hover:text-[#f0c169] transition-colors cursor-pointer"
          >
            «Художник»
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => onNavigate('poem-threads')}
            className="hover:text-[#f0c169] transition-colors cursor-pointer"
          >
            «Нити на ветру»
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => onNavigate('poem-threads-meaning')}
            className="hover:text-[#f0c169] transition-colors cursor-pointer"
          >
            Смысл стиха
          </button>
        </div>

        {/* Кнопка наверх */}
        <div className="mt-12">
          <button
            onClick={onScrollToTop}
            className="group mx-auto flex items-center gap-2 rounded-full border border-[#d9a441]/30 bg-[#d9a441]/10 px-6 py-2.5 font-ui text-xs tracking-[0.2em] uppercase text-[#f5efe6] backdrop-blur-md transition-all duration-300 hover:border-[#f0c169] hover:bg-[#d9a441]/20 hover:shadow-[0_0_20px_rgba(217,164,65,0.25)] cursor-pointer active:scale-95"
          >
            <ArrowUp className="h-3.5 w-3.5 text-[#d9a441] transition-transform group-hover:-translate-y-1" />
            <span>Вернуться в начало</span>
          </button>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-xs font-ui text-[#a89c8d]/60">
          <p>© Поэтическое собрание Тамерлана. Все права на произведения сохранены.</p>
        </div>
      </div>
    </footer>
  );
}
