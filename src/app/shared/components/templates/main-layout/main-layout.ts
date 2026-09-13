import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../organisms/navbar/navbar';
import { SidebarComponent } from '../../organisms/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {
  readonly isSidebarOpen = signal<boolean>(true);

  toggleSidebar(): void {
    this.isSidebarOpen.update((open) => !open);
  }

  closeMobileSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.isSidebarOpen.set(false);
    }
  }
}
