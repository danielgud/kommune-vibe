import { useState } from "react";
import { Button } from "./Button";
import { Clouds } from "./Clouds";
import { Credits } from "./Credits";
import { Sun } from "./Sun";
import { readTop10 } from "../utils/storage";
import { Result } from "./TopList";

interface SplashScreenProps {
  onStartGame: (cardCount: number, isTwoPlayer: boolean) => void;
}

const SplashScreen = ({ onStartGame }: SplashScreenProps) => {
  const [showCredits, setShowCredits] = useState(false);
  const [isTwoPlayerMode, setIsTwoPlayerMode] = useState<boolean | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="flex flex-col items-center h-full overflow-hidden">
      <div className="mr-auto fixed w-full z-10">
        <Clouds />
      </div>
      <div className="fixed ml-auto top-60 right-1/4 -translate-y-1/4 -translate-x-1/3 z-0">
        <Sun />
      </div>
      <h1 className="text-4xl font-bold mb-8 sr-only">Kommune Flip</h1>
      <img
        src="/logo.svg"
        alt="Kommuneflip logo"
        className="z-20 w-[600px] mx-auto animate-wiggle p-8 pb-0 pt-56"
      />

      <div className="flex flex-col items-center gap-4 py-4">
        {isTwoPlayerMode === null ? (
          <>
            <p className="text-white text-xl font-semibold">Velg modus</p>
            <div className="flex gap-4">
              <Button onClick={() => setIsTwoPlayerMode(false)}>1 spiller</Button>
              <Button onClick={() => setIsTwoPlayerMode(true)}>2 spillere</Button>
            </div>
            <div className="mt-4">
              <Button onClick={() => setShowLeaderboard(!showLeaderboard)}>
                {showLeaderboard ? 'Skjul toppliste' : 'Vis toppliste'}
              </Button>
            </div>
            {showLeaderboard && (
              <div className="bg-black bg-opacity-50 p-6 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                <h2 className="text-white text-2xl font-bold mb-4 text-center">Topplister</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[20, 36, 64].map(cardCount => {
                    const top10 = readTop10(cardCount);
                    const boardSize = cardCount === 20 ? '4x5' : cardCount === 36 ? '6x6' : '8x8';
                    return (
                      <div key={cardCount} className="bg-white bg-opacity-10 p-4 rounded">
                        <h3 className="text-white text-lg font-semibold mb-2 text-center">{boardSize}</h3>
                        {top10.length > 0 ? (
                          <ol className="text-sm">
                            {top10.slice(0, 5).map((entry: Result, index: number) => (
                              <li key={index} className="flex justify-between text-white py-1">
                                <span>{index + 1}. {entry.name}</span>
                                <span>{entry.time.toFixed(1)}s</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-white text-sm text-center">Ingen resultater ennå</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-white text-xl font-semibold">Velg størrelse på brettet</p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button onClick={() => onStartGame(20, isTwoPlayerMode)}>4 x 5</Button>
              <Button onClick={() => onStartGame(36, isTwoPlayerMode)}>6 x 6</Button>
              <Button onClick={() => onStartGame(64, isTwoPlayerMode)}>8 x 8</Button>
            </div>
            <div className="mt-4">
              <Button onClick={() => setIsTwoPlayerMode(null)}>Tilbake</Button>
            </div>
          </>
        )}
      </div>

      <div
        className="absolute bottom-5 left-10 w-40 h-auto animate-bounce group"
        aria-hidden="true"
      >
        <img src="sheep.svg" />
        <p className="text-white text-right hidden group-hover:block animate-ping">
          Zup
        </p>
      </div>

      <div className="absolute bottom-5 right-5 w-20 h-auto ">
        <button
          className="underline text-white"
          onClick={() => setShowCredits(true)}
        >
          Credits
        </button>
        {showCredits && <Credits />}
        <img className="opacity-60" src="ksd.svg" alt="KS Digital logo" />
        <img className="opacity-60" src="ksd.svg" alt="KS Digital logo" />
      </div>
    </div>
  );
};

export default SplashScreen;