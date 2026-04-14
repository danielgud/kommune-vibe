import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { randomKommuner } from '../../assets/kommuner';
import { GuesswhoState, GuesswhoPlayer, Kommune, BoardSize } from './types';
import { GuesswhoLobby } from './GuesswhoLobby';
import { CoverScreen } from './CoverScreen';
import { SecretPick } from './SecretPick';
import { GuesswhoBoard } from './GuesswhoBoard';

const makePlayer = (name: string): GuesswhoPlayer => ({
  name,
  secret: null,
  eliminated: new Set(),
});

const initialState = (): GuesswhoState => ({
  phase: 'lobby',
  currentPlayer: 0,
  kommuner: [],
  players: [makePlayer('Spiller 1'), makePlayer('Spiller 2')],
  pass: null,
  winner: null,
});

const Guesswho = () => {
  const [state, setState] = useState<GuesswhoState>(initialState);
  const navigate = useNavigate();

  const handleLobbyStart = (p1Name: string, p2Name: string, boardSize: BoardSize) => {
    setState({
      phase: 'picking',
      currentPlayer: 0,
      kommuner: randomKommuner(boardSize),
      players: [makePlayer(p1Name), makePlayer(p2Name)],
      pass: null,
      winner: null,
    });
  };

  const handleSecretPicked = (kommune: Kommune) => {
    setState(prev => {
      const cp = prev.currentPlayer as 0 | 1;
      const newPlayers = [
        { ...prev.players[0], eliminated: new Set(prev.players[0].eliminated) },
        { ...prev.players[1], eliminated: new Set(prev.players[1].eliminated) },
      ] as GuesswhoState['players'];
      newPlayers[cp] = { ...newPlayers[cp], secret: kommune };

      if (cp === 0) {
        return {
          ...prev,
          players: newPlayers,
          phase: 'pass',
          currentPlayer: 1,
          pass: {
            message: 'Gi enheten videre 🤫',
            subMessage: `${newPlayers[1].name} skal nå velge sitt hemmelige kommunevåpen`,
            nextPhase: 'picking',
          },
        };
      } else {
        return {
          ...prev,
          players: newPlayers,
          phase: 'pass',
          currentPlayer: 0,
          pass: {
            message: 'Klar for kamp! ⚔️',
            subMessage: `${newPlayers[0].name} starter`,
            nextPhase: 'playing',
          },
        };
      }
    });
  };

  const handlePassReady = () => {
    setState(prev => ({ ...prev, phase: prev.pass!.nextPhase, pass: null }));
  };

  const handleEliminate = (imageUrl: string) => {
    setState(prev => {
      const cp = prev.currentPlayer as 0 | 1;
      const newEliminated = new Set(prev.players[cp].eliminated);
      // Toggle: eliminate if active, restore if already eliminated
      if (newEliminated.has(imageUrl)) {
        newEliminated.delete(imageUrl);
      } else {
        newEliminated.add(imageUrl);
      }
      const newPlayers = [...prev.players] as GuesswhoState['players'];
      newPlayers[cp] = { ...newPlayers[cp], eliminated: newEliminated };
      return { ...prev, players: newPlayers };
    });
  };

  const handleGuess = (kommune: Kommune) => {
    setState(prev => {
      const cp = prev.currentPlayer as 0 | 1;
      const op = (cp === 0 ? 1 : 0) as 0 | 1;
      const isCorrect = kommune.image === prev.players[op].secret?.image;
      return {
        ...prev,
        phase: 'finished',
        winner: isCorrect ? cp : op,
      };
    });
  };

  const handlePassTurn = () => {
    setState(prev => {
      const cp = prev.currentPlayer as 0 | 1;
      const next = (cp === 0 ? 1 : 0) as 0 | 1;
      return {
        ...prev,
        phase: 'pass',
        currentPlayer: next,
        pass: {
          message: 'Gi enheten videre',
          subMessage: `${prev.players[next].name}s tur`,
          nextPhase: 'playing',
        },
      };
    });
  };

  const { phase, currentPlayer, pass, players, kommuner, winner } = state;
  const cp = currentPlayer as 0 | 1;

  if (phase === 'lobby') return <GuesswhoLobby onStart={handleLobbyStart} />;

  if (phase === 'picking') {
    return (
      <SecretPick
        playerName={players[cp].name}
        kommuner={kommuner}
        onPicked={handleSecretPicked}
      />
    );
  }

  if (phase === 'pass' && pass) {
    return (
      <CoverScreen
        message={pass.message}
        subMessage={pass.subMessage}
        playerName={players[cp].name}
        onReady={handlePassReady}
      />
    );
  }

  if (phase === 'playing') {
    return (
      <GuesswhoBoard
        player={players[cp]}
        kommuner={kommuner}
        onEliminate={handleEliminate}
        onGuess={handleGuess}
        onPassTurn={handlePassTurn}
      />
    );
  }

  if (phase === 'finished' && winner !== null) {
    const op = (winner === 0 ? 1 : 0) as 0 | 1;
    return (
      <div className="fixed inset-0 bg-[url('/bg.png')] bg-no-repeat bg-cover flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-amber-800 mb-2">
            {players[winner].name} vinner!
          </h2>
          <p className="text-gray-500 mb-2">
            {players[op].name}s hemmelige kommunevåpen var:
          </p>
          {players[op].secret && (
            <div className="flex flex-col items-center gap-1 mb-6">
              <img
                src={players[op].secret.image}
                alt={players[op].secret.navn}
                className="w-20 h-20 object-contain"
              />
              <p className="font-bold text-lg text-gray-800">{players[op].secret.navn}</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setState(initialState())}
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition-colors shadow"
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

export default Guesswho;
