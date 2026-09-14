import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ASSET_REPOSITORY } from '../../../../core/repositories/asset/asset.repository';
import { CreateAssetDto } from '../../../../core/repositories/asset/models/asset.model';

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
  readonly errorMessage = signal<string | null>(null);

  readonly registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    acquisitionValue: [null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.maxLength(300)]],
    assetType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
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
    this.errorMessage.set(null);

    const formValues = this.registerForm.value;

    const dto: CreateAssetDto = {
      name: formValues.name.trim(),
      type: formValues.assetType.trim(),
      acquisitionValue: Number(formValues.acquisitionValue),
      description: formValues.description ? formValues.description.trim() : undefined,
    };

    this.assetRepository.create(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSuccessNotification.set(true);

        setTimeout(() => {
          this.router.navigate(['/inventory']);
        }, 1200);
      },
      error: (err) => {
        console.error('Error registering asset in backend:', err);
        this.errorMessage.set(
          err?.error?.message || 'Error al registrar el bien. Verifique los datos e intente nuevamente.'
        );
        this.isSubmitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/inventory']);
  }
}
