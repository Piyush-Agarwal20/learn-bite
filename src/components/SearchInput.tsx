import React from 'react';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  fullWidth?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onClear,
  fullWidth = false,
  className = '',
  value,
  ...props
}) => {
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <div className={`relative ${widthStyles} ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="search"
        className={`${widthStyles} pl-12 pr-12 py-3 border-2 border-secondary-200 dark:border-secondary-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-200 min-h-[44px]`}
        value={value}
        {...props}
      />

      {/* Clear Button */}
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
