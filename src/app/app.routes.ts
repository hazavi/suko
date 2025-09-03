import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { SearchComponent } from './pages/search/search.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { SupportComponent } from './pages/support/support.component';
import { AdminLoginComponent } from './pages/admin/admin-login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'shop/:category', component: ShopComponent },
      { path: 'search', component: SearchComponent },
      { path: 'shop-all', component: ShopComponent },
      { path: 'new-arrivals', component: ShopComponent },
      { path: 't-shirt', component: ShopComponent },
      { path: 'hoodies', component: ShopComponent },
      { path: 'shirts', component: ShopComponent },
      { path: 'knits', component: ShopComponent },
      { path: 'jackets', component: ShopComponent },
      { path: 'trousers', component: ShopComponent },
      { path: 'shorts', component: ShopComponent },
      { path: 'accessories', component: ShopComponent },
      // Database category routes
      { path: 'tees', component: ShopComponent },
      { path: 'sweats', component: ShopComponent },
      { path: 'tops-shirts', component: ShopComponent },
      { path: 'outerwear', component: ShopComponent },
      { path: 'pants', component: ShopComponent },
      { path: 'product/:name', component: ProductDetailComponent },
      { path: 'bag', component: CartComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'order-success', component: OrderSuccessComponent },
      { path: 'features', component: HomeComponent }, // Placeholder
      { path: 'support', component: SupportComponent },
      { path: 'support/:section', component: SupportComponent },
    ]
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
