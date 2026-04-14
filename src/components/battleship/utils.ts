import { OwnCell, PlacedShip, ShotCell } from './types';
import { BOARD_SIZE } from './constants';

export function createEmptyOwnBoard(): OwnCell[][] {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill('empty') as OwnCell[]);
}

export function createEmptyShotBoard(): ShotCell[][] {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill('unknown') as ShotCell[]);
}

export function getShipCells(ship: PlacedShip): [number, number][] {
  return Array.from({ length: ship.size }, (_, i) => [
    ship.row + (ship.orientation === 'V' ? i : 0),
    ship.col + (ship.orientation === 'H' ? i : 0),
  ] as [number, number]);
}

export function isValidPlacement(
  _board: OwnCell[][],
  ship: PlacedShip,
  ignoreShipIndex?: number,
  existingShips?: PlacedShip[],
): boolean {
  const cells = getShipCells(ship);

  for (const [r, c] of cells) {
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
  }

  if (!existingShips) return true;

  const occupiedCells = new Set<string>();
  existingShips.forEach((s, idx) => {
    if (idx === ignoreShipIndex) return;
    getShipCells(s).forEach(([r, c]) => occupiedCells.add(`${r},${c}`));
  });

  return cells.every(([r, c]) => !occupiedCells.has(`${r},${c}`));
}

export function applyShipsToBoard(ships: PlacedShip[]): OwnCell[][] {
  const board = createEmptyOwnBoard();
  for (const ship of ships) {
    getShipCells(ship).forEach(([r, c]) => {
      board[r][c] = 'ship';
    });
  }
  return board;
}

export function isShipSunk(ship: PlacedShip, board: OwnCell[][]): boolean {
  return getShipCells(ship).every(([r, c]) => board[r][c] === 'hit');
}

export function allShipsSunk(ships: PlacedShip[], board: OwnCell[][]): boolean {
  return ships.every(s => isShipSunk(s, board));
}
