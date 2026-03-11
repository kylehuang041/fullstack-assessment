import productsData from '@/sample-products.json';

export interface Product {
  stacklineSku: string;
  featureBullets: string[];
  imageUrls: string[];
  subCategoryId: number;
  title: string;
  categoryName: string;
  retailerSku: string;
  categoryId: number;
  subCategoryName: string;
}

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export class ProductService {
  private products: Product[];

  constructor() {
    this.products = productsData as Product[];
  }

  getAll(filters?: ProductFilters): Product[] {
    let filtered = [...this.products];

    if (filters?.category) {
      const cat = filters.category.toLowerCase();
      filtered = filtered.filter(
        (p) => p.categoryName?.toLowerCase() === cat
      );
    }

    if (filters?.subCategory) {
      const subCat = filters.subCategory.toLowerCase();
      filtered = filtered.filter(
        (p) => p.subCategoryName?.toLowerCase() === subCat
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.categoryName?.toLowerCase().includes(searchLower) ||
          p.subCategoryName?.toLowerCase().includes(searchLower)
      );
    }

    const offset = filters?.offset || 0;
    const limit = filters?.limit || filtered.length;

    return filtered.slice(offset, offset + limit);
  }

  getById(sku: string): Product | undefined {
    return this.products.find((p) => p.stacklineSku === sku);
  }

  getCategories(): string[] {
    const categories = new Set(
      this.products.map((p) => p.categoryName).filter(Boolean)
    );
    return Array.from(categories).sort();
  }

  getSubCategories(category?: string): string[] {
    let filtered = this.products;

    if (category) {
      const cat = category.toLowerCase();
      filtered = filtered.filter(
        (p) => p.categoryName?.toLowerCase() === cat
      );
    }

    const subCategories = new Set(
      filtered.map((p) => p.subCategoryName).filter(Boolean)
    );
    return Array.from(subCategories).sort();
  }

  getTotalCount(filters?: Omit<ProductFilters, 'limit' | 'offset'>): number {
    let filtered = [...this.products];

    if (filters?.category) {
      const cat = filters.category.toLowerCase();
      filtered = filtered.filter(
        (p) => p.categoryName?.toLowerCase() === cat
      );
    }

    if (filters?.subCategory) {
      const subCat = filters.subCategory.toLowerCase();
      filtered = filtered.filter(
        (p) => p.subCategoryName?.toLowerCase() === subCat
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.categoryName?.toLowerCase().includes(searchLower) ||
          p.subCategoryName?.toLowerCase().includes(searchLower)
      );
    }

    return filtered.length;
  }
}

export const productService = new ProductService();
