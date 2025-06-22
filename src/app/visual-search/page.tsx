'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Search, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { findProductsInImage } from '@/ai/flows/visual-search-flow';
import { mockProducts, getProductById } from '@/lib/mockData';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VisualSearchPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    // Cleanup function to stop video stream
    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUri);
      handleSearch(dataUri);
    }
  };

  const handleSearch = async (imageDataUri: string) => {
    setIsProcessing(true);
    setResults([]);
    setReasoning('');

    try {
      const availableProducts = mockProducts.map(p => ({ id: p.id, name: p.name }));
      const response = await findProductsInImage({ imageDataUri, availableProducts });
      
      const foundProducts = response.matchedProductIds
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== undefined);
      
      setResults(foundProducts);
      setReasoning(response.reasoning);

      if (foundProducts.length === 0) {
        toast({
            title: "No matches found",
            description: "We couldn't find any products matching your image."
        })
      }

    } catch (error) {
      console.error('Visual search failed:', error);
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: 'An error occurred while searching for products.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSearch = () => {
    setCapturedImage(null);
    setResults([]);
    setReasoning('');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <Camera className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Visual Search</h1>
        <p className="text-muted-foreground mt-2 text-lg">Find products using your camera. Point, shoot, and shop!</p>
      </div>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Camera View</CardTitle>
          <CardDescription>
            {capturedImage ? "Here's what we're searching for. Press 'Clear' to try again." : "Position an item in the frame and capture an image to search."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
            {hasCameraPermission === null && (
                <div className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                    <p>Initializing Camera...</p>
                </div>
            )}
            {hasCameraPermission === false && (
                <Alert variant="destructive" className="w-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Not Available</AlertTitle>
                    <AlertDescription>
                        Could not access camera. Please check permissions and refresh.
                    </AlertDescription>
                </Alert>
            )}
            {hasCameraPermission === true && (
                <>
                    <video ref={videoRef} className={`w-full h-full object-cover ${capturedImage ? 'hidden' : 'block'}`} autoPlay muted playsInline />
                    {capturedImage && (
                        <img src={capturedImage} alt="Captured from user camera" className="w-full h-full object-cover" />
                    )}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            {capturedImage ? (
                <Button size="lg" variant="outline" onClick={resetSearch} disabled={isProcessing}>
                    Clear Image
                </Button>
            ) : (
                <Button size="lg" onClick={handleCapture} disabled={!hasCameraPermission || isProcessing}>
                    <Camera className="mr-2 h-5 w-5" /> Capture & Search
                </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {(isProcessing || results.length > 0) && (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-2 font-headline text-primary">Search Results</h2>
            {reasoning && <p className="text-center text-muted-foreground mb-6">{reasoning}</p>}
            
            {isProcessing && (
                 <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4">Analyzing image and finding products...</p>
                </div>
            )}

            {!isProcessing && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {results.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
      )}

    </div>
  );
}
