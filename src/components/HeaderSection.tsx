import React from 'react';

interface HeaderSectionProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-primary pt-16 pb-6 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default HeaderSection;