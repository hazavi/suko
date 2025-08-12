import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.cartItems$();
  }

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item.product.id!, quantity, item.size, item.color);
    this.cartItems = this.cartService.cartItems$();
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id!, item.size, item.color);
    this.cartItems = this.cartService.cartItems$();
  }

  getSubtotal(): string {
    return this.cartService.getTotalPrice().toFixed(2);
  }
}
