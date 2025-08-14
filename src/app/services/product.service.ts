import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Database, ref, push, set, remove, onValue, update } from '@angular/fire/database';

export interface Product {
  id?: string;
  name: string;
  description?: string;  // Made optional
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private database: Database) {
    this.loadProductsFromFirebase();
  }

  private loadProductsFromFirebase() {
    console.log('Attempting to load products from Firebase...');
    const productsRef = ref(this.database, 'products');
    
    onValue(productsRef, (snapshot) => {
      console.log('Firebase snapshot received:', snapshot.exists());
      const data = snapshot.val();
      console.log('Firebase data:', data);
      
      if (data) {
        const products: Product[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        console.log('Processed products:', products);
        this.productsSubject.next(products);
      } else {
        console.log('No products found in Firebase, loading mock data...');
        // Load initial mock data if no products exist
        this.loadInitialMockData();
      }
    }, (error) => {
      console.error('Firebase error:', error);
      console.log('Loading mock data due to Firebase error...');
      this.loadInitialMockData();
    });
  }

  private async loadInitialMockData() {
    // Mock data for initial setup
    const mockProducts: Product[] = [
      {
        name: 'SUKO GROWN TEE PIGMENT DYED',
        description: 'Premium cotton tee with pigment dyed finish',
        price: 48,
        images: ['/assets/products/tee1.svg'],
        category: 'tees',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Gray'],
        inStock: false,
        featured: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        name: 'SUKO GROWN TEE PIGMENT DYED',
        description: 'Comfortable streetwear essential',
        price: 48,
        images: ['/assets/products/tee2.svg'],
        category: 'tees',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue'],
        inStock: true,
        featured: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        name: 'SUKO GROWN TEE PIGMENT DYED',
        description: 'Limited edition design',
        price: 48,
        images: ['/assets/products/tee3.svg'],
        category: 'tees',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Green'],
        inStock: true,
        featured: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        name: 'SUKO GROWN TEE PIGMENT DYED',
        price: 48,
        images: ['/assets/products/tee4.svg'],
        category: 'tees',
        sizes: ['S', 'M', 'L'],
        colors: ['Red'],
        inStock: true,
        featured: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    // Add each mock product to Firebase
    for (const product of mockProducts) {
      await this.addProduct(product);
    }
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<void> {
    const productsRef = ref(this.database, 'products');
    const newProductRef = push(productsRef);
    
    const productData = {
      ...product,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(newProductRef, productData);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productRef = ref(this.database, `products/${id}`);
    const updateData = {
      ...product,
      updatedAt: Date.now()
    };
    
    await update(productRef, updateData);
  }

  async deleteProduct(id: string): Promise<void> {
    const productRef = ref(this.database, `products/${id}`);
    await remove(productRef);
  }

  getProduct(id: string): Observable<Product | null> {
    return new Observable(observer => {
      const products = this.productsSubject.value;
      const product = products.find(p => p.id === id);
      observer.next(product || null);
    });
  }

  getFeaturedProducts(): Product[] {
    return this.productsSubject.value.filter(product => product.featured);
  }

  getProductsByCategory(category: string): Product[] {
    return this.productsSubject.value.filter(product => product.category === category);
  }
}
