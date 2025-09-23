import React from 'react';
import { FilterType } from '../types';

interface FilterControlsProps {
  allLanguages: string[];
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  allLanguages,
  currentFilter,
  onFilterChange
}) => {
  if (allLanguages.length === 0) {
    return null;
  }

  return (
    <div className="filter-controls">
      <label htmlFor="languageFilter">Filter by Language:</label>
      <select
        id="languageFilter"
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value as FilterType)}
      >
        <option value="all">All Languages</option>
        {allLanguages.map(language => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterControls;
