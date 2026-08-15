import React from 'react';
import { motion } from 'motion/react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  id?: string;
  ariaLabel?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  id,
  ariaLabel = 'Toggle setting'
}) => {
  const isSm = size === 'sm';
  const widthClass = isSm ? 'w-10 h-5.5' : 'w-12 h-6.5';
  const thumbClass = isSm ? 'w-4 h-4' : 'w-5 h-5';
  const translateX = isSm ? 18 : 22;

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange();
      }}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-all duration-250 ease-in-out focus:outline-none p-0.5 border ${widthClass} ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${
        checked
          ? 'bg-blue-600 border-blue-400/80 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
          : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        animate={{ x: checked ? translateX : 0 }}
        className={`pointer-events-none inline-block rounded-full bg-white shadow-md ring-0 ${thumbClass} ${
          checked ? 'shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-slate-300'
        }`}
      />
    </button>
  );
};
