import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivity, updateActivity, deleteActivity, joinActivity, leaveActivity, removeParticipant, Activity } from '../services/api';
import { MapPin, Clock, Users, Star, DollarSign, Calendar, ArrowLeft, Crown, Edit, Trash, UserPlus, UserMinus } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Toast from '../components/Toast';
import axios from 'axios';
import RatingComponent from '../components/RatingComponent';

const ActivityDetailView: React.FC = () => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isActivityFull = activity ? activity.participants.length >= activity.maxParticipants : false;
  const canRate = activity?.currentUserParticipant || activity?.currentUserCreator;

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

  const handleEdit = () => {
    if (activity) {
      navigate(`/edit/${activity.id}`);
    }
  };

  const handleDelete = async () => {
    if (activity && window.confirm('Möchten Sie diese Aktivität wirklich löschen?')) {
      try {
        await deleteActivity(activity.id);
        navigate('/');
      } catch (error) {
        console.error('Fehler beim Löschen der Aktivität:', error);
        setError('Aktivität konnte nicht gelöscht werden. Bitte versuchen Sie es später erneut.');
      }
    }
  };

  const handleParticipation = async () => {
    if (activity && !isActivityFull) {
      try {
        if (activity.currentUserParticipant) {
          await leaveActivity(activity.id);
        } else {
          await joinActivity(activity.id);
        }
        await fetchActivity(activity.id);
      } catch (error) {
        console.error('Fehler bei der Teilnahme/Abmeldung:', error);
        setError('Aktion konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
      }
    }
  };

  const handleRemoveParticipant = async (participantUsername: string) => {
    if (activity && window.confirm(`Möchten Sie ${participantUsername} wirklich von dieser Aktivität entfernen?`)) {
      try {
        await removeParticipant(activity.id, participantUsername);
        setToast({ message: 'Teilnehmer erfolgreich entfernt', type: 'success' });
        await fetchActivity(activity.id);
      } catch (error) {
        console.error('Fehler beim Entfernen des Teilnehmers:', error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 404) {
            setToast({ message: 'Teilnehmer oder Aktivität nicht gefunden', type: 'error' });
          } else {
            setToast({ message: `Fehler beim Entfernen des Teilnehmers: ${error.response.data.message || 'Unbekannter Fehler'}`, type: 'error' });
          }
        } else {
          setToast({ message: 'Ein unerwarteter Fehler ist aufgetreten', type: 'error' });
        }
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <img src={activity.imagePath} alt={activity.name} className="w-full h-80 object-cover" />
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          {activity.currentUserCreator && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Tippy content="Du bist der Ersteller dieser Aktivität">
                <div className="bg-claude-yellow text-white p-2 rounded-full cursor-pointer">
                  <Crown size={24} />
                </div>
              </Tippy>
              <button
                onClick={handleEdit}
                className="bg-claude-blue text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
              >
                <Edit size={24} />
              </button>
              <button
                onClick={handleDelete}
                className="bg-claude-red text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
              >
                <Trash size={24} />
              </button>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h1 className="text-4xl font-bold text-white mb-2">{activity.name}</h1>
            <div className="flex items-center text-white">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{activity.location}</span>
            </div>
          </div>
        </div>
  
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Dauer</p>
                <p className="font-semibold">{new Date(activity.startTime).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-6 h-6 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Gruppengröße</p>
                <p className="font-semibold">{activity.minParticipants}-{activity.maxParticipants}</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Preis</p>
                <p className="font-semibold">{activity.minPrice}€ - {activity.maxPrice}€</p>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="w-6 h-6 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Bewertung</p>
                <p className="font-semibold">{activity.rating}/5</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Beschreibung</h2>
            <p className="text-gray-700">{activity.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Teilnehmer</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">{activity.participants.length}/{activity.maxParticipants}</span>
              <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${(activity.participants.length / activity.maxParticipants) * 100}%`}}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Teilnehmerliste:</h3>
              <ul className="list-disc list-inside">
                {activity.participants.map((participant) => (
                  <li key={participant.id} className="flex items-center justify-between">
                    <span>{participant.username}</span>
                    {activity.currentUserCreator && (
                      <button
                        onClick={() => handleRemoveParticipant(participant.username)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Neue Sektion für Bewertungen */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Bewertung</h2>
            <RatingComponent activityId={activity.id} canRate={canRate} />
          </div>
          
          {activity.currentUserParticipant ? (
            <button 
              className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
              onClick={handleParticipation}
            >
              <UserMinus className="w-5 h-5 mr-2" />
              Teilnahme stornieren
            </button>
          ) : isActivityFull ? (
            <div className="text-claude-subtext mt-4 text-center p-3 bg-gray-100 rounded-lg">
              Diese Aktivität ist leider bereits voll. Sie können sich nicht mehr anmelden.
            </div>
          ) : activity.currentUserCreator ? (
            <div className="text-claude-subtext mt-4 text-center p-3 bg-gray-100 rounded-lg">
              Du bist der Ersteller dieser Aktivität.
            </div>
          ) : (
            <button 
              className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
              onClick={handleParticipation}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Jetzt teilnehmen
            </button>
          )}
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

export default ActivityDetailView;