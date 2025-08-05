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
import { Client } from '../../../shared/models/client.model';

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
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ data.isEdit ? 'edit' : 'add' }}</mat-icon>
      {{ data.isEdit ? 'Editar Producto' : 'Crear Producto' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="productForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre del Producto</mat-label>
          <input matInput formControlName="name" required>
          <mat-icon matSuffix>inventory</mat-icon>
          <mat-error *ngIf="productForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
          <mat-error *ngIf="productForm.get('name')?.hasError('minlength')">
            El nombre debe tener al menos 3 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Producto</mat-label>
          <mat-select formControlName="productType" required>
            <mat-option value="SAVINGS_ACCOUNT">Cuenta de Ahorros</mat-option>
            <mat-option value="CHECKING_ACCOUNT">Cuenta Corriente</mat-option>
            <mat-option value="CREDIT_CARD">Tarjeta de Crédito</mat-option>
            <mat-option value="LOAN">Préstamo</mat-option>
            <mat-option value="INVESTMENT">Inversión</mat-option>
          </mat-select>
          <mat-error *ngIf="productForm.get('productType')?.hasError('required')">
            Seleccione un tipo de producto
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Saldo</mat-label>
          <input matInput type="number" formControlName="balance" step="0.01" min="0" required>
          <span matTextPrefix>$&nbsp;</span>
          <mat-error *ngIf="productForm.get('balance')?.hasError('required')">
            El saldo es requerido
          </mat-error>
          <mat-error *ngIf="productForm.get('balance')?.hasError('min')">
            El saldo debe ser mayor o igual a 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="!data.isEdit">
          <mat-label>Cliente</mat-label>
          <mat-select formControlName="clientId" required>
            <mat-option *ngFor="let client of clients" [value]="client.uniqueCode">
              {{ client.full_name }} {{ client.full_last_name }} ({{ client.number_document }}) - Código: {{ client.uniqueCode }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="productForm.get('clientId')?.hasError('required')">
            Seleccione un cliente
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="productForm.invalid || isLoading"
              (click)="onSave()">
        <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
        <span *ngIf="!isLoading">{{ data.isEdit ? 'Actualizar' : 'Crear' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-dialog-content {
      min-width: 500px;
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      padding: 16px 0;
    }

    @media (max-width: 768px) {
      mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class ProductEditDialogComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  clients: Client[] = [];

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
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los clientes', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onSave(): void {
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
        
        // Convert clientId to number - uniqueCode from client selection
        const clientId = typeof formValue.clientId === 'string' ? 
          parseInt(formValue.clientId, 10) : Number(formValue.clientId);
        
        const createRequest: CreateProductRequest = {
          clientId: clientId,
          productType: formValue.productType,
          name: formValue.name,
          balance: Number(formValue.balance)
        };

        // Validate the request before sending
        if (!createRequest.clientId || createRequest.clientId <= 0) {
          console.error('Invalid clientId:', createRequest.clientId);
          this.isLoading = false;
          this.snackBar.open('Error: ID de cliente inválido', 'Cerrar', { duration: 5000 });
          return;
        }

        if (!createRequest.productType) {
          console.error('Invalid productType:', createRequest.productType);
          this.isLoading = false;
          this.snackBar.open('Error: Tipo de producto requerido', 'Cerrar', { duration: 5000 });
          return;
        }

        console.log('Create request:', createRequest);
        console.log('Form value:', formValue);

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