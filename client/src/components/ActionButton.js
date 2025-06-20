// components/ActionButton.js
import React from 'react';
import { useLongPress } from '../hooks/useLongPress';
import { LongPressOption } from './LongPressOption';
import { Pin } from 'lucide-react';

export const ActionButton = ({ 
  icon: Icon, 
  label, 
  color, 
  onPin, 
  onClick,
  isPinned = false,
  className = '' 
}) => {
  const {
    isPressed,
    showOptions,
    optionsPosition,
    isHoveringOption,
    optionsRef,
    handleOptionSelect,
    getButtonProps
  } = useLongPress((data) => {
    console.log('Long press detectado:', data);
  });

  const handlePinAction = () => {
    handleOptionSelect(() => {
      onPin?.(label);
    });
  };

  const handleClick = () => {
    if (!showOptions) {
      onClick?.();
    }
  };

  return (
    <>
      <button
        {...getButtonProps({ label, action: 'pin' })}
        className={`
          relative p-4 rounded-full ${color} text-white shadow-lg
          transform transition-all duration-200 hover:scale-105
          ${isPressed && showOptions ? 'scale-110 ring-4 ring-blue-300' : ''}
          ${isPinned ? 'ring-2 ring-yellow-400' : ''}
          ${className}
        `}
        onClick={handleClick}
      >
        <Icon size={24} />
        {isPinned && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
        )}
      </button>

      <LongPressOption
        position={optionsPosition}
        isVisible={showOptions}
        isHovering={isHoveringOption}
        optionsRef={optionsRef}
        onSelect={handlePinAction}
      >
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-full transition-all duration-200
            ${isHoveringOption ? 'bg-blue-500 scale-110' : 'bg-white/10'}
          `}>
            <Pin size={18} className={isHoveringOption ? 'text-white' : 'text-white/80'} />
          </div>
          <span className={`
            font-medium transition-all duration-200
            ${isHoveringOption ? 'text-white text-lg' : 'text-white/90 text-base'}
          `}>
            Fixar
          </span>
        </div>
      </LongPressOption>
    </>
  );
};
