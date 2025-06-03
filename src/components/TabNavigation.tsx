
import React from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button 
    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 flex-shrink-0 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
    <div className="overflow-hidden mb-6">
      <div className="overflow-x-auto scrollbar-hide bg-gray-100 p-1 rounded-2xl">
        <div className="flex gap-2 w-max min-w-full">
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
