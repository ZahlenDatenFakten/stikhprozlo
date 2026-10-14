import { useEffect, useRef, useState } from 'react';
import { calligraphyAudio, type CalligraphyState } from '@/lib/audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

export default function CalligraphicQuill() {
  const [visible, setVisible] = useState(false);
  const quillRef = useRef<HTMLDivElement | null>(null);

  // Текущие сглаженные координаты кончика пера
  const currentPos = useRef({ x: -100, y: -100, angle: 36, lift: 0 });
  const targetPos = useRef({ x: -100, y: -100, angle: 36, lift: 0 });
  const voiceEnergyRef = useRef(0);
  const isWritingRef = useRef(false);

  // Частицы золотых искр чернил
  const particles = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;

    const unsubscribe = calligraphyAudio.subscribe((state: CalligraphyState) => {
      voiceEnergyRef.current = state.voiceEnergy;

      if (!state.isPlaying || !state.activeWord) {
        setVisible(false);
        isWritingRef.current = false;
        return;
      }

      setVisible(true);

      // Ищем DOM-элемент активного слова
      const wordEl = document.getElementById(state.activeWord.id);
      if (wordEl) {
        const rect = wordEl.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, state.wordProgress));

        // Кончик пера скользит по нижней трети высоты букв слева направо
        const contactX = rect.left + rect.width * progress;
        const contactY = rect.top + rect.height * 0.78;

        const isActivelyProgressing = progress > 0.05 && progress < 0.98;
        isWritingRef.current = isActivelyProgressing;

        // В паузах перо приподнимается над строкой
        const lift = isActivelyProgressing ? 0 : -14;
        const dynamicAngle = 36 + (isActivelyProgressing ? Math.sin(progress * 18) * 3 : 0);

        targetPos.current = {
          x: contactX,
          y: contactY,
          angle: dynamicAngle,
          lift,
        };

        // Если перо только появилось из пустоты, переносим его сразу
        if (currentPos.current.x < 0) {
          currentPos.current.x = contactX;
          currentPos.current.y = contactY + lift;
        }
      }
    });

    // Анимационный цикл движения пера и искр на 60-120 FPS
    const renderLoop = () => {
      const cur = currentPos.current;
      const tgt = targetPos.current;
      const energy = voiceEnergyRef.current;

      // Плавная интерполяция руки каллиграфа (Lerp)
      const lerpFactor = 0.22;
      cur.x += (tgt.x - cur.x) * lerpFactor;
      cur.y += (tgt.y + tgt.lift - cur.y) * lerpFactor;
      cur.angle += (tgt.angle - cur.angle) * 0.2;

      // Микро-нажим от эмоции голоса (voiceEnergy)
      const pressureOffset = isWritingRef.current ? Math.sin(performance.now() * 0.015) * 1.5 * energy : 0;

      if (quillRef.current) {
        quillRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y + pressureOffset}px, 0) rotate(${cur.angle}deg)`;
      }

      // Отрисовка золотой пыли на канвасе
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Генерация новых искр при нажиме пера (деликатные золотые пылинки)
          if (isWritingRef.current && (energy > 0.3 || Math.random() < 0.2)) {
            if (particles.current.length < 16) {
              particles.current.push({
                x: cur.x,
                y: cur.y,
                vx: (Math.random() - 0.5) * 1.4 - 0.4,
                vy: (Math.random() - 0.6) * 1.2,
                alpha: 0.45 + Math.random() * 0.25,
                size: 0.8 + Math.random() * 1.2,
              });
            }
          }

          // Обновление и рендер искр
          for (let i = particles.current.length - 1; i >= 0; i--) {
            const p = particles.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            p.size *= 0.97;

            if (p.alpha <= 0 || p.size <= 0.3) {
              particles.current.splice(i, 1);
              continue;
            }

            ctx.fillStyle = `rgba(240, 193, 105, ${p.alpha})`;
            ctx.shadowColor = 'rgba(217, 164, 65, 0.4)';
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    // Подгонка размера канваса под экран
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      unsubscribe();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Слой золотой пыли от кончика пера */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40"
      />

      {/* Физическое золотое перо, пишущее по буквам */}
      <div
        ref={quillRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-50 origin-[0px_0px] transition-opacity duration-500 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          willChange: 'transform',
        }}
      >
        {/* Мягкий бесшовный ореол света на кончике пера без резких границ */}
        <div
          className="pointer-events-none absolute -left-6 -top-6 h-12 w-12 rounded-full transition-transform duration-150 ease-out"
          style={{
            background:
              'radial-gradient(circle, rgba(240,193,105,0.4) 0%, rgba(217,164,65,0.15) 35%, rgba(217,164,65,0) 70%)',
            transform: `scale(${0.9 + voiceEnergyRef.current * 0.4})`,
            filter: 'blur(3px)',
          }}
        />

        {/* Детализированное золотое каллиграфическое перо (SVG) */}
        <svg
          width="110"
          height="140"
          viewBox="0 0 110 140"
          fill="none"
          className="overflow-visible drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
          style={{
            transform: 'translate(-2px, -135px)', // кончик пера уходит точно в (0, 0)
          }}
        >
          <defs>
            {/* Золотой металлический градиент наконечника */}
            <linearGradient id="nib-gold-body" x1="0" y1="140" x2="60" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fff9e6" />
              <stop offset="25%" stopColor="#f0c169" />
              <stop offset="65%" stopColor="#d9a441" />
              <stop offset="85%" stopColor="#9a5a1f" />
              <stop offset="100%" stopColor="#8a3324" />
            </linearGradient>

            {/* Блик на стальном ребре пера */}
            <linearGradient id="nib-sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f0c169" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Мягкий градиент оперения */}
            <linearGradient id="feather-plume" x1="20" y1="80" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d9a441" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#f0c169" stopOpacity="0.65" />
              <stop offset="80%" stopColor="#2a2016" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14100c" stopOpacity="0.1" />
            </linearGradient>

            <filter id="gold-nib-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Легкое оперение пера, отходящее вверх и вправо */}
          <path
            d="M 18 85 C 25 60, 45 35, 95 10 C 85 45, 60 75, 26 98 Z"
            fill="url(#feather-plume)"
          />
          <path
            d="M 28 80 C 40 55, 65 30, 92 12"
            stroke="#f0c169"
            strokeWidth="0.8"
            strokeOpacity="0.5"
            strokeDasharray="2 4"
          />

          {/* Тело золотого каллиграфического наконечника (Nib) */}
          <path
            d="M 2 138 L 8 105 C 12 90, 24 82, 28 65 L 20 62 C 14 78, 6 88, 2 138 Z"
            fill="url(#nib-gold-body)"
            filter="url(#gold-nib-glow)"
          />
          <path
            d="M 2 138 L -4 105 C -8 90, -20 82, -24 65 L -16 62 C -10 78, -2 88, 2 138 Z"
            fill="url(#nib-gold-body)"
            filter="url(#gold-nib-glow)"
          />

          {/* Центральный разрез пера (Slit) и дыхательное отверстие (Breather hole) */}
          <line
            x1="2"
            y1="139"
            x2="2"
            y2="108"
            stroke="#2a1c0d"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <circle cx="2" cy="107" r="1.8" fill="#161008" stroke="#f0c169" strokeWidth="0.6" />

          {/* Гравировка на пере */}
          <path
            d="M -3 118 Q 2 122 7 118"
            stroke="#f5efe6"
            strokeWidth="0.6"
            strokeOpacity="0.7"
            fill="none"
          />
          <path
            d="M -6 100 Q 2 105 10 100"
            stroke="#fff9e6"
            strokeWidth="0.75"
            strokeOpacity="0.8"
            fill="none"
          />

          {/* Золотой ободок фиксатора (Ferrule) */}
          <rect
            x="-18"
            y="56"
            width="40"
            height="8"
            rx="2"
            fill="url(#nib-gold-body)"
            stroke="#fff7df"
            strokeWidth="0.5"
          />

          {/* Световой блик вдоль конька пера */}
          <path
            d="M 2 138 L 4 105 L 12 70"
            stroke="url(#nib-sheen)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}
