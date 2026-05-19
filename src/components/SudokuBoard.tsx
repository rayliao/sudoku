import { useMemo } from 'react';
import { Cell } from './Cell';
import type { SudokuCell, CellPosition, Difficulty } from '../types';
import { getRelatedCells, checkConflicts } from '../utils/validator';

interface SudokuBoardProps {
  grid: SudokuCell[][];
  selectedCell: CellPosition | null;
  selectedValue: number | null;
  size: Difficulty;
  boardSize: number;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuBoard({
  grid,
  selectedCell,
  selectedValue,
  size,
  boardSize,
  onCellClick,
}: SudokuBoardProps) {
  const cellSize = Math.floor(boardSize / size);

  const relatedCells = useMemo(() => {
    if (!selectedCell) return new Set<string>();
    const related = getRelatedCells(selectedCell.row, selectedCell.col, size);
    return new Set(related.map(pos => `${pos.row}-${pos.col}`));
  }, [selectedCell, size]);

  const conflicts = useMemo(() => {
    return checkConflicts(grid, size);
  }, [grid, size]);

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '2px',
    boxShadow: '0 10px 40px rgba(26, 26, 46, 0.3)',
    width: 'fit-content',
  };

  if (grid.length === 0) return null;

  return (
    <div style={containerStyle}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            isSelected={
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            }
            isRelated={relatedCells.has(`${rowIndex}-${colIndex}`)}
            isConflict={conflicts.has(`${rowIndex}-${colIndex}`)}
            isSameValue={selectedValue !== null && cell.value === selectedValue}
            isDeadEnd={!!cell.isDeadEnd}
            size={size}
            cellSize={cellSize}
            row={rowIndex}
            col={colIndex}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
