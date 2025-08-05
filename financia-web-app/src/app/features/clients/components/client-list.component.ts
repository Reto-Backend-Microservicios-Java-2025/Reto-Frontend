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
                       <button mat-icon-button color="warn" (click)="deleteClient(client)">
                         <mat-icon>delete</mat-icon>
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
    mat-card {
      max-width: 1200px;
      margin: 0 auto 24px auto;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(33,150,243,0.10), 0 1.5px 4px rgba(0,0,0,0.04);
      transition: box-shadow 0.3s;
      background: #fff;
    }
    mat-card:hover {
      box-shadow: 0 8px 32px rgba(33,150,243,0.18), 0 2px 8px rgba(0,0,0,0.08);
    }
    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      border-radius: 18px 18px 0 0;
      background: linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%);
      padding: 16px 24px;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.3rem;
      font-weight: 600;
      color: #1976d2;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
    }
    .empty-state {
      text-align: center;
      color: #888;
      padding: 40px 0;
    }
    .empty-state mat-icon {
      font-size: 48px;
      margin-bottom: 12px;
      color: #90caf9;
    }
    .table-container {
      overflow-x: auto;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(33,150,243,0.06);
      background: #fafbfc;
      padding: 8px 0;
      animation: fadeIn 0.5s;
    }
    table.mat-table {
      min-width: 800px;
      border-radius: 12px;
      background: #fff;
      overflow: hidden;
      animation: fadeIn 0.7s;
    }
    th.mat-header-cell, td.mat-cell {
      padding: 12px 16px;
      font-size: 1rem;
      border-bottom: 1px solid #e3e3e3;
    }
    th.mat-header-cell {
      background: #e3f2fd;
      color: #1976d2;
      font-weight: 700;
    }
    td.mat-cell {
      transition: background 0.2s;
    }
    tr.mat-row:hover td.mat-cell {
      background: #e3f2fd44;
      transition: background 0.2s;
    }
    .mat-icon-button {
      transition: background 0.2s, color 0.2s;
      border-radius: 50%;
      margin: 0 2px;
    }
    .mat-icon-button:hover {
      background: #e3f2fd;
      color: #1976d2;
      transform: scale(1.12);
      box-shadow: 0 2px 8px rgba(33,150,243,0.10);
    }
    .mat-icon-button[color="warn"]:hover {
      background: #ffebee;
      color: #d32f2f;
    }
    .mat-icon-button[color="accent"]:hover {
      background: #fce4ec;
      color: #c2185b;
    }
    @media (max-width: 900px) {
      mat-card {
        margin: 0 4px 24px 4px;
      }
      .table-container {
        padding: 0;
      }
      table.mat-table {
        min-width: 600px;
      }
    }
    @media (max-width: 600px) {
      .content {
        padding: 8px 2px;
      }
      mat-card-header {
        flex-direction: column;
        align-items: flex-start;
        padding: 12px 8px;
      }
      table.mat-table {
        min-width: 400px;
      }
      th.mat-header-cell, td.mat-cell {
        padding: 8px 6px;
        font-size: 0.95rem;
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
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
    this.router.navigate(['/clients/ingresar-codigo'], { queryParams: { encryptedCode: uniqueCode } });
  }

  viewClientProducts(uniqueCode: string): void {
    // For products, we need the actual client ID, not uniqueCode
    // We'll need to get the client details first to get the ID
    const encryptedCode = this.encryptUniqueCode(uniqueCode);
    
    // Get client details to get the actual ID
    this.clientService.getClientByEncryptedCode(encryptedCode).subscribe({
      next: (client) => {
        this.router.navigate(['/products'], { queryParams: { clientId: client.id } });
      },
      error: (error) => {
        console.error('Error getting client details:', error);
        this.snackBar.open('Error al obtener detalles del cliente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteClient(client: Client): void {
    if (confirm(`¿Seguro que deseas eliminar al cliente ${client.full_name} ${client.full_last_name}?`)) {
      if (client.id !== undefined) {
        this.clientService.deleteClient(client.id).subscribe({
          next: () => {
            this.snackBar.open('Cliente eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadClients();
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar el cliente', 'Cerrar', { duration: 5000 });
            console.error('Error deleting client:', error);
          }
        });
      } else {
        // Obtener el id usando el uniqueCode encriptado
        this.clientService.getClientByEncryptedCode(String(client.uniqueCode)).subscribe({
          next: (clientWithProducts) => {
            this.clientService.deleteClient(clientWithProducts.id).subscribe({
              next: () => {
                this.snackBar.open('Cliente eliminado exitosamente', 'Cerrar', { duration: 3000 });
                this.loadClients();
              },
              error: (error) => {
                this.snackBar.open('Error al eliminar el cliente', 'Cerrar', { duration: 5000 });
                console.error('Error deleting client:', error);
              }
            });
          },
          error: (error) => {
            this.snackBar.open('No se pudo obtener el ID del cliente', 'Cerrar', { duration: 5000 });
            console.error('Error fetching client by encryptedCode:', error);
          }
        });
      }
    }
  }

  private encryptUniqueCode(uniqueCode: string | number): string {
    // Simple encryption - in production, this should match your backend encryption
    // For now, we'll just convert to string
    return typeof uniqueCode === 'string' ? uniqueCode : uniqueCode.toString();
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