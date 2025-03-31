import React from 'react';
import UrlInput from '@/components/url-input';
import AnalysisResult from '@/components/analysis-result';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { SeoAnalysisResult } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = React.useState<SeoAnalysisResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await apiRequest('POST', '/api/analyze', { url });
      return res.json() as Promise<SeoAnalysisResult>;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
    onError: (error) => {
      toast({
        title: 'Error analyzing URL',
        description: (error as Error).message || 'Failed to analyze URL',
        variant: 'destructive',
      });
    },
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm-.5 3h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5zM8 10a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-neutral-800">SEO MetaScore</h1>
              <p className="text-sm text-neutral-500">Analyze and score website meta tags</p>
            </div>
          </div>
          <div>
            <a 
              href="https://github.com/your-username/seo-metascore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="material-icons text-sm mr-1">lightbulb</span>
              How It Works
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UrlInput onAnalyze={handleAnalyze} isLoading={analyzeMutation.isPending} />
        
        {/* Analysis Result */}
        {analysisResult && !analyzeMutation.isPending && (
          <AnalysisResult result={analysisResult} />
        )}
        
        {/* Loading state */}
        {analyzeMutation.isPending && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-neutral-600">Analyzing website meta tags...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} SEO MetaScore. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
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
