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
        
        // Initialize selected values
        if (product.sizes.length > 0) {
          this.selectedSize.set(product.sizes[0]);
        }
        if (product.colors.length > 0) {
          this.selectedColor.set(product.colors[0]);
          
          // Set initial image based on first color's images if available
          if (product.colorImages && product.colorImages[product.colors[0]]) {
            this.selectedImage.set(product.colorImages[product.colors[0]][0]);
          } else {
            this.selectedImage.set(product.images[0] || '');
          }
        } else {
          this.selectedImage.set(product.images[0] || '');
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
    
    // Update selected image based on color-specific images
    const product = this.product();
    if (product && product.colorImages && product.colorImages[color]) {
      // Use the first image for the selected color
      this.selectedImage.set(product.colorImages[color][0]);
    }
  }

  // Get images for the current product (color-specific or default)
  getCurrentImages(): string[] {
    const product = this.product();
    if (!product) return [];
    
    const selectedColor = this.selectedColor();
    if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
      return product.colorImages[selectedColor];
    }
    
    return product.images;
  }

  // Get preview image for color selection
  getColorPreviewImage(color: string): string {
    const product = this.product();
    if (!product) return '';
    
    // If color-specific images exist, use the first one
    if (product.colorImages && product.colorImages[color] && product.colorImages[color].length > 0) {
      return product.colorImages[color][0];
    }
    
    // Fallback to first general image
    return product.images[0] || '';
  }

  // Get color hex value for visual swatch
  getColorHex(color: string): string {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Navy': '#001f3f',
      'Grey': '#808080',
      'Gray': '#808080',
      'Red': '#FF4136',
      'Green': '#2ECC40',
      'Blue': '#0074D9',
      'Pink': '#F012BE',
      'Brown': '#8B4513',
      'Beige': '#F5F5DC',
      'Cream': '#FFFDD0',
      'Olive': '#808000',
      'Maroon': '#800000',
      'Burgundy': '#800020'
    };
    return colorMap[color] || '#CCCCCC';
  }

  // Get category display name for breadcrumbs
  getCategoryDisplayName(): string {
    const product = this.product();
    if (!product) return '';
    
    const categoryMap: { [key: string]: string } = {
      'tees': 'T-Shirts',
      'sweats': 'Hoodies',
      'tops-shirts': 'Shirts',
      'knits': 'Knits',
      'outerwear': 'Jackets',
      'pants': 'Trousers',
      'shorts': 'Shorts',
      'accessories': 'Accessories'
    };
    
    return categoryMap[product.category] || product.category.charAt(0).toUpperCase() + product.category.slice(1);
  }

  // Get category route for breadcrumbs
  getCategoryRoute(): string {
    const product = this.product();
    if (!product) return '/shop';
    
    const routeMap: { [key: string]: string } = {
      'tees': '/t-shirt',
      'sweats': '/hoodies', 
      'tops-shirts': '/shirts',
      'knits': '/knits',
      'outerwear': '/jackets',
      'pants': '/trousers',
      'shorts': '/shorts',
      'accessories': '/accessories'
    };
    
    return routeMap[product.category] || `/shop/${product.category}`;
  }

  // Get dynamic product name with color
  getProductDisplayName(): string {
    const product = this.product();
    
    if (!product) return '';
    
    return product.name;
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
