import React from 'react';

const ActivitySkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
  </div>
);

export default ActivitySkeleton;