import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Factor {
  name: string;
  value?: string;
  status: 'success' | 'warning' | 'error';
  message?: string;
}

interface VisualFactorListProps {
  title: string;
  description: string;
  factors: Factor[];
  icon: string;
  score: number;
}

const VisualFactorList: React.FC<VisualFactorListProps> = ({ 
  title, 
  description, 
  factors, 
  icon, 
  score 
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Get color based on status
  const getStatusColor = (status: 'success' | 'warning' | 'error'): string => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };
  
  // Get icon based on status
  const getStatusIcon = (status: 'success' | 'warning' | 'error'): string => {
    switch (status) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Determine how many items to show initially
  const initialDisplay = 3;
  const displayedFactors = showAll ? factors : factors.slice(0, initialDisplay);
  const hasMore = factors.length > initialDisplay;
  
  return (
    <Card className="mb-6 border-neutral-200 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-neutral-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-neutral-100">
              <span className="material-icons text-xl text-neutral-700">{icon}</span>
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
                <span className={`ml-2 text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                <span className="text-xs text-neutral-500 ml-1">/100</span>
              </div>
              <p className="text-sm text-neutral-600">{description}</p>
            </div>
          </div>
        </div>
        
        <Accordion type="multiple" className="bg-neutral-50">
          {displayedFactors.map((factor, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b border-neutral-100 last:border-0">
              <AccordionTrigger className="flex py-3 px-4 sm:px-5 text-left hover:no-underline hover:bg-neutral-100 text-sm">
                <div className="flex items-center w-full">
                  <span className={`material-icons text-sm mr-2 text-${factor.status === 'success' ? 'green' : factor.status === 'warning' ? 'amber' : 'red'}-500`}>
                    {getStatusIcon(factor.status)}
                  </span>
                  <span className="font-medium">{factor.name}</span>
                  
                  <div className="flex-grow"></div>
                  
                  <Badge className={`ml-auto mr-2 ${getStatusColor(factor.status)}`}>
                    {factor.status === 'success' ? 'Implemented' : 
                     factor.status === 'warning' ? 'Warning' : 'Missing'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5 py-3 bg-white border-t border-neutral-100">
                {factor.message && (
                  <div className="mb-2 text-sm">
                    <span className="font-medium">Note:</span> {factor.message}
                  </div>
                )}
                
                {factor.value && (
                  <div className="mt-2">
                    <div className="text-xs text-neutral-500">Current Value:</div>
                    <div className="p-2 bg-neutral-50 border border-neutral-200 rounded-md mt-1 text-sm font-mono break-all overflow-x-auto">
                      {factor.value}
                    </div>
                  </div>
                )}
                
                {!factor.value && factor.status === 'error' && (
                  <div className="text-sm text-red-700">
                    This element is missing from your page and should be added.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {hasMore && (
          <div className="p-3 text-center border-t border-neutral-100">
            <Button 
              variant="ghost" 
              onClick={() => setShowAll(!showAll)}
              className="text-sm"
            >
              {showAll ? 'Show fewer factors' : `Show ${factors.length - initialDisplay} more factors`}
              <span className="material-icons ml-1 text-sm">
                {showAll ? 'expand_less' : 'expand_more'}
              </span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualFactorList;