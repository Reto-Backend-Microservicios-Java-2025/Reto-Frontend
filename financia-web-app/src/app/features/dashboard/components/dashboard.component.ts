import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule
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
          <span>Financia App</span>
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
          <div class="dashboard-cards">
            <mat-card class="dashboard-card">
              <mat-card-header>
                <div mat-card-avatar class="card-avatar clients-avatar">
                  <mat-icon>people</mat-icon>
                </div>
                <mat-card-title>Clientes</mat-card-title>
                <mat-card-subtitle>Gestión de clientes</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>Administra la información de tus clientes, crea nuevos registros y consulta sus datos.</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" (click)="navigateTo('/clients')">
                  Ver Clientes
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card">
              <mat-card-header>
                <div mat-card-avatar class="card-avatar products-avatar">
                  <mat-icon>inventory</mat-icon>
                </div>
                <mat-card-title>Productos</mat-card-title>
                <mat-card-subtitle>Gestión de productos</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>Administra tu catálogo de productos, crea nuevos productos y actualiza la información.</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="accent" (click)="navigateTo('/products')">
                  Ver Productos
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card">
              <mat-card-header>
                <div mat-card-avatar class="card-avatar reports-avatar">
                  <mat-icon>analytics</mat-icon>
                </div>
                <mat-card-title>Reportes</mat-card-title>
                <mat-card-subtitle>Análisis y estadísticas</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>Consulta reportes detallados sobre tus clientes y productos para tomar mejores decisiones.</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="warn" disabled>
                  Próximamente
                </button>
              </mat-card-actions>
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

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-card {
      height: 250px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .clients-avatar {
      background-color: #3f51b5;
      color: white;
    }

    .products-avatar {
      background-color: #ff4081;
      color: white;
    }

    .reports-avatar {
      background-color: #f44336;
      color: white;
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    @media (max-width: 768px) {
      .content {
        padding: 10px;
      }
      
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/sign-in']);
  }
}