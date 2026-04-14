import { Kommune } from '../../assets/kommuner';

export type { Kommune };

export interface GuesswhoPlayer {
  name: string;
  secret: Kommune | null;
  /** Image URLs of eliminated kommuner */
  eliminated: Set<string>;
}

export type GuesswhoPhase =
  | 'lobby'
  | 'picking'   // a player picks their secret kommune
  | 'pass'      // cover screen between turns
  | 'playing'   // main game loop
  | 'finished';

export interface PassInfo {
  message: string;
  subMessage?: string;
  nextPhase: GuesswhoPhase;
}

export interface GuesswhoState {
  phase: GuesswhoPhase;
  currentPlayer: 0 | 1;
  kommuner: Kommune[];   // the N random kommuner on the board (shared)
  players: [GuesswhoPlayer, GuesswhoPlayer];
  pass: PassInfo | null;
  winner: 0 | 1 | null;
}

export type BoardSize = 12 | 24;
