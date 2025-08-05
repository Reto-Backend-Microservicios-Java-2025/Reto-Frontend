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
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .sidenav {
      width: 220px;
      background: #fff;
      box-shadow: 2px 0 8px rgba(0,0,0,0.04);
    }
    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(33,150,243,0.08);
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 24px 8px;
      min-height: calc(100vh - 64px);
      background: transparent;
    }
    .client-details {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
      animation: fadeIn 0.7s;
    }
    .client-info-card, .products-card {
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(33,150,243,0.10), 0 1.5px 4px rgba(0,0,0,0.04);
      background: #fff;
      transition: box-shadow 0.3s;
      animation: fadeIn 0.7s;
    }
    .client-info-card:hover, .products-card:hover {
      box-shadow: 0 8px 32px rgba(33,150,243,0.18), 0 2px 8px rgba(0,0,0,0.08);
    }
    .client-avatar {
      background-color: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      font-size: 28px;
      box-shadow: 0 2px 8px rgba(33,150,243,0.10);
    }
    .client-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 18px;
      margin-top: 16px;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      background-color: #f7fbff;
      box-shadow: 0 1px 4px rgba(33,150,243,0.04);
      transition: box-shadow 0.2s, background 0.2s;
      animation: fadeIn 0.7s;
    }
    .info-item:hover {
      background: #e3f2fd;
      box-shadow: 0 2px 8px rgba(33,150,243,0.10);
    }
    .info-item mat-icon {
      color: #1976d2;
      font-size: 28px;
    }
    .info-item div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .highlight-message {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
      border-radius: 8px;
      padding: 10px 16px;
      margin: 16px 0 0 0;
      font-weight: 500;
      font-size: 16px;
      animation: fadeIn 0.7s;
    }
    .products-card {
      margin-top: 12px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 18px;
      margin-top: 12px;
    }
    .product-card {
      border-left: 4px solid #ff4081;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(255,64,129,0.08);
      transition: box-shadow 0.2s;
      animation: fadeIn 0.7s;
    }
    .product-card:hover {
      box-shadow: 0 4px 16px rgba(255,64,129,0.16);
      background: #fce4ec;
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
    .no-products {
      text-align: center;
      padding: 40px;
      color: #666;
      animation: fadeIn 0.7s;
    }
    .no-products mat-icon {
      font-size: 48px;
      margin-bottom: 16px;
      color: #bdbdbd;
    }
    .mat-chip {
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      padding: 0 10px;
      margin-left: 4px;
      background: linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%);
      color: #1976d2;
      box-shadow: 0 1px 4px rgba(33,150,243,0.04);
    }
    @media (max-width: 900px) {
      .client-details {
        gap: 12px;
      }
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .content {
        padding: 8px 2px;
      }
      .client-info-grid {
        grid-template-columns: 1fr;
      }
      .products-grid {
        grid-template-columns: 1fr;
      }
      .client-info-card, .products-card {
        margin: 0 2px;
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
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
    console.log('Loading client details for encrypted code:', this.encryptedCode);
    
    this.clientService.getClientByEncryptedCode(this.encryptedCode).subscribe({
      next: (client) => {
        this.client = client;
        this.isLoading = false;
        console.log('✅ Loaded client details:', client);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Error loading client details:', error);
        console.error('Encrypted code used:', this.encryptedCode);
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