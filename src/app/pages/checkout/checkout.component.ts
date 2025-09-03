import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;
  currentStep = 1;
  isLoading = false;

  constructor(
    private cartService: CartService,
    public currencyService: CurrencyService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      
      // Shipping Address
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      
      // Payment Information
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
      cardName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cartItems = this.cartService.cartItems$();
    
    // Redirect to cart if no items
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
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

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async processPayment() {
    if (this.checkoutForm.valid) {
      this.isLoading = true;
      
      // Simulate payment processing
      setTimeout(() => {
        this.isLoading = false;
        // Clear cart after successful payment
        this.cartService.clearCart();
        // Navigate to success page
        this.router.navigate(['/order-success']);
      }, 2000);
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return this.checkoutForm.get('email')?.valid || false;
      case 2:
        return ['firstName', 'lastName', 'address', 'city', 'postalCode', 'country']
          .every(field => this.checkoutForm.get(field)?.valid);
      case 3:
        return ['cardNumber', 'expiryDate', 'cvv', 'cardName']
          .every(field => this.checkoutForm.get(field)?.valid);
      default:
        return false;
    }
  }
}
