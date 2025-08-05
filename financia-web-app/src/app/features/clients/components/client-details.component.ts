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
          <span class="toolbar-title">Financia App - Detalles Cliente</span>
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
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner class="loading-spinner"></mat-spinner>
            <p class="loading-text">Cargando información del cliente...</p>
          </div>

          <div *ngIf="!isLoading && !client" class="error-container">
            <mat-icon class="error-icon">error</mat-icon>
            <h3 class="error-title">Cliente no encontrado</h3>
            <p class="error-message">No se pudo encontrar la información del cliente solicitado.</p>
            <button mat-raised-button color="primary" (click)="goBack()" class="error-button">
              <mat-icon>arrow_back</mat-icon>
              Volver a la lista
            </button>
          </div>

          <div *ngIf="!isLoading && client" class="client-details">
            <!-- Client Information -->
            <div class="client-info-card">
              <div class="card-header">
                <div class="client-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="client-title">
                  <h2 class="client-name">{{ client.full_name }} {{ client.fullLastName }}</h2>
                  <p class="client-subtitle">Información del Cliente</p>
                </div>
              </div>

              <div class="client-info-grid">
                <div class="info-item">
                  <mat-icon class="info-icon">badge</mat-icon>
                  <div class="info-content">
                    <span class="info-label">Tipo de Documento</span>
                    <span class="info-value document-chip">{{ client.type_document }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon class="info-icon">description</mat-icon>
                  <div class="info-content">
                    <span class="info-label">Número de Documento</span>
                    <span class="info-value">{{ client.number_document }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon class="info-icon">vpn_key</mat-icon>
                  <div class="info-content">
                    <span class="info-label">Código Único</span>
                    <span class="info-value code-chip">{{ client.uniqueCode }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon class="info-icon">inventory</mat-icon>
                  <div class="info-content">
                    <span class="info-label">Total de Productos</span>
                    <span class="info-value product-count">{{ client.products.length }} productos encontrados</span>
                  </div>
                </div>
              </div>

              <div *ngIf="client.products.length > 3" class="highlight-message">
                <mat-icon class="highlight-icon">star</mat-icon>
                <span>¡Cliente destacado! Tiene más de 3 productos registrados.</span>
              </div>
            </div>

            <!-- Products Section -->
            <div class="products-card">
              <div class="card-header">
                <h3 class="section-title">
                  <mat-icon class="section-icon">inventory</mat-icon>
                  Productos del Cliente
                </h3>
                <button mat-raised-button color="primary" (click)="viewProducts()" class="view-products-button">
                  <mat-icon>visibility</mat-icon>
                  Ver Productos
                </button>
              </div>

              <div *ngIf="client.products.length === 0" class="empty-products">
                <mat-icon class="empty-icon">inventory_2</mat-icon>
                <h4>No hay productos registrados</h4>
                <p>Este cliente aún no tiene productos asociados.</p>
              </div>

              <div *ngIf="client.products.length > 0" class="products-grid">
                <div *ngFor="let product of client.products" class="product-item">
                  <div class="product-header">
                    <mat-icon class="product-icon">account_balance</mat-icon>
                    <span class="product-name">{{ product.name }}</span>
                  </div>
                  <div class="product-details">
                    <span class="product-type">{{ product.productType }}</span>
                    <span class="product-balance">$ {{ product.balance.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
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
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #00ff88;
    }
    
    .loading-spinner {
      margin-bottom: 16px;
    }
    
    .loading-text {
      font-size: 1.1rem;
      color: #b0b0b0;
      margin: 0;
    }
    
    .error-container {
      text-align: center;
      padding: 60px 20px;
      color: #b0b0b0;
    }
    
    .error-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ff4757;
      margin-bottom: 16px;
    }
    
    .error-title {
      font-size: 1.5rem;
      margin: 16px 0 8px 0;
      color: #e0e0e0;
    }
    
    .error-message {
      font-size: 1rem;
      margin: 0 0 24px 0;
      color: #b0b0b0;
    }
    
    .error-button {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
    }
    
    .client-details {
      display: flex;
      flex-direction: column;
      gap: 24px;
      animation: fadeInUp 0.8s ease;
    }
    
    .client-info-card, .products-card {
      background: rgba(26, 26, 26, 0.8);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 255, 136, 0.1);
    }
    
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0, 255, 136, 0.1);
    }
    
    .client-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }
    
    .client-avatar mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #000;
    }
    
    .client-title {
      flex: 1;
    }
    
    .client-name {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 4px 0;
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .client-subtitle {
      font-size: 1rem;
      color: #b0b0b0;
      margin: 0;
    }
    
    .client-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(42, 42, 42, 0.6);
      border-radius: 12px;
      border: 1px solid rgba(0, 255, 136, 0.1);
      transition: all 0.3s ease;
    }
    
    .info-item:hover {
      background: rgba(0, 255, 136, 0.05);
      border-color: rgba(0, 255, 136, 0.3);
      transform: translateY(-2px);
    }
    
    .info-icon {
      color: #00ff88;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }
    
    .info-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .info-label {
      font-size: 0.85rem;
      color: #b0b0b0;
      font-weight: 500;
    }
    
    .info-value {
      font-size: 1rem;
      color: #e0e0e0;
      font-weight: 600;
    }
    
    .document-chip, .code-chip {
      background: linear-gradient(90deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 204, 102, 0.2) 100%);
      color: #00ff88;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid rgba(0, 255, 136, 0.3);
    }
    
    .product-count {
      color: #ff6b35;
      font-weight: 600;
    }
    
    .highlight-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: linear-gradient(90deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
      border-radius: 12px;
      border: 1px solid rgba(255, 107, 53, 0.3);
      color: #ff6b35;
      font-weight: 500;
    }
    
    .highlight-icon {
      color: #ff6b35;
    }
    
    .section-title {
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
    
    .section-icon {
      color: #00ff88;
    }
    
    .view-products-button {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 255, 136, 0.3);
      transition: all 0.3s ease;
    }
    
    .view-products-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
    }
    
    .empty-products {
      text-align: center;
      padding: 40px 20px;
      color: #b0b0b0;
    }
    
    .empty-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #666;
      margin-bottom: 16px;
    }
    
    .empty-products h4 {
      font-size: 1.2rem;
      margin: 16px 0 8px 0;
      color: #e0e0e0;
    }
    
    .empty-products p {
      font-size: 0.9rem;
      margin: 0;
      color: #b0b0b0;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    
    .product-item {
      background: rgba(42, 42, 42, 0.6);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid rgba(0, 255, 136, 0.1);
      transition: all 0.3s ease;
    }
    
    .product-item:hover {
      background: rgba(0, 255, 136, 0.05);
      border-color: rgba(0, 255, 136, 0.3);
      transform: translateY(-2px);
    }
    
    .product-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .product-icon {
      color: #00ff88;
    }
    
    .product-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #e0e0e0;
    }
    
    .product-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .product-type {
      background: linear-gradient(90deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.1) 100%);
      color: #ff6b35;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .product-balance {
      font-size: 1.1rem;
      font-weight: 700;
      color: #00ff88;
    }
    
    @media (max-width: 900px) {
      .content {
        padding: 24px 16px;
      }
      .client-info-grid {
        grid-template-columns: 1fr;
      }
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 600px) {
      .content {
        padding: 16px 8px;
      }
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .client-info-grid {
        grid-template-columns: 1fr;
      }
      .products-grid {
        grid-template-columns: 1fr;
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