import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService, SnackbarMessage } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container">
      <div 
        *ngFor="let message of snackbarService.messages$()" 
        class="snackbar"
        [class.snackbar-success]="message.type === 'success'"
        [class.snackbar-error]="message.type === 'error'"
        [class.snackbar-warning]="message.type === 'warning'"
        [class.snackbar-info]="message.type === 'info'"
      >
        <div class="snackbar-content">
          <div class="snackbar-icon">
            <svg *ngIf="message.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg *ngIf="message.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg *ngIf="message.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg *ngIf="message.type === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8h.01" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="snackbar-message">{{ message.message }}</span>
        </div>
        <button 
          class="snackbar-close"
          (click)="snackbarService.remove(message.id)"
          type="button"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./snackbar.component.scss'],
  animations: []
})
export class SnackbarComponent {
  snackbarService = inject(SnackbarService);
}
