import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ASSET_REPOSITORY } from '../../../../core/repositories/asset/asset.repository';
import { Asset } from '../../../../core/repositories/asset/models/asset.model';

@Component({
  selector: 'app-asset-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './asset-inventory.html',
})
export class AssetInventoryComponent implements OnInit {
  private readonly assetRepository = inject(ASSET_REPOSITORY);

  // State Signals
  readonly assets = signal<Asset[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly searchTerm = signal<string>('');
  readonly selectedType = signal<string>('ALL');
  readonly activeModal = signal<'SALE' | null>(null);

  // Pagination Signals
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);
  readonly pageSizeOptions: number[] = [5, 10, 20, 50];

  // Computed Filtered List
  readonly filteredAssets = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const type = this.selectedType();

    return this.assets().filter((item) => {
      const matchSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.assetType.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term));

      const matchType = type === 'ALL' || item.assetType.toLowerCase() === type.toLowerCase();

      return matchSearch && matchType;
    });
  });

  // Computed Pagination
  readonly totalPages = computed(() => {
    const total = this.filteredAssets().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  readonly paginatedAssets = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredAssets().slice(start, start + this.pageSize());
  });

  readonly startItemIndex = computed(() => {
    if (this.filteredAssets().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  readonly endItemIndex = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.filteredAssets().length);
  });

  readonly totalAssetsCount = computed(() => this.assets().length);

  readonly totalCapitalValue = computed(() =>
    this.assets().reduce((acc, curr) => acc + curr.acquisitionValue, 0)
  );

  readonly assetTypesList = computed(() => {
    const set = new Set(this.assets().map((a) => a.assetType));
    return Array.from(set).filter(Boolean);
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

  // Search & Filter handlers with page reset
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onTypeChange(type: string): void {
    this.selectedType.set(type);
    this.currentPage.set(1);
  }

  // Pagination Methods
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  firstPage(): void {
    this.currentPage.set(1);
  }

  lastPage(): void {
    this.currentPage.set(this.totalPages());
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = Number(target.value);
    this.pageSize.set(newSize);
    this.currentPage.set(1);
  }

  openSaleModal(): void {
    this.activeModal.set('SALE');
  }

  closeModal(): void {
    this.activeModal.set(null);
  }
}
