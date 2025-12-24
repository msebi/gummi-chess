// components/ui/ControlButton.tsx (or similar)
import React from 'react';

// A single, reusable button for our control rows
export const ControlButton = ({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="
      flex items-center justify-center
      w-12 h-12
      bg-gray-800 bg-gradient-to-b from-gray-700 to-gray-900
      border-b-4 border-black
      text-gray-300
      transition-all duration-100
      rounded-lg
      hover:brightness-125
      active:border-b-0 active:translate-y-1 active:brightness-90
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  >
    {children}
  </button>
);