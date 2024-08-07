import React, { useState, useEffect } from 'react';
import { getParticipatingActivities, ActivityPage, Activity } from '../services/api';
import ActivityCard from '../components/ActivityCard';
import Pagination from '../components/Pagination';

const ParticipatingActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [currentPage]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getParticipatingActivities(currentPage);
      setActivities(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Fehler beim Laden der teilnehmenden Aktivitäten:', error);
      setError('Aktivitäten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div className="text-center mt-8">Lade Aktivitäten...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meine teilnehmenden Aktivitäten</h1>
      {activities.length === 0 ? (
        <p className="text-center">Sie nehmen derzeit an keinen Aktivitäten teil.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => {}} // Nicht benötigt für diese Ansicht
              onDelete={() => {}} // Nicht benötigt für diese Ansicht
            />
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ParticipatingActivitiesView;