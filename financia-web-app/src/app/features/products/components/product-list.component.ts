import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../services/product.service';
import { ClientService } from '../../clients/services/client.service';
import { AuthService } from '../../auth/services/auth.service';
import { Product } from '../../../shared/models/product.model';
import { ProductEditDialogComponent } from './product-edit-dialog.component';

@Component({
  selector: 'app-product-list',
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
    MatListModule,
    MatDialogModule,
    MatChipsModule
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
          <span>Financia App - Productos</span>
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
                <mat-icon>inventory</mat-icon>
                Lista de Productos
                <mat-chip *ngIf="clientFilter" class="client-filter-chip">
                  Cliente ID: {{ clientFilter }}
                  <button matChipRemove (click)="clearClientFilter()">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              </mat-card-title>
              <div class="spacer"></div>
              <button mat-raised-button color="primary" (click)="openCreateDialog()">
                <mat-icon>add</mat-icon>
                Nuevo Producto
              </button>
            </mat-card-header>

            <mat-card-content>
              <div *ngIf="isLoading" class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Cargando productos...</p>
              </div>

              <div *ngIf="!isLoading && products.length === 0" class="empty-state">
                <mat-icon>inventory_2</mat-icon>
                <h3>No hay productos registrados</h3>
                <p>Comienza agregando tu primer producto</p>
                <button mat-raised-button color="primary" (click)="openCreateDialog()">
                  <mat-icon>add</mat-icon>
                  Crear Producto
                </button>
              </div>

              <div *ngIf="!isLoading && products.length > 0" class="table-container">
                <table mat-table [dataSource]="products" class="mat-elevation-8">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let product">{{ product.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Nombre</th>
                    <td mat-cell *matCellDef="let product">{{ product.name }}</td>
                  </ng-container>

                                    <ng-container matColumnDef="productType">
                     <th mat-header-cell *matHeaderCellDef>Tipo</th>
                     <td mat-cell *matCellDef="let product">
                       {{ product.productType }}
                     </td>
                   </ng-container>

                   <ng-container matColumnDef="balance">
                     <th mat-header-cell *matHeaderCellDef>Saldo</th>
                     <td mat-cell *matCellDef="let product" class="balance-cell">
                       {{ product.balance | currency:'USD':'symbol':'1.2-2' }}
                     </td>
                   </ng-container>

                   <ng-container matColumnDef="clientId">
                     <th mat-header-cell *matHeaderCellDef>Cliente ID</th>
                     <td mat-cell *matCellDef="let product">{{ product.clientId }}</td>
                   </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Acciones</th>
                    <td mat-cell *matCellDef="let product">
                      <button mat-icon-button color="primary" (click)="openEditDialog(product)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteProduct(product.id)">
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
      max-width: 1400px;
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
      flex-wrap: wrap;
    }

    .client-filter-chip {
      margin-left: 16px;
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

    .balance-cell {
      text-align: right;
      font-weight: 500;
      color: #2e7d32;
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'name', 'productType', 'balance', 'clientId', 'actions'];
  isLoading = false;
  currentUser: any = null;
  clientFilter: number | null = null;

  constructor(
    private productService: ProductService,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Check for client filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.clientFilter = +params['clientId'];
      } else if (params['uniqueCode']) {
        // If we have uniqueCode, we need to convert it to clientId
        // For now, we'll use uniqueCode as clientId (assuming they match)
        this.clientFilter = +params['uniqueCode'];
      }
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    
    const loadOperation = this.clientFilter 
      ? this.productService.getProductsByClientId(this.clientFilter)
      : this.productService.getAllProducts();

    loadOperation.subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar los productos', 'Cerrar', { duration: 5000 });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '600px',
      data: { product: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '600px',
      data: { product, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadProducts();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar el producto', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  clearClientFilter(): void {
    this.clientFilter = null;
    this.router.navigate(['/products']);
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