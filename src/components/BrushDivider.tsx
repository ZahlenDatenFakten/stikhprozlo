import { useReveal } from '@/hooks/useReveal';

/**
 * Мазок кисти между главами: рисуется при появлении в вьюпорте.
 * variant меняет форму и теплоту мазка по ходу поэмы.
 */
export default function BrushDivider({ variant }: { variant: number }) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.6);

  const paths = [
    'M 20 60 C 140 20, 300 95, 480 55 S 700 30, 780 58',
    'M 20 55 C 160 90, 320 18, 500 62 S 720 85, 780 50',
    'M 20 58 C 130 30, 290 80, 470 48 S 690 70, 780 55',
    'M 20 50 C 170 85, 330 25, 510 58 S 730 30, 780 60',
    'M 20 60 C 150 25, 310 92, 490 52 S 710 75, 780 52',
  ];
  const d = paths[variant % paths.length];
  const warm = variant >= 2;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative z-10 mx-auto w-full max-w-xl px-8 py-6 sm:py-10"
    >
      <svg viewBox="0 0 800 110" fill="none" className="h-14 w-full sm:h-16">
        <defs>
          <linearGradient id={`brush-${variant}`} x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={warm ? '#d9a441' : '#8b2a1e'} stopOpacity="0" />
            <stop offset="0.25" stopColor={warm ? '#d9a441' : '#8b2a1e'} stopOpacity="0.9" />
            <stop offset="0.75" stopColor={warm ? '#f0c169' : '#b0503c'} stopOpacity="0.9" />
            <stop offset="1" stopColor={warm ? '#f0c169' : '#b0503c'} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Основной мазок */}
        <path
          d={d}
          pathLength={1}
          className={`brush-path ${shown ? 'brush-drawn' : ''}`}
          stroke={`url(#brush-${variant})`}
          strokeWidth={variant >= 3 ? 5 : 3.5}
          strokeLinecap="round"
        />
        {/* Волоски кисти */}
        <path
          d={d}
          pathLength={1}
          transform="translate(0,7) scale(1,0.9)"
          className={`brush-path ${shown ? 'brush-drawn' : ''}`}
          stroke={`url(#brush-${variant})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
          style={{ transitionDelay: shown ? '0.45s' : '0s' }}
        />
        <path
          d={d}
          pathLength={1}
          transform="translate(0,-6) scale(1,1.05)"
          className={`brush-path ${shown ? 'brush-drawn' : ''}`}
          stroke={`url(#brush-${variant})`}
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.35"
          style={{ transitionDelay: shown ? '0.7s' : '0s' }}
        />
      </svg>
    </div>
  );
}
