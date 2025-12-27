import React from 'react';
import { motion } from 'framer-motion';

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; hoverEffect?: boolean; onClick?: () => void }> = ({ 
  children, 
  className = '',
  hoverEffect = true,
  onClick
}) => (
  <motion.div 
    whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 40px -5px rgba(11, 31, 59, 0.12)" } : {}}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`bg-white rounded-[20px] border border-brand-border shadow-premium ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

// --- Section ---
interface SectionProps {
  id?: string;
  className?: string;
  bg?: 'white' | 'alt' | 'navy';
  pattern?: 'hero' | 'dots' | 'none';
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, className = '', bg = 'white', pattern = 'hero', children }) => {
  const bgColors = {
    white: 'bg-brand-white',
    alt: 'bg-brand-alt',
    navy: 'bg-brand-navy',
  };

  const getPatternClass = () => {
    if (bg === 'navy') return ''; // No pattern on navy backgrounds typically, or handled differently
    if (pattern === 'dots') return 'bg-dot-pattern opacity-[0.6]';
    if (pattern === 'hero') return 'bg-hero-pattern opacity-[0.4]';
    return '';
  };

  return (
    <section id={id} className={`${bgColors[bg]} py-20 md:py-32 relative overflow-hidden ${className}`}>
      {/* Subtle Pattern Overlay */}
      {pattern !== 'none' && bg !== 'navy' && (
        <div className={`absolute inset-0 pointer-events-none ${getPatternClass()}`}></div>
      )}
      {children}
    </section>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'gold'; className?: string }> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-brand-light text-brand-blue border border-brand-blue/20',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    gold: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Inputs ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, helperText, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-semibold text-brand-graySec mb-1.5 ml-1">
        {label}
      </label>
    )}
    <input
      className={`w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-brand-navy placeholder:text-brand-graySec/50 shadow-sm transition-all focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
    {helperText && <p className="mt-1.5 ml-1 text-xs text-brand-graySec">{helperText}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-semibold text-brand-graySec mb-1.5 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        className={`w-full appearance-none rounded-xl border border-brand-border bg-white px-4 py-3 text-brand-navy shadow-sm transition-all focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-graySec">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
      </div>
    </div>
  </div>
);