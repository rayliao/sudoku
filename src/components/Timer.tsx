import { memo, useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  elapsedTime: number;
  isPaused: boolean;
}

export const Timer = memo(function Timer({ elapsedTime, isPaused }: TimerProps) {
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    setDisplayTime(elapsedTime);
  }, [elapsedTime, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: isPaused ? '#e8e4dd' : '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(26, 26, 46, 0.08)',
  };

  const timeStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: '"DM Sans", sans-serif',
    color: isPaused ? '#718096' : '#1a1a2e',
    minWidth: '60px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <Clock size={18} color={isPaused ? '#718096' : '#c45c48'} />
      <span style={timeStyle}>{formatTime(displayTime)}</span>
    </div>
  );
});
