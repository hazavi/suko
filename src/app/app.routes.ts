import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { SearchComponent } from './pages/search/search.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
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
      { path: 'new-arrivals', component: ShopComponent },
      { path: 'tees', component: ShopComponent },
      { path: 'sweats', component: ShopComponent },
      { path: 'tops-shirts', component: ShopComponent },
      { path: 'knits', component: ShopComponent },
      { path: 'outerwear', component: ShopComponent },
      { path: 'denim', component: ShopComponent },
      { path: 'shorts', component: ShopComponent },
      { path: 'pants', component: ShopComponent },
      { path: 'headwear', component: ShopComponent },
      { path: 'sunglasses', component: ShopComponent },
      { path: 'accessories', component: ShopComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'bag', component: CartComponent },
      { path: 'features', component: HomeComponent }, // Placeholder
      { path: 'support', component: HomeComponent }, // Placeholder
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
