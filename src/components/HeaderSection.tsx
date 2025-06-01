import React from 'react';

interface HeaderSectionProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-primary pt-24 pb-6 px-4 safe-area-pt ${className}`}>
      <div className="max-w-md mx-auto pt-8">
        {children}
      </div>
    </div>
  );
};

export default HeaderSection;