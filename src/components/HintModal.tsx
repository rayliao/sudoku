import { memo } from 'react';
import type { HintInfo } from '../utils/generator';

interface HintModalProps {
  isOpen: boolean;
  hintInfo: HintInfo | null;
  onClose: () => void;
  onApply: () => void;
}

export const HintModal = memo(function HintModal({
  isOpen,
  hintInfo,
  onClose,
  onApply,
}: HintModalProps) {
  if (!isOpen || !hintInfo) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '480px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a2e',
    fontFamily: '"Noto Sans SC", sans-serif',
  };

  const methodStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#4a7c59',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px',
    fontFamily: '"Noto Sans SC", sans-serif',
  };

  const positionStyle: React.CSSProperties = {
    backgroundColor: '#e8e4dd',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '16px',
    color: '#1a1a2e',
    fontFamily: '"Noto Sans SC", sans-serif',
  };

  const numberStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#c45c48',
    marginLeft: '8px',
    fontFamily: '"DM Sans", sans-serif',
  };

  const descriptionStyle: React.CSSProperties = {
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '24px',
    fontFamily: '"Noto Sans SC", sans-serif',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const closeButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #e8e4dd',
    backgroundColor: 'white',
    color: '#4a5568',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: '"Noto Sans SC", sans-serif',
    transition: 'all 0.15s ease',
  };

  const applyButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4a7c59',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: '"Noto Sans SC", sans-serif',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>💡 数独提示</div>
        <div style={methodStyle}>{hintInfo.method}</div>
        <div style={positionStyle}>
          <span>第 {hintInfo.row + 1} 行第 {hintInfo.col + 1} 列</span>
          <span>应填入：</span>
          <span style={numberStyle}>{hintInfo.number}</span>
        </div>
        <div style={descriptionStyle}>{hintInfo.description}</div>
        <div style={buttonContainerStyle}>
          <button
            style={closeButtonStyle}
            onClick={onClose}
          >
            稍后再试
          </button>
          <button
            style={applyButtonStyle}
            onClick={onApply}
          >
            填入答案
          </button>
        </div>
      </div>
    </div>
  );
});
