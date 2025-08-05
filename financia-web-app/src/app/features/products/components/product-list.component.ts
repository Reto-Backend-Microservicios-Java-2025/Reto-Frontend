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
  templateUrl: './product-list.component.html',
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

    .actions-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      animation: fadeInUp 0.8s ease 0.2s both;
    }

    .filter-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .client-filter-chip {
      background: linear-gradient(90deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 140, 66, 0.2) 100%);
      color: #ff6b35;
      border: 1px solid rgba(255, 107, 53, 0.3);
      font-weight: 500;
    }

    .chip-remove {
      color: #ff6b35;
    }

    .create-button {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 255, 136, 0.3);
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .create-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 255, 136, 0.4);
    }

    .table-container {
      background: rgba(26, 26, 26, 0.8);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 255, 136, 0.1);
      animation: fadeInUp 0.8s ease 0.4s both;
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

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #b0b0b0;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #666;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin: 16px 0 8px 0;
      color: #e0e0e0;
    }

    .empty-state p {
      font-size: 1rem;
      margin: 0 0 24px 0;
      color: #b0b0b0;
    }

    .empty-action-button {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
    }

    .product-table {
      width: 100%;
      background: transparent;
      border-radius: 12px;
      overflow: hidden;
    }

    .table-header-row {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
    }

    .table-header {
      color: #000;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 16px 12px;
      text-align: left;
    }

    .table-row {
      background: rgba(42, 42, 42, 0.6);
      transition: all 0.3s ease;
      border-bottom: 1px solid rgba(0, 255, 136, 0.1);
    }

    .table-row:hover {
      background: rgba(0, 255, 136, 0.05);
      transform: scale(1.01);
    }

    .table-cell {
      color: #e0e0e0;
      padding: 16px 12px;
      font-size: 0.9rem;
    }

    .product-type-chip {
      background: linear-gradient(90deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 140, 66, 0.2) 100%);
      color: #ff6b35;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid rgba(255, 107, 53, 0.3);
    }

    .balance-amount {
      color: #00ff88;
      font-weight: 600;
      font-size: 1rem;
    }

    .client-id-chip {
      background: linear-gradient(90deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 204, 102, 0.2) 100%);
      color: #00ff88;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid rgba(0, 255, 136, 0.3);
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .action-button {
      transition: all 0.3s ease;
    }

    .edit-button {
      color: #00ff88;
    }

    .edit-button:hover {
      background: rgba(0, 255, 136, 0.1);
      transform: scale(1.1);
    }

    .delete-button {
      color: #ff4757;
    }

    .delete-button:hover {
      background: rgba(255, 71, 87, 0.1);
      transform: scale(1.1);
    }

    @media (max-width: 900px) {
      .content {
        padding: 24px 16px;
      }
      .page-title {
        font-size: 2rem;
      }
      .actions-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      .table-container {
        padding: 16px;
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
      .table-container {
        padding: 12px;
      }
      .action-buttons {
        flex-direction: column;
        gap: 4px;
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
