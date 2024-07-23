import React from 'react';

type SortOption = 'name' | 'rating' | 'id';

interface ActivitySortProps {
  onSortChange: (sortBy: SortOption) => void;
}

const ActivitySort: React.FC<ActivitySortProps> = ({ onSortChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
        Sortieren nach:
      </label>
      <select
        id="sort"
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="id">Erstellungsdatum</option>
        <option value="name">Name</option>
        <option value="rating">Bewertung</option>
      </select>
    </div>
  );
};

export default ActivitySort;