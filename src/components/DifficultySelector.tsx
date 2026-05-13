import { memo } from 'react';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../types';

interface DifficultySelectorProps {
  current: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector = memo(function DifficultySelector({
  current,
  onChange,
}: DifficultySelectorProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  };

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '10px',
    border: isActive ? '2px solid #c45c48' : '2px solid transparent',
    backgroundColor: isActive ? '#fff5f3' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isActive
      ? '0 4px 12px rgba(196, 92, 72, 0.2)'
      : '0 2px 8px rgba(26, 26, 46, 0.08)',
    minWidth: '60px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    fontFamily: '"Noto Sans SC", sans-serif',
  });

  const difficulties: Difficulty[] = [4, 6, 9];

  return (
    <div style={containerStyle}>
      {difficulties.map(diff => (
        <button
          key={diff}
          style={buttonStyle(current === diff)}
          onClick={() => onChange(diff)}
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
          {DIFFICULTY_LABELS[diff]}
        </button>
      ))}
    </div>
  );
});
