import { useState } from 'react';
import { BoardSize } from './types';

interface GuesswhoLobbyProps {
  onStart: (p1Name: string, p2Name: string, boardSize: BoardSize) => void;
}

export const GuesswhoLobby = ({ onStart }: GuesswhoLobbyProps) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [boardSize, setBoardSize] = useState<BoardSize>(24);
  const [showOnline, setShowOnline] = useState(false);
  const [roomCode] = useState(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  const inputClass =
    'w-full border-2 border-amber-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-amber-400 transition-colors bg-white';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg.png')] bg-no-repeat bg-cover p-4">
      <div className="bg-white bg-opacity-95 rounded-3xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h1 className="text-3xl font-bold text-amber-800">Gjett hvem</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gjett motstanderens hemmelige kommunevåpen!
          </p>
        </div>

        {/* Player names */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Spiller 1
          </label>
          <input
            className={inputClass}
            placeholder="Spiller 1"
            value={p1}
            onChange={e => setP1(e.target.value)}
            maxLength={20}
          />
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Spiller 2
          </label>
          <input
            className={inputClass}
            placeholder="Spiller 2"
            value={p2}
            onChange={e => setP2(e.target.value)}
            maxLength={20}
          />
        </div>

        {/* Board size */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
            Brettstørrelse
          </label>
          <div className="flex gap-3">
            {([12, 24] as BoardSize[]).map(size => (
              <button
                key={size}
                onClick={() => setBoardSize(size)}
                className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-colors ${
                  boardSize === size
                    ? 'border-amber-400 bg-amber-50 text-amber-800'
                    : 'border-gray-200 text-gray-500 hover:border-amber-200'
                }`}
              >
                {size} kommuner
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(p1 || 'Spiller 1', p2 || 'Spiller 2', boardSize)}
          className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg py-3 rounded-xl transition-colors focus-visible:ring-4 ring-amber-300 ring-offset-2 shadow-md"
        >
          Spill lokalt 🎮
        </button>

        {/* Online stub */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setShowOnline(!showOnline)}
            className="text-gray-400 hover:text-gray-600 text-sm w-full text-center transition-colors"
          >
            🌐 Spill online (kommer snart)
          </button>
          {showOnline && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Din spillkode
              </p>
              <p className="text-3xl font-mono font-bold tracking-widest text-amber-700">
                {roomCode}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Online-funksjonalitet er ikke implementert ennå
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
