import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
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
      
      // Success message is handled by cart service
    }
  }
}
