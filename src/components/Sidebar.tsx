import React from 'react';
import { FilterType, LanguageStats, TrainingData } from '../types';

interface SidebarProps {
  currentData: TrainingData;
  languageStats: LanguageStats;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentData,
  languageStats,
  currentFilter,
  onFilterChange
}) => {
  return (
    <div className="sidebar">
      <h3>Language Statistics</h3>
      <div className="language-stats">
        {/* All Languages option */}
        <div
          className={`language-stat-item clickable ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          <span className="language-name">All Languages</span>
          <span className="language-count">{currentData.length}</span>
        </div>

        {/* Individual language statistics */}
        {Object.entries(languageStats)
          .sort(([, a], [, b]) => b - a)
          .map(([language, count]) => (
            <div
              key={language}
              className={`language-stat-item clickable ${currentFilter === language ? 'active' : ''}`}
              onClick={() => onFilterChange(language as FilterType)}
            >
              <span className="language-name">{language}</span>
              <span className="language-count">{count}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
