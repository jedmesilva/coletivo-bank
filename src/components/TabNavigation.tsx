
import React from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button 
    className={`px-2 py-2 text-sm sm:text-base sm:px-4 ${
      isActive ? 'border-b-2 border-primary font-bold' : 'text-gray-600'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

interface TabNavigationProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex justify-between border-b border-gray-300 mb-4 overflow-x-auto max-w-full">
      {tabs.map(tab => (
        <Tab
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};

export default TabNavigation;
