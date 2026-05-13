import { memo } from 'react';
import type { SudokuCell } from '../types';

interface CellProps {
  cell: SudokuCell;
  isSelected: boolean;
  isRelated: boolean;
  isConflict: boolean;
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
  size,
  cellSize,
  row,
  col,
  onClick,
}: CellProps) {
  const subSize = size === 4 ? 2 : size === 6 ? 2 : 3;
  // 判断是否是宫格的右边界或下边界
  const isBoxEdgeRight = (col + 1) % subSize === 0 && col !== size - 1;
  const isBoxEdgeBottom = (row + 1) % subSize === 0 && row !== size - 1;

  // 边框样式：小宫格之间的边界用深色区分
  const getBorderStyle = () => {
    const baseBorder = '1px solid #d1ccc4';
    const boxBorder = '1px solid #1a1a2e';
    
    // 上边框：如果上一行是宫格边界，则用深色
    const isBoxEdgeTop = row % subSize === 0 && row !== 0;
    // 左边框：如果左一列是宫格边界，则用深色
    const isBoxEdgeLeft = col % subSize === 0 && col !== 0;
    
    return {
      top: isBoxEdgeTop ? boxBorder : baseBorder,
      bottom: isBoxEdgeBottom ? boxBorder : baseBorder,
      left: isBoxEdgeLeft ? boxBorder : baseBorder,
      right: isBoxEdgeRight ? boxBorder : baseBorder,
    };
  };
  
  const borderStyles = getBorderStyle();
  
  const gridStyle: React.CSSProperties = {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${cellSize * 0.5}px`,
    fontWeight: cell.isFixed ? '700' : '500',
    fontFamily: '"DM Sans", sans-serif',
    backgroundColor: isSelected
      ? '#fff5f3'
      : isConflict
        ? '#fff7ed'
        : isRelated
          ? '#f5f0e8'
          : '#ffffff',
    color: cell.isFixed
      ? '#1a1a2e'
      : isConflict
        ? '#ea580c'
        : '#4a5568',
    borderTop: borderStyles.top,
    borderBottom: borderStyles.bottom,
    borderLeft: borderStyles.left,
    borderRight: borderStyles.right,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
    userSelect: 'none',
  };

  const notesStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${subSize}, 1fr)`,
    gridTemplateRows: `repeat(${subSize}, 1fr)`,
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
