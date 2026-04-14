interface CoverScreenProps {
  message: string;
  subMessage?: string;
  playerName: string;
  onReady: () => void;
}

export const CoverScreen = ({ message, subMessage, playerName, onReady }: CoverScreenProps) => (
  <div className="fixed inset-0 bg-amber-950 bg-opacity-95 flex flex-col items-center justify-center gap-6 z-50 p-6">
    <div className="text-6xl">🔍</div>
    <div className="text-center text-white">
      <h2 className="text-2xl font-bold mb-2">{message}</h2>
      {subMessage && <p className="text-amber-300 text-lg">{subMessage}</p>}
    </div>
    <p className="text-amber-200 text-center max-w-xs">
      Gi enheten til <strong className="text-white">{playerName}</strong> og trykk klar.
    </p>
    <button
      onClick={onReady}
      className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-xl px-10 py-4 rounded-2xl transition-colors focus-visible:ring-4 ring-amber-300 ring-offset-2 mt-4"
    >
      Jeg er klar! 👀
    </button>
  </div>
);
