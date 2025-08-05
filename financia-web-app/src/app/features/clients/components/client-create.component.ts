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
        <mat-toolbar>Menú</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item (click)="navigateTo('/dashboard')" [class.active]="isActiveRoute('/dashboard')">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item (click)="navigateTo('/clients')" [class.active]="isActiveRoute('/clients')">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Clientes</span>
          </a>
          <a mat-list-item (click)="navigateTo('/products')" [class.active]="isActiveRoute('/products')">
            <mat-icon matListItemIcon>inventory</mat-icon>
            <span matListItemTitle>Productos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button type="button" aria-label="Toggle sidenav" mat-icon-button (click)="drawer.toggle()">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>Financia App - Nuevo Cliente</span>
          <span class="spacer"></span>
          <span *ngIf="currentUser">Hola, {{ currentUser.firstName }}</span>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="content">
          <mat-card class="form-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>person_add</mat-icon>
                Crear Nuevo Cliente
              </mat-card-title>
              <mat-card-subtitle>Complete la información del cliente</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="fullName" required>
                    <mat-icon matSuffix>person</mat-icon>
                    <mat-error *ngIf="clientForm.get('fullName')?.hasError('required')">
                      El nombre es requerido
                    </mat-error>
                    <mat-error *ngIf="clientForm.get('fullName')?.hasError('minlength')">
                      El nombre debe tener al menos 2 caracteres
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Apellidos</mat-label>
                    <input matInput formControlName="fullLastName" required>
                    <mat-icon matSuffix>person</mat-icon>
                    <mat-error *ngIf="clientForm.get('fullLastName')?.hasError('required')">
                      Los apellidos son requeridos
                    </mat-error>
                    <mat-error *ngIf="clientForm.get('fullLastName')?.hasError('minlength')">
                      Los apellidos deben tener al menos 2 caracteres
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Tipo de Documento</mat-label>
                    <mat-select formControlName="typeDocument" required>
                      <mat-option value="DNI">DNI</mat-option>
                      <mat-option value="PASSPORT">Pasaporte</mat-option>
                      <mat-option value="CE">Carné de Extranjería</mat-option>
                      <mat-option value="RUC">RUC</mat-option>
                    </mat-select>
                    <mat-error *ngIf="clientForm.get('typeDocument')?.hasError('required')">
                      Seleccione un tipo de documento
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Número de Documento</mat-label>
                    <input matInput formControlName="documentNumber" required>
                    <mat-icon matSuffix>badge</mat-icon>
                    <mat-error *ngIf="clientForm.get('documentNumber')?.hasError('required')">
                      El número de documento es requerido
                    </mat-error>
                    <mat-error *ngIf="clientForm.get('documentNumber')?.hasError('pattern')">
                      Ingrese un número de documento válido
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-actions">
                  <button mat-button type="button" (click)="goBack()">
                    <mat-icon>arrow_back</mat-icon>
                    Cancelar
                  </button>
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="clientForm.invalid || isLoading">
                    <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                    <mat-icon *ngIf="!isLoading">save</mat-icon>
                    <span *ngIf="!isLoading">Crear Cliente</span>
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 200px;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .form-card {
      max-width: 600px;
      margin: 0 auto;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: calc(50% - 8px);
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    @media (max-width: 768px) {
      .content {
        padding: 10px;
      }
      
      .form-row {
        flex-direction: column;
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
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      fullLastName: ['', [Validators.required, Validators.minLength(2)]],
      typeDocument: ['', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z]+$/)]]
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

      this.clientService.createClient(request).subscribe({
        next: (client) => {
          this.isLoading = false;
          this.snackBar.open('Cliente creado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          this.isLoading = false;
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