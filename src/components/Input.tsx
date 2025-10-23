import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  const baseStyles =
    'px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 min-h-[44px]';
  const normalStyles =
    'border-secondary-200 focus:border-primary-500 focus:ring-primary-200';
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-200';
  const iconPaddingStyles = icon ? 'pl-12' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-secondary-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`${baseStyles} ${hasError ? errorStyles : normalStyles} ${iconPaddingStyles} ${widthStyles}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
