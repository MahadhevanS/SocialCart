import { getProductById } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product: Product | undefined = getProductById(params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: `${product.name} | SocialCart`,
    description: product.description.substring(0, 150),
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product: Product | undefined = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

// Optional: Generate static paths if you have a fixed set of products
// export async function generateStaticParams() {
//   const products = mockProducts; // Assuming mockProducts is available or fetched
//   return products.map((product) => ({
//     id: product.id,
//   }));
// }
