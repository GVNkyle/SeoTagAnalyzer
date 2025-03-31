import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading, error }) => {
  const [url, setUrl] = useState('');
  const [inputTouched, setInputTouched] = useState(false);
  const isMobile = useIsMobile();

  // Basic client-side URL validation
  const validateUrl = (value: string): boolean => {
    if (!value.trim()) return false;
    
    // Simple URL validation
    try {
      const processedUrl = value.trim();
      if (!/^https?:\/\//i.test(processedUrl)) {
        new URL(`https://${processedUrl}`);
      } else {
        new URL(processedUrl);
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const isValidUrl = validateUrl(url);
  const showError = inputTouched && !isValidUrl && url.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputTouched(true);
    
    if (!validateUrl(url)) return;
    
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
    setInputTouched(false);
  };

  const handleFocus = () => {
    setInputTouched(true);
  };

  return (
    <div className="mb-8">
      <Card className="shadow-md border-neutral-200">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Enter Website URL</h2>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-neutral-400">language</span>
                </div>
                <Input
                  type="text"
                  id="website-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={handleFocus}
                  className={`pl-10 pr-12 h-10 transition-all ${showError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="example.com or https://example.com"
                  autoComplete="url"
                  autoCorrect="off"
                  spellCheck="false"
                  aria-invalid={showError}
                  aria-describedby={showError ? "url-error" : undefined}
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
              {showError && (
                <p id="url-error" className="mt-1 text-sm text-red-500">
                  Please enter a valid website URL
                </p>
              )}
            </div>
            <div className={isMobile ? "mt-2" : ""}>
              <Button
                type="submit"
                disabled={isLoading || !url.trim() || (inputTouched && !isValidUrl)}
                className="w-full sm:w-auto px-4 py-2 h-10"
                size="default"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="material-icons mr-1 text-sm">search</span>
                    Analyze
                  </span>
                )}
              </Button>
            </div>
          </form>
          <p className="text-sm text-neutral-500 mt-4">
            Enter any website URL to analyze its SEO metadata, get a score, and see recommendations for improvement
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UrlInput;
