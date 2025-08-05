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
  templateUrl: './dashboard.component.html',
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

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
      animation: fadeInUp 0.8s ease 0.2s both;
    }

    .dashboard-card {
      background: rgba(26, 26, 26, 0.8);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 255, 136, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .dashboard-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
    }

    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      border-color: rgba(0, 255, 136, 0.3);
    }

    .clients-card::before {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
    }

    .products-card::before {
      background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .card-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .clients-avatar {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
    }

    .products-avatar {
      background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 100%);
    }

    .card-avatar mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #000;
    }

    .card-title h3 {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #e0e0e0;
    }

    .card-title p {
      font-size: 0.9rem;
      color: #b0b0b0;
      margin: 0;
    }

    .card-content {
      margin-bottom: 20px;
    }

    .card-content p {
      color: #b0b0b0;
      line-height: 1.6;
      margin: 0;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
    }

    .action-button {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 255, 136, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      animation: fadeInUp 0.8s ease 0.4s both;
    }

    .stats-card {
      background: rgba(42, 42, 42, 0.6);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(0, 255, 136, 0.1);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stats-card:hover {
      background: rgba(0, 255, 136, 0.05);
      border-color: rgba(0, 255, 136, 0.3);
      transform: translateY(-2px);
    }

    .stats-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(90deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 204, 102, 0.2) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 255, 136, 0.3);
    }

    .stats-icon mat-icon {
      color: #00ff88;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .stats-content h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #e0e0e0;
    }

    .stats-content p {
      font-size: 0.9rem;
      color: #b0b0b0;
      margin: 0;
      line-height: 1.4;
    }

    @media (max-width: 900px) {
      .content {
        padding: 24px 16px;
      }
      .page-title {
        font-size: 2rem;
      }
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
      .stats-section {
        grid-template-columns: 1fr;
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
      .dashboard-cards {
        gap: 16px;
      }
      .stats-section {
        gap: 16px;
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
