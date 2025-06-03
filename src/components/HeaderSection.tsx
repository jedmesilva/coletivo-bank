import React from 'react';

interface HeaderSectionProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-20 pb-8 px-4 ${className}`} style={{paddingTop: '80px'}}>
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default HeaderSection;