interface PassDeviceProps {
  message: string;
  subMessage?: string;
  playerName: string;
  onReady: () => void;
}

export const PassDevice = ({ message, subMessage, playerName, onReady }: PassDeviceProps) => {
  return (
    <div className="fixed inset-0 bg-[url('/bg.png')] bg-no-repeat bg-cover flex flex-col items-center justify-center gap-6 z-50 p-6">
      <div className="text-6xl">🚢</div>
      <div className="text-center text-white drop-shadow">
        <h2 className="text-2xl font-bold mb-2">{message}</h2>
        {subMessage && <p className="text-blue-100 text-lg">{subMessage}</p>}
      </div>
      <p className="text-white/80 text-center max-w-xs drop-shadow">
        Gi enheten til <strong className="text-white">{playerName}</strong> og trykk klar når de er klare.
      </p>
      <button
        onClick={onReady}
        className="bg-white hover:bg-blue-50 text-blue-800 font-bold text-xl px-10 py-4 rounded-2xl transition-colors shadow-lg focus-visible:ring-8 ring-focus ring-offset-2 mt-4"
      >
        Jeg er klar!
      </button>
    </div>
  );
};
