import AmbientCanvas from '@/components/AmbientCanvas';
import AmbientGlow from '@/components/AmbientGlow';
import Hero from '@/components/Hero';
import Stanza from '@/components/Stanza';
import BrushDivider from '@/components/BrushDivider';
import SideNav from '@/components/SideNav';
import Finale from '@/components/Finale';
import { useJourney } from '@/hooks/useReveal';
import { chapters } from '@/data/poem';

export default function App() {
  const chapterIds = chapters.map((_, i) => `chapter-${i}`);
  const { journey, active } = useJourney(chapterIds);

  const scrollTo = (index: number) => {
    document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="grain relative min-h-screen bg-[#060504]">
      <AmbientGlow />
      <AmbientCanvas />

      {/* Прогресс чтения */}
      <div className="fixed left-0 top-0 z-30 h-[2px] w-full bg-transparent">
        <div
          className="h-full origin-left bg-gradient-to-r from-[#8b2a1e] via-[#d9a441] to-[#f0c169]"
          style={{ transform: `scaleX(${journey})` }}
        />
      </div>

      <SideNav numerals={chapters.map((c) => c.numeral)} active={active} onSelect={scrollTo} />

      <Hero />

      {chapters.map((chapter, i) => (
        <div key={chapter.numeral}>
          <Stanza chapter={chapter} index={i} />
          {i < chapters.length - 1 && <BrushDivider variant={i} />}
        </div>
      ))}

      <Finale />
    </main>
  );
}
