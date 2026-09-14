import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  readonly toggleSidebar = output<void>();

  readonly currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
