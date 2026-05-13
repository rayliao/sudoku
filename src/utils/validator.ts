import type { SudokuCell, CellPosition } from '../types';

export function validateGrid(grid: SudokuCell[][], size: number): boolean {
  const subSize = size === 4 ? 2 : size === 6 ? 2 : 3;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j].value !== null) {
        if (!isValidCell(grid, i, j, size, subSize)) {
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
  size: number,
  subSize: number
): boolean {
  const value = grid[row][col].value;
  if (value === null) return true;
  
  for (let i = 0; i < size; i++) {
    if (i !== col && grid[row][i].value === value) return false;
  }
  
  for (let i = 0; i < size; i++) {
    if (i !== row && grid[i][col].value === value) return false;
  }
  
  const boxRowStart = Math.floor(row / subSize) * subSize;
  const boxColStart = Math.floor(col / subSize) * subSize;
  
  for (let i = 0; i < subSize; i++) {
    for (let j = 0; j < subSize; j++) {
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
  const subSize = size === 4 ? 2 : size === 6 ? 2 : 3;
  const related: CellPosition[] = [];
  
  for (let i = 0; i < size; i++) {
    if (i !== col) related.push({ row, col: i });
  }
  
  for (let i = 0; i < size; i++) {
    if (i !== row) related.push({ row: i, col });
  }
  
  const boxRowStart = Math.floor(row / subSize) * subSize;
  const boxColStart = Math.floor(col / subSize) * subSize;
  
  for (let i = 0; i < subSize; i++) {
    for (let j = 0; j < subSize; j++) {
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
  const subSize = size === 4 ? 2 : size === 6 ? 2 : 3;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = grid[i][j].value;
      if (value === null) continue;
      
      if (!isValidCell(grid, i, j, size, subSize)) {
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
