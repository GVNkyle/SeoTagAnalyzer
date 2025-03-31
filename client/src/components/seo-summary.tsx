import React from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface SeoSummaryProps {
  metaTags: SeoAnalysisResult['metaTags'];
  socialMedia: SeoAnalysisResult['socialMedia'];
  technicalSeo: SeoAnalysisResult['technicalSeo'];
}

const SeoSummary: React.FC<SeoSummaryProps> = ({ metaTags, socialMedia, technicalSeo }) => {
  const isMobile = useIsMobile();
  
  // Calculate total counts for each status across all categories
  const statusCounts = {
    success: 0,
    warning: 0,
    error: 0,
    total: 0
  };
  
  // Count statuses for all items
  const allItems = [
    ...metaTags.items,
    ...socialMedia.items,
    ...technicalSeo.items
  ];
  
  allItems.forEach(item => {
    statusCounts[item.status]++;
    statusCounts.total++;
  });
  
  // Calculate percentages
  const successPercent = Math.round((statusCounts.success / statusCounts.total) * 100);
  const warningPercent = Math.round((statusCounts.warning / statusCounts.total) * 100);
  const errorPercent = Math.round((statusCounts.error / statusCounts.total) * 100);
  
  // Category-specific metrics
  const categories = [
    { 
      name: 'Core Meta Tags', 
      score: metaTags.score, 
      description: 'Basic meta tags like title, description & canonical URL',
      icon: 'description'
    },
    { 
      name: 'Social Media', 
      score: socialMedia.score, 
      description: 'Tags for sharing on social media platforms',
      icon: 'share'
    },
    { 
      name: 'Technical SEO', 
      score: technicalSeo.score, 
      description: 'Technical aspects like mobile-friendliness & SSL',
      icon: 'code'
    }
  ];
  
  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Get background color for metrics
  const getBackgroundColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 70) return 'bg-emerald-100 border-emerald-200';
    if (score >= 50) return 'bg-amber-100 border-amber-200';
    return 'bg-red-100 border-red-200';
  };
  
  // Get progress bar color based on score
  const getProgressClass = (score: number): string => {
    if (score >= 90) return '[&>div]:bg-green-500';
    if (score >= 70) return '[&>div]:bg-emerald-500';
    if (score >= 50) return '[&>div]:bg-amber-500';
    return '[&>div]:bg-red-500';
  };
  
  return (
    <Card className="mb-6 border-neutral-200 shadow-md">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">SEO Summary</h3>
        
        {/* Overall status visualization */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium">Overall Implementation Status</h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Implemented ({successPercent}%)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                Warnings ({warningPercent}%)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                Missing ({errorPercent}%)
              </span>
            </div>
          </div>
          <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-green-500 h-full" 
                style={{ width: `${successPercent}%` }}
                title={`${successPercent}% implemented`}
              ></div>
              <div 
                className="bg-amber-500 h-full" 
                style={{ width: `${warningPercent}%` }}
                title={`${warningPercent}% with warnings`}
              ></div>
              <div 
                className="bg-red-500 h-full" 
                style={{ width: `${errorPercent}%` }}
                title={`${errorPercent}% missing or errors`}
              ></div>
            </div>
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            {statusCounts.success} implemented, {statusCounts.warning} warnings, {statusCounts.error} missing out of {statusCounts.total} total factors
          </div>
        </div>
        
        {/* Category scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getBackgroundColor(category.score)}`}>
              <div className="flex items-center mb-2">
                <span className={`material-icons text-xl mr-2 ${getScoreColor(category.score)}`}>
                  {category.icon}
                </span>
                <h4 className="font-medium text-neutral-800">{category.name}</h4>
              </div>
              
              <div className="flex items-center mb-1.5">
                <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                  {category.score}
                </span>
                <span className="text-sm text-neutral-500 ml-1">/100</span>
              </div>
              
              <div className="mb-2.5">
                <Progress 
                  value={category.score} 
                  className={`h-2 bg-neutral-200 ${getProgressClass(category.score)}`}
                />
              </div>
              
              <p className="text-xs text-neutral-600">{category.description}</p>
            </div>
          ))}
        </div>
        
        {/* Tips for beginners */}
        <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
          <div className="flex">
            <span className="material-icons text-blue-500 mr-2">lightbulb</span>
            <div>
              <p className="text-blue-800 font-medium mb-1">What do these scores mean?</p>
              <p className="text-blue-700 text-xs">Higher scores indicate better SEO implementation. Scroll down to see detailed recommendations for improving your scores.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoSummary;