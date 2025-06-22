
import { ProductCard } from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { PartyPopper, Sprout } from 'lucide-react';
import Image from 'next/image';
import { EcoPlannerDialog } from '@/components/eco-planner/EcoPlannerDialog';

export default function ProductsPage() {
  const products: Product[] = mockProducts;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* New Section for Events & Festivals */}
      <Card className="mb-12 overflow-hidden shadow-xl bg-gradient-to-r from-primary/5 via-background to-accent/5 border">
        <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 order-2 md:order-1">
                 <h2 className="text-3xl font-bold font-headline text-primary mb-4">Celebrate Sustainably</h2>
                 <p className="text-muted-foreground mb-6 text-lg">
                    Need help planning an eco-friendly event? Get AI-powered suggestions and checklists.
                 </p>
                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <PartyPopper className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Personalized Event Plans</h3>
                            <p className="text-muted-foreground text-sm">Get checklists for plastic-free birthdays, weddings, and more.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                         <div className="p-3 bg-accent/10 rounded-full">
                            <Sprout className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Curated Product Ideas</h3>
                            <p className="text-muted-foreground text-sm">Discover sustainable products perfect for any occasion.</p>
                        </div>
                    </div>
                </div>
                 <EcoPlannerDialog />
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] order-1 md:order-2">
                <Image
                    src="https://source.unsplash.com/800x600/?eco-friendly,festival"
                    alt="Eco-friendly festival celebration"
                    fill
                    className="object-cover"
                    data-ai-hint="eco festival"
                />
            </div>
        </div>
      </Card>

      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center font-headline text-primary">Featured Products</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No products available at the moment. Please check back later!</p>
      )}
    </div>
  );
}
