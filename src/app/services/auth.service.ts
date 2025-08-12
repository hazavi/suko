import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Mock admin credentials for development
  private readonly ADMIN_EMAIL = 'admin@suko.com';
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor() {
    // Check if user is already logged in (localStorage simulation)
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  async login(email: string, password: string): Promise<void> {
    // Mock authentication for development
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      const user: AdminUser = {
        uid: 'mock-admin-uid',
        email: email,
        displayName: 'Admin'
      };
      
      localStorage.setItem('adminUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('adminUser');
    this.currentUserSubject.next(null);
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }
}
