export type OwnCell = 'empty' | 'ship' | 'hit' | 'miss';
export type ShotCell = 'unknown' | 'hit' | 'miss';
export type Orientation = 'H' | 'V';

export interface ShipDef {
  name: string;
  size: number;
}

export interface PlacedShip extends ShipDef {
  row: number;
  col: number;
  orientation: Orientation;
}

export interface PlayerState {
  name: string;
  board: OwnCell[][];
  shots: ShotCell[][];
  ships: PlacedShip[];
}

export type GamePhase = 'lobby' | 'placing' | 'pass' | 'battle' | 'finished';

export interface PassInfo {
  message: string;
  subMessage?: string;
  nextPhase: 'placing' | 'battle';
  autoAdvanceMs?: number; // if set, overlay auto-dismisses after this many ms
}

export interface GameState {
  phase: GamePhase;
  currentPlayer: 0 | 1;
  pass: PassInfo | null;
  players: [PlayerState, PlayerState];
  winner: 0 | 1 | null;
}
