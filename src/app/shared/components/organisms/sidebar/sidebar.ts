import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon: 'inventory';
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  readonly isOpen = input<boolean>(true);
  readonly closeMobile = output<void>();

  readonly navItems: NavigationItem[] = [
    {
      id: 'asset-inventory',
      label: 'Inventario de Bienes',
      route: '/inventory',
      icon: 'inventory',
    },
  ];
}
