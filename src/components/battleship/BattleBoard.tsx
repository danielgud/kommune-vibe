import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { OwnCell, PlacedShip, ShotCell } from './types';
import { isShipSunk } from './utils';
import { Grid, CellVariant } from './Grid';

interface BattleBoardProps {
  currentPlayerName: string;
  opponentName: string;
  ownBoard: OwnCell[][];
  shots: ShotCell[][];
  ownShips: PlacedShip[];
  opponentShips: PlacedShip[];
  opponentBoard: OwnCell[][];
  onShot: (row: number, col: number) => void;
  lastMessage?: string;
}

const FIRE_COLORS = ['#ff4500', '#ff6b35', '#ff9500', '#ffb347', '#ffd700', '#ffffff'];

const ownVariant = (cell: OwnCell): CellVariant => {
  if (cell === 'hit') return 'hit';
  if (cell === 'miss') return 'miss';
  if (cell === 'ship') return 'ship';
  return 'ocean';
};

const shotVariant = (cell: ShotCell): CellVariant => {
  if (cell === 'hit') return 'hit';
  if (cell === 'miss') return 'miss';
  return 'target';
};

export const BattleBoard = ({
  currentPlayerName,
  opponentName,
  ownBoard,
  shots,
  ownShips,
  opponentShips,
  opponentBoard,
  onShot,
  lastMessage,
}: BattleBoardProps) => {
  const prevShotsRef = useRef(shots);
  const [animatingHits, setAnimatingHits] = useState<Set<string>>(new Set());
  const targetBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = prevShotsRef.current;
    const newHits: string[] = [];

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (prev[r][c] !== 'hit' && shots[r][c] === 'hit') {
          newHits.push(`${r},${c}`);
        }
      }
    }
    prevShotsRef.current = shots;

    if (newHits.length === 0) return;

    // Trigger cell burst animation
    setAnimatingHits(new Set(newHits));
    const timer = setTimeout(() => setAnimatingHits(new Set()), 700);

    // Fire confetti from the target board's position
    const board = targetBoardRef.current;
    if (board) {
      const rect = board.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 45,
        startVelocity: 22,
        spread: 55,
        origin: { x: originX, y: originY },
        colors: FIRE_COLORS,
        gravity: 1.6,
        scalar: 0.65,
        shapes: ['circle', 'square'],
        ticks: 80,
      });
    }

    return () => clearTimeout(timer);
  }, [shots]);

  const sunkenOwn = ownShips.filter(s => isShipSunk(s, ownBoard)).length;
  const sunkenOpponent = opponentShips.filter(s => isShipSunk(s, opponentBoard)).length;

  const handleTargetClick = (row: number, col: number) => {
    if (shots[row][col] !== 'unknown') return;
    onShot(row, col);
  };

  return (
    <div className="min-h-screen bg-[url('/bg.png')] bg-no-repeat bg-cover flex flex-col items-center p-4 gap-5">
      {/* Header / status */}
      <div className="w-full max-w-5xl bg-white bg-opacity-95 rounded-2xl shadow-md px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-center min-w-[80px]">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Mine tap</p>
          <p className="font-bold text-red-500 text-lg">{sunkenOwn}/{ownShips.length}</p>
        </div>

        <div className="text-center flex-1">
          <p className="text-blue-900 text-xl font-bold">{currentPlayerName}s tur</p>
          {lastMessage ? (
            <p className="text-blue-600 text-sm mt-0.5">{lastMessage}</p>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5">Klikk på {opponentName}s brett for å skyte</p>
          )}
        </div>

        <div className="text-center min-w-[80px]">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Fiendens tap</p>
          <p className="font-bold text-emerald-600 text-lg">{sunkenOpponent}/{opponentShips.length}</p>
        </div>
      </div>

      {/* Boards */}
      <div className="flex flex-wrap gap-6 justify-center items-start w-full max-w-5xl">
        {/* Own board */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-md p-5 flex flex-col items-center gap-3">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
            {currentPlayerName} — Ditt brett
          </p>
          <Grid
            cellSize={28}
            getVariant={(r, c) => ownVariant(ownBoard[r][c])}
          />
        </div>

        {/* Target board */}
        <div
          ref={targetBoardRef}
          className="bg-white bg-opacity-95 rounded-2xl shadow-md p-5 flex flex-col items-center gap-3 ring-2 ring-blue-400/50"
        >
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
            {opponentName} — Skyt her
          </p>
          <Grid
            cellSize={36}
            getVariant={(r, c) => shotVariant(shots[r][c])}
            onCellClick={handleTargetClick}
            animatingHits={animatingHits}
          />
        </div>
      </div>

      {/* Sunken ships */}
      <div className="w-full max-w-5xl bg-white bg-opacity-95 rounded-2xl shadow-md px-5 py-4">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
          Sunkne skip — {opponentName}
        </p>
        <div className="flex flex-wrap gap-2">
          {opponentShips.map((ship, i) => {
            const sunk = isShipSunk(ship, opponentBoard);
            return (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  sunk
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <span>{sunk ? '💀' : '🚢'}</span>
                <span className={sunk ? 'line-through' : ''}>{ship.name}</span>
                <span className="text-gray-300">{'▪'.repeat(ship.size)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
