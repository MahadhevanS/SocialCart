
'use client';

import { useState } from 'react';
import type { Product, Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star, Minus, Plus, Heart, Leaf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EcoSentimentAnalysis } from '@/components/ai/EcoSentimentAnalysis';
import { useAnimation } from '@/contexts/AnimationContext';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { currentUser, addEcoPoints } = useAuth();
  const { toast } = useToast();
  const isFav = isFavorite(product.id);
  const { triggerLeafFall } = useAnimation();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${product.name} (x${quantity}) has been added to your cart.`,
    });

    // Trigger leaf fall for highly eco-friendly products
    if (product.ecoFriendliness > 85) {
      triggerLeafFall();
    }

    if (currentUser && product.ecoFriendliness > 0 && addEcoPoints) {
      const pointsToAdd = Math.round((product.ecoFriendliness / 10) * quantity);
      if (pointsToAdd > 0) {
        addEcoPoints(pointsToAdd);
        toast({
          title: "Eco-Points Earned!",
          description: `You've earned ${pointsToAdd} points for this green purchase! 🍃`,
        });
      }
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(product.id);
    toast({
      title: isFav ? "Removed from favorites" : "Added to favorites",
      description: `${product.name} has been ${isFav ? 'removed from your' : 'added to your'} favorites.`,
    });
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + amount)));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden border mb-4 shadow-lg">
            <img
              src={selectedImage || '/images/placeholder.png'} // Fallback image
              alt={product.name}
              className="object-contain w-full h-full"
              data-ai-hint={product.imageHint}
              onError={() => console.log(`Failed to load image: ${selectedImage}`)}
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square relative rounded-md overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-muted'}`}
                >
                  <img
                    src={img || '/images/placeholder.png'} // Fallback image
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="object-cover w-full h-full"
                    data-ai-hint={product.imageHint}
                    onError={() => console.log(`Failed to load thumbnail: ${img}`)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline text-primary">{product.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{product.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-semibold text-accent-foreground">${product.price.toFixed(2)}</p>
                 {product.ecoFriendliness > 0 && (
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 text-base py-1 px-3">
                        <Leaf className="mr-2 h-4 w-4" /> {product.ecoFriendliness}% Eco-Friendly
                    </Badge>
                )}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6">{product.description}</p>
              
              <div className="flex items-center space-x-3 mb-6">
                <p className="text-sm font-medium">Quantity:</p>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 h-10 text-center border-0 focus-visible:ring-0"
                    aria-label="Quantity"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stock < 10 && <p className="text-sm text-destructive">Only {product.stock} left!</p>}
              </div>

              <div className="flex w-full items-stretch gap-2">
                <Button size="lg" className="flex-grow" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-11 w-11"
                  onClick={handleFavoriteToggle}
                  aria-label="Toggle Favorite"
                >
                  <Heart className={cn("h-6 w-6", isFav ? "fill-destructive text-destructive" : "text-muted-foreground")} />
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* AI Eco Analysis Section */}
          {product.reviews && product.reviews.length > 0 && (
            <EcoSentimentAnalysis reviews={product.reviews} />
          )}

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {product.reviews.map((review: Review) => (
                  <div key={review.id}>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
                      ))}
                      <p className="ml-2 text-sm font-semibold">{review.author}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{new Date(review.date).toLocaleDateString()}</p>
                    <p className="text-foreground/90 text-sm">{review.comment}</p>
                    <Separator className="my-4" />
                  </div>
                ))}
                 <Button variant="outline" className="w-full">Write a review</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}