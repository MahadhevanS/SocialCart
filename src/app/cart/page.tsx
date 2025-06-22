
'use client';

import { useCart } from '@/contexts/CartContext';
import { CartItemCard } from '@/components/cart/CartItem';
import { PairRecommendations } from '@/components/ai/PairRecommendations';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items Section */}
        <div className="flex-grow lg:w-2/3">
          <Card className="shadow-xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold font-headline text-primary">Your Shopping Cart</CardTitle>
              {cartCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-xl text-muted-foreground mb-2">Your cart is empty.</p>
                  <Button asChild>
                    <Link href="/">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Section */}
        {cartItems.length > 0 && (
          <div className="lg:w-1/3 sticky top-20"> {/* Sticky summary for larger screens */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      {/* AI Recommendations Section */}
      <PairRecommendations cartItems={cartItems} />
    </div>
  );
}
