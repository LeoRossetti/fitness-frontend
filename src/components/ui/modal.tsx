'use client';

import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isBackdropClicked, setIsBackdropClicked] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
      setIsBackdropClicked(false);
    }, 300);
  };

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMouseDown(true);
      setIsBackdropClicked(true);
    }
  };

  const handleBackdropMouseUp = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isMouseDown) {
      handleClose();
    }
    setIsMouseDown(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      } ${isBackdropClicked ? 'bg-black/60' : 'bg-black/40'}`}
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-lg shadow-xl p-8 transform transition-all duration-300 ${
          closing || !mounted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
        >
          &times;
        </button>

        {title && (
          <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
} 