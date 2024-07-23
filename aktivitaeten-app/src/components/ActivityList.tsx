import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '../services/api';
import ActivityCard from './ActivityCard';
import ActivitySkeleton from './ActivitySkeleton';

interface ActivityListProps {
  activities: Activity[];
  onEditActivity: (id: number) => void;
  onDeleteActivity: (id: number) => void;
  onParticipate: (id: number) => void;
  isLoading: boolean; // Add this prop
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  onEditActivity, 
  onDeleteActivity, 
  onParticipate,
  isLoading // Add this prop
}) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading ? (
        [...Array(6)].map((_, index) => (
          <ActivitySkeleton key={index} />
        ))
      ) : (
        activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActivityCard 
              activity={activity} 
              onParticipate={onParticipate}
              onEdit={() => onEditActivity(activity.id)}
              onDelete={() => onDeleteActivity(activity.id)}
            />
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default ActivityList;