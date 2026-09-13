import { Component } from '@angular/core';
import { MainLayoutComponent } from './shared/components/templates/main-layout/main-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
