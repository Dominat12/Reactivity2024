import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityList from '../components/ActivityList';
import ActivityFilter from '../components/ActivityFilter';
import ActivitySort from '../components/ActivitySort';
import { getActivities, Activity } from '../services/api';

const ActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'id'>('id');
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Aktivitäten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedActivities = activities
    .filter(activity =>
      (activity.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        activity.description.toLowerCase().includes(filterValue.toLowerCase())) &&
      activity.rating >= minRating
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.id - a.id;
    });

  const handleEditActivity = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteActivity = async (id: number) => {
    // Implement delete logic here
  };

  const handleParticipate = async (id: number) => {
    // Implement participate logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Aktivitäten</h1>
      <div className="mb-6">
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
        isLoading={isLoading}
      />
    </div>
  );
};

export default ActivitiesView;