import type { SudokuCell, CellPosition, Difficulty } from '../types';
import type { GameMode } from '../components/ControlButtons';

function getSubGridConfig(size: Difficulty): { rows: number; cols: number } {
  switch (size) {
    case 4: return { rows: 2, cols: 2 };
    case 6: return { rows: 2, cols: 3 };
    case 9: return { rows: 3, cols: 3 };
  }
}

export function generateSudoku(size: Difficulty, gameMode: GameMode = 'normal'): { puzzle: SudokuCell[][]; solution: number[][] } {
  const grid: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
  const subGrid = getSubGridConfig(size);
  
  const fillGrid = (row: number, col: number): boolean => {
    if (row === size) return true;
    if (col === size) return fillGrid(row + 1, 0);
    
    const nums = shuffleArray([...Array(size)].map((_, i) => i + 1));
    
    for (const num of nums) {
      if (isValidPlacement(grid, row, col, num, subGrid)) {
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
  subGrid: { rows: number; cols: number }
): boolean {
  const size = grid.length;
  
  for (let i = 0; i < size; i++) {
    if (grid[row][i] === num) return false;
  }
  
  for (let i = 0; i < size; i++) {
    if (grid[i][col] === num) return false;
  }
  
  const boxRowStart = Math.floor(row / subGrid.rows) * subGrid.rows;
  const boxColStart = Math.floor(col / subGrid.cols) * subGrid.cols;
  
  for (let i = 0; i < subGrid.rows; i++) {
    for (let j = 0; j < subGrid.cols; j++) {
      if (grid[boxRowStart + i][boxColStart + j] === num) return false;
    }
  }
  
  return true;
}

function countSolutions(grid: number[][], subGrid: { rows: number; cols: number }, maxCount: number = 2): number {
  const size = grid.length;
  let count = 0;
  
  const solve = (): boolean => {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= size; num++) {
            if (isValidPlacement(grid, row, col, num, subGrid)) {
              grid[row][col] = num;
              if (solve()) {
                if (count >= maxCount) {
                  grid[row][col] = 0;
                  return true;
                }
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= maxCount;
  };
  
  solve();
  return count;
}

function createPuzzle(grid: number[][], size: Difficulty, gameMode: GameMode): SudokuCell[][] {
  const subGrid = getSubGridConfig(size);
  const totalCells = size * size;
  
  const modeHintCounts: Record<Difficulty, Record<GameMode, { min: number; max: number }>> = {
    4: {
      normal: { min: 10, max: 12 },
      hard: { min: 7, max: 9 },
      hell: { min: 5, max: 6 },
    },
    6: {
      normal: { min: 22, max: 28 },
      hard: { min: 16, max: 20 },
      hell: { min: 12, max: 15 },
    },
    9: {
      normal: { min: 32, max: 40 },
      hard: { min: 22, max: 30 },
      hell: { min: 17, max: 21 },
    },
  };
  
  const hints = modeHintCounts[size][gameMode];
  const targetHints = Math.floor(
    Math.random() * (hints.max - hints.min + 1) + hints.min
  );
  
  const positions: [number, number][] = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push([i, j]);
    }
  }
  
  const shuffledPositions = shuffleArray(positions);
  const puzzleGrid = grid.map(row => [...row]);
  
  const cellsToRemove = totalCells - targetHints;
  let removedCount = 0;
  
  for (const [row, col] of shuffledPositions) {
    if (removedCount >= cellsToRemove) break;
    
    const backup = puzzleGrid[row][col];
    puzzleGrid[row][col] = 0;
    
    const testGrid = puzzleGrid.map(r => [...r]);
    const solutions = countSolutions(testGrid, subGrid, 2);
    
    if (solutions === 1) {
      removedCount++;
    } else {
      puzzleGrid[row][col] = backup;
    }
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
