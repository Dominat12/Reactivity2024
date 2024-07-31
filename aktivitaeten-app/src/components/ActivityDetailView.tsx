import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivity, Activity } from '../services/api';
import ActivityForm from '../components/ActivityForm';

const ActivityDetailView: React.FC = () => {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchActivity(parseInt(id));
    }
  }, [id]);

  const fetchActivity = async (activityId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getActivity(activityId);
      setActivity(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Aktivität:', error);
      setError('Aktivität konnte nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    // Implement update logic here
    navigate('/');
  };

  if (isLoading) {
    return <div className="text-center mt-8">Lade Aktivität...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!activity) {
    return <div className="text-center mt-8">Aktivität nicht gefunden.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Aktivität Details</h1>
      <ActivityForm
        onUpdateActivity={handleUpdateActivity}
        editingActivity={activity}
      />
    </div>
  );
};

export default ActivityDetailView;