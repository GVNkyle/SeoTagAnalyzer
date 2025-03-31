import React from 'react';

interface ScoreDisplayProps {
  score: number;
  rating: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, rating }) => {
  // Determine color based on score
  const getGradientColors = () => {
    if (score < 50) return 'from-red-400 to-red-500'; // Poor
    if (score < 70) return 'from-amber-400 to-amber-500'; // Fair
    if (score < 90) return 'from-green-400 to-primary-500'; // Good
    return 'from-green-400 to-emerald-500'; // Excellent
  };

  // Determine thumb icon based on rating
  const getThumbIcon = () => {
    if (score < 50) return 'thumb_down';
    if (score < 70) return 'thumbs_up_down';
    return 'thumb_up';
  };

  // Determine thumb icon color based on rating
  const getThumbColor = () => {
    if (score < 50) return 'text-red-500';
    if (score < 70) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="relative inline-flex">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${getGradientColors()} text-white`}>
          <span className="text-2xl font-bold">{score}</span>
        </div>
        <div className="absolute -top-2 -right-2 bg-white shadow-sm rounded-full p-1">
          <span className={`material-icons ${getThumbColor()}`}>{getThumbIcon()}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
