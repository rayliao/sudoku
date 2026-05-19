import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, SudokuCell, HistoryEntry, CellPosition, Difficulty } from '../types';
import { generateSudoku, findHint, countSolutions, type HintInfo } from '../utils/generator';
import { checkConflicts, isComplete as checkIsComplete } from '../utils/validator';
import type { GameMode } from '../components/ControlButtons';

const STORAGE_KEY = 'sudoku_game_state';

const initialState: GameState = {
  grid: [],
  solution: [],
  selectedCell: null,
  size: 4,
  isNoteMode: false,
  elapsedTime: 0,
  hintsUsed: 0,
  history: [],
  historyIndex: -1,
  isComplete: false,
  isPaused: false,
};

function loadSavedState(): Partial<GameState> | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.grid && parsed.grid.length > 0 && parsed.solution && parsed.solution.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load saved game state:', e);
  }
  return null;
}

function saveState(state: GameState): void {
  try {
    const toSave = {
      grid: state.grid,
      solution: state.solution,
      size: state.size,
      elapsedTime: state.elapsedTime,
      hintsUsed: state.hintsUsed,
      history: state.history,
      historyIndex: state.historyIndex,
      isComplete: state.isComplete,
      isPaused: state.isPaused,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save game state:', e);
  }
}

function getSubGridConfig(size: number): { rows: number; cols: number } {
  switch (size) {
    case 4: return { rows: 2, cols: 2 };
    case 6: return { rows: 2, cols: 3 };
    case 9: return { rows: 3, cols: 3 };
    default: return { rows: 3, cols: 3 };
  }
}

function checkGridSolvable(grid: SudokuCell[][], size: number): boolean {
  const subGrid = getSubGridConfig(size);
  const numGrid = grid.map(row => row.map(cell => cell.value ?? 0));
  return countSolutions(numGrid, subGrid, 1) > 0;
}

function clearSavedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear saved game state:', e);
  }
}

