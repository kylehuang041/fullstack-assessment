import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/products';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const rawLimit = searchParams.get('limit');
  const rawOffset = searchParams.get('offset');
  const limit = Math.min(Math.max(parseInt(rawLimit || '20', 10) || 20, 1), 100);
  const offset = Math.max(parseInt(rawOffset || '0', 10) || 0, 0);

  const filters = {
    category: searchParams.get('category') || undefined,
    subCategory: searchParams.get('subCategory') || undefined,
    search: searchParams.get('search') || undefined,
    limit,
    offset,
  };

  const products = productService.getAll(filters);
  const total = productService.getTotalCount({
    category: filters.category,
    subCategory: filters.subCategory,
    search: filters.search,
  });

  return NextResponse.json({
    products,
    total,
    limit: filters.limit,
    offset: filters.offset,
  });
}
