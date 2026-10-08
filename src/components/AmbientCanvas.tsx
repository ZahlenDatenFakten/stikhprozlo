import { useEffect, useRef } from 'react';

interface Mote {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
}

/**
 * Фиксированный фон: луч света с парящей пылью.
 * Яркость луча растёт с прогрессом чтения (--journey).
 */
export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let motes: Mote[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.floor((w * h) / 16000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.6,
        speed: 0.06 + Math.random() * 0.22,
        drift: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.55,
      }));
    };

    const beamCenter = (t: number) => w * 0.62 + Math.sin(t * 0.00004) * w * 0.05;

    const draw = (t: number) => {
      const journey = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--journey') || '0',
      );
      ctx.clearRect(0, 0, w, h);

      // Луч света: диагональный, мягкий
      const cx = beamCenter(t);
      const beamWidth = w * (0.22 + journey * 0.3);
      const intensity = 0.05 + journey * 0.22;
      const grad = ctx.createLinearGradient(cx - beamWidth, 0, cx + beamWidth, h);
      grad.addColorStop(0, 'rgba(217,164,65,0)');
      grad.addColorStop(0.5, `rgba(224,176,92,${intensity})`);
      grad.addColorStop(1, 'rgba(217,164,65,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Пылинки в луче
      for (const m of motes) {
        m.y -= m.speed;
        m.x += Math.sin(t * 0.0006 + m.phase) * m.drift * 0.3;
        if (m.y < -4) {
          m.y = h + 4;
          m.x = Math.random() * w;
        }
        const dist = Math.abs(m.x - cx) / (beamWidth * 1.6);
        const inBeam = Math.max(0, 1 - dist);
        const twinkle = 0.6 + 0.4 * Math.sin(t * 0.001 + m.phase);
        const a = m.alpha * (0.08 + inBeam * (0.25 + journey * 0.6)) * twinkle;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,208,150,${a.toFixed(3)})`;
        ctx.fill();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