export function useSudoku() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadSavedState();
    if (saved) {
      return {
        ...initialState,
        ...saved,
        isPaused: false,
      };
    }
    return initialState;
  });
  const timerRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.isComplete || prev.isPaused) return prev;
        return { ...prev, elapsedTime: prev.elapsedTime + 1 };
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startNewGame = useCallback((size: Difficulty, gameMode: GameMode = 'normal') => {
    stopTimer();
    const { puzzle, solution } = generateSudoku(size, gameMode);
    
    const newState = {
      ...initialState,
      grid: puzzle,
      solution,
      size,
    };
    
    setState(newState);
    clearSavedState();
    
    setTimeout(() => startTimer(), 100);
  }, [stopTimer, startTimer]);

  const selectCell = useCallback((row: number, col: number) => {
    setState(prev => ({
      ...prev,
      selectedCell: { row, col },
    }));
  }, []);

  const setNumber = useCallback((num: number) => {
    setState(prev => {
      if (!prev.selectedCell || prev.isComplete) return prev;
      if (prev.grid[prev.selectedCell.row][prev.selectedCell.col].isFixed) return prev;
      
      const { row, col } = prev.selectedCell;
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      
      const historyEntry: HistoryEntry = {
        type: 'set',
        row,
        col,
        prevValue: newGrid[row][col].value,
        newValue: num,
        prevNotes: [...newGrid[row][col].notes],
        newNotes: [],
      };
      
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(historyEntry);
      
      newGrid[row][col].value = num;
      newGrid[row][col].notes = [];
      newGrid[row][col].isValid = true;
      newGrid[row][col].isDeadEnd = false;
      
      const conflicts = checkConflicts(newGrid, prev.size);
      const isComplete = checkIsComplete(newGrid, prev.size);
      
      // 如果没有硬冲突，检查当前盘面是否仍然可解
      if (conflicts.size === 0 && !isComplete) {
        const solvable = checkGridSolvable(newGrid, prev.size);
        if (!solvable) {
          newGrid[row][col].isDeadEnd = true;
        }
      }
      
      const newState = {
        ...prev,
        grid: newGrid,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isComplete,
      };
      
      if (isComplete) {
        stopTimer();
        clearSavedState();
      }
      
      return newState;
    });
  }, [stopTimer]);

  const clearCell = useCallback(() => {
    setState(prev => {
      if (!prev.selectedCell || prev.isComplete) return prev;
      const { row, col } = prev.selectedCell;
      if (prev.grid[row][col].isFixed) return prev;
      
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      
      const historyEntry: HistoryEntry = {
        type: 'clear',
        row,
        col,
        prevValue: newGrid[row][col].value,
        newValue: null,
        prevNotes: [...newGrid[row][col].notes],
        newNotes: [],
      };
      
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(historyEntry);
      
      newGrid[row][col].value = null;
      newGrid[row][col].isValid = true;
      newGrid[row][col].isDeadEnd = false;
      
      return {
        ...prev,
        grid: newGrid,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isComplete: false,
      };
    });
  }, []);

  const toggleNote = useCallback((num: number) => {
    setState(prev => {
      if (!prev.selectedCell || prev.isComplete) return prev;
      const { row, col } = prev.selectedCell;
      if (prev.grid[row][col].isFixed) return prev;
      
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      
      const historyEntry: HistoryEntry = {
        type: 'note',
        row,
        col,
        prevValue: newGrid[row][col].value,
        newValue: newGrid[row][col].value,
        prevNotes: [...newGrid[row][col].notes],
        newNotes: [...newGrid[row][col].notes],
      };
      
      const idx = newGrid[row][col].notes.indexOf(num);
      if (idx >= 0) {
        newGrid[row][col].notes.splice(idx, 1);
      } else {
        newGrid[row][col].notes.push(num);
        newGrid[row][col].notes.sort((a, b) => a - b);
      }
      
      historyEntry.newNotes = [...newGrid[row][col].notes];
      
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(historyEntry);
      
      return {
        ...prev,
        grid: newGrid,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const toggleNoteMode = useCallback(() => {
    setState(prev => ({ ...prev, isNoteMode: !prev.isNoteMode }));
  }, []);



  const getHintInfo = useCallback((): HintInfo | null => {
    if (state.grid.length === 0 || state.solution.length === 0) {
      return null;
    }
    return findHint(state.grid, state.solution, state.size);
  }, [state.grid, state.solution, state.size]);

  const applyHint = useCallback((hintInfo: HintInfo) => {
    setState(prev => {
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));
      
      const historyEntry: HistoryEntry = {
        type: 'set',
        row: hintInfo.row,
        col: hintInfo.col,
        prevValue: newGrid[hintInfo.row][hintInfo.col].value,
        newValue: hintInfo.number,
        prevNotes: [...newGrid[hintInfo.row][hintInfo.col].notes],
        newNotes: [],
      };
      
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(historyEntry);
      
      newGrid[hintInfo.row][hintInfo.col].value = hintInfo.number;
      newGrid[hintInfo.row][hintInfo.col].notes = [];
      
      const isComplete = checkIsComplete(newGrid, prev.size);
      
      const newState = {
        ...prev,
        grid: newGrid,
        selectedCell: { row: hintInfo.row, col: hintInfo.col },
        history: newHistory,
        historyIndex: newHistory.length - 1,
        hintsUsed: prev.hintsUsed + 1,
        isComplete,
      };
      
      if (isComplete) {
        stopTimer();
        clearSavedState();
      }
      
      return newState;
    });
  }, [stopTimer]);

  const resetGame = useCallback(() => {
    setState(prev => {
      if (prev.grid.length === 0) return prev;
      
      const newGrid = prev.grid.map(row =>
        row.map(cell => ({
          ...cell,
          value: cell.isFixed ? cell.value : null,
          notes: [],
          isValid: true,
          isDeadEnd: false,
        }))
      );
      
      stopTimer();
      clearSavedState();
      
      return {
        ...prev,
        grid: newGrid,
        elapsedTime: 0,
        hintsUsed: 0,
        history: [],
        historyIndex: -1,
        isComplete: false,
        selectedCell: null,
      };
    });
  }, [stopTimer]);

  const pauseGame = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      const saved = loadSavedState();
      if (saved && saved.grid && saved.grid.length > 0) {
        setTimeout(() => startTimer(), 100);
      }
      return;
    }
    
    if (state.grid.length > 0 && !state.isComplete) {
      saveState(state);
    }
  }, [state]);

  return {
    state,
    startNewGame,
    selectCell,
    setNumber,
    clearCell,
    toggleNote,
    toggleNoteMode,
    getHintInfo,
    applyHint,
    resetGame,
    pauseGame,
    resumeGame,
  };
}
