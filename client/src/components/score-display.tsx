import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  rating: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showRating?: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  rating, 
  size = 'large',
  className,
  showRating = true
}) => {
  // Determine gradient colors based on score
  const getGradientColors = () => {
    if (score < 50) return 'from-red-400 to-red-600'; // Poor
    if (score < 70) return 'from-amber-400 to-amber-600'; // Fair
    if (score < 90) return 'from-green-400 to-primary-600'; // Good
    return 'from-green-400 to-emerald-600'; // Excellent
  };

  // Determine emoji icon based on rating
  const getEmoji = () => {
    if (rating === 'Poor') return 'sentiment_very_dissatisfied';
    if (rating === 'Fair') return 'sentiment_dissatisfied';
    if (rating === 'Good') return 'sentiment_satisfied';
    return 'sentiment_very_satisfied'; // Excellent
  };

  // Determine color based on rating
  const getRatingColor = () => {
    if (rating === 'Poor') return 'text-red-500';
    if (rating === 'Fair') return 'text-amber-500';
    if (rating === 'Good') return 'text-green-500';
    return 'text-emerald-500'; // Excellent
  };

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          wrapper: 'w-20 h-20',
          score: 'text-xl',
          badge: 'w-7 h-7 -top-1 -right-1 text-sm',
          label: 'text-xs mt-1'
        };
      case 'medium':
        return {
          wrapper: 'w-28 h-28',
          score: 'text-3xl',
          badge: 'w-8 h-8 -top-1 -right-1 text-lg',
          label: 'text-sm mt-2'
        };
      case 'large':
      default:
        return {
          wrapper: 'w-32 h-32 sm:w-36 sm:h-36',
          score: 'text-4xl sm:text-5xl',
          badge: 'w-10 h-10 -top-2 -right-2 text-xl',
          label: 'text-base mt-2'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // Visual indicator of score with circle progress
  const circumference = 2 * Math.PI * 47; // 2πr where r=47 (for SVG)
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex-shrink-0 flex flex-col items-center justify-center", className)}>
      <div className="relative inline-flex">
        {/* Main score circle */}
        <div className={cn(
          "rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg relative",
          getGradientColors(),
          sizeClasses.wrapper
        )}>
          {/* Circle progress overlay */}
          <svg className="absolute inset-0 w-full h-full rotate-270">
            <circle 
              cx="50%" 
              cy="50%" 
              r="47%" 
              strokeWidth="4" 
              stroke="rgba(255,255,255,0.3)" 
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={0}
            />
            <circle 
              cx="50%" 
              cy="50%" 
              r="47%" 
              strokeWidth="4" 
              stroke="rgba(255,255,255,0.9)" 
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          
          {/* Score text */}
          <div className="text-center z-10 text-white">
            <span className={cn("font-bold", sizeClasses.score)}>{score}</span>
            <span className="font-medium text-xs ml-0.5 opacity-80">/100</span>
          </div>
        </div>
        
        {/* Rating icon badge */}
        <div className={cn(
          "absolute bg-white shadow-md rounded-full flex items-center justify-center border-2",
          sizeClasses.badge,
          score < 50 ? 'border-red-400' : 
          score < 70 ? 'border-amber-400' : 
          score < 90 ? 'border-green-400' : 
          'border-emerald-400'
        )}>
          <span className={cn("material-icons", getRatingColor())}>
            {getEmoji()}
          </span>
        </div>
      </div>
      
      {/* Rating text */}
      {showRating && (
        <div className={cn(
          "font-medium flex items-center", 
          getRatingColor(),
          sizeClasses.label
        )}>
          {rating}
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
