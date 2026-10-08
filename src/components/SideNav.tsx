interface Props {
  numerals: string[];
  active: number;
  onSelect: (index: number) => void;
}

/** Тонкая боковая навигация по главам (римские цифры) */
export default function SideNav({ numerals, active, onSelect }: Props) {
  return (
    <nav
      aria-label="Главы поэмы"
      className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-6 md:flex"
    >
      {numerals.map((n, i) => (
        <button
          key={n}
          onClick={() => onSelect(i)}
          aria-label={`Глава ${n}`}
          className="group flex min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <span
            className={`font-display text-sm transition-all duration-700 ${
              active === i
                ? 'text-[#d9a441] opacity-100'
                : 'text-[#a89c8d] opacity-35 group-hover:opacity-80'
            }`}
            style={{ letterSpacing: '0.1em' }}
          >
            {n}
          </span>
          <span
            className={`absolute ml-9 h-px bg-[#d9a441] transition-all duration-700 ${
              active === i ? 'w-5 opacity-70' : 'w-0 opacity-0'
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
