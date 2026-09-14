import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ASSET_REPOSITORY } from '../../../../core/repositories/asset/asset.repository';
import { SALE_REPOSITORY } from '../../../../core/repositories/sale/sale.repository';
import { Asset } from '../../../../core/repositories/asset/models/asset.model';
import { Sale } from '../../../../core/repositories/sale/models/sale.model';

@Component({
  selector: 'app-asset-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './asset-inventory.html',
})
export class AssetInventoryComponent implements OnInit {
  private readonly assetRepository = inject(ASSET_REPOSITORY);
  private readonly saleRepository = inject(SALE_REPOSITORY);

  // Active Tab: 'INVENTORY' | 'SALES' or showing both sections
  readonly activeTab = signal<'INVENTORY' | 'SALES'>('INVENTORY');

  // Asset Inventory State
  readonly assets = signal<Asset[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly searchTerm = signal<string>('');
  readonly selectedType = signal<string>('ALL');

  // Asset Pagination Signals
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);
  readonly pageSizeOptions: number[] = [5, 10, 20, 50];

  // Sales History State
  readonly sales = signal<Sale[]>([]);
  readonly isLoadingSales = signal<boolean>(true);
  readonly salesSearchTerm = signal<string>('');

  // Sales Pagination Signals
  readonly salesCurrentPage = signal<number>(1);
  readonly salesPageSize = signal<number>(5);

  // Computed Filtered Assets
  readonly filteredAssets = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const type = this.selectedType();

    return this.assets().filter((item) => {
      const assetType = (item.type || item.assetType || '').toLowerCase();
      const matchSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        assetType.includes(term) ||
        (item.description && item.description.toLowerCase().includes(term));

      const matchType = type === 'ALL' || assetType === type.toLowerCase();

      return matchSearch && matchType;
    });
  });

  // Computed Asset Pagination
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
    this.assets().reduce((acc, curr) => acc + (Number(curr.acquisitionValue) || 0), 0)
  );

  readonly assetTypesList = computed(() => {
    const set = new Set(this.assets().map((a) => a.type || a.assetType || ''));
    return Array.from(set).filter(Boolean);
  });

  // Computed Filtered Sales
  readonly filteredSales = computed(() => {
    const term = this.salesSearchTerm().toLowerCase().trim();

    return this.sales().filter((sale) => {
      return (
        !term ||
        sale.assetName.toLowerCase().includes(term) ||
        sale.assetType.toLowerCase().includes(term) ||
        sale.buyerName.toLowerCase().includes(term) ||
        (sale.buyerDocument && sale.buyerDocument.toLowerCase().includes(term)) ||
        (sale.notes && sale.notes.toLowerCase().includes(term))
      );
    });
  });

  readonly totalSalesCount = computed(() => this.sales().length);

  readonly totalSalesRevenue = computed(() =>
    this.sales().reduce((acc, curr) => acc + curr.salePrice, 0)
  );

  readonly totalSalesPages = computed(() => {
    const total = this.filteredSales().length;
    return Math.max(1, Math.ceil(total / this.salesPageSize()));
  });

  readonly paginatedSales = computed(() => {
    const start = (this.salesCurrentPage() - 1) * this.salesPageSize();
    return this.filteredSales().slice(start, start + this.salesPageSize());
  });

  readonly salesStartItemIndex = computed(() => {
    if (this.filteredSales().length === 0) return 0;
    return (this.salesCurrentPage() - 1) * this.salesPageSize() + 1;
  });

  readonly salesEndItemIndex = computed(() => {
    return Math.min(this.salesCurrentPage() * this.salesPageSize(), this.filteredSales().length);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadAssets();
    this.loadSales();
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

  loadSales(): void {
    this.isLoadingSales.set(true);
    this.saleRepository.getAll().subscribe({
      next: (data) => {
        this.sales.set(data);
        this.isLoadingSales.set(false);
      },
      error: (err) => {
        console.error('Error loading sales history:', err);
        this.isLoadingSales.set(false);
      },
    });
  }

  // Asset Filter handlers
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onTypeChange(type: string): void {
    this.selectedType.set(type);
    this.currentPage.set(1);
  }

  // Asset Pagination
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
    this.pageSize.set(Number(target.value));
    this.currentPage.set(1);
  }

  // Sales Filter & Pagination
  onSalesSearchChange(term: string): void {
    this.salesSearchTerm.set(term);
    this.salesCurrentPage.set(1);
  }

  nextSalesPage(): void {
    if (this.salesCurrentPage() < this.totalSalesPages()) {
      this.salesCurrentPage.update((p) => p + 1);
    }
  }

  previousSalesPage(): void {
    if (this.salesCurrentPage() > 1) {
      this.salesCurrentPage.update((p) => p - 1);
    }
  }

  firstSalesPage(): void {
    this.salesCurrentPage.set(1);
  }

  lastSalesPage(): void {
    this.salesCurrentPage.set(this.totalSalesPages());
  }

  onSalesPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.salesPageSize.set(Number(target.value));
    this.salesCurrentPage.set(1);
  }

  setActiveTab(tab: 'INVENTORY' | 'SALES'): void {
    this.activeTab.set(tab);
  }
}
