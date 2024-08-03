import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserActivities, deleteActivity, Activity } from '../services/api';
import ActivityCard from '../components/ActivityCard';

const UserActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserActivities();
  }, []);

  const fetchUserActivities = async () => {
    try {
      setIsLoading(true);
      const response = await getUserActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzeraktivitäten:', error);
      setError('Aktivitäten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditActivity = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await deleteActivity(id);
      setActivities(activities.filter(activity => activity.id !== id));
    } catch (error) {
      console.error('Fehler beim Löschen der Aktivität:', error);
      setError('Aktivität konnte nicht gelöscht werden. Bitte versuchen Sie es später erneut.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Lade Aktivitäten...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meine Aktivitäten</h1>
      {activities.length === 0 ? (
        <p className="text-center">Sie haben noch keine Aktivitäten erstellt.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => handleEditActivity(activity.id)}
              onDelete={() => handleDeleteActivity(activity.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserActivitiesView;