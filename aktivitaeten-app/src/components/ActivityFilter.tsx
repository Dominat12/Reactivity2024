import React from 'react';

interface ActivityFilterProps {
  onFilterChange: (filterValue: string) => void;
  onRatingFilterChange: (minRating: number) => void;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({ onFilterChange, onRatingFilterChange }) => {
  return (
    <div className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="Aktivitäten filtern..."
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div>
        <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Mindestbewertung:
        </label>
        <select
          id="rating-filter"
          onChange={(e) => onRatingFilterChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">Alle</option>
          <option value="1">1 Stern</option>
          <option value="2">2 Sterne</option>
          <option value="3">3 Sterne</option>
          <option value="4">4 Sterne</option>
          <option value="5">5 Sterne</option>
        </select>
      </div>
    </div>
  );
};

export default ActivityFilter;