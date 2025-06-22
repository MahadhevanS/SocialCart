
'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Leaf, Lock, Rocket, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';


const deliveryOptions = [
  { id: 'eco', name: 'Eco-Friendly Delivery', time: '5-7 business days', cost: 0, icon: Leaf, description: 'Clubbed with other deliveries to reduce emissions. You earn 15 Eco Points! 🍃', points: 15 },
  { id: 'standard', name: 'Standard Shipping', time: '3-5 business days', cost: 5.99, icon: Truck, description: 'Standard delivery service.' },
  { id: 'express', name: 'Express Shipping', time: '1-2 business days', cost: 12.99, icon: Rocket, description: 'Get your items as fast as possible.' }
];

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { addEcoPoints, currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedDelivery, setSelectedDelivery] = useState('eco');

  const shippingCost = deliveryOptions.find(opt => opt.id === selectedDelivery)?.cost || 0;
  const total = cartTotal + shippingCost;
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty.</h1>
        <p className="text-muted-foreground mb-6">You can't proceed to checkout without any items.</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger payment processing.
    const selectedOption = deliveryOptions.find(opt => opt.id === selectedDelivery);
    if (selectedOption?.id === 'eco' && currentUser && addEcoPoints && selectedOption.points) {
        addEcoPoints(selectedOption.points);
        toast({
            title: "Eco Points Rewarded!",
            description: `You've earned an extra ${selectedOption.points} points for choosing eco-delivery!`,
        });
    }

    console.log('Placing order with total:', total);
    alert('Thank you for your order! (This is a demo)');
  };


  return (
    <div className="container mx-auto py-12 px-4">
       <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Checkout</h1>
        <p className="text-muted-foreground mt-2 text-lg">Complete your purchase securely.</p>
      </div>
      
      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Shipping, Delivery & Payment Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="jane.doe@example.com" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Eco Lane" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Greenville" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" placeholder="California" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" placeholder="90210" required />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
              <CardDescription>Choose how you'd like to receive your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery} className="space-y-4">
                {deliveryOptions.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={option.id}
                    className={cn(
                      "flex flex-col md:flex-row items-start gap-4 rounded-lg border p-4 transition-colors cursor-pointer",
                      selectedDelivery === option.id && "border-primary ring-2 ring-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 font-semibold">
                        <option.icon className="h-5 w-5 text-primary" />
                        <span>{option.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{option.time}</p>
                      <p className="text-sm text-foreground/80 mt-2">{option.description}</p>
                    </div>
                    <p className="font-semibold text-primary ml-auto whitespace-nowrap pt-1 md:pt-0">
                      {option.cost > 0 ? `$${option.cost.toFixed(2)}` : 'FREE'}
                    </p>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1">
                <Lock className="w-4 h-4" /> All transactions are secure and encrypted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input id="card-name" placeholder="Jane M Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                  <Input id="card-number" placeholder="•••• •••• •••• ••••" required />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1 sticky top-24">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <Image src={item.images[0]} alt={item.name} width={48} height={48} className="rounded-md object-cover" data-ai-hint={item.imageHint} />
                      <div>
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE'}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full">
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
