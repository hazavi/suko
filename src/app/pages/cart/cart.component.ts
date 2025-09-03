import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    public currencyService: CurrencyService
  ) {}

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
    const subtotal = this.cartService.getTotalPrice();
    const convertedPrice = this.currencyService.convertFromEUR(subtotal);
    return convertedPrice.toFixed(2);
  }

  getDisplayPrice(price: number): string {
    const convertedPrice = this.currencyService.convertFromEUR(price);
    return convertedPrice.toFixed(2);
  }

  getItemTotal(item: CartItem): string {
    const total = item.product.price * item.quantity;
    const convertedTotal = this.currencyService.convertFromEUR(total);
    return convertedTotal.toFixed(2);
  }
}
