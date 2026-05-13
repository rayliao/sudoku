import { memo, useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  time: number;
  hintsUsed: number;
  onNewGame: () => void;
  onClose: () => void;
}

export const SuccessModal = memo(function SuccessModal({
  isOpen,
  time,
  hintsUsed,
  onNewGame,
  onClose,
}: SuccessModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 50);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}分${secs}秒`;
    }
    return `${secs}秒`;
  };

  if (!isOpen && !show) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: show ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '360px',
    width: '90%',
    textAlign: 'center',
    transform: show ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
    transition: 'transform 0.3s ease',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(26, 26, 46, 0.3)',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#fff5f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '16px',
    fontFamily: '"Noto Serif SC", serif',
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginBottom: '32px',
  };

  const statItemStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '4px',
    fontFamily: '"Noto Sans SC", sans-serif',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a2e',
    fontFamily: '"DM Sans", sans-serif',
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    padding: '14px 32px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: '"Noto Sans SC", sans-serif',
    ...(variant === 'primary'
      ? {
          backgroundColor: '#c45c48',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(196, 92, 72, 0.3)',
        }
      : {
          backgroundColor: '#e8e4dd',
          color: '#4a5568',
        }),
  });

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f5f0e8',
    color: '#718096',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button
          style={closeButtonStyle}
          onClick={onClose}
          onMouseDown={e => {
            (e.target as HTMLElement).style.transform = 'scale(0.9)';
          }}
          onMouseUp={e => {
            (e.target as HTMLElement).style.transform = 'scale(1)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          <X size={18} />
        </button>

        <div style={iconContainerStyle}>
          <Trophy size={40} color="#c45c48" />
        </div>

        <h2 style={titleStyle}>恭喜完成！</h2>

        <div style={statsStyle}>
          <div style={statItemStyle}>
            <div style={statLabelStyle}>用时</div>
            <div style={statValueStyle}>{formatTime(time)}</div>
          </div>
          <div style={statItemStyle}>
            <div style={statLabelStyle}>使用提示</div>
            <div style={statValueStyle}>{hintsUsed}次</div>
          </div>
        </div>

        <button
          style={buttonStyle('primary')}
          onClick={onNewGame}
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
          再来一局
        </button>
      </div>
    </div>
  );
});
