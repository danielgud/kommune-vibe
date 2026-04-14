import { useState } from 'react';
import classNames from 'classnames';
import { Kommune } from './types';

interface SecretPickProps {
  playerName: string;
  kommuner: Kommune[];
  onPicked: (kommune: Kommune) => void;
}

export const SecretPick = ({ playerName, kommuner, onPicked }: SecretPickProps) => {
  const [selected, setSelected] = useState<Kommune | null>(null);

  return (
    <div className="min-h-screen bg-[url('/bg.png')] bg-no-repeat bg-cover flex flex-col items-center p-4 gap-5 pt-8">
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl px-6 py-4 w-full max-w-3xl text-center">
        <h2 className="text-xl font-bold text-amber-800">
          {playerName} — Velg ditt hemmelige kommunevåpen
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Ikke la motstanderen se! Trykk på det du vil holde hemmelig.
        </p>
      </div>

      {/* Grid */}
      <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-4 w-full max-w-3xl">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {kommuner.map(k => {
            const isSelected = selected?.image === k.image;
            return (
              <button
                key={k.image}
                onClick={() => setSelected(k)}
                className={classNames(
                  'flex flex-col items-center rounded-xl p-2 border-2 transition-all duration-150',
                  isSelected
                    ? 'border-amber-400 bg-amber-50 shadow-md scale-105'
                    : 'border-gray-100 hover:border-amber-200 hover:bg-amber-50/50',
                )}
              >
                <img
                  src={k.image}
                  alt={k.navn}
                  className="w-12 h-12 object-contain"
                  loading="lazy"
                />
                <span className="text-[10px] font-semibold text-gray-600 text-center mt-1 leading-tight line-clamp-2">
                  {k.navn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      {selected && (
        <div className="bg-white bg-opacity-97 rounded-2xl shadow-xl px-6 py-4 w-full max-w-3xl flex items-center gap-4 flex-wrap justify-between">
          <div className="flex items-center gap-3">
            <img src={selected.image} alt={selected.navn} className="w-12 h-12 object-contain" />
            <div>
              <p className="text-xs text-gray-400">Valgt</p>
              <p className="font-bold text-gray-800">{selected.navn}</p>
            </div>
          </div>
          <button
            onClick={() => onPicked(selected)}
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-2.5 rounded-xl transition-colors focus-visible:ring-4 ring-amber-300 ring-offset-2 shadow"
          >
            Bekreft ✓
          </button>
        </div>
      )}
    </div>
  );
};
