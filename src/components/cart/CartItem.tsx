
'use client';

import Image from 'next/image';
import type { CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus } from 'lucide-react';
import { usePairChat } from '@/contexts/PairChatContext';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemCard({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { navigateShared } = usePairChat();

  const handleQuantityChange = (amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity > 0 && newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    } else if (newQuantity <= 0) {
      updateQuantity(item.id, 0); // This will trigger removal in context if quantity is 0
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity)) newQuantity = 1; // default to 1 if input is not a number
    if (newQuantity <= 0) {
        updateQuantity(item.id, 0);
    } else if (newQuantity > item.stock) {
        updateQuantity(item.id, item.stock);
    }
    else {
        updateQuantity(item.id, newQuantity);
    }
  };

  const handleNavigate = () => {
    navigateShared(`/products/${item.id}`);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b bg-card rounded-lg shadow-sm mb-4">
      <div onClick={handleNavigate} className="flex-shrink-0 cursor-pointer">
        <Image
          src={item.images[0]}
          alt={item.name}
          width={100}
          height={100}
          className="rounded-md object-cover aspect-square"
          data-ai-hint={item.imageHint}
        />
      </div>
      <div className="flex-grow">
        <h3 
          onClick={handleNavigate}
          className="text-base sm:text-lg font-semibold font-headline cursor-pointer hover:text-primary"
        >
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
        <div className="flex items-center space-x-2 mt-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(-1)} disabled={item.quantity <= 1}>
                <Minus className="h-4 w-4" />
            </Button>
            <Input
                type="number"
                value={item.quantity}
                onChange={handleInputChange}
                className="w-16 h-8 text-center"
                aria-label={`Quantity for ${item.name}`}
                min="1"
                max={item.stock}
            />
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(1)} disabled={item.quantity >= item.stock}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive mt-1" onClick={() => removeFromCart(item.id)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Remove {item.name} from cart</span>
        </Button>
      </div>
    </div>
  );
}
