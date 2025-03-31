import React from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import VisualFactorList from './visual-factor-list';
import { scoreToRating } from '@/lib/seo-utils';

interface ScoreBreakdownProps {
  metaTags: SeoAnalysisResult['metaTags'];
  socialMedia: SeoAnalysisResult['socialMedia'];
  technicalSeo: SeoAnalysisResult['technicalSeo'];
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ metaTags, socialMedia, technicalSeo }) => {
  return (
    <div className="space-y-6 mb-6">
      {/* Core Meta Tags */}
      <VisualFactorList 
        title="Core Meta Tags"
        description="Basic HTML meta tags that define core SEO properties"
        factors={metaTags.items}
        icon="description"
        score={metaTags.score}
      />
      
      {/* Social Media Tags */}
      <VisualFactorList 
        title="Social Media Tags"
        description="Tags that control how your content appears when shared on social platforms"
        factors={socialMedia.items}
        icon="share"
        score={socialMedia.score}
      />
      
      {/* Technical SEO */}
      <VisualFactorList 
        title="Technical SEO"
        description="Technical aspects that affect site crawlability and indexing"
        factors={technicalSeo.items}
        icon="code"
        score={technicalSeo.score}
      />
    </div>
  );
};

export default ScoreBreakdown;
