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
  let foundEnough = false;
  
  const solve = (): void => {
    if (foundEnough) return;
    
    for (let row = 0; row < size && !foundEnough; row++) {
      for (let col = 0; col < size && !foundEnough; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= size && !foundEnough; num++) {
            if (isValidPlacement(grid, row, col, num, subGrid)) {
              grid[row][col] = num;
              solve();
              grid[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
    if (count >= maxCount) {
      foundEnough = true;
    }
  };
  
  solve();
  return count;
}

// 检查题目是否需要进阶技巧才能解出
function requiresAdvancedTechniques(
  grid: number[][],
  size: number,
  subGrid: { rows: number; cols: number }
): boolean {
  // 创建一个模拟的 SudokuCell 网格
  const cellGrid: SudokuCell[][] = grid.map(row =>
    row.map(value => ({
      value: value === 0 ? null : value,
      isFixed: value !== 0,
      isValid: true,
      notes: [],
    }))
  );
  
  // 尝试用基础技巧解题
  let changed = true;
  let iterations = 0;
  const maxIterations = 100;
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    
    // 尝试余数法
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (cellGrid[row][col].value !== null) continue;
        const possible = getPossibleNumbers(cellGrid, row, col, subGrid);
        if (possible.length === 1) {
          cellGrid[row][col].value = possible[0];
          changed = true;
        }
      }
    }
    
    if (changed) continue;
    
    // 尝试行摒除
    for (let num = 1; num <= size; num++) {
      for (let row = 0; row < size; row++) {
        let positions: CellPosition[] = [];
        for (let col = 0; col < size; col++) {
          if (cellGrid[row][col].value !== null) continue;
          const possible = getPossibleNumbers(cellGrid, row, col, subGrid);
          if (possible.includes(num)) {
            positions.push({ row, col });
          }
        }
        if (positions.length === 1) {
          cellGrid[positions[0].row][positions[0].col].value = num;
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
    
    if (changed) continue;
    
    // 尝试列摒除
    for (let num = 1; num <= size; num++) {
      for (let col = 0; col < size; col++) {
        let positions: CellPosition[] = [];
        for (let row = 0; row < size; row++) {
          if (cellGrid[row][col].value !== null) continue;
          const possible = getPossibleNumbers(cellGrid, row, col, subGrid);
          if (possible.includes(num)) {
            positions.push({ row, col });
          }
        }
        if (positions.length === 1) {
          cellGrid[positions[0].row][positions[0].col].value = num;
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
    
    if (changed) continue;
    
    // 尝试宫摒除
    for (let num = 1; num <= size; num++) {
      for (let boxRow = 0; boxRow < size; boxRow += subGrid.rows) {
        for (let boxCol = 0; boxCol < size; boxCol += subGrid.cols) {
          let positions: CellPosition[] = [];
          
          for (let i = 0; i < subGrid.rows; i++) {
            for (let j = 0; j < subGrid.cols; j++) {
              const row = boxRow + i;
              const col = boxCol + j;
              if (cellGrid[row][col].value !== null) continue;
              
              const possible = getPossibleNumbers(cellGrid, row, col, subGrid);
              if (possible.includes(num)) {
                positions.push({ row, col });
              }
            }
          }
          
          if (positions.length === 1) {
            cellGrid[positions[0].row][positions[0].col].value = num;
            changed = true;
            break;
          }
        }
        if (changed) break;
      }
      if (changed) break;
    }
  }
  
  // 如果还有空格没填，说明需要进阶技巧
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (cellGrid[row][col].value === null) {
        return true;
      }
    }
  }
  
  return false;
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
  
  // 地狱模式：尝试生成需要进阶技巧的题目
  if (gameMode === 'hell' && size === 9) {
    // 尝试多次生成，找到一个需要进阶技巧的
    for (let attempt = 0; attempt < 20; attempt++) {
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
      
      // 检查是否需要进阶技巧
      if (requiresAdvancedTechniques(puzzleGrid, size, subGrid)) {
        return puzzleGrid.map(row =>
          row.map(value => ({
            value: value === 0 ? null : value,
            isFixed: value !== 0,
            isValid: true,
            notes: [],
          }))
        );
      }
    }
    
    // 如果20次都失败，使用最少提示数生成一个
    console.warn('Could not generate puzzle requiring advanced techniques, falling back to minimum hints');
  }
  
  // 普通生成逻辑
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

function getPossibleNumbers(
  grid: SudokuCell[][],
  row: number,
  col: number,
  subGrid: { rows: number; cols: number }
): number[] {
  const size = grid.length;
  const possible: number[] = [];
  
  for (let num = 1; num <= size; num++) {
    let valid = true;
    
    // Check row
    for (let i = 0; i < size; i++) {
      if (grid[row][i].value === num) {
        valid = false;
        break;
      }
    }
    
    if (valid) {
      // Check column
      for (let i = 0; i < size; i++) {
        if (grid[i][col].value === num) {
          valid = false;
          break;
        }
      }
    }
    
    if (valid) {
      // Check subgrid
      const boxRowStart = Math.floor(row / subGrid.rows) * subGrid.rows;
      const boxColStart = Math.floor(col / subGrid.cols) * subGrid.cols;
      
      for (let i = 0; i < subGrid.rows; i++) {
        for (let j = 0; j < subGrid.cols; j++) {
          if (grid[boxRowStart + i][boxColStart + j].value === num) {
            valid = false;
            break;
          }
        }
        if (!valid) break;
      }
    }
    
    if (valid) {
      possible.push(num);
    }
  }
  
  return possible;
}

export interface HintInfo {
  row: number;
  col: number;
  number: number;
  method: string;
  description: string;
}

// 获取所有空格的候选数
function getAllCandidates(
  grid: SudokuCell[][],
  size: number,
  subGrid: { rows: number; cols: number }
): Map<string, number[]> {
  const candidates = new Map<string, number[]>();
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col].value === null) {
        const possible = getPossibleNumbers(grid, row, col, subGrid);
        candidates.set(`${row},${col}`, possible);
      }
    }
  }
  return candidates;
}

export function findHint(grid: SudokuCell[][], solution: number[][], size: Difficulty): HintInfo | null {
  const subGrid = getSubGridConfig(size);
  
  // 1. 余数法（唯余法）—— 找"格子"能填的数字
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col].value !== null) continue;
      
      const possible = getPossibleNumbers(grid, row, col, subGrid);
      if (possible.length === 1) {
        const existingNumbers = new Set<number>();
        
        for (let i = 0; i < size; i++) {
          if (grid[row][i].value !== null) existingNumbers.add(grid[row][i].value!);
        }
        for (let i = 0; i < size; i++) {
          if (grid[i][col].value !== null) existingNumbers.add(grid[i][col].value!);
        }
        const boxRowStart = Math.floor(row / subGrid.rows) * subGrid.rows;
        const boxColStart = Math.floor(col / subGrid.cols) * subGrid.cols;
        for (let i = 0; i < subGrid.rows; i++) {
          for (let j = 0; j < subGrid.cols; j++) {
            const val = grid[boxRowStart + i][boxColStart + j].value;
            if (val !== null) existingNumbers.add(val);
          }
        }
        
        const filledCount = existingNumbers.size;
        
        return {
          row,
          col,
          number: possible[0],
          method: '余数法（唯余法）',
          description: `第 ${row + 1} 行第 ${col + 1} 列的格子，其所在的行、列、宫格中已经出现了 ${filledCount} 个不同的数字（${Array.from(existingNumbers).sort((a, b) => a - b).join('、')}），因此这个格子只能填入剩下的唯一数字 ${possible[0]}。`
        };
      }
    }
  }
  
  // 2. 摒除法（排除法）—— 找"数字"安放的位置
  // 2.1 行摒除
  for (let num = 1; num <= size; num++) {
    for (let row = 0; row < size; row++) {
      let positions: CellPosition[] = [];
      for (let col = 0; col < size; col++) {
        if (grid[row][col].value !== null) continue;
        const possible = getPossibleNumbers(grid, row, col, subGrid);
        if (possible.includes(num)) {
          positions.push({ row, col });
        }
      }
      if (positions.length === 1) {
        return {
          row: positions[0].row,
          col: positions[0].col,
          number: num,
          method: '摒除法（行摒除）',
          description: `在第 ${row + 1} 行中，数字 ${num} 只能填入第 ${positions[0].col + 1} 列。因为该行其他空格都因为同行、同列或同宫格中已有 ${num} 而被排除。`
        };
      }
    }
  }
  
  // 2.2 列摒除
  for (let num = 1; num <= size; num++) {
    for (let col = 0; col < size; col++) {
      let positions: CellPosition[] = [];
      for (let row = 0; row < size; row++) {
        if (grid[row][col].value !== null) continue;
        const possible = getPossibleNumbers(grid, row, col, subGrid);
        if (possible.includes(num)) {
          positions.push({ row, col });
        }
      }
      if (positions.length === 1) {
        return {
          row: positions[0].row,
          col: positions[0].col,
          number: num,
          method: '摒除法（列摒除）',
          description: `在第 ${col + 1} 列中，数字 ${num} 只能填入第 ${positions[0].row + 1} 行。因为该列其他空格都因为同行、同列或同宫格中已有 ${num} 而被排除。`
        };
      }
    }
  }
  
  // 2.3 宫摒除
  for (let num = 1; num <= size; num++) {
    for (let boxRow = 0; boxRow < size; boxRow += subGrid.rows) {
      for (let boxCol = 0; boxCol < size; boxCol += subGrid.cols) {
        let positions: CellPosition[] = [];
        
        for (let i = 0; i < subGrid.rows; i++) {
          for (let j = 0; j < subGrid.cols; j++) {
            const row = boxRow + i;
            const col = boxCol + j;
            if (grid[row][col].value !== null) continue;
            
            const possible = getPossibleNumbers(grid, row, col, subGrid);
            if (possible.includes(num)) {
              positions.push({ row, col });
            }
          }
        }
        
        if (positions.length === 1) {
          const boxRowNum = Math.floor(boxRow / subGrid.rows) + 1;
          const boxColNum = Math.floor(boxCol / subGrid.cols) + 1;
          return {
            row: positions[0].row,
            col: positions[0].col,
            number: num,
            method: '摒除法（宫摒除）',
            description: `在第 ${boxRowNum} 行、第 ${boxColNum} 列的宫格中，数字 ${num} 只能填入第 ${positions[0].row + 1} 行第 ${positions[0].col + 1} 列。因为该宫格其他空格都因为同行、同列或同宫格中已有 ${num} 而被排除。`
          };
        }
      }
    }
  }
  
  // 3. 进阶技巧 - 需要候选数分析
  // 先计算所有空格的候选数
  const allCandidates = getAllCandidates(grid, size, subGrid);
  
  // 3.1 区块摒除法（Locked Candidates）
  // 检查每个宫格，如果某个数字只能出现在该宫格的某一行或某一列
  // 然后找到因这个排除而候选数减少为1的格子
  for (let num = 1; num <= size; num++) {
    for (let boxRow = 0; boxRow < size; boxRow += subGrid.rows) {
      for (let boxCol = 0; boxCol < size; boxCol += subGrid.cols) {
        const numPositions: CellPosition[] = [];
        
        for (let i = 0; i < subGrid.rows; i++) {
          for (let j = 0; j < subGrid.cols; j++) {
            const row = boxRow + i;
            const col = boxCol + j;
            if (grid[row][col].value !== null) continue;
            
            const candidates = allCandidates.get(`${row},${col}`);
            if (candidates && candidates.includes(num)) {
              numPositions.push({ row, col });
            }
          }
        }
        
        if (numPositions.length >= 2) {
          // 检查是否都在同一行
          const allSameRow = numPositions.every(p => p.row === numPositions[0].row);
          // 检查是否都在同一列
          const allSameCol = numPositions.every(p => p.col === numPositions[0].col);
          
          if (allSameRow) {
            const row = numPositions[0].row;
            const boxRowNum = Math.floor(boxRow / subGrid.rows) + 1;
            const boxColNum = Math.floor(boxCol / subGrid.cols) + 1;
            
            // 检查该行其他宫格中是否有空格因排除num而候选数变为1
            for (let col = 0; col < size; col++) {
              if (grid[row][col].value !== null) continue;
              // 检查是否在当前宫格外
              const colBoxStart = Math.floor(col / subGrid.cols) * subGrid.cols;
              if (colBoxStart === boxCol) continue; // 在同一宫格，跳过
              
              const candidates = allCandidates.get(`${row},${col}`);
              if (candidates && candidates.includes(num)) {
                // 模拟排除num后的候选数
                const newCandidates = candidates.filter(n => n !== num);
                if (newCandidates.length === 1) {
                  // 找到了！这个格子因区块摒除而候选数变为1
                  return {
                    row,
                    col,
                    number: newCandidates[0],
                    method: '区块摒除法',
                    description: `在第 ${boxRowNum} 行、第 ${boxColNum} 列的宫格中，数字 ${num} 只能出现在第 ${row + 1} 行。这意味着数字 ${num} 占据了该行在这个宫格中的位置，因此第 ${row + 1} 行第 ${col + 1} 列可以排除候选数 ${num}。排除后，该格子只剩下唯一候选数 ${newCandidates[0]}。`
                  };
                }
              }
            }
          }
          
          if (allSameCol) {
            const col = numPositions[0].col;
            const boxRowNum = Math.floor(boxRow / subGrid.rows) + 1;
            const boxColNum = Math.floor(boxCol / subGrid.cols) + 1;
            
            // 检查该列其他宫格中是否有空格因排除num而候选数变为1
            for (let row = 0; row < size; row++) {
              if (grid[row][col].value !== null) continue;
              // 检查是否在当前宫格外
              const rowBoxStart = Math.floor(row / subGrid.rows) * subGrid.rows;
              if (rowBoxStart === boxRow) continue; // 在同一宫格，跳过
              
              const candidates = allCandidates.get(`${row},${col}`);
              if (candidates && candidates.includes(num)) {
                // 模拟排除num后的候选数
                const newCandidates = candidates.filter(n => n !== num);
                if (newCandidates.length === 1) {
                  // 找到了！这个格子因区块摒除而候选数变为1
                  return {
                    row,
                    col,
                    number: newCandidates[0],
                    method: '区块摒除法',
                    description: `在第 ${boxRowNum} 行、第 ${boxColNum} 列的宫格中，数字 ${num} 只能出现在第 ${col + 1} 列。这意味着数字 ${num} 占据了该列在这个宫格中的位置，因此第 ${row + 1} 行第 ${col + 1} 列可以排除候选数 ${num}。排除后，该格子只剩下唯一候选数 ${newCandidates[0]}。`
                  };
                }
              }
            }
          }
        }
      }
    }
  }
  
  // 3.2 显性数对（Naked Pair）
  // 检查行、列、宫格中的显性数对，找到因排除而候选数变为1的格子
  // 检查行
  for (let row = 0; row < size; row++) {
    const rowCells: { col: number; candidates: number[] }[] = [];
    for (let col = 0; col < size; col++) {
      if (grid[row][col].value !== null) continue;
      const candidates = allCandidates.get(`${row},${col}`);
      if (candidates && candidates.length === 2) {
        rowCells.push({ col, candidates });
      }
    }
    
    for (let i = 0; i < rowCells.length; i++) {
      for (let j = i + 1; j < rowCells.length; j++) {
        const cell1 = rowCells[i];
        const cell2 = rowCells[j];
        
        if (cell1.candidates[0] === cell2.candidates[0] && 
            cell1.candidates[1] === cell2.candidates[1]) {
          const num1 = cell1.candidates[0];
          const num2 = cell1.candidates[1];
          
          // 检查该行其他格子是否因排除num1/num2而候选数变为1
          for (let col = 0; col < size; col++) {
            if (col === cell1.col || col === cell2.col) continue;
            if (grid[row][col].value !== null) continue;
            
            const candidates = allCandidates.get(`${row},${col}`);
            if (candidates && (candidates.includes(num1) || candidates.includes(num2))) {
              const newCandidates = candidates.filter(n => n !== num1 && n !== num2);
              if (newCandidates.length === 1) {
                return {
                  row,
                  col,
                  number: newCandidates[0],
                  method: '显性数对（Naked Pair）',
                  description: `在第 ${row + 1} 行中，第 ${cell1.col + 1} 列和第 ${cell2.col + 1} 列的两个格子候选数都是 [${num1}, ${num2}]。这意味着这两个格子必然一个填 ${num1}，一个填 ${num2}。因此第 ${row + 1} 行第 ${col + 1} 列可以排除候选数 ${num1} 和 ${num2}，排除后只剩下唯一候选数 ${newCandidates[0]}。`
                };
              }
            }
          }
        }
      }
    }
  }
  
  // 检查列
  for (let col = 0; col < size; col++) {
    const colCells: { row: number; candidates: number[] }[] = [];
    for (let row = 0; row < size; row++) {
      if (grid[row][col].value !== null) continue;
      const candidates = allCandidates.get(`${row},${col}`);
      if (candidates && candidates.length === 2) {
        colCells.push({ row, candidates });
      }
    }
    
    for (let i = 0; i < colCells.length; i++) {
      for (let j = i + 1; j < colCells.length; j++) {
        const cell1 = colCells[i];
        const cell2 = colCells[j];
        
        if (cell1.candidates[0] === cell2.candidates[0] && 
            cell1.candidates[1] === cell2.candidates[1]) {
          const num1 = cell1.candidates[0];
          const num2 = cell1.candidates[1];
          
          // 检查该列其他格子是否因排除num1/num2而候选数变为1
          for (let row = 0; row < size; row++) {
            if (row === cell1.row || row === cell2.row) continue;
            if (grid[row][col].value !== null) continue;
            
            const candidates = allCandidates.get(`${row},${col}`);
            if (candidates && (candidates.includes(num1) || candidates.includes(num2))) {
              const newCandidates = candidates.filter(n => n !== num1 && n !== num2);
              if (newCandidates.length === 1) {
                return {
                  row,
                  col,
                  number: newCandidates[0],
                  method: '显性数对（Naked Pair）',
                  description: `在第 ${col + 1} 列中，第 ${cell1.row + 1} 行和第 ${cell2.row + 1} 行的两个格子候选数都是 [${num1}, ${num2}]。这意味着这两个格子必然一个填 ${num1}，一个填 ${num2}。因此第 ${row + 1} 行第 ${col + 1} 列可以排除候选数 ${num1} 和 ${num2}，排除后只剩下唯一候选数 ${newCandidates[0]}。`
                };
              }
            }
          }
        }
      }
    }
  }
  
  // 检查宫格
  for (let boxRow = 0; boxRow < size; boxRow += subGrid.rows) {
    for (let boxCol = 0; boxCol < size; boxCol += subGrid.cols) {
      const boxCells: { row: number; col: number; candidates: number[] }[] = [];
      
      for (let i = 0; i < subGrid.rows; i++) {
        for (let j = 0; j < subGrid.cols; j++) {
          const row = boxRow + i;
          const col = boxCol + j;
          if (grid[row][col].value !== null) continue;
          
          const candidates = allCandidates.get(`${row},${col}`);
          if (candidates && candidates.length === 2) {
            boxCells.push({ row, col, candidates });
          }
        }
      }
      
      for (let i = 0; i < boxCells.length; i++) {
        for (let j = i + 1; j < boxCells.length; j++) {
          const cell1 = boxCells[i];
          const cell2 = boxCells[j];
          
          if (cell1.candidates[0] === cell2.candidates[0] && 
              cell1.candidates[1] === cell2.candidates[1]) {
            const num1 = cell1.candidates[0];
            const num2 = cell1.candidates[1];
            
            // 检查该宫格其他格子是否因排除num1/num2而候选数变为1
            for (let i2 = 0; i2 < subGrid.rows; i2++) {
              for (let j2 = 0; j2 < subGrid.cols; j2++) {
                const row = boxRow + i2;
                const col = boxCol + j2;
                if ((row === cell1.row && col === cell1.col) || 
                    (row === cell2.row && col === cell2.col)) continue;
                if (grid[row][col].value !== null) continue;
                
                const candidates = allCandidates.get(`${row},${col}`);
                if (candidates && (candidates.includes(num1) || candidates.includes(num2))) {
                  const newCandidates = candidates.filter(n => n !== num1 && n !== num2);
                  if (newCandidates.length === 1) {
                    const boxRowNum = Math.floor(boxRow / subGrid.rows) + 1;
                    const boxColNum = Math.floor(boxCol / subGrid.cols) + 1;
                    return {
                      row,
                      col,
                      number: newCandidates[0],
                      method: '显性数对（Naked Pair）',
                      description: `在第 ${boxRowNum} 行、第 ${boxColNum} 列的宫格中，第 ${cell1.row + 1} 行第 ${cell1.col + 1} 列和第 ${cell2.row + 1} 行第 ${cell2.col + 1} 列的两个格子候选数都是 [${num1}, ${num2}]。这意味着这两个格子必然一个填 ${num1}，一个填 ${num2}。因此第 ${row + 1} 行第 ${col + 1} 列可以排除候选数 ${num1} 和 ${num2}，排除后只剩下唯一候选数 ${newCandidates[0]}。`
                    };
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  // 3.3 隐性数对（Hidden Pair）
  // 检查行中的隐性数对，找到因排除而候选数变为1的格子
  for (let row = 0; row < size; row++) {
    const numPositions = new Map<number, number[]>(); // num -> [cols]
    
    for (let col = 0; col < size; col++) {
      if (grid[row][col].value !== null) continue;
      const candidates = allCandidates.get(`${row},${col}`);
      if (candidates) {
        for (const num of candidates) {
          if (!numPositions.has(num)) numPositions.set(num, []);
          numPositions.get(num)!.push(col);
        }
      }
    }
    
    const numsInTwoCells: number[] = [];
    for (const [num, cols] of numPositions) {
      if (cols.length === 2) numsInTwoCells.push(num);
    }
    
    for (let i = 0; i < numsInTwoCells.length; i++) {
      for (let j = i + 1; j < numsInTwoCells.length; j++) {
        const num1 = numsInTwoCells[i];
        const num2 = numsInTwoCells[j];
        const cols1 = numPositions.get(num1)!;
        const cols2 = numPositions.get(num2)!;
        
        if (cols1[0] === cols2[0] && cols1[1] === cols2[1]) {
          const col1 = cols1[0];
          const col2 = cols1[1];
          
          // 检查这两个格子是否因排除其他候选数而变为1
          const candidates1 = allCandidates.get(`${row},${col1}`);
          const candidates2 = allCandidates.get(`${row},${col2}`);
          
          if (candidates1 && candidates1.length > 2) {
            const newCandidates = candidates1.filter(n => n === num1 || n === num2);
            if (newCandidates.length === 1) {
              return {
                row,
                col: col1,
                number: newCandidates[0],
                method: '隐性数对（Hidden Pair）',
                description: `在第 ${row + 1} 行中，数字 ${num1} 和 ${num2} 只出现在第 ${col1 + 1} 列和第 ${col2 + 1} 列这两个格子中。因此第 ${row + 1} 行第 ${col1 + 1} 列的其他候选数都可以排除，只剩下 ${newCandidates[0]}。`
              };
            }
          }
          
          if (candidates2 && candidates2.length > 2) {
            const newCandidates = candidates2.filter(n => n === num1 || n === num2);
            if (newCandidates.length === 1) {
              return {
                row,
                col: col2,
                number: newCandidates[0],
                method: '隐性数对（Hidden Pair）',
                description: `在第 ${row + 1} 行中，数字 ${num1} 和 ${num2} 只出现在第 ${col1 + 1} 列和第 ${col2 + 1} 列这两个格子中。因此第 ${row + 1} 行第 ${col2 + 1} 列的其他候选数都可以排除，只剩下 ${newCandidates[0]}。`
              };
            }
          }
        }
      }
    }
  }
  
  // 检查列中的隐性数对
  for (let col = 0; col < size; col++) {
    const numPositions = new Map<number, number[]>(); // num -> [rows]
    
    for (let row = 0; row < size; row++) {
      if (grid[row][col].value !== null) continue;
      const candidates = allCandidates.get(`${row},${col}`);
      if (candidates) {
        for (const num of candidates) {
          if (!numPositions.has(num)) numPositions.set(num, []);
          numPositions.get(num)!.push(row);
        }
      }
    }
    
    const numsInTwoCells: number[] = [];
    for (const [num, rows] of numPositions) {
      if (rows.length === 2) numsInTwoCells.push(num);
    }
    
    for (let i = 0; i < numsInTwoCells.length; i++) {
      for (let j = i + 1; j < numsInTwoCells.length; j++) {
        const num1 = numsInTwoCells[i];
        const num2 = numsInTwoCells[j];
        const rows1 = numPositions.get(num1)!;
        const rows2 = numPositions.get(num2)!;
        
        if (rows1[0] === rows2[0] && rows1[1] === rows2[1]) {
          const row1 = rows1[0];
          const row2 = rows1[1];
          
          const candidates1 = allCandidates.get(`${row1},${col}`);
          const candidates2 = allCandidates.get(`${row2},${col}`);
          
          if (candidates1 && candidates1.length > 2) {
            const newCandidates = candidates1.filter(n => n === num1 || n === num2);
            if (newCandidates.length === 1) {
              return {
                row: row1,
                col,
                number: newCandidates[0],
                method: '隐性数对（Hidden Pair）',
                description: `在第 ${col + 1} 列中，数字 ${num1} 和 ${num2} 只出现在第 ${row1 + 1} 行和第 ${row2 + 1} 行这两个格子中。因此第 ${row1 + 1} 行第 ${col + 1} 列的其他候选数都可以排除，只剩下 ${newCandidates[0]}。`
              };
            }
          }
          
          if (candidates2 && candidates2.length > 2) {
            const newCandidates = candidates2.filter(n => n === num1 || n === num2);
            if (newCandidates.length === 1) {
              return {
                row: row2,
                col,
                number: newCandidates[0],
                method: '隐性数对（Hidden Pair）',
                description: `在第 ${col + 1} 列中，数字 ${num1} 和 ${num2} 只出现在第 ${row1 + 1} 行和第 ${row2 + 1} 行这两个格子中。因此第 ${row2 + 1} 行第 ${col + 1} 列的其他候选数都可以排除，只剩下 ${newCandidates[0]}。`
              };
            }
          }
        }
      }
    }
  }
  
  // 3.4 X-Wing
  // 检查行方向的 X-Wing，找到因排除而候选数变为1的格子
  for (let num = 1; num <= size; num++) {
    const rowPositions: Map<number, number[]> = new Map(); // row -> [cols]
    
    for (let row = 0; row < size; row++) {
      const cols: number[] = [];
      for (let col = 0; col < size; col++) {
        if (grid[row][col].value !== null) continue;
        const candidates = allCandidates.get(`${row},${col}`);
        if (candidates && candidates.includes(num)) {
          cols.push(col);
        }
      }
      if (cols.length === 2) {
        rowPositions.set(row, cols);
      }
    }
    
    const rows = Array.from(rowPositions.keys());
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        const row1 = rows[i];
        const row2 = rows[j];
        const cols1 = rowPositions.get(row1)!;
        const cols2 = rowPositions.get(row2)!;
        
        if (cols1[0] === cols2[0] && cols1[1] === cols2[1]) {
          const col1 = cols1[0];
          const col2 = cols1[1];
          
          // 检查这两列的其他行是否因排除num而候选数变为1
          for (let row = 0; row < size; row++) {
            if (row === row1 || row === row2) continue;
            
            for (const col of [col1, col2]) {
              if (grid[row][col].value !== null) continue;
              const candidates = allCandidates.get(`${row},${col}`);
              if (candidates && candidates.includes(num)) {
                const newCandidates = candidates.filter(n => n !== num);
                if (newCandidates.length === 1) {
                  return {
                    row,
                    col,
                    number: newCandidates[0],
                    method: 'X-Wing',
                    description: `在第 ${row1 + 1} 行和第 ${row2 + 1} 行中，数字 ${num} 都只能填在第 ${col1 + 1} 列和第 ${col2 + 1} 列。这四个格子构成一个矩形的四个顶点。因此第 ${row + 1} 行第 ${col + 1} 列可以排除候选数 ${num}，排除后只剩下唯一候选数 ${newCandidates[0]}。`
                  };
                }
              }
            }
          }
        }
      }
    }
  }
  
  // Fallback to solution-based hint
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col].value === null) {
        return {
          row,
          col,
          number: solution[row][col],
          method: '答案提示',
          description: `第 ${row + 1} 行第 ${col + 1} 列的正确答案是 ${solution[row][col]}。当前盘面暂时无法通过已实现的推理技巧直接得出，建议尝试标记候选数后仔细观察。`
        };
      }
    }
  }
  
  return null;
}
