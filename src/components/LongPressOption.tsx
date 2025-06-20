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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
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
          fixed z-50 bg-white/95 backdrop-blur-md text-gray-700 px-6 py-4 rounded-2xl shadow-2xl border border-white/30
          transition-all duration-200 transform cursor-pointer select-none
          ${isHovering ? 'scale-110 bg-blue-50/90 ring-2 ring-blue-400 shadow-blue-200/50' : 'scale-100'}
          ${className}
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translateX(-50%) ${isHovering ? 'scale(1.1)' : 'scale(1)'}`,
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