import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface BottomNavProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeItem,
  onItemClick,
  className = '',
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-secondary-200 shadow-lg z-50 ${className}`}
    >
      <div className="flex items-center justify-around max-w-screen-xl mx-auto">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`flex flex-col items-center justify-center py-3 px-4 min-w-[80px] min-h-[60px] transition-all duration-200 ${
                isActive
                  ? 'text-primary-600'
                  : 'text-secondary-400 hover:text-secondary-600'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
