import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className = '',
}) => {
  const maxWidthStyles = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };

  const paddingStyles = {
    none: '',
    sm: 'px-4 sm:px-6 py-3',
    md: 'px-4 sm:px-6 py-6',
    lg: 'px-6 sm:px-8 py-8',
  };

  return (
    <div
      className={`${maxWidthStyles[maxWidth]} ${paddingStyles[padding]} mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;
