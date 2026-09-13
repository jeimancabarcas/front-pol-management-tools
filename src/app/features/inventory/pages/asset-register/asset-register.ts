import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ASSET_REPOSITORY } from '../../../../core/repositories/asset/asset.repository';
import { Asset } from '../../../../core/repositories/asset/models/asset.model';

@Component({
  selector: 'app-asset-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './asset-register.html',
})
export class AssetRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetRepository = inject(ASSET_REPOSITORY);
  private readonly router = inject(Router);

  readonly isSubmitting = signal<boolean>(false);
  readonly showSuccessNotification = signal<boolean>(false);

  readonly registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    acquisitionValue: [null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.maxLength(300)]],
    assetType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    location: ['Edificio Central - Sede Principal'],
  });

  get nameControl() {
    return this.registerForm.get('name');
  }

  get valueControl() {
    return this.registerForm.get('acquisitionValue');
  }

  get descriptionControl() {
    return this.registerForm.get('description');
  }

  get assetTypeControl() {
    return this.registerForm.get('assetType');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValues = this.registerForm.value;
    const randomTag = `ACT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newAsset: Omit<Asset, 'id'> = {
      name: formValues.name.trim(),
      acquisitionValue: Number(formValues.acquisitionValue),
      description: formValues.description ? formValues.description.trim() : '',
      assetType: formValues.assetType.trim(),
      category: formValues.assetType.trim(),
      location: formValues.location || 'Edificio Central - Sede Principal',
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      assetTag: randomTag,
      registrationDate: new Date().toISOString().split('T')[0],
      batchCode: `ACT-${new Date().getFullYear()}-Q1`,
    };

    this.assetRepository.create(newAsset).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSuccessNotification.set(true);

        setTimeout(() => {
          this.router.navigate(['/inventory']);
        }, 1200);
      },
      error: (err) => {
        console.error('Error registering asset:', err);
        this.isSubmitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/inventory']);
  }
}
