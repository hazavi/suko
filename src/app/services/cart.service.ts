import { Injectable, signal } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  public cartItems$ = this.cartItems.asReadonly();

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
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        size,
        color
      };
      this.cartItems.set([...this.cartItems(), newItem]);
    }
  }

  removeFromCart(productId: string, size?: string, color?: string) {
    const filteredItems = this.cartItems().filter(
      item => !(item.product.id === productId && 
                item.size === size && 
                item.color === color)
    );
    this.cartItems.set(filteredItems);
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
  }

  clearCart() {
    this.cartItems.set([]);
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
