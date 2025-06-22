
'use client';

import { Mic, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { interpretCommand } from '@/ai/flows/voice-command-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/lib/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';

// Check for SpeechRecognition API
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addEcoPoints } = useAuth();
  const router = useRouter();

  const processCommand = useCallback(async (text: string) => {
    setIsProcessing(true);
    setTranscript(text);

    try {
        const productNames = mockProducts.map(p => p.name);
        const command = await interpretCommand({ query: text, availableProducts: productNames });

        // Play the response audio first
        if(command.payload.responseText) {
            try {
              const audioDataUri = await textToSpeech(command.payload.responseText);
              if (audioRef.current) {
                  audioRef.current.src = audioDataUri;
                  await audioRef.current.play();
              }
            } catch (ttsError) {
              console.error("Text-to-speech failed:", ttsError);
              // We can still proceed with the action even if TTS fails
            }
        }
        
        // Execute the action
        switch (command.action) {
            case 'ADD_TO_CART':
                const productToAdd = mockProducts.find(p => p.name.toLowerCase() === command.payload.productName?.toLowerCase());
                if (productToAdd) {
                    const quantity = command.payload.quantity || 1;
                    addToCart(productToAdd, quantity);

                    if (productToAdd.ecoFriendliness > 0 && addEcoPoints) {
                        const pointsToAdd = Math.round((productToAdd.ecoFriendliness / 10) * quantity);
                        if (pointsToAdd > 0) {
                            addEcoPoints(pointsToAdd);
                            toast({
                                title: 'Eco-Points Earned!',
                                description: `You've earned ${pointsToAdd} points for this green purchase! 🍃`,
                            });
                        }
                    }
                } else {
                    toast({ variant: 'destructive', title: 'Product not found', description: `Could not find a product named "${command.payload.productName}".` });
                }
                break;
            case 'VIEW_CART':
                router.push('/cart');
                break;
            case 'NAVIGATE_HOME':
                router.push('/products');
                break;
            case 'NAVIGATE_SOCIAL':
                router.push('/social');
                break;
            case 'NAVIGATE_CHAT':
                router.push('/chat');
                break;
            case 'SEARCH_PRODUCTS':
                // For now, we'll just toast the search query. A real implementation would navigate to a search results page.
                 toast({ title: 'Searching...', description: `Looking for "${command.payload.productName}".` });
                break;
            case 'UNKNOWN':
                 // The text-to-speech already handled the feedback
                break;
        }

    } catch (error) {
      console.error('Error processing voice command:', error);
      toast({
        variant: 'destructive',
        title: 'Voice Error',
        description: 'Could not process your command.',
      });
    } finally {
        setTimeout(() => {
            setShowDialog(false);
            setIsProcessing(false);
            setTranscript('');
        }, 800); // Give a little time for the user to hear the response
    }
  }, [addToCart, router, toast, addEcoPoints]);

  useEffect(() => {
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      setTranscript(currentTranscript);

      if (event.results[0].isFinal) {
        recognition.stop();
        if(currentTranscript.trim()) {
            processCommand(currentTranscript);
        } else {
            setShowDialog(false);
        }
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setShowDialog(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Don't hide dialog here, wait for processing to finish
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      toast({ variant: 'destructive', title: 'Voice Error', description: `Could not start listening. Error: ${event.error}` });
      setIsListening(false);
      setShowDialog(false);
    };

    recognitionRef.current = recognition;
  }, [processCommand, toast]);

  const handleMicClick = () => {
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Your browser does not support voice recognition.',
      });
      return;
    }

    if (isListening || isProcessing) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleMicClick} disabled={isProcessing} aria-label="Use Voice Assistant">
        {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
      </Button>
      <audio ref={audioRef} style={{ display: 'none' }} />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary"/>
                    EcoCart Voice Assistant
                </DialogTitle>
                <DialogDescription>
                    {isListening && "Listening for your command..."}
                    {isProcessing && "Thinking..."}
                    {!isListening && !isProcessing && "Say something like, 'Add headphones to cart'"}
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8 min-h-[8rem] bg-muted/50 rounded-lg">
                {isProcessing ? (
                     <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground italic mt-4">"{transcript}"</p>
                    </div>
                ) : (
                    <div className="text-center space-y-2">
                         <Mic className={cn("h-10 w-10 mx-auto", isListening ? 'text-destructive animate-pulse' : 'text-primary' )} />
                         <p className="text-lg font-medium h-7">{transcript || "..."}</p>
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
