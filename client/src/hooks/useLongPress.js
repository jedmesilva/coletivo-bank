// hooks/useLongPress.js
import { useState, useRef, useCallback, useEffect } from 'react';

export const useLongPress = (onLongPress, delay = 500) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ x: 0, y: 0 });
  const [isHoveringOption, setIsHoveringOption] = useState(false);
  
  const longPressTimer = useRef(null);
  const optionsRef = useRef(null);

  const handleStart = useCallback((e, data) => {
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
    
    longPressTimer.current = setTimeout(() => {
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
    }, 100);
  }, []);

  const handleMove = useCallback((e) => {
    if (!showOptions) return;
    
    e.preventDefault();
    
    const optionsElement = optionsRef.current;
    if (!optionsElement) return;

    const rect = optionsElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const isOverOptions = (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
    
    setIsHoveringOption(isOverOptions);
  }, [showOptions]);

  const handleOptionSelect = useCallback((callback) => {
    if (isHoveringOption) {
      callback?.();
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
    
    // Handlers
    handleStart,
    handleEnd,
    handleMove,
    handleOptionSelect,
    
    // Props para o botão
    getButtonProps: (data) => ({
      onMouseDown: (e) => handleStart(e, data),
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart: (e) => handleStart(e, data),
      onTouchMove: handleMove,
      onTouchEnd: (e) => {
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
            // Chama callback se estiver sobre as opções
            return; // Não chama handleEnd aqui
          }
        }
        
        handleEnd();
      },
      onContextMenu: (e) => {
        e.preventDefault();
        handleStart(e, data);
      }
    })
  };
};