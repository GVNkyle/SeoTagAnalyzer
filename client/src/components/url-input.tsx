import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format
    let processedUrl = url.trim();
    
    // Add https:// if no protocol specified
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }
    
    onAnalyze(processedUrl);
  };

  const clearInput = () => {
    setUrl('');
  };

  return (
    <div className="mb-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-neutral-800 mb-4">Enter Website URL</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-neutral-400">language</span>
                </div>
                <Input
                  type="url"
                  id="website-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 pr-12 py-6"
                  placeholder="https://example.com"
                  required
                />
                {url && (
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button 
                      type="button" 
                      onClick={clearInput}
                      className="p-1 focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-400 hover:text-neutral-500"
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="w-full sm:w-auto px-6 py-6"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : 'Analyze'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UrlInput;
