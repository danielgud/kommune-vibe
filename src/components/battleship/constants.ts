import { ShipDef } from './types';

export const BOARD_SIZE = 10;

export const SHIPS: ShipDef[] = [
  { name: 'Hangarskip', size: 5 },
  { name: 'Slagskip', size: 4 },
  { name: 'Krysser', size: 3 },
  { name: 'Ubåt', size: 3 },
  { name: 'Destroyer', size: 2 },
];

export const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const ROW_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
