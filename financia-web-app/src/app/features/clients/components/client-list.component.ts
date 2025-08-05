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
  templateUrl: './client-list.component.html',
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
      color: #ffffff;
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
      color: #ffffff;
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
      color: #ffffff;
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
      justify-content: center;
      margin-bottom: 32px;
      animation: fadeInUp 0.8s ease 0.2s both;
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

    .client-table {
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

    .document-chip, .code-chip {
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

    .details-button {
      color: #00ff88;
    }

    .details-button:hover {
      background: rgba(0, 255, 136, 0.1);
      transform: scale(1.1);
    }

    .products-button {
      color: #ff6b35;
    }

    .products-button:hover {
      background: rgba(255, 107, 53, 0.1);
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
        console.log('Loaded clients:', clients);
        console.log('First client uniqueCode:', clients[0]?.uniqueCode);
        console.log('Type of first client uniqueCode:', typeof clients[0]?.uniqueCode);

        // Log all clients and their uniqueCodes
        clients.forEach((client, index) => {
          console.log(`Client ${index + 1}:`, {
            name: `${client.full_name} ${client.full_last_name}`,
            uniqueCode: client.uniqueCode,
            type: typeof client.uniqueCode,
            id: client.id
          });
        });

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
    console.log('Viewing client details for encrypted code:', uniqueCode);

    // Use the encrypted uniqueCode directly to get client details
    this.clientService.getClientByEncryptedCode(uniqueCode).subscribe({
      next: (client) => {
        console.log('Client details found:', client);
        // Navigate directly to client details page
        this.router.navigate(['/clients', uniqueCode]);
      },
      error: (error) => {
        console.error('Error getting client details:', error);
        this.snackBar.open('Error al obtener detalles del cliente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  viewClientProducts(uniqueCode: string): void {
    // Find the client by uniqueCode to get the ID
    const client = this.clients.find(c => String(c.uniqueCode) === uniqueCode);

    if (!client) {
      console.error('Client not found for uniqueCode:', uniqueCode);
      this.snackBar.open('Cliente no encontrado', 'Cerrar', { duration: 3000 });
      return;
    }

    console.log('Found client:', client);
    console.log('Client ID:', client.id);
    console.log('Client uniqueCode (encrypted):', client.uniqueCode);

    if (!client.id || client.id <= 0) {
      console.error('Invalid client ID:', client.id);
      this.snackBar.open('ID de cliente inválido', 'Cerrar', { duration: 3000 });
      return;
    }

    // Navigate directly using the client ID
    this.router.navigate(['/products'], { queryParams: { clientId: client.id } });
  }

  // Método temporal para probar el endpoint de detalles
  testClientDetails(): void {
    const testEncryptedCode = 'shm/UtMDp4CBtW6OA20cIA==';
    console.log('Testing client details with encrypted code:', testEncryptedCode);

    this.clientService.getClientByEncryptedCode(testEncryptedCode).subscribe({
      next: (client) => {
        console.log('✅ Client details found:', client);
        this.snackBar.open('✅ Cliente encontrado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ Error getting client details:', error);
        this.snackBar.open('❌ Error al obtener detalles del cliente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteClient(client: Client): void {
    if (confirm(`¿Seguro que deseas eliminar al cliente ${client.full_name} ${client.full_last_name}?`)) {
      if (!client.id || client.id <= 0) {
        this.snackBar.open('ID de cliente inválido. No se puede eliminar.', 'Cerrar', { duration: 5000 });
        console.error('Invalid client ID for deletion:', client.id);
        return;
      }

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
