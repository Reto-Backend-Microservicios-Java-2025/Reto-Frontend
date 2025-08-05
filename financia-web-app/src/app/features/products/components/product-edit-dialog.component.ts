import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../services/product.service';
import { ClientService } from '../../clients/services/client.service';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../../shared/models/product.model';
import { ClientForProductSelection } from '../../../shared/models/client.model';

export interface ProductDialogData {
  product: Product | null;
  isEdit: boolean;
}

@Component({
  selector: 'app-product-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './product-edit-dialog.component.html',
  styles: [`
    .dialog-container {
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(0, 255, 136, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .dialog-header {
      background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #00ff88;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .title-icon {
      color: #00ff88;
      font-size: 1.4rem;
      width: 1.4rem;
      height: 1.4rem;
    }

    .close-button {
      color: #00ff88;
      transition: all 0.3s ease;
    }

    .close-button:hover {
      background: rgba(0, 255, 136, 0.1);
      transform: scale(1.1);
    }

    .dialog-content {
      padding: 24px;
      background: rgba(26, 26, 26, 0.8);
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: calc(50% - 8px);
    }

    .form-input, .form-select {
      color: #ffffff;
    }

    .field-icon {
      color: #00ff88;
    }

    .error-text {
      color: #ff4757;
      font-size: 0.85rem;
    }

    .client-option {
      color: #e0e0e0;
      padding: 8px 16px;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      gap: 16px;
    }

    .cancel-button {
      color: #b0b0b0;
      border: 1px solid #666;
      padding: 12px 24px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .cancel-button:hover {
      color: #e0e0e0;
      border-color: #00ff88;
      background: rgba(0, 255, 136, 0.05);
    }

    .submit-button {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 255, 136, 0.3);
      transition: all 0.3s ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 255, 136, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .button-icon {
      margin-right: 8px;
    }

    .button-text {
      font-weight: 600;
    }

    /* Material Form Field Customization */
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: rgba(0, 255, 136, 0.3);
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field-label {
      color: #b0b0b0;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #00ff88;
    }

    ::ng-deep .mat-select-value {
      color: #ffffff;
    }

    ::ng-deep .mat-select-arrow {
      color: #00ff88;
    }

    ::ng-deep .mat-option {
      color: #ffffff;
    }

    ::ng-deep .mat-option:hover {
      background: rgba(0, 255, 136, 0.1);
      color: #00ff88;
    }

    ::ng-deep .mat-option.mat-selected {
      background: rgba(0, 255, 136, 0.2);
      color: #00ff88;
    }

    @media (max-width: 600px) {
      .dialog-header {
        padding: 16px 20px;
      }

      .dialog-title {
        font-size: 1.2rem;
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }

      .dialog-content {
        padding: 20px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .half-width {
        width: 100%;
      }

      .form-actions {
        flex-direction: column;
        gap: 16px;
      }
    }
  `]
})
export class ProductEditDialogComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  clients: ClientForProductSelection[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      productType: ['', [Validators.required]],
      balance: [0, [Validators.required, Validators.min(0)]],
      clientId: ['', this.data.isEdit ? [] : [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (!this.data.isEdit) {
      this.loadClients();
    }

    if (this.data.isEdit && this.data.product) {
      this.productForm.patchValue({
        name: this.data.product.name,
        productType: this.data.product.productType,
        balance: this.data.product.balance
      });
    }
  }

  loadClients(): void {
    this.clientService.getAllClientsWithIds().subscribe({
      next: (clients) => {
        this.clients = clients;
        console.log('Loaded clients for product creation:', clients);
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.snackBar.open('Error al cargar los clientes', 'Cerrar', { duration: 5000 });
      }
    });
  }

  async onSave(): Promise<void> {
    if (this.productForm.valid) {
      this.isLoading = true;

      if (this.data.isEdit && this.data.product) {
        // Update existing product
        const updateRequest: UpdateProductRequest = {
          name: this.productForm.value.name,
          productType: this.productForm.value.productType,
          balance: this.productForm.value.balance
        };

        console.log('Update request:', updateRequest);
        this.productService.updateProduct(this.data.product.id, updateRequest).subscribe({
          next: (product) => {
            this.isLoading = false;
            this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error updating product:', error);
            this.snackBar.open('Error al actualizar el producto', 'Cerrar', { duration: 5000 });
          }
        });
      } else {
        // Create new product
        const formValue = this.productForm.value;
        console.log('Form value clientId:', formValue.clientId);
        console.log('Type of formValue.clientId:', typeof formValue.clientId);
        console.log('Available clients:', this.clients);

        let selectedClient = this.clients.find(c => {
          console.log(`Comparing client ${c.id} (${typeof c.id}) with formValue.clientId ${formValue.clientId} (${typeof formValue.clientId})`);
          return c.id === formValue.clientId || String(c.id) === String(formValue.clientId);
        });

        if (!selectedClient) {
          console.error('Client not found. Available clients:', this.clients);
          console.error('Looking for clientId:', formValue.clientId);
          this.isLoading = false;
          this.snackBar.open('Cliente no encontrado', 'Cerrar', { duration: 5000 });
          return;
        }

        console.log('Selected client:', selectedClient);
        console.log('Client ID:', selectedClient.id);

        if (!selectedClient.id || selectedClient.id <= 0) {
          console.error('Invalid client ID:', selectedClient.id);
          this.isLoading = false;
          this.snackBar.open('ID de cliente inválido. Intente recargar la lista de clientes.', 'Cerrar', { duration: 5000 });
          return;
        }

        const createRequest: CreateProductRequest = {
          clientId: selectedClient.id,
          productType: formValue.productType,
          name: formValue.name,
          balance: Number(formValue.balance)
        };

        console.log('Create request:', createRequest);
        if (!createRequest.productType) {
          console.error('Invalid productType:', createRequest.productType);
          this.isLoading = false;
          this.snackBar.open('Error: Tipo de producto requerido', 'Cerrar', { duration: 5000 });
          return;
        }

        this.productService.createProduct(createRequest).subscribe({
          next: (product) => {
            this.isLoading = false;
            this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error creating product:', error);
            this.snackBar.open('Error al crear el producto. Verifique los datos.', 'Cerrar', { duration: 5000 });
          }
        });
      }
    } else {
      console.log('Form is invalid:', this.productForm.errors);
      console.log('Form controls:', Object.keys(this.productForm.controls).map(key => ({
        key,
        value: this.productForm.get(key)?.value,
        errors: this.productForm.get(key)?.errors
      })));
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
