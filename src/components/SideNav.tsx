interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
}

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

export const defaultWaypoints: NavItem[] = [
  { id: 'hero-tamerlan', label: 'Заставка', shortLabel: '✧' },
  { id: 'poems-showcase', label: 'Таблички стихов', shortLabel: '❖' },
  { id: 'poem-artist', label: 'Поэма «Художник»', shortLabel: 'I' },
  { id: 'poem-threads', label: 'Стих «Нити на ветру»', shortLabel: 'II' },
  { id: 'poem-threads-meaning', label: 'Смысл стиха', shortLabel: '✎' },
];

/** Тонкая боковая навигация по ключевым разделам */
export default function SideNav({ activeId, onSelect }: Props) {
  return (
    <nav
      aria-label="Быстрая навигация по сборнику"
      className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex"
    >
      {defaultWaypoints.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            aria-label={item.label}
            className="group relative flex min-h-[36px] min-w-[36px] items-center justify-center cursor-pointer"
          >
            <span
              className={`font-display text-xs transition-all duration-500 ${
                isActive
                  ? 'text-[#d9a441] scale-125 font-bold'
                  : 'text-[#a89c8d] opacity-40 group-hover:opacity-90 group-hover:text-[#e0d6c9]'
              }`}
            >
              {item.shortLabel}
            </span>

            {/* Активная полосочка */}
            <span
              className={`absolute ml-7 h-px bg-[#d9a441] transition-all duration-500 ${
                isActive ? 'w-4 opacity-80' : 'w-0 opacity-0'
              }`}
            />

            {/* Всплывающая подсказка */}
            <span className="pointer-events-none absolute left-9 whitespace-nowrap rounded-md border border-[#2a241d] bg-[#0c0a08]/90 px-2.5 py-1 font-ui text-[10px] tracking-wider text-[#e9dfd3] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
