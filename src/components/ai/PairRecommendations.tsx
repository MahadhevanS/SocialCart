'use client';

import { useEffect, useState } from 'react';
import { getPairShoppingRecommendations } from '@/ai/flows/pair-shopping-recommendations';
import type { CartItemType, Product } from '@/lib/types';
import { mockProducts } from '@/lib/mockData'; // To find full product details for recommendations
import { ProductCard } from '@/components/products/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface PairRecommendationsProps {
  cartItems: CartItemType[];
}

export function PairRecommendations({ cartItems }: PairRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const cartItemNames = cartItems.map((item) => item.name);
          const result = await getPairShoppingRecommendations({ cartItems: cartItemNames });
          
          // Map recommendation names to full product objects from mock data
          // In a real app, you'd fetch these from your backend/DB
          const detailedRecommendations = result.recommendations
            .map(name => mockProducts.find(p => p.name.toLowerCase() === name.toLowerCase()))
            .filter(p => p !== undefined) as Product[];
          
          // Filter out items already in cart
          const finalRecommendations = detailedRecommendations.filter(rec => !cartItems.some(cartItem => cartItem.id === rec.id));

          setRecommendations(finalRecommendations.slice(0, 3)); // Show top 3 unique recommendations
        } catch (e) {
          console.error('Failed to fetch recommendations:', e);
          setError('Could not load recommendations at this time.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecommendations();
    } else {
      setRecommendations([]); // Clear recommendations if cart is empty
    }
  }, [cartItems]);

  if (!cartItems.length && !isLoading) return null; // Don't show if cart is empty and not loading

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">You Might Also Like</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Finding recommendations...</p>
          </div>
        )}
        {error && (
           <Alert variant="destructive">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}
        {!isLoading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {!isLoading && !error && recommendations.length === 0 && cartItems.length > 0 && (
          <p className="text-center text-muted-foreground py-4">No specific recommendations for your current cart. Explore more products!</p>
        )}
      </CardContent>
    </Card>
  );
}
