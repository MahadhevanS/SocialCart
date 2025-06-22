'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Download, Copy } from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { generateProductImage } from '@/ai/flows/generate-product-image-flow';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function ProductImageGenerator({ product, onGenerate, isLoading }: { product: Product; onGenerate: () => void; isLoading: boolean; }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Current Image</p>
            <Image
              src={product.images[0]}
              alt={`Current image for ${product.name}`}
              width={200}
              height={200}
              className="rounded-md object-cover aspect-square"
              data-ai-hint={product.imageHint}
            />
          </div>
          <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2 text-center">AI Generation</p>
              <Button onClick={onGenerate} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                Generate New Image
              </Button>
               <p className="text-xs text-muted-foreground mt-2 text-center">Generates a new image using AI. This may take a few seconds.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function AdminImageGeneratorPage() {
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; name: string } | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async (product: Product) => {
    setLoadingProductId(product.id);
    try {
      const result = await generateProductImage({
        productName: product.name,
        productDescription: product.description,
      });
      setGeneratedImage({ url: result.imageDataUri, name: product.name });
    } catch (error) {
      console.error("Image generation failed:", error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate an image for this product.',
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  const copyToClipboard = () => {
    if (generatedImage) {
      navigator.clipboard.writeText(generatedImage.url);
      toast({ title: 'Copied!', description: 'Data URI copied to clipboard.' });
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">AI Product Image Generator</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Create unique, photorealistic images for your products.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
            Note: This is a tool to generate images. You would then need to upload the image to a storage service and update the product URL manually.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockProducts.map((product) => (
          <ProductImageGenerator
            key={product.id}
            product={product}
            isLoading={loadingProductId === product.id}
            onGenerate={() => handleGenerateImage(product)}
          />
        ))}
      </div>

      <Dialog open={!!generatedImage} onOpenChange={(isOpen) => !isOpen && setGeneratedImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generated Image for: {generatedImage?.name}</DialogTitle>
            <DialogDescription>
              Here is the new AI-generated image. You can right-click to save it, or copy its Data URI.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            {generatedImage && (
              <Image
                src={generatedImage.url}
                alt={`AI generated image for ${generatedImage.name}`}
                width={800}
                height={800}
                className="rounded-lg object-contain w-full max-h-[60vh]"
              />
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="mr-2" /> Copy Data URI
            </Button>
            <a href={generatedImage?.url} download={`${generatedImage?.name.replace(/\s+/g, '-')}-ai.png`}>
                <Button>
                    <Download className="mr-2" /> Download Image
                </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
