import React from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import ScoreDisplay from './score-display';
import ScoreBreakdown from './score-breakdown';
import SeoSummary from './seo-summary';
import PreviewSection from './preview-section';
import RecommendationsSection from './recommendations-section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const summaryItems: Array<{ name: string; status: 'success' | 'warning' | 'error' }> = [
    { name: 'Title Tag', status: (result.metaTags.items.find(i => i.name === 'Title')?.status || 'error') as 'success' | 'warning' | 'error' },
    { name: 'Meta Description', status: (result.metaTags.items.find(i => i.name === 'Description')?.status || 'error') as 'success' | 'warning' | 'error' },
    { name: 'Open Graph', status: result.socialMedia.items.some(i => i.name.startsWith('og:') && i.status === 'success') ? 'success' : 'error' },
    { name: 'Twitter Cards', status: result.socialMedia.items.some(i => i.name.startsWith('twitter:') && i.status === 'success') ? 'success' : 'warning' },
    { name: 'Canonical URL', status: (result.metaTags.items.find(i => i.name === 'Canonical URL')?.status || 'error') as 'success' | 'warning' | 'error' }
  ];

  return (
    <div className="mb-8">
      <Card className="mb-6 border-neutral-200 shadow-md">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <ScoreDisplay score={result.totalScore} rating={result.scoreRating} />
          
          <div className="flex-grow text-center sm:text-left">
            <h2 className="text-xl font-semibold mb-2 text-neutral-800">
              SEO Score: <span className="text-primary-600">{result.scoreRating}</span>
            </h2>
            <p className="text-neutral-600 mb-3 text-sm sm:text-base">
              Analyzed <span className="font-semibold">{result.url}</span> 
              <br className="sm:hidden" /> 
              <span className="hidden sm:inline"> • </span>
              Last check: <span>{result.analyzedAt}</span>
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {summaryItems.map((item, index) => {
                const status = item.status as 'success' | 'warning' | 'error';
                return (
                  <Badge
                    key={index}
                    variant={getBadgeVariant(status) as any}
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    <span className="material-icons text-xs">{getStatusIcon(status)}</span>
                    <span>{item.name}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Button 
              variant="outline"
              onClick={handleShareResults}
              className="w-full sm:w-auto"
            >
              <span className="material-icons text-sm mr-2">share</span>
              Share Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <SeoSummary 
        metaTags={result.metaTags}
        socialMedia={result.socialMedia}
        technicalSeo={result.technicalSeo}
      />

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
