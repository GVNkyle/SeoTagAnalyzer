import React from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScoreBreakdownProps {
  metaTags: SeoAnalysisResult['metaTags'];
  socialMedia: SeoAnalysisResult['socialMedia'];
  technicalSeo: SeoAnalysisResult['technicalSeo'];
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ metaTags, socialMedia, technicalSeo }) => {
  // Helper function to determine badge variant based on score
  const getScoreBadgeVariant = (score: number) => {
    if (score < 50) return 'destructive';
    if (score < 70) return 'warning';
    return 'success';
  };

  // Helper function to get icon based on status
  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'cancel';
      default:
        return '';
    }
  };

  // Helper function to get text color based on status
  const getStatusTextColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Core Meta Tags */}
      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-neutral-800">Core Meta Tags</h3>
            <Badge 
              variant={getScoreBadgeVariant(metaTags.score) as any}
              className="text-xs px-2 py-1"
            >
              {metaTags.score}/100
            </Badge>
          </div>
          <ul className="space-y-3">
            {metaTags.items.map((tag, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`material-icons text-sm ${getStatusTextColor(tag.status)}`}>
                    {getStatusIcon(tag.status)}
                  </span>
                </div>
                <div className="ml-2 overflow-hidden">
                  <p className="text-sm font-medium text-neutral-800">{tag.name}</p>
                  <p className="text-xs text-neutral-500 break-words">
                    <span className="font-mono inline-block max-w-full truncate">{tag.value || 'Missing'}</span>
                    {tag.message && <span className="block text-xs italic mt-1">{tag.message}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Social Media Tags */}
      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-neutral-800">Social Media Tags</h3>
            <Badge 
              variant={getScoreBadgeVariant(socialMedia.score) as any}
              className="text-xs px-2 py-1"
            >
              {socialMedia.score}/100
            </Badge>
          </div>
          <ul className="space-y-3">
            {socialMedia.items.map((tag, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`material-icons text-sm ${getStatusTextColor(tag.status)}`}>
                    {getStatusIcon(tag.status)}
                  </span>
                </div>
                <div className="ml-2 overflow-hidden">
                  <p className="text-sm font-medium text-neutral-800">{tag.name}</p>
                  <p className="text-xs text-neutral-500 break-words">
                    <span className="font-mono inline-block max-w-full truncate">{tag.value || 'Missing'}</span>
                    {tag.message && <span className="block text-xs italic mt-1">{tag.message}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Technical SEO */}
      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-neutral-800">Technical SEO</h3>
            <Badge 
              variant={getScoreBadgeVariant(technicalSeo.score) as any}
              className="text-xs px-2 py-1"
            >
              {technicalSeo.score}/100
            </Badge>
          </div>
          <ul className="space-y-3">
            {technicalSeo.items.map((tag, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`material-icons text-sm ${getStatusTextColor(tag.status)}`}>
                    {getStatusIcon(tag.status)}
                  </span>
                </div>
                <div className="ml-2 overflow-hidden">
                  <p className="text-sm font-medium text-neutral-800">{tag.name}</p>
                  <p className="text-xs text-neutral-500 break-words">
                    <span className="font-mono inline-block max-w-full truncate">{tag.value || 'Missing'}</span>
                    {tag.message && <span className="block text-xs italic mt-1">{tag.message}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreBreakdown;
