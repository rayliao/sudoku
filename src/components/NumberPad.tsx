import { memo } from 'react';
import { Delete } from 'lucide-react';
import type { Difficulty } from '../types';

interface NumberPadProps {
  maxNumber: number;
  onNumberClick: (num: number) => void;
  onDeleteClick: () => void;
}

export const NumberPad = memo(function NumberPad({
  maxNumber,
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

  const buttonStyle = (pressed: boolean): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: pressed ? '#c45c48' : '#ffffff',
    color: pressed ? '#ffffff' : '#1a1a2e',
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: '"DM Sans", sans-serif',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(26, 26, 46, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const deleteButtonStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#e8e4dd',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(26, 26, 46, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      {Array.from({ length: maxNumber }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          style={buttonStyle(false)}
          onClick={() => onNumberClick(num)}
          onMouseDown={e => {
            (e.target as HTMLElement).style.transform = 'scale(0.95)';
            (e.target as HTMLElement).style.backgroundColor = '#c45c48';
            (e.target as HTMLElement).style.color = '#ffffff';
          }}
          onMouseUp={e => {
            (e.target as HTMLElement).style.transform = 'scale(1)';
            (e.target as HTMLElement).style.backgroundColor = '#ffffff';
            (e.target as HTMLElement).style.color = '#1a1a2e';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.transform = 'scale(1)';
            (e.target as HTMLElement).style.backgroundColor = '#ffffff';
            (e.target as HTMLElement).style.color = '#1a1a2e';
          }}
        >
          {num}
        </button>
      ))}
      <button
        style={deleteButtonStyle}
        onClick={onDeleteClick}
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
        <Delete size={20} />
      </button>
    </div>
  );
});
