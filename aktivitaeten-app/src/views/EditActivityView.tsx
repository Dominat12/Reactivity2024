import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivity, updateActivity, Activity, ActivityInput } from '../services/api';
import ActivityForm from '../components/ActivityForm';
import Toast from '../components/Toast';

const EditActivityView: React.FC = () => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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

  const handleUpdateActivity = async (updatedActivity: ActivityInput) => {
    if (!activity) return;

    try {
      await updateActivity(activity.id, updatedActivity);
      setToast({ message: 'Aktivität erfolgreich aktualisiert', type: 'success' });
      setTimeout(() => {
        navigate(`/activity/${activity.id}`);
      }, 2000);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Aktivität:', error);
      setToast({ message: 'Aktivität konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.', type: 'error' });
    }
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
      <h1 className="text-3xl font-bold mb-6">Aktivität bearbeiten</h1>
      <ActivityForm
        onAddActivity={handleUpdateActivity}
        onUpdateActivity={handleUpdateActivity}
        editingActivity={activity}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EditActivityView;