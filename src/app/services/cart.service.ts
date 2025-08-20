import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from './product.service';
import { SnackbarService } from './snackbar.service';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface StoredCartData {
  items: CartItem[];
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private snackbarService = inject(SnackbarService);
  private cartItems = signal<CartItem[]>([]);
  public cartItems$ = this.cartItems.asReadonly();
  private readonly STORAGE_KEY = 'suko_cart';
  private readonly EXPIRY_HOURS = 24;
  
  constructor() {
    this.loadCartFromStorage();
  }
  
  // Computed cart count
  public cartCount = computed(() => 
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  // Computed cart total
  public cartTotal = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  private loadCartFromStorage() {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const cartData: StoredCartData = JSON.parse(storedData);
        const now = Date.now();
        const expiryTime = cartData.timestamp + (this.EXPIRY_HOURS * 60 * 60 * 1000);
        
        if (now < expiryTime) {
          this.cartItems.set(cartData.items);
        } else {
          // Cart expired, clear it
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private saveCartToStorage() {
    try {
      const cartData: StoredCartData = {
        items: this.cartItems(),
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  addToCart(product: Product, quantity: number = 1, size?: string, color?: string) {
    const existingItemIndex = this.cartItems().findIndex(
      item => item.product.id === product.id && 
               item.size === size && 
               item.color === color
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...this.cartItems()];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItems.set(updatedItems);
      this.snackbarService.success(`Updated ${product.name} quantity in cart`);
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        size,
        color
      };
      this.cartItems.set([...this.cartItems(), newItem]);
      this.snackbarService.success(`Added ${product.name} to cart`);
    }
    this.saveCartToStorage();
  }

  removeFromCart(productId: string, size?: string, color?: string) {
    const filteredItems = this.cartItems().filter(
      item => !(item.product.id === productId && 
                item.size === size && 
                item.color === color)
    );
    this.cartItems.set(filteredItems);
    this.snackbarService.info('Item removed from cart');
    this.saveCartToStorage();
  }

  updateQuantity(productId: string, quantity: number, size?: string, color?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, size, color);
      return;
    }

    const updatedItems = this.cartItems().map(item => {
      if (item.product.id === productId && 
          item.size === size && 
          item.color === color) {
        return { ...item, quantity };
      }
      return item;
    });
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getTotalItems(): number {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems().reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }
}
