import type { SudokuCell, CellPosition } from '../types';

function getSubGridConfig(size: number): { rows: number; cols: number } {
  switch (size) {
    case 4: return { rows: 2, cols: 2 };
    case 6: return { rows: 2, cols: 3 };
    case 9: return { rows: 3, cols: 3 };
    default: return { rows: 3, cols: 3 };
  }
}

export function validateGrid(grid: SudokuCell[][], size: number): boolean {
  const subGrid = getSubGridConfig(size);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j].value !== null) {
        if (!isValidCell(grid, i, j, subGrid)) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function isValidCell(
  grid: SudokuCell[][],
  row: number,
  col: number,
  subGrid: { rows: number; cols: number }
): boolean {
  const size = grid.length;
  const value = grid[row][col].value;
  if (value === null) return true;
  
  for (let i = 0; i < size; i++) {
    if (i !== col && grid[row][i].value === value) return false;
  }
  
  for (let i = 0; i < size; i++) {
    if (i !== row && grid[i][col].value === value) return false;
  }
  
  const boxRowStart = Math.floor(row / subGrid.rows) * subGrid.rows;
  const boxColStart = Math.floor(col / subGrid.cols) * subGrid.cols;
  
  for (let i = 0; i < subGrid.rows; i++) {
    for (let j = 0; j < subGrid.cols; j++) {
      const r = boxRowStart + i;
      const c = boxColStart + j;
      if ((r !== row || c !== col) && grid[r][c].value === value) {
        return false;
      }
    }
  }
  
  return true;
}

export function getRelatedCells(row: number, col: number, size: number): CellPosition[] {
  const subGrid = getSubGridConfig(size);
  const related: CellPosition[] = [];
  
  for (let i = 0; i < size; i++) {
    if (i !== col) related.push({ row, col: i });
  }
  
  for (let i = 0; i < size; i++) {
    if (i !== row) related.push({ row: i, col });
  }
  
  const boxRowStart = Math.floor(row / subGrid.rows) * subGrid.rows;
  const boxColStart = Math.floor(col / subGrid.cols) * subGrid.cols;
  
  for (let i = 0; i < subGrid.rows; i++) {
    for (let j = 0; j < subGrid.cols; j++) {
      const r = boxRowStart + i;
      const c = boxColStart + j;
      if (r !== row || c !== col) {
        const exists = related.some(pos => pos.row === r && pos.col === c);
        if (!exists) related.push({ row: r, col: c });
      }
    }
  }
  
  return related;
}

export function checkConflicts(grid: SudokuCell[][], size: number): Set<string> {
  const conflicts = new Set<string>();
  const subGrid = getSubGridConfig(size);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = grid[i][j].value;
      if (value === null) continue;
      
      if (!isValidCell(grid, i, j, subGrid)) {
        conflicts.add(`${i}-${j}`);
      }
    }
  }
  
  return conflicts;
}

export function isComplete(grid: SudokuCell[][], size: number): boolean {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j].value === null) return false;
    }
  }
  return validateGrid(grid, size);
}
