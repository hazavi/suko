import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  searchResults: Product[] = [];
  isLoading = false;
  hasSearched = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Get search query from URL params
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchQuery = query;
        this.performSearch();
      }
    });
  }

  performSearch() {
    if (!this.searchQuery.trim()) return;
    
    this.isLoading = true;
    this.hasSearched = true;
    
    // Simulate search delay for better UX
    setTimeout(() => {
      this.searchResults = this.searchService.search(this.searchQuery);
      this.isLoading = false;
    }, 300);
  }

  onSearchKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }
}
