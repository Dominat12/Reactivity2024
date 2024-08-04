import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivity, updateActivity, deleteActivity, participateInActivity, Activity } from '../services/api';
import { MapPin, Clock, Users, Star, DollarSign, Calendar, ArrowLeft, Crown, Edit, Trash, UserPlus, UserMinus } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ActivityDetailView: React.FC = () => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);
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
      // Here you would typically check if the current user is participating
      // setIsParticipating(checkIfUserIsParticipating(response.data));
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
    if (activity && !activity.currentUserCreator) {
      try {
        await participateInActivity(activity.id);
        setIsParticipating(!isParticipating);
        // Hier würden Sie normalerweise die Aktivität neu laden oder den Teilnehmerstatus aktualisieren
      } catch (error) {
        console.error('Fehler bei der Teilnahme/Abmeldung:', error);
        setError('Aktion konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.');
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
            <div className="flex items-center justify-between">
              <span className="text-gray-700">3/{activity.maxParticipants}</span>
              <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${(3 / activity.maxParticipants) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
          
          {activity.currentUserCreator ? (
            <div className="text-claude-subtext mt-4">
              Dies ist deine eigene Aktivität. Du kannst nicht als Teilnehmer beitreten.
            </div>
          ) : (
            <button 
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors duration-300 flex items-center justify-center ${
                isParticipating
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={handleParticipation}
            >
              {isParticipating ? (
                <>
                  <UserMinus className="w-5 h-5 mr-2" />
                  Teilnahme stornieren
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Jetzt teilnehmen
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailView;