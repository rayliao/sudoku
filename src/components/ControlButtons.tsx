import { memo } from 'react';
import { Lightbulb, Pencil, Undo2, Redo2, RotateCcw, Play, Pause } from 'lucide-react';

interface ControlButtonsProps {
  isNoteMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isPaused: boolean;
  onToggleNote: () => void;
  onUndo: () => void;
  onHint: () => void;
  onReset: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const ControlButtons = memo(function ControlButtons({
  isNoteMode,
  canUndo,
  canRedo,
  isPaused,
  onToggleNote,
  onUndo,
  onHint,
  onReset,
  onPause,
  onResume,
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

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle('accent')}
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
        onClick={onUndo}
        disabled={!canUndo}
        onMouseDown={e => {
          if (!canUndo) return;
          (e.target as HTMLElement).style.transform = 'scale(0.95)';
        }}
        onMouseUp={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <Undo2 size={16} />
        撤销
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
