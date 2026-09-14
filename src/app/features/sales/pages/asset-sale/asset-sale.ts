import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ASSET_REPOSITORY } from '../../../../core/repositories/asset/asset.repository';
import { SALE_REPOSITORY } from '../../../../core/repositories/sale/sale.repository';
import { Asset } from '../../../../core/repositories/asset/models/asset.model';
import { CreateSaleDto, SaleItem } from '../../../../core/repositories/sale/models/sale.model';

@Component({
  selector: 'app-asset-sale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './asset-sale.html',
})
export class AssetSaleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assetRepository = inject(ASSET_REPOSITORY);
  private readonly saleRepository = inject(SALE_REPOSITORY);
  private readonly router = inject(Router);

  readonly availableAssets = signal<Asset[]>([]);
  readonly selectedItems = signal<SaleItem[]>([]);
  readonly selectedAssetIdToAdd = signal<string>('');

  readonly isLoadingAssets = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly showSuccessNotification = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly saleForm: FormGroup = this.fb.group({
    buyerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    buyerDocument: [''],
    saleDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    notes: ['', [Validators.maxLength(300)]],
  });

  // Assets available in dropdown (excluding those already added to current sale)
  readonly selectableAssets = computed(() => {
    const currentAddedIds = new Set(this.selectedItems().map((i) => i.assetId));
    return this.availableAssets().filter((a) => !currentAddedIds.has(a.id));
  });

  readonly totalOriginalValue = computed(() =>
    this.selectedItems().reduce((acc, item) => acc + (Number(item.originalValue) || 0), 0)
  );

  readonly totalSaleAmount = computed(() =>
    this.selectedItems().reduce((acc, item) => acc + (Number(item.salePrice) || 0), 0)
  );

  readonly totalItemsCount = computed(() => this.selectedItems().length);

  get buyerNameControl() {
    return this.saleForm.get('buyerName');
  }

  get saleDateControl() {
    return this.saleForm.get('saleDate');
  }

  ngOnInit(): void {
    this.loadAvailableAssets();
  }

  loadAvailableAssets(): void {
    this.isLoadingAssets.set(true);
    this.assetRepository.getAll().subscribe({
      next: (data) => {
        this.availableAssets.set(data);
        this.isLoadingAssets.set(false);
      },
      error: (err) => {
        console.error('Error cargando activos para venta:', err);
        this.isLoadingAssets.set(false);
      },
    });
  }

  onSelectAssetChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedAssetIdToAdd.set(select.value);
  }

  addAssetToSale(): void {
    const assetId = this.selectedAssetIdToAdd();
    if (!assetId) return;

    const asset = this.availableAssets().find((a) => a.id === assetId);
    if (!asset) return;

    const newItem: SaleItem = {
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type || asset.assetType || 'General',
      originalValue: Number(asset.acquisitionValue) || 0,
      salePrice: Number(asset.acquisitionValue) || 0,
    };

    this.selectedItems.update((items) => [...items, newItem]);
    this.selectedAssetIdToAdd.set('');
  }

  removeItem(assetId: string): void {
    this.selectedItems.update((items) => items.filter((i) => i.assetId !== assetId));
  }

  updateItemPrice(assetId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newPrice = Number(input.value) || 0;

    this.selectedItems.update((items) =>
      items.map((item) => (item.assetId === assetId ? { ...item, salePrice: newPrice } : item))
    );
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    if (this.selectedItems().length === 0) {
      this.errorMessage.set('Debe agregar al menos un bien a la lista de venta.');
      return;
    }

    // Verify all item prices are > 0
    const hasInvalidPrice = this.selectedItems().some((i) => i.salePrice <= 0);
    if (hasInvalidPrice) {
      this.errorMessage.set('Todos los bienes deben tener un precio de venta mayor a $ 0.00 USD.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const formValues = this.saleForm.value;

    const salePayload: CreateSaleDto = {
      buyerName: formValues.buyerName.trim(),
      buyerDocument: formValues.buyerDocument ? formValues.buyerDocument.trim() : undefined,
      saleDate: formValues.saleDate,
      notes: formValues.notes ? formValues.notes.trim() : undefined,
      totalAmount: this.totalSaleAmount(),
      items: this.selectedItems(),
    };

    // 1. Send single request to create sale with all items
    this.saleRepository.create(salePayload).subscribe({
      next: () => {
        // 2. Delete all sold assets from the inventory in parallel
        const deleteObservables = this.selectedItems().map((item) =>
          this.assetRepository.delete(item.assetId).pipe(
            catchError((err) => {
              console.warn(`Error al eliminar bien ${item.assetId}:`, err);
              return of(null);
            })
          )
        );

        forkJoin(deleteObservables).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.showSuccessNotification.set(true);

            setTimeout(() => {
              this.router.navigate(['/inventory']);
            }, 1200);
          },
          error: () => {
            this.isSubmitting.set(false);
            this.showSuccessNotification.set(true);
            setTimeout(() => {
              this.router.navigate(['/inventory']);
            }, 1200);
          },
        });
      },
      error: (err) => {
        console.warn('Fallback al registrar venta múltiple:', err);
        // Fallback: delete assets directly if /sales is pending backend endpoint
        const deleteObservables = this.selectedItems().map((item) =>
          this.assetRepository.delete(item.assetId).pipe(
            catchError((delErr) => {
              console.warn(`Error al dar de baja bien ${item.assetId}:`, delErr);
              return of(null);
            })
          )
        );

        forkJoin(deleteObservables).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.showSuccessNotification.set(true);
            setTimeout(() => {
              this.router.navigate(['/inventory']);
            }, 1200);
          },
          error: () => {
            this.errorMessage.set('Error al procesar la desincorporación de los bienes.');
            this.isSubmitting.set(false);
          },
        });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/inventory']);
  }
}
