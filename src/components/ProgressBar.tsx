import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'accent' | 'secondary';
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showLabel = false,
  label,
  color = 'primary',
  animated = true,
  className = '',
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorStyles = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    secondary: 'bg-secondary-500',
  };

  const animationStyles = animated ? 'transition-all duration-500 ease-out' : '';

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
            {clampedProgress}%
          </span>
        </div>
      )}
      <div className={`w-full bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} ${colorStyles[color]} ${animationStyles} rounded-full`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
