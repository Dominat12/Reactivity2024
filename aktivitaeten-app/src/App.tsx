import React, { useState, useEffect, useMemo } from 'react';
import ActivityList from './components/ActivityList';
import ActivityForm from './components/ActivityForm';
import ActivityFilter from './components/ActivityFilter';
import ActivitySort from './components/ActivitySort';
import Toast from './components/Toast';
import { getActivities, createActivity, updateActivity, deleteActivity, Activity, ActivityInput } from './services/api';

type SortOption = 'name' | 'rating' | 'id';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true); // Set loading to true before fetching
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Aktivitäten:', error);
      setToast({ message: 'Fehler beim Laden der Aktivitäten', type: 'error' });
    } finally {
      setIsLoading(false); // Set loading to false after fetching (whether it succeeded or failed)
    }
  };

  const filteredAndSortedActivities = useMemo(() => {
    return activities
      .filter(activity =>
        (activity.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          activity.description.toLowerCase().includes(filterValue.toLowerCase())) &&
        activity.rating >= minRating
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.id - a.id; // 'id' sort (most recent first)
      });
  }, [activities, filterValue, minRating, sortBy]);


  const handleEditActivity = (id: number) => {
    const activityToEdit = activities.find(a => a.id === id);
    if (activityToEdit) {
      setEditingActivity(activityToEdit);
    }
  };

  const handleAddActivity = async (newActivity: ActivityInput) => {
    try {
      const response = await createActivity(newActivity);
      setActivities([...activities, response.data]);
      setToast({ message: 'Aktivität erfolgreich hinzugefügt', type: 'success' });
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Aktivität:', error);
      setToast({ message: 'Fehler beim Hinzufügen der Aktivität', type: 'error' });
    }
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    try {
      await updateActivity(updatedActivity.id, updatedActivity);
      setActivities(activities.map(a => a.id === updatedActivity.id ? updatedActivity : a));
      setEditingActivity(null);
      setToast({ message: 'Aktivität erfolgreich aktualisiert', type: 'success' });
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Aktivität:', error);
      setToast({ message: 'Fehler beim Aktualisieren der Aktivität', type: 'error' });
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await deleteActivity(id);
      setActivities(activities.filter(a => a.id !== id));
      setToast({ message: 'Aktivität erfolgreich gelöscht', type: 'success' });
    } catch (error) {
      console.error('Fehler beim Löschen der Aktivität:', error);
      setToast({ message: 'Fehler beim Löschen der Aktivität', type: 'error' });
    }
  };

  const handleParticipate = async (id: number) => {
    // Hier können Sie die Logik für die Teilnahme implementieren
    // z.B. API-Aufruf zum Aktualisieren der Teilnehmerzahl
    console.log(`Teilnahme an Aktivität ${id} geändert`);
  };

  return (
    <div className="min-h-screen bg-claude-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-claude-text">Aktivitäten-Anwendung</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Aktivitäten Liste</h2>
              <ActivityFilter
                onFilterChange={setFilterValue}
                onRatingFilterChange={setMinRating}
              />
              <ActivitySort onSortChange={setSortBy} />
            </div>
            <ActivityList
              activities={filteredAndSortedActivities}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onParticipate={handleParticipate}
              isLoading={isLoading} // Pass isLoading to ActivityList
            />
          </div>
          <div className="space-y-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {editingActivity ? 'Aktivität bearbeiten' : 'Aktivität hinzufügen'}
              </h2>
              <ActivityForm
                onAddActivity={handleAddActivity}
                onUpdateActivity={handleUpdateActivity}
                editingActivity={editingActivity}
              />
            </div>
          </div>
        </div>
      </div>
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

export default App;