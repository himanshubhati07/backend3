import { Component, ViewEncapsulation, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      @for (t of toast.toasts(); track t.id) {
        <div
          role="alert"
          class="flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-sm text-white min-w-[260px] max-w-sm"
          [class.bg-danger]="t.kind === 'error'"
          [class.bg-success]="t.kind === 'success'"
          [class.bg-blue-700]="t.kind === 'info'"
        >
          <span class="flex-1">{{ t.message }}</span>
          <button
            type="button"
            class="opacity-70 hover:opacity-100"
            (click)="toast.dismiss(t.id)"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toast = inject(ToastService);
}
