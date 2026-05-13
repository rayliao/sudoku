import type { SudokuCell, CellPosition, Difficulty } from '../types';
import type { GameMode } from '../components/ControlButtons';

export function generateSudoku(size: Difficulty, gameMode: GameMode = 'normal'): { puzzle: SudokuCell[][]; solution: number[][] } {
  const grid: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
  const subSize = size === 4 ? 2 : size === 6 ? 2 : 3;
  
  const fillGrid = (row: number, col: number): boolean => {
    if (row === size) return true;
    if (col === size) return fillGrid(row + 1, 0);
    
    const nums = shuffleArray([...Array(size)].map((_, i) => i + 1));
    
    for (const num of nums) {
      if (isValidPlacement(grid, row, col, num, size, subSize)) {
        grid[row][col] = num;
        if (fillGrid(row, col + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  };
  
  fillGrid(0, 0);
  
  const solution = grid.map(row => [...row]);
  const puzzle = createPuzzle(grid, size, gameMode);
  
  return { puzzle, solution };
}

function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  size: number,
  subSize: number
): boolean {
  for (let i = 0; i < size; i++) {
    if (grid[row][i] === num) return false;
  }
  
  for (let i = 0; i < size; i++) {
    if (grid[i][col] === num) return false;
  }
  
  const boxRowStart = Math.floor(row / subSize) * subSize;
  const boxColStart = Math.floor(col / subSize) * subSize;
  
  for (let i = 0; i < subSize; i++) {
    for (let j = 0; j < subSize; j++) {
      if (grid[boxRowStart + i][boxColStart + j] === num) return false;
    }
  }
  
  return true;
}

function createPuzzle(grid: number[][], size: Difficulty, gameMode: GameMode): SudokuCell[][] {
  const modeMultiplier = gameMode === 'normal' ? 0.5 : gameMode === 'hard' ? 0.7 : 0.85;
  const totalCells = size * size;
  const cellsToRemove = Math.floor(totalCells * modeMultiplier);
  const positions: [number, number][] = [];
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push([i, j]);
    }
  }
  
  const shuffledPositions = shuffleArray(positions);
  const removeCount = Math.min(cellsToRemove, shuffledPositions.length);
  
  const puzzleGrid = grid.map(row => [...row]);
  
  for (let i = 0; i < removeCount; i++) {
    const [row, col] = shuffledPositions[i];
    puzzleGrid[row][col] = 0;
  }
  
  return puzzleGrid.map(row =>
    row.map(value => ({
      value: value === 0 ? null : value,
      isFixed: value !== 0,
      isValid: true,
      notes: [],
    }))
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getHint(grid: SudokuCell[][], solution: number[][]): CellPosition | null {
  const size = grid.length;
  const emptyCells: CellPosition[] = [];
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j].value === null) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  
  if (emptyCells.length === 0) return null;
  
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}
