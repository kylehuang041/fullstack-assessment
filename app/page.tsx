"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Pagination } from "@/components/pagination";

interface Product {
  stacklineSku: string;
  title: string;
  categoryName: string;
  subCategoryName: string;
  imageUrls: string[];
}

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const productsPerPage = 20;

  const submitSearch = () => {
    const value = searchInputRef.current?.value ?? "";
    setSearch(value);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(undefined);
    setSelectedSubCategory(undefined);
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const categoryParam = searchParams.get("category") || undefined;
  const subCategoryParam = searchParams.get("subCategory") || undefined;

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedSubCategory(subCategoryParam);
  }, [categoryParam, subCategoryParam]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    const category = categoryParam ?? selectedCategory;
    if (category) {
      fetch(`/api/subcategories?category=${encodeURIComponent(category)}`)
        .then((res) => res.json())
        .then((data) => setSubCategories(data.subCategories ?? []))
        .catch((err) => console.error("Failed to fetch subcategories:", err));
    } else {
      setSubCategories([]);
      if (!subCategoryParam) {
        setSelectedSubCategory(undefined);
      }
    }
  }, [selectedCategory, categoryParam, subCategoryParam]);

  const prevFiltersRef = useRef({ search, selectedCategory, selectedSubCategory });
  const filtersChanged =
    prevFiltersRef.current.search !== search ||
    prevFiltersRef.current.selectedCategory !== selectedCategory ||
    prevFiltersRef.current.selectedSubCategory !== selectedSubCategory;

  if (filtersChanged) {
    prevFiltersRef.current = { search, selectedCategory, selectedSubCategory };
    setCurrentPage(1);
  }

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedSubCategory) params.append("subCategory", selectedSubCategory);
    params.append("limit", String(productsPerPage));
    const offset = filtersChanged ? 0 : (currentPage - 1) * productsPerPage;
    params.append("offset", String(offset));

    fetch(`/api/products?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Products API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data.products ?? []);
        setTotalProducts(data.total ?? 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
        setTotalProducts(0);
        setLoading(false);
      });
    // filtersChanged is intentionally omitted - it's used only for offset calc when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, selectedSubCategory, currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" onClick={clearFilters}>
            <h1 className="text-4xl font-bold mb-6 hover:opacity-80 transition-opacity cursor-pointer">StackShop</h1>
          </Link>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1 flex items-stretch">
              <button
                type="button"
                onClick={submitSearch}
                className="absolute right-0 top-0 bottom-0 w-9 flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted-foreground/20 rounded-r-md transition-colors cursor-pointer border-0"
                aria-label="Search"
              >
                <Search strokeWidth={2.5} />
              </button>
              <Input
                ref={searchInputRef}
                placeholder="Search products..."
                className="pl-5 pr-11"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitSearch();
                  }
                }}
              />
            </div>

            <Select
              value={selectedCategory ?? ""}
              onValueChange={(value) => setSelectedCategory(value || undefined)}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory && subCategories.length > 0 && (
              <Select
                value={selectedSubCategory ?? ""}
                onValueChange={(value) =>
                  setSelectedSubCategory(value || undefined)
                }
              >
                <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCat) => (
                    <SelectItem key={subCat} value={subCat}>
                      {subCat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {(search || selectedCategory || selectedSubCategory) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <>
            <Pagination
              currentPage={currentPage}
              totalItems={totalProducts}
              itemsPerPage={productsPerPage}
              onPageChange={setCurrentPage}
              showSummary
              className="mb-6"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.stacklineSku}
                  className="h-full transition-shadow hover:shadow-lg"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
                      {product.imageUrls?.[0] && (
                        <Image
                          src={product.imageUrls[0]}
                          alt={product.title}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle className="text-base line-clamp-2 mb-2">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="flex gap-2 flex-wrap">
                      {product.categoryName && (
                        <Badge
                          variant="secondary"
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedCategory(product.categoryName);
                            setSelectedSubCategory(undefined);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedCategory(product.categoryName);
                              setSelectedSubCategory(undefined);
                            }
                          }}
                        >
                          {product.categoryName}
                        </Badge>
                      )}
                      {product.subCategoryName && (
                        <Badge
                          variant="outline"
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedCategory(product.categoryName);
                            setSelectedSubCategory(product.subCategoryName);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedCategory(product.categoryName);
                              setSelectedSubCategory(product.subCategoryName);
                            }
                          }}
                        >
                          {product.subCategoryName}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/product?product=${encodeURIComponent(JSON.stringify(product))}`}
                    >
                      <Button variant="outline" className="w-full cursor-pointer">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={totalProducts}
              itemsPerPage={productsPerPage}
              onPageChange={setCurrentPage}
              showSummary={false}
              className="mt-8"
            />
          </>
        )}
      </main>
    </div>
  );
}
