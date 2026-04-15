import { useEffect, useState } from 'react';

interface PassDeviceProps {
  message: string;
  subMessage?: string;
  playerName: string;
  autoAdvanceMs?: number;
  onReady: () => void;
}

export const PassDevice = ({ message, subMessage, playerName, autoAdvanceMs, onReady }: PassDeviceProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!autoAdvanceMs) return;

    const interval = 50;
    const steps = autoAdvanceMs / interval;
    const decrement = 100 / steps;
    let current = 100;

    const timer = setInterval(() => {
      current -= decrement;
      setProgress(Math.max(0, current));
      if (current <= 0) {
        clearInterval(timer);
        onReady();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [autoAdvanceMs, onReady]);

  return (
    <div className="fixed inset-0 bg-[url('/bg.png')] bg-no-repeat bg-cover flex flex-col items-center justify-center gap-6 z-50 p-6">
      <div className="text-6xl">🚢</div>
      <div className="text-center text-white drop-shadow">
        <h2 className="text-2xl font-bold mb-2">{message}</h2>
        {subMessage && <p className="text-blue-100 text-lg">{subMessage}</p>}
      </div>

      {autoAdvanceMs ? (
        // Auto-advance mode: show progress bar + skip button
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-white rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={onReady}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Hopp over →
          </button>
        </div>
      ) : (
        // Manual mode: require button press (used for device hand-off during placement)
        <>
          <p className="text-white/80 text-center max-w-xs drop-shadow">
            Gi enheten til <strong className="text-white">{playerName}</strong> og trykk klar når de er klare.
          </p>
          <button
            onClick={onReady}
            className="bg-white hover:bg-blue-50 text-blue-800 font-bold text-xl px-10 py-4 rounded-2xl transition-colors shadow-lg focus-visible:ring-8 ring-focus ring-offset-2 mt-4"
          >
            Jeg er klar!
          </button>
        </>
      )}
    </div>
  );
};
