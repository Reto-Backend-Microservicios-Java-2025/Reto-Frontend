import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ClientService } from '../services/client.service';
import { AuthService } from '../../auth/services/auth.service';
import { CreateClientRequest } from '../../../shared/models/client.model';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './client-create.component.html',
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

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      animation: fadeInUp 0.8s ease 0.2s both;
    }

    .client-form {
      background: rgba(26, 26, 26, 0.8);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 255, 136, 0.1);
    }

    .m-label {
      color: #b0b0b0;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: calc(50% - 8px);
    }

    .form-input, .form-select {
      color: #ffffff;
    }

    .field-icon {
      color: #00ff88;
    }

    .error-text {
      color: #ff4757;
      font-size: 0.85rem;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      gap: 16px;
    }

    .cancel-button {
      color: #b0b0b0;
      border: 1px solid #666;
      padding: 12px 24px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .cancel-button:hover {
      color: #e0e0e0;
      border-color: #00ff88;
      background: rgba(0, 255, 136, 0.05);
    }

    .submit-button {
      background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 255, 136, 0.3);
      transition: all 0.3s ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 255, 136, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .button-icon {
      margin-right: 8px;
    }

    .button-text {
      font-weight: 600;
    }

    /* Material Form Field Customization */
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: rgba(0, 255, 136, 0.3);
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field-label {
      color: #b0b0b0;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #00ff88;
    }

    ::ng-deep .mat-select-value {
      color: #333333;
    }

    ::ng-deep .mat-select-arrow {
      color: #00ff88;
    }

    /* Input field styling for better contrast */
    ::ng-deep .mat-form-field .mat-form-field-infix {
      background-color: #ffffff !important;
      border-radius: 4px;
      padding: 8px 12px;
    }

    ::ng-deep .mat-form-field input.mat-input-element {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-form-field textarea.mat-input-element {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-input-element {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-form-field .mat-form-field-infix input {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-form-field input::placeholder {
      color: #666666 !important;
    }

    ::ng-deep .mat-form-field input::-webkit-input-placeholder {
      color: #666666 !important;
    }

    ::ng-deep .mat-form-field input:-moz-placeholder {
      color: #666666 !important;
    }

    ::ng-deep .mat-form-field input:-ms-input-placeholder {
      color: #666666 !important;
    }

    /* Select dropdown styling */
    ::ng-deep .mat-select-panel {
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-option {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-option:hover {
      background-color: #f0f0f0 !important;
      color: #00ff88 !important;
    }

    ::ng-deep .mat-option.mat-selected {
      background-color: #e8f5e8 !important;
      color: #00ff88 !important;
    }

    @media (max-width: 900px) {
      .content {
        padding: 24px 16px;
      }

      .page-title {
        font-size: 2rem;
      }

      .client-form {
        padding: 24px;
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

      .client-form {
        padding: 20px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .half-width {
        width: 100%;
      }

      .form-actions {
        flex-direction: column;
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
export class ClientCreateComponent implements OnInit {
  clientForm: FormGroup;
  isLoading = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      full_last_name: ['', [Validators.required, Validators.minLength(2)]],
      type_document: ['', [Validators.required]],
      number_document: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z]+$/)]],
      uniqueCode: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/), Validators.minLength(16), Validators.maxLength(16)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const request: CreateClientRequest = this.clientForm.value;

      console.log('Creating client with request:', request);
      console.log('uniqueCode being sent:', request.uniqueCode);
      console.log('Type of uniqueCode:', typeof request.uniqueCode);

      this.clientService.createClient(request).subscribe({
        next: (client) => {
          this.isLoading = false;
          console.log('Client created successfully:', client);
          this.snackBar.open('Cliente creado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating client:', error);
          this.snackBar.open('Error al crear el cliente. Intenta nuevamente.', 'Cerrar', { duration: 5000 });
        }
      });
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
