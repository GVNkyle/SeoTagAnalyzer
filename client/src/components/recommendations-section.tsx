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
    <Card className="border-neutral-200 shadow-md">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">Recommendations for Improvement</h3>
        <ul className="space-y-6">
          {recommendations.map((recommendation, index) => (
            <li 
              key={index} 
              className={`flex flex-col sm:flex-row gap-3 ${index < recommendations.length - 1 ? 'pb-6 border-b border-neutral-100' : ''}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  recommendation.priority === 'high' ? 'bg-red-100' :
                  recommendation.priority === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  <span className={`material-icons text-xl ${getPriorityTextColor(recommendation.priority)}`}>
                    {getPriorityIcon(recommendation.priority)}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className="text-base font-medium text-neutral-800">{recommendation.title}</h4>
                  <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                    recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                    recommendation.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {recommendation.priority === 'high' ? 'High priority' :
                     recommendation.priority === 'medium' ? 'Medium priority' : 
                     'Low priority'}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">
                  {recommendation.description}
                </p>
                {recommendation.code && (
                  <div className="mt-3 p-3 sm:p-4 bg-neutral-50 border border-neutral-200 rounded-md overflow-x-auto">
                    <code className="text-xs sm:text-sm text-neutral-800 font-mono whitespace-pre-wrap break-all block">
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
