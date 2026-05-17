import { memo } from 'react';
import { Pencil, Lightbulb, RotateCcw, Play, Pause } from 'lucide-react';

export type GameMode = 'normal' | 'hard' | 'hell';

interface ControlButtonsProps {
  isNoteMode: boolean;
  isPaused: boolean;
  currentMode: GameMode;
  onToggleNote: () => void;
  onHint: () => void;
  onReset: () => void;
  onPause: () => void;
  onResume: () => void;
  onModeChange: (mode: GameMode) => void;
}

export const MODE_LABELS: Record<GameMode, string> = {
  normal: '普通',
  hard: '困难',
  hell: '地狱',
};

export const ControlButtons = memo(function ControlButtons({
  isNoteMode,
  isPaused,
  currentMode,
  onToggleNote,
  onHint,
  onReset,
  onPause,
  onResume,
  onModeChange,
}: ControlButtonsProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const buttonStyle = (variant: 'primary' | 'secondary' | 'accent'): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      fontFamily: '"Noto Sans SC", sans-serif',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          color: '#1a1a2e',
          boxShadow: '0 2px 8px rgba(26, 26, 46, 0.1)',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: isNoteMode ? '#c45c48' : '#e8e4dd',
          color: isNoteMode ? '#ffffff' : '#4a5568',
          boxShadow: '0 2px 8px rgba(26, 26, 46, 0.1)',
        };
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: '#4a7c59',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(74, 124, 89, 0.3)',
        };
    }
  };

  const modes: GameMode[] = ['normal', 'hard', 'hell'];
  
  const modeButtonGroupStyle: React.CSSProperties = {
    display: 'flex',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(26, 26, 46, 0.1)',
  };

  const modeButtonStyle = (mode: GameMode): React.CSSProperties => ({
    padding: '10px 16px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: '"Noto Sans SC", sans-serif',
    backgroundColor: currentMode === mode ? '#c45c48' : '#ffffff',
    color: currentMode === mode ? '#ffffff' : '#4a5568',
  });
  
  return (
    <div style={containerStyle}>
      <div style={modeButtonGroupStyle}>
        {modes.map((mode) => (
          <button
            key={mode}
            style={modeButtonStyle(mode)}
            onClick={() => onModeChange(mode)}
            onMouseDown={e => {
              (e.target as HTMLElement).style.transform = 'scale(0.98)';
            }}
            onMouseUp={e => {
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      <button
        style={buttonStyle('secondary')}
        onClick={onToggleNote}
        onMouseDown={e => {
          (e.target as HTMLElement).style.transform = 'scale(0.95)';
        }}
        onMouseUp={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <Pencil size={16} />
        笔记
      </button>

      <button
        style={buttonStyle('primary')}
        onClick={onHint}
        onMouseDown={e => {
          (e.target as HTMLElement).style.transform = 'scale(0.95)';
        }}
        onMouseUp={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <Lightbulb size={16} />
        提示
      </button>

      <button
        style={buttonStyle('primary')}
        onClick={onReset}
        onMouseDown={e => {
          (e.target as HTMLElement).style.transform = 'scale(0.95)';
        }}
        onMouseUp={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <RotateCcw size={16} />
        重置
      </button>

      <button
        style={buttonStyle('primary')}
        onClick={isPaused ? onResume : onPause}
        onMouseDown={e => {
          (e.target as HTMLElement).style.transform = 'scale(0.95)';
        }}
        onMouseUp={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
        {isPaused ? '继续' : '暂停'}
      </button>
    </div>
  );
});
