
'use client';

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Leaf } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePairChat } from '@/contexts/PairChatContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useCart();
  const { navigateShared } = usePairChat();
  const { toast } = useToast();
  const isFav = isFavorite(product.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation when clicking the heart
    toggleFavorite(product.id);
    toast({
      title: isFav ? "Removed from favorites" : "Added to favorites",
      description: `${product.name} has been ${isFav ? 'removed from your' : 'added to your'} favorites.`,
    })
  }
  
  const handleNavigate = () => {
      navigateShared(`/products/${product.id}`);
  }

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl cursor-pointer"
      onClick={handleNavigate}
    >
      <CardHeader className="p-0 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-9 w-9 rounded-full bg-background/70 hover:bg-background"
          onClick={handleFavoriteToggle}
        >
          <Heart className={cn('h-5 w-5', isFav ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
          <span className="sr-only">Toggle Favorite</span>
        </Button>
        <div className="block aspect-[4/3] relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={300}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
          data-ai-hint={product.imageHint}
          onError={() => console.log(`Failed to load image for ${product.name}: ${product.images[0]}`)}
          style={{ aspectRatio: '4/3' }} // Ensure aspect ratio
        />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">
          <span className="hover:text-primary transition-colors">
            {product.name}
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">{product.description.substring(0, 60)}...</p>
        <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
            {product.ecoFriendliness > 0 && (
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                    <Leaf className="mr-1 h-3 w-3" /> {product.ecoFriendliness}%
                </Badge>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button onClick={(e) => { e.stopPropagation(); handleNavigate(); }} className="w-full" variant="outline">
            <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
}