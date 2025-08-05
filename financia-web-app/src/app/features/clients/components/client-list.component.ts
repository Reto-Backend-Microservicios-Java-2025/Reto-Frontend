import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ClientService } from '../services/client.service';
import { AuthService } from '../../auth/services/auth.service';
import { Client } from '../../../shared/models/client.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
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
          <span>Financia App - Clientes</span>
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
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-icon>people</mat-icon>
                Lista de Clientes
              </mat-card-title>
              <div class="spacer"></div>
              <button mat-raised-button color="primary" (click)="navigateToCreateClient()">
                <mat-icon>add</mat-icon>
                Nuevo Cliente
              </button>
            </mat-card-header>

            <mat-card-content>
              <div *ngIf="isLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Cargando clientes...</p>
              </div>

              <div *ngIf="!isLoading && clients.length === 0" class="empty-state">
                <mat-icon>people_outline</mat-icon>
                <h3>No hay clientes registrados</h3>
                <p>Comienza agregando tu primer cliente</p>
                <button mat-raised-button color="primary" (click)="navigateToCreateClient()">
                  <mat-icon>add</mat-icon>
                  Crear Cliente
                </button>
              </div>

                              <div *ngIf="!isLoading && clients.length > 0" class="table-container">
                 <table mat-table [dataSource]="clients" class="mat-elevation-8">
                   <ng-container matColumnDef="full_name">
                     <th mat-header-cell *matHeaderCellDef>Nombre</th>
                     <td mat-cell *matCellDef="let client">{{ client.full_name }}</td>
                   </ng-container>

                   <ng-container matColumnDef="full_last_name">
                     <th mat-header-cell *matHeaderCellDef>Apellidos</th>
                     <td mat-cell *matCellDef="let client">{{ client.full_last_name }}</td>
                   </ng-container>

                   <ng-container matColumnDef="type_document">
                     <th mat-header-cell *matHeaderCellDef>Tipo Doc.</th>
                     <td mat-cell *matCellDef="let client">{{ client.type_document }}</td>
                   </ng-container>

                   <ng-container matColumnDef="number_document">
                     <th mat-header-cell *matHeaderCellDef>Nº Documento</th>
                     <td mat-cell *matCellDef="let client">{{ client.number_document }}</td>
                   </ng-container>

                   <ng-container matColumnDef="uniqueCode">
                     <th mat-header-cell *matHeaderCellDef>Código Único</th>
                     <td mat-cell *matCellDef="let client">{{ client.uniqueCode }}</td>
                   </ng-container>

                   <ng-container matColumnDef="actions">
                     <th mat-header-cell *matHeaderCellDef>Acciones</th>
                     <td mat-cell *matCellDef="let client">
                       <button mat-icon-button color="primary" (click)="viewClientDetails(client.uniqueCode)">
                         <mat-icon>visibility</mat-icon>
                       </button>
                       <button mat-icon-button color="accent" (click)="viewClientProducts(client.uniqueCode)">
                         <mat-icon>inventory</mat-icon>
                       </button>
                     </td>
                   </ng-container>

                   <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                   <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                 </table>
               </div>
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

    mat-card {
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    @media (max-width: 768px) {
      .content {
        padding: 10px;
      }
      
      mat-card-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
    }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['full_name', 'full_last_name', 'type_document', 'number_document', 'uniqueCode', 'actions'];
  isLoading = false;
  currentUser: any = null;

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar los clientes', 'Cerrar', { duration: 5000 });
      }
    });
  }

  navigateToCreateClient(): void {
    this.router.navigate(['/clients/create']);
  }

  viewClientDetails(uniqueCode: string): void {
    // Navigate to client details using encrypted code
    this.router.navigate(['/clients', uniqueCode]);
  }

  viewClientProducts(uniqueCode: string): void {
    this.router.navigate(['/products'], { queryParams: { uniqueCode } });
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