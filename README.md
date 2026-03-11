# Stackline Full Stack Assignment

## Overview

This is a sample eCommerce website that includes:
- Product List Page
- Search Results Page
- Product Detail Page

The application contains various bugs including UX issues, design problems, functionality bugs, and potential security vulnerabilities.

## Getting Started

```bash
yarn install
yarn dev
```

## Your Task

1. **Identify and fix bugs** - Review the application thoroughly and fix any issues you find
2. **Document your work** - Create a comprehensive README that includes:
   - What bugs/issues you identified
   - How you fixed each issue
   - Why you chose your approach
   - Any improvements or enhancements you made

We recommend spending no more than 2 hours on this assignment. We are more interested in the quality of your work and your communication than the amount of time you spend or how many bugs you fix!

## Submission

- Fork this repository
- Make your fixes and improvements
- **Replace this README** with your own that clearly documents all changes and your reasoning
- Provide your Stackline contact with a link to a git repository where you have committed your changes

---
## Notes
I used AI-coding assistant to verify and help me code. I found the bugs myself through installation, running, and testing product.

## Bugs & Fixes

### Bug Report 1: product.imageUrls Undefined
- **Description:** `TypeError: Cannot read properties of undefined (reading '0')` when rendering product cards.
- **Cause:** Some products have `imageUrls` as `undefined` or `null`.
- **Fix:** Used optional chaining: `product.imageUrls?.[0]` instead of `product.imageUrls[0]`.
- **Why:** Prevents runtime errors when data is incomplete.

### Bug Report 2: Invalid Image Hostname
- **Description:** Next.js Image component error—hostname `images-na.ssl-images-amazon.com` not configured.
- **Fix:** Added hostname to `remotePatterns` in `next.config.ts`.
- **Why:** Next.js requires external image hostnames to be allowlisted for optimization.

### Bug Report 3: Categories Not Resetting on Clear Filters
- **Description:** After clicking "Clear Filters," category Select dropdowns did not show "All Categories"/"All Subcategories."
- **Cause:** Radix Select expects `value=""` for empty state, not `undefined`.
- **Fix:** Passed `value={selectedCategory ?? ""}` and `value={selectedSubCategory ?? ""}` to Select components.
- **Why:** Radix treats empty string as "no selection" and displays the placeholder correctly.

### Bug Report 4: Products API Invalid limit/offset
- **Description:** Malformed `limit` or `offset` query params (e.g., negative, NaN) could cause incorrect pagination.
- **Fix:** Validate and clamp values: `limit` between 1–100, `offset` ≥ 0; invalid numbers default to 20 and 0.
- **Why:** Prevents invalid slice indices and unexpected API behavior.

### Bug Report 5: Product Service Null Safety
- **Description:** Calling `.toLowerCase()` on `undefined` for `categoryName` or `subCategoryName` would throw.
- **Fix:** Used optional chaining (`p.categoryName?.toLowerCase()`) and filtered out falsy values in `getCategories`/`getSubCategories`.
- **Why:** Handles incomplete or malformed product data without crashes.

### Bug Report 6: API Response Fallbacks
- **Description:** If `/api/categories` or `/api/subcategories` returned undefined or malformed data, `data.categories.map()` would throw.
- **Fix:** `setCategories(data.categories ?? [])` and `setSubCategories(data.subCategories ?? [])`.
- **Why:** Ensures state is always an array and prevents runtime errors.

### Bug Report 7: Subcategory Lost When Navigating from Product Page
- **Description:** Clicking a subcategory badge on the product page set category correctly but subcategory was cleared.
- **Cause:** Subcategories effect ran before URL sync and cleared `selectedSubCategory` when `selectedCategory` was still undefined.
- **Fix:** Use `categoryParam ?? selectedCategory` for the fetch and avoid clearing `selectedSubCategory` when `subCategoryParam` exists.
- **Why:** Preserves subcategory when loading from URL params and avoids the race condition.

### Bug Report 8: Subcategories API Missing Category Param
- **Description:** Subcategories fetch did not pass the selected category, so the API returned unfiltered results.
- **Fix:** Updated fetch to `/api/subcategories?category=${encodeURIComponent(selectedCategory)}`.
- **Why:** API expects `category` to filter subcategories correctly.

### Bug Report 9: Product Page Undefined Values
- **Description:** Category/subcategory badges and SKU could display "undefined" when fields were missing.
- **Fix:** Conditional rendering: only show badges when `categoryName`/`subCategoryName` exist; only show SKU when `retailerSku` exists.
- **Why:** Avoids showing raw "undefined" to users.

### Bug Report 10: Product Fetch Errors Unhandled
- **Description:** Products API failures (network, timeout) caused unhandled promise rejections and stuck loading state.
- **Fix:** Added `.catch()` to all fetches; on products failure, set empty array, total 0, and loading false.
- **Why:** Graceful degradation and prevents infinite loading.

### Bug Report 11: Image Optimization Timeout (ETIMEDOUT)
- **Description:** Next.js Image optimization timed out when fetching external Amazon URLs, resulting in 500 errors.
- **Fix:** Added `unoptimized` to product images so the browser loads them directly.
- **Why:** Avoids server-side fetches that can timeout; client can often reach CDNs more reliably.

---

## Optional Changes

1. **Security Update (CVE-2025-66478)**  
   - Upgraded Next.js and React to latest versions for security and compatibility.

2. **Search UX**  
   - Removed live `onChange` search; search now triggers on Enter key or search icon click to reduce API calls.  
   - Search icon styled with theme colors (muted) and placed on the right of the input.

3. **Pagination**  
   - Added pagination (20 products per page) with Previous/Next controls.  
   - Extracted reusable `Pagination` component for modularity.

4. **Product Card Interactions**  
   - Made only "View Details" clickable for product navigation.  
   - Category/subcategory badges filter products when clicked.

5. **StackShop Branding**  
   - "StackShop" header links to home and clears filters on click.

6. **Product Detail Page**  
   - Category/subcategory badges link to home with filters applied.  
   - Improved feature list styling (spacing, bullets, hover states).

7. **Empty State Copy**  
   - Changed "No products found" to "No results found."

8. **URL-Based Filters**  
   - Home page reads `category` and `subCategory` from URL params so links from the product page apply filters correctly.
