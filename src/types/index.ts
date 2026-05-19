export interface SudokuCell {
  value: number | null;
  isFixed: boolean;
  isValid: boolean;
  notes: number[];
  isDeadEnd?: boolean;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface HistoryEntry {
  type: 'set' | 'clear' | 'note';
  row: number;
  col: number;
  prevValue: number | null;
  newValue: number | null;
  prevNotes: number[];
  newNotes: number[];
}

export interface GameState {
  grid: SudokuCell[][];
  solution: number[][];
  selectedCell: CellPosition | null;
  size: 4 | 6 | 9;
  isNoteMode: boolean;
  elapsedTime: number;
  hintsUsed: number;
  history: HistoryEntry[];
  historyIndex: number;
  isComplete: boolean;
  isPaused: boolean;
}

export type Difficulty = 4 | 6 | 9;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  4: '四宫格',
  6: '六宫格',
  9: '九宫格',
};

export const DIFFICULTY_SUBTITLES: Record<Difficulty, string> = {
  4: '入门',
  6: '进阶',
  9: '高级',
};
