import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseLongPressOptions {
  delay?: number;
  onLongPress?: (data: any) => void;
}

export const useLongPress = (options: UseLongPressOptions = {}) => {
  const { delay = 500, onLongPress } = options;
  
  const [isPressed, setIsPressed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ x: 0, y: 0 });
  const [isHoveringOption, setIsHoveringOption] = useState(false);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const isLongPressActive = useRef(false);

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent, data?: any) => {
    e.preventDefault();
    
    // Previne scroll da página
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setOptionsPosition({
      x: centerX,
      y: centerY - 60
    });
    
    setIsPressed(true);
    isLongPressActive.current = false;
    
    longPressTimer.current = setTimeout(() => {
      isLongPressActive.current = true;
      setShowOptions(true);
      onLongPress?.(data);
    }, delay);
  }, [onLongPress, delay]);

  const handleEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    // Restaura scroll da página
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    
    setTimeout(() => {
      setShowOptions(false);
      setIsPressed(false);
      setIsHoveringOption(false);
      isLongPressActive.current = false;
    }, 100);
  }, []);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!showOptions) return;
    
    e.preventDefault();
    
    const optionsElement = optionsRef.current;
    if (!optionsElement) return;

    const rect = optionsElement.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const isOverOptions = (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
    
    setIsHoveringOption(isOverOptions);
  }, [showOptions]);

  const handleOptionSelect = useCallback((callback?: () => void) => {
    if (isHoveringOption && callback) {
      callback();
    }
    handleEnd();
  }, [isHoveringOption, handleEnd]);

  // Cleanup
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return {
    // Estados
    isPressed,
    showOptions,
    optionsPosition,
    isHoveringOption,
    optionsRef,
    isLongPressActive: isLongPressActive.current,
    
    // Handlers
    handleStart,
    handleEnd,
    handleMove,
    handleOptionSelect,
    
    // Props para o botão
    getButtonProps: (data?: any) => ({
      onMouseDown: (e: React.MouseEvent) => handleStart(e, data),
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart: (e: React.TouchEvent) => handleStart(e, data),
      onTouchMove: handleMove,
      onTouchEnd: (e: React.TouchEvent) => {
        if (!showOptions) {
          handleEnd();
          return;
        }
        
        const touch = e.changedTouches[0];
        const optionsElement = optionsRef.current;
        
        if (optionsElement) {
          const rect = optionsElement.getBoundingClientRect();
          const isOverOptions = (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
          );
          
          if (isOverOptions) {
            // Não chama handleEnd aqui para permitir a seleção
            return;
          }
        }
        
        handleEnd();
      },
      onContextMenu: (e: React.MouseEvent) => {
        e.preventDefault();
        handleStart(e, data);
      }
    })
  };
};