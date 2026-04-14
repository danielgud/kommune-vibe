interface PassDeviceProps {
  message: string;
  subMessage?: string;
  playerName: string;
  onReady: () => void;
}

export const PassDevice = ({ message, subMessage, playerName, onReady }: PassDeviceProps) => {
  return (
    <div className="fixed inset-0 bg-blue-950 bg-opacity-95 flex flex-col items-center justify-center gap-6 z-50 p-6">
      <div className="text-6xl">🚢</div>
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">{message}</h2>
        {subMessage && <p className="text-blue-300 text-lg">{subMessage}</p>}
      </div>
      <p className="text-blue-200 text-center max-w-xs">
        Gi enheten til <strong className="text-white">{playerName}</strong> og trykk klar når de er klare.
      </p>
      <button
        onClick={onReady}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl px-10 py-4 rounded-2xl transition-colors focus-visible:ring-8 ring-focus ring-offset-2 mt-4"
      >
        Jeg er klar!
      </button>
    </div>
  );
};
