import React from 'react';

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  rightAction,
  className = '',
}) => {
  return (
    <header
      className={`sticky top-0 z-40 bg-white border-b-2 border-secondary-200 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto min-h-[60px]">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="p-2 -ml-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Go back"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {title && (
            <h1 className="text-xl font-bold text-secondary-900">{title}</h1>
          )}
        </div>

        {/* Right section */}
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};

export default Header;
