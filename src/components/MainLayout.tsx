import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import type { HeaderProps } from './Header';
import type { BottomNavProps } from './BottomNav';

export interface MainLayoutProps {
  children: React.ReactNode;
  header?: HeaderProps;
  bottomNav?: BottomNavProps;
  showHeader?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  bottomNav,
  showHeader = false,
  showBottomNav = false,
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {showHeader && header && <Header {...header} />}

      <main
        className={`flex-1 ${showBottomNav ? 'pb-20' : ''} ${className}`}
      >
        {children}
      </main>

      {showBottomNav && bottomNav && <BottomNav {...bottomNav} />}
    </div>
  );
};

export default MainLayout;
