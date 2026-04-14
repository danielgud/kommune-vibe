import classNames from 'classnames';
import { COL_LABELS, ROW_LABELS } from './constants';

export type CellVariant =
  | 'ocean'        // untouched water
  | 'ship'         // own ship
  | 'hit'          // ship that was hit
  | 'miss'         // shot that missed
  | 'preview-ok'   // valid placement preview
  | 'preview-bad'  // invalid placement preview
  | 'target';      // enemy cell, not yet shot (hoverable)

interface GridProps {
  cellSize?: number; // px, default 32
  getVariant: (row: number, col: number) => CellVariant;
  onCellClick?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  onMouseLeave?: () => void;
  /** Keys "row,col" of cells currently playing the hit animation */
  animatingHits?: Set<string>;
}

const VARIANT_CLASSES: Record<CellVariant, string> = {
  ocean:         'bg-sky-800',
  ship:          'bg-slate-500',
  hit:           'bg-orange-500',
  miss:          'bg-slate-700',
  'preview-ok':  'bg-emerald-500',
  'preview-bad': 'bg-red-500',
  target:        'bg-sky-800 hover:bg-sky-600 cursor-pointer',
};

const CELL_CONTENT: Record<CellVariant, string> = {
  ocean:         '',
  ship:          '',
  hit:           '✕',
  miss:          '·',
  'preview-ok':  '',
  'preview-bad': '',
  target:        '',
};

export const Grid = ({
  cellSize = 32,
  getVariant,
  onCellClick,
  onCellHover,
  onMouseLeave,
  animatingHits,
}: GridProps) => {
  const labelSize = Math.round(cellSize * 0.625);

  return (
    <div className="select-none" onMouseLeave={onMouseLeave}>
      {/* Column labels */}
      <div className="flex mb-0.5" style={{ paddingLeft: labelSize }}>
        {COL_LABELS.map(l => (
          <div
            key={l}
            className="text-center text-xs font-mono font-semibold text-slate-500 shrink-0"
            style={{ width: cellSize }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: 10 }, (_, row) => (
        <div key={row} className="flex items-center mb-px">
          {/* Row label */}
          <div
            className="text-right text-xs font-mono font-semibold text-slate-500 pr-1 shrink-0"
            style={{ width: labelSize }}
          >
            {ROW_LABELS[row]}
          </div>

          {/* Cells — gap-px on slate-700 background = 1px grid lines.
              No overflow-hidden so the scale-burst animation isn't clipped. */}
          <div className="flex gap-px bg-slate-700 rounded-sm">
            {Array.from({ length: 10 }, (_, col) => {
              const variant = getVariant(row, col);
              const isExploding = animatingHits?.has(`${row},${col}`) ?? false;
              return (
                <button
                  key={col}
                  className={classNames(
                    'flex items-center justify-center shrink-0 text-white font-bold',
                    // Only apply colour transition when not animating
                    !isExploding && 'transition-colors duration-75',
                    VARIANT_CLASSES[variant],
                    isExploding && 'cell-explode',
                  )}
                  style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.45 }}
                  onClick={() => onCellClick?.(row, col)}
                  onMouseEnter={() => onCellHover?.(row, col)}
                  disabled={!onCellClick}
                  aria-label={`${COL_LABELS[col]}${ROW_LABELS[row]}`}
                >
                  {CELL_CONTENT[variant]}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
