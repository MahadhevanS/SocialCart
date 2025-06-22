'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, PartyPopper, Sparkles, CheckSquare, Gift, Leaf } from 'lucide-react';
import { getEcoPlan, type EcoPlannerOutput } from '@/ai/flows/eco-planner-flow';
import { mockProducts, getProductById } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const eventOptions = [
  { id: 'birthday', name: 'Birthday Party', icon: Gift },
  { id: 'wedding', name: 'Wedding', icon: Leaf },
  { id: 'celebration', name: 'Holiday Celebration', icon: PartyPopper },
];

export function EcoPlannerDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: select event, 1: show plan
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<EcoPlannerOutput | null>(null);
  const { toast } = useToast();

  const handleGetPlan = async () => {
    if (!selectedEvent) {
        toast({
            variant: 'destructive',
            title: 'Please select an event type.',
        });
        return;
    }
    
    setIsLoading(true);
    setCurrentStep(1);

    try {
        const availableProducts = mockProducts.map(p => p.name);
        const eventName = eventOptions.find(e => e.id === selectedEvent)?.name || 'event';
        const result = await getEcoPlan({ eventType: eventName, availableProducts });
        setPlan(result);
    } catch (error) {
        console.error("Failed to get eco plan:", error);
        toast({
            variant: 'destructive',
            title: 'Could not generate plan',
            description: 'There was an error generating the eco-friendly plan. Please try again.',
        });
        // Reset to selection
        setCurrentStep(0);
    } finally {
        setIsLoading(false);
    }
  };

  const resetState = () => {
    setCurrentStep(0);
    setSelectedEvent('');
    setPlan(null);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        // Reset state when dialog is closed
        setTimeout(resetState, 300);
    }
  }

  const suggestedProducts = plan?.suggestedProducts
    .map(name => getProductById(mockProducts.find(p => p.name === name)?.id || ''))
    .filter((p): p is Product => p !== undefined) || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">Explore Eco-Collections</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <Sparkles className="h-6 w-6 text-primary" />
            AI-Powered Eco Planner
          </DialogTitle>
          <DialogDescription>
            {currentStep === 0 ? "First, tell us what you're planning." : `Your eco-friendly plan for a wonderful ${eventOptions.find(e => e.id === selectedEvent)?.name || 'event'}!`}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 0 && (
            <div>
                <RadioGroup value={selectedEvent} onValueChange={setSelectedEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                     {eventOptions.map((option) => (
                        <Label
                            key={option.id}
                            htmlFor={option.id}
                            className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:bg-primary/5"
                            data-state={selectedEvent === option.id ? 'checked' : 'unchecked'}
                        >
                            <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                            <option.icon className="h-8 w-8 text-primary" />
                            <span className="font-semibold">{option.name}</span>
                        </Label>
                    ))}
                </RadioGroup>
                <DialogFooter>
                    <Button onClick={handleGetPlan} disabled={!selectedEvent}>Generate Plan</Button>
                </DialogFooter>
            </div>
        )}

        {currentStep === 1 && (
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-lg text-muted-foreground">Generating your sustainable plan...</p>
                    </div>
                ) : plan && (
                    <div className="space-y-6">
                        {/* Planner Checklist */}
                        <div>
                             <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                                <CheckSquare className="h-5 w-5 text-primary" />
                                Your Eco-Checklist
                            </h3>
                            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                {plan.planner.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <Leaf className="h-5 w-5 mt-1 text-primary/80 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">{item.task}</p>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Suggested Products */}
                         <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                                <Gift className="h-5 w-5 text-primary" />
                                Suggested Products
                            </h3>
                             {suggestedProducts.length > 0 ? (
                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                     {suggestedProducts.map(product => (
                                         <Link key={product.id} href={`/products/${product.id}`} onClick={() => handleOpenChange(false)}>
                                            <div className="border rounded-lg p-2 text-center hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                                                <img src={product.images[0]} alt={product.name} className="aspect-square object-cover rounded-md mb-2" data-ai-hint={product.imageHint} />
                                                <p className="text-sm font-medium leading-tight">{product.name}</p>
                                            </div>
                                         </Link>
                                     ))}
                                 </div>
                             ) : (
                                <p className="text-muted-foreground text-sm">No specific product suggestions for this event.</p>
                             )}
                         </div>
                    </div>
                )}
                 <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={resetState}>Start Over</Button>
                </DialogFooter>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
