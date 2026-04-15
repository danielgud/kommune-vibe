import { useState } from 'react';
import { GameState, OwnCell, PlacedShip } from './types';
import { createEmptyOwnBoard, createEmptyShotBoard, allShipsSunk } from './utils';
import { BattleshipLobby } from './BattleshipLobby';
import { ShipPlacement } from './ShipPlacement';
import { PassDevice } from './PassDevice';
import { BattleBoard } from './BattleBoard';
import { useNavigate } from 'react-router-dom';

const makePlayer = (name: string) => ({
  name,
  board: createEmptyOwnBoard(),
  shots: createEmptyShotBoard(),
  ships: [] as PlacedShip[],
});

const initialState = (): GameState => ({
  phase: 'lobby',
  currentPlayer: 0,
  pass: null,
  players: [makePlayer('Spiller 1'), makePlayer('Spiller 2')],
  winner: null,
});

const Battleship = () => {
  const [state, setState] = useState<GameState>(initialState);
  const [lastMessage, setLastMessage] = useState('');
  const navigate = useNavigate();

  const handleLobbyStart = (p1Name: string, p2Name: string) => {
    setState({
      ...initialState(),
      phase: 'placing',
      currentPlayer: 0,
      players: [makePlayer(p1Name), makePlayer(p2Name)],
    });
  };

  const handlePlacementDone = (board: OwnCell[][], ships: PlacedShip[]) => {
    setState(prev => {
      const cp = prev.currentPlayer;
      const newPlayers = [
        { ...prev.players[0] },
        { ...prev.players[1] },
      ] as [typeof prev.players[0], typeof prev.players[1]];
      newPlayers[cp] = { ...newPlayers[cp], board, ships };

      if (cp === 0) {
        return {
          ...prev,
          players: newPlayers,
          phase: 'pass',
          currentPlayer: 1,
          pass: {
            message: 'Bra! Gi enheten videre',
            subMessage: `${newPlayers[1].name} skal nå plassere sine skip`,
            nextPhase: 'placing',
          },
        };
      } else {
        return {
          ...prev,
          players: newPlayers,
          phase: 'pass',
          currentPlayer: 0,
          pass: {
            message: 'Alle skip plassert! 🎉',
            subMessage: `${newPlayers[0].name} skyter først`,
            nextPhase: 'battle',
          },
        };
      }
    });
  };

  const handlePassReady = () => {
    setState(prev => ({
      ...prev,
      phase: prev.pass!.nextPhase,
      pass: null,
    }));
  };

  const handleShot = (row: number, col: number) => {
    setState(prev => {
      const cp = prev.currentPlayer as 0 | 1;
      const op = cp === 0 ? 1 : 0;

      const newPlayers = [
        { ...prev.players[0], board: prev.players[0].board.map(r => [...r]) as OwnCell[][], shots: prev.players[0].shots.map(r => [...r]) },
        { ...prev.players[1], board: prev.players[1].board.map(r => [...r]) as OwnCell[][], shots: prev.players[1].shots.map(r => [...r]) },
      ] as GameState['players'];

      const isHit = newPlayers[op].board[row][col] === 'ship';

      newPlayers[cp].shots[row][col] = isHit ? 'hit' : 'miss';
      newPlayers[op].board[row][col] = isHit ? 'hit' : 'miss';

      const msg = isHit ? `Treff! 💥` : `Bom! 🌊`;
      setLastMessage(msg);

      if (isHit && allShipsSunk(newPlayers[op].ships, newPlayers[op].board)) {
        return { ...prev, players: newPlayers, phase: 'finished', winner: cp };
      }

      return {
        ...prev,
        players: newPlayers,
        phase: 'pass',
        currentPlayer: op,
        pass: {
          message: `${msg} Gi enheten videre`,
          subMessage: `${newPlayers[op].name}s tur`,
          nextPhase: 'battle',
        },
      };
    });
  };

  const { phase, currentPlayer, pass, players, winner } = state;
  const cp = currentPlayer as 0 | 1;
  const op = (cp === 0 ? 1 : 0) as 0 | 1;

  if (phase === 'lobby') {
    return <BattleshipLobby onStart={handleLobbyStart} />;
  }

  if (phase === 'placing') {
    return (
      <ShipPlacement
        playerName={players[cp].name}
        onDone={handlePlacementDone}
      />
    );
  }

  if (phase === 'pass' && pass) {
    return (
      <PassDevice
        message={pass.message}
        subMessage={pass.subMessage}
        playerName={players[cp].name}
        onReady={handlePassReady}
      />
    );
  }

  if (phase === 'battle') {
    return (
      <BattleBoard
        currentPlayerName={players[cp].name}
        opponentName={players[op].name}
        ownBoard={players[cp].board}
        shots={players[cp].shots}
        ownShips={players[cp].ships}
        opponentShips={players[op].ships}
        opponentBoard={players[op].board}
        onShot={handleShot}
        lastMessage={lastMessage}
      />
    );
  }

  if (phase === 'finished' && winner !== null) {
    return (
      <div className="fixed inset-0 bg-[url('/bg.png')] bg-no-repeat bg-cover flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">
            {players[winner].name} vinner!
          </h2>
          <p className="text-gray-400 mb-8">
            Alle {players[winner === 0 ? 1 : 0].name}s skip er sunket!
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setState(initialState())}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow"
            >
              Spill igjen
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Tilbake til start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Battleship;
