import React from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PreviewSectionProps {
  googlePreview: SeoAnalysisResult['previews']['google'];
  socialPreview: SeoAnalysisResult['previews']['social'];
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ googlePreview, socialPreview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Google Search Preview */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-medium text-neutral-800 mb-4">Google Search Preview</h3>
          <div className="border border-neutral-200 rounded-lg p-4 bg-white">
            <div className="mb-1 text-sm text-green-700 truncate">{googlePreview.url} &gt; </div>
            <div className="text-xl text-blue-700 font-medium mb-1 hover:underline cursor-pointer">
              {googlePreview.title || 'No title'}
            </div>
            <div className="text-sm text-neutral-600">
              {googlePreview.description || 'No description provided'}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className={`material-icons text-sm ${googlePreview.isTitleLengthOptimal ? 'text-green-500' : 'text-amber-500'}`}>
                  {googlePreview.isTitleLengthOptimal ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-sm text-neutral-600">
                  Title length: {googlePreview.titleLength} characters 
                  {!googlePreview.isTitleLengthOptimal && ' (Optimal: 50-60)'}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className={`material-icons text-sm ${googlePreview.isDescriptionLengthOptimal ? 'text-green-500' : 'text-amber-500'}`}>
                  {googlePreview.isDescriptionLengthOptimal ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-sm text-neutral-600">
                  Description length: {googlePreview.descriptionLength} characters
                  {!googlePreview.isDescriptionLengthOptimal && ' (Optimal: 150-160)'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Preview */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-medium text-neutral-800 mb-4">Social Media Preview</h3>
          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-neutral-800 text-white text-xs px-3 py-1">facebook.com</div>
            <div className="h-48 bg-neutral-100 flex items-center justify-center">
              {socialPreview.image ? (
                <img 
                  src={socialPreview.image} 
                  alt="Social preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, show fallback text
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = 
                      '<div class="flex items-center justify-center w-full h-full text-neutral-400">Image not available or cannot be loaded</div>';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-neutral-400">
                  No social image provided
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-neutral-500 text-xs mb-1">{googlePreview.url}</p>
              <p className="font-medium text-neutral-800">{socialPreview.title || 'No title'}</p>
              <p className="text-sm text-neutral-600 line-clamp-2">
                {socialPreview.description || 'No description provided'}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className={`material-icons text-sm ${socialPreview.isOpenGraphComplete ? 'text-green-500' : 'text-amber-500'}`}>
                  {socialPreview.isOpenGraphComplete ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-sm text-neutral-600">
                  {socialPreview.isOpenGraphComplete 
                    ? 'OG tags properly implemented' 
                    : 'OG tags incomplete'}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className={`material-icons text-sm ${socialPreview.isTwitterCardComplete ? 'text-green-500' : 'text-amber-500'}`}>
                  {socialPreview.isTwitterCardComplete ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-sm text-neutral-600">
                  {socialPreview.isTwitterCardComplete 
                    ? 'Twitter Card tags properly implemented' 
                    : 'Twitter Card tags incomplete'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewSection;
