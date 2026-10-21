import { Injectable, signal } from '@angular/core';
import { Toast } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  private push(kind: 'success' | 'error' | 'info', message: string, ms = 4000) {
    const id = ++this.nextId;
    this.toasts.update(list => [...list, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), ms);
  }

  success(message: string) {
    this.push('success', message);
  }

  error(message: string) {
    this.push('error', message, 6000);
  }

  info(message: string) {
    this.push('info', message);
  }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
