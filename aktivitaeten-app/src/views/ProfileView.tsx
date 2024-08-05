import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, UserProfile, UserProfileUpdate } from '../services/api';
import Toast from '../components/Toast';

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileUpdate | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setToast({ message: 'Fehler beim Laden des Profils', type: 'error' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProfile) {
      try {
        await updateUserProfile(editedProfile);
        setProfile(editedProfile as UserProfile);
        setEditMode(false);
        setToast({ message: 'Profil erfolgreich aktualisiert', type: 'success' });
      } catch (error) {
        console.error('Error updating profile:', error);
        setToast({ message: 'Fehler beim Aktualisieren des Profils', type: 'error' });
      }
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Benutzerprofil</h1>
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Vorname</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={editedProfile?.firstName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nachname</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={editedProfile?.lastName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="alias" className="block text-sm font-medium text-gray-700">Alias</label>
            <input
              type="text"
              id="alias"
              name="alias"
              value={editedProfile?.alias || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Geburtsdatum</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={editedProfile?.birthDate || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefonnummer</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={editedProfile?.phoneNumber || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedProfile?.email || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Geschlecht</label>
            <select
              id="gender"
              name="gender"
              value={editedProfile?.gender || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="MALE">Männlich</option>
              <option value="FEMALE">Weiblich</option>
              <option value="OTHER">Divers</option>
              <option value="PREFER_NOT_TO_SAY">Keine Angabe</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Speichern
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p><strong>Benutzername:</strong> {profile.username}</p>
          <p><strong>Vorname:</strong> {profile.firstName}</p>
          <p><strong>Nachname:</strong> {profile.lastName}</p>
          <p><strong>Alias:</strong> {profile.alias}</p>
          <p><strong>Geburtsdatum:</strong> {profile.birthDate}</p>
          <p><strong>Telefonnummer:</strong> {profile.phoneNumber}</p>
          <p><strong>E-Mail:</strong> {profile.email}</p>
          <p><strong>Geschlecht:</strong> {profile.gender}</p>
          <p><strong>Rolle:</strong> {profile.role}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Profil bearbeiten
          </button>
        </div>
      )}
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

export default ProfileView;