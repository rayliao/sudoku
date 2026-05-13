import { useState, useEffect, useCallback } from 'react';
import { useSudoku } from './hooks/useSudoku';
import { SudokuBoard } from './components/SudokuBoard';
import { NumberPad } from './components/NumberPad';
import { ControlButtons } from './components/ControlButtons';
import { DifficultySelector } from './components/DifficultySelector';
import { Timer } from './components/Timer';
import { SuccessModal } from './components/SuccessModal';
import type { Difficulty } from './types';
import type { GameMode } from './components/ControlButtons';

function App() {
  const [boardSize, setBoardSize] = useState(320);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  
  const {
    state,
    startNewGame,
    selectCell,
    setNumber,
    clearCell,
    toggleNote,
    toggleNoteMode,
    undo,
    resetGame,
    pauseGame,
    resumeGame,
  } = useSudoku();

  useEffect(() => {
    startNewGame(4, gameMode);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const updateBoardSize = () => {
      const maxWidth = Math.min(window.innerWidth - 48, 480);
      const maxHeight = window.innerHeight - 400;
      const size = Math.min(maxWidth, maxHeight, 480);
      setBoardSize(Math.max(size, 240));
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    startNewGame(difficulty, gameMode);
  }, [startNewGame, gameMode]);

  const handleModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode);
    startNewGame(state.size, mode);
  }, [startNewGame, state.size]);

  const handleNumberClick = useCallback((num: number) => {
    if (state.isNoteMode) {
      toggleNote(num);
    } else {
      setNumber(num);
    }
  }, [state.isNoteMode, setNumber, toggleNote]);

  const handleCellClick = useCallback((row: number, col: number) => {
    selectCell(row, col);
  }, [selectCell]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#e8e4dd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    fontFamily: '"Noto Sans SC", sans-serif',
    position: 'relative',
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(196, 92, 72, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(74, 124, 89, 0.05) 0%, transparent 50%)
    `,
  };

  const timerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '24px',
    right: '24px',
    zIndex: 100,
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '16px',
    fontFamily: '"Noto Serif SC", serif',
    letterSpacing: '0.1em',
  };

  const boardContainerStyle: React.CSSProperties = {
    marginBottom: '24px',
    position: 'relative',
  };

  const pausedOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(232, 228, 221, 0.9)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    zIndex: 10,
  };

  const pausedTextStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a2e',
    fontFamily: '"Noto Serif SC", serif',
  };

  if (!isInitialized || state.grid.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>数独</h1>
        </div>
        <div style={{ color: '#718096' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={timerStyle}>
        <Timer elapsedTime={state.elapsedTime} isPaused={state.isPaused} />
      </div>

      <header style={headerStyle}>
        <h1 style={titleStyle}>数独</h1>
        <DifficultySelector
          current={state.size}
          onChange={handleDifficultyChange}
        />
      </header>

      <div style={boardContainerStyle}>
        <SudokuBoard
          grid={state.grid}
          selectedCell={state.selectedCell}
          size={state.size}
          boardSize={boardSize}
          onCellClick={handleCellClick}
        />
        {state.isPaused && (
          <div style={pausedOverlayStyle}>
            <span style={pausedTextStyle}>已暂停</span>
          </div>
        )}
      </div>

      <NumberPad
        maxNumber={state.size}
        onNumberClick={handleNumberClick}
        onDeleteClick={clearCell}
      />

      <div style={{ marginTop: '16px' }}>
        <ControlButtons
          isNoteMode={state.isNoteMode}
          canUndo={state.historyIndex >= 0}
          isPaused={state.isPaused}
          currentMode={gameMode}
          onToggleNote={toggleNoteMode}
          onUndo={undo}
          onReset={resetGame}
          onPause={pauseGame}
          onResume={resumeGame}
          onModeChange={handleModeChange}
        />
      </div>

      <SuccessModal
        isOpen={state.isComplete}
        time={state.elapsedTime}
        hintsUsed={state.hintsUsed}
        onNewGame={() => startNewGame(state.size)}
        onClose={() => {}}
      />
    </div>
  );
}

export default App;
