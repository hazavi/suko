import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  private async loadFeaturedProducts() {
    try {
      // For now, using mock data. Will be replaced with Firebase data
      this.featuredProducts = [
        {
          id: '1',
          name: 'SUKO GROWN TEE PIGMENT DYED',
          description: 'Premium cotton tee with pigment dyed finish',
          price: 48,
          images: ['/assets/products/tee1.svg'],
          category: 'tees',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Gray'],
          inStock: false,
          featured: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: '2',
          name: 'SUKO GROWN TEE PIGMENT DYED',
          description: 'Premium cotton tee with pigment dyed finish',
          price: 48,
          images: ['/assets/products/tee2.svg'],
          category: 'tees',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['White'],
          inStock: true,
          featured: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: '3',
          name: 'SUKO GROWN TEE PIGMENT DYED',
          description: 'Premium cotton tee with pigment dyed finish',
          price: 48,
          images: ['/assets/products/tee3.svg'],
          category: 'tees',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Green'],
          inStock: true,
          featured: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: '4',
          name: 'BODY SCAN TEE',
          description: 'Graphic tee with body scan print',
          price: 45,
          images: ['/assets/products/tee4.svg'],
          category: 'tees',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Gray'],
          inStock: false,
          featured: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  }
}
