import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from './product.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private allProducts: Product[] = [];
  private searchResultsSubject = new BehaviorSubject<Product[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable();

  constructor(
    private router: Router,
    private productService: ProductService
  ) {
    // Get current products
    this.productService.products$.subscribe(products => {
      this.allProducts = products;
    });
  }

  search(query: string): Product[] {
    if (!query.trim()) {
      this.searchResultsSubject.next([]);
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    
    const results = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm)) ||
      product.category.toLowerCase().includes(searchTerm)
    );

    this.searchResultsSubject.next(results);
    return results;
  }

  navigateToSearch(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
