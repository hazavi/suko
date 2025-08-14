import { Injectable, signal } from '@angular/core';

export interface SnackbarMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private messages = signal<SnackbarMessage[]>([]);
  public messages$ = this.messages.asReadonly();

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4000) {
    const id = this.generateId();
    const snackbarMessage: SnackbarMessage = {
      id,
      message,
      type,
      duration
    };

    // Add message to the list
    this.messages.update(messages => [...messages, snackbarMessage]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  remove(id: string) {
    this.messages.update(messages => messages.filter(msg => msg.id !== id));
  }

  clear() {
    this.messages.set([]);
  }

  // Convenience methods
  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
