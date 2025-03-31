import React from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';

interface RecommendationsSectionProps {
  recommendations: SeoAnalysisResult['recommendations'];
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations }) => {
  // If no recommendations, show a positive message
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center flex-col py-6">
            <span className="material-icons text-4xl text-green-500 mb-2">check_circle</span>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">Great Job!</h3>
            <p className="text-neutral-600 text-center max-w-md">
              No recommendations found. Your website's SEO implementation appears to be excellent!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get icon based on priority
  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'priority_high';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return '';
    }
  };

  // Get text color based on priority
  const getPriorityTextColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-blue-500';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">Recommendations for Improvement</h3>
        <ul className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <li 
              key={index} 
              className={`flex items-start ${index < recommendations.length - 1 ? 'pb-4 border-b border-neutral-100' : ''}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <span className={`material-icons ${getPriorityTextColor(recommendation.priority)}`}>
                  {getPriorityIcon(recommendation.priority)}
                </span>
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-neutral-800">{recommendation.title}</h4>
                <p className="text-sm text-neutral-600 mt-1">
                  {recommendation.description}
                </p>
                {recommendation.code && (
                  <div className="mt-2 p-3 bg-neutral-50 rounded-md font-mono">
                    <code className="text-sm text-neutral-800 whitespace-pre-wrap break-all">
                      {recommendation.code}
                    </code>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationsSection;
