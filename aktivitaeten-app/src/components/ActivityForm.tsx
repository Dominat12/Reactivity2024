import React, { useState, useEffect } from 'react';
import { Activity, ActivityInput } from '../services/api';

interface ActivityFormProps {
  onAddActivity?: (activity: ActivityInput) => void;
  onUpdateActivity: (activity: ActivityInput) => void;
  editingActivity: Activity | null;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onAddActivity, onUpdateActivity, editingActivity }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(1);
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minParticipants, setMinParticipants] = useState(1);
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [imagePath, setImagePath] = useState('/images/default-activity.jpg');

  useEffect(() => {
    if (editingActivity) {
      setName(editingActivity.name);
      setDescription(editingActivity.description);
      setRating(editingActivity.rating);
      setLocation(editingActivity.location);
      setStartTime(editingActivity.startTime.slice(0, 16)); // Format für datetime-local input
      setEndTime(editingActivity.endTime ? editingActivity.endTime.slice(0, 16) : '');
      setMinPrice(editingActivity.minPrice);
      setMaxPrice(editingActivity.maxPrice);
      setMinParticipants(editingActivity.minParticipants);
      setMaxParticipants(editingActivity.maxParticipants);
      setImagePath(editingActivity.imagePath);
    } else {
      resetForm();
    }
  }, [editingActivity]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setRating(1);
    setLocation('');
    setStartTime('');
    setEndTime('');
    setMinPrice(0);
    setMaxPrice(0);
    setMinParticipants(1);
    setMaxParticipants(1);
    setImagePath('/images/default-activity.jpg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activityData: ActivityInput = {
      name,
      description,
      rating,
      location,
      startTime,
      endTime: endTime || null,
      minPrice,
      maxPrice,
      minParticipants,
      maxParticipants,
      imagePath
    };

    if (editingActivity) {
      onUpdateActivity(activityData);
    } else if (onAddActivity) {
      onAddActivity(activityData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Beschreibung</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Bewertung</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ort</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Startzeit</label>
        <input
          type="datetime-local"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Endzeit (optional)</label>
        <input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Mindestpreis</label>
        <input
          type="number"
          id="minPrice"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Höchstpreis</label>
        <input
          type="number"
          id="maxPrice"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="minParticipants" className="block text-sm font-medium text-gray-700">Mindestteilnehmer</label>
        <input
          type="number"
          id="minParticipants"
          min="1"
          value={minParticipants}
          onChange={(e) => setMinParticipants(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Maximalteilnehmer</label>
        <input
          type="number"
          id="maxParticipants"
          min="1"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="imagePath">Image Path</label>
        <input
          type="text"
          id="imagePath"
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
          className="form-input"
        />
      </div>

      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {editingActivity ? 'Aktivität aktualisieren' : 'Aktivität hinzufügen'}
      </button>
    </form>
  );
};

export default ActivityForm;