import React from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import ScoreDisplay from './score-display';
import ScoreBreakdown from './score-breakdown';
import PreviewSection from './preview-section';
import RecommendationsSection from './recommendations-section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResultProps {
  result: SeoAnalysisResult;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const { toast } = useToast();

  const handleShareResults = () => {
    // Copy the URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this analysis with others",
      });
    }).catch(err => {
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy the URL manually",
        variant: "destructive",
      });
    });
  };

  // Determine status badge type based on name
  const getBadgeVariant = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return '';
    }
  };

  // Get items from all categories to show summary badges
  const allItems = [
    ...result.metaTags.items,
    ...result.socialMedia.items,
    ...result.technicalSeo.items
  ];

  // Get items for summary badges (max 5)
  const summaryItems = [
    { name: 'Title Tag', status: result.metaTags.items.find(i => i.name === 'Title')?.status || 'error' },
    { name: 'Meta Description', status: result.metaTags.items.find(i => i.name === 'Description')?.status || 'error' },
    { name: 'Open Graph', status: result.socialMedia.items.some(i => i.name.startsWith('og:') && i.status === 'success') ? 'success' : 'error' },
    { name: 'Twitter Cards', status: result.socialMedia.items.some(i => i.name.startsWith('twitter:') && i.status === 'success') ? 'success' : 'warning' },
    { name: 'Canonical URL', status: result.metaTags.items.find(i => i.name === 'Canonical URL')?.status || 'error' }
  ];

  return (
    <div className="mb-8">
      <Card className="mb-6">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <ScoreDisplay score={result.totalScore} rating={result.scoreRating} />
          
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-1 text-neutral-800">SEO Score: {result.scoreRating}</h2>
            <p className="text-neutral-600 mb-3">
              Analyzed <span className="font-semibold">{result.url}</span> • Last check: <span>{result.analyzedAt}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {summaryItems.map((item, index) => (
                <Badge
                  key={index}
                  variant={getBadgeVariant(item.status) as any}
                  className="flex items-center space-x-1"
                >
                  <span className="material-icons text-xs">{getStatusIcon(item.status)}</span>
                  <span>{item.name}</span>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <button 
              type="button"
              onClick={handleShareResults}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="material-icons text-sm mr-2">share</span>
              Share Results
            </button>
          </div>
        </CardContent>
      </Card>

      <ScoreBreakdown 
        metaTags={result.metaTags}
        socialMedia={result.socialMedia}
        technicalSeo={result.technicalSeo}
      />

      <PreviewSection 
        googlePreview={result.previews.google}
        socialPreview={result.previews.social}
      />

      <RecommendationsSection recommendations={result.recommendations} />
    </div>
  );
};

export default AnalysisResult;
