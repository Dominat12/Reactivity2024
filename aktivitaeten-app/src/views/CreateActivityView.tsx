import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityForm from '../components/ActivityForm';
import { createActivity, ActivityInput } from '../services/api';

const CreateActivityView: React.FC = () => {
  const navigate = useNavigate();

  const handleAddActivity = async (newActivity: ActivityInput) => {
    try {
      await createActivity(newActivity);
      navigate('/');
    } catch (error) {
      console.error('Fehler beim Erstellen der Aktivität:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Neue Aktivität erstellen</h1>
      <ActivityForm
        onAddActivity={handleAddActivity}
        onUpdateActivity={() => {}}
        editingActivity={null}
      />
    </div>
  );
};

export default CreateActivityView;