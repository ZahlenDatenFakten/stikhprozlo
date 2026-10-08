import { useEffect, useState } from 'react';

export default function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 150);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <header
      id="hero"
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <p
        className={`font-ui text-[11px] font-light uppercase text-[#a89c8d] fade-anim ${
          ready ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ letterSpacing: '0.55em', transitionDelay: '0.3s' }}
      >
        Поэма
      </p>

      <h1
        className={`font-display mt-8 text-[17vw] font-light leading-none text-[#e9dfd3] sm:text-[11vw] lg:text-[8.5vw] fade-anim ${
          ready ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ letterSpacing: '0.18em', marginLeft: '0.18em', transitionDelay: '0.8s' }}
      >
        Художник
      </h1>

      <div
        className={`mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#d9a441] to-transparent fade-anim ${
          ready ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '1.5s' }}
      />

      <p
        className={`font-poem mt-10 max-w-md text-lg italic leading-relaxed text-[#a89c8d] sm:text-xl fade-anim ${
          ready ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '1.9s' }}
      >
        о душе — холсте, о тьме и свете,
        <br />и о том, кто держит кисть
      </p>

      {/* Призыв читать */}
      <div
        className={`absolute bottom-10 flex flex-col items-center gap-4 fade-anim ${
          ready ? 'fade-shown' : 'fade-hidden'
        }`}
        style={{ transitionDelay: '2.6s' }}
      >
        <span className="font-ui text-[10px] uppercase text-[#a89c8d]" style={{ letterSpacing: '0.4em' }}>
          читать
        </span>
        <span className="relative block h-16 w-px overflow-hidden bg-[#2a241d]">
          <span className="scroll-drip absolute left-0 top-0 h-6 w-px bg-[#d9a441]" />
        </span>
      </div>

      <style>{`
        .scroll-drip { animation: drip 2.8s cubic-bezier(.2,.6,0,1) infinite; }
        @keyframes drip {
          0% { transform: translateY(-100%); opacity: 0; }
          25% { opacity: 1; }
          70% { transform: translateY(300%); opacity: 0; }
          100% { transform: translateY(300%); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .scroll-drip { animation: none; } }
      `}</style>
    </header>
  );
}
