import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white-outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg tracking-tight relative overflow-hidden";
  
  const variants = {
    primary: "bg-brand-gold text-brand-navy shadow-gold hover:shadow-lg focus:ring-brand-gold",
    secondary: "bg-brand-navy text-white shadow-md hover:bg-brand-blue focus:ring-brand-navy",
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-light focus:ring-brand-blue",
    "white-outline": "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white focus:ring-white",
    ghost: "text-brand-graySec hover:text-brand-navy hover:bg-brand-light focus:ring-brand-gray",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  // Motion wrapper for tap effect
  const MotionButton = motion.button;

  return (
    <MotionButton 
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props as any}
    >
      {isLoading && <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </MotionButton>
  );
};