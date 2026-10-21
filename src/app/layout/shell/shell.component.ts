import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopBarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterModule, SidebarComponent, TopBarComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-topbar />
        <main class="flex-1 overflow-auto bg-background-secondary p-lg">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {}
