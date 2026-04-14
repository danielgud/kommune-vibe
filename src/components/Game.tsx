import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { Kommune, randomKommuner } from "../assets/kommuner";
import { shuffleArray } from "../utils/utils";
import Card from "./Card";
import { NamePrompt } from "./NamePrompt";
import { Result, TopList } from "./TopList";
import Timer from "./Timer";
import { readTop10, writeTop10, writeTop10Local } from "../utils/storage";

type GameProps = {
  numberOfCards: number;
  cardFlipDuration: number;
  isTwoPlayer: boolean;
  player1: string;
  player2: string;
};

const Game = ({
  numberOfCards,
  cardFlipDuration,
  isTwoPlayer,
  player1,
  player2,
}: GameProps) => {
  const pickedKommuner = randomKommuner(numberOfCards / 2);
  const [cards, setCards] = useState<Kommune[]>([
    ...pickedKommuner,
    ...pickedKommuner,
  ]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [didMakeItToTop10, setDidMakeItToTop10] = useState(false);
  const [annoncePairs, setannoncePairs] = useState("");
  const [playerName, setPlayername] = useState("");
  const [top10, setTop10] = useState<Result[]>([]);
  const [, setIsLoadingLeaderboard] = useState(true);

  const [activePlayer, setActivePlayer] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    shuffleArray(cards);
    setCards(cards);
  }, [cards]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoadingLeaderboard(true);
      const leaderboard = await readTop10(numberOfCards);
      setTop10(leaderboard);
      setIsLoadingLeaderboard(false);
    };
    loadLeaderboard();
  }, [numberOfCards]);

  useEffect(() => {
    if (!isGameFinished) {
      const interval = setInterval(
        () => setElapsedTime((Date.now() - startTime) / 1000),
        100
      );
      return () => clearInterval(interval);
    }
  }, [startTime, isGameFinished]);

  const isCardsEqual = (firstCard: Kommune, secondCard: Kommune) =>
    firstCard.image === secondCard.image;

  const getColumnClass = (cardCount: number): string => {
    const map: Record<number, string> = {
      16: "grid-cols-4",
      20: "grid-cols-5",
      36: "grid-cols-6",
      64: "grid-cols-8",
    };
    return map[cardCount] || "grid-cols-4";
  };

  const handleMatch = (firstIndex: number, secondIndex: number) => {
    setMatchedIndices([...matchedIndices, firstIndex, secondIndex]);

    if (isTwoPlayer) {
      setScores((prev) => {
        const newScores = [...prev] as [number, number];
        newScores[activePlayer]++;
        return newScores;
      });

      setannoncePairs(
        `${activePlayer === 0 ? player1 : player2} fant et par! ${cards[firstIndex].navn}`
      );
    }

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setFlippedIndices([]);
  };

  const handleNonMatch = () => {
    setannoncePairs("Det var ikke et par.");
    setTimeout(() => {
      setFlippedIndices([]);
      if (isTwoPlayer) {
        setActivePlayer((prev) => (prev === 0 ? 1 : 0));
      }
    }, cardFlipDuration);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index)) return;

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (isCardsEqual(cards[firstIndex], cards[secondIndex])) {
        handleMatch(firstIndex, secondIndex);
      } else {
        handleNonMatch();
      }
    }
  };

  const handleSubmitName = async (name: string) => {
    setPlayername(name);
    if (didMakeItToTop10) {
      const newTop10 = [...top10, { name, time: elapsedTime }]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10);
      setTop10(newTop10);

      // Update localStorage immediately for instant feedback
      writeTop10Local(numberOfCards, newTop10);

      // Update cloud storage (don't wait for it)
      writeTop10(numberOfCards, newTop10).catch(error => {
        console.error('Failed to update cloud leaderboard:', error);
      });
    }
  };

  useEffect(() => {
    if (
      matchedIndices.length > 0 &&
      cards.length > 0 &&
      matchedIndices.length === cards.length
    ) {
      setIsGameFinished(true);
    }
  }, [matchedIndices, cards]);

  useEffect(() => {
    if (isGameFinished && !isTwoPlayer) {
      setDidMakeItToTop10(
        top10.length < 10 || elapsedTime < top10[top10.length - 1].time
      );
    }
  }, [isGameFinished, elapsedTime, top10, isTwoPlayer]);

  const renderWinner = () => {
    if (scores[0] === scores[1]) return "Uavgjort!";
    return scores[0] > scores[1] ? `${player1} vinner!` : `${player2} vinner!`;
  };

  return (
    <>
      {!isTwoPlayer && (
        <div className="fixed top-0 right-0 z-10">
          <Timer time={elapsedTime} />
        </div>
      )}
      <div aria-live="polite" aria-atomic={true} className="sr-only">
        {annoncePairs}
      </div>
      {isTwoPlayer && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black bg-opacity-30 text-white text-2xl font-bold flex gap-12 px-6 py-2 rounded-xl shadow-lg">
            <div
              className={`transition-all ${
                activePlayer === 0 ? "text-yellow-300 scale-110 underline" : "opacity-70"
              }`}
            >
              {player1}: {scores[0]}
            </div>
            <div
              className={`transition-all ${
                activePlayer === 1 ? "text-yellow-300 scale-110 underline" : "opacity-70"
            }`}
          >
            {player2}: {scores[1]}
          </div>
        </div>
      </div>
    )}

      <ul
        className={`grid gap-4 ${getColumnClass(
          numberOfCards
        )} w-full h-full p-4 pt-8`}
      >
        {cards.map((card, index) => (
          <li key={index}>
            <Card
              index={index}
              kommune={card}
              isFlipped={
                flippedIndices.includes(index) || matchedIndices.includes(index)
              }
              cardFlipDuration={cardFlipDuration}
              handleClick={handleCardClick}
            />
          </li>
        ))}
      </ul>

      {/* Name prompt only for 1-player */}
      {isGameFinished && !isTwoPlayer && !playerName && didMakeItToTop10 && (
        <NamePrompt time={elapsedTime} onTypedName={handleSubmitName} />
      )}

      {/* Show TopList only for 1-player */}
      {isGameFinished &&
        !isTwoPlayer &&
        ((didMakeItToTop10 && playerName) || !didMakeItToTop10) && (
          <TopList
            currentResult={{ name: playerName, time: elapsedTime }}
            top10={top10}
            numberOfCards={numberOfCards}
          />
        )}

      {/* Winner only for 2-player */}
      {isGameFinished && isTwoPlayer && (
       <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4">Resultat</h2>
          <p className="mb-2">{player1}: {scores[0]} poeng</p>
          <p className="mb-4">{player2}: {scores[1]} poeng</p>
          <p className="text-xl font-semibold mb-6">
        {renderWinner()}
          </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900"
            onClick={() => window.location.reload()}
          >
            Spill igjen
          </button>
          <button
            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
            onClick={() => window.location.href = "/"}
          >
            Tilbake til start
          </button>
        </div>
      </div>
    </div>
  )}
    </>
  );
};

export default Game;