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
    'w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-base focus:outline-none focus:border-sky-500 transition-colors';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl mb-3">⚓</div>
          <h1 className="text-3xl font-bold text-white">Sjøslag</h1>
          <p className="text-slate-400 mt-1">Senk motstanderens flåte!</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Spiller 1</label>
          <input
            className={inputClass}
            placeholder="Spiller 1"
            value={p1}
            onChange={e => setP1(e.target.value)}
            maxLength={20}
          />
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Spiller 2</label>
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
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-lg py-3 rounded-xl transition-colors focus-visible:ring-4 ring-sky-400 ring-offset-2 ring-offset-slate-800"
        >
          Spill på denne enheten
        </button>

        <div className="border-t border-slate-700 pt-4">
          <button
            onClick={() => setShowJoin(!showJoin)}
            className="text-slate-500 hover:text-slate-400 text-sm w-full text-center transition-colors"
          >
            {showJoin ? 'Skjul' : '🌐 Spill online (kommer snart)'}
          </button>

          {showJoin && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Din spillkode</p>
                <p className="text-3xl font-mono font-bold tracking-widest text-sky-400">
                  {roomCode}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Online-funksjonalitet er ikke implementert ennå
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  placeholder="Skriv inn kode..."
                  maxLength={6}
                />
                <button
                  className="bg-slate-600 text-slate-500 px-4 py-2 rounded-lg cursor-not-allowed"
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
