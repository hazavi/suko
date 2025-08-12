import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-detail" *ngIf="product()">
      <div class="container">
        <div class="product-content">
          <!-- Product Images -->
          <div class="product-images">
            <div class="main-image">
              <img [src]="selectedImage()" [alt]="product()!.name" class="main-img">
            </div>
            <div class="thumbnail-images" *ngIf="product()!.images.length > 1">
              <button 
                *ngFor="let image of product()!.images" 
                (click)="selectImage(image)"
                [class.active]="selectedImage() === image"
                class="thumbnail-btn">
                <img [src]="image" [alt]="product()!.name" class="thumbnail-img">
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h1 class="product-name">{{ product()!.name }}</h1>
            
            <div class="product-price">
              <span class="price" [class.sale]="product()!.originalPrice">€{{ product()!.price }}</span>
              <span *ngIf="product()!.originalPrice" class="original-price">€{{ product()!.originalPrice }}</span>
            </div>

            <div class="product-description">
              <p>{{ product()!.description }}</p>
            </div>

            <!-- Size Selection -->
            <div class="size-selection" *ngIf="product()!.sizes.length > 0">
              <h3>Size</h3>
              <div class="size-options">
                <button 
                  *ngFor="let size of product()!.sizes"
                  [class.selected]="selectedSize() === size"
                  (click)="selectSize(size)"
                  class="size-btn">
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Color Selection -->
            <div class="color-selection" *ngIf="product()!.colors.length > 0">
              <h3>Color</h3>
              <div class="color-options">
                <button 
                  *ngFor="let color of product()!.colors"
                  [class.selected]="selectedColor() === color"
                  (click)="selectColor(color)"
                  class="color-btn">
                  {{ color }}
                </button>
              </div>
            </div>

            <!-- Add to Cart -->
            <div class="add-to-cart">
              <button 
                [disabled]="!product()!.inStock"
                (click)="addToCart()"
                class="add-to-cart-btn">
                {{ product()!.inStock ? 'ADD TO BAG' : 'SOLD OUT' }}
              </button>
            </div>

            <!-- Product Details -->
            <div class="product-details">
              <div class="detail-item">
                <strong>Category:</strong> {{ product()!.category | titlecase }}
              </div>
              <div class="detail-item">
                <strong>Availability:</strong> 
                <span [class]="product()!.inStock ? 'in-stock' : 'out-of-stock'">
                  {{ product()!.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!product()" class="loading">
      <div class="loading-spinner"></div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .product-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }

    .product-images {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .main-image {
      width: 100%;
      aspect-ratio: 4/5;
      overflow: hidden;
      background: #f8f8f8;
    }

    .main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-images {
      display: flex;
      gap: 10px;
    }

    .thumbnail-btn {
      width: 80px;
      height: 100px;
      border: 2px solid transparent;
      overflow: hidden;
      cursor: pointer;
      background: none;
      padding: 0;
      transition: border-color 0.2s;
    }

    .thumbnail-btn.active {
      border-color: black;
    }

    .thumbnail-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      padding-top: 20px;
    }

    .product-name {
      font-size: 32px;
      font-weight: 500;
      letter-spacing: 1px;
      margin: 0 0 20px 0;
      color: black;
      text-transform: uppercase;
    }

    .product-price {
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .price {
      font-size: 24px;
      font-weight: 500;
      color: black;
    }

    .price.sale {
      color: #e74c3c;
    }

    .original-price {
      font-size: 20px;
      color: #999;
      text-decoration: line-through;
    }

    .product-description {
      margin-bottom: 40px;
      line-height: 1.6;
      color: #666;
    }

    .size-selection,
    .color-selection {
      margin-bottom: 30px;
    }

    .size-selection h3,
    .color-selection h3 {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
      margin-bottom: 15px;
      text-transform: uppercase;
    }

    .size-options,
    .color-options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .size-btn {
      padding: 12px 16px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      min-width: 50px;
    }

    .size-btn.selected {
      border-color: black;
      background: black;
      color: white;
    }

    .size-btn:hover:not(.selected) {
      border-color: #999;
    }

    .color-btn {
      padding: 10px 16px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .color-btn.selected {
      border-color: black;
      background: black;
      color: white;
    }

    .color-btn:hover:not(.selected) {
      border-color: #999;
    }

    .add-to-cart {
      margin-bottom: 40px;
    }

    .add-to-cart-btn {
      width: 100%;
      padding: 16px;
      background: black;
      color: white;
      border: none;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.8px;
      cursor: pointer;
      transition: background-color 0.2s;
      text-transform: uppercase;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      background: #333;
    }

    .add-to-cart-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .product-details {
      border-top: 1px solid #e5e5e5;
      padding-top: 30px;
    }

    .detail-item {
      margin-bottom: 15px;
      font-size: 14px;
      color: #666;
    }

    .detail-item strong {
      color: black;
    }

    .in-stock {
      color: #27ae60;
    }

    .out-of-stock {
      color: #e74c3c;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid black;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .product-content {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .product-name {
        font-size: 24px;
      }

      .price {
        font-size: 20px;
      }

      .thumbnail-images {
        justify-content: center;
      }

      .container {
        padding: 20px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  selectedImage = signal<string>('');
  selectedSize = signal<string>('');
  selectedColor = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private loadProduct(id: string) {
    this.productService.getProduct(id).subscribe(product => {
      if (product) {
        this.product.set(product);
        this.selectedImage.set(product.images[0] || '');
        if (product.sizes.length > 0) {
          this.selectedSize.set(product.sizes[0]);
        }
        if (product.colors.length > 0) {
          this.selectedColor.set(product.colors[0]);
        }
      }
    });
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  selectColor(color: string) {
    this.selectedColor.set(color);
  }

  addToCart() {
    const product = this.product();
    if (product && product.inStock) {
      this.cartService.addToCart(
        product,
        1,
        this.selectedSize(),
        this.selectedColor()
      );
      
      // Show success message or feedback
      alert('Added to bag!');
    }
  }
}
