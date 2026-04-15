import { useState } from 'react';

interface BattleshipLobbyProps {
  onStart: (p1Name: string, p2Name: string) => void;
}

export const BattleshipLobby = ({ onStart }: BattleshipLobbyProps) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [roomCode] = useState(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  const handleStart = () => onStart(p1 || 'Spiller 1', p2 || 'Spiller 2');

  const inputClass =
    'w-full border-2 border-blue-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-blue-400 transition-colors bg-white';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg.png')] bg-no-repeat bg-cover p-4">
      <div className="bg-white bg-opacity-95 rounded-3xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl mb-3">⚓</div>
          <h1 className="text-3xl font-bold text-blue-900">Sjøslag</h1>
          <p className="text-gray-500 mt-1">Senk motstanderens flåte!</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Spiller 1</label>
          <input
            className={inputClass}
            placeholder="Spiller 1"
            value={p1}
            onChange={e => setP1(e.target.value)}
            maxLength={20}
          />
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Spiller 2</label>
          <input
            className={inputClass}
            placeholder="Spiller 2"
            value={p2}
            onChange={e => setP2(e.target.value)}
            maxLength={20}
          />
        </div>

        <button
          onClick={handleStart}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-3 rounded-xl transition-colors focus-visible:ring-4 ring-blue-300 ring-offset-2 shadow-md"
        >
          Spill på denne enheten
        </button>

        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setShowJoin(!showJoin)}
            className="text-gray-400 hover:text-gray-600 text-sm w-full text-center transition-colors"
          >
            {showJoin ? 'Skjul' : '🌐 Spill online (kommer snart)'}
          </button>

          {showJoin && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Din spillkode</p>
                <p className="text-3xl font-mono font-bold tracking-widest text-blue-700">
                  {roomCode}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Online-funksjonalitet er ikke implementert ennå
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 bg-white"
                  placeholder="Skriv inn kode..."
                  maxLength={6}
                />
                <button
                  className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl cursor-not-allowed font-semibold"
                  disabled
                >
                  Bli med
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
