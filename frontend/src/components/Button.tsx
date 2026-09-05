import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-medium tracking-wide',
    lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5 font-semibold tracking-wide',
  };

  const variantClasses = {
    primary:
      'bg-[#EF6905] hover:bg-[#D85D02] text-[#FFFFFF] shadow-md shadow-[#EF6905]/30 border border-[#EF6905] active:scale-[0.98]',
    secondary:
      'bg-[#FFFFFF] hover:bg-[#FDFBF2] text-[#2A1A18] border border-[#E8DEB7] hover:border-[#EF6905] shadow-xs active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-[#F1E5A1]/20 text-[#8B2626] border border-[#8B2626] hover:border-[#EF6905] hover:text-[#EF6905] active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-[#F1E5A1]/30 text-[#6A5652] hover:text-[#2A1A18] border border-transparent',
    glow:
      'bg-gradient-to-r from-[#8B2626] to-[#EF6905] hover:from-[#9D2D2D] hover:to-[#F4781A] text-[#FFFFFF] shadow-[0_4px_20px_rgba(239,105,5,0.35)] border border-[#EF6905]/40 active:scale-[0.98]',
  };

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -1 }}
      whileTap={{ y: disabled ? 0 : 1 }}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </motion.button>
  );
};
