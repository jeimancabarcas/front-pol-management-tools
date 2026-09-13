import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ASSET_REPOSITORY } from '../../../../core/repositories/asset/asset.repository';
import { SALE_REPOSITORY } from '../../../../core/repositories/sale/sale.repository';
import { Asset } from '../../../../core/repositories/asset/models/asset.model';

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

  readonly assets = signal<Asset[]>([]);
  readonly isLoadingAssets = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly showSuccessNotification = signal<boolean>(false);

  readonly saleForm: FormGroup = this.fb.group({
    assetId: ['', [Validators.required]],
    salePrice: [null, [Validators.required, Validators.min(0.01)]],
    buyerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    buyerDocument: [''],
    saleDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    notes: ['', [Validators.maxLength(300)]],
  });

  readonly selectedAsset = computed(() => {
    const id = this.saleForm.get('assetId')?.value;
    if (!id) return null;
    return this.assets().find((a) => a.id === id) || null;
  });

  get assetIdControl() {
    return this.saleForm.get('assetId');
  }

  get salePriceControl() {
    return this.saleForm.get('salePrice');
  }

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
        this.assets.set(data);
        this.isLoadingAssets.set(false);
      },
      error: (err) => {
        console.error('Error cargando activos para venta:', err);
        this.isLoadingAssets.set(false);
      },
    });
  }

  onAssetSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const assetId = select.value;
    const asset = this.assets().find((a) => a.id === assetId);

    if (asset) {
      // Auto-suggest sale price as current acquisition value if empty
      if (!this.saleForm.get('salePrice')?.value) {
        this.saleForm.patchValue({
          salePrice: asset.acquisitionValue,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    const asset = this.selectedAsset();
    if (!asset) return;

    this.isSubmitting.set(true);
    const values = this.saleForm.value;

    // 1. Create sale record in SALE_REPOSITORY
    this.saleRepository
      .create({
        assetId: asset.id,
        assetName: asset.name,
        assetType: asset.assetType,
        originalValue: asset.acquisitionValue,
        salePrice: Number(values.salePrice),
        buyerName: values.buyerName.trim(),
        buyerDocument: values.buyerDocument ? values.buyerDocument.trim() : undefined,
        saleDate: values.saleDate,
        notes: values.notes ? values.notes.trim() : undefined,
      })
      .subscribe({
        next: () => {
          // 2. Remove asset from ASSET_REPOSITORY (Eliminar bien del inventario)
          this.assetRepository.delete(asset.id).subscribe({
            next: () => {
              this.isSubmitting.set(false);
              this.showSuccessNotification.set(true);

              setTimeout(() => {
                this.router.navigate(['/inventory']);
              }, 1200);
            },
            error: (err) => {
              console.error('Error eliminando bien del inventario:', err);
              this.isSubmitting.set(false);
            },
          });
        },
        error: (err) => {
          console.error('Error registrando venta:', err);
          this.isSubmitting.set(false);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/inventory']);
  }
}
