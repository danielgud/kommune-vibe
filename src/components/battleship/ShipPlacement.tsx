import { useState } from 'react';
import { SHIPS } from './constants';
import { OwnCell, Orientation, PlacedShip } from './types';
import { applyShipsToBoard, getShipCells, isValidPlacement } from './utils';
import { Grid, CellVariant } from './Grid';

interface ShipPlacementProps {
  playerName: string;
  onDone: (board: OwnCell[][], ships: PlacedShip[]) => void;
}

export const ShipPlacement = ({ playerName, onDone }: ShipPlacementProps) => {
  const [placedShips, setPlacedShips] = useState<PlacedShip[]>([]);
  const [selectedShipIndex, setSelectedShipIndex] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>('H');
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);

  const currentShipDef = SHIPS[selectedShipIndex] ?? null;
  const allPlaced = placedShips.length === SHIPS.length;

  const getPreviewCells = (): Set<string> => {
    if (!hoverCell || !currentShipDef || allPlaced) return new Set();
    const [row, col] = hoverCell;
    return new Set(
      getShipCells({ ...currentShipDef, row, col, orientation }).map(([r, c]) => `${r},${c}`)
    );
  };

  const isPreviewValid = (): boolean => {
    if (!hoverCell || !currentShipDef) return false;
    const [row, col] = hoverCell;
    return isValidPlacement([], { ...currentShipDef, row, col, orientation }, undefined, placedShips);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!currentShipDef || allPlaced) return;
    const ship: PlacedShip = { ...currentShipDef, row, col, orientation };
    if (!isValidPlacement([], ship, undefined, placedShips)) return;
    const newShips = [...placedShips, ship];
    setPlacedShips(newShips);
    setSelectedShipIndex(prev => prev + 1);
  };

  const handleRemoveShip = (index: number) => {
    setPlacedShips(prev => prev.filter((_, i) => i !== index));
    setSelectedShipIndex(index);
  };

  const board = applyShipsToBoard(placedShips);
  const previewCells = getPreviewCells();
  const previewValid = isPreviewValid();

  const getVariant = (row: number, col: number): CellVariant => {
    const key = `${row},${col}`;
    if (previewCells.has(key)) return previewValid ? 'preview-ok' : 'preview-bad';
    if (board[row][col] === 'ship') return 'ship';
    return 'ocean';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 gap-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          {playerName} — Plasser skipene dine
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Klikk på brettet for å plassere, <kbd className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-xs">R</kbd> for å rotere
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-4xl">
        {/* Grid panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            {currentShipDef && !allPlaced ? (
              <p className="text-sky-400 text-sm font-semibold">
                Plasserer: <span className="text-white">{currentShipDef.name}</span>
                <span className="text-slate-500 ml-1">({currentShipDef.size} celler)</span>
              </p>
            ) : allPlaced ? (
              <p className="text-emerald-400 text-sm font-semibold">✓ Alle skip plassert</p>
            ) : (
              <div />
            )}
            <button
              onClick={() => setOrientation(o => (o === 'H' ? 'V' : 'H'))}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors border border-slate-600 flex items-center gap-1.5"
            >
              {orientation === 'H' ? '↔' : '↕'}
              {orientation === 'H' ? 'Horisontalt' : 'Vertikalt'}
            </button>
          </div>

          <Grid
            cellSize={36}
            getVariant={getVariant}
            onCellClick={allPlaced ? undefined : handleCellClick}
            onCellHover={(r, c) => setHoverCell([r, c])}
            onMouseLeave={() => setHoverCell(null)}
          />
        </div>

        {/* Ship list panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full lg:w-60 flex flex-col gap-3">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Skip</h3>

          {SHIPS.map((ship, index) => {
            const placed = index < placedShips.length;
            const active = index === selectedShipIndex && !allPlaced;
            return (
              <div
                key={ship.name}
                className={`rounded-xl border px-3 py-2.5 transition-colors ${
                  active
                    ? 'border-sky-500 bg-sky-900/40'
                    : placed
                    ? 'border-emerald-700 bg-emerald-900/20'
                    : 'border-slate-700 bg-slate-700/30 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${active ? 'text-sky-300' : placed ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {placed ? '✓ ' : active ? '→ ' : ''}{ship.name}
                  </span>
                  {placed && (
                    <button
                      onClick={() => handleRemoveShip(index)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2"
                    >
                      Fjern
                    </button>
                  )}
                </div>
                {/* Ship size visualizer */}
                <div className="flex gap-0.5 mt-1.5">
                  {Array.from({ length: ship.size }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-sm ${
                        placed ? 'bg-emerald-600' : active ? 'bg-sky-600' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {allPlaced && (
            <button
              onClick={() => onDone(board, placedShips)}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base py-3 rounded-xl transition-colors focus-visible:ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-800"
            >
              Bekreft ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
