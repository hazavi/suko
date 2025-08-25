import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService, Product } from '../../services/product.service';
import { CurrencyService } from '../../services/currency.service';

export type ViewMode = 'grid' | 'compact';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentCategory: string = '';
  viewMode: ViewMode = 'grid';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    public currencyService: CurrencyService
  ) {}
  getDisplayPrice(product: Product): string {
    const price = this.currencyService.convertFromEUR(product.price);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getDisplayOriginalPrice(product: Product): string {
    if (!product.originalPrice) return '';
    const price = this.currencyService.convertFromEUR(product.originalPrice);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  ngOnInit() {
    // Initialize with current URL
    this.updateCategoryFromUrl();
    
    // Subscribe to route changes
    this.route.url.subscribe(() => {
      this.updateCategoryFromUrl();
      this.filterProducts();
      this.updatePageTitle();
    });

    // Subscribe to route params
    this.route.params.subscribe(params => {
      if (params['category']) {
        this.currentCategory = params['category'];
        this.filterProducts();
        this.updatePageTitle();
      }
    });

    // Subscribe to products
    this.productService.products$.subscribe(products => {
      this.products = products;
      this.filterProducts();
    });
  }

  private updateCategoryFromUrl() {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment);
    const lastSegment = segments[segments.length - 1];
    
    // Handle different URL patterns
    if (lastSegment === 'shop' || !lastSegment) {
      this.currentCategory = 'shop';
    } else {
      this.currentCategory = lastSegment;
    }
    
    console.log('URL:', url, 'Category:', this.currentCategory);
  }

  private updatePageTitle() {
    const categoryTitle = this.getCategoryTitle();
    this.titleService.setTitle(`${categoryTitle} - SUKO`);
  }

  private filterProducts() {
    if (!this.currentCategory || this.currentCategory === 'shop' || this.currentCategory === 'shop-all') {
      this.filteredProducts = this.products;
    } else if (this.currentCategory === 'new-arrivals') {
      this.filteredProducts = this.products.filter(product => product.isNewArrival);
    } else {
      // Map route names to actual category names
      const categoryMap: { [key: string]: string } = {
        't-shirt': 't-shirts',
        'hoodies': 'hoodies', 
        'shirts': 'shirts',
        'knits': 'knits',
        'jackets': 'jackets',
        'trousers': 'trousers',
        'shorts': 'shorts',
        'accessories': 'accessories'
      };
      
      const actualCategory = categoryMap[this.currentCategory] || this.currentCategory;
      
      this.filteredProducts = this.products.filter(
        product => product.category === actualCategory
      );
    }
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
  }

  getCategoryTitle(): string {
    if (!this.currentCategory || this.currentCategory === 'shop' || this.currentCategory === 'shop-all') {
      return 'All Products';
    }
    
    const categoryTitles: { [key: string]: string } = {
      'new-arrivals': 'New Arrivals',
      't-shirt': 'T-Shirts',
      'hoodies': 'Hoodies',
      'shirts': 'Shirts',
      'knits': 'Knits',
      'jackets': 'Jackets',
      'trousers': 'Trousers',
      'shorts': 'Shorts',
      'accessories': 'Accessories',
      // Legacy support
      'tees': 'Tees',
      'sweats': 'Sweats',
      'tops-shirts': 'Tops & Shirts',
      'outerwear': 'Outerwear',
      'denim': 'Denim',
      'pants': 'Pants',
      'headwear': 'Headwear',
      'sunglasses': 'Sunglasses'
    };

    return categoryTitles[this.currentCategory] || this.currentCategory.replace('-', ' ').toUpperCase();
  }

  // Get the primary image for a product (color-specific or default)
  getProductImage(product: Product): string {
    // If product has color-specific images, use the first color's first image
    if (product.colorImages && product.colors.length > 0) {
      const firstColor = product.colors[0];
      if (product.colorImages[firstColor] && product.colorImages[firstColor].length > 0) {
        return product.colorImages[firstColor][0];
      }
    }
    
    // Fall back to regular images
    return product.images[0] || '';
  }
}
