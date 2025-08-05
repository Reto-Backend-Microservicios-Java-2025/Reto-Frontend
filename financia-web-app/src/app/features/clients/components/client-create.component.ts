import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ClientService } from '../services/client.service';
import { AuthService } from '../../auth/services/auth.service';
import { CreateClientRequest } from '../../../shared/models/client.model';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport mode="over">
        <mat-toolbar class="sidenav-toolbar">
          <mat-icon class="menu-icon">menu</mat-icon>
          <span>Menú</span>
        </mat-toolbar>
        <mat-nav-list class="nav-list">
          <a mat-list-item (click)="navigateTo('/dashboard')" [class.active]="isActiveRoute('/dashboard')" class="nav-item">
            <mat-icon matListItemIcon class="nav-icon">dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item (click)="navigateTo('/clients')" [class.active]="isActiveRoute('/clients')" class="nav-item">
            <mat-icon matListItemIcon class="nav-icon">people</mat-icon>
            <span matListItemTitle>Clientes</span>
          </a>
          <a mat-list-item (click)="navigateTo('/products')" [class.active]="isActiveRoute('/products')" class="nav-item">
            <mat-icon matListItemIcon class="nav-icon">inventory</mat-icon>
            <span matListItemTitle>Productos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="main-toolbar">
          <button type="button" aria-label="Toggle sidenav" mat-icon-button (click)="drawer.toggle()" class="menu-button">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span class="toolbar-title">Financia App - Nuevo Cliente</span>
          <span class="spacer"></span>
          <span *ngIf="currentUser" class="user-info">Hola, {{ currentUser.email }}</span>
          <button mat-icon-button [matMenuTriggerFor]="menu" class="user-menu-button">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu" class="user-menu">
            <button mat-menu-item (click)="logout()" class="menu-item">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="content">
          <div class="header-section">
            <h1 class="page-title">
              <mat-icon class="title-icon">person_add</mat-icon>
              Crear Nuevo Cliente
            </h1>
            <p class="page-subtitle">Complete la información del cliente</p>
          </div>

          <div class="form-container">
            <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="client-form">
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nombre</mat-label>
                  <input matInput formControlName="full_name" required class="form-input">
                  <mat-icon matSuffix class="field-icon">person</mat-icon>
                  <mat-error *ngIf="clientForm.get('full_name')?.hasError('required')" class="error-text">
                    El nombre es requerido
                  </mat-error>
                  <mat-error *ngIf="clientForm.get('full_name')?.hasError('minlength')" class="error-text">
                    El nombre debe tener al menos 2 caracteres
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Apellido</mat-label>
                  <input matInput formControlName="full_last_name" required class="form-input">
                  <mat-icon matSuffix class="field-icon">person</mat-icon>
                  <mat-error *ngIf="clientForm.get('full_last_name')?.hasError('required')" class="error-text">
                    El apellido es requerido
                  </mat-error>
                  <mat-error *ngIf="clientForm.get('full_last_name')?.hasError('minlength')" class="error-text">
                    El apellido debe tener al menos 2 caracteres
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Tipo de Documento</mat-label>
                  <mat-select formControlName="type_document" required class="form-select">
                    <mat-option value="DNI">DNI</mat-option>
                    <mat-option value="RUC">RUC</mat-option>
                    <mat-option value="CE">CE</mat-option>
                    <mat-option value="PASSPORT">PASSPORT</mat-option>
                  </mat-select>
                  <mat-icon matSuffix class="field-icon">description</mat-icon>
                  <mat-error *ngIf="clientForm.get('type_document')?.hasError('required')" class="error-text">
                    El tipo de documento es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Número de Documento</mat-label>
                  <input matInput formControlName="number_document" required class="form-input">
                  <mat-icon matSuffix class="field-icon">numbers</mat-icon>
                  <mat-error *ngIf="clientForm.get('number_document')?.hasError('required')" class="error-text">
                    El número de documento es requerido
                  </mat-error>
                  <mat-error *ngIf="clientForm.get('number_document')?.hasError('pattern')" class="error-text">
                    Solo se permiten números y letras
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Código Único (16 dígitos)</mat-label>
                  <input matInput formControlName="uniqueCode" required class="form-input" maxlength="16">
                  <mat-icon matSuffix class="field-icon">vpn_key</mat-icon>
                  <mat-hint>Debe tener exactamente 16 dígitos numéricos</mat-hint>
                  <mat-error *ngIf="clientForm.get('uniqueCode')?.hasError('required')" class="error-text">
                    El código único es requerido
                  </mat-error>
                  <mat-error *ngIf="clientForm.get('uniqueCode')?.hasError('pattern')" class="error-text">
                    El código único debe tener exactamente 16 dígitos numéricos
                  </mat-error>
                  <mat-error *ngIf="clientForm.get('uniqueCode')?.hasError('minlength') || clientForm.get('uniqueCode')?.hasError('maxlength')" class="error-text">
                    El código único debe tener exactamente 16 dígitos
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-button type="button" (click)="goBack()" class="cancel-button">
                  <mat-icon>arrow_back</mat-icon>
                  Cancelar
                </button>
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="clientForm.invalid || isLoading" class="submit-button">
                  <mat-spinner diameter="20" *ngIf="isLoading" class="button-spinner"></mat-spinner>
                  <mat-icon *ngIf="!isLoading" class="button-icon">save</mat-icon>
                  <span *ngIf="!isLoading" class="button-text">Crear Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
    }
    
    .sidenav {
      width: 280px;
      background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
      border-right: 1px solid #00ff88;
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
    }
    
    .sidenav-toolbar {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }
    
    .menu-icon {
      color: #000;
    }
    
    .nav-list {
      padding: 16px 0;
    }
    
    .nav-item {
      margin: 4px 16px;
      border-radius: 12px;
      transition: all 0.3s ease;
      color: #e0e0e0;
    }
    
    .nav-item:hover {
      background: linear-gradient(90deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%);
      color: #00ff88;
      transform: translateX(8px);
    }
    
    .nav-item.active {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
    }
    
    .nav-icon {
      margin-right: 12px;
    }
    
    .main-toolbar {
      background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%);
      color: #00ff88;
      border-bottom: 2px solid #00ff88;
      box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1);
    }
    
    .menu-button {
      color: #00ff88;
      margin-right: 16px;
    }
    
    .toolbar-title {
      font-size: 1.4rem;
      font-weight: 600;
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-info {
      color: #e0e0e0;
      margin-right: 16px;
      font-size: 0.9rem;
    }
    
    .user-menu-button {
      color: #00ff88;
    }
    
    .user-menu {
      background: #2a2a2a;
      border: 1px solid #00ff88;
    }
    
    .menu-item {
      color: #e0e0e0;
    }
    
    .menu-item:hover {
      background: rgba(0, 255, 136, 0.1);
      color: #00ff88;
    }
    
    .content {
      padding: 32px 24px;
      min-height: calc(100vh - 64px);
      background: transparent;
    }
    
    .header-section {
      text-align: center;
      margin-bottom: 40px;
      animation: fadeInUp 0.8s ease;
    }
    
    .page-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 16px 0;
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 50%, #00ff88 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .title-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #00ff88;
    }
    
    .page-subtitle {
      font-size: 1.1rem;
      color: #b0b0b0;
      margin: 0;
      font-weight: 300;
    }
    
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      animation: fadeInUp 0.8s ease 0.2s both;
    }
    
    .client-form {
      background: rgba(26, 26, 26, 0.8);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 255, 136, 0.1);
    }
    
    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .half-width {
      width: calc(50% - 8px);
    }
    
    .form-input, .form-select {
      color: #e0e0e0;
    }
    
    .field-icon {
      color: #00ff88;
    }
    
    .error-text {
      color: #ff4757;
      font-size: 0.85rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
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
      color: #e0e0e0;
    }
    
    ::ng-deep .mat-select-arrow {
      color: #00ff88;
    }
    
    @media (max-width: 900px) {
      .content {
        padding: 24px 16px;
      }
      .page-title {
        font-size: 2rem;
      }
      .client-form {
        padding: 24px;
      }
    }
    
    @media (max-width: 600px) {
      .content {
        padding: 16px 8px;
      }
      .page-title {
        font-size: 1.8rem;
        flex-direction: column;
        gap: 8px;
      }
      .client-form {
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
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ClientCreateComponent implements OnInit {
  clientForm: FormGroup;
  isLoading = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      full_last_name: ['', [Validators.required, Validators.minLength(2)]],
      type_document: ['', [Validators.required]],
      number_document: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z]+$/)]],
      uniqueCode: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/), Validators.minLength(16), Validators.maxLength(16)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const request: CreateClientRequest = this.clientForm.value;
      
      console.log('Creating client with request:', request);
      console.log('uniqueCode being sent:', request.uniqueCode);
      console.log('Type of uniqueCode:', typeof request.uniqueCode);

      this.clientService.createClient(request).subscribe({
        next: (client) => {
          this.isLoading = false;
          console.log('Client created successfully:', client);
          this.snackBar.open('Cliente creado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating client:', error);
          this.snackBar.open('Error al crear el cliente. Intenta nuevamente.', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/sign-in']);
  }
}