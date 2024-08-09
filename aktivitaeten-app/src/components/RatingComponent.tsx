import React, { useState, useEffect } from 'react';
import { getUserRating, rateActivity, Rating } from '../services/api';
import { Smile, Meh, Frown, SmilePlus } from 'lucide-react';

interface RatingComponentProps {
  activityId: number;
  canRate: boolean;
}



const RatingComponent: React.FC<RatingComponentProps> = ({ activityId, canRate }) => {
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    fetchUserRating();
  }, [activityId]);

  const fetchUserRating = async () => {
    try {
      setIsLoading(true);
      const response = await getUserRating(activityId);
      setUserRating(response.data);
    } catch (error) {
      console.error('Error fetching user rating:', error);
      setError('Could not fetch your rating. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (score: number) => {
    if (!canRate) return;

    try {
      const response = await rateActivity(activityId, score);
      setUserRating(response.data);
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Could not submit your rating. Please try again later.');
    }
  };

  const renderSmiley = (score: number) => {
    switch (score) {
      case 1: return <Frown size={24} />; // Wir verwenden Frown statt FrownOpen
      case 2: return <Frown size={24} />;
      case 3: return <Meh size={24} />;
      case 4: return <Smile size={24} />;
      case 5: return <SmilePlus size={24} />;
      default: return null;
    }
  };

  if (isLoading) return <div>Loading rating...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => handleRating(score)}
            disabled={!canRate}
            className={`p-2 rounded-full ${
              userRating?.score === score ? 'bg-claude-yellow' : 'bg-gray-200'
            } ${canRate ? 'hover:bg-claude-yellow' : ''} transition-colors`}
          >
            {renderSmiley(score)}
          </button>
        ))}
      </div>
      {userRating && (
        <p className="mt-2">Your rating: {userRating.score}/5</p>
      )}
    </div>
  );
};

export default RatingComponent;