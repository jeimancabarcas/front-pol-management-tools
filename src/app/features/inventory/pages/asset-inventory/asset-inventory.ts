import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ASSET_REPOSITORY } from '../../../../core/repositories/asset/asset.repository';
import { Asset, AssetStatus } from '../../../../core/repositories/asset/models/asset.model';

@Component({
  selector: 'app-asset-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asset-inventory.html',
})
export class AssetInventoryComponent implements OnInit {
  private readonly assetRepository = inject(ASSET_REPOSITORY);

  // State Signals
  readonly assets = signal<Asset[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly searchTerm = signal<string>('');
  readonly selectedCategory = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');
  readonly activeModal = signal<'REGISTER' | 'SALE' | null>(null);

  // Computed Values
  readonly filteredAssets = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.selectedCategory();
    const est = this.selectedStatus();

    return this.assets().filter((item) => {
      const matchSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.assetTag.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        (item.custodian && item.custodian.toLowerCase().includes(term));

      const matchCat = cat === 'ALL' || item.category === cat;
      const matchEst = est === 'ALL' || item.status === est;

      return matchSearch && matchCat && matchEst;
    });
  });

  readonly totalAssetsCount = computed(() => this.assets().length);

  readonly totalCapitalValue = computed(() =>
    this.assets().reduce((acc, curr) => acc + curr.acquisitionValue, 0)
  );

  readonly availableAssetsCount = computed(
    () => this.assets().filter((a) => a.status === 'Available').length
  );

  readonly assignedAssetsCount = computed(
    () => this.assets().filter((a) => a.status === 'Assigned').length
  );

  readonly categories = computed(() => {
    const set = new Set(this.assets().map((a) => a.category));
    return Array.from(set);
  });

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.isLoading.set(true);
    this.assetRepository.getAll().subscribe({
      next: (data) => {
        this.assets.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading asset inventory:', err);
        this.isLoading.set(false);
      },
    });
  }

  openRegisterModal(): void {
    this.activeModal.set('REGISTER');
  }

  openSaleModal(): void {
    this.activeModal.set('SALE');
  }

  closeModal(): void {
    this.activeModal.set(null);
  }
}
