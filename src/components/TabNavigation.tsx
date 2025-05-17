
import React from 'react';

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
    <div className="flex border-b border-gray-300 mb-4 w-full">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <div key={tab.id} className="text-center flex-1">
            <button 
              className="w-full px-1 py-2 relative flex justify-center items-center"
              onClick={() => onTabChange(tab.id)}
            >
              <span className={`text-sm sm:text-base ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`} 
                    style={{ fontWeight: isActive ? 500 : 400 }}>
                {tab.label}
              </span>
            </button>
            <div className={`h-0.5 ${isActive ? 'bg-primary' : 'bg-transparent'}`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default TabNavigation;
