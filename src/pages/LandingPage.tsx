import { useNavigate } from "react-router-dom";
import { Clouds } from "../components/Clouds";
import { Sun } from "../components/Sun";

interface GameCardProps {
  title: string;
  description: string;
  emoji: string;
  path: string;
  tag?: string;
  gradient: string;
}

const GameCard = ({ title, description, emoji, path, tag, gradient }: GameCardProps) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="group relative flex flex-col w-72 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-transform-shadow duration-200 cursor-pointer focus-visible:ring-8 ring-focus ring-offset-2 text-left"
    >
      {/* Coloured hero banner */}
      <div className={`${gradient} flex items-center justify-center py-10 relative`}>
        <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-200 inline-block">
          {emoji}
        </span>
        {tag && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {tag}
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="bg-white flex flex-col gap-2 px-6 py-5">
        <h2 className="text-xl font-bold text-blue-900">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        <div className="mt-3 flex items-center gap-1.5 text-blue-700 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
          Spill nå <span className="text-base">→</span>
        </div>
      </div>
    </button>
  );
};

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[url('/bg.png')] bg-no-repeat bg-cover flex flex-col items-center justify-center gap-12 px-4 py-16 relative overflow-hidden">
      <div className="fixed w-full top-0 z-10" aria-hidden="true">
        <Clouds />
      </div>
      <div
        className="fixed top-60 right-1/4 -translate-y-1/4 -translate-x-1/3 z-0"
        aria-hidden="true"
      >
        <Sun />
      </div>

      <div className="z-20 flex flex-col items-center gap-2">
        <img
          src="/logo.svg"
          alt="Kommunespill"
          className="w-64 sm:w-96 animate-wiggle"
        />
        <p className="text-white text-xl font-semibold drop-shadow">
          Velg et spill
        </p>
      </div>

      <div className="z-20 flex flex-wrap gap-8 justify-center">
        <GameCard
          title="Kommune Flip"
          description="Match kommunevåpen i dette hukommelsespillet. Spill alene eller mot en venn!"
          emoji="🗺️"
          path="/memory"
          gradient="bg-gradient-to-br from-blue-500 to-blue-800"
        />
        <GameCard
          title="Gjett hvem"
          description="Gjett motstanderens hemmelige kommunevåpen ved å stille ja/nei-spørsmål!"
          emoji="🔍"
          path="/guesswho"
          tag="Ny!"
          gradient="bg-gradient-to-br from-amber-400 to-orange-600"
        />
        <GameCard
          title="Sjøslag"
          description="Det klassiske skipsspillet! Plasser flåten din og senk motstanderens skip."
          emoji="⚓"
          path="/battleship"
          gradient="bg-gradient-to-br from-slate-600 to-slate-900"
        />
      </div>
    </main>
  );
};

export default LandingPage;

