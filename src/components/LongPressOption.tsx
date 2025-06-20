import React from 'react';

interface LongPressOptionProps {
  children: React.ReactNode;
  position: { x: number; y: number };
  isVisible: boolean;
  isHovering: boolean;
  optionsRef: React.RefObject<HTMLDivElement>;
  onSelect: () => void;
  className?: string;
}

export const LongPressOption: React.FC<LongPressOptionProps> = ({ 
  children, 
  position, 
  isVisible, 
  isHovering, 
  optionsRef, 
  onSelect, 
  className = '' 
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-[9999]"
        style={{ touchAction: 'none' }}
        onMouseDown={onSelect}
        onTouchStart={(e) => {
          e.preventDefault();
          onSelect();
        }}
      />
      
      {/* Opção flutuante */}
      <div
        ref={optionsRef}
        className={`
          fixed z-[10000] bg-black/80 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-xl 
          transition-all duration-200 transform cursor-pointer select-none
          ${isHovering ? 'scale-110 bg-blue-500/20 ring-2 ring-blue-400' : 'scale-100'}
          ${className}
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translateX(-50%) ${isHovering ? 'scale(1.1)' : 'scale(1)'}`,
          animation: 'fadeInScale 0.2s ease-out'
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={onSelect}
      >
        {children}
      </div>
    </>
  );
};