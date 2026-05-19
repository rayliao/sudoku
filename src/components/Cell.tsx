import { memo } from 'react';
import type { SudokuCell } from '../types';

interface CellProps {
  cell: SudokuCell;
  isSelected: boolean;
  isRelated: boolean;
  isConflict: boolean;
  isSameValue: boolean;
  isDeadEnd: boolean;
  size: number;
  cellSize: number;
  row: number;
  col: number;
  onClick: () => void;
}

export const Cell = memo(function Cell({
  cell,
  isSelected,
  isRelated,
  isConflict,
  isSameValue,
  isDeadEnd,
  size,
  cellSize,
  row,
  col,
  onClick,
}: CellProps) {
  const subGridRows = size === 4 ? 2 : size === 6 ? 2 : 3;
  const subGridCols = size === 4 ? 2 : size === 6 ? 3 : 3;

  const getBorderStyle = () => {
    const baseBorder = '1px solid #d1ccc4';
    const boxBorder = '1px solid #1a1a2e';
    
    const isBoxEdgeTop = row % subGridRows === 0 && row !== 0;
    const isBoxEdgeBottom = (row + 1) % subGridRows === 0 && row !== size - 1;
    const isBoxEdgeLeft = col % subGridCols === 0 && col !== 0;
    const isBoxEdgeRight = (col + 1) % subGridCols === 0 && col !== size - 1;
    
    return {
      top: isBoxEdgeTop ? boxBorder : baseBorder,
      bottom: isBoxEdgeBottom ? boxBorder : baseBorder,
      left: isBoxEdgeLeft ? boxBorder : baseBorder,
      right: isBoxEdgeRight ? boxBorder : baseBorder,
    };
  };
  
  const borderStyles = getBorderStyle();

  const getTextColor = () => {
    if (cell.isFixed) {
      return '#1a1a2e';
    }
    if (isConflict) {
      return '#ea580c';
    }
    if (isDeadEnd) {
      return '#b45309';
    }
    if (cell.value !== null) {
      return '#4a7c59';
    }
    return '#4a5568';
  };

  const getFontWeight = () => {
    if (cell.isFixed) {
      return '400';
    }
    if (cell.value !== null) {
      return '700';
    }
    return '500';
  };

  const getBackgroundColor = () => {
    if (isSelected) {
      return '#fff5f3';
    }
    if (isConflict) {
      return '#fff7ed';
    }
    if (isDeadEnd) {
      return '#fef3c7';
    }
    if (isSameValue && cell.value !== null) {
      return '#fee2e2';
    }
    if (isRelated) {
      return '#f5f0e8';
    }
    return '#ffffff';
  };
  
  const gridStyle: React.CSSProperties = {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${cellSize * 0.5}px`,
    fontWeight: getFontWeight(),
    fontFamily: '"DM Sans", sans-serif',
    backgroundColor: getBackgroundColor(),
    color: getTextColor(),
    borderTop: borderStyles.top,
    borderBottom: borderStyles.bottom,
    borderLeft: borderStyles.left,
    borderRight: borderStyles.right,
    borderTopLeftRadius: row === 0 && col === 0 ? '7px' : '0',
    borderTopRightRadius: row === 0 && col === size - 1 ? '7px' : '0',
    borderBottomLeftRadius: row === size - 1 && col === 0 ? '7px' : '0',
    borderBottomRightRadius: row === size - 1 && col === size - 1 ? '7px' : '0',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
    userSelect: 'none',
  };

  const notesStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${subGridCols}, 1fr)`,
    gridTemplateRows: `repeat(${subGridRows}, 1fr)`,
    width: '100%',
    height: '100%',
    padding: '2px',
  };

  const noteTextStyle: React.CSSProperties = {
    fontSize: `${cellSize * 0.18}px`,
    lineHeight: 1,
    color: '#718096',
    textAlign: 'center',
    fontFamily: '"DM Sans", sans-serif',
  };

  if (cell.notes.length > 0 && cell.value === null) {
    return (
      <div style={gridStyle} onClick={onClick}>
        <div style={notesStyle}>
          {Array.from({ length: size }, (_, i) => {
            const hasNote = cell.notes.includes(i + 1);
            return (
              <span key={i} style={noteTextStyle}>
                {hasNote ? i + 1 : ''}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={gridStyle} onClick={onClick}>
      {cell.value}
    </div>
  );
});
