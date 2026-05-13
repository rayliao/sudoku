import { memo } from 'react';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS, DIFFICULTY_SUBTITLES } from '../types';

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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 20px',
    borderRadius: '12px',
    border: isActive ? '2px solid #c45c48' : '2px solid transparent',
    backgroundColor: isActive ? '#fff5f3' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isActive
      ? '0 4px 12px rgba(196, 92, 72, 0.2)'
      : '0 2px 8px rgba(26, 26, 46, 0.08)',
    minWidth: '80px',
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
          <span
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a1a2e',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {DIFFICULTY_LABELS[diff]}
          </span>
          <span
            style={{
              fontSize: '12px',
              color: current === diff ? '#c45c48' : '#718096',
              fontFamily: '"Noto Sans SC", sans-serif',
              marginTop: '2px',
            }}
          >
            {DIFFICULTY_SUBTITLES[diff]}
          </span>
        </button>
      ))}
    </div>
  );
});
