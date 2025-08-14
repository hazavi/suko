import { Component, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showShopDropdown = signal(false);
  showSupportDropdown = signal(false);
  showCurrencyDropdown = signal(false);
  showSearch = signal(false);
  showMobileMenu = signal(false);
  showSidebar = signal(false);
  expandedSection = signal<string | null>(null);
  selectedCurrency = signal('NL / €');
  bagCount = signal(0);
  searchQuery = '';

  constructor(
    private cartService: CartService, 
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Update bag count when cart changes
    this.updateBagCount();
  }

  private updateBagCount() {
    this.bagCount.set(this.cartService.getTotalItems());
  }

  toggleSearch() {
    this.router.navigate(['/search']);
  }

  closeSearch() {
    // No longer needed since we removed the overlay
  }

  performSearch() {
    if (this.searchQuery.trim()) {
      this.searchService.navigateToSearch(this.searchQuery);
    }
  }

  setCurrency(currency: string) {
    this.selectedCurrency.set(currency);
    this.showCurrencyDropdown.set(false);
  }

  openBag() {
    this.router.navigate(['/bag']);
  }

  toggleMobileMenu() {
    this.showMobileMenu.set(!this.showMobileMenu());
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  toggleSidebar() {
    this.showSidebar.set(!this.showSidebar());
    // Don't auto-expand any section by default
    if (!this.showSidebar()) {
      this.expandedSection.set(null);
    }
  }

  closeSidebar() {
    this.showSidebar.set(false);
    this.expandedSection.set(null);
  }

  toggleSidebarSection(section: string) {
    if (this.expandedSection() === section) {
      this.expandedSection.set(null);
    } else {
      this.expandedSection.set(section);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.showSearch.set(false);
    this.showMobileMenu.set(false);
    this.showSidebar.set(false);
    this.expandedSection.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.search-overlay')) {
      this.showShopDropdown.set(false);
      this.showSupportDropdown.set(false);
      this.showCurrencyDropdown.set(false);
    }
    
    // Close sidebar if clicking outside
    if (!target.closest('.sidebar') && !target.closest('.sidebar-toggle')) {
      if (this.showSidebar()) {
        this.closeSidebar();
      }
    }
  }
}
