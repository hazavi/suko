import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService, Product } from '../../services/product.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private snackbarService = inject(SnackbarService);
  activeTab = signal<'products' | 'add-product' | 'categories' | 'orders' | 'analytics' | 'all-orders' | 'pending-orders'>('products');
  editingProduct = signal<Product | null>(null);
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Search and filter
  searchTerm = '';
  categoryFilter = '';

  // Statistics
  totalProducts = computed(() => this.products.length);
  featuredProducts = computed(() => this.products.filter(p => p.featured).length);
  inStockProducts = computed(() => this.products.filter(p => p.inStock).length);
  uniqueCategories = computed(() => {
    const categories = this.products.map(p => p.category);
    return [...new Set(categories)].length;
  });

  productForm = {
    name: '',
    description: '' as string | undefined,
    price: 0,
    originalPrice: 0,
    category: '',
    inStock: true,
    featured: false
  };

  sizesInput = '';
  colorsInput = '';
  imagesInput = '';
  isSaving = false;

  // Available options
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  availableColors = ['Black', 'White', 'Navy', 'Grey', 'Red', 'Green', 'Blue', 'Pink'];

  // Order properties
  orderSearchTerm = '';
  orderStatusFilter = '';
  analyticsTimeRange = '30d';
  
  // Sample orders data
  sampleOrders = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      date: new Date('2024-01-15'),
      items: [
        { name: 'Classic Black Hoodie', size: 'L', quantity: 1, price: 89.99 },
        { name: 'Vintage Tee', size: 'M', quantity: 2, price: 45.00 }
      ],
      total: 179.99,
      status: 'pending' as const
    },
    {
      id: 'ORD-002', 
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      date: new Date('2024-01-14'),
      items: [
        { name: 'Streetwear Cap', size: 'One Size', quantity: 1, price: 32.50 }
      ],
      total: 32.50,
      status: 'processing' as const
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson', 
      customerEmail: 'mike@example.com',
      date: new Date('2024-01-13'),
      items: [
        { name: 'Urban Joggers', size: 'XL', quantity: 1, price: 68.00 },
        { name: 'Logo Sweatshirt', size: 'L', quantity: 1, price: 75.99 }
      ],
      total: 143.99,
      status: 'delivered' as const
    }
  ];
  
  // Sample analytics data
  sampleTopProducts = [
    { name: 'Classic Black Hoodie', salesCount: 45 },
    { name: 'Vintage Logo Tee', salesCount: 38 },
    { name: 'Streetwear Cap', salesCount: 32 },
    { name: 'Urban Joggers', salesCount: 28 },
    { name: 'Logo Sweatshirt', salesCount: 25 }
  ];
  
  sampleRecentActivity = [
    {
      date: new Date('2024-01-15T10:30:00'),
      type: 'Order Placed',
      customer: 'John Doe',
      amount: 179.99,
      status: 'pending' as const
    },
    {
      date: new Date('2024-01-15T09:15:00'),
      type: 'Payment Received',
      customer: 'Jane Smith',
      amount: 32.50,
      status: 'completed' as const
    },
    {
      date: new Date('2024-01-14T16:45:00'),
      type: 'Order Shipped',
      customer: 'Mike Johnson',
      amount: 143.99,
      status: 'completed' as const
    }
  ];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.productService.products$.subscribe(products => {
      this.products = products;
      this.filterProducts();
    });
  }

  setActiveTab(tab: 'products' | 'add-product' | 'categories' | 'orders' | 'analytics' | 'all-orders' | 'pending-orders') {
    this.activeTab.set(tab);
    if (tab === 'add-product') {
      this.resetForm();
    }
  }

  filterProducts() {
    let filtered = this.products;

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term)) ||
        product.category.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(product => product.category === this.categoryFilter);
    }

    this.filteredProducts = filtered;
  }

  getImagePreviews(): string[] {
    if (!this.imagesInput.trim()) return [];
    
    return this.imagesInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url)
      .slice(0, 6); // Limit to 6 previews
  }

  // Size and Color helpers
  toggleSize(size: string) {
    const currentSizes = this.sizesInput.split(',').map(s => s.trim()).filter(s => s);
    const index = currentSizes.indexOf(size);
    
    if (index > -1) {
      currentSizes.splice(index, 1);
    } else {
      currentSizes.push(size);
    }
    
    this.sizesInput = currentSizes.join(', ');
  }

  isSelectedSize(size: string): boolean {
    const currentSizes = this.sizesInput.split(',').map(s => s.trim()).filter(s => s);
    return currentSizes.includes(size);
  }

  toggleColor(color: string) {
    const currentColors = this.colorsInput.split(',').map(c => c.trim()).filter(c => c);
    const index = currentColors.indexOf(color);
    
    if (index > -1) {
      currentColors.splice(index, 1);
    } else {
      currentColors.push(color);
    }
    
    this.colorsInput = currentColors.join(', ');
  }

  isSelectedColor(color: string): boolean {
    const currentColors = this.colorsInput.split(',').map(c => c.trim()).filter(c => c);
    return currentColors.includes(color);
  }

  getColorHex(color: string): string {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Navy': '#001f3f',
      'Grey': '#808080',
      'Red': '#FF4136',
      'Green': '#2ECC40',
      'Blue': '#0074D9',
      'Pink': '#F012BE'
    };
    return colorMap[color] || '#CCCCCC';
  }

  editProduct(product: Product) {
    this.editingProduct.set(product);
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      inStock: product.inStock,
      featured: product.featured
    };
    this.sizesInput = product.sizes.join(', ');
    this.colorsInput = product.colors.join(', ');
    this.imagesInput = product.images.join(', ');
    this.setActiveTab('add-product');
  }

  async saveProduct() {
    if (this.isSaving) return;
    
    this.isSaving = true;
    try {
      const productData: Omit<Product, 'id'> = {
        ...this.productForm,
        sizes: this.sizesInput.split(',').map(s => s.trim()).filter(s => s),
        colors: this.colorsInput.split(',').map(c => c.trim()).filter(c => c),
        images: this.imagesInput.split(',').map(i => i.trim()).filter(i => i),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      if (this.editingProduct()) {
        await this.productService.updateProduct(this.editingProduct()!.id!, productData);
      } else {
        await this.productService.addProduct(productData);
      }

      this.resetForm();
      this.setActiveTab('products');
      
      // Show success message
      this.snackbarService.success(`Product ${this.editingProduct() ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving product:', error);
      this.snackbarService.error('Error saving product. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await this.productService.deleteProduct(id);
        this.snackbarService.success('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        this.snackbarService.error('Error deleting product. Please try again.');
      }
    }
  }

  cancelEdit() {
    this.resetForm();
    this.setActiveTab('products');
  }

  resetForm() {
    this.editingProduct.set(null);
    this.isSaving = false;
    this.productForm = {
      name: '',
      description: '' as string | undefined,
      price: 0,
      originalPrice: 0,
      category: '',
      inStock: true,
      featured: false
    };
    this.sizesInput = '';
    this.colorsInput = '';
    this.imagesInput = '';
  }

  // Orders computed properties
  allOrders = computed(() => this.sampleOrders);
  
  pendingOrders = computed(() => this.sampleOrders.filter(order => order.status === 'pending'));
  
  pendingOrdersCount = computed(() => this.pendingOrders().length);
  
  processingOrdersCount = computed(() => this.sampleOrders.filter(order => order.status === 'processing').length);
  
  completedOrdersCount = computed(() => this.sampleOrders.filter(order => order.status === 'delivered').length);
  
  filteredOrders = computed(() => {
    let orders = this.sampleOrders;
    
    if (this.orderSearchTerm) {
      const search = this.orderSearchTerm.toLowerCase();
      orders = orders.filter(order => 
        order.id.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search)
      );
    }
    
    if (this.orderStatusFilter) {
      orders = orders.filter(order => order.status === this.orderStatusFilter);
    }
    
    return orders.sort((a, b) => b.date.getTime() - a.date.getTime());
  });
  
  // Analytics computed properties  
  totalRevenue = computed(() => this.sampleOrders.reduce((sum, order) => sum + order.total, 0));
  
  totalOrdersCount = computed(() => this.sampleOrders.length);
  
  newCustomersCount = computed(() => {
    const uniqueCustomers = new Set(this.sampleOrders.map(o => o.customerEmail));
    return uniqueCustomers.size;
  });
  
  conversionRate = computed(() => {
    // Mock conversion rate calculation
    return 3.4;
  });
  
  topProducts = computed(() => this.sampleTopProducts);
  
  recentActivity = computed(() => this.sampleRecentActivity.sort((a, b) => b.date.getTime() - a.date.getTime()));

  // Order management methods
  viewOrder(orderId: string) {
    console.log('Viewing order:', orderId);
    // Navigate to order details or show modal
  }
  
  updateOrderStatus(orderId: string) {
    console.log('Updating order status for:', orderId);
    // Show status update modal
  }
  
  confirmOrder(orderId: string) {
    console.log('Confirming order:', orderId);
    // Update order status to confirmed/processing
  }
  
  cancelOrder(orderId: string) {
    console.log('Cancelling order:', orderId);
    // Update order status to cancelled
  }

  goToHomepage() {
    this.router.navigate(['/']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
