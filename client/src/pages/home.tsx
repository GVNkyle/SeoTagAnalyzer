import React from 'react';
import UrlInput from '@/components/url-input';
import AnalysisResult from '@/components/analysis-result';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { SeoAnalysisResult } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Home: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [analysisResult, setAnalysisResult] = React.useState<SeoAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      setErrorMessage(null);
      const res = await apiRequest('POST', '/api/analyze', { url });
      
      // Check if the response status is not ok
      if (!res.ok) {
        const errorData = await res.json();
        // Use the user-friendly message if available
        throw new Error(errorData.userMessage || errorData.message || 'Failed to analyze URL');
      }
      
      return res.json() as Promise<SeoAnalysisResult>;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setErrorMessage(null);
      
      toast({
        title: 'Analysis Complete',
        description: `Successfully analyzed ${data.url} with a score of ${data.totalScore}/100`,
        variant: 'default',
      });
    },
    onError: (error) => {
      setErrorMessage((error as Error).message || 'Failed to analyze URL');
      
      toast({
        title: 'Error analyzing URL',
        description: (error as Error).message || 'Failed to analyze URL',
        variant: 'destructive',
      });
    },
  });

  const handleAnalyze = (url: string) => {
    setAnalysisResult(null);
    analyzeMutation.mutate(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm-.5 3h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5zM8 10a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <h1 className="text-xl font-semibold text-neutral-800">SEO MetaScore</h1>
              <p className="text-sm text-neutral-500 hidden sm:block">Analyze and score website meta tags</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <a 
              href="#how-it-works" 
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="material-icons text-sm mr-1">lightbulb</span>
              How It Works
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <UrlInput 
          onAnalyze={handleAnalyze} 
          isLoading={analyzeMutation.isPending}
          error={errorMessage || undefined}
        />
        
        {/* Analysis Result */}
        {analysisResult && !analyzeMutation.isPending && (
          <AnalysisResult result={analysisResult} />
        )}
        
        {/* Loading state */}
        {analyzeMutation.isPending && (
          <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-neutral-600 text-center">Analyzing website meta tags...</p>
            <p className="text-neutral-500 text-sm text-center mt-2">This may take a few moments depending on the website's size</p>
          </div>
        )}
        
        {/* How It Works section */}
        <div id="how-it-works" className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary-100 text-primary-600 rounded-full p-3 mb-4">
                <span className="material-icons text-2xl">travel_explore</span>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">1. Enter Any URL</h3>
              <p className="text-neutral-600">Simply paste the website URL you want to analyze, and our tool will fetch the page.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary-100 text-primary-600 rounded-full p-3 mb-4">
                <span className="material-icons text-2xl">analytics</span>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">2. Automatic Analysis</h3>
              <p className="text-neutral-600">Our tool examines meta tags, social media tags, and technical SEO factors.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary-100 text-primary-600 rounded-full p-3 mb-4">
                <span className="material-icons text-2xl">dashboard_customize</span>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">3. Get Results</h3>
              <p className="text-neutral-600">Receive a comprehensive score and actionable recommendations to improve your SEO.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} SEO MetaScore. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:space-x-6">
              <a href="#" className="text-neutral-500 hover:text-neutral-700">
                <span className="sr-only">Privacy</span>
                <span className="text-sm">Privacy Policy</span>
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-700">
                <span className="sr-only">Terms</span>
                <span className="text-sm">Terms of Service</span>
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-700">
                <span className="sr-only">Contact</span>
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
