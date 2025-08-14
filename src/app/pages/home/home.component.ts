import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  private cartService = inject(CartService);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('HomeComponent ngOnInit called');
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts() {
    // Subscribe to products from Firebase
    this.productService.products$.subscribe(products => {
      console.log('All products loaded:', products);
      this.featuredProducts = this.productService.getFeaturedProducts();
      console.log('Featured products:', this.featuredProducts);
    });
  }

  addToCart(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product);
  }
}
