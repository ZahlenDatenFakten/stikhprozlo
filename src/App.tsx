import AmbientCanvas from '@/components/AmbientCanvas';
import AmbientGlow from '@/components/AmbientGlow';
import FloatingNavbar from '@/components/FloatingNavbar';
import TamerlanHero from '@/components/TamerlanHero';
import PoemCardsShowcase from '@/components/PoemCardsShowcase';
import PoemArtist from '@/components/PoemArtist';
import PoemThreads from '@/components/PoemThreads';
import PoetryFooter from '@/components/PoetryFooter';
import SideNav, { defaultWaypoints } from '@/components/SideNav';
import { useJourney } from '@/hooks/useReveal';

export default function App() {
  const waypointIds = defaultWaypoints.map((w) => w.id);
  const { journey, active } = useJourney(waypointIds);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPoem = (poemId: string) => {
    if (poemId === 'artist') {
      scrollTo('poem-artist');
    } else if (poemId === 'threads') {
      scrollTo('poem-threads');
    }
  };

  const activeWaypointId = waypointIds[active] || 'hero-tamerlan';

  return (
    <main className="grain relative min-h-screen bg-[#060504] text-[#f5efe6] selection:bg-[#d9a441]/80 selection:text-[#060504]">
      {/* Атмосферные световые слои и пылинки */}
      <AmbientGlow />
      <AmbientCanvas />

      {/* Парящая верхняя навигация */}
      <FloatingNavbar journey={journey} onNavigate={scrollTo} />

      {/* Боковой навигатор по разделам */}
      <SideNav activeId={activeWaypointId} onSelect={scrollTo} />

      {/* 1. Начальный экран: Заставка про «Стихи Тамерлана» */}
      <TamerlanHero
        onScrollToCatalog={() => scrollTo('poems-showcase')}
        onScrollToFirstPoem={() => scrollTo('poem-artist')}
      />

      {/* 2. Плавный спуск к наикрасивейшим табличкам на все стихи */}
      <PoemCardsShowcase onSelectPoem={handleSelectPoem} />

      {/* Разделитель между витриной и чтением */}
      <div className="relative z-10 mx-auto my-12 flex max-w-xs items-center justify-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d9a441]/40 to-transparent" />
        <span className="font-display text-sm italic text-[#d9a441]/80">Произведения</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d9a441]/40 to-transparent" />
      </div>

      {/* 3. Первый стих: Поэма «Художник» (6 глав + мазки + финал) */}
      <PoemArtist />

      {/* Декоративный переход между произведениями */}
      <div className="relative z-10 mx-auto my-20 flex max-w-md items-center justify-center gap-6 px-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e09553]/50 to-transparent" />
        <span className="h-2 w-2 rotate-45 border border-[#e09553] bg-[#e09553]/30" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#e09553]/50 to-transparent" />
      </div>

      {/* 4. Второй стих: «Нити на ветру» (4 строфы + точнейший смысл стиха) */}
      <PoemThreads />

      {/* 5. Подвал поэтического пространства */}
      <PoetryFooter
        onScrollToTop={() => scrollTo('hero-tamerlan')}
        onNavigate={scrollTo}
      />
    </main>
  );
}
