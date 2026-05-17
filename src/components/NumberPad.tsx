import { memo } from 'react';
import { Delete } from 'lucide-react';
import type { Difficulty } from '../types';

interface NumberPadProps {
  maxNumber: number;
  completedNumbers: number[];
  onNumberClick: (num: number) => void;
  onDeleteClick: () => void;
}

export const NumberPad = memo(function NumberPad({
  maxNumber,
  completedNumbers,
  onNumberClick,
  onDeleteClick,
}: NumberPadProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '16px',
  };

  const buttonStyle = (isCompleted: boolean, pressed: boolean): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: pressed ? '#c45c48' : isCompleted ? '#a0aec0' : '#ffffff',
    color: pressed ? '#ffffff' : isCompleted ? '#718096' : '#1a1a2e',
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: '"DM Sans", sans-serif',
    cursor: isCompleted ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(26, 26, 46, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isCompleted ? 0.6 : 1,
  });

  const deleteButtonStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#ea580c',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      {Array.from({ length: maxNumber }, (_, i) => i + 1).map(num => {
        const isCompleted = completedNumbers.includes(num);
        return (
          <button
            key={num}
            style={buttonStyle(isCompleted, false)}
            onClick={() => !isCompleted && onNumberClick(num)}
            disabled={isCompleted}
            onMouseDown={e => {
              if (isCompleted) return;
              (e.target as HTMLElement).style.transform = 'scale(0.95)';
              (e.target as HTMLElement).style.backgroundColor = '#c45c48';
              (e.target as HTMLElement).style.color = '#ffffff';
            }}
            onMouseUp={e => {
              if (isCompleted) return;
              (e.target as HTMLElement).style.transform = 'scale(1)';
              (e.target as HTMLElement).style.backgroundColor = '#ffffff';
              (e.target as HTMLElement).style.color = '#1a1a2e';
            }}
            onMouseLeave={e => {
              if (isCompleted) return;
              (e.target as HTMLElement).style.transform = 'scale(1)';
              (e.target as HTMLElement).style.backgroundColor = '#ffffff';
              (e.target as HTMLElement).style.color = '#1a1a2e';
            }}
          >
            {num}
          </button>
        );
      })}
      <button
        style={deleteButtonStyle}
        onClick={onDeleteClick}
        onMouseDown={e => {
          (e.target as HTMLElement).style.transform = 'scale(0.95)';
          (e.target as HTMLElement).style.backgroundColor = '#c2410c';
        }}
        onMouseUp={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
          (e.target as HTMLElement).style.backgroundColor = '#ea580c';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
          (e.target as HTMLElement).style.backgroundColor = '#ea580c';
        }}
      >
        <Delete size={20} />
      </button>
    </div>
  );
});
