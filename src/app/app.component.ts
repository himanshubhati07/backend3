import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <router-outlet />
    <app-toast-container />
  `,
})
export class AppComponent {
  title = 'Node.js API Portal';
}
