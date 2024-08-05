import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star, DollarSign, UserPlus, Edit, Trash, Crown } from 'lucide-react';
import { Activity } from '../services/api';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface ActivityCardProps {
  activity: Activity;
  onParticipate?: (id: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onParticipate, onEdit, onDelete }) => {
  const isActivityFull = activity.participants.length >= activity.maxParticipants;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
      {activity.currentUserCreator && (
        <Tippy content="Du bist der Ersteller dieser Aktivität">
          <div className="absolute top-2 right-2 bg-claude-yellow text-white p-1 rounded-full cursor-pointer">
            <Crown size={16} />
          </div>
        </Tippy>
      )}
      <Link to={`/activity/${activity.id}`}>
        <img src={activity.imagePath} alt={activity.name} className="w-full h-48 object-cover rounded-md mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-claude-text">{activity.name}</h3>
      </Link>
      <div className="space-y-2 text-sm text-claude-subtext">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{activity.location}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>{new Date(activity.startTime).toLocaleString()} - {activity.endTime ? new Date(activity.endTime).toLocaleString() : 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{activity.minPrice} - {activity.maxPrice}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-claude-yellow mr-1" />
            <span>{activity.rating}</span>
          </div>
        </div>

        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{activity.minParticipants} - {activity.maxParticipants} Teilnehmer</span>
          </div>
        </div>


        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{activity.participants.length} / {activity.maxParticipants} Teilnehmer</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">

        {activity.currentUserCreator ? (
          <>
            <button
              className="text-claude-subtext hover:text-claude-text transition-colors duration-300"
              onClick={onEdit}
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              className="text-claude-subtext hover:text-claude-red transition-colors duration-300"
              onClick={onDelete}
            >
              <Trash className="w-5 h-5" />
            </button>
          </>
        ) : isActivityFull ? (
          <span className="text-claude-subtext">Aktivität voll</span>
        ) : null}
      </div>
    </div>
  );
};

export default ActivityCard;
