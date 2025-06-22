
'use client';

import { useEffect, useState } from 'react';
import { analyzeEcoSentiment, type EcoSentimentOutput } from '@/ai/flows/eco-sentiment-analysis-flow';
import type { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ThumbsUp, ThumbsDown, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

interface EcoSentimentAnalysisProps {
  reviews: Review[];
}

export function EcoSentimentAnalysis({ reviews }: EcoSentimentAnalysisProps) {
  const [analysis, setAnalysis] = useState<EcoSentimentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run analysis if there are reviews
    if (reviews && reviews.length > 0) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const reviewComments = reviews.map((review) => review.comment);
          const result = await analyzeEcoSentiment({ reviews: reviewComments });
          
          // Only show analysis if there are meaningful points
          if (result.positivePoints.length > 0 || result.negativePoints.length > 0) {
            setAnalysis(result);
          } else {
            setAnalysis(null); // No meaningful points, don't show the card
          }
        } catch (e) {
          console.error('Failed to fetch eco sentiment analysis:', e);
          setError('Could not load eco-analysis at this time.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [reviews]);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI-Powered Eco Summary
          </CardTitle>
          <CardDescription>Analyzing customer reviews for sustainability insights...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive" className="mt-6">
         <AlertTitle>Analysis Error</AlertTitle>
         <AlertDescription>{error}</AlertDescription>
       </Alert>
    );
  }
  
  // Don't render the component if there's no analysis result
  if (!analysis) {
    return null;
  }

  const hasBoth = analysis.positivePoints.length > 0 && analysis.negativePoints.length > 0;

  return (
    <Card className="mt-6 shadow-lg bg-muted/20 border-t-4 border-primary">
       <CardHeader className="text-center">
        <Sparkles className="h-8 w-8 mx-auto text-primary" />
        <CardTitle className="mt-2 text-2xl font-headline">
          AI Eco Summary
        </CardTitle>
        <CardDescription className="max-w-prose mx-auto text-base">{analysis.summary}</CardDescription>
      </CardHeader>
      <CardContent className={cn("grid grid-cols-1 gap-6 pt-4", hasBoth ? "md:grid-cols-2" : "max-w-md mx-auto")}>
        {analysis.positivePoints.length > 0 && (
          <div className="bg-background border border-primary/30 rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-semibold flex items-center gap-2 text-primary text-lg">
                <ThumbsUp className="h-5 w-5" /> What people loved
            </h4>
            <ul className="space-y-2 text-sm text-foreground/90 pl-1">
              {analysis.positivePoints.map((point, index) => (
                <li key={`pos-${index}`} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis.negativePoints.length > 0 && (
          <div className="bg-background border border-destructive/30 rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-semibold flex items-center gap-2 text-destructive text-lg">
                <ThumbsDown className="h-5 w-5" /> Areas for improvement
            </h4>
            <ul className="space-y-2 text-sm text-foreground/90 pl-1">
              {analysis.negativePoints.map((point, index) => (
                <li key={`neg-${index}`} className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
