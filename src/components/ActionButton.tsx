import React from 'react';
import { useLongPress } from '../hooks/useLongPress';
import { LongPressOption } from './LongPressOption';
import { Pin, LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onPin?: (label: string) => void;
  onClick?: () => void;
  isPinned?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon: Icon, 
  label,
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
          backdrop-blur-sm text-white border border-white/30 px-3 py-3 rounded-xl flex flex-col items-center shadow-sm transition-all duration-200 flex-1 min-h-[80px] select-none relative
          ${isPressed && showOptions ? 'bg-white/50 scale-110 ring-4 ring-blue-300' : 'bg-white/20 hover:bg-white/30 hover:shadow-md'}
          ${isPinned ? 'ring-2 ring-yellow-400 bg-white/30' : ''}
          ${className}
        `}
        onClick={handleClick}
      >
        <Icon size={18} className="mb-1" />
        <span className="font-medium text-xs text-center leading-tight">{label}</span>
        {isPinned && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" />
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