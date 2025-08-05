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
  templateUrl: './client-details.component.html',
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
