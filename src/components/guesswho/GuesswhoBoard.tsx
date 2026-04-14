import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { Kommune, GuesswhoPlayer } from './types';

interface GuesswhoCardProps {
  kommune: Kommune;
  isEliminated: boolean;
  isGuessMode: boolean;
  onClick: () => void;
}

const GuesswhoCard = ({ kommune, isEliminated, isGuessMode, onClick }: GuesswhoCardProps) => (
  <button
    onClick={onClick}
    title={isGuessMode ? `Gjett på ${kommune.navn}` : isEliminated ? `Gjenopprett ${kommune.navn}` : `Eliminer ${kommune.navn}`}
    className={classNames(
      'flex flex-col items-center rounded-xl p-2 border-2 transition-all duration-150 select-none',
      {
        'opacity-30 grayscale border-gray-200 hover:opacity-50':
          isEliminated && !isGuessMode,
        'border-gray-100 hover:border-amber-300 hover:shadow-md hover:scale-105':
          !isEliminated && !isGuessMode,
        'border-amber-300 hover:border-amber-500 hover:shadow-amber-200 hover:shadow-lg hover:scale-105 cursor-crosshair':
          isGuessMode && !isEliminated,
        'opacity-20 grayscale cursor-not-allowed': isGuessMode && isEliminated,
      },
    )}
  >
    <img
      src={kommune.image}
      alt={kommune.navn}
      className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
      loading="lazy"
    />
    <span className="text-[10px] sm:text-xs font-semibold text-gray-600 text-center mt-1 leading-tight line-clamp-2 w-full">
      {kommune.navn}
    </span>
  </button>
);

interface GuesswhoGuessConfirmProps {
  kommune: Kommune;
  onConfirm: () => void;
  onCancel: () => void;
}

const GuessConfirm = ({ kommune, onConfirm, onCancel }: GuesswhoGuessConfirmProps) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center flex flex-col gap-4">
      <p className="text-lg font-bold text-gray-800">Er dette motstanderens hemmelige kommune?</p>
      <div className="flex flex-col items-center gap-2">
        <img src={kommune.image} alt={kommune.navn} className="w-20 h-20 object-contain" />
        <p className="font-bold text-xl text-amber-800">{kommune.navn}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition-colors shadow"
        >
          Ja, gjett!
        </button>
      </div>
    </div>
  </div>
);

interface GuesswhoBoardProps {
  player: GuesswhoPlayer;
  kommuner: Kommune[];
  onEliminate: (imageUrl: string) => void;
  onGuess: (kommune: Kommune) => void;
  onPassTurn: () => void;
}

export const GuesswhoBoard = ({
  player,
  kommuner,
  onEliminate,
  onGuess,
  onPassTurn,
}: GuesswhoBoardProps) => {
  const [isGuessMode, setIsGuessMode] = useState(false);
  const [pendingGuess, setPendingGuess] = useState<Kommune | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  // Hide secret whenever the active player changes
  useEffect(() => {
    setShowSecret(false);
    setIsGuessMode(false);
  }, [player.name]);

  const remaining = kommuner.filter(k => !player.eliminated.has(k.image)).length;

  const handleCardClick = (kommune: Kommune) => {
    if (isGuessMode) {
      if (!player.eliminated.has(kommune.image)) {
        setPendingGuess(kommune);
      }
      return;
    }
    onEliminate(kommune.image);
  };

  const handleConfirmGuess = () => {
    if (pendingGuess) {
      onGuess(pendingGuess);
      setPendingGuess(null);
      setIsGuessMode(false);
    }
  };

  const cols = kommuner.length <= 12 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-6';

  return (
    <div className="min-h-screen bg-[url('/bg.png')] bg-no-repeat bg-cover flex flex-col items-center p-3 gap-3 pt-4">
      {/* Status bar */}
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-md px-4 py-3 w-full max-w-3xl flex items-center gap-3 flex-wrap">
        {/* Secret — hidden by default, reveal on demand */}
        <div className="flex items-center gap-2 min-w-0">
          {showSecret && player.secret ? (
            <>
              <img
                src={player.secret.image}
                alt={player.secret.navn}
                className="w-8 h-8 object-contain shrink-0"
              />
              <span className="text-xs font-semibold text-gray-700 truncate max-w-[80px]">
                {player.secret.navn}
              </span>
              <button
                onClick={() => setShowSecret(false)}
                className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap transition-colors"
                title="Skjul mitt kort"
              >
                🙈 Skjul
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowSecret(true)}
              className="text-xs text-amber-600 hover:text-amber-800 font-semibold whitespace-nowrap transition-colors"
              title="Vis mitt hemmelige kort"
            >
              👁️ Vis mitt kort
            </button>
          )}
        </div>

        {/* Turn + remaining */}
        <div className="flex-1 text-center">
          <p className="font-bold text-amber-800 text-base">{player.name}s tur</p>
          <p className="text-xs text-gray-400">{remaining} igjen • Klikk for å eliminere</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          {!isGuessMode ? (
            <>
              <button
                onClick={() => setIsGuessMode(true)}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-3 py-1.5 rounded-lg text-sm transition-colors shadow"
              >
                Gjett! 🎯
              </button>
              <button
                onClick={onPassTurn}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                Pass tur →
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsGuessMode(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              Avbryt
            </button>
          )}
        </div>
      </div>

      {/* Guess mode banner */}
      {isGuessMode && (
        <div className="bg-amber-400 text-amber-900 font-bold text-sm px-4 py-2 rounded-xl w-full max-w-3xl text-center shadow">
          🎯 Gjettemodus — klikk på kommunen du tror motspilleren har
        </div>
      )}

      {/* Board */}
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-md p-3 w-full max-w-3xl">
        <div className={`grid ${cols} gap-2`}>
          {kommuner.map(k => (
            <GuesswhoCard
              key={k.image}
              kommune={k}
              isEliminated={player.eliminated.has(k.image)}
              isGuessMode={isGuessMode}
              onClick={() => handleCardClick(k)}
            />
          ))}
        </div>
      </div>

      {pendingGuess && (
        <GuessConfirm
          kommune={pendingGuess}
          onConfirm={handleConfirmGuess}
          onCancel={() => setPendingGuess(null)}
        />
      )}
    </div>
  );
};
