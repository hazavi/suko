import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to route params to handle category changes
    this.route.params.subscribe(params => {
      this.currentCategory = params['category'] || '';
      this.filterProducts();
    });

    // Subscribe to products
    this.productService.products$.subscribe(products => {
      this.products = products;
      this.filterProducts();
    });
  }

  private filterProducts() {
    if (!this.currentCategory || this.currentCategory === 'shop') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        product => product.category === this.currentCategory
      );
    }
  }

  getCategoryTitle(): string {
    if (!this.currentCategory || this.currentCategory === 'shop') {
      return 'All Products';
    }
    
    const categoryTitles: { [key: string]: string } = {
      'new-arrivals': 'New Arrivals',
      'tees': 'Tees',
      'sweats': 'Sweats',
      'tops-shirts': 'Tops & Shirts',
      'knits': 'Knits',
      'outerwear': 'Outerwear',
      'denim': 'Denim',
      'shorts': 'Shorts',
      'pants': 'Pants',
      'headwear': 'Headwear',
      'sunglasses': 'Sunglasses',
      'accessories': 'Accessories'
    };

    return categoryTitles[this.currentCategory] || this.currentCategory.replace('-', ' ').toUpperCase();
  }
}
