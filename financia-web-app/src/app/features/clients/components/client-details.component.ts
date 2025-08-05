import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { AuthService } from '../../auth/services/auth.service';
import { ClientWithProducts } from '../../../shared/models/client.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
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
          <span>Financia App - Detalles Cliente</span>
          <span class="spacer"></span>
          <span *ngIf="currentUser">Hola, {{ currentUser.email }}</span>
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
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Cargando información del cliente...</p>
          </div>

          <div *ngIf="!isLoading && !client" class="error-container">
            <mat-icon>error</mat-icon>
            <h3>Cliente no encontrado</h3>
            <p>No se pudo encontrar la información del cliente solicitado.</p>
            <button mat-raised-button color="primary" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Volver a la lista
            </button>
          </div>

          <div *ngIf="!isLoading && client" class="client-details">
            <!-- Client Information -->
            <mat-card class="client-info-card">
              <mat-card-header>
                <div mat-card-avatar class="client-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <mat-card-title>{{ client.full_name }} {{ client.full_lastName }}</mat-card-title>
                <mat-card-subtitle>Cliente ID: {{ client.id }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="client-info-grid">
                  <div class="info-item">
                    <mat-icon>badge</mat-icon>
                    <div>
                      <strong>Tipo de Documento:</strong>
                      <span><mat-chip color="primary" selected>{{ client.type_document }}</mat-chip></span>
                    </div>
                  </div>
                  <div class="info-item">
                    <mat-icon>numbers</mat-icon>
                    <div>
                      <strong>Número de Documento:</strong>
                      <span>{{ client.number_document }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <mat-icon>fingerprint</mat-icon>
                    <div>
                      <strong>Código Único:</strong>
                      <span><mat-chip color="accent" selected>{{ client.uniqueCode }}</mat-chip></span>
                    </div>
                  </div>
                </div>
                <div *ngIf="client.products && client.products.length > 3" class="highlight-message">
                  <mat-icon color="warn">star</mat-icon>
                  <span>¡Este cliente tiene más de 3 productos asociados!</span>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button (click)="goBack()">
                  <mat-icon>arrow_back</mat-icon>
                  Volver
                </button>
                <button mat-raised-button color="accent" (click)="viewProducts()">
                  <mat-icon>inventory</mat-icon>
                  Ver Productos
                </button>
              </mat-card-actions>
            </mat-card>

            <!-- Products Section -->
            <mat-card class="products-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>inventory</mat-icon>
                  Productos del Cliente
                </mat-card-title>
                <mat-card-subtitle>{{ client.products.length || 0 }} productos encontrados</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div *ngIf="!client.products || client.products.length === 0" class="no-products">
                  <mat-icon>inventory_2</mat-icon>
                  <h4>No hay productos registrados</h4>
                  <p>Este cliente aún no tiene productos asociados.</p>
                </div>

                <div *ngIf="client.products && client.products.length > 0" class="products-grid">
                  <mat-card *ngFor="let product of client.products" class="product-card">
                    <mat-card-header>
                      <mat-card-title>{{ product.name }}</mat-card-title>
                      <mat-card-subtitle>{{ product.productType }}</mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="product-balance">
                        <mat-icon>account_balance</mat-icon>
                        <span class="balance-amount">{{ product.balance | currency:'USD':'symbol':'1.2-2' }}</span>
                      </div>
                    </mat-card-content>
                  </mat-card>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
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

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .client-details {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .client-info-card {
      margin-bottom: 20px;
    }

    .client-avatar {
      background-color: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .client-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #fafafa;
    }

    .info-item mat-icon {
      color: #666;
    }

    .info-item div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .no-products {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-products mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .product-card {
      border-left: 4px solid #ff4081;
    }

    .product-balance {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
      color: #2e7d32;
    }

    .balance-amount {
      font-size: 24px;
      font-weight: bold;
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    .highlight-message {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
      border-radius: 6px;
      padding: 10px 16px;
      margin: 16px 0 0 0;
      font-weight: 500;
      font-size: 16px;
    }

    .code-input-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 24px 0 16px 0;
    }

    @media (max-width: 768px) {
      .content {
        padding: 10px;
      }
      
      .client-info-grid {
        grid-template-columns: 1fr;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ClientDetailsComponent implements OnInit {
  client: ClientWithProducts | null = null;
  isLoading = false;
  currentUser: User | null = null;
  encryptedCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      this.encryptedCode = params['encryptedCode'];
      if (this.encryptedCode) {
        this.loadClientDetails();
      }
    });
  }

  loadClientDetails(): void {
    this.isLoading = true;
    this.clientService.getClientByEncryptedCode(this.encryptedCode).subscribe({
      next: (client) => {
        this.client = client;
        this.isLoading = false;
        console.log('Loaded client details:', client);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading client details:', error);
      }
    });
  }

  viewProducts(): void {
    if (this.client) {
      this.router.navigate(['/products'], { queryParams: { clientId: this.client.id } });
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