import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
}) => {
  const baseStyles = 'theme-card-bg rounded-lg transition-all duration-200';
  const cardStyle = { backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' };

  const variantStyles = {
    default: 'shadow-sm dark:shadow-secondary-900/50',
    elevated: 'shadow-lg dark:shadow-secondary-900/50',
    outlined: 'border-2 border-secondary-200 dark:border-secondary-700 shadow-none',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  const interactiveStyles = hoverable
    ? 'hover:shadow-xl dark:hover:shadow-secondary-900/70 hover:-translate-y-1'
    : '';
  const clickableStyles = clickable || onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${clickableStyles} ${className}`}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
