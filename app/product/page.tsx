'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  stacklineSku: string;
  title: string;
  categoryName: string;
  subCategoryName: string;
  imageUrls: string[];
  featureBullets: string[];
  retailerSku: string;
}

export default function ProductPage() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get('product');
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productParam) {
      try {
        const parsedProduct = JSON.parse(productParam);
        setProduct(parsedProduct);
      } catch (error) {
        console.error('Failed to parse product data:', error);
      }
    }
  }, [productParam]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <Card className="p-8">
            <p className="text-center text-muted-foreground">Product not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96 w-full bg-muted">
                  {product.imageUrls?.[selectedImage] && (
                    <Image
                      src={product.imageUrls[selectedImage]}
                      alt={product.title}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      unoptimized
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 border-2 rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.title} - Image ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="100px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                {product.categoryName && (
                  <Link
                    href={`/?category=${encodeURIComponent(product.categoryName)}`}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {product.categoryName}
                    </Badge>
                  </Link>
                )}
                {product.subCategoryName && (
                  <Link
                    href={`/?category=${encodeURIComponent(product.categoryName ?? '')}&subCategory=${encodeURIComponent(product.subCategoryName)}`}
                  >
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {product.subCategoryName}
                    </Badge>
                  </Link>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              {product.retailerSku && (
                <p className="text-sm text-muted-foreground">SKU: {product.retailerSku}</p>
              )}
            </div>

            {product.featureBullets && product.featureBullets.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Features</h2>
                  <ul className="space-y-3">
                    {product.featureBullets.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors border border-transparent hover:border-border"
                      >
                        <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-foreground" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
