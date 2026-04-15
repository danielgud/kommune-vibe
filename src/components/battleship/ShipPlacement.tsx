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
    <div className="min-h-screen bg-[url('/bg.png')] bg-no-repeat bg-cover flex flex-col items-center justify-center p-4 gap-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white drop-shadow">
          {playerName} — Plasser skipene dine
        </h2>
        <p className="text-white/80 text-sm mt-1 drop-shadow">
          Klikk på brettet for å plassere, <kbd className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs">R</kbd> for å rotere
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-4xl">
        {/* Grid panel */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-md p-5 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            {currentShipDef && !allPlaced ? (
              <p className="text-blue-600 text-sm font-semibold">
                Plasserer: <span className="text-gray-800">{currentShipDef.name}</span>
                <span className="text-gray-400 ml-1">({currentShipDef.size} celler)</span>
              </p>
            ) : allPlaced ? (
              <p className="text-emerald-600 text-sm font-semibold">✓ Alle skip plassert</p>
            ) : (
              <div />
            )}
            <button
              onClick={() => setOrientation(o => (o === 'H' ? 'V' : 'H'))}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors border border-gray-200 flex items-center gap-1.5"
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
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-md p-5 w-full lg:w-60 flex flex-col gap-3">
          <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wide">Skip</h3>

          {SHIPS.map((ship, index) => {
            const placed = index < placedShips.length;
            const active = index === selectedShipIndex && !allPlaced;
            return (
              <div
                key={ship.name}
                className={`rounded-xl border px-3 py-2.5 transition-colors ${
                  active
                    ? 'border-blue-400 bg-blue-50'
                    : placed
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${active ? 'text-blue-700' : placed ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {placed ? '✓ ' : active ? '→ ' : ''}{ship.name}
                  </span>
                  {placed && (
                    <button
                      onClick={() => handleRemoveShip(index)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors ml-2"
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
                        placed ? 'bg-emerald-500' : active ? 'bg-blue-500' : 'bg-gray-300'
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
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base py-3 rounded-xl transition-colors shadow focus-visible:ring-4 ring-emerald-400 ring-offset-2"
            >
              Bekreft ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
